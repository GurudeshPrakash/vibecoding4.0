import React from 'react';
import { Eye, Edit2, Trash2, MapPin } from 'lucide-react';
import StatusBadge from '../../shared/components/ui/StatusBadge';

const StaffTableRow = ({
    member,
    branchName,
    avatarColor,
    onView,
    onEdit,
    onDelete
}) => {
    return (
        <tr className="sm-tr">
            <td>
                <span className="sm-id-pill">{member.staffId}</span>
            </td>
            <td>
                <div className="sm-name-cell">
                    <div
                        className="sm-avatar"
                        style={{
                            background: member.photo ? 'none' : `${avatarColor}18`,
                            color: avatarColor,
                            cursor: 'pointer',
                            overflow: 'hidden',
                            border: '2px solid #fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        onClick={() => onView(member)}
                    >
                        {member.photo ? (
                            <img src={member.photo} alt={member.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            `${(member.firstName || '').charAt(0)}${(member.lastName || '').charAt(0)}`
                        )}
                    </div>
                    <span className="sm-name">{member.firstName} {member.lastName}</span>
                </div>
            </td>
            <td>
                <span className="sm-branch-tag">
                    <MapPin size={11} />
                    {branchName}
                </span>
            </td>
            <td className="sm-phone">{member.phone || '—'}</td>
            <td><StatusBadge status={member.status} /></td>
            <td className="sm-actions-cell">
                <div className="sm-action-btns">
                    <button
                        className="sm-action-btn sm-btn-view"
                        title="View Details"
                        onClick={() => onView(member)}
                    >
                        <Eye size={14} />
                        <span>View</span>
                    </button>
                    <button
                        className="sm-action-btn sm-btn-edit"
                        title="Edit Staff"
                        onClick={() => onEdit(member)}
                    >
                        <Edit2 size={14} />
                        <span>Edit</span>
                    </button>
                    <button
                        className="sm-action-btn sm-btn-deactivate"
                        title="Remove Staff"
                        onClick={() => onDelete(member._id)}
                    >
                        <Trash2 size={14} />
                        <span>Remove</span>
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default StaffTableRow;
