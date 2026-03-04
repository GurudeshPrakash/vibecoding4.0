import React, { useState } from 'react';
import {
    Package, Search, Filter, AlertTriangle, CheckCircle2,
    Wrench, Trash2, ChevronDown, Eye, X, Send
} from 'lucide-react';
import '../../style/AdminDashboard.css';

const STATUS_CONFIG = {
    'Good': { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', icon: <CheckCircle2 size={12} /> },
    'Maintenance': { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', icon: <Wrench size={12} /> },
    'Dismantled': { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', icon: <Trash2 size={12} /> },
};

const MOCK_INVENTORY = [
    { id: 'TM-204-01', name: 'Pro-Series Treadmill G7', category: 'Cardio', status: 'Good', area: 'Cardio Zone', brand: 'Life Fitness', model: '95T Elevation', serial: 'SN-TM-2024-001X', lastMaintenance: '2026-01-15', nextMaintenance: '2026-04-15', photo: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800' },
    { id: 'EB-102-05', name: 'Matrix Upright Bike U50', category: 'Cardio', status: 'Maintenance', area: 'Cardio Zone', brand: 'Matrix', model: 'U50 V2', serial: 'SN-EB-2023-112B', lastMaintenance: '2025-12-01', nextMaintenance: '2026-02-28', photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800' },
    { id: 'LP-305-12', name: 'Plate-Loaded Leg Press', category: 'Weight Machine', status: 'Good', area: 'Leg Zone', brand: 'Hammer Strength', model: 'MTS Leg Press', serial: 'SN-LP-2022-998C', lastMaintenance: '2026-02-01', nextMaintenance: '2026-08-01', photo: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800' },
    { id: 'CB-501-03', name: 'Cable Crossover Machine', category: 'Weight Machine', status: 'Good', area: 'Free Weights', brand: 'Precor', model: 'FTS Glide', serial: 'SN-CB-2023-441D', lastMaintenance: '2026-01-20', nextMaintenance: '2026-07-20', photo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' },
    { id: 'RW-107-02', name: 'Concept2 Rowing Machine', category: 'Cardio', status: 'Good', area: 'Cardio Zone', brand: 'Concept2', model: 'Model D', serial: 'SN-RW-2024-220A', lastMaintenance: '2026-02-10', nextMaintenance: '2026-05-10', photo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800' },
    { id: 'BN-210-08', name: 'Olympic Flat Bench', category: 'Free Weights', status: 'Good', area: 'Free Weights', brand: 'Body-Solid', model: 'GFID71', serial: 'SN-BN-2022-105B', lastMaintenance: '2025-11-15', nextMaintenance: '2026-05-15', photo: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=800' },
    { id: 'SM-404-01', name: 'Smith Machine Pro', category: 'Weight Machine', status: 'Maintenance', area: 'Power Zone', brand: 'Body-Solid', model: 'GDCC300', serial: 'SN-SM-2021-889F', lastMaintenance: '2025-10-01', nextMaintenance: '2026-01-01', photo: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800' },
    { id: 'EL-601-04', name: 'Elliptical Cross Trainer', category: 'Cardio', status: 'Good', area: 'Cardio Zone', brand: 'Life Fitness', model: 'E7 GO', serial: 'SN-EL-2023-312G', lastMaintenance: '2026-01-05', nextMaintenance: '2026-04-05', photo: 'https://images.unsplash.com/photo-1571388208497-71bedc66e932?auto=format&fit=crop&q=80&w=800' },
];

const CATEGORIES = ['All', 'Cardio', 'Weight Machine', 'Free Weights'];
const STATUSES = ['All', 'Good', 'Maintenance', 'Dismantled'];

const StaffInventory = ({ inventoryData = [] }) => {
    const allItems = inventoryData.length > 0 ? inventoryData : MOCK_INVENTORY;
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedItem, setSelectedItem] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportItem, setReportItem] = useState(null);
    const [reportReason, setReportReason] = useState('');
    const [reportSubmitted, setReportSubmitted] = useState(false);

    const filtered = allItems.filter(item => {
        const matchSearch = item.name?.toLowerCase().includes(search.toLowerCase()) ||
            item.id?.toLowerCase().includes(search.toLowerCase()) ||
            item.area?.toLowerCase().includes(search.toLowerCase());
        const matchCat = categoryFilter === 'All' || item.category === categoryFilter;
        const matchStatus = statusFilter === 'All' || item.status === statusFilter;
        return matchSearch && matchCat && matchStatus;
    });

    const counts = {
        total: allItems.length,
        good: allItems.filter(i => i.status === 'Good').length,
        maintenance: allItems.filter(i => i.status === 'Maintenance').length,
        dismantled: allItems.filter(i => i.status === 'Dismantled').length,
    };

    const handleOpenReport = (item) => {
        setReportItem(item);
        setReportReason('');
        setReportSubmitted(false);
        setShowReportModal(true);
    };

    const handleSubmitReport = (e) => {
        e.preventDefault();
        if (!reportReason.trim()) return;
        // In production, send to backend API
        console.log('Dismantle report submitted for:', reportItem?.id, 'Reason:', reportReason);
        setReportSubmitted(true);
    };

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <header className="sa-header" style={{ marginBottom: '32px' }}>
                <div className="sa-welcome">
                    <h1 style={{ fontSize: '1.2rem' }}>Facility Inventory</h1>
                    <p style={{ fontSize: '0.78rem' }}>View all gym equipment and facilities. Flag items that need attention.</p>
                </div>
            </header>

            {/* Stats */}
            <section className="sa-summary-grid" style={{ marginBottom: '32px' }}>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}><Package /></div>
                    <div className="card-data">
                        <span className="label" style={{ fontSize: '0.7rem' }}>Total Equipment</span>
                        <h2 className="value" style={{ fontSize: '1.4rem' }}>{counts.total}</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><CheckCircle2 /></div>
                    <div className="card-data">
                        <span className="label" style={{ fontSize: '0.7rem' }}>Operational</span>
                        <h2 className="value" style={{ fontSize: '1.4rem' }}>{counts.good}</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}><Wrench /></div>
                    <div className="card-data">
                        <span className="label" style={{ fontSize: '0.7rem' }}>Under Maintenance</span>
                        <h2 className="value" style={{ fontSize: '1.4rem' }}>{counts.maintenance}</h2>
                    </div>
                </div>
                <div className="live-card">
                    <div className="icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}><AlertTriangle /></div>
                    <div className="card-data">
                        <span className="label" style={{ fontSize: '0.7rem' }}>Dismantled</span>
                        <h2 className="value" style={{ fontSize: '1.4rem' }}>{counts.dismantled}</h2>
                    </div>
                </div>
            </section>

            {/* Filters */}
            <div className="sa-card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                        <input
                            type="text"
                            placeholder="Search by name, ID, or zone..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.7rem' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Filter size={16} color="#64748B" />
                        {CATEGORIES.map(cat => (
                            <button key={cat} onClick={() => setCategoryFilter(cat)} style={{
                                padding: '7px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '0.65rem', fontWeight: '600',
                                background: categoryFilter === cat ? '#1E3A5F' : '#F1F5F9',
                                color: categoryFilter === cat ? '#fff' : '#64748B',
                                transition: 'all 0.2s'
                            }}>{cat}</button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {STATUSES.map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)} style={{
                                padding: '7px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '0.65rem', fontWeight: '600',
                                background: statusFilter === s ? (STATUS_CONFIG[s]?.bg || '#F1F5F9') : '#F1F5F9',
                                color: statusFilter === s ? (STATUS_CONFIG[s]?.color || '#334155') : '#64748B',
                                transition: 'all 0.2s'
                            }}>{s}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Equipment Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {filtered.map(item => {
                    const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG['Good'];
                    return (
                        <div key={item.id} className="sa-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                            {/* Equipment Image */}
                            <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                                <img
                                    src={item.photo}
                                    alt={item.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={e => { e.target.style.display = 'none'; }}
                                />
                                <div style={{
                                    position: 'absolute', top: '12px', right: '12px',
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                    padding: '4px 10px', borderRadius: '20px',
                                    background: cfg.bg, color: cfg.color,
                                    fontSize: '0.58rem', fontWeight: '700',
                                    backdropFilter: 'blur(4px)'
                                }}>
                                    {cfg.icon} {item.status}
                                </div>
                            </div>

                            {/* Info */}
                            <div style={{ padding: '16px' }}>
                                <div style={{ marginBottom: '4px', fontSize: '0.58rem', fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {item.category} • {item.area}
                                </div>
                                <h4 style={{ margin: '0 0 4px', fontSize: '0.75rem', fontWeight: '700', color: '#1E293B' }}>{item.name}</h4>
                                <div style={{ fontSize: '0.65rem', color: '#64748B', marginBottom: '12px' }}>
                                    ID: <strong>{item.id}</strong> &nbsp;|&nbsp; Brand: <strong>{item.brand}</strong>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.62rem', marginBottom: '16px' }}>
                                    <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: '6px' }}>
                                        <div style={{ color: '#94A3B8', marginBottom: '2px' }}>Last Service</div>
                                        <div style={{ fontWeight: '600', color: '#334155' }}>{item.lastMaintenance || '—'}</div>
                                    </div>
                                    <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: '6px' }}>
                                        <div style={{ color: '#94A3B8', marginBottom: '2px' }}>Next Service</div>
                                        <div style={{ fontWeight: '600', color: '#334155' }}>{item.nextMaintenance || '—'}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => setSelectedItem(item)}
                                        style={{ flex: 1, padding: '8px', background: '#F1F5F9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.65rem', fontWeight: '600', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                    >
                                        <Eye size={14} /> View Details
                                    </button>
                                    <button
                                        onClick={() => handleOpenReport(item)}
                                        style={{ flex: 1, padding: '8px', background: 'rgba(239, 68, 68, 0.08)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.65rem', fontWeight: '600', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                    >
                                        <AlertTriangle size={14} /> Report Issue
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {filtered.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#94A3B8' }}>
                        <Package size={48} style={{ marginBottom: '12px', opacity: 0.4 }} />
                        <p>No equipment found matching your filters.</p>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedItem && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
                        <div style={{ position: 'relative', height: '220px', overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
                            <img src={selectedItem.photo} alt={selectedItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
                            <button onClick={() => setSelectedItem(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <X size={16} />
                            </button>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ marginBottom: '4px', fontSize: '0.6rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '600' }}>{selectedItem.category} • {selectedItem.area}</div>
                            <h2 style={{ margin: '0 0 8px', fontSize: '0.95rem', fontWeight: '800', color: '#1E293B' }}>{selectedItem.name}</h2>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 12px', borderRadius: '20px', fontSize: '0.62rem', fontWeight: '700', background: (STATUS_CONFIG[selectedItem.status] || STATUS_CONFIG['Good']).bg, color: (STATUS_CONFIG[selectedItem.status] || STATUS_CONFIG['Good']).color, marginBottom: '20px' }}>
                                {(STATUS_CONFIG[selectedItem.status] || STATUS_CONFIG['Good']).icon} {selectedItem.status}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {[
                                    ['Equipment ID', selectedItem.id],
                                    ['Serial Number', selectedItem.serial || '—'],
                                    ['Brand', selectedItem.brand || '—'],
                                    ['Model', selectedItem.model || '—'],
                                    ['Location', selectedItem.area || '—'],
                                    ['Category', selectedItem.category || '—'],
                                    ['Last Maintenance', selectedItem.lastMaintenance || '—'],
                                    ['Next Maintenance', selectedItem.nextMaintenance || '—'],
                                ].map(([label, val]) => (
                                    <div key={label} style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '0.58rem', color: '#94A3B8', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase' }}>{label}</div>
                                        <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#1E293B' }}>{val}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                                <button onClick={() => setSelectedItem(null)} style={{ flex: 1, padding: '12px', background: '#F1F5F9', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', color: '#64748B', fontSize: '0.72rem' }}>Close</button>
                                <button onClick={() => { setSelectedItem(null); handleOpenReport(selectedItem); }} style={{ flex: 1, padding: '12px', background: 'rgba(239, 68, 68, 0.08)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.72rem' }}>
                                    <AlertTriangle size={16} /> Report Issue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Issue Modal */}
            {showReportModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, color: '#1E293B', fontSize: '0.85rem' }}>Report Equipment Issue</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '0.68rem', color: '#64748B' }}>{reportItem?.name} ({reportItem?.id})</p>
                            </div>
                            <button onClick={() => setShowReportModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
                        </div>
                        <div style={{ padding: '24px' }}>
                            {reportSubmitted ? (
                                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                                    <CheckCircle2 size={48} color="#10B981" style={{ marginBottom: '12px' }} />
                                    <h4 style={{ color: '#1E293B', marginBottom: '8px' }}>Report Submitted!</h4>
                                    <p style={{ color: '#64748B', fontSize: '0.7rem' }}>Your dismantle/issue request has been sent to the admin for review.</p>
                                    <button onClick={() => setShowReportModal(false)} style={{ marginTop: '20px', padding: '10px 24px', background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Done</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitReport}>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: '700', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Issue Type</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                            {['Damage', 'Malfunction', 'Safety Risk', 'Request Dismantle'].map(type => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setReportReason(prev => prev ? `${type}: ` : `${type}: `)}
                                                    style={{ padding: '10px', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', fontSize: '0.65rem', fontWeight: '600', color: '#475569', background: '#F8FAFC', textAlign: 'left' }}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: '700', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
                                        <textarea
                                            value={reportReason}
                                            onChange={e => setReportReason(e.target.value)}
                                            placeholder="Describe the issue in detail (condition, severity, what happened)..."
                                            rows={4}
                                            required
                                            style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.7rem', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button type="button" onClick={() => setShowReportModal(false)} style={{ flex: 1, padding: '12px', background: '#F1F5F9', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', color: '#64748B', fontSize: '0.72rem' }}>Cancel</button>
                                        <button type="submit" style={{ flex: 2, padding: '12px', background: '#EF4444', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.72rem' }}>
                                            <Send size={16} /> Submit Report
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffInventory;
