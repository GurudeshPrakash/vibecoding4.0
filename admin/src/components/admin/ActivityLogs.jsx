import React, { useState, useEffect } from 'react';
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
    const pageSize = 10;

    useEffect(() => {
        const fetchLogs = async () => {
            if (logs.length === 0) setIsLoading(true);
            try {
                const token = localStorage.getItem('admin_token');
                const response = await fetch('http://localhost:5000/api/admin/staff-logs', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
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

    const totalPages = Math.ceil(filteredLogs.length / pageSize);
    const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="admin-dashboard">
            <header className="sa-header">
                <div className="sa-welcome">
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.2rem' }}>
                        Session History
                    </h1>
                    <p style={{ marginTop: '4px', fontSize: '0.78rem' }}>Manage and monitor all attendance sessions.</p>
                </div>

                <div className="header-right-actions">
                    <div className="search-box-container" style={{ minWidth: '300px' }}>
                        <Search className="search-icon-inside" size={18} />
                        <input
                            type="text"
                            placeholder="Filter by Name or Branch"
                            className="dynamic-search-input"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            style={{ padding: '8px 15px 8px 40px', fontSize: '0.75rem' }}
                        />
                    </div>
                </div>
            </header>

            <div className="activity-log-section card" style={{ padding: '0', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                <div className="log-table-container">
                    <table className="log-table">
                        <thead>
                            <tr style={{ background: 'var(--color-red)' }}>
                                <th style={{ padding: '12px 20px', fontSize: '0.7rem', color: 'white' }}>MANAGER / IDENTITY</th>
                                <th style={{ padding: '12px 20px', fontSize: '0.7rem', color: 'white' }}>BRANCH</th>
                                <th style={{ padding: '12px 20px', fontSize: '0.7rem', color: 'white' }}>LOGIN TIME</th>
                                <th style={{ padding: '12px 20px', fontSize: '0.7rem', color: 'white' }}>LOGOUT TIME</th>
                                <th style={{ padding: '12px 20px', fontSize: '0.7rem', color: 'white' }}>DURATION</th>
                                <th style={{ padding: '12px 20px', fontSize: '0.7rem', color: 'white', textAlign: 'right' }}>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '100px' }}>
                                        <div className="loading-spinner"></div>
                                        <p style={{ marginTop: '16px', color: 'var(--color-text-dim)', fontSize: '0.8rem' }}>Accessing session records...</p>
                                    </td>
                                </tr>
                            ) : paginatedLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '80px', color: 'var(--color-text-dim)', fontSize: '0.8rem' }}>
                                        No activity records found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                paginatedLogs.map((log) => {
                                    const duration = log.logoutTimestamp
                                        ? Math.floor((new Date(log.logoutTimestamp) - new Date(log.loginTimestamp)) / (1000 * 60))
                                        : Math.floor((new Date() - new Date(log.loginTimestamp)) / (1000 * 60));

                                    return (
                                        <tr
                                            key={log._id}
                                            onClick={() => onViewLog && onViewLog(log._id)}
                                            style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s', cursor: 'pointer' }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.01)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={{ padding: '12px 20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: 32, height: 32, borderRadius: '100%', background: 'rgba(255,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <User size={16} color="var(--color-red)" />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: '0.75rem' }}>{log.staffName}</div>
                                                        <div style={{ color: 'var(--color-text-dim)', fontSize: '0.65rem', fontWeight: 600 }}>{log.staffEmail}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px 20px', fontSize: '0.7rem', fontWeight: 700 }}>
                                                <span style={{ background: 'rgba(0,0,0,0.05)', padding: '4px 10px', borderRadius: '6px' }}>{log.branch}</span>
                                            </td>
                                            <td style={{ padding: '12px 20px', color: 'var(--color-text-dim)', fontSize: '0.7rem' }}>
                                                {new Date(log.loginTimestamp).toLocaleString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td style={{ padding: '12px 20px', color: 'var(--color-text-dim)', fontSize: '0.7rem' }}>
                                                {log.logoutTimestamp ? new Date(log.logoutTimestamp).toLocaleString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }) : <span style={{ color: 'var(--color-red)', fontWeight: 800, fontSize: '0.65rem' }}>● IN SESSION</span>}
                                            </td>
                                            <td style={{ padding: '12px 20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 700 }}>
                                                    <Clock size={12} color="var(--color-red)" />
                                                    {duration >= 60 ? `${Math.floor(duration / 60)}h ${duration % 60}m` : `${duration}m`}
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: log.status === 'Active' ? '#10B981' : '#666' }} />
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: log.status === 'Active' ? '#10B981' : 'var(--color-text-dim)' }}>
                                                        {log.status === 'Active' ? 'Live Now' : 'Completed'}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', borderTop: '1px solid var(--border-color)' }}>
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            style={{ background: 'none', border: 'none', cursor: currentPage === 1 ? 'default' : 'pointer', color: currentPage === 1 ? '#ccc' : 'var(--color-red)' }}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            style={{ background: 'none', border: 'none', cursor: currentPage === totalPages ? 'default' : 'pointer', color: currentPage === totalPages ? '#ccc' : 'var(--color-red)' }}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityLogs;
