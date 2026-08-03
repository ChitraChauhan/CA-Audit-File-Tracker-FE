import React from 'react';
import { AUDIT_TYPES } from '../utils/helpers.js';

const TYPE_ICONS = {
  'ITR Filing': '🧾',
  'Tax Audit': '📑',
  'Statutory Audit': '🏛️',
  'Internal Audit': '🔍',
  'GST Audit': '💰',
  'Bank Audit': '🏦',
  'Concurrent Audit': '⏱️',
  'Trust Audit': '🤝',
  'Society Audit': '🏘️',
  'NGO Audit': '🌍',
  'Other': '✨'
};

export default function Sidebar({ open, collapsed, selectedType, onSelectType, onToggleCollapse }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''} ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-head">
        <h2>Work Type</h2>
        <div className="sidebar-head-actions">
          <button className="icon-btn collapse-sidebar" onClick={onToggleCollapse}>
            {collapsed ? '»' : '«'}
          </button>
        </div>
      </div>
      <div className="sidebar-menu">
        <button
          className={`sidebar-link ${selectedType === '' ? 'active' : ''}`}
          onClick={() => onSelectType('')}
        >
          <span className="sidebar-icon">📋</span>
          <span>All Types</span>
        </button>
        {AUDIT_TYPES.map(type => (
          <button
            key={type}
            className={`sidebar-link ${selectedType === type ? 'active' : ''}`}
            onClick={() => onSelectType(type)}
          >
            <span className="sidebar-icon">{TYPE_ICONS[type] || '📁'}</span>
            <span>{type}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
    