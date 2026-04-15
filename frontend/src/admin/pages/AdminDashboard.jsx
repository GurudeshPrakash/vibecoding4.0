import React, { useState, useEffect } from 'react';
import {
    CheckCircle2, Package, Users,
    DollarSign, AlertTriangle
} from 'lucide-react';

import taskService from '../../shared/services/taskService';

// Feature Components
import MiniCalendar from '../components/MiniCalendar';
import StatCard from '../components/StatCard';
import BranchUsageChart from '../components/BranchUsageChart';
import DismantleRequestModal from '../components/DismantleRequestModal';

// Styles
import '../styles/AdminDashboard.css';

// ─── Static Constants (Outside component to prevent re-render loops) ──────────
// ─── Static Constants ────────────────────────────────────────────────────────
const TIME_SLOTS = [
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', 
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'
];

const AdminDashboard = ({
    adminName,
    recentInventory = [],
    dismantleRequests = [],
    setDismantleRequests,
    refreshInventory,
    userRole = 'admin'
}) => {
    const isRestricted = userRole === 'staff';
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [adminComment, setAdminComment] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // ─── Dashboard State ──────────────────────────────────────────────────
    const [selectedBranch, setSelectedBranch] = useState('All');
    const [branches, setBranches] = useState([]);
    const [allMembers, setAllMembers] = useState([]);
    const [allEquipment, setAllEquipment] = useState([]);
    
    const [totalMembers, setTotalMembers] = useState(0);
    const [todayCheckins, setTodayCheckins] = useState(0);
    const [pendingPayments, setPendingPayments] = useState(0);
    const [inventoryStats, setInventoryStats] = useState({ total: 0, maintenance: 0, damaged: 0 });

    const fetchData = async () => {
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
                setAllEquipment(eData);
                setAllMembers(mData);
                
                updateFilteredStats('All', bData, eData, mData);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        }
    };

    const updateFilteredStats = (branchName, currentBranches, currentEquipment, currentMembers) => {
        let filteredEq = currentEquipment;
        let filteredMem = currentMembers;

        if (branchName !== 'All') {
            const branch = currentBranches.find(b => b.name === branchName);
            if (branch) {
                const bId = branch._id || branch.id;
                filteredEq = currentEquipment.filter(e => e.branchId === bId);
                filteredMem = currentMembers.filter(m => m.branchId === bId);
            }
        }

        setInventoryStats({
            total: filteredEq.length,
            maintenance: filteredEq.filter(i => i.status === 'Maintenance').length,
            damaged: filteredEq.filter(i => i.status === 'Damaged' || i.status === 'Dismantled').length
        });

        setTotalMembers(filteredMem.length);
        setTodayCheckins(0); // Placeholder
        setPendingPayments(0); // Placeholder
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (branches.length > 0) {
            updateFilteredStats(selectedBranch, branches, allEquipment, allMembers);
        }
    }, [selectedBranch]);

    // Initialize usage data with low baselines to represent "Today's" data
    const [hourlyUsage, setHourlyUsage] = useState([]);

    useEffect(() => {
        if (branches.length > 0) {
            const currentHour = new Date().getHours();
            let cumulativeData = {};
            const branchNames = branches.map(b => b.name);
            branchNames.forEach(b => cumulativeData[b] = 0);

            const initialUsage = TIME_SLOTS.map((time, index) => {
                const entry = { time };
                const slotHour = 6 + index;
                
                branchNames.forEach(branch => {
                    if (slotHour <= currentHour) {
                        const randomGain = Math.floor(Math.random() * 5) + 3; 
                        cumulativeData[branch] += randomGain;
                    }
                    entry[branch] = cumulativeData[branch];
                });
                return entry;
            });
            setHourlyUsage(initialUsage);
        }
    }, [branches]);

    useEffect(() => {
        if (branches.length === 0 || hourlyUsage.length === 0) return;

        const liveEngine = setInterval(() => {
            const eventType = Math.random();
            if (eventType > 0.4) {
                const branchNames = branches.map(b => b.name);
                const randomBranch = branchNames[Math.floor(Math.random() * branchNames.length)];
                const currentHour = new Date().getHours();
                let slotIndex = currentHour - 6;
                if (slotIndex < 0) slotIndex = 0;
                if (slotIndex > 16) slotIndex = 16;

                setHourlyUsage(prev => {
                    if (prev.length === 0) return prev;
                    const newUsage = [...prev];
                    for (let i = slotIndex; i < newUsage.length; i++) {
                        newUsage[i] = {
                            ...newUsage[i],
                            [randomBranch]: (newUsage[i][randomBranch] || 0) + 1
                        };
                    }
                    return newUsage;
                });

                if (selectedBranch === 'All' || selectedBranch === randomBranch) {
                    setTodayCheckins(prev => prev + 1);
                }
            } else if (eventType > 0.3) {
                if (selectedBranch === 'All') setTotalMembers(prev => prev + 1);
            }
        }, 3000);
        return () => clearInterval(liveEngine);
    }, [selectedBranch, branches, hourlyUsage.length]);

    const handleAction = async (requestId, action) => {
        if (isRestricted) {
            alert("Restricted: Staff members cannot perform administrative actions.");
            return;
        }
        try {
            setIsProcessing(true);
            const token = sessionStorage.getItem('admin_token');
            const response = await fetch(`http://localhost:5000/api/equipment/requests/${requestId}/${action}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ comment: adminComment || (action === 'approve' ? 'Approved by Admin' : 'Rejected by Admin') })
            });

            if (response.ok) {
                if (action === 'approve') {
                    const request = dismantleRequests.find(r => r._id === requestId);
                    if (request) {
                        taskService.createTask({
                            request_id: requestId,
                            machineId: request.machineId || request.machine_id,
                            equipment_name: request.equipmentName || request.machineName,
                            location: request.location || request.branch,
                            remarks: adminComment || 'Dismantle request approved.'
                        });

                        const staffNotif = {
                            id: `NOTIF-STF-DIS-${Date.now()}`,
                            type: 'Inventory',
                            priority: 'High',
                            recipientEmail: 'staff@gym.com',
                            status: 'Approved',
                            title: 'Dismantle Approved',
                            action: `Your dismantle request for ${request.equipmentName || requestId} has been approved. Proceed with physical removal.`,
                            time: 'Just now',
                            timestamp: new Date().toISOString(),
                            unread: true,
                            isAuthNotif: true
                        };
                        const devNotifs = JSON.parse(localStorage.getItem('dev_notifications') || '[]');
                        localStorage.setItem('dev_notifications', JSON.stringify([staffNotif, ...devNotifs]));
                    }
                }

                alert(`Successfully ${action}d dismantle request.`);
                setDismantleRequests(prev => prev.filter(r => r._id !== requestId));
                setSelectedRequest(null);
                setAdminComment('');
                if (action === 'approve' && refreshInventory) {
                    refreshInventory();
                }
            }
        } catch (error) {
            console.error('Action error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="admin-dashboard">
            <header className="sa-header" style={{ marginBottom: '32px' }}>
                <div className="sa-welcome">
                    <h1 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Hello, <span style={{ color: 'var(--color-red)' }}>{adminName || 'Admin'}</span></h1>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Viewing <span style={{ fontWeight: 800, color: 'var(--color-red)' }}>{selectedBranch === 'All' ? 'All Branches' : `${selectedBranch} Branch`}</span> overview.</p>
                </div>
            </header>

            <section className="live-stats-row" style={{ marginBottom: '32px' }}>
                <StatCard label="Total Members" value={totalMembers.toLocaleString()} icon={<Users />} iconBg="rgba(59, 130, 246, 0.1)" iconColor="#3B82F6" />
                <StatCard label="Today Check-ins" value={todayCheckins.toLocaleString()} icon={<CheckCircle2 />} iconBg="rgba(16, 185, 129, 0.1)" iconColor="#10B981" />
                <StatCard label="Damaged Equipment" value={inventoryStats.damaged.toString()} icon={<AlertTriangle />} iconBg="rgba(239, 68, 68, 0.1)" iconColor="#EF4444" />
                <StatCard label="Total Equipment" value={inventoryStats.total.toString()} icon={<Package />} iconBg="rgba(245, 158, 11, 0.1)" iconColor="#F59E0B" />
            </section>

            <div className="branch-grid">
                <main className="sa-analytics-col">
                    <div className="sa-card">
                        <div className="sa-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '20px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Branch Hourly Peak Usage</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Graph based on Today's Check-in counts per time slot.</p>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <select 
                                    value={selectedBranch}
                                    onChange={(e) => setSelectedBranch(e.target.value)}
                                    style={{
                                        appearance: 'none',
                                        padding: '10px 42px 10px 20px',
                                        borderRadius: '12px',
                                        border: '1px solid #E2E8F0',
                                        background: '#fff',
                                        fontSize: '0.85rem',
                                        fontWeight: 800,
                                        color: '#475569',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}
                                >
                                    <option value="All">All Branches</option>
                                    {branches.map(b => (
                                        <option key={b._id || b.id} value={b.name}>{b.name}</option>
                                    ))}
                                </select>
                                <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94A3B8' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                </div>
                            </div>
                        </div>
                        <div style={{ width: '100%', height: '320px' }}>
                            <BranchUsageChart selectedBranch={selectedBranch} liveData={hourlyUsage} />
                        </div>
                    </div>
                </main>

                <aside className="sa-sidebar-col">
                    <MiniCalendar />
                </aside>
            </div>

            <DismantleRequestModal
                request={selectedRequest}
                onClose={() => setSelectedRequest(null)}
                adminComment={adminComment}
                setAdminComment={setAdminComment}
                handleAction={handleAction}
                isProcessing={isProcessing}
                isRestricted={isRestricted}
            />
        </div>
    );
};

export default AdminDashboard;
