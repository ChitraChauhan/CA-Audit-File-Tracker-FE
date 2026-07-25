export const todayStr = () => new Date().toISOString().slice(0, 10);

export const fmtDate = (d) => {
  if (!d) return '—';
  const dt = new Date(d + 'T00:00:00');
  if (isNaN(dt.getTime())) return '—';
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const currentFY = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const startY = m >= 4 ? y : y - 1;
  return `${startY}-${(startY + 1).toString().slice(2)}`;
};

export const fyOptions = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const startY = m >= 4 ? y : y - 1;
  const out = [];
  for (let offset = -4; offset <= 1; offset++) {
    const s = startY + offset;
    out.push(`${s}-${(s + 1).toString().slice(2)}`);
  }
  return out.reverse();
};

export const returnedCount = (rec) => {
  return (rec.returnHistory || []).reduce((s, r) => s + Number(r.count || 0), 0);
};

export const balanceOf = (rec) => {
  return Math.max(0, Number(rec.filesReceived || 0) - returnedCount(rec));
};

export const isOverdue = (rec) => {
  const bal = balanceOf(rec);
  return bal > 0 && rec.expectedReturnDate && rec.expectedReturnDate < todayStr() && !['Fully Returned', 'Closed'].includes(rec.status);
};

export const isDueToday = (rec) => {
  const bal = balanceOf(rec);
  return bal > 0 && rec.expectedReturnDate === todayStr();
};

export const toCSV = (list) => {
  const headers = [
    'Sr No', 'File ID', 'Client Name', 'Status', 'Filing Date', 'Group',
    'Fee Type', 'Amount Due', 'Receipt Amount', 'Pending Amount', 'Payment Status',
    'Received Date', 'Received In Bank', 'Tally Entry Status',
    'Financial Year', 'Work Type', 'Priority', 'Assigned To', 'Internal Notes'
  ];
  const rows = list.map(r => [
    r.srNo || '', r.id, r.clientName, r.status, r.filingDate || '', r.relation || '',
    r.feeType || '', r.amountDue || '', r.receiptAmount || '', r.pendingAmount || '', r.receiptStatus || '',
    r.receivedDate || '', r.receivedInBank || '', r.tallyEntryStatus || '',
    r.financialYear, r.auditType, r.priority, r.assignedTo, r.internalNotes
  ]);
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [headers.map(esc).join(','), ...rows.map(row => row.map(esc).join(','))].join('\r\n');
};

export const downloadCSV = (csv, filename) => {
  const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const AUDIT_TYPES = [
  'ITR Filing', 'Tax Audit', 'Statutory Audit', 'Internal Audit', 'GST Audit', 'Bank Audit',
  'Concurrent Audit', 'Trust Audit', 'Society Audit', 'NGO Audit', 'Other'
];

export const STATUSES = [
  'DATA RECEIVED', 'FILED', 'NOT REQUIRED', 'PENDING',
  'Files Received', 'Work Started', 'Audit In Progress', 'Query Sent to Client',
  'Waiting for Client Reply', 'Under Partner Review', 'Audit Completed',
  'Files Ready to Return', 'Partially Returned', 'Fully Returned', 'Closed'
];

export const PRIORITIES = ['High', 'Medium', 'Low'];

export const RELATIONS = [
  'ALPHA - DAMAN',
  'ALPHA - SURAT',
  'AVI - SHISHIR',
  'CHHATRALA',
  "FATHER/S CUSTOMER",
  'FRIENDS',
  'G A FOOD',
  'KALPESH MARFATIA',
  'KISHOR SIR',
  'MASTERMIND',
  'OTHERS',
  'OWN FAMILY',
  'RELATIVE',
  'SHANKAR MITTAL',
  'SNK',
  'SUNILBHAI',
  'SUPARNA',
  'TULIPSTAR'
];

export const BANKS = [
  'CHITRA - SBI',
  'CHITRA - HDFC',
  'MAYANK - SBI',
  'MAYANK - HDFC',
  'HARSHI - SBI',
  'OTHERS'
];

export const FEE_TYPES = ['PAID', 'FREE'];
