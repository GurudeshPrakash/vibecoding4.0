import React, { useState, useEffect } from 'react';
import {
    Package, Search, AlertTriangle, CheckCircle2,
    Wrench, Plus
} from 'lucide-react';
import logo from '../../shared/assets/logo1.png';
import '../styles/InventoryManagement.css';

// Constants & Mock Data
import {
    ADMIN_BRANCHES,
    STATUS_CONFIG,
    CATEGORIES,
    STATUSES,
    MOCK_INVENTORY
} from '../constants/mockData';

import EquipmentDetailModal from '../components/EquipmentDetailModal';
import EquipmentAddEditModal from '../components/EquipmentAddEditModal';
import EquipmentQrModal from '../components/EquipmentQrModal';
import InventoryCard from '../components/InventoryCard';

const InventoryManagement = () => {
    // ─── State ──────────────────────────────────────────────────────────────
    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem('admin_inventory_db');
        return saved ? JSON.parse(saved) : MOCK_INVENTORY;
    });

    const [activeBranchId, setActiveBranchId] = useState(() => {
        const context = localStorage.getItem('selected_branch_context');
        return context ? JSON.parse(context)._id : 'b1';
    });

    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedItem, setSelectedItem] = useState(null);
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [qrItem, setQrItem] = useState(null);

    // ─── Service Reminders ──────────────────────────────────────────────────
    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const formatDate = (d) => d.toISOString().split('T')[0];
        const todayStr = formatDate(today);
        const tomorrowStr = formatDate(tomorrow);

        const reminders = [];
        inventory.forEach(item => {
            if (item.nextMaintenance) {
                if (item.nextMaintenance === todayStr) {
                    reminders.push({
                        id: `SR-${item.id}-today`,
                        type: 'Maintenance',
                        priority: 'High',
                        title: 'Service Required Today',
                        message: `Equipment ${item.id} (${item.name}) must be serviced today.`,
                        equipmentId: item.id,
                        timestamp: new Date().toISOString(),
                        unread: true
                    });
                } else if (item.nextMaintenance === tomorrowStr) {
                    reminders.push({
                        id: `SR-${item.id}-tom`,
                        type: 'Maintenance',
                        priority: 'Medium',
                        title: 'Service Required Tomorrow',
                        message: `Equipment ${item.id} (${item.name}) requires service tomorrow.`,
                        equipmentId: item.id,
                        timestamp: new Date().toISOString(),
                        unread: true
                    });
                }
            }
        });

        if (reminders.length > 0) {
            const devNotifs = JSON.parse(localStorage.getItem('dev_notifications') || '[]');
            // Filter out ones already added (by ID)
            const existingIds = new Set(devNotifs.map(n => n.id));
            const newReminders = reminders.filter(r => !existingIds.has(r.id));
            
            if (newReminders.length > 0) {
                localStorage.setItem('dev_notifications', JSON.stringify([...newReminders, ...devNotifs]));
            }
        }
    }, [inventory]);

    // ─── Derived Data ───────────────────────────────────────────────────────
    const branchItems = inventory.filter(i => i.branchId === activeBranchId);

    const filtered = branchItems.filter(item => {
        const matchSearch = item.name?.toLowerCase().includes(search.toLowerCase()) ||
            item.id?.toLowerCase().includes(search.toLowerCase()) ||
            item.area?.toLowerCase().includes(search.toLowerCase());
        const matchCat = categoryFilter === 'All' || item.category === categoryFilter;
        const matchStatus = statusFilter === 'All' || item.status === statusFilter;
        return matchSearch && matchCat && matchStatus;
    });

    const counts = {
        total: branchItems.length,
        good: branchItems.filter(i => i.status === 'Good' || i.status === 'Available').length,
        maintenance: branchItems.filter(i => i.status === 'Maintenance').length,
        damaged: branchItems.filter(i => i.status === 'Damaged' || i.status === 'Dismantled').length,
    };

    // ─── Handlers ───────────────────────────────────────────────────────────
    const handleOpenAdd = () => {
        setEditingItem(null);
        setShowAddEditModal(true);
    };

    const handleOpenEdit = (item) => {
        setEditingItem(item);
        setShowAddEditModal(true);
    };

    const handleSaveEquipment = (formData) => {
        let updated;
        if (editingItem) {
            updated = inventory.map(item => item.id === editingItem.id ? { ...item, ...formData } : item);
        } else {
            const newItem = {
                ...formData,
                status: 'Good' // Default to Good
            };
            updated = [newItem, ...inventory];
        }
        setInventory(updated);
        localStorage.setItem('admin_inventory_db', JSON.stringify(updated));
        setShowAddEditModal(false);
    };

    const handleRemoveEquipment = (id) => {
        if (!window.confirm('Are you sure you want to remove this equipment?')) return;
        const updated = inventory.filter(i => i.id !== id);
        setInventory(updated);
        localStorage.setItem('admin_inventory_db', JSON.stringify(updated));
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

    // ─── Main View ──────────────────────────────────────────────────────────
    return (
        <div className="admin-dashboard">
            <header className="sa-header" style={{ marginBottom: '32px' }}>
                <div className="sa-welcome">
                    <h1>Inventory Management</h1>
                    <p>Manage branch-specific equipment and monitor conditions.</p>
                </div>
                <button onClick={handleOpenAdd} className="sm-btn-add" style={{ height: 'fit-content' }}>
                    <Plus size={18} /> Add Equipment
                </button>
            </header>

            <section className="sa-summary-grid" style={{ marginBottom: '32px', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div className="live-card" style={{ padding: '20px' }}>
                    <div className="icon-box" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}><Package /></div>
                    <div className="card-data">
                        <span className="label">Total Equipment</span>
                        <h2 className="value">{counts.total}</h2>
                    </div>
                </div>
                <div className="live-card" style={{ padding: '20px' }}>
                    <div className="icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><CheckCircle2 /></div>
                    <div className="card-data">
                        <span className="label">Good</span>
                        <h2 className="value">{counts.good}</h2>
                    </div>
                </div>
                <div className="live-card" style={{ padding: '20px' }}>
                    <div className="icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}><Wrench /></div>
                    <div className="card-data">
                        <span className="label">In Maintenance</span>
                        <h2 className="value">{counts.maintenance}</h2>
                    </div>
                </div>
                <div className="live-card" style={{ padding: '20px' }}>
                    <div className="icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}><AlertTriangle /></div>
                    <div className="card-data">
                        <span className="label">Damaged</span>
                        <h2 className="value">{counts.damaged}</h2>
                    </div>
                </div>
            </section>

            <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Branch Navigation */}
                <div className="branch-tabs-container">
                    {ADMIN_BRANCHES.map(branch => (
                        <button
                            key={branch._id}
                            onClick={() => setActiveBranchId(branch._id)}
                            className={`branch-tab-btn ${activeBranchId === branch._id ? 'active' : ''}`}
                        >
                            {branch.name}
                        </button>
                    ))}
                </div>

            {/* Filters */}
            <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
                        <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                        <input
                            type="text"
                            placeholder="Search by name, ID, or zone..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '14px 16px 14px 44px', 
                                border: '1px solid #E2E8F0', 
                                borderRadius: '12px', 
                                fontSize: '0.85rem', 
                                boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {CATEGORIES.filter(cat => cat !== 'All').map(cat => (
                                <button 
                                    key={cat} 
                                    onClick={() => setCategoryFilter(cat)} 
                                    style={{
                                        padding: '10px 20px', 
                                        borderRadius: '10px', 
                                        border: '1px solid #E2E8F0', 
                                        cursor: 'pointer', 
                                        fontSize: '0.75rem', 
                                        fontWeight: '700',
                                        background: categoryFilter === cat ? '#1E3A5F' : '#fff',
                                        color: categoryFilter === cat ? '#fff' : '#64748B',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div style={{ width: '1px', height: '20px', background: '#E2E8F0', margin: '0 4px' }}></div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {STATUSES.filter(s => s !== 'All').map(s => (
                                <button 
                                    key={s} 
                                    onClick={() => setStatusFilter(s)} 
                                    style={{
                                        padding: '10px 20px', 
                                        borderRadius: '10px', 
                                        border: '1px solid #E2E8F0', 
                                        cursor: 'pointer', 
                                        fontSize: '0.75rem', 
                                        fontWeight: '700',
                                        background: statusFilter === s ? (STATUS_CONFIG[s]?.bg || '#F1F5F9') : '#fff',
                                        color: statusFilter === s ? (STATUS_CONFIG[s]?.color || '#334155') : '#64748B',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => {
                                setSearch('');
                                setCategoryFilter('All');
                                setStatusFilter('All');
                            }}
                            style={{
                                padding: '10px 20px', 
                                borderRadius: '10px', 
                                border: '1px solid #E2E8F0', 
                                background: '#fff', 
                                color: '#64748B',
                                cursor: 'pointer', 
                                fontSize: '0.75rem', 
                                fontWeight: '700', 
                                transition: 'all 0.2s', 
                                marginLeft: '4px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                            }}
                            onMouseOver={(e) => { e.target.style.background = '#F1F5F9'; e.target.style.color = '#EF4444'; }}
                            onMouseOut={(e) => { e.target.style.background = '#fff'; e.target.style.color = '#64748B'; }}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {filtered.map(item => (
                    <InventoryCard
                        key={item.id}
                        item={item}
                        onView={setSelectedItem}
                        onQr={setQrItem}
                        onUpdate={handleOpenEdit}
                        onRemove={handleRemoveEquipment}
                    />
                ))}
                {filtered.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#94A3B8' }}>
                        <Package size={48} style={{ marginBottom: '12px', opacity: 0.4 }} />
                        <p>No equipment found matching your filters.</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            <EquipmentDetailModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                onUpdate={handleOpenEdit}
                statusConfig={STATUS_CONFIG}
            />

            <EquipmentAddEditModal
                show={showAddEditModal}
                onClose={() => setShowAddEditModal(false)}
                onSave={handleSaveEquipment}
                editingItem={editingItem}
                branches={ADMIN_BRANCHES}
                defaultBranchId={activeBranchId}
            />

            <EquipmentQrModal
                item={qrItem}
                onClose={() => setQrItem(null)}
                logo={logo}
                onDownload={handleDownloadQR}
                onPrint={handlePrintQR}
            />
        </div>
    );
};

export default InventoryManagement;
