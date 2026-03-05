import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckCircle2,
    Clock,
    Wrench,
    Activity,
    Calendar,
    ArrowUpRight,
    Package,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
    Zap,
    Users,
    DollarSign,
    CreditCard
} from 'lucide-react';
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';


import '../../style/AdminDashboard.css';

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
    const navigate = useNavigate();
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

    const peakHoursData = [
        { hour: '6am', count: 45 },
        { hour: '9am', count: 120 },
        { hour: '12pm', count: 85 },
        { hour: '3pm', count: 95 },
        { hour: '6pm', count: 180 },
        { hour: '9pm', count: 110 },
    ];



    return (
        <div className="admin-dashboard">
            <header className="sa-header" style={{ marginBottom: '32px' }}>
                <div className="sa-welcome">
                    <h1>Branch Terminal</h1>
                    <p>Facility operations and asset monitoring live</p>
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
                        <span className="label">Branch Members</span>
                        <h2 className="value">1,240</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}><Activity /></div>
                    <div className="card-data">
                        <span className="label">Active on Floor</span>
                        <h2 className="value">42</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><Zap /></div>
                    <div className="card-data">
                        <span className="label">Staff on Duty</span>
                        <h2 className="value">08</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}><Package /></div>
                    <div className="card-data">
                        <span className="label">Facility Health</span>
                        <h2 className="value">{((stats.good / stats.total) * 100 || 92).toFixed(0)}%</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' }}><DollarSign /></div>
                    <div className="card-data">
                        <span className="label">MTD Revenue</span>
                        <h2 className="value">LKR 5.2M</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}><CreditCard /></div>
                    <div className="card-data">
                        <span className="label">Pending Fees</span>
                        <h2 className="value">14</h2>
                    </div>
                </div>
            </section>

            <div className="branch-grid">
                <main className="sa-analytics-col">
                    <div className="sa-card" style={{ minHeight: '350px' }}>
                        <div className="sa-card-header">
                            <h3>Branch Performance Dynamics</h3>
                            <div style={{ display: 'flex', gap: '12px', fontSize: '0.7rem', fontWeight: 700 }}>
                                <span style={{ color: '#3B82F6' }}>● Peak Hours</span>
                                <span style={{ color: '#10B981' }}>● Revenue</span>
                            </div>
                        </div>
                        <div style={{ height: '240px', width: '100%', minHeight: '0' }}>
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                <ComposedChart data={peakHoursData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.05)' }} />
                                    <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={30} />
                                    <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="sa-card">
                        <div className="sa-card-header">
                            <h3>Recent Branch Events</h3>
                        </div>
                        <div className="sa-activity-feed">
                            {recentInventory.slice(0, 5).map(item => (
                                <div key={item.id} className="sa-activity-item" style={{ borderBottom: '1px solid #F1F5F9', padding: '16px 0' }}>
                                    <div className="sa-activity-icon" style={{ background: 'rgba(239, 68, 68, 0.05)' }}>
                                        <Package size={18} color="#EF4444" />
                                    </div>
                                    <div className="sa-activity-info">
                                        <p style={{ color: '#1E293B', fontSize: '0.82rem' }}><strong>{item.name}</strong> status updated to <strong>{item.status}</strong></p>
                                        <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>{item.area} Center</span>
                                    </div>
                                    <ChevronRight size={16} color="#CBD5E1" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="sa-card">
                        <div className="sa-card-header">
                            <h3>Pending Dismantle Requests</h3>
                        </div>
                        <div className="sa-activity-feed" style={{ padding: '0 16px' }}>
                            {dismantleRequests.length === 0 ? (
                                <p style={{ color: '#64748B', fontSize: '0.78rem', padding: '16px 0' }}>No pending dismantle requests.</p>
                            ) : (
                                dismantleRequests.map(req => (
                                    <div key={req._id} className="request-card-v2">
                                        <div className="request-header-v2">
                                            <div className="asset-meta">
                                                <h4>{req.equipmentName}</h4>
                                                <span className="asset-id">{req.equipmentCustomId || 'No ID'}</span>
                                            </div>
                                            <button className="review-btn-v2" onClick={() => setSelectedRequest(req)}>
                                                Review Request <ArrowUpRight size={14} />
                                            </button>
                                        </div>
                                        <div className="request-body-v2">
                                            <div className="staff-info">
                                                <Clock size={14} />
                                                <span>Requested by <strong>{req.staffName}</strong> • {new Date(req.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="reason-preview">{req.reason}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </main>

                <aside className="sa-sidebar-col">
                    <MiniCalendar />

                    <div className="sa-card">
                        <div className="sa-card-header">
                            <h3>Quick Terminal</h3>
                        </div>
                        <div className="branch-quick-actions">
                            <button className="action-btn-light" onClick={() => navigate('/admin/owners')}><Users size={20} /> Staff</button>
                            <button className="action-btn-light"><Wrench size={20} /> Log Fault</button>
                            <button className="action-btn-light"><Calendar size={20} /> Check-in</button>
                            <button className="action-btn-light"><Zap size={20} /> Notify</button>
                        </div>
                    </div>

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

                    <div className="branch-info-pill">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '12px', background: '#334155', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{adminName.charAt(0)}</div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '0.85rem' }}>{adminName}</h4>
                                <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>Administrator</span>
                            </div>
                        </div>
                        <div style={{ padding: '12px 14px', background: '#FFFFFF', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 700 }}>
                            <span style={{ color: '#94A3B8' }}>Logic Engine:</span>
                            <span style={{ color: '#10B981' }}>Synchronized</span>
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
