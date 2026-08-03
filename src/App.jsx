import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header.jsx';
import SummaryCards from './components/SummaryCards.jsx';
import FilterPanel from './components/FilterPanel.jsx';
import RecordsTable from './components/RecordsTable.jsx';
import Sidebar from './components/Sidebar.jsx';
import AuthPage from './components/AuthPage.jsx';
import FileModal from './components/FileModal.jsx';
import ReturnModal from './components/ReturnModal.jsx';
import DetailsModal from './components/DetailsModal.jsx';

import {
  loginUser,
  registerUser,
  getMe,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);

  const handleToggleSidebar = () => {
    const isDesktop = window.matchMedia('(min-width: 1231px)').matches;
    if (isDesktop) {
      setSidebarCollapsed(prev => !prev);
      if (sidebarOpen) setSidebarOpen(false);
    } else {
      setSidebarOpen(prev => !prev);
    }
  };

  const handleCloseSidebar = () => {
    const isDesktop = window.matchMedia('(min-width: 1231px)').matches;
    if (isDesktop) {
      setSidebarCollapsed(true);
    } else {
      setSidebarOpen(false);
    }
  };

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
    setLoading(true);
    try {
      const activeFinancialYear = selectedYear || defaultFY();
      const queryParams = {
        ...filters,
        financialYear: activeFinancialYear,
        ...(activeSummaryFilter && activeSummaryFilter !== 'all' ? { summaryFilter: activeSummaryFilter } : {}),
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
    } finally {
      setLoading(false);
    }
  }, [filters, selectedYear, activeSummaryFilter, sortField, sortDir]);

  const bootstrapAuth = useCallback(async () => {
    setAuthLoading(true);
    const token = localStorage.getItem('authToken');
    if (!token) {
      setAuthLoading(false);
      return;
    }

    try {
      const response = await getMe();
      setUser(response.user);
    } catch (error) {
      console.warn('Auth bootstrap failed:', error.message || error);
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrapAuth();
  }, [bootstrapAuth]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadData();
  }, [loadData, user]);

  const handleLogin = async (credentials) => {
    setLoading(true);
    try {
      const response = await loginUser(credentials);
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
    } catch (error) {
      throw new Error(error.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (data) => {
    setLoading(true);
    try {
      const response = await registerUser(data);
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
    } catch (error) {
      throw new Error(error.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setRecords([]);
    setStats({
      totalReceivedFiles: 0,
      withUsFiles: 0,
      returnedFiles: 0,
      overdueCount: 0,
      dueTodayCount: 0,
      wipCount: 0,
      staffList: [],
      yearList: []
    });
    setLastUpdated('');
    setLoading(false);
  };

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

  const handleWorkTypeSelect = (type) => {
    setLoading(true);
    setFilters(prev => ({ ...prev, auditType: type }));
    setSidebarOpen(false);
    setSidebarCollapsed(false);
  };

  const handleYearChange = (year) => {
    setLoading(true);
    setSelectedYear(year);
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

  if (authLoading) {
    return (
      <div className="app-shell auth-loading">
        <div className="loading-overlay visible">
          <div className="loading-box">
            <div className="spinner" />
            <span>Checking authentication…</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onLogin={handleLogin} onSignup={handleSignup} />;
  }

  return (
    <div className={`app-shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div
        className={`loading-overlay ${loading ? 'visible' : ''}`}
        style={{
          opacity: loading ? 1 : 0,
          visibility: loading ? 'visible' : 'hidden',
          pointerEvents: loading ? 'all' : 'none'
        }}
      >
        <div className="loading-box">
          <div className="spinner" />
          <span>Loading data…</span>
        </div>
      </div>

      <Sidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        selectedType={filters.auditType}
        onSelectType={handleWorkTypeSelect}
        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
      />

      <div className="main-layout">
        <Header
          lastUpdated={lastUpdated}
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
          onPrint={() => window.print()}
          onExportAll={handleExportAll}
          onNewFile={() => {
            setEditingRecord(null);
            setFileModalOpen(true);
          }}
          onToggleSidebar={handleToggleSidebar}
          onLogout={handleLogout}
          user={user}
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

        <footer className="app-footer">
          Made with ❤️ by Chitra Mayank Sankariya
        </footer>
      </div>

      <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />

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
    </div>
  );
}
