import React from 'react';

/**
 * A reusable row for displaying key-value pairs with an optional icon.
 * @param {Object} props
 * @param {string} props.label - The label for the row
 * @param {string|number} props.value - The value to display
 * @param {React.ReactNode} props.icon - Optional icon component
 */
const FieldRow = ({ label, value, icon }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid #F1F5F9'
    }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8' }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.8rem', color: '#1E293B' }}>
            {icon && <span style={{ color: 'var(--color-red)', display: 'flex' }}>{icon}</span>}
            <span>{value || '—'}</span>
        </div>
    </div>
);

export default FieldRow;
