import React from 'react';
import { ChevronRight } from 'lucide-react';

const ActivityLog = ({ activities, searchQuery }) => {
    return (
        <div className="sa-activity-feed" style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '8px' }}>
            {activities.length > 0 ? (
                activities.map(activity => (
                    <div key={activity.id} className="sa-activity-item">
                        <div className="sa-activity-icon">
                            {activity.icon}
                        </div>
                        <div className="sa-activity-info">
                            <p><strong>{activity.user}</strong> {activity.action}</p>
                            <span>{activity.time}</span>
                        </div>
                        <div className="activity-status-chip">
                            <ChevronRight size={16} />
                        </div>
                    </div>
                ))
            ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-dim)', fontWeight: 600 }}>
                    No events found matching "{searchQuery}"
                </div>
            )}
        </div>
    );
};

export default ActivityLog;
