import React from 'react';

const DismantleRequestModal = ({
    request,
    onClose,
    adminComment,
    setAdminComment,
    handleAction,
    isProcessing,
    isRestricted
}) => {
    if (!request) return null;

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal-container dismantle-review-modal">
                <div className="admin-modal-header">
                    <div>
                        <h2>Review Dismantle Request</h2>
                        <p>Requested on {new Date(request.createdAt).toLocaleDateString()} by {request.staffName}</p>
                    </div>
                    <button className="close-modal-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="admin-modal-body">
                    <div className="review-grid">
                        <div className="review-details">
                            <div className="detail-item">
                                <label>Equipment Details</label>
                                <div className="asset-box">
                                    <strong>{request.equipmentName}</strong>
                                    <span>ID: {request.equipmentCustomId}</span>
                                    <span>Branch: {request.branch}</span>
                                </div>
                            </div>
                            <div className="detail-item">
                                <label>Manager's Reason</label>
                                <p className="reason-text-full">{request.reason}</p>
                            </div>
                            <div className="detail-item">
                                <label>Admin Decision Comment</label>
                                <textarea
                                    placeholder="Add a comment for the branch manager..."
                                    value={adminComment}
                                    onChange={(e) => setAdminComment(e.target.value)}
                                    rows="3"
                                />
                            </div>
                        </div>
                        <div className="review-media">
                            <label>Evidence / Condition Photo</label>
                            <div className="evidence-photo-box">
                                <img src={request.photo} alt="Condition Evidence" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="admin-modal-footer">
                    <button className="btn-secondary" onClick={onClose} disabled={isProcessing}>Close</button>
                    <div className="action-btns">
                        <button
                            className="btn-reject"
                            onClick={() => handleAction(request._id, 'reject')}
                            disabled={isProcessing || isRestricted}
                            style={{ opacity: isRestricted ? 0.5 : 1, cursor: isRestricted ? 'not-allowed' : 'pointer' }}
                            title={isRestricted ? "Restricted: Admin Only" : ""}
                        >
                            Reject Request
                        </button>
                        <button
                            className="btn-approve"
                            onClick={() => handleAction(request._id, 'approve')}
                            disabled={isProcessing || isRestricted}
                            style={{ opacity: isRestricted ? 0.5 : 1, cursor: isRestricted ? 'not-allowed' : 'pointer' }}
                            title={isRestricted ? "Restricted: Admin Only" : ""}
                        >
                            {isProcessing ? 'Processing...' : 'Approve Dismantle'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DismantleRequestModal;
