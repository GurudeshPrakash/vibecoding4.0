/**
 * @module StaffModule
 * @status STABLE - LOCKED
 * @description This module is development-complete. Avoid modifications unless specifically requested.
 */
import React, { useState, useEffect } from 'react';
import { Search, UserCheck, UserMinus, QrCode, Clock, ArrowRight } from 'lucide-react';
import '../styles/CheckIns.css';

const CheckIns = () => {
    const [scannedId, setScannedId] = useState('');
    const [recentActivity, setRecentActivity] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeNow, setActiveNow] = useState(0);
    const [branchId, setBranchId] = useState('');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('admin_token') || localStorage.getItem('token');
            const storedBranchId = localStorage.getItem('branchId');
            
            // If No branchId in localStorage, fetch from branches API
            let bId = storedBranchId;
            if (!bId) {
                const bRes = await fetch('http://localhost:5000/api/admin/branches', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (bRes.ok) {
                    const bData = await bRes.json();
                    bId = bData[0]?._id;
                }
            }
            setBranchId(bId);

            if (bId) {
                const response = await fetch(`http://localhost:5000/api/checkins/branch/${bId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setRecentActivity(data);
                    
                    // Simple estimate of active members: Check-ins minus Check-outs today
                    const today = new Date().toISOString().split('T')[0];
                    const todayActs = data.filter(a => a.timestamp.startsWith(today));
                    const ins = todayActs.filter(a => a.action === 'Check In').length;
                    const outs = todayActs.filter(a => a.action === 'Check Out').length;
                    setActiveNow(Math.max(0, ins - outs));
                }
            }
        } catch (error) {
            console.error('Failed to fetch check-ins:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleScan = async (e, action = 'Check In') => {
        if (e) e.preventDefault();
        if (!scannedId) return;

        try {
            const token = sessionStorage.getItem('admin_token') || localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/checkins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    memberId: scannedId,
                    action,
                    method: 'Manual',
                    branchId
                })
            });

            if (response.ok) {
                setScannedId('');
                fetchData();
            } else {
                const err = await response.json();
                alert(err.message || 'Check-in failed');
            }
        } catch (error) {
            console.error('Error logging check-in:', error);
        }
    };

    return (
        <div className="admin-dashboard">
            <header className="sa-header" style={{ marginBottom: '32px' }}>
                <div className="sa-welcome">
                    <h1>Access Control</h1>
                    <p>Manage member check-ins, check-outs, and current floor occupancy.</p>
                </div>
                <div className="sa-actions">
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold' }}>
                        Floor Occupancy: {activeNow} / 150
                    </div>
                </div>
            </header>

            <div className="branch-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
                <aside className="sa-sidebar-col">
                    <div className="sa-card">
                        <div className="sa-card-header">
                            <h3>Scan & Entry</h3>
                        </div>
                        <div style={{ padding: '0 20px 20px' }}>
                            <div style={{ padding: '30px', border: '2px dashed #E2E8F0', borderRadius: '12px', textAlign: 'center', marginBottom: '24px', background: '#F8FAFC' }}>
                                <QrCode size={48} color="#94A3B8" style={{ margin: '0 auto 16px' }} />
                                <h4 style={{ color: '#334155', marginBottom: '8px' }}>Ready to Scan</h4>
                                <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Present RFID card or scan QR code</p>
                            </div>

                            <form onSubmit={handleScan}>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#64748B', marginBottom: '8px' }}>Manual Entry (Member ID)</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            type="text"
                                            placeholder="e.g. M-001"
                                            value={scannedId}
                                            onChange={(e) => setScannedId(e.target.value)}
                                            style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '1rem' }}
                                        />
                                        <button type="submit" className="btn-approve" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
                                <button 
                                    onClick={(e) => handleScan(e, 'Check In')}
                                    style={{ padding: '12px', background: '#F1F5F9', border: 'none', borderRadius: '8px', color: '#10B981', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                                >
                                    <UserCheck size={18} /> Check In
                                </button>
                                <button 
                                    onClick={(e) => handleScan(e, 'Check Out')}
                                    style={{ padding: '12px', background: '#F1F5F9', border: 'none', borderRadius: '8px', color: '#EF4444', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                                >
                                    <UserMinus size={18} /> Check Out
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="sa-analytics-col">
                    <div className="sa-card">
                        <div className="sa-card-header" style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Clock size={20} color="#64748B" />
                                <h3 style={{ margin: 0 }}>Recent Activity Log</h3>
                            </div>
                        </div>
                        <div className="table-responsive" style={{ padding: '0 20px 20px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ color: '#64748B', fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'left' }}>
                                        <th style={{ padding: '12px 0' }}>Member</th>
                                        <th style={{ padding: '12px 0' }}>Time</th>
                                        <th style={{ padding: '12px 0' }}>Action</th>
                                        <th style={{ padding: '12px 0', textAlign: 'right' }}>Method</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentActivity.map((activity, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            <td style={{ padding: '16px 0' }}>
                                                <div style={{ fontWeight: '600', color: '#1E293B' }}>{activity.memberName}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{activity.memberId}</div>
                                            </td>
                                            <td style={{ padding: '16px 0', color: '#475569', fontWeight: '500' }}>
                                                {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td style={{ padding: '16px 0' }}>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700',
                                                    background: activity.action === 'Check In' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: activity.action === 'Check In' ? '#10B981' : '#EF4444'
                                                }}>
                                                    {activity.action}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 0', textAlign: 'right', fontSize: '0.85rem', color: '#64748B' }}>
                                                {activity.method}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CheckIns;
