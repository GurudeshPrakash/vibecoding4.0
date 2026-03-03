import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Camera, Save, ArrowLeft } from 'lucide-react';
import '../../style/AdminDashboard.css';

const StaffProfile = ({ staffInfo, setProfileImage }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [profileImg, setProfileImg] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('staff_token');
                const response = await fetch('http://localhost:5000/api/staff/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setFormData(prev => ({
                        ...prev,
                        firstName: data.firstName || '',
                        lastName: data.lastName || '',
                        email: data.email || '',
                        phone: data.phone || ''
                    }));
                    if (data.profilePicture) {
                        setProfileImg(data.profilePicture);
                        setProfileImage(data.profilePicture);
                    }
                }
            } catch (error) {
                console.error('Failed to load profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [setProfileImage]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImg(reader.result);
                // We update parent immediately for preview, but save happens on Submit
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            alert("New passwords do not match!");
            return;
        }

        try {
            const token = localStorage.getItem('staff_token');
            const body = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email, // Email usually read-only but sending anyway
                phone: formData.phone,
                profilePicture: profileImg,
                ...(formData.newPassword ? { password: formData.newPassword } : {})
            };

            const response = await fetch('http://localhost:5000/api/staff/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                alert("Profile updated successfully!");
                setFormData(prev => ({ ...prev, oldPassword: '', newPassword: '', confirmPassword: '' }));
                // Update parent again to be sure
                setProfileImage(profileImg);
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to update profile");
            }
        } catch (error) {
            console.error('Update error:', error);
            alert("An error occurred while updating profile");
        }
    };

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header-flex">
                <div className="header-left">
                    <h1 className="welcome-admin">Staff <span className="highlight-red">Profile</span></h1>
                    <p className="subtitle">Manage your personal information and account security</p>
                </div>
            </header>

            <div className="dashboard-main-area" style={{ gridTemplateColumns: 'minmax(300px, 400px) 1fr', marginTop: '30px' }}>
                {/* Profile Card */}
                <div className="card" style={{ padding: '32px', textAlign: 'center', height: 'fit-content' }}>
                    <div className="profile-avatar-large" style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto 24px', borderRadius: '50%', background: 'var(--color-surface-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--color-red)', overflow: 'hidden' }}>
                        {profileImg ? (
                            <img src={profileImg} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <User size={60} color="var(--color-text-dim)" />
                        )}
                        <label className="camera-overlay" style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--color-red)', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Camera size={18} color="#fff" />
                            <input type="file" style={{ display: 'none' }} onChange={handleImageChange} accept="image/*" />
                        </label>
                    </div>
                    <h3 style={{ color: 'var(--color-text)', fontSize: '1.5rem', marginBottom: '8px' }}>{formData.firstName} {formData.lastName}</h3>
                    <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem', marginBottom: '24px' }}>Staff Member</p>

                    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="info-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-dim)' }}>
                            <Mail size={16} />
                            <span>{formData.email}</span>
                        </div>
                        <div className="info-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-dim)' }}>
                            <Phone size={16} />
                            <span>{formData.phone}</span>
                        </div>
                    </div>
                </div>

                {/* Settings Form */}
                <div className="card" style={{ padding: '32px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <h4 style={{ color: 'var(--color-text)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '8px' }}>Personal Information</h4>

                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text)', fontSize: '0.9rem' }}>First Name</label>
                                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--color-text)' }} />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text)', fontSize: '0.9rem' }}>Sur Name</label>
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--color-text)' }} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text)', fontSize: '0.9rem' }}>Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--color-text)' }} />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text)', fontSize: '0.9rem' }}>Phone Number</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--color-text)' }} />
                        </div>

                        <h4 style={{ color: 'var(--color-text)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '8px', marginTop: '20px' }}>Security Settings</h4>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text)', fontSize: '0.9rem' }}>Old Password</label>
                            <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} placeholder="••••••••" style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--color-text)' }} />
                        </div>

                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text)', fontSize: '0.9rem' }}>New Password</label>
                                <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="••••••••" style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--color-text)' }} />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text)', fontSize: '0.9rem' }}>Confirm Pass</label>
                                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" style={{ width: '100%', padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--color-text)' }} />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                            <Save size={18} /> Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StaffProfile;
