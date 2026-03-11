import React, { useState, useEffect } from 'react';
import {
    CheckCircle2, Package, Users,
    DollarSign
} from 'lucide-react';

import taskService from '../../shared/services/taskService';

// Feature Components
import MiniCalendar from '../components/MiniCalendar';
import StatCard from '../components/StatCard';
import BranchUsageChart from '../components/BranchUsageChart';
import DismantleRequestModal from '../components/DismantleRequestModal';

// Styles
import '../styles/AdminDashboard.css';

const AdminDashboard = ({
    stats,
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

    // Live Analytics System
    const [totalMembers, setTotalMembers] = useState(1842);
    const [todayCheckins, setTodayCheckins] = useState(412);
    const [pendingPayments, setPendingPayments] = useState(28);
    const [selectedBranch, setSelectedBranch] = useState('All');

    // Hourly Data Map: 6 AM to 10 PM slots
    const timeSlots = [
        '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
        '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', 
        '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'
    ];

    const branches = ['Colombo', 'Galle', 'Kandy', 'Kurunegala', 'Matara', 'Negombo'];

    // Initialize usage data with realistic baselines
    const [hourlyUsage, setHourlyUsage] = useState(() => {
        return timeSlots.map((time, index) => {
            const entry = { time };
            branches.forEach(branch => {
                // Determine a realistic baseline for the hour
                let baseline = 15 + Math.floor(Math.random() * 10);
                // Peaks
                if ((index >= 12 && index <= 14)) baseline += 40; // Evening peak
                if ((index >= 2 && index <= 4)) baseline += 25;  // Morning peak
                entry[branch] = baseline;
            });
            return entry;
        });
    });

    useEffect(() => {
        const liveEngine = setInterval(() => {
            const eventType = Math.random();
            
            if (eventType > 0.4) {
                // 60% chance: Member Check-in
                const randomBranch = branches[Math.floor(Math.random() * branches.length)];
                const currentHour = new Date().getHours();
                
                // Map current hour to our timeSlots (offset 6)
                let slotIndex = currentHour - 6;
                if (slotIndex < 0) slotIndex = 0;
                if (slotIndex > 16) slotIndex = 16;

                setTodayCheckins(prev => prev + 1);
                setHourlyUsage(prev => {
                    const newUsage = [...prev];
                    newUsage[slotIndex] = {
                        ...newUsage[slotIndex],
                        [randomBranch]: newUsage[slotIndex][randomBranch] + 1
                    };
                    return newUsage;
                });
            } else if (eventType > 0.3) {
                // 10% chance: New Member Registration
                setTotalMembers(prev => prev + 1);
            } else if (eventType > 0.2) {
                // 10% chance: Pending Payment Resolved
                setPendingPayments(prev => Math.max(0, prev - 1));
            }
        }, 3000); // Pulse every 3 seconds for a responsive feel

        return () => clearInterval(liveEngine);
    }, []);

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
                // NEW WORKFLOW: Create Physical Removal Task on Approval
                if (action === 'approve') {
                    const request = dismantleRequests.find(r => r._id === requestId);
                    if (request) {
                        taskService.createTask({
                            request_id: requestId,
                            equipment_name: request.equipmentName || request.machineName,
                            location: request.location || request.branch,
                            remarks: adminComment || 'Dismantle request approved.'
                        });

                        // Notify Staff (Simulation)
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


    // Mock Data for Performance Table
    const performanceData = [
        { branch: 'Colombo City Gym', members: 450, checkins: 120, revenue: '1.2M', issues: 3 },
        { branch: 'Kandy Fitness Center', members: 320, checkins: 85, revenue: '850K', issues: 1 },
        { branch: 'Galle Power Hub', members: 210, checkins: 45, revenue: '450K', issues: 0 },
        { branch: 'Negombo Fitness', members: 180, checkins: 30, revenue: '380K', issues: 2 },
    ];

    return (
        <div className="admin-dashboard">
            <header className="sa-header" style={{ marginBottom: '32px' }}>
                <div className="sa-welcome">
                    <h1 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Hello, <span style={{ color: 'var(--color-red)' }}>{adminName || 'Admin'}</span></h1>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>View and manage gym equipment, facilities, and branch performance.</p>
                </div>
            </header>

            <section className="live-stats-row" style={{ marginBottom: '32px' }}>
                <StatCard label="Total Members" value={totalMembers.toLocaleString()} icon={<Users />} iconBg="rgba(59, 130, 246, 0.1)" iconColor="#3B82F6" />
                <StatCard label="Today Check-ins" value={todayCheckins.toLocaleString()} icon={<CheckCircle2 />} iconBg="rgba(16, 185, 129, 0.1)" iconColor="#10B981" />
                <StatCard label="Pending Payments" value={pendingPayments.toString()} icon={<DollarSign />} iconBg="rgba(239, 68, 68, 0.1)" iconColor="#EF4444" />
                <StatCard label="Total Equipment" value={stats?.total || 186} icon={<Package />} iconBg="rgba(245, 158, 11, 0.1)" iconColor="#F59E0B" />
            </section>

            <div className="branch-grid">
                <main className="sa-analytics-col">
                    <div className="sa-card">
                        <div className="sa-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Branch Hourly Peak Usage</h3>
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
                                        <option key={b} value={b}>{b}</option>
                                    ))}
                                </select>
                                <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94A3B8' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '0 20px 0 20px', marginLeft: 0, height: '300px' }}>
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
