import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone, MapPin, ArrowLeft, ArrowRight, Calendar, User, Package, Clock, Search, Plus, Eye, Edit2, Trash2, X, Activity, ArrowUpRight, Shield, Loader2, Camera, CheckCircle2, AlertCircle, Building2, Mail, Users, ClipboardList, ChevronDown } from 'lucide-react';
import '../styles/BranchManagement.css';

const checkStatus = (open, close, now) => {
  if (!open || !close) return 'Closed';
  try {
    const parseTime = (timeStr) => {
      if (!timeStr) return 0;
      const [time, modifier] = timeStr.split(' ');
      let h, m;
      if (time.includes(':')) {
        [h, m] = time.split(':');
      } else {
        h = time;
        m = '0';
      }
      let hr = parseInt(h, 10);
      if (hr === 12) hr = 0;
      if (modifier?.toUpperCase() === 'PM') hr += 12;
      return hr * 60 + parseInt(m, 10);
    };

    const startMinutes = parseTime(open);
    const endMinutes = parseTime(close);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes ? 'Open' : 'Closed';
  } catch (e) {
    return 'Closed';
  }
};

const BranchManagement = ({ userRole = 'super_admin' }) => {
  const isSuperAdmin = userRole === 'super_admin';
  const [selectedGym, setSelectedGym] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('details');
  const [currentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [branches, setBranches] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    type: 'AC',
    location: '',
    adminName: '',
    contactNumber: '',
    openTime: '5:00 AM',
    closeTime: '10:00 PM',
    photo: '',
    photoPreview: null
  });

  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch('http://localhost:5000/api/admin/branches', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBranches(data);
      }
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const filteredGyms = branches.filter(gym => {
    const matchesSearch = (gym.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (gym.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (gym.city || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || gym.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCreateBranch = () => {
    setEditingBranch(null);
    setFormData({
      name: '', city: '', type: 'AC', location: '',
      adminName: '', contactNumber: '', openTime: '5:00 AM', closeTime: '10:00 PM', photo: '', photoPreview: null
    });
    setShowModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photo: reader.result,
          photoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('admin_token');
    const url = editingBranch 
        ? `http://localhost:5000/api/admin/branches/${editingBranch._id}`
        : 'http://localhost:5000/api/admin/branches';
    const method = editingBranch ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        fetchBranches();
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to save branch');
      }
    } catch (error) {
        console.error('Error saving branch:', error);
        alert('Network error');
    }
  };

  const renderQuickCards = () => (
    <section className="sa-summary-grid" style={{ marginBottom: '24px' }}>
      <div className="sa-stat-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#FF0000', margin: 0 }}>
            <Building2 size={22} />
          </div>
          <div>
            <span className="label">Total Branches</span>
            <h2 className="value">{branches.length}</h2>
          </div>
        </div>
      </div>
      <div className="sa-stat-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="icon-circle" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', margin: 0 }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span className="label">AC Branches</span>
            <h2 className="value">{branches.filter(b => b.type === 'AC').length}</h2>
          </div>
        </div>
      </div>
      <div className="sa-stat-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', margin: 0 }}>
            <Users size={22} />
          </div>
          <div>
            <span className="label">Total Admins</span>
            <h2 className="value">{[...new Set(branches.map(b => b.adminName))].length}</h2>
          </div>
        </div>
      </div>
    </section>
  );

  const renderSearchAndFilter = () => (
    <div className="sa-search-filter-section" style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
      <div className="sa-search-bar" style={{ flex: 1, position: 'relative' }}>
        <Search className="sa-search-icon" size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input
          type="text"
          placeholder="Search by branch name, city or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', fontWeight: 600 }}
        />
      </div>
      <select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'white', fontWeight: 700, cursor: 'pointer', outline: 'none' }}
      >
        <option value="All">All Types</option>
        <option value="AC">AC</option>
        <option value="Non-AC">Non-AC</option>
      </select>
    </div>
  );

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);

  const handleDeleteClick = (id) => {
    setBranchToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    const token = sessionStorage.getItem('admin_token');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/branches/${branchToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchBranches();
      } else {
        alert('Failed to delete branch');
      }
    } catch (error) {
      console.error('Error deleting branch:', error);
      alert('Network error');
    }
    setShowDeleteConfirm(false);
    setBranchToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setBranchToDelete(null);
  };

  const handleDelete = (id) => {
    handleDeleteClick(id);
  };

  const renderBranchGrid = () => (
    <div className="sa-branch-grid">
      {filteredGyms.map(gym => {
        const computedStatus = checkStatus(gym.openTime, gym.closeTime, currentTime);
        return (
          <div key={gym._id} className="sa-branch-card-new clickable-card" onClick={() => { setSelectedGym(gym); setActiveTab('details'); }}>
            <div className="card-media">
              <img src={gym.photo} alt={gym.name} />
              <div className={`status-pill ${computedStatus.toLowerCase()}`}>
                {computedStatus === 'Open' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                {computedStatus}
              </div>
            </div>

            <div className="card-body">
              <p className="card-category">{gym.type?.toUpperCase() || 'AC'}</p>
              <h3 className="card-title">{gym.name}</h3>

              <div className="card-details-stack">
                <p className="card-detail-item">ID: <strong>{(gym._id || '...').toUpperCase()}</strong></p>
                <p className="card-detail-item">Address: <strong>{gym.location}</strong></p>
                <p className="card-detail-item">Location: <strong>{gym.city}</strong></p>
                <p className="card-detail-item">Time: <strong>{gym.openTime} – {gym.closeTime}</strong></p>
              </div>

              <div className="card-action-row" style={{ marginTop: 'auto', borderTop: '1px solid #F1F5F9', padding: '12px 0 0' }} onClick={(e) => e.stopPropagation()}>
                <div style={{ flex: 1 }}></div>
                <button
                  className="action-btn-new"
                  style={{ padding: '8px 12px', fontSize: '0.7rem', fontWeight: 800, background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingBranch(gym);
                    setFormData({ ...gym, photoPreview: gym.photo });
                    setShowModal(true);
                  }}
                >
                  <Edit2 size={14} /> Edit
                </button>

                <button
                  className="action-btn-new"
                  style={{ padding: '8px 12px', fontSize: '0.7rem', fontWeight: 800, background: 'rgba(239, 68, 68, 0.05)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(gym._id);
                  }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderDetailsPage = () => {
    if (!selectedGym) return null;

    return (
      <div className="sa-branch-details animate-fade-in">
        {/* Banner */}
        <div className="sa-branch-banner">
          <img src={selectedGym.photo} alt={selectedGym.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div className="sa-branch-banner-overlay">
            <button onClick={() => setSelectedGym(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '12px', marginBottom: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(8px)', fontWeight: 800, width: 'fit-content' }}>
              <ArrowLeft size={18} /> Back to Branches
            </button>
            <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 900, color: 'white' }}>{selectedGym.name}</h1>
            <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.9)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} /> {selectedGym.location}, {selectedGym.city}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="sa-tabs-nav">
          {['details', 'admin', 'staff', 'inventory'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`sa-tab-btn ${activeTab === tab ? 'active' : ''}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="sa-tab-content">
          {activeTab === 'details' && (
            <div className="sa-card" style={{ padding: '32px' }}>
              <h3 style={{ marginBottom: '24px', fontWeight: 900 }}>General Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <span className="label">Branch Name</span>
                    <p style={{ fontWeight: 700, margin: '4px 0' }}>{selectedGym.name}</p>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <span className="label">Exact Address</span>
                    <p style={{ fontWeight: 700, margin: '4px 0' }}>{selectedGym.location}</p>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <span className="label">City</span>
                    <p style={{ fontWeight: 700, margin: '4px 0' }}>{selectedGym.city}</p>
                  </div>
                </div>
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <span className="label">Branch Type</span>
                    <p style={{ fontWeight: 700, margin: '4px 0' }}>{selectedGym.type}</p>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <span className="label">Opening Hours</span>
                    <p style={{ fontWeight: 700, margin: '4px 0' }}>{selectedGym.openTime || '5:00 AM'} - {selectedGym.closeTime || '10:00 PM'}</p>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <span className="label">Status</span>
                    <p style={{ fontWeight: 700, margin: '4px 0', color: selectedGym.status === 'Open' ? '#10B981' : '#EF4444' }}>{selectedGym.status}</p>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <span className="label">Contact Number</span>
                    <p style={{ fontWeight: 700, margin: '4px 0' }}>{selectedGym.contactNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="sa-card" style={{ padding: '32px', maxWidth: '600px' }}>
              <h3 style={{ marginBottom: '24px', fontWeight: 900 }}>Branch Administrator</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <img src={selectedGym.adminPhoto} alt={selectedGym.adminName} style={{ width: '120px', height: '120px', borderRadius: '16px', objectFit: 'cover' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h2 style={{ margin: 0, fontWeight: 900 }}>{selectedGym.adminName}</h2>
                  <a href={`mailto:${selectedGym.adminEmail}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-red)', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
                    <Mail size={18} /> {selectedGym.adminEmail}
                  </a>
                  <a href={`tel:${selectedGym.adminPhone}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1a1a1a', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
                    <Phone size={18} /> {selectedGym.adminPhone}
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="sa-staff-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {selectedGym.staff.map((s, idx) => (
                <div key={idx} className="sa-card" style={{ padding: '20px', textAlign: 'center' }}>
                  <img src={s.photo} alt={s.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px' }} />
                  <h4 style={{ margin: '0 0 4px', fontWeight: 800 }}>{s.name}</h4>
                  <p style={{ margin: '0 0 16px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-red)', background: 'rgba(255,0,0,0.05)', display: 'inline-block', padding: '2px 10px', borderRadius: '6px' }}>{s.role}</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    <a href={`mailto:${s.email}`} className="icon-btn" style={{ width: '36px', height: '36px' }} title="Send Email"><Mail size={16} /></a>
                    <a href={`tel:${s.phone}`} className="icon-btn" style={{ width: '36px', height: '36px' }} title="Call Staff"><Phone size={16} /></a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="sa-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--color-red)', color: 'white' }}>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 800 }}>EQUIPMENT NAME</th>
                    <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '0.7rem', fontWeight: 800 }}>QUANTITY</th>
                    <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.7rem', fontWeight: 800 }}>CONDITION</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedGym.inventory.map((inv, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px 24px', fontWeight: 700 }}>{inv.name}</td>
                      <td style={{ padding: '16px 24px', textAlign: 'center', fontWeight: 800 }}>{inv.quantity}</td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          color: inv.condition === 'Available' ? '#10B981' : '#F59E0B',
                          background: inv.condition === 'Available' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                          padding: '4px 12px',
                          borderRadius: '100px'
                        }}>
                          {inv.condition.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFormModal = () => (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="sa-card" style={{ maxWidth: '600px', width: '100%', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>{editingBranch ? 'Edit Branch' : 'Add New Branch'}</h2>
          <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
        </div>
        <form onSubmit={handleSaveModal} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="label">Branch Name</label>
              <input type="text" className="sa-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">City</label>
              <input type="text" className="sa-input" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} required />
            </div>
            <div>
              <label className="label">Location/Address</label>
              <input type="text" className="sa-input" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
            </div>
            <div>
              <label className="label">Open Time</label>
              <input type="text" className="sa-input" placeholder="e.g. 5:00 AM" value={formData.openTime} onChange={e => setFormData({ ...formData, openTime: e.target.value })} required />
            </div>
            <div>
              <label className="label">Close Time</label>
              <input type="text" className="sa-input" placeholder="e.g. 10:00 PM" value={formData.closeTime} onChange={e => setFormData({ ...formData, closeTime: e.target.value })} required />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="label">Branch Image Upload</label>
              <div
                className="image-upload-box"
                onClick={() => document.getElementById('branch-image-input').click()}
                style={{
                  height: '140px',
                  border: '2px dashed #E2E8F0',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  background: '#F8FAFC',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                {formData.photoPreview ? (
                  <>
                    <img src={formData.photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.2s' }} className="hover-overlay">
                      <Camera color="white" />
                    </div>
                  </>
                ) : (
                  <>
                    <Camera size={24} color="#94A3B8" style={{ marginBottom: '8px' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8' }}>Click to upload branch image</span>
                  </>
                )}
                <input
                  id="branch-image-input"
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
            <div>
              <label className="label">Branch Type</label>
              <div className="select-container">
                <select className="sa-input" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                  <option value="AC">AC</option>
                  <option value="Non-AC">Non-AC</option>
                </select>
                <ChevronDown className="select-arrow" size={16} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: 800 }}>Cancel</button>
            <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'var(--color-red)', color: 'white', fontWeight: 800, border: 'none' }}>{editingBranch ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="super-admin-dashboard animate-fade-in">
      {!selectedGym ? (
        <>
          <header className="sa-header" style={{ marginBottom: '32px' }}>
            <div className="sa-welcome">
              <h1>Branch Management</h1>
              <p>Overview of all {branches.length} gym locations across the island.</p>
            </div>
            <div className="sa-actions">
              <button
                onClick={handleCreateBranch}
                style={{ background: 'var(--color-red)', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,0,0,0.2)' }}
              >
                <Plus size={20} /> Add Branch
              </button>
            </div>
          </header>

          {renderQuickCards()}
          {renderSearchAndFilter()}
          {renderBranchGrid()}
        </>
      ) : (
        renderDetailsPage()
      )}

      {showModal && renderFormModal()}

      {showDeleteConfirm && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="sa-card" style={{ maxWidth: '400px', width: '100%', padding: '32px', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Trash2 color="#ef4444" size={24} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '16px' }}>Delete Branch</h2>
            <p style={{ color: '#64748b', marginBottom: '32px', fontWeight: 500 }}>Are you sure you want to delete this branch?</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button onClick={cancelDelete} style={{ padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 800 }}>Cancel</button>
              <button onClick={confirmDelete} style={{ padding: '12px', borderRadius: '12px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 800 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchManagement;

