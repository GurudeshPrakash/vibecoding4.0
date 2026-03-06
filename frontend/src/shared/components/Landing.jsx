import React from 'react';
import logo from '../assets/logo1.png';
import '../styles/Landing.css';

const Landing = ({ onSelectRole }) => {
  return (
    <div className="landing-page">
      <div className="landing-content-overlay animate-fade-in">
        {/* Large Professional Logo */}
        <div className="brand-logo-hero">
          <img
            src={logo}
            alt="Power World Fitness Centers"
            className="logo-img-main"
          />
          <h1 className="hero-title">Management Portal</h1>
        </div>

        {/* Center Text Section */}
        <div className="landing-messaging-v4">
          <p className="main-description">
            The ultimate management solution for Power World Fitness branches. Monitor equipment lifecycle, manage locations, and track real-time performance.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="landing-button-row">
          <button className="landing-btn admin-solid" onClick={() => onSelectRole('admin')}>
            Admin Login
          </button>
          <button className="landing-btn staff-outline" onClick={() => onSelectRole('staff')}>
            Manager Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
