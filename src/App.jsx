import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header.jsx';
import SummaryCards from './components/SummaryCards.jsx';
import FilterPanel from './components/FilterPanel.jsx';
import RecordsTable from './components/RecordsTable.jsx';
import FileModal from './components/FileModal.jsx';
import ReturnModal from './components/ReturnModal.jsx';
import DetailsModal from './components/DetailsModal.jsx';

import {
  fetchAuditFiles,
  fetchSummaryStats,
  createAuditFile,
  updateAuditFile,
  returnAuditFiles,
  deleteAuditFile,
  clearAllAuditFiles,
  seedAuditRecords
} from './utils/api.js';

import { toCSV, downloadCSV, todayStr, balanceOf, returnedCount, defaultFY } from './utils/helpers.js';

export default function App() {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({
    totalReceivedFiles: 0,
    withUsFiles: 0,
    returnedFiles: 0,
    overdueCount: 0,
    dueTodayCount: 0,
    wipCount: 0,
    staffList: [],
    yearList: []
  });

  const [lastUpdated, setLastUpdated] = useState('');
  const [selectedYear, setSelectedYear] = useState(defaultFY());
  const [activeSummaryFilter, setActiveSummaryFilter] = useState('all');
  const [sortField, setSortField] = useState('expectedReturnDate');
  const [sortDir, setSortDir] = useState('asc');

  const [filters, setFilters] = useState({
    staff: '',
    auditType: '',
    status: '',
    priority: '',
    recvFrom: '',
    recvTo: '',
    expFrom: '',
    expTo: '',
    onlyPending: false,
    onlyReturned: false,
    onlyOverdue: false,
    q: ''
  });

  // Modal States
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returningRecord, setReturningRecord] = useState(null);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [viewingRecord, setViewingRecord] = useState(null);

  // Toast System
  const [toasts, setToasts] = useState([]);

  const addToast = (msg, type = '') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2800);
  };

  const loadData = useCallback(async () => {
    try {
      const queryParams = {
        ...filters,
        financialYear: selectedYear,
        summaryFilter: activeSummaryFilter,
        sortField,
        sortDir
      };

      const [data, statsData] = await Promise.all([
        fetchAuditFiles(queryParams),
        fetchSummaryStats()
      ]);

      setRecords(data);
      setStats(statsData);
      setLastUpdated(new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }));
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to load records', 'danger');
    }
  }, [filters, selectedYear, activeSummaryFilter, sortField, sortDir]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handler for Filter Changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      staff: '',
      auditType: '',
      status: '',
      priority: '',
      recvFrom: '',
      recvTo: '',
      expFrom: '',
      expTo: '',
      onlyPending: false,
      onlyReturned: false,
      onlyOverdue: false,
      q: ''
    });
    setActiveSummaryFilter('all');
    addToast('Filters reset', 'success');
  };

  const handleCardClick = (filterKey) => {
    setActiveSummaryFilter(prev => (prev === filterKey ? 'all' : filterKey));
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  // CRUD Handlers
  const handleSaveRecord = async (formData) => {
    try {
      if (formData.id) {
        await updateAuditFile(formData.id, formData);
        addToast('Record updated successfully', 'success');
      } else {
        await createAuditFile(formData);
        addToast('New audit file record created', 'success');
      }
      setFileModalOpen(false);
      setEditingRecord(null);
      loadData();
    } catch (err) {
      addToast(err.message || 'Failed to save record', 'danger');
    }
  };

  const handleConfirmReturn = async (id, returnData) => {
    try {
      const res = await returnAuditFiles(id, returnData);
      addToast(`${returnData.count} file(s) marked returned for ${res.clientName}`, 'success');
      setReturnModalOpen(false);
      setReturningRecord(null);
      loadData();
    } catch (err) {
      addToast(err.message || 'Failed to record return', 'danger');
    }
  };

  const handleDeleteRecord = async (rec) => {
    if (window.confirm(`Delete record ${rec.id} for "${rec.clientName}"? This cannot be undone.`)) {
      try {
        await deleteAuditFile(rec.id);
        addToast('Record deleted', 'danger');
        loadData();
      } catch (err) {
        addToast(err.message || 'Failed to delete record', 'danger');
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('This will permanently delete ALL audit file records from the database. Continue?')) {
      if (window.confirm('Are you absolutely sure? This action cannot be undone.')) {
        try {
          await clearAllAuditFiles();
          addToast('All data cleared', 'danger');
          loadData();
        } catch (err) {
          addToast(err.message || 'Failed to clear data', 'danger');
        }
      }
    }
  };

  // CSV Export Handlers
  const handleExportView = () => {
    if (!records.length) {
      addToast('No records to export', 'danger');
      return;
    }
    downloadCSV(toCSV(records), `audit-files-view-${todayStr()}.csv`);
    addToast('Current view exported to CSV', 'success');
  };

  const handleExportAll = async () => {
    try {
      const allData = await fetchAuditFiles();
      downloadCSV(toCSV(allData), `audit-files-all-${todayStr()}.csv`);
      addToast('All records exported to CSV', 'success');
    } catch (err) {
      addToast('Failed to export all records', 'danger');
    }
  };

  // Total calculations for filter footer
  const totalPending = records.reduce((s, r) => s + balanceOf(r), 0);
  const totalReturned = records.reduce((s, r) => s + returnedCount(r), 0);

  return (
    <div>
      <Header
        lastUpdated={lastUpdated}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        onPrint={() => window.print()}
        onExportAll={handleExportAll}
        onNewFile={() => {
          setEditingRecord(null);
          setFileModalOpen(true);
        }}
      />

      <div className="container">
        <SummaryCards
          stats={stats}
          activeFilter={activeSummaryFilter}
          onCardClick={handleCardClick}
        />

        <FilterPanel
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          onExportView={handleExportView}
          staffList={stats.staffList || []}
          yearList={stats.yearList || []}
          filteredCount={records.length}
          totalCount={stats.totalRecordsCount || 0}
          totalPending={totalPending}
          totalReturned={totalReturned}
        />

        <RecordsTable
          records={records}
          sortField={sortField}
          sortDir={sortDir}
          onSort={handleSort}
          onView={(rec) => {
            setViewingRecord(rec);
            setDetailsModalOpen(true);
          }}
          onEdit={(rec) => {
            setEditingRecord(rec);
            setFileModalOpen(true);
          }}
          onReturn={(rec) => {
            setReturningRecord(rec);
            setReturnModalOpen(true);
          }}
          onDelete={handleDeleteRecord}
          onClearAll={handleClearAll}
        />
      </div>

      {/* Modals */}
      <FileModal
        isOpen={fileModalOpen}
        record={editingRecord}
        onClose={() => {
          setFileModalOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveRecord}
      />

      <ReturnModal
        isOpen={returnModalOpen}
        record={returningRecord}
        onClose={() => {
          setReturnModalOpen(false);
          setReturningRecord(null);
        }}
        onConfirm={handleConfirmReturn}
      />

      <DetailsModal
        isOpen={detailsModalOpen}
        record={viewingRecord}
        onClose={() => {
          setDetailsModalOpen(false);
          setViewingRecord(null);
        }}
      />

      {/* Toast Notifications */}
      <div id="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.msg}
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="app-footer">
        Made with ❤️ by Chitra Mayank Sankariya
      </footer>
    </div>
  );
}
