import React, { useState, useEffect } from 'react';
import { Phone, MapPin, ArrowLeft, Calendar, User, Package, Clock, Search } from 'lucide-react';
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

  // Fetch branches from database
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch('http://localhost:5000/api/admin/branches', {
          headers: { 'Authorization': `Bearer ${token} ` }
        });
        if (response.ok) {
          const data = await response.json();
          // Transform if necessary or use directly if schema matches
          // Schema matches: name, photo, phone, location, adminName, adminPhone, runningSince, operatingHours, inventorySummary
          // Ensure we map '_id' to 'id' for the frontend key
          const mappedBranches = data.map(b => ({
            ...b,
            id: b._id,
            inventory: b.inventorySummary || []
          }));
          setBranches(mappedBranches);
        } else {
          // Handle empty or error
          setBranches([]);
        }
      } catch (error) {
        console.error('Failed to load branch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBranches();
  }, []);

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

  if (selectedGym) {
    const currentStatus = checkStatus(selectedGym.operatingHours, currentTime);
    const isClosed = currentStatus === 'Closed';
    const statusColor = isClosed ? '#FF0000' : '#4caf50';

    return (
      <div className="gym-detail-wrapper" style={{ '--bg-photo': `url(${selectedGym.photo})` }}>
        <div className="detail-overlay">
          <header className="detail-nav-header">
            <button className="back-btn-catchy" onClick={handleCloseDetail}>
              <ArrowLeft size={18} /> Back to Locations
            </button>
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

        <div className="search-box-container">
          <Search className="search-icon-inside" size={20} />
          <input
            type="text"
            placeholder="Search Location"
            className="dynamic-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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

    </div>
  );
};

export default Locations;
