import React, { useState, useEffect } from 'react';
import { Search, Shield, Clock, Loader2, Calendar } from 'lucide-react';
import '../styles/SuperAdminDashboard.css';

const AdminLogs = ({ embedded = false }) => {
    const [logs, setLogs] = useState(() => {
        const saved = localStorage.getItem('mock_admin_logs_db');
        return saved ? JSON.parse(saved) : [];
    });
    const [isLoading, setIsLoading] = useState(!localStorage.getItem('mock_admin_logs_db'));
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = sessionStorage.getItem('admin_token');
                const response = await fetch('http://localhost:5000/api/admin/admin-logs', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.status === 403) {
                    setLogs({ error: 'Access Denied: You do not have permission to view Admin Activity Logs.' });
                } else {
                    const data = await response.json();
                    if (response.ok) {
                        setLogs(data);
                        localStorage.setItem('mock_admin_logs_db', JSON.stringify(data));
                    }
                }
            } catch (error) {
                console.error('Fetch admin logs error:', error);
                const savedMock = localStorage.getItem('mock_admin_logs_db');
                if (savedMock) {
                    setLogs(JSON.parse(savedMock));
                } else {
                    const defaultMocks = [
                        { _id: 'l1', adminName: 'Shahana Kuganesan', adminEmail: 'shaha@vibecoding.com', loginTimestamp: new Date(Date.now() - 3600000).toISOString(), logoutTimestamp: null, status: 'Active' },
                        { _id: 'l2', adminName: 'Admin User', adminEmail: 'admin@gymsys.com', loginTimestamp: new Date(Date.now() - 86400000).toISOString(), logoutTimestamp: new Date(Date.now() - 82800000).toISOString(), status: 'Inactive' },
                        { _id: 'l3', adminName: 'Super Admin', adminEmail: 'master@vibecoding.com', loginTimestamp: new Date(Date.now() - 172800000).toISOString(), logoutTimestamp: new Date(Date.now() - 169200000).toISOString(), status: 'Inactive' }
                    ];
                    setLogs(defaultMocks);
                    localStorage.setItem('mock_admin_logs_db', JSON.stringify(defaultMocks));
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = Array.isArray(logs) ? logs.filter(l =>
        l.adminName.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    if (!embedded) {
        return (
            <div className="super-admin-dashboard animate-fade-in">
                <header className="sa-header">
                    <div className="sa-welcome">
                        <h1>Security Audits</h1>
                        <p>Detailed historical records of administrative sessions and system access</p>
                    </div>

                    <div className="sa-actions">
                        <div className="sa-search-bar" style={{ width: '350px' }}>
                            <Search className="sa-search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Filter by admin name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                <div className="sa-card">
                    {renderLogTable()}
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '0' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <div className="sa-search-bar" style={{ width: '300px', background: 'var(--color-bg)' }}>
                    <Search className="sa-search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            {renderLogTable()}
        </div>
    );

    function renderLogTable() {
        return (
            <div className="sa-table-container">
                <table className="sa-table">
                    <thead>
                        <tr>
                            <th>Administrative Identity</th>
                            <th>Entry Session</th>
                            <th>Exit Session</th>
                            <th>Active Duration</th>
                            <th style={{ textAlign: 'right' }}>Visibility</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '100px' }}>
                                    <Loader2 className="animate-spin" size={40} color="var(--color-red)" style={{ margin: '0 auto' }} />
                                    <p style={{ marginTop: '20px', color: 'var(--color-text-dim)', fontWeight: 600 }}>Syncing Audit Database...</p>
                                </td>
                            </tr>
                        ) : logs.error ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '100px' }}>
                                    <Shield size={48} color="var(--color-red)" style={{ margin: '0 auto 20px auto' }} />
                                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)' }}>{logs.error}</span>
                                </td>
                            </tr>
                        ) : (
                            filteredLogs.map((log) => {
                                const duration = log.logoutTimestamp
                                    ? Math.floor((new Date(log.logoutTimestamp) - new Date(log.loginTimestamp)) / (1000 * 60))
                                    : Math.floor((new Date() - new Date(log.loginTimestamp)) / (1000 * 60));

                                return (
                                    <tr key={log._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Shield size={18} color="var(--color-red)" />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{log.adminName}</div>
                                                    <div style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem', fontWeight: 600 }}>{log.adminEmail}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)', fontSize: '0.85rem', fontWeight: 700 }}>
                                                <Calendar size={14} color="var(--color-text-dim)" />
                                                {new Date(log.loginTimestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ color: log.logoutTimestamp ? 'var(--color-text-dim)' : '#10B981', fontSize: '0.85rem', fontWeight: 700 }}>
                                                {log.logoutTimestamp ? new Date(log.logoutTimestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Ongoing Session'}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
                                                <Clock size={12} color="var(--color-red)" />
                                                {duration >= 60 ? `${Math.floor(duration / 60)}h ${duration % 60}m` : `${duration}m`}
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                fontWeight: 900,
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                background: log.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
                                                color: log.status === 'Active' ? '#10B981' : 'var(--color-text-dim)',
                                                border: `1px solid ${log.status === 'Active' ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-color)'}`
                                            }}>
                                                {log.status === 'Active' ? 'LIVE' : 'ARCHIVED'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        {!isLoading && filteredLogs.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-dim)', fontWeight: 600 }}>
                                    No audit logs matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
};

export default AdminLogs;
