import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MiniCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
    const [isYearEditable, setIsYearEditable] = useState(false);
    const [yearInput, setYearInput] = useState('');
    const [activeArrow, setActiveArrow] = useState(null);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const monthNum = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleYearDoubleClick = () => {
        setYearInput(year.toString());
        setIsYearEditable(true);
    };

    const handleYearChange = (e) => {
        setYearInput(e.target.value);
    };

    const handleYearBlur = () => {
        setIsYearEditable(false);
        const parsedYear = parseInt(yearInput, 10);
        if (!isNaN(parsedYear) && parsedYear >= 2016 && parsedYear <= 2035) {
            setCurrentDate(new Date(parsedYear, currentDate.getMonth(), 1));
        }
    };

    const handleYearKeyDown = (e) => {
        if (e.key === 'Enter') handleYearBlur();
    };

    const handleDateDoubleClick = (d) => {
        alert("Add Reminder interaction / UI opening for date: " + d);
    };

    return (
        <div className="mini-calendar">
            <div className="cal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', background: '#ffffff', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                    <div style={{ position: 'relative' }}>
                        <span
                            onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                            style={{ fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', color: 'var(--color-text)' }}
                        >
                            {monthNames[monthNum]}
                        </span>
                        {isMonthDropdownOpen && (
                            <div style={{
                                position: 'absolute', top: '100%', left: 0, marginTop: '4px',
                                background: '#fff', border: 'none', borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 50,
                                maxHeight: '135px', overflowY: 'auto', minWidth: '110px',
                                padding: '4px 0'
                            }}>
                                {monthNames.map((m, idx) => (
                                    <div
                                        key={m}
                                        onClick={() => {
                                            setCurrentDate(new Date(year, idx, 1));
                                            setIsMonthDropdownOpen(false);
                                        }}
                                        style={{
                                            padding: '8px 12px', fontSize: '0.85rem', cursor: 'pointer',
                                            color: idx === monthNum ? 'var(--color-red)' : '#333',
                                            fontWeight: idx === monthNum ? 700 : 500
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                    >
                                        {m}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        {isYearEditable ? (
                            <input
                                type="text"
                                value={yearInput}
                                onChange={handleYearChange}
                                onBlur={handleYearBlur}
                                onKeyDown={handleYearKeyDown}
                                autoFocus
                                style={{ width: '45px', border: 'none', borderBottom: '1px solid var(--color-red)', background: 'transparent', outline: 'none', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', padding: 0 }}
                            />
                        ) : (
                            <span
                                onDoubleClick={handleYearDoubleClick}
                                style={{ fontWeight: 600, fontSize: '0.8rem', cursor: 'default', color: 'var(--color-text)' }}
                            >
                                {year}
                            </span>
                        )}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                    <ChevronLeft
                        size={18}
                        color={activeArrow === 'left' ? 'var(--color-red)' : 'var(--color-text-dim)'}
                        style={{ cursor: 'pointer', transition: 'color 0.1s' }}
                        onMouseDown={() => setActiveArrow('left')}
                        onMouseUp={() => setActiveArrow(null)}
                        onMouseLeave={() => setActiveArrow(null)}
                        onClick={() => setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1))}
                    />
                    <ChevronRight
                        size={18}
                        color={activeArrow === 'right' ? 'var(--color-red)' : 'var(--color-text-dim)'}
                        style={{ cursor: 'pointer', transition: 'color 0.1s' }}
                        onMouseDown={() => setActiveArrow('right')}
                        onMouseUp={() => setActiveArrow(null)}
                        onMouseLeave={() => setActiveArrow(null)}
                        onClick={() => setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1))}
                    />
                </div>
            </div>
            <div className="cal-grid">
                {days.map((d, i) => <div key={`day-${i}`} className="cal-day-label">{d}</div>)}
                {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} />)}
                {[...Array(daysInMonth)].map((_, i) => {
                    const d = i + 1;
                    return (
                        <div
                            key={d}
                            className="cal-date"
                            onDoubleClick={() => handleDateDoubleClick(d)}
                            style={{ cursor: 'pointer', fontSize: '0.75rem' }}
                        >
                            {d}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MiniCalendar;
