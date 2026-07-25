import React, { useState, useEffect } from 'react';
import { balanceOf, returnedCount, todayStr } from '../utils/helpers.js';

export default function ReturnModal({ isOpen, record, onClose, onConfirm }) {
  const [returnCount, setReturnCount] = useState(1);
  const [returnDate, setReturnDate] = useState(todayStr());
  const [returnedBy, setReturnedBy] = useState('');
  const [returnRemarks, setReturnRemarks] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (record) {
      const bal = balanceOf(record);
      setReturnCount(bal > 0 ? bal : 1);
      setReturnDate(todayStr());
      setReturnedBy(record.assignedTo || '');
      setReturnRemarks('');
      setErrorMsg('');
    }
  }, [record, isOpen]);

  if (!isOpen || !record) return null;

  const bal = balanceOf(record);

  const handleSubmit = (e) => {
    e.preventDefault();
    const count = Number(returnCount);
    if (!count || count <= 0 || count > bal) {
      setErrorMsg(`Please enter a valid count between 1 and ${bal}`);
      return;
    }

    onConfirm(record.id, {
      count,
      date: returnDate || todayStr(),
      returnedBy,
      remarks: returnRemarks
    });
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="modal" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h3>Return Physical Files</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ marginBottom: '14px', fontSize: '13.5px', color: 'var(--gray-700)', lineHeight: '1.6' }}>
            <b>{record.clientName}</b> ({record.id})<br />
            Received: <b>{record.filesReceived}</b> &nbsp;|&nbsp;
            Returned so far: <b>{returnedCount(record)}</b> &nbsp;|&nbsp;
            Pending Balance: <b style={{ color: 'var(--blue-600)' }}>{bal}</b>
          </div>

          {errorMsg && (
            <div style={{ color: 'var(--red-600)', fontSize: '12px', marginBottom: '10px' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid two">
              <div className="field">
                <label>Files Returning Now *</label>
                <input
                  type="number"
                  min="1"
                  max={bal}
                  value={returnCount}
                  onChange={(e) => setReturnCount(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label>Date Returned *</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label>Returned By (Staff)</label>
                <input
                  type="text"
                  value={returnedBy}
                  onChange={(e) => setReturnedBy(e.target.value)}
                  placeholder="e.g. Staff Name"
                />
              </div>

              <div className="field">
                <label>Return Remarks</label>
                <input
                  type="text"
                  value={returnRemarks}
                  onChange={(e) => setReturnRemarks(e.target.value)}
                  placeholder="e.g. Batch 1 returned"
                />
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            Confirm Return
          </button>
        </div>
      </div>
    </div>
  );
}
