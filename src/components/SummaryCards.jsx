import React from 'react';

export default function SummaryCards({ stats, activeFilter, onCardClick }) {
  const cards = [
    { key: 'all', emoji: '📥', count: stats.totalReceivedFiles || 0, label: 'Total Files Received', cls: 'received' },
    { key: 'withus', emoji: '📂', count: stats.withUsFiles || 0, label: 'Files Currently With Us', cls: 'withus' },
    { key: 'returned', emoji: '✅', count: stats.returnedFiles || 0, label: 'Files Returned', cls: 'returned' },
    { key: 'overdue', emoji: '⚠️', count: stats.overdueCount || 0, label: 'Overdue Files', cls: 'overdue' },
    { key: 'duetoday', emoji: '📅', count: stats.dueTodayCount || 0, label: 'Due Today', cls: 'duetoday' },
    { key: 'wip', emoji: '🔄', count: stats.wipCount || 0, label: 'Work In Progress', cls: 'wip' }
  ];

  return (
    <div className="summary-bar">
      {cards.map(c => (
        <div
          key={c.key}
          className={`sum-card ${c.cls} ${activeFilter === c.key ? 'active' : ''}`}
          onClick={() => onCardClick(c.key)}
        >
          <div className="top">
            <span className="emoji">{c.emoji}</span>
          </div>
          <div className="count">{c.count}</div>
          <div className="label">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
