import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

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
        if (!isNaN(parsedYear)) {
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
            <div className="cal-header">
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <ChevronLeft
                        size={16}
                        color={activeArrow === 'prev' ? 'var(--color-red)' : 'var(--color-text-dim)'}
                        style={{ cursor: 'pointer', transition: 'color 0.1s' }}
                        onMouseDown={() => setActiveArrow('prev')}
                        onMouseUp={() => setActiveArrow(null)}
                        onMouseLeave={() => setActiveArrow(null)}
                        onClick={() => setCurrentDate(new Date(year, monthNum - 1, 1))}
                    />
                    <div
                        className="cal-month-box"
                        onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'var(--color-red)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            minWidth: '70px',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(255, 0, 0, 0.15)'
                        }}
                    >
                        <span style={{ fontWeight: 800, fontSize: '0.75rem', color: '#FFFFFF', textTransform: 'uppercase' }}>
                            {monthNames[monthNum].slice(0, 3)}
                        </span>
                        <ChevronDown size={14} color="#FFFFFF" />

                        {isMonthDropdownOpen && (
                            <div style={{
                                position: 'absolute', top: 'calc(100% + 5px)', left: 0,
                                background: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100,
                                maxHeight: '180px', overflowY: 'auto', minWidth: '120px',
                                padding: '6px 0'
                            }}>
                                {monthNames.map((m, idx) => (
                                    <div
                                        key={m}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentDate(new Date(year, idx, 1));
                                            setIsMonthDropdownOpen(false);
                                        }}
                                        style={{
                                            padding: '10px 16px', fontSize: '0.8rem', cursor: 'pointer',
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
                    <ChevronRight
                        size={16}
                        color={activeArrow === 'next' ? 'var(--color-red)' : 'var(--color-text-dim)'}
                        style={{ cursor: 'pointer', transition: 'color 0.1s' }}
                        onMouseDown={() => setActiveArrow('next')}
                        onMouseUp={() => setActiveArrow(null)}
                        onMouseLeave={() => setActiveArrow(null)}
                        onClick={() => setCurrentDate(new Date(year, monthNum + 1, 1))}
                    />
                </div>

                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <ChevronLeft
                        size={16}
                        color={activeArrow === 'year-prev' ? 'var(--color-red)' : 'var(--color-text-dim)'}
                        style={{ cursor: 'pointer' }}
                        onMouseDown={() => setActiveArrow('year-prev')}
                        onMouseUp={() => setActiveArrow(null)}
                        onMouseLeave={() => setActiveArrow(null)}
                        onClick={() => setCurrentDate(new Date(year - 1, monthNum, 1))}
                    />
                    <div
                        className="cal-year-box"
                        onDoubleClick={handleYearDoubleClick}
                        style={{
                            background: 'var(--color-red)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            minWidth: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(255, 0, 0, 0.15)'
                        }}
                    >
                        {isYearEditable ? (
                            <input
                                type="text"
                                value={yearInput}
                                onChange={handleYearChange}
                                onBlur={handleYearBlur}
                                onKeyDown={handleYearKeyDown}
                                autoFocus
                                style={{ width: '40px', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF', padding: 0, textAlign: 'center' }}
                            />
                        ) : (
                            <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#FFFFFF' }}>{year}</span>
                        )}
                    </div>
                    <ChevronRight
                        size={16}
                        color={activeArrow === 'year-next' ? 'var(--color-red)' : 'var(--color-text-dim)'}
                        style={{ cursor: 'pointer' }}
                        onMouseDown={() => setActiveArrow('year-next')}
                        onMouseUp={() => setActiveArrow(null)}
                        onMouseLeave={() => setActiveArrow(null)}
                        onClick={() => setCurrentDate(new Date(year + 1, monthNum, 1))}
                    />
                </div>
            </div>
            <div className="cal-grid">
                {days.map((d, i) => <div key={`day-${i}`} className="cal-day-label">{d}</div>)}
                {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} />)}
                {[...Array(daysInMonth)].map((_, i) => {
                    const d = i + 1;
                    const today = new Date();
                    const isToday = today.getDate() === d && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();
                    return (
                        <div
                            key={d}
                            className={`cal-date ${isToday ? 'active' : ''}`}
                            onDoubleClick={() => handleDateDoubleClick(d)}
                            style={{ cursor: 'pointer' }}
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
