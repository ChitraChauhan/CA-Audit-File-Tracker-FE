import React from 'react';

export default function Header({ lastUpdated, onPrint, onExportAll, onNewFile }) {
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
