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

                        {/* New Personal & Professional Details */}
                        <div className="sm-form-group sm-half">
                            <label className="sm-label">Gender</label>
                            <div className="sm-select-wrap">
                                <select name="gender" className="sm-input" value={formData.gender} onChange={onChange}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <div className="sm-select-caret"><ChevronDown size={16} /></div>
                            </div>
                        </div>

                        <div className="sm-form-group sm-half">
                            <label className="sm-label">Role / Designation</label>
                            <div className="sm-select-wrap">
                                <select name="designation" className="sm-input" value={formData.designation} onChange={onChange}>
                                    <option value="">Select Designation</option>
                                    <option value="Fitness Trainer">Fitness Trainer</option>
                                    <option value="Receptionist">Receptionist</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Cleaner">Cleaner</option>
                                    <option value="Cashier">Cashier</option>
                                    <option value="Nutritionist">Nutritionist</option>
                                    <option value="Security">Security</option>
                                    <option value="Other">Other</option>
                                </select>
                                <div className="sm-select-caret"><ChevronDown size={16} /></div>
                            </div>
                        </div>

                        <div className="sm-form-group sm-half">
                            <label className="sm-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="sm-input"
                                placeholder="e.g. staff@powerworld.com"
                                value={formData.email}
                                onChange={onChange}
                            />
                        </div>

                        <div className="sm-form-group sm-half">
                            <label className="sm-label">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                className="sm-input"
                                value={formData.dob}
                                onChange={onChange}
                            />
                        </div>

                        <div className="sm-form-group sm-full">
                            <label className="sm-label">Home Address</label>
                            <input
                                type="text"
                                name="address"
                                className="sm-input"
                                placeholder="e.g. No. 25, Galle Road, Colombo"
                                value={formData.address}
                                onChange={onChange}
                            />
                        </div>

                        <div className="sm-form-group sm-half">
                            <label className="sm-label">Emergency Contact Name</label>
                            <input
                                type="text"
                                name="emergencyContactName"
                                className="sm-input"
                                placeholder="e.g. Amal Perera"
                                value={formData.emergencyContactName}
                                onChange={onChange}
                            />
                        </div>

                        <div className="sm-form-group sm-half">
                            <label className="sm-label">Emergency Contact Number</label>
                            <input
                                type="text"
                                name="emergencyContactPhone"
                                className="sm-input"
                                placeholder="e.g. +94 77 123 4567"
                                value={formData.emergencyContactPhone}
                                onChange={onChange}
                            />
                        </div>

                        <div className="sm-form-group sm-half">
                            <label className="sm-label">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="sm-input"
                                placeholder="e.g. mithula.k"
                                value={formData.username}
                                onChange={onChange}
                            />
                        </div>

                        <div className="sm-form-group sm-half">
                            <label className="sm-label">Salary</label>
                            <input
                                type="number"
                                name="salary"
                                className="sm-input"
                                placeholder="e.g. 75000"
                                value={formData.salary}
                                onChange={onChange}
                            />
                        </div>

                        <div className="sm-form-group sm-half">
                            <label className="sm-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="sm-input"
                                value={formData.password}
                                onChange={onChange}
                            />
                        </div>

                        <div className="sm-form-group sm-half">
                            <label className="sm-label">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="sm-input"
                                value={formData.confirmPassword}
                                onChange={onChange}
                            />
                        </div>

                        <div className="sm-form-group sm-half">
                            <label className="sm-label">Employment Type</label>
                            <div className="sm-select-wrap">
                                <select name="employmentType" className="sm-input" value={formData.employmentType} onChange={onChange}>
                                    <option value="">Select Type</option>
                                    <option value="Full Time">Full Time</option>
                                    <option value="Part Time">Part Time</option>
                                    <option value="Contract">Contract</option>
                                </select>
                                <div className="sm-select-caret"><ChevronDown size={16} /></div>
                            </div>
                        </div>

                        <div className="sm-form-group sm-half">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label className="sm-label">Shift Start Time</label>
                                    <input type="time" name="shiftStartTime" className="sm-input" value={formData.shiftStartTime} onChange={onChange} />
                                </div>
                                <div>
                                    <label className="sm-label">Shift End Time</label>
                                    <input type="time" name="shiftEndTime" className="sm-input" value={formData.shiftEndTime} onChange={onChange} />
                                </div>
                            </div>
                        </div>

                        <div className="sm-form-group sm-full">
                            <label className="sm-label">Working Days</label>
                            <div style={{ 
                                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px',
                                padding: '16px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0'
                            }}>
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                    <label key={day} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                                        <input 
                                            type="checkbox" 
                                            name="workingDays" 
                                            value={day} 
                                            checked={(formData.workingDays || []).includes(day)}
                                            onChange={onChange}
                                            style={{ width: '16px', height: '16px', accentColor: 'var(--color-red)' }}
                                        />
                                        {day}
                                    </label>
                                ))}
                            </div>
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
