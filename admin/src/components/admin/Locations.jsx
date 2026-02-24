import React, { useState, useEffect } from 'react';
import { Phone, MapPin, ArrowLeft, Calendar, User, Package, Clock, Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import '../../style/AdminLocations.css';

const checkStatus = (hours, now) => {
  if (!hours) return 'Closed';

  try {
    const [start, end] = hours.split(' - ');
    if (!start || !end) return 'Closed';

    const parseTime = (timeStr) => {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') {
        hours = '00';
      }
      if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
      }
      return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    };

    const startMinutes = parseTime(start);
    const endMinutes = parseTime(end);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes ? 'Open' : 'Closed';
  } catch (e) {
    return 'Closed';
  }
};

const Locations = () => {
  const [selectedGym, setSelectedGym] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // No interval needed for live time as per user request to simplify
  useEffect(() => {
    // Current time is set once on mount
  }, []);

  // Handle browser back button to close modal
  useEffect(() => {
    const handlePopState = (event) => {
      // If we popped back to a state where we shouldn't have a gym selected, close it
      if (selectedGym) {
        setSelectedGym(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedGym]);

  const handleGymSelect = (gym) => {
    // Push a new state so back button works
    window.history.pushState({ gymId: gym.id }, '', '');
    setSelectedGym(gym);
  };

  const handleCloseDetail = () => {
    // Go back in history if we are in a 'pushed' state, otherwise just close (safeguard)
    if (window.history.state && window.history.state.gymId) {
      window.history.back();
    } else {
      setSelectedGym(null);
    }
  };

  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({
    name: '', photo: null, phone: '', location: '', adminName: '', adminPhone: '', runningSince: '', operatingHours: '6:00 AM - 10:00 PM'
  });

  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:5000/api/admin/branches', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const mappedBranches = data.map(b => ({
          ...b,
          id: b._id,
          inventory: b.inventorySummary || []
        }));
        setBranches(mappedBranches);
        // Sync selected gym detail view if currently open
        if (selectedGym) {
          const updatedGym = mappedBranches.find(b => b.id === selectedGym.id);
          if (updatedGym) setSelectedGym(updatedGym);
          else setSelectedGym(null);
        }
      } else {
        setBranches([]);
      }
    } catch (error) {
      console.error('Failed to load branch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'photoFile') {
      setFormData({ ...formData, photo: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    const url = editingBranch
      ? `http://localhost:5000/api/admin/branches/${editingBranch.id}`
      : 'http://localhost:5000/api/admin/branches';
    const method = editingBranch ? 'PUT' : 'POST';

    try {
      const dataPayload = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'photo' && formData[key] instanceof File) {
          dataPayload.append('photoFile', formData[key]);
        } else if (key !== 'photo' || typeof formData[key] === 'string') {
          // Append strings (or unmodified photo URLs if we implemented text fallback, but we'll re-upload anyway or skip)
          if (formData[key] !== null) dataPayload.append(key, formData[key]);
        }
      });

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: dataPayload
      });
      if (response.ok) {
        setShowModal(false);
        fetchBranches();
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to save location.');
      }
    } catch (e) {
      alert('Request failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to completely remove this location?')) return;
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/branches/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        if (selectedGym && selectedGym.id === id) {
          handleCloseDetail();
        }
        fetchBranches();
      } else {
        alert('Failed to delete location.');
      }
    } catch (e) {
      alert('Delete request failed.');
    }
  };

  const openAddModal = () => {
    setEditingBranch(null);
    setFormData({
      name: '', photo: null, phone: '', location: '', adminName: '', adminPhone: '', runningSince: '', operatingHours: '6:00 AM - 10:00 PM'
    });
    setShowModal(true);
  };

  const openEditModal = (branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name || '', photo: branch.photo || null, phone: branch.phone || '', location: branch.location || '',
      adminName: branch.adminName || '', adminPhone: branch.adminPhone || '', runningSince: branch.runningSince || '', operatingHours: branch.operatingHours || ''
    });
    setShowModal(true);
  };

  // Filter gyms based on search query
  const filteredGyms = branches.filter(gym =>
    gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gym.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getConditionColor = (condition) => {
    switch (condition.toLowerCase()) {
      case 'excellent': return '#4caf50';
      case 'good': return '#3498db';
      case 'fair': return '#ff9800';
      case 'poor': return '#FF0000';
      default: return 'var(--color-ash)';
    }
  };

  const renderModal = () => {
    if (!showModal) return null;
    return (
      <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="modal-content card" style={{ maxWidth: '600px', width: '100%', padding: '32px', background: 'var(--color-surface)', border: '1px solid var(--border-color)', maxHeight: '90vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{editingBranch ? 'Update Location' : 'Add New Location'}</h2>
            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
          </div>
          <form onSubmit={handleSaveModal}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Branch Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }} placeholder="e.g. Power World Colombo" />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Cover Photo</label>
                <input type="file" name="photoFile" accept="image/*" onChange={handleChange} required={!editingBranch} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                {editingBranch && typeof formData.photo === 'string' && <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>Leave blank to keep current photo</div>}
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Location Area / City</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Branch Contact Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Manager/Admin Name</label>
                <input type="text" name="adminName" value={formData.adminName} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Manager Phone</label>
                <input type="text" name="adminPhone" value={formData.adminPhone} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Running Since</label>
                <input type="text" name="runningSince" value={formData.runningSince} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }} placeholder="e.g. 2017" />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Operating Hours</label>
                <input type="text" name="operatingHours" value={formData.operatingHours} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }} placeholder="6:00 AM - 10:00 PM" />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '24px', padding: '12px', fontWeight: 'bold' }}>
              {editingBranch ? 'Save Location Changes' : 'Create Location'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  if (selectedGym) {
    const currentStatus = checkStatus(selectedGym.operatingHours, currentTime);
    const isClosed = currentStatus === 'Closed';
    const statusColor = isClosed ? '#FF0000' : '#4caf50';

    return (
      <div className="gym-detail-wrapper" style={{ '--bg-photo': `url(${selectedGym.photo})` }}>
        <div className="detail-overlay">
          <header className="detail-nav-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="back-btn-catchy" onClick={handleCloseDetail}>
              <ArrowLeft size={18} /> Back to Locations
            </button>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-primary" style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }} onClick={() => openEditModal(selectedGym)}>
                <Edit2 size={16} /> Edit Location
              </button>
              <button style={{ background: '#ff4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 'bold' }} onClick={() => handleDelete(selectedGym.id)}>
                <Trash2 size={16} /> Delete Location
              </button>
            </div>
          </header>

          <div className="detail-main-content">
            <header className="gym-header">
              <div className="gym-title-area">
                <div className={`status - badge - compact ${currentStatus.toLowerCase()} `}>
                  <span className="status-light live-pulse"></span> {currentStatus}
                </div>
                <h1 className="gym-detail-name">{selectedGym.name}</h1>
                <p className="gym-detail-loc"><MapPin size={20} /> {selectedGym.location}</p>
              </div>
            </header>

            <div className="gym-info-simple-grid">
              <div className="simple-info-item">
                <div className="info-icon-wrapper">
                  <User size={24} />
                </div>
                <div className="info-text-group">
                  <span className="info-label">GYM ADMIN NAME</span>
                  <span className="info-value">{selectedGym.adminName}</span>
                </div>
              </div>

              <div className="simple-info-item">
                <div className="info-icon-wrapper">
                  <Phone size={24} />
                </div>
                <div className="info-text-group">
                  <span className="info-label">GYM ADMIN PHONE</span>
                  <span className="info-value">{selectedGym.adminPhone}</span>
                </div>
              </div>

              <div className="simple-info-item">
                <div className="info-icon-wrapper">
                  <Calendar size={24} />
                </div>
                <div className="info-text-group">
                  <span className="info-label">RUNNING SINCE</span>
                  <span className="info-value">{selectedGym.runningSince}</span>
                </div>
              </div>

              <div className="simple-info-item" style={{ '--dynamic-color': statusColor }}>
                <div className="info-icon-wrapper status-dynamic live-glow">
                  <Clock size={24} />
                </div>
                <div className="info-text-group">
                  <span className="info-label">OPERATING STATUS</span>
                  <span className="info-value">
                    <span className="status-text-dynamic">{currentStatus}</span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginLeft: '8px' }}>
                      ({selectedGym.operatingHours})
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="gym-inventory-section card">
              <div className="inventory-header-bar">
                <nav className="sub-menu-bar">
                  <button className="sub-menu-item active">
                    <Package size={18} />
                    <span>Gym Equipment Inventory</span>
                  </button>
                </nav>
                <span className="read-only-badge">VIEW ONLY</span>
              </div>

              <div className="inventory-list">
                <div className="inv-table-header">
                  <span>Equipment Item</span>
                  <span>Quantity</span>
                  <span>Condition</span>
                </div>
                {selectedGym.inventory.map((inv, idx) => (
                  <div key={idx} className="inv-table-row">
                    <span className="inv-item-name">{inv.item}</span>
                    <span className="inv-count">{inv.count}</span>
                    <span
                      className="inv-status-pill"
                      style={{
                        color: getConditionColor(inv.condition),
                        borderColor: `${getConditionColor(inv.condition)} 44`,
                        backgroundColor: `${getConditionColor(inv.condition)} 11`
                      }}
                    >
                      {inv.condition}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {renderModal()}
      </div>
    );
  }

  return (
    <div className="locations-view">
      <header className="content-header-search">
        <div className="header-titles">
          <h1 className="page-title">Gym Locations</h1>
          <p className="page-subtitle">Monitoring status across all 24 franchises.</p>
        </div>

        <div className="search-box-container" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search className="search-icon-inside" size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
            <input
              type="text"
              placeholder="Search Location..."
              className="dynamic-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--color-surface)', color: 'var(--color-text)' }}
            />
          </div>
          <button className="btn-primary" onClick={openAddModal} style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Add Location
          </button>
        </div>
      </header>

      <div className="gym-grid">
        {filteredGyms.map((gym) => {
          const gymStatus = checkStatus(gym.operatingHours, currentTime);
          return (
            <div key={gym.id} className="gym-box" onClick={() => handleGymSelect(gym)}>
              <div className="gym-img-container">
                <img src={gym.photo} alt={gym.name} className="gym-preview-img" />
                <div className="gym-status-corner">
                  <div
                    className={`status - glow - orb ${gymStatus.toLowerCase()} `}
                    title={`${gymStatus} (Hours: ${gym.operatingHours})`}
                  >
                    <span className="orb-inner-dot"></span>
                  </div>
                </div>
              </div>
              <div className="gym-box-details">
                <h3 className="gym-name-text">{gym.name}</h3>
                <div className="gym-info-item"><Clock size={14} /> {gym.operatingHours}</div>
                <div className="gym-info-item"><Calendar size={14} /> Running Since {gym.runningSince}</div>
                <div className="gym-info-item"><MapPin size={14} /> {gym.location}</div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredGyms.length === 0 && (
        <div className="no-results">No locations found matching your search.</div>
      )}

      {renderModal()}

    </div>
  );
};

export default Locations;
