import React, { useState } from 'react';
import {
    Package, Search, AlertTriangle, CheckCircle2,
    Wrench, Eye, X, Send, QrCode, Printer, Download, Plus
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import logo from '../../assets/logo1.png';
import '../../style/admin/InventoryManagement.css';

const STATUS_CONFIG = {
    'Good': { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', icon: <CheckCircle2 size={12} /> },
    'Available': { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', icon: <CheckCircle2 size={12} /> },
    'Maintenance': { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', icon: <Wrench size={12} /> },
    'Damaged': { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', icon: <AlertTriangle size={12} /> },
};

const MOCK_INVENTORY = [
    { id: 'TM-001', name: 'Commercial Treadmill Gen-X', category: 'Cardio', status: 'Good', area: 'Cardio Zone', brand: 'Life Fitness', model: '95T', serial: 'SN-TM-001', lastMaintenance: '2026-01-15', nextMaintenance: '2026-04-15', photo: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800' },
    { id: 'TM-002', name: 'Commercial Treadmill Gen-X', category: 'Cardio', status: 'Maintenance', area: 'Cardio Zone', brand: 'Life Fitness', model: '95T', serial: 'SN-TM-002', lastMaintenance: '2025-12-01', nextMaintenance: '2026-03-15', photo: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800' },
    { id: 'EB-001', name: 'Upright Stationary Bike', category: 'Cardio', status: 'Good', area: 'Cardio Zone', brand: 'Matrix', model: 'U50', serial: 'SN-EB-001', lastMaintenance: '2026-02-10', nextMaintenance: '2026-05-10', photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800' },
    { id: 'LP-001', name: '45-Degree Leg Press', category: 'Strength', status: 'Good', area: 'Strength Zone', brand: 'Hammer Strength', model: 'MTS-LP', serial: 'SN-LP-001', lastMaintenance: '2026-02-01', nextMaintenance: '2026-08-01', photo: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800' },
    { id: 'CC-001', name: 'Dual Cable Crossover', category: 'Strength', status: 'Good', area: 'Strength Zone', brand: 'Precor', model: 'FTS-Glide', serial: 'SN-CC-001', lastMaintenance: '2026-01-20', nextMaintenance: '2026-07-20', photo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' },
    { id: 'RM-001', name: 'Concept2 RowErg', category: 'Cardio', status: 'Good', area: 'Cardio Zone', brand: 'Concept2', model: 'Model D', serial: 'SN-RM-001', lastMaintenance: '2026-02-15', nextMaintenance: '2026-05-15', photo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800' },
    { id: 'FB-001', name: 'Adjustable Flat Bench', category: 'Free Weights', status: 'Good', area: 'Free Weights', brand: 'Body-Solid', model: 'GFID71', serial: 'SN-FB-001', lastMaintenance: '2025-11-20', nextMaintenance: '2026-05-20', photo: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=800' },
    { id: 'SM-001', name: 'Pro Smith Machine', category: 'Strength', status: 'Dismantled', area: 'Strength Zone', brand: 'Body-Solid', model: 'GDCC300', serial: 'SN-SM-001', lastMaintenance: '2025-10-01', nextMaintenance: '2026-01-01', photo: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800' },
    { id: 'DB-001', name: 'Dumbbell Set (5kg-50kg)', category: 'Free Weights', status: 'Good', area: 'Free Weights', brand: 'Rogue', model: 'Rubber Hex', serial: 'SN-DB-SET-01', lastMaintenance: '2026-01-05', nextMaintenance: '2026-07-05', photo: 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?auto=format&fit=crop&q=80&w=800' },
    { id: 'BC-001', name: 'Olympic Barbell', category: 'Free Weights', status: 'Good', area: 'Free Weights', brand: 'Rogue', model: 'Ohio Bar', serial: 'SN-BC-001', lastMaintenance: '2026-02-10', nextMaintenance: '2026-08-10', photo: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=800' },
    { id: 'EL-001', name: 'Elliptical Trainer E7', category: 'Cardio', status: 'Good', area: 'Cardio Zone', brand: 'Life Fitness', model: 'E7 GO', serial: 'SN-EL-001', lastMaintenance: '2026-01-05', nextMaintenance: '2026-04-05', photo: 'https://images.unsplash.com/photo-1571388208497-71bedc66e932?auto=format&fit=crop&q=80&w=800' },
    { id: 'CH-001', name: 'Chest Press Machine', category: 'Strength', status: 'Good', area: 'Strength Zone', brand: 'Matrix', model: 'G7-S13', serial: 'SN-CH-001', lastMaintenance: '2026-01-20', nextMaintenance: '2026-07-20', photo: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=800' },
    { id: 'LD-001', name: 'Lat Pulldown Station', category: 'Strength', status: 'Maintenance', area: 'Strength Zone', brand: 'Hammer Strength', model: 'MTS-LD', serial: 'SN-LD-001', lastMaintenance: '2026-02-15', nextMaintenance: '2026-03-15', photo: 'https://images.unsplash.com/photo-1591940746222-e8d2f7f00ce2?auto=format&fit=crop&q=80&w=800' },
    { id: 'KB-001', name: 'Kettlebell Set (4kg-32kg)', category: 'Free Weights', status: 'Good', area: 'Functional Area', brand: 'Eleiko', model: 'Training KB', serial: 'SN-KB-SET-01', lastMaintenance: '2026-02-20', nextMaintenance: '2026-08-20', photo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800' },
    { id: 'PR-001', name: 'Power Rack System', category: 'Strength', status: 'Good', area: 'Power Zone', brand: 'Rogue', model: 'R-3', serial: 'SN-PR-001', lastMaintenance: '2026-01-10', nextMaintenance: '2026-07-10', photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800' },
    { id: 'TM-204-01', name: 'Pro-Series Treadmill G7', category: 'Cardio', status: 'Good', area: 'Cardio Zone', brand: 'Life Fitness', model: '95T Elevation', serial: 'SN-TM-2024-001X', mfgYear: '2024', lastMaintenance: '2026-01-15', nextMaintenance: '2026-04-15', photo: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800' },
    { id: 'EB-102-05', name: 'Matrix Upright Bike U50', category: 'Cardio', status: 'Maintenance', area: 'Cardio Zone', brand: 'Matrix', model: 'U50 V2', serial: 'SN-EB-2023-112B', mfgYear: '2023', lastMaintenance: '2025-12-01', nextMaintenance: '2026-02-28', photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800' },
    { id: 'LP-305-12', name: 'Plate-Loaded Leg Press', category: 'Weight Machine', status: 'Good', area: 'Leg Zone', brand: 'Hammer Strength', model: 'MTS Leg Press', serial: 'SN-LP-2022-998C', mfgYear: '2022', lastMaintenance: '2026-02-01', nextMaintenance: '2026-08-01', photo: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800' },
    { id: 'CB-501-03', name: 'Cable Crossover Machine', category: 'Weight Machine', status: 'Good', area: 'Free Weights', brand: 'Precor', model: 'FTS Glide', serial: 'SN-CB-2023-441D', mfgYear: '2023', lastMaintenance: '2026-01-20', nextMaintenance: '2026-07-20', photo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' },
    { id: 'RW-107-02', name: 'Concept2 Rowing Machine', category: 'Cardio', status: 'Good', area: 'Cardio Zone', brand: 'Concept2', model: 'Model D', serial: 'SN-RW-2024-220A', mfgYear: '2024', lastMaintenance: '2026-02-10', nextMaintenance: '2026-05-10', photo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800' },
    { id: 'BN-210-08', name: 'Olympic Flat Bench', category: 'Free Weights', status: 'Good', area: 'Free Weights', brand: 'Body-Solid', model: 'GFID71', serial: 'SN-BN-2022-105B', mfgYear: '2022', lastMaintenance: '2025-11-15', nextMaintenance: '2026-05-15', photo: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=800' },
    { id: 'SM-404-01', name: 'Smith Machine Pro', category: 'Weight Machine', status: 'Maintenance', area: 'Power Zone', brand: 'Body-Solid', model: 'GDCC300', serial: 'SN-SM-2021-889F', mfgYear: '2021', lastMaintenance: '2025-10-01', nextMaintenance: '2026-01-01', photo: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800' },
    { id: 'EL-601-04', name: 'Elliptical Cross Trainer', category: 'Cardio', status: 'Good', area: 'Cardio Zone', brand: 'Life Fitness', model: 'E7 GO', serial: 'SN-EL-2023-312G', mfgYear: '2023', lastMaintenance: '2026-01-05', nextMaintenance: '2026-04-05', photo: 'https://images.unsplash.com/photo-1571388208497-71bedc66e932?auto=format&fit=crop&q=80&w=800' },
];

const CATEGORIES = ['All', 'Cardio', 'Weight Machine', 'Free Weights'];
const STATUSES = ['Good', 'Maintenance', 'Damaged'];

const InventoryManagement = ({ inventoryData = [] }) => {
    const allItems = inventoryData.length > 0 ? inventoryData : MOCK_INVENTORY;
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedItem, setSelectedItem] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportItem, setReportItem] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [reportReason, setReportReason] = useState('');
    const [reportSubmitted, setReportSubmitted] = useState(false);
    const [qrItem, setQrItem] = useState(null);
    const [reportImages, setReportImages] = useState([]);

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
        setNewStatus(item.status);
        setReportReason('');
        setReportImages([]);
        setReportSubmitted(false);
        setShowReportModal(true);
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const availableSlots = 20 - reportImages.length;
        const newImages = files.slice(0, availableSlots).map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setReportImages(prev => [...prev, ...newImages]);
    };

    const handleRemoveImage = (index) => {
        const updatedImages = [...reportImages];
        URL.revokeObjectURL(updatedImages[index].preview);
        updatedImages.splice(index, 1);
        setReportImages(updatedImages);
    };

    const handleSubmitReport = (e) => {
        e.preventDefault();
        if (!reportReason.trim()) return;
        console.log('Update report submitted for:', reportItem?.id, 'Reason:', reportReason);
        setReportSubmitted(true);
    };

    const handlePrintQR = () => {
        const canvas = document.getElementById(`qr-code-${qrItem.id}`);
        const url = canvas.toDataURL();
        const win = window.open();
        win.document.write(`
            <html>
                <head>
                    <title>Print QR Code - ${qrItem.name}</title>
                    <style>
                        body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; }
                        .qr-card { border: 2px solid #333; padding: 40px; border-radius: 20px; text-align: center; }
                        h2 { margin-top: 20px; color: #1e3a5f; }
                        p { color: #64748b; font-weight: bold; }
                    </style>
                </head>
                <body onload="window.print();window.close()">
                    <div class="qr-card">
                        <img src="${url}" width="300" height="300" />
                        <h2 style="margin-bottom: 5px;">${qrItem.name}</h2>
                        <p style="margin: 2px 0;">Brand: ${qrItem.brand || 'N/A'}</p>
                        <p style="margin: 2px 0;">ID: ${qrItem.id}</p>
                        <p style="margin: 2px 0;">Serial: ${qrItem.serial || 'N/A'}</p>
                        <p style="margin: 2px 0;">Year: ${qrItem.mfgYear || 'N/A'}</p>
                    </div>
                </body>
            </html>
        `);
    };

    const handleDownloadQR = () => {
        const canvas = document.getElementById(`qr-code-${qrItem.id}`);
        if (canvas) {
            const pngUrl = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = `QR_${qrItem.id}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    const generateQRValue = (item) => {
        return `--- EQUIPMENT PROFILE ---
NAME: ${item.name}
ID: ${item.id}
SERIAL: ${item.serial || 'N/A'}
BRAND: ${item.brand || 'N/A'}
MODEL: ${item.model || 'N/A'}
MFG YEAR: ${item.mfgYear || 'N/A'}
ZONE: ${item.area}
STATUS: ${item.status}

POWER WORLD GYMS
Digital Asset Record`;
    };

    return (
        <div className="admin-dashboard">
            <header className="sa-header" style={{ marginBottom: '32px' }}>
                <div className="sa-welcome">
                    <h1>Inventory Management</h1>
                    <p>View all gym equipment and facilities. Update status as needed.</p>
                </div>
            </header>

            <section className="sa-summary-grid" style={{ marginBottom: '32px', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <div className="live-card" style={{ padding: '12px 16px' }}>
                    <div className="icon-box" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}><Package /></div>
                    <div className="card-data">
                        <span className="label">Total Equipment</span>
                        <h2 className="value">{counts.total}</h2>
                    </div>
                </div>
                <div className="live-card" style={{ padding: '12px 16px' }}>
                    <div className="icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><CheckCircle2 /></div>
                    <div className="card-data">
                        <span className="label">Available</span>
                        <h2 className="value">{counts.good}</h2>
                    </div>
                </div>
                <div className="live-card" style={{ padding: '12px 16px' }}>
                    <div className="icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}><Wrench /></div>
                    <div className="card-data">
                        <span className="label">In Maintenance</span>
                        <h2 className="value">{counts.maintenance}</h2>
                    </div>
                </div>
                <div className="live-card" style={{ padding: '12px 16px' }}>
                    <div className="icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}><AlertTriangle /></div>
                    <div className="card-data">
                        <span className="label">Damaged</span>
                        <h2 className="value">{counts.dismantled}</h2>
                    </div>
                </div>
            </section>

            <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input
                        type="text"
                        placeholder="Search by name, ID, or zone..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px 12px 48px', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '0.85rem', background: '#F8FAFC', transition: 'all 0.2s' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {CATEGORIES.filter(cat => cat !== 'All').map(cat => (
                            <button key={cat} onClick={() => setCategoryFilter(cat)} style={{
                                padding: '9px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700',
                                background: categoryFilter === cat ? '#1E3A5F' : 'rgba(255,255,255,0.8)',
                                color: categoryFilter === cat ? '#fff' : '#64748B',
                                transition: 'all 0.2s',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                            }}>{cat}</button>
                        ))}
                    </div>
                    <div style={{ width: '1px', height: '20px', background: '#E2E8F0', margin: '0 4px' }}></div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {STATUSES.filter(s => s !== 'All').map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)} style={{
                                padding: '9px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700',
                                background: statusFilter === s ? (STATUS_CONFIG[s]?.bg || '#F1F5F9') : 'rgba(255,255,255,0.8)',
                                color: statusFilter === s ? (STATUS_CONFIG[s]?.color || '#334155') : '#64748B',
                                transition: 'all 0.2s',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                            }}>{s}</button>
                        ))}
                    </div>
                    <button
                        onClick={() => {
                            setSearch('');
                            setCategoryFilter('All');
                            setStatusFilter('All');
                        }}
                        style={{
                            padding: '9px 18px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#fff', color: '#64748B',
                            cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700', transition: 'all 0.2s', marginLeft: '4px'
                        }}
                        onMouseOver={(e) => { e.target.style.background = '#F1F5F9'; e.target.style.color = '#EF4444'; }}
                        onMouseOut={(e) => { e.target.style.background = '#fff'; e.target.style.color = '#64748B'; }}
                    >
                        Reset
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {filtered.map(item => {
                    const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG['Good'];
                    return (
                        <div key={item.id} className="sa-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
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
                                        <Eye size={14} /> View
                                    </button>
                                    <button
                                        onClick={() => setQrItem(item)}
                                        style={{ flex: 1, padding: '8px', background: 'rgba(59, 130, 246, 0.08)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.65rem', fontWeight: '600', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                    >
                                        <QrCode size={14} /> QR
                                    </button>
                                    <button
                                        onClick={() => handleOpenReport(item)}
                                        style={{ flex: 1, padding: '8px', background: 'rgba(16, 185, 129, 0.08)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.65rem', fontWeight: '600', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                    >
                                        <Wrench size={14} /> Update
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
                                    ['MFG Year', selectedItem.mfgYear || '—'],
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

            {showReportModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, color: '#1E293B', fontSize: '0.85rem' }}>Update Equipment Status</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '0.68rem', color: '#64748B' }}>{reportItem?.name} ({reportItem?.id})</p>
                            </div>
                            <button onClick={() => setShowReportModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
                        </div>
                        <div style={{ padding: '24px' }}>
                            {reportSubmitted ? (
                                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                                    <CheckCircle2 size={48} color="#10B981" style={{ marginBottom: '12px' }} />
                                    <h4 style={{ color: '#1E293B', marginBottom: '8px' }}>Status Updated!</h4>
                                    <p style={{ color: '#64748B', fontSize: '0.7rem' }}>The equipment status has been updated and a log entry has been created.</p>
                                    <button onClick={() => setShowReportModal(false)} style={{ marginTop: '20px', padding: '10px 24px', background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Done</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitReport}>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: '700', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Set Status</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                            {['Good', 'Maintenance', 'Damaged'].map(status => (
                                                <button
                                                    key={status}
                                                    type="button"
                                                    onClick={() => setNewStatus(status)}
                                                    style={{
                                                        padding: '10px',
                                                        border: '1px solid #E2E8F0',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.65rem',
                                                        fontWeight: '600',
                                                        color: newStatus === status ? (STATUS_CONFIG[status]?.color || '#475569') : '#475569',
                                                        background: newStatus === status ? (STATUS_CONFIG[status]?.bg || '#F8FAFC') : '#F8FAFC',
                                                        border: newStatus === status ? `1px solid ${STATUS_CONFIG[status]?.color || '#E2E8F0'}` : '1px solid #E2E8F0',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: '700', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
                                        <textarea
                                            value={reportReason}
                                            onChange={e => setReportReason(e.target.value)}
                                            placeholder="Describe the issue in detail..."
                                            rows={4}
                                            required
                                            style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '0.7rem', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                                        />
                                    </div>

                                    {(newStatus === 'Maintenance' || newStatus === 'Damaged') && (
                                        <div style={{ marginBottom: '20px' }}>
                                            <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: '700', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Equipment Photos (Up to 20)</label>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px' }}>
                                                {reportImages.map((img, idx) => (
                                                    <div key={idx} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                                                        <img src={img.preview} alt={`upload-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(idx)}
                                                            style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                                {reportImages.length < 20 && (
                                                    <label style={{
                                                        aspectRatio: '1/1', border: '2px dashed #E2E8F0', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94A3B8', transition: 'all 0.2s', background: '#F8FAFC'
                                                    }}>
                                                        <Plus size={20} />
                                                        <span style={{ fontSize: '0.55rem', marginTop: '4px', fontWeight: '600' }}>Add Photo</span>
                                                        <input
                                                            type="file"
                                                            multiple
                                                            accept="image/*"
                                                            onChange={handleImageUpload}
                                                            style={{ display: 'none' }}
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button type="button" onClick={() => setShowReportModal(false)} style={{ flex: 1, padding: '12px', background: '#F1F5F9', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', color: '#64748B', fontSize: '0.72rem' }}>Cancel</button>
                                        <button type="submit" style={{ flex: 2, padding: '12px', background: '#1E3A5F', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.72rem' }}>
                                            <Send size={16} /> Save Changes
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {qrItem && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '400px', padding: '24px', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', color: '#1E293B' }}>Equipment QR Code</h3>
                            <button onClick={() => setQrItem(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
                        </div>

                        <div style={{ background: '#F8FAFC', padding: '32px', borderRadius: '12px', marginBottom: '20px', display: 'inline-block' }}>
                            <QRCodeCanvas
                                id={`qr-code-${qrItem.id}`}
                                value={generateQRValue(qrItem)}
                                size={200}
                                level={"H"}
                                includeMargin={true}
                                imageSettings={{
                                    src: logo,
                                    height: 40,
                                    width: 40,
                                    excavate: true,
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ margin: '0 0 4px', fontSize: '0.9rem', color: '#1E293B' }}>{qrItem.name}</h4>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>Serial: {qrItem.serial}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={handleDownloadQR} style={{ flex: 1, padding: '12px', background: 'rgba(59, 130, 246, 0.08)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', color: '#3B82F6', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <Download size={16} /> Download
                            </button>
                            <button onClick={handlePrintQR} style={{ flex: 1, padding: '12px', background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <Printer size={16} /> Print Label
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryManagement;
