import React from 'react';

const StatCard = ({ label, value, icon, iconBg, iconColor }) => {
    return (
        <div className="live-card">
            <div className="icon-box" style={{ background: iconBg, color: iconColor }}>{icon}</div>
            <div className="card-data">
                <span className="label">{label}</span>
                <h2 className="value">{value}</h2>
            </div>
        </div>
    );
};

export default StatCard;
