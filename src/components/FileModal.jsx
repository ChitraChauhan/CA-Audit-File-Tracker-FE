import React, { useState, useEffect } from 'react';
import { AUDIT_TYPES, STATUSES, PRIORITIES, currentFY, fyOptions, todayStr } from '../utils/helpers.js';

export default function FileModal({ isOpen, record, onClose, onSave }) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientCode: '',
    contactPerson: '',
    mobile: '',
    financialYear: currentFY(),
    auditType: '',
    priority: 'Medium',
    filesReceived: 1,
    dateReceived: todayStr(),
    receivedBy: '',
    assignedTo: '',
    expectedReturnDate: '',
    status: 'Files Received',
    internalNotes: '',
    pendingDocuments: '',
    clientRemarks: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (record) {
      setFormData({
        id: record.id,
        clientName: record.clientName || '',
        clientCode: record.clientCode || '',
        contactPerson: record.contactPerson || '',
        mobile: record.mobile || '',
        financialYear: record.financialYear || currentFY(),
        auditType: record.auditType || '',
        priority: record.priority || 'Medium',
        filesReceived: record.filesReceived !== undefined ? record.filesReceived : 1,
        dateReceived: record.dateReceived || todayStr(),
        receivedBy: record.receivedBy || '',
        assignedTo: record.assignedTo || '',
        expectedReturnDate: record.expectedReturnDate || '',
        status: record.status || 'Files Received',
        internalNotes: record.internalNotes || '',
        pendingDocuments: record.pendingDocuments || '',
        clientRemarks: record.clientRemarks || ''
      });
    } else {
      setFormData({
        clientName: '',
        clientCode: '',
        contactPerson: '',
        mobile: '',
        financialYear: currentFY(),
        auditType: '',
        priority: 'Medium',
        filesReceived: 1,
        dateReceived: todayStr(),
        receivedBy: '',
        assignedTo: '',
        expectedReturnDate: '',
        status: 'Files Received',
        internalNotes: '',
        pendingDocuments: '',
        clientRemarks: ''
      });
    }
    setErrors({});
  }, [record, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: false }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.clientName.trim()) newErrors.clientName = true;
    if (!formData.financialYear) newErrors.financialYear = true;
    if (!formData.auditType) newErrors.auditType = true;
    if (formData.filesReceived === undefined || Number(formData.filesReceived) < 0) newErrors.filesReceived = true;
    if (!formData.dateReceived) newErrors.dateReceived = true;

    if (formData.mobile && !/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...formData,
      filesReceived: Number(formData.filesReceived)
    });
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="modal modal-large">
        <div className="modal-header">
          <h3>{record ? `Edit Audit File — ${record.id}` : 'New Audit File'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} id="recordForm">
            {/* CLIENT INFORMATION */}
            <div className="form-section-title">CLIENT INFORMATION</div>
            <div className="form-grid three">
              <div className={`field ${errors.clientName ? 'invalid' : ''}`}>
                <label>CLIENT NAME *</label>
                <input
                  type="text"
                  id="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder=""
                  required
                />
                <div className="error-text">Client name is required</div>
              </div>

              <div className="field">
                <label>CLIENT CODE</label>
                <input
                  type="text"
                  id="clientCode"
                  value={formData.clientCode}
                  onChange={handleChange}
                  placeholder=""
                />
              </div>

              <div className="field">
                <label>CONTACT PERSON</label>
                <input
                  type="text"
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder=""
                />
              </div>

              <div className={`field ${errors.mobile ? 'invalid' : ''}`}>
                <label>MOBILE NUMBER</label>
                <input
                  type="tel"
                  id="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="10-digit mobile"
                />
                <div className="error-text">Enter valid 10-digit mobile number</div>
              </div>
            </div>

            {/* FILE INFORMATION */}
            <div className="form-section-title">FILE INFORMATION</div>
            <div className="form-grid three">
              <div className={`field ${errors.financialYear ? 'invalid' : ''}`}>
                <label>FINANCIAL YEAR *</label>
                <select id="financialYear" value={formData.financialYear} onChange={handleChange} required>
                  <option value="">Select FY</option>
                  {fyOptions().map(fy => (
                    <option key={fy} value={fy}>{fy}</option>
                  ))}
                </select>
                <div className="error-text">Financial Year is required</div>
              </div>

              <div className={`field ${errors.auditType ? 'invalid' : ''}`}>
                <label>AUDIT TYPE *</label>
                <select id="auditType" value={formData.auditType} onChange={handleChange} required>
                  <option value="">Select Type</option>
                  {AUDIT_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <div className="error-text">Audit Type is required</div>
              </div>

              <div className="field">
                <label>PRIORITY</label>
                <select id="priority" value={formData.priority} onChange={handleChange}>
                  {PRIORITIES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* FILE MOVEMENT */}
            <div className="form-section-title">FILE MOVEMENT</div>
            <div className="form-grid three">
              <div className={`field ${errors.filesReceived ? 'invalid' : ''}`}>
                <label>NUMBER OF FILES RECEIVED *</label>
                <input
                  type="number"
                  id="filesReceived"
                  min="0"
                  value={formData.filesReceived}
                  onChange={handleChange}
                  required
                />
                <div className="error-text">Must be a valid number</div>
              </div>

              <div className={`field ${errors.dateReceived ? 'invalid' : ''}`}>
                <label>DATE RECEIVED *</label>
                <input
                  type="date"
                  id="dateReceived"
                  value={formData.dateReceived}
                  onChange={handleChange}
                  required
                />
                <div className="error-text">Date Received is required</div>
              </div>

              <div className="field">
                <label>RECEIVED BY (STAFF)</label>
                <input
                  type="text"
                  id="receivedBy"
                  value={formData.receivedBy}
                  onChange={handleChange}
                  placeholder=""
                />
              </div>

              <div className="field">
                <label>ASSIGNED TO (STAFF)</label>
                <input
                  type="text"
                  id="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  placeholder=""
                />
              </div>

              <div className={`field ${errors.expectedReturnDate ? 'invalid' : ''}`}>
                <label>EXPECTED RETURN DATE *</label>
                <input
                  type="date"
                  id="expectedReturnDate"
                  value={formData.expectedReturnDate}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>STATUS</label>
                <select id="status" value={formData.status} onChange={handleChange}>
                  {STATUSES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* REMARKS */}
            <div className="form-section-title">REMARKS</div>
            <div className="form-grid three">
              <div className="field full-width">
                <label>INTERNAL NOTES</label>
                <textarea
                  id="internalNotes"
                  rows="2"
                  value={formData.internalNotes}
                  onChange={handleChange}
                  placeholder=""
                ></textarea>
              </div>
            </div>
            <div className="form-grid two" style={{ marginTop: '10px' }}>
              <div className="field">
                <label>PENDING DOCUMENTS</label>
                <textarea
                  id="pendingDocuments"
                  rows="2"
                  value={formData.pendingDocuments}
                  onChange={handleChange}
                  placeholder=""
                ></textarea>
              </div>
              <div className="field">
                <label>CLIENT REMARKS</label>
                <textarea
                  id="clientRemarks"
                  rows="2"
                  value={formData.clientRemarks}
                  onChange={handleChange}
                  placeholder=""
                ></textarea>
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            Save Record
          </button>
        </div>
      </div>
    </div>
  );
}

