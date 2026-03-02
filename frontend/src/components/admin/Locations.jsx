import React, { useState, useMemo, useEffect } from 'react';
import { Phone, MapPin, ArrowLeft, Calendar, User, Package, Clock, Search } from 'lucide-react';
import '../../style/AdminLocations.css';

const Locations = () => {
  const [selectedGym, setSelectedGym] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // No interval needed for live time as per user request to simplify
  useEffect(() => {
    // Current time is set once on mount
  }, []);

  const [managers, setManagers] = useState([]);

  // Fetch real managers from backend to sync with Locations
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch('http://localhost:5000/api/admin/staff', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setManagers(data);
        }
      } catch (error) {
        console.error('Failed to load manager data:', error);
      }
    };
    fetchManagers();
  }, []);

  // 24 Sri Lankan Locations
  const lankanLocations = [
    "Wellawatte", "Bambalapitiya", "Kollupitiya", "Kandy", "Galle",
    "Matara", "Jaffna", "Negombo", "Wattala", "Dehiwala",
    "Mount Lavinia", "Ratnapura", "Anuradhapura", "Polonnaruwa", "Kurunegala",
    "Gampaha", "Kalutara", "Panadura", "Batticaloa", "Trincomalee",
    "Nuwara Eliya", "Badulla", "Avissawella", "Maharagama"
  ];

  // Helper to determine status based on hours
  const checkStatus = (hours, now) => {
    if (hours === "24 Hours") return "Open";

    const currentHour = now.getHours();
    const [openStr, closeStr] = hours.split(' - ');

    const parseTime = (str) => {
      const [time, period] = str.split(' ');
      let [h] = time.split(':').map(Number);
      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      return h;
    };

    const openHour = parseTime(openStr);
    const closeHour = parseTime(closeStr);

    if (closeHour > openHour) {
      return (currentHour >= openHour && currentHour < closeHour) ? "Open" : "Closed";
    } else {
      // Over-night case (e.g. 6 PM - 6 AM)
      return (currentHour >= openHour || currentHour < closeHour) ? "Open" : "Closed";
    }
  };

  // Predefined Real Names for Managers (Gym Owners)
  const realManagerNames = [
    "Viyas Karunaratne", "Shana Perera", "Guru Nanayakkara", "Shayani Mendis", "Kasun Jayawardena",
    "Dinuka Silva", "Amara Fernando", "Rohan Wickramasinghe", "Janaka Gunawardena", "Lina Abeywickrama",
    "Tharindu Ratnayake", "Mahesh Senanayake", "Dilani Wijetunga", "Asanka Bandara", "Nimali Herath",
    "Saman Kumara", "Priyanka De Silva", "Chaminda Lokuge", "Isuru Rajapaksa", "Dinesh Koddithuwakku",
    "Sanjeewa Gamage", "Ruvini Fonseka", "Malith Weerasinghe", "Nilanthi Premaratne"
  ];

  // Generate 24 mock gyms with Sri Lankan locations and diverse hours
  const allGyms = useMemo(() => Array.from({ length: 24 }, (_, i) => {
    let hours;
    if (i % 5 === 0) hours = "24 Hours";
    else if (i % 3 === 0) hours = "6:00 AM - 10:00 PM";
    else if (i % 2 === 0) hours = "5:00 AM - 11:00 PM";
    else hours = "8:00 AM - 8:00 PM";

    // Check if a real manager is assigned to this branch
    const assignedManager = managers.find(m => m.branch === lankanLocations[i]);

    return {
      id: i + 1,
      name: `${lankanLocations[i]} Fitness Elite`,
      photo: `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800&h=600&gym=${i + 1}`,
      phone: `+94 11 234 ${5000 + i}`,
      location: `${lankanLocations[i]}, Sri Lanka`,
      // Use fetched manager if exists, otherwise fallback to placeholder name
      adminName: assignedManager ? `${assignedManager.firstName} ${assignedManager.lastName}` : realManagerNames[i],
      adminPhone: assignedManager ? assignedManager.phone : `+94 77 123 ${4000 + i}`,
      runningSince: `${2 + (i % 5)} years`,
      operatingHours: hours,
      inventory: [
        { item: 'Treadmills', count: 12, condition: 'Excellent' },
        { item: 'Dumbbell Sets', count: 24, condition: 'Good' },
        { item: 'Power Racks', count: 5, condition: 'Excellent' },
        { item: 'Bench Press', count: 8, condition: 'Fair' },
        { item: 'Leg Press', count: 3, condition: 'Good' },
      ]
    };
  }), [managers]);

  // Filter gyms based on search query
  const filteredGyms = allGyms.filter(gym =>
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
            <button className="back-btn-catchy" onClick={() => setSelectedGym(null)}>
              <ArrowLeft size={18} /> Back to Locations
            </button>
          </header>

          <div className="detail-main-content">
            <header className="gym-header">
              <div className="gym-title-area">
                <div className={`status-badge-compact ${currentStatus.toLowerCase()}`}>
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
                        borderColor: `${getConditionColor(inv.condition)}44`,
                        backgroundColor: `${getConditionColor(inv.condition)}11`
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
            <div key={gym.id} className="gym-box" onClick={() => setSelectedGym(gym)}>
              <div className="gym-img-container">
                <img src={gym.photo} alt={gym.name} className="gym-preview-img" />
                <div className="gym-status-corner">
                  <div
                    className={`status-glow-orb ${gymStatus.toLowerCase()}`}
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
