import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone, MapPin, ArrowLeft, Calendar, User, Package, Clock, Search, Plus, Edit2, Trash2, X, Activity, ArrowUpRight, Shield, Loader2, Camera, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';
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
  const [branches, setBranches] = useState(() => {
    const saved = localStorage.getItem('mock_branches_db');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'l1', name: 'Power World – Colombo', city: 'Colombo', location: 'Colombo', type: 'AC', status: 'Active', adminName: 'Prakash S.', adminPhone: '+94 77 111 2222', operatingHours: '6:00 AM - 11:00 PM', photo: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80', inventory: [] },
      { id: 'l2', name: 'Power World – Kandy', city: 'Kandy', location: 'Kandy', type: 'Non-AC', status: 'Active', adminName: 'Kamal P.', adminPhone: '+94 81 333 4444', operatingHours: '6:00 AM - 11:00 PM', photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80', inventory: [] },
      { id: 'l3', name: 'Power World – Galle', city: 'Galle', location: 'Galle', type: 'AC', status: 'Inactive', adminName: 'Perera G.', adminPhone: '+94 91 555 6666', operatingHours: '6:00 AM - 10:00 PM', photo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', inventory: [] }
    ];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    type: 'AC',
    status: 'Active',
    managerId: '',
    photo: null,
    phone: '',
    location: '',
    adminName: '',
    adminPhone: '',
    operatingHours: '6:00 AM - 10:00 PM'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = () => { if (selectedGym) setSelectedGym(null); };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedGym]);

  const location = useLocation();
  useEffect(() => {
    if (location.state?.openModal) {
      setEditingBranch(null);
      setFormData({ name: '', photo: null, phone: '', location: '', adminName: '', adminPhone: '', runningSince: '', operatingHours: '6:00 AM - 10:00 PM' });
      setShowModal(true);
    }
  }, [location.state]);

  const fetchBranches = async () => {
    if (branches.length === 0) setIsLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:5000/api/admin/branches', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const mappedBranches = data.map(b => ({ ...b, id: b._id, inventory: b.inventorySummary || [] }));
        setBranches(mappedBranches);
        localStorage.setItem('mock_branches_db', JSON.stringify(mappedBranches));
        if (selectedGym) {
          const updatedGym = mappedBranches.find(b => b.id === selectedGym.id);
          if (updatedGym) setSelectedGym(updatedGym);
        }
      }
    } catch (error) {
      console.warn('Backend reachability issue, using mock data:', error.message);
      const savedMock = localStorage.getItem('mock_branches_db');
      if (savedMock) {
        setBranches(JSON.parse(savedMock));
      } else {
        const defaultMocks = [
          { id: 'l1', name: 'Power World – Colombo', location: 'Colombo', type: 'AC', status: 'Active', adminName: 'Prakash S.', adminPhone: '+94 77 111 2222', operatingHours: '6:00 AM - 11:00 PM', photo: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80', inventory: [] },
          { id: 'l2', name: 'Power World – Kandy', location: 'Kandy', type: 'Non-AC', status: 'Active', adminName: 'Kamal P.', adminPhone: '+94 81 333 4444', operatingHours: '6:00 AM - 11:00 PM', photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80', inventory: [] },
          { id: 'l3', name: 'Power World – Galle', location: 'Galle', type: 'AC', status: 'Inactive', adminName: 'Perera G.', adminPhone: '+94 91 555 6666', operatingHours: '6:00 AM - 10:00 PM', photo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', inventory: [] }
        ];
        setBranches(defaultMocks);
        localStorage.setItem('mock_branches_db', JSON.stringify(defaultMocks));
      }
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
                  <span style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem', fontWeight: 600 }}>{selectedGym.operatingHours}</span>
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
                  <span style={{ fontSize: '0.65rem', fontWeight: 900, color: getConditionColor(inv.condition), padding: '4px 12px', borderRadius: '100px', border: `1px solid ${getConditionColor(inv.condition)}44` }}>{inv.condition.toUpperCase()}</span>
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
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="sa-card" style={{ maxWidth: '650px', width: '100%', padding: '32px', maxHeight: '90vh', overflowY: 'auto', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(255,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={22} color="var(--color-red)" />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0, color: '#1a1a1a' }}>
              {editingBranch ? 'Update Location' : 'Add New Location'}
            </h2>
          </div>
          <button onClick={() => setShowModal(false)} style={{ background: '#f5f5fa', border: 'none', color: '#666', borderRadius: '10px', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
        </div>
        <form onSubmit={handleSaveModal}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>Location Name <span style={{ color: 'red' }}>*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Power World – Colombo" required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600 }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>City <span style={{ color: 'red' }}>*</span></label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Colombo" required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600 }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>Type</label>
              <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, cursor: 'pointer' }}>
                <option value="AC">AC</option>
                <option value="Non-AC">Non-AC</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, cursor: 'pointer' }}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>Assign Manager <span style={{ color: '#666', fontWeight: 500 }}>(Optional)</span></label>
              <select name="managerId" value={formData.managerId} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: '#F9FAFB', fontWeight: 600, cursor: 'pointer' }}>
                <option value="">Select Manager...</option>
                <option value="m1">Prakash S.</option>
                <option value="m2">Kamal P.</option>
              </select>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>Cover Photo</label>
              <div style={{ border: '2px dashed #e2e8f0', borderRadius: '12px', padding: '16px', textAlign: 'center', background: '#F9FAFB' }}>
                <Camera size={24} style={{ marginBottom: '8px', color: '#94a3b8' }} />
                <input type="file" name="photoFile" accept="image/*" onChange={handleChange} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
            <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'white', fontWeight: 800, cursor: 'pointer', color: '#333' }}>
              Cancel
            </button>
            <button type="submit" style={{ flex: 2, padding: '14px', borderRadius: '12px', border: 'none', background: 'var(--color-red)', color: 'white', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,0,0,0.2)' }}>
              {editingBranch ? 'Update Location' : 'Create Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="super-admin-dashboard">
      <header className="sa-header">
        <div className="sa-welcome">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            Location Management
          </h1>
          <p style={{ marginTop: '4px' }}>Manage and monitor all gym locations.</p>
        </div>

        <div className="sa-actions">
          <button className="icon-btn" style={{ background: 'var(--color-red)', color: 'white' }} onClick={() => { setEditingBranch(null); setFormData({ name: '', city: '', type: 'AC', status: 'Active', managerId: '', photo: null, phone: '', location: '', adminName: '', adminPhone: '', operatingHours: '6:00 AM - 10:00 PM' }); setShowModal(true); }} title="Add New Location">
            <MapPin size={22} />
          </button>

          <div className="sa-search-bar" style={{ width: '350px' }}>
            <Search className="sa-search-icon" size={20} />
            <input
              type="text"
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <section className="sa-summary-grid" style={{ marginBottom: '24px' }}>
        <div className="sa-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#FF0000', margin: 0 }}>
              <Building2 size={22} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="label" style={{ margin: 0 }}>Total Gyms</span>
              <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{branches.length}</h2>
            </div>
          </div>
        </div>

        <div className="sa-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="icon-circle" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', margin: 0 }}>
              <CheckCircle2 size={22} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="label" style={{ margin: 0 }}>AC Gyms</span>
              <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{branches.filter(b => b.type === 'AC').length}</h2>
            </div>
          </div>
        </div>

        <div className="sa-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="icon-circle" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', margin: 0 }}>
              <AlertCircle size={22} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="label" style={{ margin: 0 }}>Non-AC Gyms</span>
              <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{branches.filter(b => b.type === 'Non-AC').length}</h2>
            </div>
          </div>
        </div>
      </section>

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
                      <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.1rem' }}>{gym.name}</h3>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: status === 'Open' ? '#10B981' : '#EF4444', boxShadow: `0 0 10px ${status === 'Open' ? '#10B981' : '#EF4444'}` }}></div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--color-text-dim)', fontWeight: 600 }}><MapPin size={14} /> {gym.location}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--color-text-dim)', fontWeight: 600 }}><Clock size={14} /> {gym.operatingHours}</div>
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
