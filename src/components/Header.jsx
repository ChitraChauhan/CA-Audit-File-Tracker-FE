import React, { useState, useRef, useEffect } from 'react';
import { fyOptions, defaultFY } from '../utils/helpers.js';

export default function Header({ lastUpdated, onPrint, onExportAll, onNewFile, selectedYear, onYearChange, onToggleSidebar, onLogout, user, onProfileOpen, onLogoClick }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const toggleProfile = () => setProfileOpen(prev => !prev);
  const closeProfile = () => setProfileOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="app-header">
      <button className="icon-btn sidebar-toggle" onClick={onToggleSidebar}>
        ☰
      </button>
      <div
        className="brand"
        role="button"
        tabIndex="0"
        onClick={onLogoClick}
        onKeyDown={(event) => event.key === 'Enter' && onLogoClick && onLogoClick()}
      >
        <div className="brand-mark">CA</div>
        <div className="brand-text">
          <h1>Smart CA Tracker</h1>
          <span>Audit & Compliance Management</span>
        </div>
      </div>
      <div className="header-actions">
        <div className="year-filter">
          <label>Financial Year</label>
          <select value={selectedYear} onChange={(e) => onYearChange(e.target.value)}>
            {fyOptions().map(fy => (
              <option key={fy} value={fy}>{fy}</option>
            ))}
          </select>
        </div>
        <div className="header-meta">
          Last updated<br />
          <b>{lastUpdated || '—'}</b>
        </div>
        <button className="btn btn-ghost btn-sm keep-mobile" onClick={onPrint} aria-label="Print">
          <span className="btn-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 8h-1V3H6v5H5c-1.1 0-2 .9-2 2v6h4v4h10v-4h4v-6c0-1.1-.9-2-2-2zM8 5h8v3H8V5zm8 14H8v-5h8v5z" />
            </svg>
          </span>
          <span className="btn-label">Print</span>
        </button>
        <button className="btn btn-ghost btn-sm keep-mobile" onClick={onExportAll} aria-label="Export All">
          <span className="btn-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M5 20h14v-2H5v2zm7-18L5.33 9h3.67v6h4V9h3.67L12 2z" />
            </svg>
          </span>
          <span className="btn-label">Export All</span>
        </button>
        <button className="btn btn-primary keep-mobile" onClick={onNewFile} aria-label="New Audit File">
          <span className="btn-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 7h-4V3H9v4H5v14h14V7zM13 11h3v2h-3v3h-2v-3H8v-2h3V8h2v3z" />
            </svg>
          </span>
          <span className="btn-label">New Audit File</span>
        </button>
        <div className="profile-menu-wrapper" ref={profileRef}>
          <button className="profile-btn" type="button" onClick={toggleProfile}>
            <span className="profile-avatar">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
            <span className="profile-label">{user?.name?.split(' ')[0] || 'Profile'}</span>
            <span className="profile-caret">▾</span>
          </button>
          {profileOpen && (
            <div className="profile-dropdown">
              <button className="profile-dropdown-item" type="button" onClick={() => { closeProfile(); onProfileOpen(); }}>
                Profile
              </button>
              <button className="profile-dropdown-item" type="button" onClick={() => { closeProfile(); onLogout(); }}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
