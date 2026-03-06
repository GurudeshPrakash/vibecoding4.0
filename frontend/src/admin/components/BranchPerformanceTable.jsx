import React from 'react';

const BranchPerformanceTable = ({ data }) => {
    return (
        <div className="sa-card">
            <div className="sa-card-header">
                <h3>Branch Performance</h3>
            </div>
            <div className="sa-table-container">
                <table className="sa-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', background: '#F9FAFB' }}>
                            <th style={{ padding: '12px 24px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Branch Name</th>
                            <th style={{ padding: '12px 24px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Total Members</th>
                            <th style={{ padding: '12px 24px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Today Check-ins</th>
                            <th style={{ padding: '12px 24px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Revenue (LKR)</th>
                            <th style={{ padding: '12px 24px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-text-dim)', textTransform: 'uppercase', textAlign: 'center' }}>Equipment Issues</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text)' }}>{row.branch}</td>
                                <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 600 }}>{row.members}</td>
                                <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 600 }}>{row.checkins}</td>
                                <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 600, color: '#10B981' }}>{row.revenue}</td>
                                <td style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 600, color: row.issues > 0 ? '#EF4444' : '#10B981', textAlign: 'center' }}>{row.issues}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BranchPerformanceTable;
