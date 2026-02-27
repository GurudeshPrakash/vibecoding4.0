import React, { useState, useEffect } from 'react';
import { Phone, MapPin, ArrowLeft, Calendar, User, Package, Clock, Search, Plus, Edit2, Trash2, X, Activity, ArrowUpRight, Shield, Loader2, Camera } from 'lucide-react';
import '../../style/SuperAdminDashboard.css';

const checkStatus = (hours, now) => {
  if (!hours) return 'Closed';
  try {
    const [start, end] = hours.split(' - ');
    if (!start || !end) return 'Closed';

    const parseTime = (timeStr) => {
      const [time, modifier] = timeStr.split(' ');
      let [h, m] = time.split(':');
      let hr = parseInt(h, 10);
      if (hr === 12) hr = 0;
      if (modifier === 'PM') hr += 12;
      return hr * 60 + parseInt(m, 10);
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
  const [currentTime] = useState(new Date());
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({
    name: '', photo: null, phone: '', location: '', adminName: '', adminPhone: '', runningSince: '', operatingHours: '6:00 AM - 10:00 PM'
  });

  useEffect(() => {
    const handlePopState = () => { if (selectedGym) setSelectedGym(null); };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedGym]);

  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:5000/api/admin/branches', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const mappedBranches = data.map(b => ({ ...b, id: b._id, inventory: b.inventorySummary || [] }));
        setBranches(mappedBranches);
        if (selectedGym) {
          const updatedGym = mappedBranches.find(b => b.id === selectedGym.id);
          if (updatedGym) setSelectedGym(updatedGym);
        }
      }
    } catch (error) {
      console.error('Failed to load branch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBranches(); }, []);

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
    const url = editingBranch ? `http://localhost:5000/api/admin/branches/${editingBranch.id}` : 'http://localhost:5000/api/admin/branches';
    const method = editingBranch ? 'PUT' : 'POST';

    try {
      const dataPayload = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'photo' && formData[key] instanceof File) dataPayload.append('photoFile', formData[key]);
        else if (key !== 'photo' && formData[key] !== null) dataPayload.append(key, formData[key]);
      });

      const response = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` }, body: dataPayload });
      if (response.ok) {
        setShowModal(false);
        fetchBranches();
      }
    } catch (e) { alert('Request failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to completely remove this location?')) return;
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/branches/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) {
        if (selectedGym && selectedGym.id === id) setSelectedGym(null);
        fetchBranches();
      }
    } catch (e) { alert('Delete failed'); }
  };

  const filteredGyms = branches.filter(gym => gym.name.toLowerCase().includes(searchQuery.toLowerCase()) || gym.location.toLowerCase().includes(searchQuery.toLowerCase()));

  const getConditionColor = (c) => {
    const lower = c.toLowerCase();
    if (lower === 'excellent') return '#10B981';
    if (lower === 'good') return '#3B82F6';
    if (lower === 'fair') return '#F59E0B';
    return '#EF4444';
  };

  if (selectedGym) {
    const status = checkStatus(selectedGym.operatingHours, currentTime);
    return (
      <div className="super-admin-dashboard animate-fade-in">
        <header className="sa-header">
          <div className="sa-welcome">
            <button className="icon-btn" onClick={() => setSelectedGym(null)} style={{ marginBottom: '16px' }}><ArrowLeft size={20} /></button>
            <h1>{selectedGym.name}</h1>
            <p><MapPin size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> {selectedGym.location}</p>
          </div>
          <div className="sa-actions">
            <button className="icon-btn" onClick={() => { setEditingBranch(selectedGym); setFormData({ ...selectedGym, photo: selectedGym.photo }); setShowModal(true); }}><Edit2 size={20} /></button>
            <button className="icon-btn" style={{ color: '#EF4444' }} onClick={() => handleDelete(selectedGym.id)}><Trash2 size={20} /></button>
          </div>
        </header>

        <div className="sa-dashboard-layout" style={{ gridTemplateColumns: '1fr 1.5fr', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="sa-card" style={{ padding: 0, overflow: 'hidden' }}>
              <img src={selectedGym.photo} alt={selectedGym.name} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ padding: '8px 16px', borderRadius: '100px', background: status === 'Open' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: status === 'Open' ? '#10B981' : '#EF4444', fontWeight: 800, fontSize: '0.8rem' }}>
                    ● {status.toUpperCase()}
                  </div>
                  <span style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem', fontWeight: 600 }}>{selectedGym.operatingHours}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="icon-circle" style={{ width: 40, height: 40, background: 'rgba(255,0,0,0.05)' }}><User size={20} color="var(--color-red)" /></div>
                    <div><span className="label">Branch Admin</span><div style={{ fontWeight: 700 }}>{selectedGym.adminName}</div></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="icon-circle" style={{ width: 40, height: 40, background: 'rgba(255,0,0,0.05)' }}><Phone size={20} color="var(--color-red)" /></div>
                    <div><span className="label">Contact Line</span><div style={{ fontWeight: 700 }}>{selectedGym.adminPhone}</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sa-card">
            <div className="sa-card-header">
              <h3>Equipment Inventory</h3>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em', background: 'var(--color-bg)', padding: '4px 10px', borderRadius: '4px', color: 'var(--color-text-dim)' }}>INTERNAL AUDIT</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
              {selectedGym.inventory.map((inv, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--color-bg)', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'var(--color-red)' }}>{inv.count}</div>
                    <span style={{ fontWeight: 700 }}>{inv.item}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 900, color: getConditionColor(inv.condition), padding: '4px 12px', borderRadius: '100px', border: `1px solid ${getConditionColor(inv.condition)}44` }}>{inv.condition.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {showModal && renderFormModal()}
      </div>
    );
  }

  const renderFormModal = () => (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="sa-card" style={{ maxWidth: '650px', width: '100%', padding: '40px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900 }}>{editingBranch ? 'Edit Franchise Unit' : 'Establish New Location'}</h2>
          <button onClick={() => setShowModal(false)} className="icon-btn"><X /></button>
        </div>
        <form onSubmit={handleSaveModal}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="label">Center Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="sa-search-bar" style={{ width: '100%', padding: '14px', background: 'var(--color-bg)', color: 'white', borderRadius: '12px', border: '1px solid var(--border-color)' }} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="label">Unit Coverage Photo</label>
              <div style={{ border: '2px dashed var(--border-color)', borderRadius: '16px', padding: '20px', textAlign: 'center', background: 'var(--color-bg)' }}>
                <Camera size={24} style={{ marginBottom: '8px', color: 'var(--color-text-dim)' }} />
                <input type="file" name="photoFile" accept="image/*" onChange={handleChange} required={!editingBranch} style={{ fontSize: '0.8rem' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="label">Geo Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--color-bg)', color: 'white' }} />
            </div>
            <div className="form-group">
              <label className="label">Unit Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--color-bg)', color: 'white' }} />
            </div>
            <div className="form-group">
              <label className="label">Manager/Admin</label>
              <input type="text" name="adminName" value={formData.adminName} onChange={handleChange} required style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--color-bg)', color: 'white' }} />
            </div>
            <div className="form-group">
              <label className="label">Manager Phone</label>
              <input type="text" name="adminPhone" value={formData.adminPhone} onChange={handleChange} required style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--color-bg)', color: 'white' }} />
            </div>
          </div>
          <button type="submit" className="sa-action-btn" style={{ width: '100%', marginTop: '32px', background: 'var(--color-red)', color: 'white', border: 'none', padding: '18px', borderRadius: '16px', fontWeight: 900 }}>
            {editingBranch ? 'Authorize Changes' : 'Complete Activation'}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="super-admin-dashboard">
      <header className="sa-header">
        <div className="sa-welcome">
          <h1>Network Locations</h1>
          <p>Global monitoring of all franchise units and operational status</p>
        </div>
        <div className="sa-actions">
          <div className="sa-search-bar" style={{ width: '350px' }}>
            <Search className="sa-search-icon" size={20} />
            <input type="text" placeholder="Search centers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <button className="icon-btn" onClick={() => { setEditingBranch(null); setFormData({ name: '', photo: null, phone: '', location: '', adminName: '', adminPhone: '', runningSince: '', operatingHours: '6:00 AM - 10:00 PM' }); setShowModal(true); }}><Plus size={22} /></button>
        </div>
      </header>

      <div className="sa-card" style={{ border: 'none', background: 'transparent', padding: 0 }}>
        {isLoading ? (
          <div style={{ padding: '100px', textAlign: 'center' }}><Loader2 className="animate-spin" size={40} color="var(--color-red)" /></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
            {filteredGyms.map(gym => {
              const status = checkStatus(gym.operatingHours, currentTime);
              return (
                <div key={gym.id} className="sa-stat-card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--border-color)' }} onClick={() => setSelectedGym(gym)}>
                  <img src={gym.photo} alt={gym.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.2rem' }}>{gym.name}</h3>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: status === 'Open' ? '#10B981' : '#EF4444', boxShadow: `0 0 10px ${status === 'Open' ? '#10B981' : '#EF4444'}` }}></div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-text-dim)', fontWeight: 600 }}><MapPin size={14} /> {gym.location}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-text-dim)', fontWeight: 600 }}><Clock size={14} /> {gym.operatingHours}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {showModal && renderFormModal()}
    </div>
  );
};

export default Locations;
