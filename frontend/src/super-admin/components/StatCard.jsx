import React from 'react';

const StatCard = ({ label, value, icon, iconBg, iconColor, onClick, style }) => {
    return (
        <div
            className="sa-stat-card"
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default', ...style }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="icon-circle" style={{ background: iconBg, color: iconColor, margin: 0 }}>
                    {icon}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="label" style={{ margin: 0 }}>{label}</span>
                    <h2 className="value" style={{ margin: 0, marginTop: '2px' }}>{value}</h2>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
