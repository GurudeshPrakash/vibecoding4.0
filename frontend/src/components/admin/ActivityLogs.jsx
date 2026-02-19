import React, { useState, useEffect } from 'react';
import { Clock, Download, Filter, Search, Shield, MapPin, Activity, User, ExternalLink } from 'lucide-react';

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

            <div className="card" style={{ padding: '0', overflow: 'hidden', marginTop: '24px' }}>
                <div className="equipment-table">
                    <div className="table-header" style={{ gridTemplateColumns: '1.5fr 1fr 1.5fr 1.5fr 1fr 1fr' }}>
                        <span>Manager</span>
                        <span>Branch</span>
                        <span>Login Time</span>
                        <span>Logout Time</span>
                        <span>Duration</span>
                        <span>Status</span>
                    </div>

                    {isLoading ? (
                        <div style={{ padding: '40px', textAlign: 'center' }}>Loading activity logs...</div>
                    ) : (
                        <div className="table-body">
                            {filteredLogs.map((log) => {
                                const duration = log.logoutTimestamp
                                    ? Math.floor((new Date(log.logoutTimestamp) - new Date(log.loginTimestamp)) / (1000 * 60))
                                    : Math.floor((new Date() - new Date(log.loginTimestamp)) / (1000 * 60));

                                return (
                                    <div
                                        key={log._id}
                                        className="table-row"
                                        style={{ gridTemplateColumns: '1.5fr 1fr 1.5fr 1.5fr 1fr 1fr', cursor: 'pointer' }}
                                        onClick={() => onViewLog && onViewLog(log._id)}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={16} color="var(--color-red)" />
                                            </div>
                                            <div>
                                                <div style={{ color: 'var(--color-text)', fontWeight: 'bold' }}>{log.staffName}</div>
                                                <div style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem' }}>{log.staffEmail}</div>
                                            </div>
                                        </div>
                                        <span>{log.branch}</span>
                                        <span style={{ color: 'var(--color-text-dim)' }}>
                                            {new Date(log.loginTimestamp).toLocaleString()}
                                        </span>
                                        <span style={{ color: 'var(--color-text-dim)' }}>
                                            {log.logoutTimestamp ? new Date(log.logoutTimestamp).toLocaleString() : '---'}
                                        </span>
                                        <span style={{ color: 'var(--color-text-dim)' }}>
                                            {duration >= 60 ? `${Math.floor(duration / 60)}h ${duration % 60}m` : `${duration}m`}
                                        </span>
                                        <div className={`status-badge-v2`} style={{ color: log.status === 'Active' ? '#4caf50' : '#ff4444' }}>
                                            <div className="dot" style={{ background: log.status === 'Active' ? '#4caf50' : '#ff4444' }} />
                                            {log.status === 'Active' ? 'Active' : 'Ended'}
                                        </div>
                                    </div>
                                );
                            })}
                            {filteredLogs.length === 0 && (
                                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-dim)' }}>
                                    No activity records found.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityLogs;
