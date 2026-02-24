import React, { useState, useEffect } from 'react';
import { Search, Shield } from 'lucide-react';
import '../../style/AdminDashboard.css';

const AdminLogs = ({ embedded = false }) => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem('admin_token');
                const response = await fetch('http://localhost:5000/api/admin/admin-logs', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.status === 403) {
                    setLogs({ error: 'Access Denied: You do not have permission to view Admin Activity Logs.' });
                } else {
                    const data = await response.json();
                    if (response.ok) setLogs(data);
                }
            } catch (error) {
                console.error('Fetch admin logs error:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = Array.isArray(logs) ? logs.filter(l =>
        l.adminName.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <div className={embedded ? "" : "admin-dashboard"}>
            {!embedded && (
                <header className="dashboard-header-flex">
                    <div className="header-left">
                        <h1>Admin <span className="highlight-red">Logs</span></h1>
                        <p className="subtitle">Monitor system access of administrators</p>
                    </div>

                    <div className="header-right-actions">
                        <div className="search-box-container" style={{ minWidth: '300px' }}>
                            <Search className="search-icon-inside" size={18} />
                            <input
                                type="text"
                                placeholder="Filter by Name"
                                className="dynamic-search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ padding: '10px 15px 10px 40px' }}
                            />
                        </div>
                    </div>
                </header>
            )}

            {embedded && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                    <div className="search-box-container" style={{ minWidth: '300px' }}>
                        <Search className="search-icon-inside" size={18} />
                        <input
                            type="text"
                            placeholder="Filter by Name"
                            className="dynamic-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '10px 15px 10px 40px' }}
                        />
                    </div>
                </div>
            )}

            <div className="card" style={{ padding: '0', overflow: 'hidden', marginTop: embedded ? '0' : '24px' }}>
                <div className="equipment-table">
                    <div className="table-header" style={{ gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 1fr' }}>
                        <span>Admin</span>
                        <span>Login Time</span>
                        <span>Logout Time</span>
                        <span>Duration</span>
                        <span>Status</span>
                    </div>

                    {isLoading ? (
                        <div style={{ padding: '40px', textAlign: 'center' }}>Loading admin logs...</div>
                    ) : logs.error ? (
                        <div style={{ padding: '60px', textAlign: 'center', width: '100%', color: 'var(--color-red)' }}>
                            <Shield className="animate-pulse" size={48} color="var(--color-red)" style={{ display: 'block', margin: '0 auto 15px auto' }} />
                            <span style={{ fontSize: '1.2rem' }}>{logs.error}</span>
                        </div>
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
                                        style={{ gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 1fr' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Shield size={16} color="var(--color-red)" />
                                            </div>
                                            <div>
                                                <div style={{ color: 'var(--color-text)', fontWeight: 'bold' }}>{log.adminName}</div>
                                                <div style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem' }}>{log.adminEmail}</div>
                                            </div>
                                        </div>
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
                                    No admin activity records found.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminLogs;
