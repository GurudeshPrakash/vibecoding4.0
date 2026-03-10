import React, { useState } from 'react';
import {
    CheckCircle2, Clock, Wrench, Activity,
    Calendar, Package, AlertTriangle, Users,
    DollarSign
} from 'lucide-react';

import taskService from '../../shared/services/taskService';

// Feature Components
import MiniCalendar from '../components/MiniCalendar';
import StatCard from '../components/StatCard';
import BranchPerformanceTable from '../components/BranchPerformanceTable';
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
                    <h1>Dashboard</h1>
                    <p>View and manage all gym equipment, facilities, and maintenance status.</p>
                </div>
                <div className="sa-actions">
                    <div className="date-time-display">
                        <Calendar size={18} />
                        <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </div>
            </header>

            <section className="sa-summary-grid" style={{ marginBottom: '32px' }}>
                <StatCard label="Total Members" value="1,240" icon={<Users />} iconBg="rgba(59, 130, 246, 0.1)" iconColor="#3B82F6" />
                <StatCard label="Active Members" value="950" icon={<Activity />} iconBg="rgba(239, 68, 68, 0.1)" iconColor="#EF4444" />
                <StatCard label="Today Check-ins" value="345" icon={<CheckCircle2 />} iconBg="rgba(16, 185, 129, 0.1)" iconColor="#10B981" />
                <StatCard label="Total Equipment" value={stats?.total || 145} icon={<Package />} iconBg="rgba(245, 158, 11, 0.1)" iconColor="#F59E0B" />
                <StatCard label="In Maintenance" value={stats?.maintenance || 6} icon={<Wrench />} iconBg="rgba(139, 92, 246, 0.1)" iconColor="#8B5CF6" />
                <StatCard label="Pending Payments" value="14" icon={<DollarSign />} iconBg="rgba(239, 68, 68, 0.1)" iconColor="#EF4444" />
            </section>

            <div className="branch-grid">
                <main className="sa-analytics-col">
                    <BranchPerformanceTable data={performanceData} />
                </main>

                <aside className="sa-sidebar-col">
                    <MiniCalendar />

                    <div className="sa-card">
                        <div className="sa-card-header">
                            <h3>Branch Alerts</h3>
                        </div>
                        <div className="alerts-stack">
                            <div className="alert-item-branch">
                                <AlertTriangle size={20} color="#EF4444" />
                                <div>
                                    <span style={{ fontWeight: 800, fontSize: '0.78rem' }}>3 Assets Need Repair</span>
                                    <p style={{ margin: 0, fontSize: '0.62rem', color: '#64748B' }}>Dismantle requests pending</p>
                                </div>
                            </div>
                            <div className="alert-item-branch warning">
                                <Clock size={20} color="#F59E0B" />
                                <div>
                                    <span style={{ fontWeight: 800, fontSize: '0.78rem' }}>14 Fees Overdue</span>
                                    <p style={{ margin: 0, fontSize: '0.62rem', color: '#64748B' }}>Follow up required</p>
                                </div>
                            </div>
                        </div>
                    </div>
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
