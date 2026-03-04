import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Clock, Download, Filter, Search, Shield, MapPin, Activity, User, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import '../../style/AdminDashboard.css';

const ActivityLogs = ({ onViewLog }) => {
    const [logs, setLogs] = useState(() => {
        const saved = localStorage.getItem('mock_activity_logs_db');
        return saved ? JSON.parse(saved) : [];
    });
    const [isLoading, setIsLoading] = useState(!localStorage.getItem('mock_activity_logs_db'));
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchLogs = async () => {
            if (logs.length === 0) setIsLoading(true);
=======
import { Clock, Download, Filter, Search, Shield, MapPin, Activity, User, ExternalLink } from 'lucide-react';
import '../../style/AdminDashboard.css';

const ActivityLogs = ({ onViewLog }) => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
>>>>>>> main
            try {
                const token = localStorage.getItem('admin_token');
                const response = await fetch('http://localhost:5000/api/admin/staff-logs', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
<<<<<<< HEAD
                if (response.ok) {
                    setLogs(data);
                    localStorage.setItem('mock_activity_logs_db', JSON.stringify(data));
                }
            } catch (error) {
                console.warn('Backend reachability issue, using mock logs:', error.message);
                const savedMock = localStorage.getItem('mock_activity_logs_db');
                if (savedMock) {
                    setLogs(JSON.parse(savedMock));
                } else {
                    const defaultMocks = [
                        { _id: 's1', staffName: 'Prakash Gurudesh', staffEmail: 'prakash@fitpro.lk', branch: 'Power World – Colombo', loginTimestamp: new Date(Date.now() - 4 * 3600000).toISOString(), logoutTimestamp: null, status: 'Active' },
                        { _id: 's2', staffName: 'Sarah Perera', staffEmail: 'sarah@powerworld.com', branch: 'Power World – Kandy', loginTimestamp: new Date(Date.now() - 24 * 3600000).toISOString(), logoutTimestamp: new Date(Date.now() - 16 * 3600000).toISOString(), status: 'Completed' },
                        { _id: 's3', staffName: 'Kamal Silva', staffEmail: 'kamal@vibecoding.lk', branch: 'Power World – Galle', loginTimestamp: new Date(Date.now() - 36 * 3600000).toISOString(), logoutTimestamp: new Date(Date.now() - 32 * 3600000).toISOString(), status: 'Completed' },
                        { _id: 's4', staffName: 'Prakash Gurudesh', staffEmail: 'prakash@fitpro.lk', branch: 'Power World – Colombo', loginTimestamp: new Date(Date.now() - 48 * 3600000).toISOString(), logoutTimestamp: new Date(Date.now() - 40 * 3600000).toISOString(), status: 'Completed' },
                        { _id: 's5', staffName: 'Sarah Perera', staffEmail: 'sarah@powerworld.com', branch: 'Power World – Kandy', loginTimestamp: new Date(Date.now() - 72 * 3600000).toISOString(), logoutTimestamp: new Date(Date.now() - 64 * 3600000).toISOString(), status: 'Completed' },
                        { _id: 's6', staffName: 'Amila Rajapaksha', staffEmail: 'amila@gymnetwork.lk', branch: 'Power World – Colombo', loginTimestamp: new Date(Date.now() - 96 * 3600000).toISOString(), logoutTimestamp: new Date(Date.now() - 88 * 3600000).toISOString(), status: 'Completed' },
                        { _id: 's7', staffName: 'Kamal Silva', staffEmail: 'kamal@vibecoding.lk', branch: 'Power World – Galle', loginTimestamp: new Date(Date.now() - 120 * 3600000).toISOString(), logoutTimestamp: new Date(Date.now() - 110 * 3600000).toISOString(), status: 'Completed' }
                    ];
                    setLogs(defaultMocks);
                    localStorage.setItem('mock_activity_logs_db', JSON.stringify(defaultMocks));
                }
=======
                if (response.ok) setLogs(data);
            } catch (error) {
                console.error('Fetch logs error:', error);
>>>>>>> main
            } finally {
                setIsLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(l =>
        l.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.branch.toLowerCase().includes(searchTerm.toLowerCase())
    );

<<<<<<< HEAD
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const paginatedLogs = filteredLogs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="admin-dashboard">
            <header className="sa-header">
                <div className="sa-welcome">
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        Session History
                    </h1>
                    <p style={{ marginTop: '4px' }}>Manage and monitor all attendance sessions.</p>
                </div>

                <div className="sa-actions">
                    <div className="sa-search-bar" style={{ width: '350px' }}>
                        <Search className="sa-search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Find manager or branch..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
=======
    return (
        <div className="admin-dashboard">
            <header className="dashboard-header-flex">
                <div className="header-left">
                    <h1>Session <span className="highlight-red">History</span></h1>
                    <p className="subtitle">Real-time attendance tracking and manager presence records</p>
                </div>

                <div className="header-right-actions">
                    <div className="search-box-container" style={{ minWidth: '300px' }}>
                        <Search className="search-icon-inside" size={18} />
                        <input
                            type="text"
                            placeholder="Filter by Name or Branch"
                            className="dynamic-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '10px 15px 10px 40px' }}
>>>>>>> main
                        />
                    </div>
                </div>
            </header>

<<<<<<< HEAD
            <div className="sa-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <div className="sa-table-container">
                    <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--color-red)' }}>
                                <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>No</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Manager / Identity</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Branch</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Login Time</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Logout Time</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>Duration</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', textAlign: 'right' }}>Status</th>
=======
            <div className="activity-log-section card">
                <div className="log-table-container">
                    <table className="log-table">
                        <thead>
                            <tr>
                                <th>Manager / Identity</th>
                                <th>Branch</th>
                                <th>Login Time</th>
                                <th>Logout Time</th>
                                <th>Duration</th>
                                <th style={{ textAlign: 'right' }}>Status</th>
>>>>>>> main
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '100px' }}>
                                        <div className="loading-spinner"></div>
                                        <p style={{ marginTop: '16px', color: 'var(--color-text-dim)' }}>Accessing session records...</p>
                                    </td>
                                </tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '80px', color: 'var(--color-text-dim)' }}>
                                        No activity records found matching your filters.
                                    </td>
                                </tr>
                            ) : (
<<<<<<< HEAD
                                paginatedLogs.map((log, index) => {
                                    const serialNo = (currentPage - 1) * itemsPerPage + index + 1;
=======
                                filteredLogs.map((log) => {
>>>>>>> main
                                    const duration = log.logoutTimestamp
                                        ? Math.floor((new Date(log.logoutTimestamp) - new Date(log.loginTimestamp)) / (1000 * 60))
                                        : Math.floor((new Date() - new Date(log.loginTimestamp)) / (1000 * 60));

                                    return (
                                        <tr
                                            key={log._id}
                                            onClick={() => onViewLog && onViewLog(log._id)}
<<<<<<< HEAD
                                            style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s', cursor: 'pointer' }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.01)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-dim)' }}>
                                                {String(serialNo).padStart(2, '0')}
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: 36, height: 36, borderRadius: '100%', background: 'rgba(255,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <User size={18} color="var(--color-red)" />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{log.staffName}</div>
                                                        <div style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem', fontWeight: 600 }}>{log.staffEmail}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 700 }}>
                                                <span style={{ background: 'rgba(0,0,0,0.05)', padding: '4px 10px', borderRadius: '6px' }}>{log.branch}</span>
                                            </td>
                                            <td style={{ padding: '16px 24px', color: 'var(--color-text-dim)', fontSize: '0.85rem', fontWeight: 600 }}>
=======
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div className="user-avatar-mini">
                                                        <User size={16} />
                                                    </div>
                                                    <div>
                                                        <div className="name-bold">{log.staffName}</div>
                                                        <div style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem' }}>{log.staffEmail}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="branch-tag">{log.branch}</span>
                                            </td>
                                            <td style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem' }}>
>>>>>>> main
                                                {new Date(log.loginTimestamp).toLocaleString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
<<<<<<< HEAD
                                            <td style={{ padding: '16px 24px', color: 'var(--color-text-dim)', fontSize: '0.85rem', fontWeight: 600 }}>
=======
                                            <td style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem' }}>
>>>>>>> main
                                                {log.logoutTimestamp ? new Date(log.logoutTimestamp).toLocaleString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
<<<<<<< HEAD
                                                }) : <span style={{ color: 'var(--color-red)', fontWeight: 800, fontSize: '0.7rem' }}>● IN SESSION</span>}
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700 }}>
                                                    <Clock size={14} color="var(--color-red)" />
                                                    {duration >= 60 ? `${Math.floor(duration / 60)}h ${duration % 60}m` : `${duration}m`}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: log.status === 'Active' ? '#10B981' : '#666' }} />
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: log.status === 'Active' ? '#10B981' : 'var(--color-text-dim)' }}>
                                                        {log.status === 'Active' ? 'Live Now' : 'Completed'}
                                                    </span>
=======
                                                }) : <span className="active-pulse-text">In Session</span>}
                                            </td>
                                            <td>
                                                <div className="duration-pill">
                                                    <Clock size={12} style={{ marginRight: '6px' }} />
                                                    {duration >= 60 ? `${Math.floor(duration / 60)}h ${duration % 60}m` : `${duration}m`}
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div className="status-cell" style={{ justifyContent: 'flex-end', color: log.status === 'Active' ? '#10B981' : 'var(--color-text-dim)' }}>
                                                    <div className="dot" style={{ background: log.status === 'Active' ? '#10B981' : '#666' }} />
                                                    {log.status === 'Active' ? 'Live Now' : 'Completed'}
>>>>>>> main
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
<<<<<<< HEAD

                {totalPages > 1 && (
                    <div className="pagination-container">
                        <button
                            className="pagination-btn"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="pagination-info">Page {currentPage} of {totalPages}</span>
                        <button
                            className="pagination-btn"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
=======
>>>>>>> main
            </div>
        </div>
    );
};

export default ActivityLogs;
