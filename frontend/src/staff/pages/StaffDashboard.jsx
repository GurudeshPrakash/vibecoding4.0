/**
 * @module StaffModule
 * @status STABLE - LOCKED
 * @description This module is development-complete. Avoid modifications unless specifically requested.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, Activity, CheckSquare, DollarSign, Clock,
    UserCheck, CheckCircle2, Wrench, AlertTriangle,
    Download, FileText, ChevronRight
} from 'lucide-react';
import '../styles/StaffDashboard.css';
import taskService from '../../shared/services/taskService';
import pdfService from '../../shared/services/pdfService';

const StaffDashboard = ({ setActiveTab, inventoryData = [], stats = {} }) => {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState(inventoryData.length > 0 ? inventoryData : []);
    const [checkinCount, setCheckinCount] = useState(0);
    const [pendingPaymentsCount, setPendingPaymentsCount] = useState(18);
    const [removalTasks, setRemovalTasks] = useState([]);

    // Initial load and dynamic updates
    useEffect(() => {
        // Today Check-ins Logic
        const todayStr = new Date().toISOString().split('T')[0];
        const lastCheckinDate = localStorage.getItem('dev_checkin_date');
        let currentCheckins = parseInt(localStorage.getItem('dev_today_checkins') || '124');

        if (lastCheckinDate !== todayStr) {
            currentCheckins = 0; // Midnight reset
            localStorage.setItem('dev_checkin_date', todayStr);
            localStorage.setItem('dev_today_checkins', '0');
        }
        setCheckinCount(currentCheckins);

        // Removal Tasks Logic
        setRemovalTasks(taskService.getPendingTasks());

        // Pending Payments Logic
        const payments = parseInt(localStorage.getItem('dev_pending_payments') || '18');
        setPendingPaymentsCount(payments);

        // Equipment Stats Logic
        const rawInventory = inventoryData.length > 0 ? inventoryData : [];
        const overrides = JSON.parse(localStorage.getItem('dev_status_overrides') || '{}');

        const updatedInventory = rawInventory.map(item => {
            const id = item.id || item._id;
            const status = overrides[id] || item.status || 'Good';
            return { ...item, status };
        });

        setInventory(updatedInventory);
    }, [inventoryData]);

    const handleCompleteTask = async (taskId) => {
        const staffUser = JSON.parse(sessionStorage.getItem('admin_user') || '{}');
        const staffName = `${staffUser.firstName || ''} ${staffUser.lastName || ''}`.trim() || 'Staff User';

        if (window.confirm('Confirm Physical Removal: Has this equipment been physically removed and verified?')) {
            await taskService.completeTask(taskId, staffName);
            setRemovalTasks(taskService.getPendingTasks());
            alert('Task completed and removal report generated successfully.');
        }
    };


    const handleNavigation = (tab) => {
        if (setActiveTab) {
            setActiveTab(tab);
        } else {
            navigate(`/staff/${tab}`);
        }
    };

    const moreBtnStyle = {
        background: '#EF4444',
        color: 'white',
        border: 'none',
        padding: '3px 10px',
        borderRadius: '4px',
        fontSize: '0.65rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
        minWidth: '50px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    };

    const todayCheckins = [
        { no: 1, id: 'M-1024', name: 'Arjun Perera', arrival: '08:15 AM', leave: '09:40 AM', status: 'Completed' },
        { no: 2, id: 'M-1056', name: 'Sarah Mendis', arrival: '08:45 AM', leave: '10:00 AM', status: 'Completed' },
        { no: 3, id: 'M-1089', name: 'Dilshan Silva', arrival: '09:05 AM', leave: '--', status: 'Active' },
        { no: 4, id: 'M-1102', name: 'Anjali Gunawardena', arrival: '09:30 AM', leave: '--', status: 'Active' },
        { no: 5, id: 'M-1115', name: 'Kasun Rajapaksa', arrival: '10:00 AM', leave: '11:15 AM', status: 'Completed' },
    ];

    const expiringMembers = [
        { id: 'M-1115', name: 'Kasun Rajapaksa', start: '2025-02-10', expire: '2026-02-10', status: 'Expired' },
        { id: 'M-1120', name: 'Lakmini Silva', start: '2025-02-28', expire: '2026-02-28', status: 'Expired' },
        { id: 'M-1102', name: 'Anjali Gunawardena', start: '2025-03-05', expire: '2026-03-05', status: 'Expiring Soon' },
    ];

    const pendingPaymentsList = [
        { id: 'M-1130', name: 'Damith Perera', amount: 'LKR 12,000', due: '2026-03-01', status: 'Overdue' },
        { id: 'M-1089', name: 'Dilshan Silva', amount: 'LKR 12,000', due: '2026-03-03', status: 'Overdue' },
    ];

    return (
        <div className="admin-dashboard">
            <header className="sa-header" style={{ marginBottom: '32px' }}>
                <div className="sa-welcome">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h1>Dashboard</h1>
                        <span style={{ 
                            background: 'rgba(239, 68, 68, 0.1)', 
                            color: '#EF4444', 
                            fontSize: '0.65rem', 
                            padding: '4px 12px', 
                            borderRadius: '100px', 
                            fontWeight: '800',
                            letterSpacing: '0.05em',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}>GALLE BRANCH</span>
                    </div>
                    <p>Welcome to your daily shift overview. Have a great day!</p>
                </div>
            </header>

            <section className="sa-summary-grid" style={{ marginBottom: '32px', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}><Users size={20} /></div>
                    <div className="card-data">
                        <span className="label">Total Members</span>
                        <h2 className="value">842</h2>
                    </div>
                </div>

                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><UserCheck size={20} /></div>
                    <div className="card-data">
                        <span className="label">Today Check-ins</span>
                        <h2 className="value">{checkinCount}</h2>
                    </div>
                </div>

                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED' }}><CheckSquare size={20} /></div>
                    <div className="card-data">
                        <span className="label">Total Equipment</span>
                        <h2 className="value">{inventory.filter(i => i.status === 'Good' || i.status === 'Available').length}</h2>
                    </div>
                </div>
            </section>

            {/* Physical Equipment Removal Tasks (Urgent/Active) */}
            {removalTasks.length > 0 && (
                <div className="sa-card animate-pop-in" style={{ marginBottom: '32px', border: '2px solid #10B981', background: '#F0FDF4' }}>
                    <div className="sa-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #DCFCE7' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ padding: '8px', background: '#10B981', borderRadius: '8px', color: '#fff' }}>
                                <Wrench size={20} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem', color: '#064E3B', fontWeight: 800 }}>Physical Removal Tasks</h3>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Your request has been approved. You can now proceed with the physical equipment removal.</p>
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
                                    <th style={{ padding: '12px 8px' }}>Approved By</th>
                                    <th style={{ padding: '12px 8px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {removalTasks.map((task) => (
                                    <tr key={task.task_id} style={{ borderBottom: '1px solid #DCFCE7' }}>
                                        <td style={{ padding: '16px 8px', color: '#065F46', fontSize: '0.75rem', fontWeight: '700' }}>{task.task_id}</td>
                                        <td style={{ padding: '16px 8px', fontWeight: '800', color: '#064E3B', fontSize: '0.8rem' }}>{task.equipment_name}</td>
                                        <td style={{ padding: '16px 8px', color: '#059669', fontSize: '0.75rem', fontWeight: '600' }}>{task.location}</td>
                                        <td style={{ padding: '16px 8px', color: '#059669', fontSize: '0.75rem', fontWeight: '600' }}>{task.approved_by}</td>
                                        <td style={{ padding: '16px 8px' }}>
                                            <button
                                                onClick={() => handleCompleteTask(task.task_id)}
                                                style={{ padding: '8px 16px', borderRadius: '8px', background: '#10B981', color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
                                            >
                                                Mark as Completed
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div className="sa-card">
                    <div className="sa-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: '800' }}>Recent Check-ins</h3>
                        <button onClick={() => handleNavigation('members')} style={moreBtnStyle}>More</button>
                    </div>
                    <div className="table-responsive" style={{ padding: '0 20px 20px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.65rem', textTransform: 'uppercase', textAlign: 'left', fontWeight: '800' }}>
                                    <th style={{ padding: '12px 8px' }}>Name</th>
                                    <th style={{ padding: '12px 8px' }}>Arrival</th>
                                    <th style={{ padding: '12px 8px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {todayCheckins.map((checkin, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td style={{ padding: '12px 8px', fontWeight: '700', color: '#1E293B', fontSize: '0.75rem' }}>{checkin.name}</td>
                                        <td style={{ padding: '12px 8px', color: '#64748B', fontSize: '0.75rem' }}>{checkin.arrival}</td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                fontSize: '0.65rem',
                                                fontWeight: '800',
                                                background: checkin.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: checkin.status === 'Completed' ? '#10B981' : '#EF4444'
                                            }}>{checkin.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="sa-card">
                    <h3 style={{ padding: '20px 20px 10px', fontSize: '0.85rem', fontWeight: '800' }}>Quick Alerts</h3>
                    <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {expiringMembers.map((member, idx) => (
                            <div key={idx} style={{ padding: '12px', background: '#FEF2F2', borderRadius: '10px', border: '1px solid #FEE2E2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#991B1B' }}>{member.name}</div>
                                    <div style={{ fontSize: '0.65rem', color: '#B91C1C' }}>Membership Expired</div>
                                </div>
                                <AlertTriangle size={14} color="#EF4444" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};


export default StaffDashboard;
