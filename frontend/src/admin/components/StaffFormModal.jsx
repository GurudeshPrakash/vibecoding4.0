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

                        <div className="sm-form-group sm-half">
                            <label className="sm-label">
                                Assigned Branch <span className="sm-req">*</span>
                            </label>
                            <div className="sm-select-wrap">
                                <select
                                    name="branchId"
                                    className={`sm-input ${formErrors.branchId ? 'sm-input-error' : ''}`}
                                    value={formData.branchId}
                                    onChange={onChange}
                                >
                                    <option value="">Select a Branch</option>
                                    {branches.map(branch => {
                                        const isAssigned = staffList.some(s =>
                                            s.branchId === branch._id && (mode === 'add' || s._id !== selectedStaff?._id)
                                        );
                                        return (
                                            <option
                                                key={branch._id}
                                                value={branch._id}
                                                disabled={isAssigned}
                                                style={isAssigned ? { color: '#94A3B8' } : {}}
                                            >
                                                {branch.name} {isAssigned ? '— Assigned' : ''}
                                            </option>
                                        );
                                    })}
                                </select>
                                <ChevronDown size={14} className="sm-select-caret" />
                            </div>
                            {formErrors.branchId && <span className="sm-error-msg">{formErrors.branchId}</span>}
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
