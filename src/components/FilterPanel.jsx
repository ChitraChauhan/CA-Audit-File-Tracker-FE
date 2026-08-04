import React from 'react';
import { STATUSES, PRIORITIES, BANKS } from '../utils/helpers.js';

const PAYMENT_STATUSES = ['Pending', 'Partial', 'Cleared'];
const TALLY_STATUSES = ['Pending', 'Done', 'Not Required'];

export default function FilterPanel({
  filters,
  onChange,
  onReset,
  onExportView,
  staffList,
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

          <div className="field">
            <label>Amount Due</label>
            <input type="number" id="amountDue" value={filters.amountDue} onChange={handleChange} placeholder="0.00" step="0.01" />
          </div>
          <div className="field">
            <label>Receipt Amount</label>
            <input type="number" id="receiptAmount" value={filters.receiptAmount} onChange={handleChange} placeholder="0.00" step="0.01" />
          </div>
          <div className="field">
            <label>Payment Status</label>
            <select id="receiptStatus" value={filters.receiptStatus} onChange={handleChange}>
              <option value="">All Statuses</option>
              {PAYMENT_STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Received Date From</label>
            <input type="date" id="paidFrom" value={filters.paidFrom} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Received Date To</label>
            <input type="date" id="paidTo" value={filters.paidTo} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Received In Bank</label>
            <select id="receivedInBank" value={filters.receivedInBank} onChange={handleChange}>
              <option value="">All Banks</option>
              {BANKS.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Tally Entry Status</label>
            <select id="tallyEntryStatus" value={filters.tallyEntryStatus} onChange={handleChange}>
              <option value="">All Statuses</option>
              {TALLY_STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
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
            placeholder="🔍 Search by client name, client code, audit type, staff name, payment status or remarks..."
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
