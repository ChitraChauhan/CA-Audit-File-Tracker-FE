import React from 'react';
import { fyOptions, defaultFY } from '../utils/helpers.js';

export default function Header({ lastUpdated, onPrint, onExportAll, onNewFile, selectedYear, onYearChange }) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-mark">CA</div>
        <div className="brand-text">
          <h1>Smart CA Tracker</h1>
          <span>Physical File Movement & Tracking System</span>
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
      </div>
    </header>
  );
}
