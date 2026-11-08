import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Layers,
  Search,
  Filter,
  Columns3,
  ListFilter,
  X,
  Sparkles,
  Trophy,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApplicationRecord, Job } from '../types/job';

type ApplicationStatus = ApplicationRecord['status'];

const PIPELINE_COLUMNS: {
  status: ApplicationStatus;
  title: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  borderHover: string;
  dotColor: string;
  description: string;
}[] = [
  {
    status: 'Saved',
    title: 'Saved',
    color: 'border-purple-200 bg-purple-50/30',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-800',
    borderHover: 'hover:border-purple-400',
    dotColor: 'bg-purple-500',
    description: 'Bookmarked opportunities to prepare and apply'
  },
  {
    status: 'Applied',
    title: 'Applied',
    color: 'border-blue-200 bg-blue-50/30',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
    borderHover: 'hover:border-blue-400',
    dotColor: 'bg-blue-500',
    description: 'Submitted on official company career portal'
  },
  {
    status: 'Assessment',
    title: 'Assessment',
    color: 'border-amber-200 bg-amber-50/30',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    borderHover: 'hover:border-amber-400',
    dotColor: 'bg-amber-500',
    description: 'Online coding challenge, NQT, or aptitude round'
  },
  {
    status: 'Interview',
    title: 'Interview',
    color: 'border-indigo-200 bg-indigo-50/30',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-800',
    borderHover: 'hover:border-indigo-400',
    dotColor: 'bg-indigo-500',
    description: 'Technical, managerial, or HR interview rounds'
  },
  {
    status: 'Selected',
    title: 'Selected',
    color: 'border-emerald-200 bg-emerald-50/30',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    borderHover: 'hover:border-emerald-400',
    dotColor: 'bg-emerald-500',
    description: 'Received formal selection offer letter'
  },
  {
    status: 'Not Selected',
    title: 'Not Selected',
    color: 'border-slate-200 bg-slate-50/40',
    badgeBg: 'bg-slate-200',
    badgeText: 'text-slate-700',
    borderHover: 'hover:border-slate-400',
    dotColor: 'bg-slate-400',
    description: 'Application cycle concluded'
  }
];

export const ApplicationTrackerPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    applications,
    updateApplicationStatus,
    updateApplicationNotes,
    deleteApplication,
    addApplicationRecord,
    allJobs,
    showToast
  } = useApp();

  // Search & view modes
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [mobileActiveStage, setMobileActiveStage] = useState<string>('All');

  // Modal State: Add Application
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedJobIdForAdd, setSelectedJobIdForAdd] = useState<string>(allJobs[0]?.id || '');
  const [initialStatusForAdd, setInitialStatusForAdd] = useState<ApplicationStatus>('Applied');
  const [customNotesForAdd, setCustomNotesForAdd] = useState('');
  const [customDateForAdd, setCustomDateForAdd] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Modal State: Edit Notes
  const [editingNotesJobId, setEditingNotesJobId] = useState<string | null>(null);
  const [editedNotesValue, setEditedNotesValue] = useState('');

  // Filtered applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const job = allJobs.find((j) => j.id === app.jobId);
      const q = searchQuery.toLowerCase().trim();

      const matchesQuery =
        !q ||
        (job && job.title.toLowerCase().includes(q)) ||
        (job && job.company.toLowerCase().includes(q)) ||
        (app.notes && app.notes.toLowerCase().includes(q));

      const matchesStatus = filterStatus === 'All' || app.status === filterStatus;

      return matchesQuery && matchesStatus;
    });
  }, [applications, allJobs, searchQuery, filterStatus]);

  // Statistics
  const stats = useMemo(() => {
    const total = applications.length;
    const active = applications.filter(
      (a) => a.status === 'Applied' || a.status === 'Assessment' || a.status === 'Interview'
    ).length;
    const interviews = applications.filter((a) => a.status === 'Interview').length;
    const assessments = applications.filter((a) => a.status === 'Assessment').length;
    const offers = applications.filter((a) => a.status === 'Selected').length;
    return { total, active, interviews, assessments, offers };
  }, [applications]);

  // Handle Add Application submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobIdForAdd) return;

    addApplicationRecord({
      jobId: selectedJobIdForAdd,
      appliedDate: customDateForAdd || new Date().toISOString().split('T')[0],
      status: initialStatusForAdd,
      notes: customNotesForAdd.trim() || `Tracked via HireHub on ${customDateForAdd}`
    });

    setIsAddModalOpen(false);
    setCustomNotesForAdd('');
  };

  // Open Edit Notes modal
  const handleOpenEditNotes = (app: ApplicationRecord) => {
    setEditingNotesJobId(app.jobId);
    setEditedNotesValue(app.notes || '');
  };

  // Save Edit Notes
  const handleSaveNotes = () => {
    if (editingNotesJobId) {
      updateApplicationNotes(editingNotesJobId, editedNotesValue);
      setEditingNotesJobId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      
      {/* ========================================================
          1. HEADER SECTION & KPI METRICS
          ======================================================== */}
      <section className="bg-white border-b border-slate-200/90 pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Application Tracker</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-200/60">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                <span>Job Pipeline & Candidate Journey</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Application Tracker
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Manage your job search progress across 6 standardized milestones. Track assessments, interview schedules, and offers in real-time with local storage persistence.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Track New Application</span>
              </button>
            </div>
          </div>

          {/* KPI Statistics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 mt-6 border-t border-slate-100">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-500 block">Total In Tracker</span>
              <span className="text-xl font-bold text-slate-900">{stats.total}</span>
            </div>
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
              <span className="text-xs text-blue-800 block">Active Pipeline</span>
              <span className="text-xl font-bold text-blue-700">{stats.active}</span>
            </div>
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
              <span className="text-xs text-amber-800 block">Coding Assessments</span>
              <span className="text-xl font-bold text-amber-700">{stats.assessments}</span>
            </div>
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
              <span className="text-xs text-indigo-800 block">Interviews Scheduled</span>
              <span className="text-xl font-bold text-indigo-700">{stats.interviews}</span>
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 col-span-2 sm:col-span-1">
              <span className="text-xs text-emerald-800 block">Offers Received</span>
              <span className="text-xl font-bold text-emerald-700">{stats.offers} 🎉</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          2. TOOLBAR: SEARCH, FILTER, AND VIEW TOGGLE
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by company, role, or personal notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Status Filter & Mode Switch */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All">All Milestones</option>
              <option value="Saved">Saved</option>
              <option value="Applied">Applied</option>
              <option value="Assessment">Assessment</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Not Selected">Not Selected</option>
            </select>

            <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Columns3 className="w-3.5 h-3.5" />
                <span>Kanban Board</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Table View</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          3. MAIN CONTENT: KANBAN BOARD OR TABLE VIEW
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {applications.length === 0 ? (
          /* EMPTY PIPELINE STATE */
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-slate-200/90 shadow-2xs text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-200/60">
              <Briefcase className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              No Applications Tracked Yet
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
              When you apply to jobs through official portals or save roles for later, track your milestones here across assessment tests, interview stages, and offers.
            </p>
            <div className="pt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                + Track First Application
              </button>
              <button
                type="button"
                onClick={() => navigate('/jobs')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Browse Vacancies
              </button>
            </div>
          </div>
        ) : viewMode === 'kanban' ? (
          /* KANBAN BOARD VIEW */
          <div>
            {/* Mobile Stage Selector Tabs (Phone screens: 360px - 640px) */}
            <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
              <button
                type="button"
                onClick={() => setMobileActiveStage('All')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer min-h-[36px] ${
                  mobileActiveStage === 'All'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                All Stages ({filteredApplications.length})
              </button>
              {PIPELINE_COLUMNS.map((p) => {
                const count = filteredApplications.filter((a) => a.status === p.status).length;
                const isSelected = mobileActiveStage === p.status;
                return (
                  <button
                    key={p.status}
                    type="button"
                    onClick={() => setMobileActiveStage(p.status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer min-h-[36px] flex items-center gap-1.5 ${
                      isSelected
                        ? `${p.badgeBg} ${p.badgeText} ring-2 ring-blue-500/30`
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${p.dotColor}`} />
                    <span>{p.title}</span>
                    <span className="text-[10px] opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start pb-6">
              {PIPELINE_COLUMNS
                .filter((col) => mobileActiveStage === 'All' || col.status === mobileActiveStage)
                .map((col) => {
                  const colApplications = filteredApplications.filter((a) => a.status === col.status);

              return (
                <div
                  key={col.status}
                  className={`rounded-2xl border p-3 flex flex-col min-h-[460px] ${col.color}`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor} shrink-0`} />
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {col.title}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${col.badgeBg} ${col.badgeText}`}>
                      {colApplications.length}
                    </span>
                  </div>

                  {/* Column Application Cards */}
                  <div className="space-y-3 flex-1">
                    {colApplications.map((app) => {
                      const job = allJobs.find((j) => j.id === app.jobId);
                      if (!job) return null;

                      return (
                        <div
                          key={app.jobId}
                          className={`bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs ${col.borderHover} transition-all space-y-2.5 group`}
                        >
                          {/* Company & Role */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block truncate">
                                {job.company}
                              </span>
                              <h4
                                onClick={() => navigate(`/jobs/${job.id}`)}
                                className="text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2 leading-snug"
                              >
                                {job.title}
                              </h4>
                            </div>

                            <button
                              type="button"
                              onClick={() => deleteApplication(app.jobId)}
                              title="Delete from tracker"
                              className="text-slate-300 hover:text-rose-600 transition-colors cursor-pointer p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Applied Date & Salary */}
                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{app.appliedDate}</span>
                            </span>
                            <span className="font-semibold text-slate-700">{job.jobType}</span>
                          </div>

                          {/* Notes Preview with Edit Trigger */}
                          <div
                            onClick={() => handleOpenEditNotes(app)}
                            className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50/50 border border-slate-200/70 text-[11px] text-slate-600 cursor-pointer flex items-start justify-between gap-1 transition-colors"
                            title="Click to edit notes"
                          >
                            <span className="line-clamp-2 italic leading-relaxed">
                              {app.notes || 'No notes added. Click to add notes...'}
                            </span>
                            <Edit3 className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                          </div>

                          {/* Move Status Selector */}
                          <div className="pt-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Move Milestone:
                            </label>
                            <select
                              value={app.status}
                              onChange={(e) =>
                                updateApplicationStatus(app.jobId, e.target.value as ApplicationStatus)
                              }
                              className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                              {PIPELINE_COLUMNS.map((p) => (
                                <option key={p.status} value={p.status}>
                                  → {p.title}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Card Footer Quick Links */}
                          <div className="flex items-center justify-between pt-1 text-[10px]">
                            <button
                              type="button"
                              onClick={() => navigate(`/jobs/${job.id}`)}
                              className="text-blue-600 hover:underline font-semibold cursor-pointer"
                            >
                              Job Details
                            </button>
                            <a
                              href={job.applyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-500 hover:text-slate-900 inline-flex items-center gap-0.5"
                            >
                              <span>Official Link</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })}

                    {colApplications.length === 0 && (
                      <div className="h-28 rounded-xl border border-dashed border-slate-200/80 flex flex-col items-center justify-center text-center p-3 text-slate-400 text-[11px]">
                        <span>No vacancies in this stage</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        ) : (
          /* TABLE VIEW / MOBILE CARDS VIEW */
          <div className="space-y-4">
            
            {/* Mobile Cards (Visible on screens < 768px) */}
            <div className="md:hidden space-y-3">
              {filteredApplications.map((app) => {
                const job = allJobs.find((j) => j.id === app.jobId);
                if (!job) return null;
                const colConfig = PIPELINE_COLUMNS.find((c) => c.status === app.status);

                return (
                  <div
                    key={app.jobId}
                    className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                          {job.company.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide truncate block">
                            {job.company}
                          </span>
                          <h4
                            onClick={() => navigate(`/jobs/${job.id}`)}
                            className="text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 truncate cursor-pointer"
                          >
                            {job.title}
                          </h4>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteApplication(app.jobId)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
                        title="Delete application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>Added: <strong>{app.appliedDate}</strong></span>
                      <span className="font-semibold text-slate-700">{job.jobType}</span>
                    </div>

                    {/* Milestone Selector */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Application Status:
                      </label>
                      <select
                        value={app.status}
                        onChange={(e) =>
                          updateApplicationStatus(app.jobId, e.target.value as ApplicationStatus)
                        }
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold border cursor-pointer ${colConfig?.badgeBg} ${colConfig?.badgeText} border-current min-h-[44px]`}
                      >
                        {PIPELINE_COLUMNS.map((p) => (
                          <option key={p.status} value={p.status}>
                            Stage: {p.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Notes Box */}
                    <div
                      onClick={() => handleOpenEditNotes(app)}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 text-xs text-slate-600 cursor-pointer flex items-start justify-between gap-2"
                      title="Tap to edit notes"
                    >
                      <span className="line-clamp-2 italic leading-relaxed">
                        {app.notes || 'Tap to add personal notes or interview dates...'}
                      </span>
                      <Edit3 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    </div>

                    {/* Actions Row */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        className="flex-1 py-2 text-center bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold min-h-[40px]"
                      >
                        Job Details
                      </button>
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 text-center bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold border border-blue-200 inline-flex items-center justify-center gap-1 min-h-[40px]"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (Visible on screens >= 768px) */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Opportunity</th>
                      <th className="py-3.5 px-4">Date Added</th>
                      <th className="py-3.5 px-4">Milestone Status</th>
                      <th className="py-3.5 px-4">Personal Notes</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApplications.map((app) => {
                      const job = allJobs.find((j) => j.id === app.jobId);
                      if (!job) return null;
                      const colConfig = PIPELINE_COLUMNS.find((c) => c.status === app.status);

                      return (
                        <tr key={app.jobId} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                                {job.company.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 block">{job.title}</span>
                                <span className="text-[11px] text-slate-500">{job.company} · {job.location}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-medium text-slate-700">{app.appliedDate}</span>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <select
                              value={app.status}
                              onChange={(e) =>
                                updateApplicationStatus(app.jobId, e.target.value as ApplicationStatus)
                              }
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${colConfig?.badgeBg} ${colConfig?.badgeText} border-current`}
                            >
                              {PIPELINE_COLUMNS.map((p) => (
                                <option key={p.status} value={p.status}>
                                  {p.title}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className="py-3.5 px-4 max-w-xs">
                            <div
                              onClick={() => handleOpenEditNotes(app)}
                              className="truncate text-slate-600 hover:text-blue-600 cursor-pointer flex items-center gap-1.5"
                              title="Click to edit notes"
                            >
                              <span className="truncate">{app.notes || 'Click to add notes...'}</span>
                              <Edit3 className="w-3 h-3 text-slate-400 shrink-0" />
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => navigate(`/jobs/${job.id}`)}
                                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                              >
                                Details
                              </button>
                              <a
                                href={job.applyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-slate-400 hover:text-blue-600 cursor-pointer"
                                title="Official Apply Page"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                              <button
                                type="button"
                                onClick={() => deleteApplication(app.jobId)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                                title="Delete application"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </section>

      {/* ========================================================
          4. MODAL: TRACK NEW APPLICATION
          ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>Track New Job Application</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              
              {/* Select Job */}
              <div>
                <label className="font-bold text-slate-900 block mb-1">
                  Select Opportunity from HireHub Directory:
                </label>
                <select
                  value={selectedJobIdForAdd}
                  onChange={(e) => setSelectedJobIdForAdd(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {allJobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.company} — {j.title} ({j.jobType})
                    </option>
                  ))}
                </select>
              </div>

              {/* Initial Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">
                    Current Milestone Stage:
                  </label>
                  <select
                    value={initialStatusForAdd}
                    onChange={(e) => setInitialStatusForAdd(e.target.value as ApplicationStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {PIPELINE_COLUMNS.map((p) => (
                      <option key={p.status} value={p.status}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1">
                    Application / Event Date:
                  </label>
                  <input
                    type="date"
                    value={customDateForAdd}
                    onChange={(e) => setCustomDateForAdd(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Personal Notes */}
              <div>
                <label className="font-bold text-slate-900 block mb-1">
                  Personal Notes / Interview Timeline:
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Cleared online coding test; round 1 technical interview scheduled on Nov 18th with senior manager..."
                  value={customNotesForAdd}
                  onChange={(e) => setCustomNotesForAdd(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Save to Pipeline
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================
          5. MODAL: EDIT NOTES
          ======================================================== */}
      {editingNotesJobId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-600" />
                <span>Update Application Notes</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingNotesJobId(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="text-slate-600 block">
                Record your test scores, interviewer feedback, meeting links, or prep focus:
              </label>
              <textarea
                rows={4}
                value={editedNotesValue}
                onChange={(e) => setEditedNotesValue(e.target.value)}
                placeholder="Enter personal notes..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 font-sans"
              />

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingNotesJobId(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Update Notes
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
