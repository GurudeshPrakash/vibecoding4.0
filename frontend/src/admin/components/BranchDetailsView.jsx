import React, { useState, useRef } from 'react';
import {
    MapPin, Clock, Phone, Mail, Building2, Users,
    ArrowLeft, Edit2, Trash2, Activity, CheckCircle, XCircle,
    Wifi, Wind, Dumbbell, Calendar, ImageIcon, X, ChevronLeft, ChevronRight, Plus
} from 'lucide-react';
import { checkStatus } from '../../shared/utils/timeUtils';

const DEFAULT_GALLERY = [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600',
];

const BranchDetailsView = ({
    branch,
    onBack,
    onEdit,
    onDelete,
    userRole,
}) => {
    const [currentTime] = useState(new Date());
    const status = checkStatus(branch.openingHours, currentTime);
    const isOpen = status === 'Open';

    // Gallery state
    const [galleryImages, setGalleryImages] = useState(() => {
        const saved = localStorage.getItem(`gallery_${branch._id}`);
        return saved ? JSON.parse(saved) : DEFAULT_GALLERY;
    });
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const fileInputRef = useRef(null);

    const handleAddPhoto = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setGalleryImages(prev => {
                    const updated = [...prev, ev.target.result];
                    localStorage.setItem(`gallery_${branch._id}`, JSON.stringify(updated));
                    return updated;
                });
            };
            reader.readAsDataURL(file);
        });
        e.target.value = '';
    };

    const handleRemovePhoto = (idx) => {
        setGalleryImages(prev => {
            const updated = prev.filter((_, i) => i !== idx);
            localStorage.setItem(`gallery_${branch._id}`, JSON.stringify(updated));
            return updated;
        });
        if (lightboxIndex >= galleryImages.length - 1) setLightboxIndex(null);
    };

    const handlePrev = () => setLightboxIndex(i => (i - 1 + galleryImages.length) % galleryImages.length);
    const handleNext = () => setLightboxIndex(i => (i + 1) % galleryImages.length);

    return (
        <div className="branch-details-page" style={{ padding: '0 0 24px' }}>

            {/* ── Header ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={onBack} style={{
                        background: '#fff', border: '1px solid #E2E8F0',
                        width: '36px', height: '36px', borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0
                    }}>
                        <ArrowLeft size={17} color="#475569" />
                    </button>
                    <div>
                        <h1 style={{ margin: 0 }}>{branch.name}</h1>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '1px 0 0', fontSize: '0.75rem', color: '#64748B' }}>
                            <MapPin size={12} color="var(--color-red)" />
                            {branch.location} &bull; {branch.type} Facility
                        </p>
                    </div>
                </div>
                {userRole === 'super_admin' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="sm-btn-ghost" onClick={() => onEdit(branch)}
                            style={{ background: '#fff', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.75rem', padding: '8px 16px' }}>
                            <Edit2 size={13} /> Edit
                        </button>
                        <button className="sm-btn-ghost" onClick={() => onDelete(branch._id)}
                            style={{ background: '#fff', color: '#EF4444', borderColor: '#FEE2E2', borderRadius: '10px', fontSize: '0.75rem', padding: '8px 16px' }}>
                            <Trash2 size={13} /> Remove
                        </button>
                    </div>
                )}
            </div>

            {/* ── Row 1: Hero Photo + Core Specs ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

                {/* Hero Photo */}
                <div style={{ borderRadius: '18px', overflow: 'hidden', border: '1px solid #E2E8F0', position: 'relative', height: '220px' }}>
                    <img src={branch.photo} alt={branch.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                        position: 'absolute', top: '12px', left: '12px',
                        display: 'flex', alignItems: 'center', gap: '5px',
                        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                        padding: '5px 12px', borderRadius: '100px', color: '#fff', fontSize: '0.65rem', fontWeight: 800
                    }}>
                        <div style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: isOpen ? '#10B981' : '#EF4444',
                            boxShadow: `0 0 5px ${isOpen ? 'rgba(16,185,129,0.7)' : 'rgba(239,68,68,0.7)'}`
                        }} />
                        {isOpen ? 'OPEN NOW' : 'CLOSED'}
                    </div>
                    <div style={{
                        position: 'absolute', top: '12px', right: '12px',
                        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                        padding: '5px 12px', borderRadius: '100px', color: '#fff', fontSize: '0.65rem', fontWeight: 800
                    }}>{branch.type.toUpperCase()}</div>
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
                    }} />
                    <div style={{ position: 'absolute', bottom: '14px', left: '16px', color: '#fff' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{branch.name}</div>
                        <div style={{ fontSize: '0.68rem', opacity: 0.85, marginTop: '2px' }}>{branch.location}</div>
                    </div>
                </div>

                {/* Core Specifications */}
                <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid #E2E8F0', padding: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                        <h3 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800 }}>Core Specifications</h3>
                        <div style={{ flex: 1, height: '1px', background: '#F1F5F9' }} />
                    </div>
                    <SpecRow icon={<Activity size={13} color={isOpen ? '#10B981' : '#EF4444'} />} label="Status">
                        <span style={{ color: isOpen ? '#10B981' : '#EF4444', fontWeight: 700 }}>{status}</span>
                    </SpecRow>
                    <SpecRow icon={<Building2 size={13} color="var(--color-red)" />} label="Gym Type">{branch.type} Facility</SpecRow>
                    <SpecRow icon={<Clock size={13} color="var(--color-red)" />} label="Hours">{branch.openingHours}</SpecRow>
                    <SpecRow icon={<Phone size={13} color="var(--color-red)" />} label="Contact">+94 77 123 4567</SpecRow>
                    <SpecRow icon={<Mail size={13} color="var(--color-red)" />} label="Email">
                        info.{branch.location?.toLowerCase()}@powerworld.com
                    </SpecRow>
                    <SpecRow icon={<Users size={13} color="var(--color-red)" />} label="Capacity" last>250 Members</SpecRow>
                </div>
            </div>

            {/* ── Row 2: Gallery + Amenities + Branch Info ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>

                {/* Gallery — Functional */}
                <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid #E2E8F0', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800 }}>Gallery</h3>
                        <button
                            onClick={() => setShowGalleryModal(true)}
                            style={{ background: 'none', border: 'none', color: 'var(--color-red)', fontWeight: 700, fontSize: '0.7rem', cursor: 'pointer', padding: 0 }}
                        >
                            View All ({galleryImages.length})
                        </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {galleryImages.slice(0, 3).map((src, i) => (
                            <div key={i} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', height: '75px', cursor: 'pointer' }}
                                onClick={() => { setShowGalleryModal(true); setLightboxIndex(i); }}>
                                <img src={src} alt={`Branch ${i + 1}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.2s ease' }}
                                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                                />
                            </div>
                        ))}
                        {/* ADD Button */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                height: '75px', borderRadius: '10px', border: '2px dashed #E2E8F0',
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                justifyContent: 'center', gap: '4px', color: '#94A3B8',
                                fontSize: '0.6rem', fontWeight: 700, cursor: 'pointer',
                                background: '#F8FAFC', transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-red)'; e.currentTarget.style.color = 'var(--color-red)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#94A3B8'; }}
                        >
                            <Plus size={16} />
                            ADD PHOTO
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: 'none' }}
                            onChange={handleAddPhoto}
                        />
                    </div>
                </div>

                {/* Amenities */}
                <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid #E2E8F0', padding: '16px' }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: '0.88rem', fontWeight: 800 }}>Amenities</h3>
                    <AmenityRow icon={<Wind size={13} />} label={branch.type === 'AC' ? 'Air Conditioning' : 'Non-AC'} available={branch.type === 'AC'} />
                    <AmenityRow icon={<Wifi size={13} />} label="Wi-Fi" available={true} />
                    <AmenityRow icon={<Dumbbell size={13} />} label="Equipment Area" available={true} />
                    <AmenityRow icon={<Users size={13} />} label="Group Classes" available={true} />
                    <AmenityRow icon={<Calendar size={13} />} label="Personal Training" available={false} last />
                </div>

                {/* Branch Info */}
                <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid #E2E8F0', padding: '16px' }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: '0.88rem', fontWeight: 800 }}>Branch Info</h3>
                    <QuickFact label="Branch ID" value={branch._id?.toUpperCase()} />
                    <QuickFact label="City" value={branch.location} />
                    <QuickFact label="Premises" value={branch.type} />
                    <QuickFact label="Hours" value={branch.openingHours} />
                    <QuickFact label="Status" value={status} highlight={isOpen} last />
                </div>
            </div>

            {/* ── Gallery Modal (View All + Lightbox) ── */}
            {showGalleryModal && (
                <div
                    onClick={(e) => { if (e.target === e.currentTarget) { setShowGalleryModal(false); setLightboxIndex(null); } }}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
                        backdropFilter: 'blur(6px)', zIndex: 9999,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
                    }}
                >
                    {lightboxIndex !== null ? (
                        /* Lightbox */
                        <div style={{ position: 'relative', maxWidth: '800px', width: '100%' }}>
                            <img
                                src={galleryImages[lightboxIndex]}
                                alt="Gallery"
                                style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '20px' }}
                            />
                            {/* Nav arrows */}
                            <button onClick={handlePrev} style={arrowBtn('left')}>
                                <ChevronLeft size={24} color="#fff" />
                            </button>
                            <button onClick={handleNext} style={arrowBtn('right')}>
                                <ChevronRight size={24} color="#fff" />
                            </button>
                            {/* Counter */}
                            <div style={{ textAlign: 'center', marginTop: '12px', color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>
                                {lightboxIndex + 1} / {galleryImages.length}
                            </div>
                            <button onClick={() => setLightboxIndex(null)}
                                style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '8px', padding: '6px 10px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <ArrowLeft size={16} />
                            </button>
                        </div>
                    ) : (
                        /* All Photos Grid */
                        <div style={{ background: '#fff', borderRadius: '24px', padding: '28px', width: '100%', maxWidth: '700px', maxHeight: '85vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Facility Gallery</h2>
                                    <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: '#94A3B8' }}>{branch.name} &bull; {galleryImages.length} photos</p>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{ background: 'var(--color-red)', border: 'none', color: '#fff', borderRadius: '10px', padding: '8px 16px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        <Plus size={14} /> Add Photo
                                    </button>
                                    <button onClick={() => setShowGalleryModal(false)}
                                        style={{ background: '#F1F5F9', border: 'none', borderRadius: '10px', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                                        <X size={18} color="#64748B" />
                                    </button>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                {galleryImages.map((src, i) => (
                                    <div key={i} style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', height: '130px', cursor: 'pointer' }}
                                        onClick={() => setLightboxIndex(i)}>
                                        <img src={src} alt={`Gallery ${i + 1}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.2s ease' }}
                                            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                                            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                                        />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleRemovePhoto(i); }}
                                            style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(239,68,68,0.85)', border: 'none', borderRadius: '6px', padding: '3px 6px', cursor: 'pointer', color: '#fff', fontSize: '0.6rem', fontWeight: 700 }}
                                        >✕</button>
                                    </div>
                                ))}
                                {/* Add More in grid */}
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        height: '130px', borderRadius: '14px', border: '2px dashed #E2E8F0',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        justifyContent: 'center', gap: '6px', color: '#94A3B8',
                                        fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', background: '#F8FAFC'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-red)'; e.currentTarget.style.color = 'var(--color-red)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#94A3B8'; }}
                                >
                                    <ImageIcon size={22} />
                                    ADD PHOTO
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const arrowBtn = (side) => ({
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    [side]: '-48px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backdropFilter: 'blur(8px)', transition: 'background 0.2s ease'
});

// ── Sub-components ────────────────────────────────────────────────────────────

const SpecRow = ({ icon, label, children, last }) => (
    <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '9px 0', borderBottom: last ? 'none' : '1px solid #F8FAFC'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '0.7rem', fontWeight: 700 }}>
            {icon} {label}
        </div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E293B', textAlign: 'right', maxWidth: '55%' }}>
            {children}
        </div>
    </div>
);

const AmenityRow = ({ icon, label, available, last }) => (
    <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '9px 0', borderBottom: last ? 'none' : '1px solid #F8FAFC'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>
            <span style={{ color: available ? 'var(--color-red)' : '#CBD5E1' }}>{icon}</span>
            {label}
        </div>
        {available ? <CheckCircle size={14} color="#10B981" /> : <XCircle size={14} color="#CBD5E1" />}
    </div>
);

const QuickFact = ({ label, value, highlight, last }) => (
    <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '9px 0', borderBottom: last ? 'none' : '1px solid #F8FAFC'
    }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#94A3B8' }}>{label}</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: highlight ? '#10B981' : '#1E293B' }}>{value}</span>
    </div>
);

export default BranchDetailsView;
