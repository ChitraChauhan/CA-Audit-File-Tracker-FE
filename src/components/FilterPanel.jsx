import React from 'react';
import { AUDIT_TYPES, STATUSES, PRIORITIES } from '../utils/helpers.js';

export default function FilterPanel({
  filters,
  onChange,
  onReset,
  onExportView,
  staffList,
  yearList,
  filteredCount,
  totalCount,
  totalPending,
  totalReturned
}) {
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    onChange(id, type === 'checkbox' ? checked : value);
  };

  return (
    <div className="panel filters-panel">
      <div className="panel-head">
        <h2>Filters & Search</h2>
        <div className="header-actions">
          <button className="btn btn-light btn-sm" onClick={onReset}>
            Reset Filters
          </button>
          <button className="btn btn-light btn-sm" onClick={onExportView}>
            ⬇️ Export Current View
          </button>
        </div>
      </div>
      <div className="panel-body">
        <div className="filters-grid">
          <div className="field">
            <label>Staff (Assigned To)</label>
            <select id="staff" value={filters.staff} onChange={handleChange}>
              <option value="">All Staff</option>
              {staffList.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Audit Type</label>
            <select id="auditType" value={filters.auditType} onChange={handleChange}>
              <option value="">All Types</option>
              {AUDIT_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Status</label>
            <select id="status" value={filters.status} onChange={handleChange}>
              <option value="">All Statuses</option>
              {STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Priority</label>
            <select id="priority" value={filters.priority} onChange={handleChange}>
              <option value="">All Priorities</option>
              {PRIORITIES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Financial Year</label>
            <select id="financialYear" value={filters.financialYear} onChange={handleChange}>
              <option value="">All Years</option>
              {yearList.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Date Received From</label>
            <input type="date" id="recvFrom" value={filters.recvFrom} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Date Received To</label>
            <input type="date" id="recvTo" value={filters.recvTo} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Expected Return From</label>
            <input type="date" id="expFrom" value={filters.expFrom} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Expected Return To</label>
            <input type="date" id="expTo" value={filters.expTo} onChange={handleChange} />
          </div>
        </div>

        <div className="checks-line">
          <label className="checkbox-row">
            <input
              type="checkbox"
              id="onlyPending"
              checked={filters.onlyPending}
              onChange={handleChange}
            />
            Only Pending Files
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              id="onlyReturned"
              checked={filters.onlyReturned}
              onChange={handleChange}
            />
            Only Returned Files
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              id="onlyOverdue"
              checked={filters.onlyOverdue}
              onChange={handleChange}
            />
            Only Overdue Files
          </label>
        </div>

        <div className="search-row">
          <input
            type="text"
            id="q"
            value={filters.q}
            onChange={handleChange}
            placeholder="🔍 Search by client name, client code, audit type, staff name or remarks..."
          />
        </div>

        <div className="filters-footer">
          <span className="filter-count">
            Showing <b>{filteredCount}</b> of <b>{totalCount}</b> records
          </span>
          <span className="filter-count">
            Total Pending: <b id="totPending">{totalPending}</b> &nbsp;|&nbsp; Total Returned: <b id="totReturned">{totalReturned}</b>
          </span>
        </div>
      </div>
    </div>
  );
}
