import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  MapPin,
  Briefcase,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  LayoutGrid,
  List,
  Compass,
  FileCheck2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Job } from '../types/job';

export const SavedJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { savedJobIds, toggleSaveJob, allJobs, applyToJob, showToast } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [sortBy, setSortBy] = useState<'deadline' | 'latest' | 'title'>('deadline');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');

  // Resolve saved job objects from allJobs
  const savedJobs = useMemo(() => {
    return allJobs.filter((job) => savedJobIds.includes(job.id));
  }, [allJobs, savedJobIds]);

  // Filter and sort the saved jobs
  const filteredJobs = useMemo(() => {
    let result = savedJobs.filter((job) => {
      // Query filter
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.skills.some((s) => s.toLowerCase().includes(q));

      // Category filter
      const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;

      // Job Type filter
      const matchesType = selectedJobType === 'All' || job.jobType === selectedJobType;

      return matchesQuery && matchesCategory && matchesType;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [savedJobs, searchQuery, selectedCategory, selectedJobType, sortBy]);

  // Deadline calculation helper
  const getDaysUntilDeadline = (deadlineStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineStr);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Clear all saved jobs handler
  const handleClearAll = () => {
    if (savedJobIds.length === 0) return;
    if (window.confirm('Are you sure you want to remove all saved jobs from your list?')) {
      savedJobIds.forEach((id) => toggleSaveJob(id));
      showToast('All saved jobs have been cleared.');
    }
  };

  // Top recommendations for empty state
  const recommendedJobs = useMemo(() => {
    return allJobs.slice(0, 3);
  }, [allJobs]);

  const categories = ['All', 'Software Engineering', 'Cloud & DevOps', 'Data & AI', 'QA & Testing'];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      
      {/* ========================================================
          1. HEADER SECTION
          ======================================================== */}
      <section className="bg-white border-b border-slate-200/90 pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Saved Jobs</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-3 border border-purple-200/60">
                <Bookmark className="w-3.5 h-3.5 text-purple-600" />
                <span>Bookmarked Vacancies Collection</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Saved Jobs ({savedJobs.length})
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Review your saved opportunities, monitor approaching deadlines, check requirement compatibility, and submit official applications.
              </p>
            </div>

            {savedJobs.length > 0 && (
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/80 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/jobs')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-blue-600 transition-colors cursor-pointer shadow-2xs"
                >
                  <span>Explore More Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Metrics Counter Ribbon */}
          {savedJobs.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-xs text-slate-500 block">Total Bookmarked</span>
                <span className="text-lg font-bold text-slate-900">{savedJobs.length} Vacancies</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-xs text-slate-500 block">Full-time Roles</span>
                <span className="text-lg font-bold text-blue-600">
                  {savedJobs.filter((j) => j.jobType === 'Full-time').length}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-xs text-slate-500 block">Internships</span>
                <span className="text-lg font-bold text-purple-600">
                  {savedJobs.filter((j) => j.jobType === 'Internship').length}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-xs text-slate-500 block">Fresher Friendly</span>
                <span className="text-lg font-bold text-emerald-600">
                  {savedJobs.filter((j) => j.isFresherFriendly).length}
                </span>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ========================================================
          2. SEARCH, FILTERS & CONTROLS TOOLBAR
          ======================================================== */}
      {savedJobs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search saved jobs by title, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Filter Dropdowns & View Mode */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>Category: {c}</option>
                ))}
              </select>

              {/* Job Type Filter */}
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="deadline">Sort: Deadline (Nearest)</option>
                <option value="title">Sort: Role Title</option>
              </select>

              {/* View Layout Toggle */}
              <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewLayout('grid')}
                  title="Grid View"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewLayout === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewLayout('list')}
                  title="List View"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewLayout === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </section>
      )}

      {/* ========================================================
          3. JOBS GRID / LIST DISPLAY OR EMPTY STATE
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {savedJobs.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-slate-200/90 shadow-2xs text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4 border border-purple-200/60">
              <Bookmark className="w-8 h-8" />
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              No Saved Vacancies Yet
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
              You haven't bookmarked any jobs yet. While browsing jobs, click the bookmark icon on any job card to save it for quick review, deadline tracking, and application prep.
            </p>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => navigate('/jobs')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Browse All Vacancies</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* QUICK RECOMMENDATIONS CAROUSEL IN EMPTY STATE */}
            <div className="pt-10 mt-10 border-t border-slate-100 text-left">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Popular Recommended Vacancies to Bookmark:</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedJobs.map((recJob) => (
                  <div
                    key={recJob.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide truncate">
                          {recJob.company}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
                          {recJob.jobType}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                        {recJob.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {recJob.location} · {recJob.salary}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => navigate(`/jobs/${recJob.id}`)}
                        className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                      >
                        Details →
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSaveJob(recJob.id)}
                        className="px-3 py-1 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold rounded-lg cursor-pointer"
                      >
                        + Save Job
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : filteredJobs.length === 0 ? (
          /* NO FILTER MATCHES STATE */
          <div className="bg-white rounded-3xl p-10 border border-slate-200/90 shadow-2xs text-center max-w-xl mx-auto">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No matching saved jobs found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or reset your category filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedJobType('All');
              }}
              className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : viewLayout === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => {
              const daysLeft = getDaysUntilDeadline(job.applicationDeadline);
              const isUrgent = daysLeft <= 14 && daysLeft > 0;

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Company & Save Toggle Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${job.companyColor || 'from-slate-700 to-slate-900'} text-white font-bold flex items-center justify-center text-xs shadow-2xs shrink-0`}>
                          {job.companyLogo || job.company.slice(0, 3).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide truncate block">
                            {job.company}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            job.jobType === 'Internship' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {job.jobType}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleSaveJob(job.id)}
                        title="Remove from saved jobs"
                        className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      >
                        <Bookmark className="w-4 h-4 fill-purple-600 group-hover:fill-current" />
                      </button>
                    </div>

                    {/* Job Title */}
                    <h3
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2 mb-2"
                    >
                      {job.title}
                    </h3>

                    {/* Quick Metadata */}
                    <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{job.location} ({job.workMode})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate font-semibold text-slate-800">{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className={`w-3.5 h-3.5 shrink-0 ${isUrgent ? 'text-amber-500' : 'text-slate-400'}`} />
                        <span className={isUrgent ? 'font-bold text-amber-700' : 'text-slate-500'}>
                          Deadline: {job.applicationDeadline} {isUrgent && `(${daysLeft} days left)`}
                        </span>
                      </div>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {job.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 bg-slate-50 text-slate-700 rounded-md text-[10px] font-medium border border-slate-200/80"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px]">
                          +{job.skills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200 transition-colors cursor-pointer text-center"
                      >
                        Full Details
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          applyToJob(job.id);
                          window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
                        }}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer text-center inline-flex items-center justify-center gap-1"
                      >
                        <span>Apply</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Utility Jump Links */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
                      <Link
                        to={`/eligibility?job=${job.id}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        Check Eligibility
                      </Link>
                      <Link
                        to={`/skill-gap?job=${job.id}`}
                        className="hover:text-purple-600 transition-colors"
                      >
                        Skill Gap
                      </Link>
                      <Link
                        to={`/resume-analyzer?job=${job.id}`}
                        className="hover:text-emerald-600 transition-colors"
                      >
                        ATS Match
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const daysLeft = getDaysUntilDeadline(job.applicationDeadline);
              const isUrgent = daysLeft <= 14 && daysLeft > 0;

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${job.companyColor || 'from-slate-700 to-slate-900'} text-white font-bold flex items-center justify-center text-sm shadow-2xs shrink-0`}>
                      {job.companyLogo || job.company.slice(0, 3).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                          {job.company}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {job.jobType}
                        </span>
                        {isUrgent && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                            Closing in {daysLeft}d
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer truncate"
                      >
                        {job.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.location} ({job.workMode})</span>
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.salary}</span>
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Deadline: {job.applicationDeadline}</span>
                        </span>
                      </div>

                      {/* Skills inline */}
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {job.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 bg-slate-50 text-slate-700 rounded text-[10px] font-medium border border-slate-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* List View Actions */}
                  <div className="flex items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      type="button"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        applyToJob(job.id);
                        window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>Apply</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSaveJob(job.id)}
                      title="Remove from saved jobs"
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* ========================================================
          4. BOTTOM UTILITY CALLOUT
          ======================================================== */}
      {savedJobs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-white">
                Track Application Milestones with HireHub Pipeline
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Once you submit an official application on the company careers portal, monitor your progress across Saved, Assessment, Interview, and Offer stages in the Application Tracker.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/tracker"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Open Application Tracker →
              </Link>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};
