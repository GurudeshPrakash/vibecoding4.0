import React from 'react';
import { X, MapPin, Camera } from 'lucide-react';

const BranchFormModal = ({
    show,
    onClose,
    editingBranch,
    formData,
    onChange,
    onSave
}) => {
    if (!show) return null;

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)',
            zIndex: 10000, display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '20px'
        }}>
            <div className="sa-card" style={{
                maxWidth: '650px', width: '100%', padding: '32px',
                maxHeight: '90vh', overflowY: 'auto', background: '#FFFFFF'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(255,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MapPin size={22} color="var(--color-red)" />
                        </div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0, color: '#1a1a1a' }}>
                            {editingBranch ? 'Update Branch' : 'Add New Branch'}
                        </h2>
                    </div>
                    <button onClick={onClose} style={{ background: '#f5f5fa', border: 'none', color: '#666', borderRadius: '10px', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
                </div>
                <form onSubmit={onSave}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#333' }}>Branch Name <span style={{ color: 'red' }}>*</span></label>
                            <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="e.g. Colombo City Gym" required style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, fontSize: '0.78rem' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#333' }}>City <span style={{ color: 'red' }}>*</span></label>
                            <input type="text" name="city" value={formData.city} onChange={onChange} placeholder="e.g. Colombo" required style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, fontSize: '0.78rem' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#333' }}>Type</label>
                            <select name="type" value={formData.type} onChange={onChange} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, cursor: 'pointer', fontSize: '0.78rem' }}>
                                <option value="AC">AC</option>
                                <option value="Non-AC">Non-AC</option>
                            </select>
                        </div>

                        {/* New Fields */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#333' }}>Opening Time</label>
                            <input type="time" name="openingTime" value={formData.openingTime} onChange={onChange} placeholder="Select opening time" style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, fontSize: '0.78rem' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#333' }}>Closing Time</label>
                            <input type="time" name="closingTime" value={formData.closingTime} onChange={onChange} placeholder="Select closing time" style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, fontSize: '0.78rem' }} />
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#333' }}>Branch Address</label>
                            <input type="text" name="address" value={formData.address} onChange={onChange} placeholder="e.g. No. 25, Galle Road, Colombo" style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, fontSize: '0.78rem' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#333' }}>Contact Number</label>
                            <input type="text" name="contactNumber" value={formData.contactNumber} onChange={onChange} placeholder="e.g. +94771234567" style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, fontSize: '0.78rem' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#333' }}>Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={onChange} placeholder="e.g. colombo@powerworld.com" style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, fontSize: '0.78rem' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#333' }}>Maximum Member Capacity</label>
                            <input type="number" name="maxCapacity" value={formData.maxCapacity} onChange={onChange} placeholder="e.g. 250" style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, fontSize: '0.78rem' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#333' }}>Number of Staff Assigned</label>
                            <input type="number" name="staffAssigned" value={formData.staffAssigned} onChange={onChange} placeholder="e.g. 12" style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, fontSize: '0.78rem' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#333' }}>Parking Available</label>
                            <select name="parkingAvailable" value={formData.parkingAvailable} onChange={onChange} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, cursor: 'pointer', fontSize: '0.78rem' }}>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div></div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.7rem', fontWeight: 700, color: '#333' }}>Facilities</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', padding: '16px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                {['AC', 'Cardio Area', 'Weight Training', 'Personal Training', 'Locker Room', 'Parking', 'Shower', 'Wi-Fi'].map(facility => (
                                    <label key={facility} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                                        <input 
                                            type="checkbox" 
                                            name="facilities" 
                                            value={facility} 
                                            checked={formData.facilities.includes(facility)}
                                            onChange={onChange}
                                            style={{ width: '16px', height: '16px', accentColor: 'var(--color-red)', cursor: 'pointer' }}
                                        />
                                        {facility}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>Cover Photo</label>
                            <div style={{ border: '2px dashed #e2e8f0', borderRadius: '12px', padding: '16px', textAlign: 'center', background: '#F9FAFB' }}>
                                <Camera size={24} style={{ marginBottom: '8px', color: '#94a3b8' }} />
                                <input type="file" name="photoFile" accept="image/*" onChange={(e) => onChange({ target: { name: 'photoFile', files: e.target.files } })} />
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                        <button type="button" onClick={onClose} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'white', fontWeight: 800, cursor: 'pointer', color: '#333' }}>
                            Cancel
                        </button>
                        <button type="submit" style={{ flex: 2, padding: '14px', borderRadius: '12px', border: 'none', background: 'var(--color-red)', color: 'white', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,0,0,0.2)' }}>
                            {editingBranch ? 'Update Branch' : 'Create Branch'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BranchFormModal;
