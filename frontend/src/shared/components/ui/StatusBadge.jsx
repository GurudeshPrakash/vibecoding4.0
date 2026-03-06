import React from 'react';

/**
 * A reusable status indicator badge.
 * @param {Object} props
 * @param {string} props.status - The status text (e.g., "Active", "Open", "Closed")
 */
const StatusBadge = ({ status }) => {
    const isActive = status === 'Active' || status === 'Open';

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.62rem',
            fontWeight: 800,
            padding: '4px 11px',
            borderRadius: '50px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
            color: isActive ? '#059669' : '#DC2626',
            background: isActive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'
        }}>
            <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                flexShrink: 0,
                background: isActive ? '#10B981' : '#EF4444'
            }} />
            {status}
        </span>
    );
};

export default StatusBadge;
