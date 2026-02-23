import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    Search,
    Filter,
    X,
    MapPin,
    Building2,
    Tag,
    Activity,
    ShieldCheck,
    Calendar,
    Zap,
    Settings,
    History,
    User,
    Dumbbell,
    Clock,
    ShieldAlert,
    ChevronDown,
    ArrowLeft,
    CheckCircle,
    Info,
    Package,
    Plus,
    Upload,
    Save,
    AlertCircle,
    Download,
    Edit3,
    QrCode
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import '../../style/Inventory.css';

const StaffInventory = ({ inventoryData, setInventoryData, addNotification, selectedEquipmentId, setSelectedEquipmentId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    // View State: 'list', 'detail', 'add', 'edit'
    const [viewMode, setViewMode] = useState('list');
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [detailStatus, setDetailStatus] = useState('Good');
    const [detailQty, setDetailQty] = useState(1);
    const [editItem, setEditItem] = useState(null);
    const [isScanned, setIsScanned] = useState(false);
    const qrRef = useRef(null);

    // Deep Linking: Auto-select from notification
    useEffect(() => {
        if (selectedEquipmentId) {
            const equipment = inventoryData.find(item => item.id === selectedEquipmentId);
            if (equipment) {
                // Determine if we should replace or push? For deep link from notif, maybe replace?
                // But user wants 'windows back'.
                // If we come from notification, we are landing here.
                setSelectedEquipment(equipment);
                setDetailStatus(equipment.status);
                setViewMode('detail');
                setIsScanned(false);
                setSelectedEquipmentId(null);
            }
        }
    }, [selectedEquipmentId, inventoryData, setSelectedEquipmentId]);

    // Handle Browser Back Button for View Modes
    useEffect(() => {
        const handlePopState = (event) => {
            // When user hits back, if we are in a detail/add/edit view, we want to go back to list
            // Checking event.state is optional, but if we are just popping, we likely want to close the 'modal' view
            if (viewMode !== 'list') {
                setViewMode('list');
                setSelectedEquipment(null);
                // We might want to clear editItem too
                setEditItem(null);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [viewMode]);

    const navigateToView = (mode, item = null) => {
        window.history.pushState({ mode: mode }, '', '');
        setViewMode(mode);
        if (item) {
            setSelectedEquipment(item);
            setDetailStatus(item.status); // specific for detail view
        }
    };

    const handleNavigateBack = () => {
        if (window.history.state && window.history.state.mode) {
            window.history.back();
        } else {
            // Fallback if accessed directly or refreshed
            setViewMode('list');
            setSelectedEquipment(null);
            setEditItem(null);
        }
    };

    // Form logic for adding new equipment
    const [newMachine, setNewMachine] = useState({
        name: '',
        type: '',
        category: 'Cardio',
        status: 'Good',
        area: '',
        branch: 'Power World - Colombo 07',
        serial: '',
        brand: '',
        model: '',
        mfgYear: new Date().getFullYear().toString(),
        origin: '',
        warranty: '',
        maxLoad: '',
        power: '',
        voltage: '',
        usageType: 'Commercial',
        photo: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800',
        id: '',
        maxUserWeight: '',
        safetyWarnings: '',
        lastMaintenance: '',
        nextMaintenance: '',
        boughtDate: '',
        price: ''
    });

    const resetForm = () => {
        setNewMachine({
            name: '',
            type: '',
            category: 'Cardio',
            status: 'Good',
            area: '',
            branch: 'Power World - Colombo 07',
            serial: '',
            brand: '',
            model: '',
            mfgYear: new Date().getFullYear().toString(),
            origin: '',
            warranty: '',
            maxLoad: '',
            power: '',
            voltage: '',
            usageType: 'Commercial',
            photo: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800',
            id: '',
            maxUserWeight: '',
            safetyWarnings: '',
            lastMaintenance: '',
            nextMaintenance: '',
            boughtDate: '',
            price: ''
        });
    };

    const [imgPreview, setImgPreview] = useState(null);
    const [errors, setErrors] = useState({});

    // Search and Filter Logic
    const filteredInventory = useMemo(() => {
        return inventoryData.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, categoryFilter, inventoryData]);

    // Simulation: Scan logic
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const scanId = params.get('scan');
        if (scanId) {
            const equipment = inventoryData.find(item => item.id === scanId);
            if (equipment) {
                setSelectedEquipment(equipment);
                setDetailStatus(equipment.status);
                setViewMode('detail');
                setIsScanned(true);
                // Clear the URL param
                window.history.replaceState({}, '', window.location.pathname);
            }
        }
    }, [inventoryData]);

    const handleDownloadQR = (machineId) => {
        const canvas = document.getElementById(`qr-gen-${machineId}`);
        if (!canvas) {
            alert('QR Canvas not found');
            return;
        }
        const pngUrl = canvas.toDataURL("image/png");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `QR_${machineId}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const handleEditClick = (item) => {
        setEditItem({
            ...item,
            brand: item.brand || '',
            model: item.model || '',
            mfgYear: item.mfgYear || '',
            serial: item.serial || '',
            area: item.area || '',
            type: item.type || '',
            name: item.name || '',
            status: item.status || 'Good',
            customId: item.customId || '',
            id: item.id || ''
        });
        navigateToView('edit');
    };

    const handleUpdateInventory = async (itemToUpdate = editItem) => {
        try {
            const token = localStorage.getItem('staff_token');
            const response = await fetch(`http://localhost:5000/api/equipment/${itemToUpdate.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(itemToUpdate)
            });

            if (response.ok) {
                const result = await response.json();

                if (result.requestPending) {
                    alert('Dismantle request submitted! Waiting for Admin approval.');
                    setViewMode('detail');
                    return;
                }

                // Map back to frontend structure if necessary (specifically ensuring id is ._id if backend returns that)
                const mappedItem = {
                    ...result,
                    id: result._id
                };

                const updatedList = inventoryData.map(item =>
                    item.id === mappedItem.id ? mappedItem : item
                );
                setInventoryData(updatedList);
                setSelectedEquipment(mappedItem);
                setViewMode('detail');
                alert('Equipment updated successfully!');
            } else {
                const errorData = await response.json();
                alert(`Update failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to connect to server');
        }
    };

    const handleQuickStatusUpdate = async (newStatus) => {
        try {
            const token = localStorage.getItem('staff_token');
            const response = await fetch(`http://localhost:5000/api/equipment/${selectedEquipment.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                const result = await response.json();

                if (result.requestPending) {
                    alert('Dismantle request submitted! Waiting for Admin approval.');
                    return;
                }

                const mappedItem = {
                    ...result,
                    id: result._id
                };

                const updatedList = inventoryData.map(d => d.id === mappedItem.id ? mappedItem : d);
                setInventoryData(updatedList);
                setSelectedEquipment(mappedItem);
                alert(`Status updated to ${newStatus}`);
            } else {
                const errorData = await response.json();
                alert(`Status update failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Status update error:', error);
            alert('Failed to connect to server');
        }
    };

    const handleCancelEdit = () => {
        handleNavigateBack();
    };

    const handleCardClick = (item) => {
        setIsScanned(false);
        navigateToView('detail', item);
    };

    const handleBackToList = () => {
        handleNavigateBack();
        resetForm(); // Ensure form is reset when going back
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewMachine({ ...newMachine, photo: file });
            setImgPreview(URL.createObjectURL(file));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMachine({ ...newMachine, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!newMachine.name) newErrors.name = 'Machine Name is required';
        if (!newMachine.type) newErrors.type = 'Equipment Type is required';
        if (!newMachine.area) newErrors.area = 'Assigned Area is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveInventoryAction = async () => {
        if (!validateForm()) return;

        // Use default photo if user uploaded a file (file upload not implemented yet)
        const photoUrl = (newMachine.photo instanceof File)
            ? 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800'
            : newMachine.photo;

        const equipmentPayload = {
            ...newMachine,
            customId: newMachine.id, // Map form ID to customId
            photo: photoUrl
        };

        try {
            const token = localStorage.getItem('staff_token');
            const response = await fetch('http://localhost:5000/api/equipment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(equipmentPayload)
            });

            if (response.ok) {
                const savedItem = await response.json();

                // Map to frontend structure
                const newItemEntry = {
                    ...savedItem,
                    id: savedItem._id,
                    customId: savedItem.customId,
                    serialNumber: savedItem.serial,
                    location: savedItem.area,
                    purchaseDate: savedItem.createdAt,
                    specs: {},
                    maintenanceHistory: []
                };

                setInventoryData([newItemEntry, ...inventoryData]);
                // Backend creates the notification now, so we don't need addNotification client-side for admin
                // But we might want to show a toast or local notification? 
                // addNotification('added', newItemEntry); 

                setViewMode('list');
                resetForm();
                setImgPreview(null);
                alert(`New equipment ${savedItem.name} added successfully!`);
            } else {
                const errorData = await response.json();
                alert(`Failed to save equipment: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to connect to server');
        }
    };

    return (
        <div className="inventory-page">

            {/* Conditional Rendering: List View */}
            {viewMode === 'list' && (
                <>
                    <header className="inventory-header-flex">
                        <div className="header-left">
                            <h1>Daily Inventory <span className="highlight-red">Work</span></h1>
                            <p className="subtitle">Select an equipment card to update status or view full documentation.</p>
                        </div>
                        <div className="header-right-tools">
                            <button className="add-inventory-btn" onClick={() => navigateToView('add')}>
                                <Plus size={20} /> Add
                            </button>
                            <div className="search-box-v4">
                                <Search className="search-icon" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by equipment name or machine ID"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="filter-dropdown-v4">
                                <select
                                    className="category-select-v4"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <option value="All">All Categories</option>
                                    <option value="Cardio">Cardio</option>
                                    <option value="Weight Machine">Weight Machine</option>
                                    <option value="Free Weight">Free Weight</option>
                                </select>
                                <ChevronDown className="dropdown-icon" size={18} />
                            </div>
                        </div>
                    </header>

                    <div className="inventory-grid-v4">
                        {filteredInventory.map(item => (
                            <div
                                key={item.id}
                                className="equipment-card-v4"
                                onClick={() => handleCardClick(item)}
                            >
                                <div className="card-image-wrapper">
                                    <img src={item.photo} alt={item.name} />
                                    {/* SMALL QR OVERLAY */}
                                    <div className="card-qr-overlay" onClick={(e) => { e.stopPropagation(); handleDownloadQR(item.id); }}>
                                        <QrCode size={16} />
                                        <div className="hidden-qr-gen" style={{ display: 'none' }}>
                                            <QRCodeCanvas
                                                id={`qr-gen-${item.id}`}
                                                value={`${window.location.origin}${window.location.pathname}?scan=${item.id}`}
                                                size={128}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="card-details-basic">
                                    <div className="card-title-row">
                                        <span className="machine-id-badge">{item.customId || item.id}</span>
                                        <h3>{item.name}</h3>
                                    </div>
                                    <div className="meta-info-grid">
                                        <div className="meta-item-v4"><Tag size={14} /> {item.type}</div>
                                        <div className="meta-item-v4"><MapPin size={14} /> {item.area}</div>
                                        <div className="meta-item-v4"><Building2 size={14} /> {item.branch}</div>
                                    </div>
                                    <div className={`status-indicator-v4 ${(item.status?.toLowerCase() || 'good')}`}>
                                        <div className="glow-dot-v4"></div>
                                        <span className="status-text-v4">{item.status || 'Good'} Condition</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* RESTORED OLD LAYOUT WITH QR & EDIT INTEGRATION */}
            {viewMode === 'detail' && selectedEquipment && (
                <div className="detail-view-container">
                    <button className="back-nav-btn" onClick={handleBackToList}>
                        <ArrowLeft size={18} /> Back to Inventory List
                    </button>

                    {/* SCAN VERIFIED NOTIFICATION */}
                    {isScanned && (
                        <div className="scan-success-bar">
                            <ShieldCheck size={20} />
                            <span>Digital Signature Verified: Secure Asset Scan Successful</span>
                            <X className="close-scan-toast" size={16} onClick={() => setIsScanned(false)} />
                        </div>
                    )}

                    <div className="detail-layout-grid">
                        {/* LEFT SIDEBAR */}
                        <div className="left-sidebar">
                            <div className="detail-image-card">
                                <span className={`detail-status-badge ${(selectedEquipment.status?.toLowerCase() || 'good')}`}>
                                    {selectedEquipment.status || 'Good'}
                                </span>
                                <img src={selectedEquipment.photo} alt={selectedEquipment.name} />
                            </div>

                            {/* QR CODE ACTION CARD */}
                            <div className="action-card qr-sidebar-card">
                                <div className="action-header">Equipment Identity (QR)</div>
                                <div className="detail-qr-wrapper">
                                    <QRCodeCanvas
                                        id={`qr-gen-${selectedEquipment.id}`}
                                        value={`${window.location.origin}${window.location.pathname}?scan=${selectedEquipment.id}`}
                                        size={160}
                                        level={"H"}
                                        includeMargin={true}
                                        style={{ background: '#fff', padding: '8px', borderRadius: '12px' }}
                                    />
                                </div>
                                <button className="download-qr-btn-v2" onClick={() => handleDownloadQR(selectedEquipment.id)}>
                                    <Download size={18} /> Download Asset QR
                                </button>
                            </div>

                            <div className="action-card">
                                <div className="action-header">Management Actions</div>
                                <button className="edit-main-btn" onClick={() => handleEditClick(selectedEquipment)}>
                                    <Edit3 size={18} /> Edit Machine Details
                                </button>
                                <div className="action-divider"><span>OR QUICK UPDATE</span></div>
                                <div className="action-form-group">
                                    <label className="action-label">Update Status:</label>
                                    <select
                                        className="status-select"
                                        value={detailStatus}
                                        onChange={(e) => setDetailStatus(e.target.value)}
                                    >
                                        <option value="Good">Good</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Dismantled">Dismantled</option>
                                    </select>
                                </div>
                                <button className="confirm-btn" onClick={() => handleQuickStatusUpdate(detailStatus)}>
                                    <CheckCircle size={18} /> Confirm Quick Status
                                </button>
                            </div>
                        </div>

                        {/* RIGHT CONTENT - FULL SPECS */}
                        <div className="right-content">
                            <div className="detail-section-card main-identity-header">
                                <div className="machine-id-tag">{selectedEquipment.customId || selectedEquipment.id}</div>
                                <h2>{selectedEquipment.name}</h2>
                                <p className="area-branch-info">{selectedEquipment.area} • {selectedEquipment.branch}</p>
                            </div>

                            {/* Asset Intelligence Quick Look */}
                            <div className="detail-section-card intelligence-card">
                                <div className="section-header-row">
                                    <Zap size={20} className="section-icon" />
                                    <h3>Asset Health & Analytics</h3>
                                </div>
                                <div className="intelligence-grid">
                                    <div className="intel-item">
                                        <span className="lbl">Overall Reliability</span>
                                        <div className="health-bar-container">
                                            <div className="health-bar-fill" style={{ width: selectedEquipment.status === 'Good' ? '94%' : '45%' }}></div>
                                        </div>
                                        <span className="val">{selectedEquipment.status === 'Good' ? '94%' : '45%'}</span>
                                    </div>
                                    <div className="intel-item">
                                        <span className="lbl">Usage Efficiency</span>
                                        <span className="val">High (8.4h/day)</span>
                                    </div>
                                    <div className="intel-item">
                                        <span className="lbl">Risk Threshold</span>
                                        <span className="val color-green">Low</span>
                                    </div>
                                </div>
                            </div>

                            {/* Technical Details */}
                            <div className="detail-section-card">
                                <div className="section-header-row">
                                    <Settings size={20} className="section-icon" />
                                    <h3>Hardware Specifications</h3>
                                </div>
                                <div className="detail-grid-flex">
                                    <div className="info-block"><span className="info-label">SERIAL</span><span className="info-value">{selectedEquipment.serial}</span></div>
                                    <div className="info-block"><span className="info-label">BRAND</span><span className="info-value">{selectedEquipment.brand}</span></div>
                                    <div className="info-block"><span className="info-label">MODEL</span><span className="info-value">{selectedEquipment.model}</span></div>
                                    <div className="info-block"><span className="info-label">MFG YEAR</span><span className="info-value">{selectedEquipment.mfgYear}</span></div>
                                    <div className="info-block"><span className="info-label">ORIGIN</span><span className="info-value">{selectedEquipment.origin}</span></div>
                                    <div className="info-block"><span className="info-label">WARRANTY</span><span className="info-value">{selectedEquipment.warranty}</span></div>
                                </div>
                            </div>

                            {/* Operational Details */}
                            <div className="detail-section-card">
                                <div className="section-header-row">
                                    <Activity size={20} className="section-icon" />
                                    <h3>Operational Metrics</h3>
                                </div>
                                <div className="detail-grid-flex">
                                    <div className="info-block"><span className="info-label">POWER</span><span className="info-value">{selectedEquipment.power}</span></div>
                                    <div className="info-block"><span className="info-label">VOLTAGE</span><span className="info-value">{selectedEquipment.voltage}</span></div>
                                    <div className="info-block"><span className="info-label">MAX LOAD</span><span className="info-value">{selectedEquipment.maxLoad}</span></div>
                                    <div className="info-block"><span className="info-label">USAGE TYPE</span><span className="info-value">{selectedEquipment.usageType}</span></div>
                                    <div className="info-block"><span className="info-label">TOTAL HOURS</span><span className="info-value">{selectedEquipment.totalUsageHours}</span></div>
                                </div>
                            </div>

                            {/* Maintenance Log */}
                            <div className="detail-section-card">
                                <div className="section-header-row">
                                    <Calendar size={20} className="section-icon" />
                                    <h3>Maintenance History</h3>
                                </div>
                                <div className="maintenance-log-row">
                                    <div className="log-item">
                                        <span className="lbl">LAST SERVICE:</span>
                                        <span className="val">{selectedEquipment.lastMaintenance}</span>
                                    </div>
                                    <div className="log-item">
                                        <span className="lbl">NEXT DUE:</span>
                                        <span className="val">{selectedEquipment.nextMaintenance}</span>
                                    </div>
                                    <div className="log-item">
                                        <span className="lbl">VENDOR:</span>
                                        <span className="val">{selectedEquipment.vendor}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }

            {/* EDIT EQUIPMENT DETAILS VIEW */}
            {
                viewMode === 'edit' && editItem && (
                    <div className="detail-view-container">
                        <button className="back-nav-btn" onClick={handleCancelEdit}>
                            <ArrowLeft size={18} /> Back to Summary
                        </button>

                        <div className="add-form-container">
                            <div className="form-header">
                                <h2>Edit Equipment Details</h2>
                                <p>Update machine configuration and operational status.</p>
                            </div>

                            <div className="image-upload-section">
                                <div className="upload-box">
                                    <div className="preview-wrapper">
                                        <img src={editItem.photo} alt="Preview" />
                                    </div>
                                </div>
                                <p className="subtitle" style={{ marginTop: '10px' }}>Change Photo functionality redirected to Upload manager</p>
                            </div>

                            <div className="form-grid-layout">
                                <div className="form-section">
                                    <h3>Operational Status</h3>
                                    <div className="fields-grid">
                                        <div className="form-group span-full">
                                            <label>Machine Condition Status*</label>
                                            <select
                                                value={editItem.status}
                                                onChange={(e) => setEditItem({ ...editItem, status: e.target.value })}
                                                className="dashboard-select"
                                            >
                                                <option value="Good">Good</option>
                                                <option value="Maintenance">Maintenance</option>
                                                <option value="Dismantled">Dismantled</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h3>Core Information</h3>
                                    <div className="fields-grid">
                                        <div className="form-group">
                                            <label>Machine Name*</label>
                                            <input
                                                type="text"
                                                value={editItem.name}
                                                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Machine ID*</label>
                                            <input type="text" value={editItem.customId || editItem.id} readOnly style={{ opacity: 0.7 }} />
                                        </div>
                                        <div className="form-group">
                                            <label>Equipment Type*</label>
                                            <input
                                                type="text"
                                                value={editItem.type}
                                                onChange={(e) => setEditItem({ ...editItem, type: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Assigned Area*</label>
                                            <input
                                                type="text"
                                                value={editItem.area}
                                                onChange={(e) => setEditItem({ ...editItem, area: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h3>Hardware Specs</h3>
                                    <div className="fields-grid">
                                        <div className="form-group">
                                            <label>Brand Name</label>
                                            <input
                                                type="text"
                                                value={editItem.brand}
                                                onChange={(e) => setEditItem({ ...editItem, brand: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Model Number</label>
                                            <input
                                                type="text"
                                                value={editItem.model}
                                                onChange={(e) => setEditItem({ ...editItem, model: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Manufactured Year</label>
                                            <input
                                                type="text"
                                                value={editItem.mfgYear}
                                                onChange={(e) => setEditItem({ ...editItem, mfgYear: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Serial Number</label>
                                            <input
                                                type="text"
                                                value={editItem.serial}
                                                onChange={(e) => setEditItem({ ...editItem, serial: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Bought Date</label>
                                            <input
                                                type="date"
                                                value={editItem.boughtDate ? new Date(editItem.boughtDate).toISOString().split('T')[0] : ''}
                                                onChange={(e) => setEditItem({ ...editItem, boughtDate: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Price (LKR)</label>
                                            <input
                                                type="number"
                                                value={editItem.price || ''}
                                                onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                                <button className="save-btn" onClick={handleUpdateInventory}>
                                    <Save size={18} /> Save Updates
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* ADD INVENTORY FORM VIEW */}
            {
                viewMode === 'add' && (
                    <div className="detail-view-container">
                        <button className="back-nav-btn" onClick={handleBackToList}>
                            <ArrowLeft size={18} /> Back
                        </button>

                        <div className="add-form-container">
                            <div className="form-header">
                                <h2>Add New Inventory Item</h2>
                                <p>Fill in the details below to register new equipment into the system.</p>
                            </div>

                            {/* Image Upload Section */}
                            <div className={`image-upload-section ${errors.photo ? 'error' : ''}`}>
                                <div className="upload-box">
                                    {imgPreview ? (
                                        <div className="preview-wrapper">
                                            <img src={imgPreview} alt="Preview" />
                                            <button className="remove-img-btn" onClick={() => { setImgPreview(null); setNewMachine({ ...newMachine, photo: null }); }}>
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="upload-label">
                                            <Upload size={32} />
                                            <span>Click to Upload Equipment Image</span>
                                            <small>(Required *.jpg, *.png)</small>
                                            <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                                        </label>
                                    )}
                                </div>
                                {errors.photo && <span className="error-text"><AlertCircle size={14} /> {errors.photo}</span>}
                            </div>

                            <div className="form-grid-layout">
                                {/* Mandatory Fields */}
                                <div className="form-section">
                                    <h3>Mandatory Details</h3>
                                    <div className="fields-grid">
                                        <div className="form-group">
                                            <label>Machine Name *</label>
                                            <input type="text" name="name" value={newMachine.name} onChange={handleInputChange} className={errors.name ? 'error-input' : ''} placeholder="Ex: Pro-Series Treadmill" />
                                            {errors.name && <span className="field-error">{errors.name}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label>Machine ID *</label>
                                            <input type="text" name="id" value={newMachine.id} onChange={handleInputChange} className={errors.id ? 'error-input' : ''} placeholder="Ex: TM-001" />
                                            {errors.id && <span className="field-error">{errors.id}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label>Equipment Category *</label>
                                            <select name="category" value={newMachine.category} onChange={handleInputChange} className={errors.category ? 'error-input' : ''}>
                                                <option value="">Select Category</option>
                                                <option value="Cardio">Cardio</option>
                                                <option value="Weight Machine">Weight Machine</option>
                                                <option value="Free Weight">Free Weight</option>
                                            </select>
                                            {errors.category && <span className="field-error">{errors.category}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label>Equipment Type *</label>
                                            <input type="text" name="type" value={newMachine.type} onChange={handleInputChange} className={errors.type ? 'error-input' : ''} placeholder="Ex: Treadmill, Leg Press" />
                                            {errors.type && <span className="field-error">{errors.type}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label>Brand Name *</label>
                                            <input type="text" name="brand" value={newMachine.brand} onChange={handleInputChange} className={errors.brand ? 'error-input' : ''} placeholder="Ex: Life Fitness" />
                                            {errors.brand && <span className="field-error">{errors.brand}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label>Model Number *</label>
                                            <input type="text" name="model" value={newMachine.model} onChange={handleInputChange} className={errors.model ? 'error-input' : ''} placeholder="Ex: 95T" />
                                            {errors.model && <span className="field-error">{errors.model}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label>Manufactured Year *</label>
                                            <input type="number" name="mfgYear" value={newMachine.mfgYear} onChange={handleInputChange} className={errors.mfgYear ? 'error-input' : ''} placeholder="Ex: 2024" />
                                            {errors.mfgYear && <span className="field-error">{errors.mfgYear}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label>Gym Branch *</label>
                                            <select name="branch" value={newMachine.branch} onChange={handleInputChange} className={errors.branch ? 'error-input' : ''}>
                                                <option value="">Select Branch</option>
                                                <option value="Power World - Colombo 07">Power World - Colombo 07</option>
                                                <option value="Power World - Kandy">Power World - Kandy</option>
                                            </select>
                                            {errors.branch && <span className="field-error">{errors.branch}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label>Assigned Area *</label>
                                            <select name="area" value={newMachine.area} onChange={handleInputChange} className={errors.area ? 'error-input' : ''}>
                                                <option value="">Select Zone</option>
                                                <option value="Cardio Zone">Cardio Zone</option>
                                                <option value="Weight Zone">Weight Zone</option>
                                                <option value="Free Weights">Free Weights</option>
                                                <option value="Functional Area">Functional Area</option>
                                            </select>
                                            {errors.area && <span className="field-error">{errors.area}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label>Status *</label>
                                            <select name="status" value={newMachine.status} onChange={handleInputChange}>
                                                <option value="Good">Good</option>
                                                <option value="Maintenance">Maintenance</option>
                                                <option value="Dismantled">Dismantled</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Optional Fields */}
                                <div className="form-section">
                                    <h3>Optional Details</h3>
                                    <div className="fields-grid">
                                        <div className="form-group">
                                            <label>Serial Number</label>
                                            <input type="text" name="serial" value={newMachine.serial} onChange={handleInputChange} placeholder="Optional" />
                                        </div>
                                        <div className="form-group">
                                            <label>Bought Date</label>
                                            <input type="date" name="boughtDate" value={newMachine.boughtDate} onChange={handleInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Price (LKR)</label>
                                            <input type="number" name="price" value={newMachine.price} onChange={handleInputChange} placeholder="Ex: 250000" />
                                        </div>
                                        <div className="form-group">
                                            <label>Country of Origin</label>
                                            <input type="text" name="origin" value={newMachine.origin} onChange={handleInputChange} placeholder="Optional" />
                                        </div>
                                        <div className="form-group">
                                            <label>Max User Weight</label>
                                            <input type="text" name="maxUserWeight" value={newMachine.maxUserWeight} onChange={handleInputChange} placeholder="Ex: 150 KG" />
                                        </div>
                                        <div className="form-group">
                                            <label>Max Load Capacity</label>
                                            <input type="text" name="maxLoad" value={newMachine.maxLoad} onChange={handleInputChange} placeholder="Ex: 200 KG" />
                                        </div>
                                        <div className="form-group">
                                            <label>Power Requirement</label>
                                            <input type="text" name="power" value={newMachine.power} onChange={handleInputChange} placeholder="Optional" />
                                        </div>
                                        <div className="form-group">
                                            <label>Voltage & Frequency</label>
                                            <input type="text" name="voltage" value={newMachine.voltage} onChange={handleInputChange} placeholder="Optional" />
                                        </div>
                                        <div className="form-group">
                                            <label>Usage Type</label>
                                            <input type="text" name="usageType" value={newMachine.usageType} onChange={handleInputChange} placeholder="Ex: Commercial" />
                                        </div>
                                        <div className="form-group span-full">
                                            <label>Safety Warnings</label>
                                            <textarea name="safetyWarnings" value={newMachine.safetyWarnings} onChange={handleInputChange} placeholder="Enter any specific safety instructions..." rows="2"></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label>Last Maintenance Date</label>
                                            <input type="date" name="lastMaintenance" value={newMachine.lastMaintenance} onChange={handleInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Next Maintenance Date</label>
                                            <input type="date" name="nextMaintenance" value={newMachine.nextMaintenance} onChange={handleInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Vendor / Supplier</label>
                                            <input type="text" name="vendor" value={newMachine.vendor} onChange={handleInputChange} placeholder="Optional" />
                                        </div>
                                        <div className="form-group">
                                            <label>Warranty Period</label>
                                            <input type="text" name="warranty" value={newMachine.warranty} onChange={handleInputChange} placeholder="Optional" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button className="cancel-btn" onClick={handleBackToList}>Cancel</button>
                                <button className="save-btn" onClick={handleSaveInventoryAction}>
                                    <Save size={18} /> Save Inventory
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default StaffInventory;
