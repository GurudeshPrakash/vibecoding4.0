import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Shield, Save, X, Camera, IdCard, Building2, Briefcase } from 'lucide-react';
import { INITIAL_PROFILES } from '../constants/profileData';
import '../styles/ProfilePage.css';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop';

const ProfilePage = ({ currentUserId, userRole, setGlobalUserName, setGlobalUserEmail, setGlobalUserPhone, nested = false }) => {
    const [profiles, setProfiles] = useState(() => {
        const saved = localStorage.getItem('gym_profiles_db');
        return saved ? JSON.parse(saved) : INITIAL_PROFILES;
    });

    const [editing, setEditing] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({});

    // Helper to find a user by ID across all role arrays
    const findUserById = (id) => {
        for (const role in profiles) {
            const user = profiles[role].find(u => u.id === id);
            if (user) return user;
        }
        return null;
    };

    useEffect(() => {
        // If no specific userId is requested, default to the "logged in" user based on role
        // For this demo, we use the first user in each role category as the "active" user
        let idToLoad = currentUserId;
        if (!idToLoad) {
            if (userRole === 'super_admin') idToLoad = 'SAD-001';
            else if (userRole === 'admin') idToLoad = 'ADM-001';
            else idToLoad = 'STF-001';
        }

        const user = findUserById(idToLoad);
        setSelectedUser(user);
        setFormData(user || {});
    }, [currentUserId, userRole, profiles]);

    const canEdit = userRole === 'super_admin' || userRole === 'admin';
    const isSelf = selectedUser?.id === (userRole === 'super_admin' ? 'SAD-001' : userRole === 'admin' ? 'ADM-001' : 'STF-001');

    // Rule: Only Super Admin and Admin can edit. Staff cannot edit anyone (not even themselves).
    const hasEditPower = (userRole === 'super_admin' || userRole === 'admin') && (isSelf || userRole === 'super_admin');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const updatedProfiles = { ...profiles };
        for (const role in updatedProfiles) {
            const index = updatedProfiles[role].findIndex(u => u.id === selectedUser.id);
            if (index !== -1) {
                updatedProfiles[role][index] = { ...selectedUser, ...formData };
                break;
            }
        }

        setProfiles(updatedProfiles);
        localStorage.setItem('gym_profiles_db', JSON.stringify(updatedProfiles));
        setEditing(false);

        // If editing self, update global app state
        if (isSelf) {
            if (setGlobalUserName) setGlobalUserName(`${formData.firstName} ${formData.surname}`);
            if (setGlobalUserEmail) setGlobalUserEmail(formData.email);
            if (setGlobalUserPhone) setGlobalUserPhone(formData.phone);
        }

        alert('Profile updated successfully!');
    };

    if (!selectedUser) return <div className="profile-loading">Loading Profile...</div>;

    return (
        <div className={`profile-page-container ${nested ? 'nested' : ''} animate-fade-in`}>
            {!nested && (
                <header className="profile-header">
                    <div className="profile-title-area">
                        <h1>User Profile</h1>
                        <p>Manage personal information and system credentials.</p>
                    </div>
                    {hasEditPower && !editing && (
                        <button className="profile-edit-btn" onClick={() => setEditing(true)}>
                            Edit Profile
                        </button>
                    )}
                </header>
            )}

            {nested && hasEditPower && !editing && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                    <button className="profile-edit-btn" onClick={() => setEditing(true)}>
                        Edit Profile
                    </button>
                </div>
            )}

            <div className="profile-layout">
                {/* Left Column: Avatar & Quick Info */}
                <div className="profile-sidebar">
                    <div className="profile-card avatar-card">
                        <div className="profile-avatar-wrapper">
                            <img
                                src={formData.photo || selectedUser.photo || DEFAULT_AVATAR}
                                alt="Avatar"
                                className="profile-large-avatar"
                                onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                            />
                            {editing && (
                                <label className="avatar-upload-overlay">
                                    <Camera size={24} />
                                    <input type="file" style={{ display: 'none' }} />
                                </label>
                            )}
                        </div>
                        <h2 className="profile-name-display">{formData.firstName} {formData.surname}</h2>
                        <span className={`profile-role-badge ${selectedUser.role.toLowerCase().replace(' ', '-')}`}>
                            {selectedUser.role}
                        </span>
                        <div className="profile-id-tag">
                            <IdCard size={14} /> {selectedUser.id}
                        </div>
                    </div>

                    <div className="profile-card stats-card">
                        <div className="stat-item">
                            <Calendar size={18} />
                            <div>
                                <span className="stat-label">Date Joined</span>
                                <p className="stat-value">{selectedUser.dateJoined}</p>
                            </div>
                        </div>
                        {selectedUser.branchAssignment && (
                            <div className="stat-item">
                                <Building2 size={18} />
                                <div>
                                    <span className="stat-label">Branch</span>
                                    <p className="stat-value">{selectedUser.branchAssignment}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Form Fields */}
                <div className="profile-main">
                    <div className="profile-card details-card">
                        <h3 className="section-title">Personal Information</h3>
                        <div className="profile-form-grid">
                            <div className="form-group">
                                <label><User size={14} /> First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName || ''}
                                    onChange={handleInputChange}
                                    disabled={!editing}
                                    placeholder="Enter first name"
                                />
                            </div>
                            <div className="form-group">
                                <label><User size={14} /> Surname</label>
                                <input
                                    type="text"
                                    name="surname"
                                    value={formData.surname || ''}
                                    onChange={handleInputChange}
                                    disabled={!editing}
                                    placeholder="Enter surname"
                                />
                            </div>
                            <div className="form-group">
                                <label><Mail size={14} /> Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ''}
                                    onChange={handleInputChange}
                                    disabled={!editing}
                                    placeholder="email@company.com"
                                />
                            </div>
                            <div className="form-group">
                                <label><Phone size={14} /> Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone || ''}
                                    onChange={handleInputChange}
                                    disabled={!editing}
                                    placeholder="+94 7X XXX XXXX"
                                />
                            </div>
                            <div className="form-group">
                                <label><Shield size={14} /> National ID (NIC)</label>
                                <input
                                    type="text"
                                    name="nic"
                                    value={formData.nic || ''}
                                    onChange={handleInputChange}
                                    disabled={!editing}
                                    placeholder="9XXXXXXX V"
                                />
                            </div>
                            <div className="form-group">
                                <label><Briefcase size={14} /> Role</label>
                                <input
                                    type="text"
                                    value={selectedUser.role}
                                    disabled
                                    className="read-only-input"
                                />
                            </div>
                            <div className="form-group full-width">
                                <label><MapPin size={14} /> Residential Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address || ''}
                                    onChange={handleInputChange}
                                    disabled={!editing}
                                    placeholder="Enter full address"
                                    rows={3}
                                />
                            </div>
                        </div>

                        {editing && (
                            <div className="profile-form-actions">
                                <button className="cancel-btn" onClick={() => { setEditing(false); setFormData(selectedUser); }}>
                                    <X size={18} /> Cancel
                                </button>
                                <button className="save-btn" onClick={handleSave}>
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
