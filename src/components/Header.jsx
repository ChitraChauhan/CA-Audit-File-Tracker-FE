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
        <button className="btn btn-ghost btn-sm" onClick={onPrint}>
          🖨️ Print
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onExportAll}>
          ⬇️ Export All
        </button>
        <button className="btn btn-primary" onClick={onNewFile}>
          ＋ New Audit File
        </button>
        <div className="profile-menu-wrapper" ref={profileRef} tabIndex="0" onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            closeProfile();
          }
        }}>
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
