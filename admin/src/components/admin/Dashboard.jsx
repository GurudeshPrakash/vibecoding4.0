import React, { useState } from 'react';
import {
    CheckCircle2,
    Clock,
    Wrench,
    Activity,
    Calendar,
    Package,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
    Users,
    DollarSign,
    ArrowUpRight
} from 'lucide-react';



import '../../style/admin/AdminDashboard.css';

const MiniCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
    const [isYearEditable, setIsYearEditable] = useState(false);
    const [yearInput, setYearInput] = useState('');
    const [activeArrow, setActiveArrow] = useState(null);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const monthNum = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleYearDoubleClick = () => {
        setYearInput(year.toString());
        setIsYearEditable(true);
    };

    const handleYearChange = (e) => {
        setYearInput(e.target.value);
    };

    const handleYearBlur = () => {
        setIsYearEditable(false);
        const parsedYear = parseInt(yearInput, 10);
        if (!isNaN(parsedYear) && parsedYear >= 2016 && parsedYear <= 2035) {
            setCurrentDate(new Date(parsedYear, currentDate.getMonth(), 1));
        }
    };

    const handleYearKeyDown = (e) => {
        if (e.key === 'Enter') handleYearBlur();
    };

    const handleDateDoubleClick = (d) => {
        alert("Add Reminder interaction / UI opening for date: " + d);
    };

    return (
        <div className="mini-calendar">
            <div className="cal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', background: '#ffffff', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                    {/* Month Selector */}
                    <div style={{ position: 'relative' }}>
                        <span
                            onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                            style={{ fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', color: 'var(--color-text)' }}
                        >
                            {monthNames[monthNum]}
                        </span>
                        {isMonthDropdownOpen && (
                            <div style={{
                                position: 'absolute', top: '100%', left: 0, marginTop: '4px',
                                background: '#fff', border: 'none', borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 50,
                                maxHeight: '135px', overflowY: 'auto', minWidth: '110px',
                                padding: '4px 0'
                            }}>
                                {monthNames.map((m, idx) => (
                                    <div
                                        key={m}
                                        onClick={() => {
                                            setCurrentDate(new Date(year, idx, 1));
                                            setIsMonthDropdownOpen(false);
                                        }}
                                        style={{
                                            padding: '8px 12px', fontSize: '0.85rem', cursor: 'pointer',
                                            color: idx === monthNum ? 'var(--color-red)' : '#333',
                                            fontWeight: idx === monthNum ? 700 : 500
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                    >
                                        {m}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Year Selector */}
                    <div>
                        {isYearEditable ? (
                            <input
                                type="text"
                                value={yearInput}
                                onChange={handleYearChange}
                                onBlur={handleYearBlur}
                                onKeyDown={handleYearKeyDown}
                                autoFocus
                                style={{ width: '45px', border: 'none', borderBottom: '1px solid var(--color-red)', background: 'transparent', outline: 'none', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', padding: 0 }}
                            />
                        ) : (
                            <span
                                onDoubleClick={handleYearDoubleClick}
                                style={{ fontWeight: 600, fontSize: '0.8rem', cursor: 'default', color: 'var(--color-text)' }}
                            >
                                {year}
                            </span>
                        )}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                    <ChevronLeft
                        size={18}
                        color={activeArrow === 'left' ? 'var(--color-red)' : 'var(--color-text-dim)'}
                        style={{ cursor: 'pointer', transition: 'color 0.1s' }}
                        onMouseDown={() => setActiveArrow('left')}
                        onMouseUp={() => setActiveArrow(null)}
                        onMouseLeave={() => setActiveArrow(null)}
                        onClick={() => setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1))}
                    />
                    <ChevronRight
                        size={18}
                        color={activeArrow === 'right' ? 'var(--color-red)' : 'var(--color-text-dim)'}
                        style={{ cursor: 'pointer', transition: 'color 0.1s' }}
                        onMouseDown={() => setActiveArrow('right')}
                        onMouseUp={() => setActiveArrow(null)}
                        onMouseLeave={() => setActiveArrow(null)}
                        onClick={() => setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1))}
                    />
                </div>
            </div>
            <div className="cal-grid">
                {days.map((d, i) => <div key={`day-${i}`} className="cal-day-label">{d}</div>)}
                {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} />)}
                {[...Array(daysInMonth)].map((_, i) => {
                    const d = i + 1;
                    return (
                        <div
                            key={d}
                            className="cal-date"
                            onDoubleClick={() => handleDateDoubleClick(d)}
                            style={{ cursor: 'pointer', fontSize: '0.75rem' }}
                        >
                            {d}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const AdminDashboard = ({ stats, adminName, recentInventory = [], dismantleRequests = [], setDismantleRequests, refreshInventory, userRole = 'admin' }) => {
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
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`http://localhost:5000/api/equipment/requests/${requestId}/${action}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ comment: adminComment || (action === 'approve' ? 'Approved by Admin' : 'Rejected by Admin') })
            });

            if (response.ok) {
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
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}><Users /></div>
                    <div className="card-data">
                        <span className="label">Total Members</span>
                        <h2 className="value">1,240</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}><Activity /></div>
                    <div className="card-data">
                        <span className="label">Active Members</span>
                        <h2 className="value">950</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><CheckCircle2 /></div>
                    <div className="card-data">
                        <span className="label">Today Check-ins</span>
                        <h2 className="value">345</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}><Package /></div>
                    <div className="card-data">
                        <span className="label">Total Equipment</span>
                        <h2 className="value">{stats?.total || 145}</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' }}><Wrench /></div>
                    <div className="card-data">
                        <span className="label">Equipment Under Maintenance</span>
                        <h2 className="value">{stats?.maintenance || 6}</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}><DollarSign /></div>
                    <div className="card-data">
                        <span className="label">Pending Payments</span>
                        <h2 className="value">14</h2>
                    </div>
                </div>
            </section>

            <div className="branch-grid">
                <main className="sa-analytics-col">
                    <div className="sa-card">
                        <div className="sa-card-header">
                            <h3>Branch Performance</h3>
                        </div>
                        <div className="sa-table-container">
                            <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)', background: '#F9FAFB' }}>
                                        <th style={{ padding: '12px 24px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Branch Name</th>
                                        <th style={{ padding: '12px 24px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Total Members</th>
                                        <th style={{ padding: '12px 24px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Today Check-ins</th>
                                        <th style={{ padding: '12px 24px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Revenue (LKR)</th>
                                        <th style={{ padding: '12px 24px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase', textAlign: 'center' }}>Equipment Issues</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { branch: 'Colombo City Gym', members: 450, checkins: 120, revenue: '1.2M', issues: 3 },
                                        { branch: 'Kandy Fitness Center', members: 320, checkins: 85, revenue: '850K', issues: 1 },
                                        { branch: 'Galle Power Hub', members: 210, checkins: 45, revenue: '450K', issues: 0 },
                                        { branch: 'Negombo Fitness', members: 180, checkins: 30, revenue: '380K', issues: 2 },
                                    ].map((row, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text)' }}>{row.branch}</td>
                                            <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 600 }}>{row.members}</td>
                                            <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 600 }}>{row.checkins}</td>
                                            <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 600, color: '#10B981' }}>{row.revenue}</td>
                                            <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 600, color: row.issues > 0 ? '#EF4444' : '#10B981', textAlign: 'center' }}>{row.issues}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
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

            {/* Review Modal */}
            {selectedRequest && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-container dismantle-review-modal">
                        <div className="admin-modal-header">
                            <div>
                                <h2>Review Dismantle Request</h2>
                                <p>Requested on {new Date(selectedRequest.createdAt).toLocaleDateString()} by {selectedRequest.staffName}</p>
                            </div>
                            <button className="close-modal-btn" onClick={() => setSelectedRequest(null)}>&times;</button>
                        </div>

                        <div className="admin-modal-body">
                            <div className="review-grid">
                                <div className="review-details">
                                    <div className="detail-item">
                                        <label>Equipment Details</label>
                                        <div className="asset-box">
                                            <strong>{selectedRequest.equipmentName}</strong>
                                            <span>ID: {selectedRequest.equipmentCustomId}</span>
                                            <span>Branch: {selectedRequest.branch}</span>
                                        </div>
                                    </div>

                                    <div className="detail-item">
                                        <label>Manager's Reason</label>
                                        <p className="reason-text-full">{selectedRequest.reason}</p>
                                    </div>

                                    <div className="detail-item">
                                        <label>Admin Decision Comment</label>
                                        <textarea
                                            placeholder="Add a comment for the branch manager..."
                                            value={adminComment}
                                            onChange={(e) => setAdminComment(e.target.value)}
                                            rows="3"
                                        />
                                    </div>
                                </div>

                                <div className="review-media">
                                    <label>Evidence / Condition Photo</label>
                                    <div className="evidence-photo-box">
                                        <img src={selectedRequest.photo} alt="Condition Evidence" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="admin-modal-footer">
                            <button className="btn-secondary" onClick={() => setSelectedRequest(null)} disabled={isProcessing}>Close</button>
                            <div className="action-btns">
                                <button
                                    className="btn-reject"
                                    onClick={() => handleAction(selectedRequest._id, 'reject')}
                                    disabled={isProcessing || isRestricted}
                                    style={{ opacity: isRestricted ? 0.5 : 1, cursor: isRestricted ? 'not-allowed' : 'pointer' }}
                                    title={isRestricted ? "Restricted: Admin Only" : ""}
                                >
                                    Reject Request
                                </button>
                                <button
                                    className="btn-approve"
                                    onClick={() => handleAction(selectedRequest._id, 'approve')}
                                    disabled={isProcessing || isRestricted}
                                    style={{ opacity: isRestricted ? 0.5 : 1, cursor: isRestricted ? 'not-allowed' : 'pointer' }}
                                    title={isRestricted ? "Restricted: Admin Only" : ""}
                                >
                                    {isProcessing ? 'Processing...' : 'Approve Dismantle'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
