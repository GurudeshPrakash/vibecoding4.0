import React, { useState, useEffect } from 'react';
import { Clock, Download, Filter, Search, Shield, MapPin, Activity, User, ExternalLink } from 'lucide-react';
import '../../style/AdminDashboard.css';

const ActivityLogs = ({ onViewLog }) => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem('admin_token');
                const response = await fetch('http://localhost:5000/api/admin/staff-logs', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) setLogs(data);
            } catch (error) {
                console.error('Fetch logs error:', error);
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
                        />
                    </div>
                </div>
            </header>

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
                                filteredLogs.map((log) => {
                                    const duration = log.logoutTimestamp
                                        ? Math.floor((new Date(log.logoutTimestamp) - new Date(log.loginTimestamp)) / (1000 * 60))
                                        : Math.floor((new Date() - new Date(log.loginTimestamp)) / (1000 * 60));

                                    return (
                                        <tr
                                            key={log._id}
                                            onClick={() => onViewLog && onViewLog(log._id)}
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
                                                {new Date(log.loginTimestamp).toLocaleString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem' }}>
                                                {log.logoutTimestamp ? new Date(log.logoutTimestamp).toLocaleString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
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
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ActivityLogs;
