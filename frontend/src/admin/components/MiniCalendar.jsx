import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Clock, Edit2, Trash2, Plus } from 'lucide-react';

const MiniCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    // Reminders state
    const [reminders, setReminders] = useState(() => {
        const saved = localStorage.getItem('gym_admin_reminders');
        return saved ? JSON.parse(saved) : {};
    });

    const [showReminderModal, setShowReminderModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [reminderForm, setReminderForm] = useState({ title: '', time: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        localStorage.setItem('gym_admin_reminders', JSON.stringify(reminders));
        checkAndCreateNotifications();
    }, [reminders]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsMonthDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const checkAndCreateNotifications = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const existingNotifications = JSON.parse(localStorage.getItem('dev_notifications') || '[]');
        let updated = false;

        Object.keys(reminders).forEach(dateStr => {
            const reminderDate = new Date(dateStr);
            reminderDate.setHours(0, 0, 0, 0);
            
            // Check if reminder is for tomorrow
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            
            if (reminderDate.getTime() === tomorrow.getTime()) {
                const notifId = `reminder-${dateStr}`;
                if (!existingNotifications.find(n => n.id === notifId)) {
                    existingNotifications.unshift({
                        id: notifId,
                        type: 'Inventory', // Generic icon
                        action: `Reminder: You have an event tomorrow (${reminders[dateStr].title})`,
                        time: '1 day before',
                        timestamp: new Date().toISOString(),
                        unread: true,
                        isAuthNotif: true
                    });
                    updated = true;
                }
            }
        });

        if (updated) {
            localStorage.setItem('dev_notifications', JSON.stringify(existingNotifications));
        }
    };

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const monthNum = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const pastelColors = ['#FEE2E2', '#E0F2FE', '#FEFCE8', '#F0FDF4', '#F5F3FF', '#FDF2F8'];

    const isToday = (d) => {
        const now = new Date();
        return now.getDate() === d && now.getMonth() === monthNum && now.getFullYear() === year;
    };

    const isPast = (d) => {
        const date = new Date(year, monthNum, d);
        date.setHours(23, 59, 59, 999);
        return date < new Date();
    };

    const handleDayDoubleClick = (d) => {
        if (isPast(d)) return;

        const dateStr = `${year}-${monthNum + 1}-${d}`;
        setSelectedDate(dateStr);
        
        if (reminders[dateStr]) {
            setReminderForm(reminders[dateStr]);
            setIsEditing(true);
        } else {
            setReminderForm({ title: '', time: '' });
            setIsEditing(false);
        }
        setShowReminderModal(true);
    };

    const saveReminder = (e) => {
        e.preventDefault();
        
        // Validation
        if (!reminderForm.title || !reminderForm.time) {
            alert("All fields are required.");
            return;
        }

        // Future time validation if today
        const [hour, min] = reminderForm.time.split(':').map(Number);
        const now = new Date();
        const remDate = new Date(selectedDate);
        remDate.setHours(hour, min, 0, 0);

        if (selectedDate === `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}` && remDate < now) {
            alert("Reminder time must be in the future.");
            return;
        }

        setReminders(prev => ({
            ...prev,
            [selectedDate]: { ...reminderForm, color: prev[selectedDate]?.color || pastelColors[Math.floor(Math.random() * pastelColors.length)] }
        }));
        setShowReminderModal(false);
    };

    const removeReminder = () => {
        const updated = { ...reminders };
        delete updated[selectedDate];
        setReminders(updated);
        setShowReminderModal(false);
    };

    return (
        <div className="mini-calendar" style={{ background: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0' }}>
            <div className="cal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {/* Month Dropdown */}
                    <div ref={dropdownRef} style={{ position: 'relative' }}>
                        <div 
                            onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                            style={{ 
                                background: 'var(--color-red)', 
                                color: '#fff', 
                                padding: '6px 14px', 
                                borderRadius: '10px', 
                                fontSize: '0.85rem', 
                                fontWeight: 800, 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            {monthNames[monthNum]}
                        </div>
                        {isMonthDropdownOpen && (
                            <div style={{
                                position: 'absolute', top: '100%', left: 0, marginTop: '8px',
                                background: '#fff', borderRadius: '12px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100,
                                maxHeight: '200px', overflowY: 'auto', minWidth: '100px',
                                border: '1px solid #E2E8F0', padding: '6px'
                            }}>
                                {monthNames.map((m, idx) => (
                                    <div
                                        key={m}
                                        onClick={() => {
                                            setCurrentDate(new Date(year, idx, 1));
                                            setIsMonthDropdownOpen(false);
                                        }}
                                        style={{
                                            padding: '8px 12px', fontSize: '0.8rem', cursor: 'pointer',
                                            borderRadius: '8px',
                                            color: idx === monthNum ? 'var(--color-red)' : '#475569',
                                            fontWeight: idx === monthNum ? 800 : 600,
                                            background: idx === monthNum ? 'rgba(239, 68, 68, 0.05)' : 'transparent'
                                        }}
                                    >
                                        {m}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Year Box */}
                    <div style={{ background: 'var(--color-red)', color: '#fff', padding: '6px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 800 }}>
                        {year}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <div 
                        onClick={() => setCurrentDate(new Date(year, monthNum - 1, 1))}
                        style={{ width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0', cursor: 'pointer', color: '#64748B' }}
                    >
                        <ChevronLeft size={16} />
                    </div>
                    <div 
                        onClick={() => setCurrentDate(new Date(year, monthNum + 1, 1))}
                        style={{ width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0', cursor: 'pointer', color: '#64748B' }}
                    >
                        <ChevronRight size={16} />
                    </div>
                </div>
            </div>

            <div className="cal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                {days.map((d, i) => <div key={`day-${i}`} className="cal-day-label" style={{ textAlign: 'center', fontSize: '0.65rem', fontWeight: 800, color: '#94A3B8' }}>{d}</div>)}
                {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} />)}
                {[...Array(daysInMonth)].map((_, i) => {
                    const d = i + 1;
                    const dateStr = `${year}-${monthNum + 1}-${d}`;
                    const reminder = reminders[dateStr];
                    const today = isToday(d);
                    
                    return (
                        <div
                            key={d}
                            className={`cal-date ${today ? 'active' : ''}`}
                            onDoubleClick={() => handleDayDoubleClick(d)}
                            style={{ 
                                textAlign: 'center',
                                padding: '8px 0',
                                borderRadius: '10px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: isPast(d) ? 'default' : 'pointer',
                                background: today ? 'var(--color-red)' : (reminder ? reminder.color : 'transparent'),
                                color: today ? '#fff' : (reminder ? 'var(--color-text)' : '#475569'),
                                opacity: isPast(d) && !today ? 0.4 : 1,
                                position: 'relative'
                            }}
                        >
                            {d}
                            {reminder && !today && (
                                <div style={{ position: 'absolute', bottom: '4px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(0,0,0,0.3)' }} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Reminders List Section */}
            <div style={{ marginTop: '32px', borderTop: '1px solid #F1F5F9', paddingTop: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 900, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '4px', height: '16px', background: 'var(--color-red)', borderRadius: '10px' }} />
                        Reminder
                    </h3>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>
                        Total: {Object.keys(reminders).length}
                    </span>
                </div>

                <div style={{ 
                    maxHeight: '260px', 
                    overflowY: 'auto', 
                    paddingRight: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                }}>
                    {Object.keys(reminders).length > 0 ? (
                        Object.entries(reminders)
                            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
                            .map(([dateStr, reminder]) => {
                                const [y, m, d] = dateStr.split('-').map(Number);
                                const date = new Date(y, m - 1, d);
                                const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                                
                                const [h, min] = reminder.time.split(':').map(Number);
                                const ampm = h >= 12 ? 'PM' : 'AM';
                                const displayH = h % 12 || 12;
                                const formattedTime = `${displayH}:${min.toString().padStart(2, '0')} ${ampm}`;

                                return (
                                    <div 
                                        key={dateStr}
                                        onClick={() => {
                                            setSelectedDate(dateStr);
                                            setReminderForm(reminder);
                                            setIsEditing(true);
                                            setShowReminderModal(true);
                                        }}
                                        style={{ 
                                            padding: '12px 14px', 
                                            background: reminder.color || '#F8FAFC', 
                                            borderRadius: '14px', 
                                            border: `1px solid ${reminder.color ? 'rgba(0,0,0,0.05)' : '#E2E8F0'}`,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                        }}
                                    >
                                        <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#1E293B', marginBottom: '4px' }}>{reminder.title}</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <div style={{ fontSize: '0.68rem', color: 'rgba(0,0,0,0.5)', fontWeight: 700 }}>Date: {formattedDate}</div>
                                            <div style={{ fontSize: '0.68rem', color: 'var(--color-red)', fontWeight: 800 }}>Time: {formattedTime}</div>
                                        </div>
                                    </div>
                                );
                            })
                    ) : (
                        <div style={{ textAlign: 'center', padding: '32px 0', color: '#94A3B8', fontSize: '0.8rem', fontWeight: 600 }}>
                            You haven't set any reminders.
                        </div>
                    )}
                </div>
            </div>

            {/* Reminder Modal */}
            {showReminderModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                    <div className="animate-pop-in" style={{ background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '380px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{isEditing ? 'Edit Reminder' : 'Add Reminder'}</h3>
                            <button onClick={() => setShowReminderModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        
                        <form onSubmit={saveReminder} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px' }}>Description</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter reminder title..."
                                    value={reminderForm.title}
                                    onChange={(e) => setReminderForm({ ...reminderForm, title: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.9rem', outline: 'none' }}
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px' }}>Time</label>
                                <div style={{ position: 'relative' }}>
                                    <Clock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                    <input 
                                        type="time" 
                                        value={reminderForm.time}
                                        onChange={(e) => setReminderForm({ ...reminderForm, time: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.9rem', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
                                {isEditing && (
                                    <button 
                                        type="button" 
                                        onClick={removeReminder}
                                        style={{ flex: 1, padding: '14px', borderRadius: '12px', background: '#FEF2F2', color: '#EF4444', border: 'none', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    >
                                        <Trash2 size={16} /> Remove
                                    </button>
                                )}
                                <button 
                                    type="submit" 
                                    style={{ flex: 2, padding: '14px', borderRadius: '12px', background: 'var(--color-red)', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                    {isEditing ? <><Edit2 size={16} /> Update</> : <><Plus size={16} /> Save</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MiniCalendar;
