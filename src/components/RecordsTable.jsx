import React from 'react';
import { fmtDate, balanceOf, returnedCount, isOverdue, isDueToday } from '../utils/helpers.js';

export default function RecordsTable({
  records,
  sortField,
  sortDir,
  onSort,
  onView,
  onEdit,
  onReturn,
  onDelete,
  onClearAll
}) {
  const WIP_STATUSES = [
    'Work Started',
    'Audit In Progress',
    'Query Sent to Client',
    'Waiting for Client Reply',
    'Under Partner Review'
  ];

  const renderStatusBadge = (rec) => {
    const s = rec.status;
    let cls = 'badge-gray';
    if (isOverdue(rec)) cls = 'badge-red';
    else if (['Fully Returned', 'Closed'].includes(s)) cls = 'badge-green';
    else if (['Files Ready to Return', 'Audit Completed'].includes(s)) cls = 'badge-blue';
    else if (WIP_STATUSES.includes(s)) cls = 'badge-purple';
    else if (s === 'Partially Returned') cls = 'badge-amber';

    return (
      <span className={`badge ${cls}`}>
        <span className="badge-dot"></span>
        {s}
      </span>
    );
  };

  const renderPriorityBadge = (p) => {
    const map = { High: 'badge-red', Medium: 'badge-amber', Low: 'badge-gray' };
    return <span className={`badge ${map[p] || 'badge-gray'}`}>{p}</span>;
  };

  const renderBalanceBadge = (rec) => {
    const bal = balanceOf(rec);
    if (bal === 0) return <span className="badge badge-green">0</span>;
    if (isOverdue(rec)) return <span className="badge badge-red">{bal}</span>;
    return <span className="badge badge-blue">{bal}</span>;
  };

  const columns = [
    { field: 'id', label: 'File ID' },
    { field: 'clientName', label: 'Client' },
    { field: 'auditType', label: 'Work Type' },
    { field: 'financialYear', label: 'FY' },
    { field: 'filingDate', label: 'Filing Date' },
    { field: 'relation', label: 'Group' },
    { field: 'feeType', label: 'Fee Type' },
    { field: 'amountDue', label: 'Amount Due' },
    { field: 'receiptAmount', label: 'Received Amount' },
    { field: 'pendingAmount', label: 'Pending Amount' },
    { field: 'receiptStatus', label: 'Payment Status' },
    { field: 'receivedDate', label: 'Received Date' },
    { field: 'receivedInBank', label: 'Received In Bank' },
    { field: 'tallyEntryStatus', label: 'Tally Entry Status' },
    { field: 'returned', label: 'Returned' },
    { field: 'balance', label: 'Balance' },
    { field: 'status', label: 'Status' },
    { field: 'priority', label: 'Priority' }
  ];

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Audit File Records</h2>
        <button className="btn btn-danger-outline btn-sm" onClick={onClearAll}>
          🗑️ Clear All Data
        </button>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.field} onClick={() => onSort(col.field)}>
                  {col.label}
                  {sortField === col.field && (
                    <span className="arrow">{sortDir === 'asc' ? ' ▲' : ' ▼'}</span>
                  )}
                </th>
              ))}
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map(rec => {
              const overdue = isOverdue(rec);
              const dueToday = isDueToday(rec);
              const returned = balanceOf(rec) === 0;

              let rowCls = '';
              if (overdue) rowCls = 'row-overdue';
              else if (dueToday) rowCls = 'row-duetoday';
              else if (returned) rowCls = 'row-returned';

              const bal = balanceOf(rec);
              const pendingAmount = (rec.amountDue || 0) - (rec.receiptAmount || 0);

              return (
                <tr key={rec.id || rec._id} className={rowCls}>
                  <td className="mono">{rec.id}</td>
                  <td className="client-cell">
                    <b>{rec.clientName}</b>
                    {rec.clientCode && <span>{rec.clientCode}</span>}
                  </td>
                  <td>{rec.auditType}</td>
                  <td>{rec.financialYear}</td>
                  <td>{fmtDate(rec.filingDate)}</td>
                  <td>{rec.relation || '—'}</td>
                  <td>{rec.feeType || '—'}</td>
                  <td>{rec.amountDue || '—'}</td>
                  <td>{rec.receiptAmount || '—'}</td>
                  <td>{pendingAmount > 0 ? pendingAmount : '—'}</td>
                  <td>{rec.receiptStatus || '—'}</td>
                  <td>{fmtDate(rec.receivedDate)}</td>
                  <td>{rec.receivedInBank || '—'}</td>
                  <td>{rec.tallyEntryStatus || '—'}</td>
                  <td>{returnedCount(rec)}</td>
                  <td>{renderBalanceBadge(rec)}</td>
                  <td>{renderStatusBadge(rec)}</td>
                  <td>{renderPriorityBadge(rec.priority)}</td>
                  <td className="remarks-cell" title={rec.internalNotes || ''}>
                    {rec.internalNotes || '—'}
                  </td>
                  <td className="actions-cell">
                    <button className="icon-btn" title="View Details" onClick={() => onView(rec)}>
                      👁️
                    </button>
                    <button className="icon-btn" title="Edit" onClick={() => onEdit(rec)}>
                      ✏️
                    </button>
                    {bal > 0 && (
                      <button className="icon-btn" title="Mark Returned" onClick={() => onReturn(rec)}>
                        📦
                      </button>
                    )}
                    <button className="icon-btn" title="Delete" onClick={() => onDelete(rec)}>
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {records.length === 0 && (
        <div className="empty-state">
          <div className="emo">🗂️</div>
          No records match the current filters.
        </div>
      )}
    </div>
  );
}
