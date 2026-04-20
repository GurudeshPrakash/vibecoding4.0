import React from 'react';
import { X, Plus, Edit2, ChevronDown } from 'lucide-react';

const StaffFormModal = ({
    mode,
    show,
    onClose,
    formData,
    formErrors,
    onChange,
    onSubmit,
    selectedStaff,
    branches,
    staffList
}) => {
    if (!show) return null;

    return (
        <div className="sm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="sm-modal sm-modal-form">
                <div className="sm-modal-header">
                    <div className="sm-modal-title-row">
                        <div className="sm-modal-icon-wrap">
                            {mode === 'add' ? <Plus size={20} color="var(--color-red)" /> : <Edit2 size={20} color="var(--color-red)" />}
                        </div>
                        <div>
                            <h2 className="sm-modal-title">
                                {mode === 'add' ? 'Add New Staff' : 'Edit Staff Details'}
                            </h2>
                            <p className="sm-modal-subtitle">
                                {mode === 'add'
                                    ? 'Fill in the details to assign a staff member to a branch.'
                                    : `Editing — ${selectedStaff?.firstName} ${selectedStaff?.lastName}`}
                            </p>
                        </div>
                    </div>
                    <button className="sm-modal-close" onClick={onClose}><X size={18} /></button>
                </div>

                <form onSubmit={onSubmit} className="sm-form" noValidate>
                    {/* Profile Photo Upload Section */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                        <div style={{ position: 'relative' }}>
                            <div 
                                style={{ 
                                    width: '120px', 
                                    height: '120px', 
                                    borderRadius: '50%', 
                                    overflow: 'hidden', 
                                    border: '4px solid #fff', 
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                    background: '#F8FAFC',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.borderColor = 'var(--color-red)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = '#fff'; }}
                                onClick={() => document.getElementById('staff-photo-upload').click()}
                            >
                                {formData.photo ? (
                                    <img 
                                        src={formData.photo} 
                                        alt="Profile Preview" 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                    />
                                ) : (
                                    <div style={{ textAlign: 'center', color: '#94A3B8' }}>
                                        <div style={{ background: '#F1F5F9', padding: '12px', borderRadius: '50%', marginBottom: '4px' }}>
                                            <Plus size={32} />
                                        </div>
                                        <div style={{ fontSize: '0.6rem', fontWeight: '800', textTransform: 'uppercase' }}>Add Photo</div>
                                    </div>
                                )}
                            </div>
                            
                            <input 
                                type="file" 
                                id="staff-photo-upload" 
                                hidden 
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            onChange({ target: { name: 'photo', value: reader.result } });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />

                            {formData.photo && (
                                <button
                                    type="button"
                                    onClick={() => onChange({ target: { name: 'photo', value: '' } })}
                                    style={{
                                        position: 'absolute',
                                        bottom: '4px',
                                        right: '4px',
                                        background: '#EF4444',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '32px',
                                        height: '32px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    title="Remove Photo"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="sm-form-grid">
                        {mode === 'edit' && (
                            <div className="sm-form-group sm-half">
                                <label className="sm-label">Staff ID</label>
                                <input className="sm-input sm-input-readonly" value={selectedStaff?.staffId} readOnly />
                            </div>
                        )}

                        <div className="sm-form-group sm-half">
                            <label className="sm-label">Join Date <span className="sm-req">*</span></label>
                            <input
                                type="date"
                                name="joinDate"
                                className={`sm-input ${formErrors.joinDate ? 'sm-input-error' : ''}`}
                                value={formData.joinDate}
                                onChange={onChange}
                            />
                            {formErrors.joinDate && <span className="sm-error-msg">{formErrors.joinDate}</span>}
                        </div>

                        <div className="sm-form-group sm-half">
                            <label className="sm-label">First Name <span className="sm-req">*</span></label>
                            <input
                                type="text"
                                name="firstName"
                                className={`sm-input ${formErrors.firstName ? 'sm-input-error' : ''}`}
                                placeholder="e.g. Amal"
                                value={formData.firstName}
                                onChange={onChange}
                            />
                            {formErrors.firstName && <span className="sm-error-msg">{formErrors.firstName}</span>}
                        </div>

                        <div className="sm-form-group sm-half">
                            <label className="sm-label">Last Name <span className="sm-req">*</span></label>
                            <input
                                type="text"
                                name="lastName"
                                className={`sm-input ${formErrors.lastName ? 'sm-input-error' : ''}`}
                                placeholder="e.g. Perera"
                                value={formData.lastName}
                                onChange={onChange}
                            />
                            {formErrors.lastName && <span className="sm-error-msg">{formErrors.lastName}</span>}
                        </div>

                        <div className="sm-form-group sm-half">
                            <label className="sm-label">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                className="sm-input"
                                placeholder="+94 77 000 0000"
                                value={formData.phone}
                                onChange={onChange}
                            />
                        </div>

                        <div className="sm-form-group sm-half">
                            <label className="sm-label">NIC Number</label>
                            <input
                                type="text"
                                name="nic"
                                className="sm-input"
                                placeholder="e.g. 950000000V"
                                value={formData.nic}
                                onChange={onChange}
                            />
                        </div>

                        <div className="sm-form-group sm-full" style={{ gridColumn: 'span 2' }}>
                            <label className="sm-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Assign Branches <span className="sm-req">*</span></span>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-red)' }}>{formData.branchIds?.length || 0} SELECTED</span>
                            </label>
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(2, 1fr)', 
                                gap: '10px', 
                                background: '#f8fafc', 
                                padding: '16px', 
                                borderRadius: '16px',
                                border: formErrors.branchIds ? '1px solid #EF4444' : '1px solid #e2e8f0',
                                maxHeight: '200px',
                                overflowY: 'auto'
                            }} className="custom-scrollbar">
                                {branches.map(branch => {
                                    const isSelected = formData.branchIds?.includes(branch._id);
                                    return (
                                        <div 
                                            key={branch._id}
                                            onClick={() => {
                                                const newIds = isSelected 
                                                    ? formData.branchIds.filter(id => id !== branch._id)
                                                    : [...(formData.branchIds || []), branch._id];
                                                onChange({ target: { name: 'branchIds', value: newIds } });
                                            }}
                                            style={{
                                                padding: '10px',
                                                borderRadius: '10px',
                                                background: isSelected ? 'rgba(255,0,0,0.05)' : '#fff',
                                                border: isSelected ? '1.5px solid var(--color-red)' : '1px solid #e2e8f0',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <div style={{
                                                width: '16px',
                                                height: '16px',
                                                borderRadius: '4px',
                                                border: '2px solid ' + (isSelected ? 'var(--color-red)' : '#cbd5e1'),
                                                background: isSelected ? 'var(--color-red)' : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {isSelected && <div style={{ width: '6px', height: '6px', background: '#fff', borderRadius: '1px' }} />}
                                            </div>
                                            <span style={{ 
                                                fontSize: '0.75rem', 
                                                fontWeight: 700,
                                                color: isSelected ? 'var(--color-red)' : '#475569'
                                            }}>{branch.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            {formErrors.branchIds && <span className="sm-error-msg" style={{ marginTop: '4px', display: 'block' }}>{formErrors.branchIds}</span>}
                        </div>
                    </div>

                    <div className="sm-modal-footer">
                        <button type="button" className="sm-btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="sm-btn-primary">
                            {mode === 'add' ? 'Add Staff' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StaffFormModal;
