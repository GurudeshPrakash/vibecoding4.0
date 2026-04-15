/**
 * @module StaffModule
 * @status STABLE - UPDATED
 * @description This module provides the daily shift overview for staff members, filtered by branch.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, Activity, CheckSquare, DollarSign, Clock,
    UserCheck, CheckCircle2, Wrench, AlertTriangle,
    Download, FileText, ChevronRight, Phone
} from 'lucide-react';
import '../styles/StaffDashboard.css';
import taskService from '../../shared/services/taskService';
import { ADMIN_BRANCHES } from '../../admin/constants/mockData';

const StaffDashboard = ({ setActiveTab }) => {
    const navigate = useNavigate();
    
    // ─── Auth/Branch Context ───────────────────────────────────────────────
    const staffUser = JSON.parse(sessionStorage.getItem('admin_user') || '{}');
    const branchId = staffUser.branchId || '';

    // ─── State ─────────────────────────────────────────────────────────────
    const [branches, setBranches] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalMembers: 0,
        todayCheckins: 0,
        totalEquipment: 0,
        inMaintenance: 0,
        damagedEquipment: 0,
        pendingPayments: 0
    });
    const [removalTasks, setRemovalTasks] = useState([]);

    const activeBranch = branches.find(b => b._id === branchId || b.id === branchId);
    const branchName = activeBranch?.name || 'Your Branch';

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('admin_token') || localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [bRes, eRes, mRes] = await Promise.all([
                fetch('http://localhost:5000/api/admin/branches', { headers }),
                fetch('http://localhost:5000/api/equipment', { headers }),
                fetch('http://localhost:5000/api/members', { headers })
            ]);

            if (bRes.ok && eRes.ok && mRes.ok) {
                const bData = await bRes.json();
                const eData = await eRes.json();
                const mData = await mRes.json();

                setBranches(bData);
                
                const branchInventory = eData.filter(item => item.branchId === branchId);
                const branchMembers = mData.filter(m => m.branchId === branchId);

                setInventory(branchInventory);
                setMembers(branchMembers);

                setStats({
                    totalMembers: branchMembers.length,
                    todayCheckins: 0, // Placeholder until Checkin API implemented
                    totalEquipment: branchInventory.length,
                    inMaintenance: branchInventory.filter(i => i.status === 'Maintenance').length,
                    damagedEquipment: branchInventory.filter(i => i.status === 'Damaged' || i.status === 'Dismantled').length,
                    pendingPayments: 0 // Placeholder until Payments API implemented
                });

                setRemovalTasks(taskService.getPendingTasks().filter(t => t.location === branchName || t.location === branchId));
            }
        } catch (error) {
            console.error('Dashboard data fetch failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [branchId]);

    const handleCompleteTask = async (taskId) => {
        const staffName = `${staffUser.firstName || ''} ${staffUser.lastName || ''}`.trim() || 'Staff User';
        if (window.confirm('Confirm Physical Removal: Has this equipment been physically removed and verified?')) {
            const result = await taskService.completeTask(taskId, staffName);
            
            if (result && result.task && result.task.machineId) {
                // Remove from Inventory DB permanently
                const rawInventory = JSON.parse(localStorage.getItem('admin_inventory_db') || '[]');
                const updatedInv = rawInventory.filter(item => (item.id || item._id) !== result.task.machineId);
                localStorage.setItem('admin_inventory_db', JSON.stringify(updatedInv));

                // Clear overrides for this item
                const overrides = JSON.parse(localStorage.getItem('dev_status_overrides') || '{}');
                delete overrides[result.task.machineId];
                localStorage.setItem('dev_status_overrides', JSON.stringify(overrides));
            }

            setRemovalTasks(taskService.getPendingTasks().filter(t => t.location === branchName || t.location === branchId));
            alert('Equipment physically removed and records updated successfully.');
        }
    };

    const handleNavigation = (tab) => {
        if (setActiveTab) {
            setActiveTab(tab);
        } else {
            navigate(`/staff/${tab}`);
        }
    };

    // ─── Table Data ───────────────────────────────────────────────────────
    const todayCheckins = [
        { id: 'M-1024', name: 'Arjun Perera', arrival: '08:15 AM', leave: '09:40 AM', phone: '077 123 4567', status: 'OUT' },
        { id: 'M-1056', name: 'Sarah Mendis', arrival: '08:45 AM', leave: '10:00 AM', phone: '071 234 5678', status: 'OUT' },
        { id: 'M-1089', name: 'Dilshan Silva', arrival: '09:05 AM', leave: '--', phone: '076 345 6789', status: 'IN' },
        { id: 'M-1102', name: 'Anjali Gunwardena', arrival: '09:30 AM', leave: '--', phone: '072 456 7890', status: 'IN' },
        { id: 'M-1115', name: 'Kasun Rajapaksa', arrival: '10:00 AM', leave: '11:15 AM', phone: '075 567 8901', status: 'OUT' },
        { id: 'M-1128', name: 'Nirosha Fernando', arrival: '10:30 AM', leave: '--', phone: '070 678 9012', status: 'IN' },
        { id: 'M-1142', name: 'Damith Perera', arrival: '11:00 AM', leave: '12:30 PM', phone: '077 789 0123', status: 'OUT' },
    ];

    const alerts = [
        { type: 'Inventory', title: 'TM-002 Service Due', message: 'Treadmill requires monthly lubrication.', target: 'inventory' },
        { type: 'Payment', title: 'Overdue: Dilshan Silva', message: 'Monthly membership expired 3 days ago.', target: 'payments' },
        { type: 'Maintenance', title: 'EB-001 Inspection', message: 'Stationary bike noise reported by member.', target: 'inventory' },
        { type: 'Member', title: 'M-1115 Expired', message: 'Kasun Rajapaksa membership needs renewal.', target: 'members' },
    ];

    return (
        <div className="admin-dashboard">
            <header className="sa-header" style={{ marginBottom: '32px' }}>
                <div className="sa-welcome">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h1>Dashboard Overview</h1>
                        <span style={{ 
                            background: 'rgba(239, 68, 68, 0.1)', 
                            color: '#EF4444', 
                            fontSize: '0.65rem', 
                            padding: '4px 14px', 
                            borderRadius: '100px', 
                            fontWeight: '800',
                            letterSpacing: '0.05em',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            textTransform: 'uppercase'
                        }}>{branchName}</span>
                    </div>
                    <p>Real-time branch statistics and member activities.</p>
                </div>
            </header>

            {/* 1. Quick Cards Section (6 Cards) */}
            <section className="sa-summary-grid" style={{ marginBottom: '32px', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}><Users size={20} /></div>
                    <div className="card-data">
                        <span className="label">Total Members</span>
                        <h2 className="value">{stats.totalMembers}</h2>
                    </div>
                </div>

                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><UserCheck size={20} /></div>
                    <div className="card-data">
                        <span className="label">Today Check-ins</span>
                        <h2 className="value">{stats.todayCheckins}</h2>
                    </div>
                </div>

                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED' }}><CheckSquare size={20} /></div>
                    <div className="card-data">
                        <span className="label">Total Equipment</span>
                        <h2 className="value">{stats.totalEquipment}</h2>
                    </div>
                </div>

                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}><Wrench size={20} /></div>
                    <div className="card-data">
                        <span className="label">In Maintenance</span>
                        <h2 className="value">{stats.inMaintenance}</h2>
                    </div>
                </div>

                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}><AlertTriangle size={20} /></div>
                    <div className="card-data">
                        <span className="label">Damaged Equipment</span>
                        <h2 className="value">{stats.damagedEquipment}</h2>
                    </div>
                </div>

                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><DollarSign size={20} /></div>
                    <div className="card-data">
                        <span className="label">Pending Payments</span>
                        <h2 className="value">{stats.pendingPayments}</h2>
                    </div>
                </div>
            </section>

            {/* Removal Tasks Section */}
            {removalTasks.length > 0 && (
                <div className="sa-card animate-pop-in" style={{ marginBottom: '32px', border: '2px solid #10B981', background: '#F0FDF4' }}>
                    <div className="sa-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #DCFCE7' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ padding: '8px', background: '#10B981', borderRadius: '8px', color: '#fff' }}>
                                <Wrench size={20} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem', color: '#064E3B', fontWeight: 800 }}>Physical Removal Tasks</h3>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Your request has been approved. Proceed with physical equipment removal.</p>
                            </div>
                        </div>
                    </div>
                    <div className="table-responsive" style={{ padding: '20px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #DCFCE7', color: '#059669', fontSize: '0.7rem', textTransform: 'uppercase', textAlign: 'left', fontWeight: '800' }}>
                                    <th style={{ padding: '12px 8px' }}>Task ID</th>
                                    <th style={{ padding: '12px 8px' }}>Equipment</th>
                                    <th style={{ padding: '12px 8px' }}>Location</th>
                                    <th style={{ padding: '12px 8px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {removalTasks.map((task) => (
                                    <tr key={task.task_id} style={{ borderBottom: '1px solid #DCFCE7' }}>
                                        <td style={{ padding: '16px 8px', color: '#065F46', fontSize: '0.75rem', fontWeight: '700' }}>{task.task_id}</td>
                                        <td style={{ padding: '16px 8px', fontWeight: '800', color: '#064E3B', fontSize: '0.8rem' }}>{task.equipment_name}</td>
                                        <td style={{ padding: '16px 8px', color: '#059669', fontSize: '0.75rem', fontWeight: '600' }}>{task.location}</td>
                                        <td style={{ padding: '16px 8px' }}>
                                            <button
                                                onClick={() => handleCompleteTask(task.task_id)}
                                                style={{ padding: '8px 16px', borderRadius: '8px', background: '#10B981', color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
                                            >
                                                Complete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 2. Recent Check-ins (Full Width) */}
            <div className="sa-card animate-pop-in" style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
                <div className="sa-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0 16px' }}>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: '800' }}>Recent Check-ins</h3>
                    <button 
                        onClick={() => handleNavigation('members')} 
                        className="btn-see-all"
                        style={{
                            background: 'var(--color-red)',
                            color: 'white',
                            border: 'none',
                            padding: '8px 18px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 10px rgba(239, 68, 68, 0.2)'
                        }}
                    >
                        See All
                    </button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', maxHeight: '400px', paddingRight: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
                            <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.65rem', textTransform: 'uppercase', textAlign: 'left', fontWeight: '800' }}>
                                <th style={{ padding: '12px 8px' }}>Member ID</th>
                                <th style={{ padding: '12px 8px' }}>Name</th>
                                <th style={{ padding: '12px 8px' }}>Arrival</th>
                                <th style={{ padding: '12px 8px' }}>Leave</th>
                                <th style={{ padding: '12px 8px' }}>Phone</th>
                                <th style={{ padding: '12px 8px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todayCheckins.map((checkin, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                    <td style={{ padding: '12px 8px', color: '#64748B', fontSize: '0.72rem', fontWeight: '600' }}>{checkin.id}</td>
                                    <td style={{ padding: '12px 8px', fontWeight: '800', color: '#1E293B', fontSize: '0.75rem' }}>{checkin.name}</td>
                                    <td style={{ padding: '12px 8px', color: '#64748B', fontSize: '0.75rem', fontWeight: '600' }}>{checkin.arrival}</td>
                                    <td style={{ padding: '12px 8px', color: '#64748B', fontSize: '0.75rem', fontWeight: '600' }}>{checkin.leave}</td>
                                    <td style={{ padding: '12px 8px', color: '#1E293B', fontSize: '0.72rem', fontWeight: '700' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Phone size={10} color="#FF0000" />
                                            {checkin.phone}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 8px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.65rem',
                                            fontWeight: '800',
                                            background: checkin.status === 'IN' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: checkin.status === 'IN' ? '#10B981' : '#EF4444',
                                            display: 'inline-block',
                                            width: '45px',
                                            textAlign: 'center'
                                        }}>{checkin.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 3. Quick Alerts (Below Check-ins) */}
            <div className="sa-card animate-pop-in" style={{ display: 'flex', flexDirection: 'column', marginBottom: '32px' }}>
                <div className="sa-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0 16px' }}>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: '800' }}>Quick Alerts</h3>
                    <button 
                        onClick={() => handleNavigation('inventory')} 
                        className="btn-see-all"
                        style={{
                            background: 'var(--color-red)',
                            color: 'white',
                            border: 'none',
                            padding: '8px 18px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 10px rgba(239, 68, 68, 0.2)'
                        }}
                    >
                        See All
                    </button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', maxHeight: '350px', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {alerts.map((alert, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => handleNavigation(alert.target)}
                            style={{ 
                                padding: '14px', 
                                background: '#FEF2F2', 
                                borderRadius: '16px', 
                                border: '1px solid #FEE2E2', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ padding: '8px', background: '#FF0000', borderRadius: '10px', color: '#fff' }}>
                                    {alert.type === 'Inventory' || alert.type === 'Maintenance' ? <Wrench size={16} /> : <AlertTriangle size={16} />}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#991B1B' }}>{alert.title}</div>
                                    <div style={{ fontSize: '0.65rem', color: '#B91C1C', fontWeight: '600', marginTop: '2px' }}>{alert.message}</div>
                                </div>
                            </div>
                            <ChevronRight size={14} color="#EF4444" />
                        </div>
                    ))}
                    {alerts.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                            <CheckCircle2 size={32} style={{ opacity: 0.3, marginBottom: '10px' }} />
                            <p style={{ fontSize: '0.75rem', fontWeight: '700' }}>All clear! No urgent alerts.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default StaffDashboard;
