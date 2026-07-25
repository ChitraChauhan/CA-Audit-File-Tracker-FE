import React from 'react';
import { fmtDate, balanceOf, returnedCount, isOverdue } from '../utils/helpers.js';

export default function DetailsModal({ isOpen, record, onClose }) {
  if (!isOpen || !record) return null;

  const bal = balanceOf(record);

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

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{record.id} — {record.clientName}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-block">
              <h4>Client Information</h4>
              <div className="detail-row"><span>Client Name</span><span>{record.clientName}</span></div>
              <div className="detail-row"><span>Client Code</span><span>{record.clientCode || '—'}</span></div>
              <div className="detail-row"><span>Contact Person</span><span>{record.contactPerson || '—'}</span></div>
              <div className="detail-row"><span>Mobile</span><span>{record.mobile || '—'}</span></div>

              <h4 style={{ marginTop: '18px' }}>File & Movement Details</h4>
              <div className="detail-row"><span>Financial Year</span><span>{record.financialYear}</span></div>
              <div className="detail-row"><span>Audit / Filing Type</span><span>{record.auditType}</span></div>
              <div className="detail-row"><span>Files Received</span><span>{record.filesReceived}</span></div>
              <div className="detail-row"><span>Date Received</span><span>{fmtDate(record.dateReceived)}</span></div>
              <div className="detail-row"><span>Received By</span><span>{record.receivedBy || '—'}</span></div>
              <div className="detail-row"><span>Assigned To</span><span>{record.assignedTo || '—'}</span></div>
              <div className="detail-row"><span>Expected Return</span><span>{fmtDate(record.expectedReturnDate)}</span></div>
              <div className="detail-row"><span>Actual Return</span><span>{fmtDate(record.actualReturnDate)}</span></div>
              <div className="detail-row"><span>Files Returned</span><span>{returnedCount(record)}</span></div>
              <div className="detail-row"><span>Balance Pending</span><span style={{ color: 'var(--blue-600)' }}>{bal}</span></div>
              <div className="detail-row"><span>Status</span><span>{renderStatusBadge(record)}</span></div>
              <div className="detail-row"><span>Priority</span><span>{renderPriorityBadge(record.priority)}</span></div>
            </div>

            <div className="detail-block">
              <h4>Remarks & Notes</h4>
              <div className="detail-row"><span>Internal Notes</span><span>{record.internalNotes || '—'}</span></div>
              <div className="detail-row"><span>Pending Documents</span><span>{record.pendingDocuments || '—'}</span></div>
              <div className="detail-row"><span>Client Remarks</span><span>{record.clientRemarks || '—'}</span></div>

              <h4 style={{ marginTop: '18px' }}>Return History Timeline</h4>
              {(record.returnHistory || []).length > 0 ? (
                <ul className="history-list">
                  {record.returnHistory.map((h, i) => (
                    <li key={i} className="history-item">
                      <span>
                        {fmtDate(h.date)} — <b>{h.count} file(s)</b> by {h.returnedBy || '—'}
                      </span>
                      <span style={{ color: 'var(--gray-500)' }}>{h.remarks || ''}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: 'var(--gray-500)', fontSize: '13px' }}>No physical files returned yet.</p>
              )}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-light" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
