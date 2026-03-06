import React from 'react';
import { LogOut, X } from 'lucide-react';
import '../styles/LogoutModal.css';

const LogoutModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="logout-modal card">
        <button className="close-modal" onClick={onCancel}>
          <X size={20} />
        </button>

        <div className="logout-content">
          <div className="modal-icon-container">
            <LogOut size={32} color="var(--color-red)" />
          </div>

          <h2 className="modal-title">Logout Confirmation</h2>
          <p className="modal-text">Are you sure you want to logout?</p>

          <div className="modal-actions">
            <button className="confirm-btn" onClick={onConfirm}>
              Log Out
            </button>
            <button className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
