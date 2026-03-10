import React, { useState, useEffect } from 'react';
import { X, Upload, Package, Calendar, MapPin, Tag } from 'lucide-react';

const EquipmentAddEditModal = ({
    show,
    onClose,
    onSave,
    editingItem,
    branches = [],
    defaultBranchId
}) => {
    const [formData, setFormData] = useState({
        name: '',
        id: '',
        category: 'Cardio',
        brand: '',
        branchId: '',
        purchaseDate: '',
        lastMaintenance: '',
        nextMaintenance: '',
        photo: ''
    });

    const [preview, setPreview] = useState('');

    useEffect(() => {
        if (editingItem) {
            setFormData({
                name: editingItem.name || '',
                id: editingItem.id || '',
                category: editingItem.category || 'Cardio',
                brand: editingItem.brand || '',
                branchId: editingItem.branchId || '',
                purchaseDate: editingItem.purchaseDate || '',
                lastMaintenance: editingItem.lastMaintenance || '',
                nextMaintenance: editingItem.nextMaintenance || '',
                photo: editingItem.photo || ''
            });
            setPreview(editingItem.photo || '');
        } else {
            setFormData({
                name: '',
                id: '',
                category: 'Cardio',
                brand: '',
                branchId: defaultBranchId || branches[0]?._id || '',
                purchaseDate: new Date().toISOString().split('T')[0],
                lastMaintenance: '',
                nextMaintenance: '',
                photo: ''
            });
            setPreview('');
        }
    }, [editingItem, show, branches, defaultBranchId]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            setFormData({ ...formData, photo: url });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!show) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
            <div style={{ background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#1E293B' }}>
                            {editingItem ? 'Edit Equipment' : 'Add New Equipment'}
                        </h2>
                        <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#64748B' }}>
                            {editingItem ? 'Update the details for this asset' : 'Register a new asset to a branch'}
                        </p>
                    </div>
                    <button onClick={onClose} style={{ background: '#F8FAFC', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', transition: 'all 0.2s' }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                        {/* Image Section */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>Equipment Image</label>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <div style={{ width: '120px', height: '120px', borderRadius: '16px', background: '#F8FAFC', border: '2px dashed #E2E8F0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {preview ? (
                                        <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Package size={32} color="#CBD5E1" />
                                    )}
                                </div>
                                <div>
                                    <input type="file" id="equip-img" hidden onChange={handleImageChange} accept="image/*" />
                                    <label htmlFor="equip-img" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#F1F5F9', borderRadius: '12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700', color: '#475569', transition: 'all 0.2s' }}>
                                        <Upload size={16} /> Upload Image
                                    </label>
                                    <p style={{ margin: '8px 0 0', fontSize: '0.65rem', color: '#94A3B8' }}>JPG, PNG or JPEG. Max 2MB.</p>
                                </div>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div style={{ gridColumn: '1 / span 1' }}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>Equipment Name</label>
                            <div style={{ position: 'relative' }}>
                                <Package size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                <input 
                                    type="text" 
                                    required
                                    placeholder="e.g. Treadmill Pro"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}
                                />
                            </div>
                        </div>

                        <div style={{ gridColumn: '2 / span 1' }}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>Equipment ID</label>
                            <input 
                                type="text" 
                                required
                                placeholder="EQ-0000"
                                value={formData.id}
                                onChange={e => setFormData({...formData, id: e.target.value})}
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: editingItem ? '1px solid #F1F5F9' : '1px solid #E2E8F0', fontSize: '0.85rem', background: editingItem ? '#F8FAFC' : '#fff' }}
                                disabled={!!editingItem}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>Category</label>
                            <select 
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.85rem', appearance: 'none', background: '#fff' }}
                            >
                                <option value="Cardio">Cardio</option>
                                <option value="Weight Machine">Weight Machine</option>
                                <option value="Free Weights">Free Weights</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>Brand</label>
                            <input 
                                type="text" 
                                required
                                value={formData.brand}
                                onChange={e => setFormData({...formData, brand: e.target.value})}
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>Assign to Branch</label>
                            <select 
                                value={formData.branchId}
                                onChange={e => setFormData({...formData, branchId: e.target.value})}
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}
                                disabled={!!editingItem}
                            >
                                {branches.map(b => (
                                    <option key={b._id} value={b._id}>{b.name} ({b.location})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>Purchase Date</label>
                            <input 
                                type="date" 
                                value={formData.purchaseDate}
                                onChange={e => setFormData({...formData, purchaseDate: e.target.value})}
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>Last Service Date</label>
                            <input 
                                type="date" 
                                value={formData.lastMaintenance}
                                onChange={e => setFormData({...formData, lastMaintenance: e.target.value})}
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>Next Service Date</label>
                            <input 
                                type="date" 
                                required
                                value={formData.nextMaintenance}
                                onChange={e => setFormData({...formData, nextMaintenance: e.target.value})}
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                        <button type="button" onClick={onClose} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>Cancel</button>
                        <button type="submit" style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', background: 'var(--color-red)', color: '#fff', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 20px rgba(255, 0, 0, 0.1)', transition: 'all 0.2s' }}>
                            {editingItem ? 'Save Changes' : 'Register Equipment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EquipmentAddEditModal;
