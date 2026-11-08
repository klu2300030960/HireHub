import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Building2,
  MapPin,
  Filter,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  LayoutGrid,
  List,
  Briefcase,
  GraduationCap,
  Sparkles,
  RotateCcw,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { JobCard } from '../components/JobCard';
import { JobQuickModal } from '../components/JobQuickModal';
import { Job } from '../types/job';
import { MOCK_COMPANIES } from '../data/mockCompanies';

export const FindJobsPage: React.FC = () => {
  const {
    allJobs,
    searchTitle,
    setSearchTitle,
    searchCompany,
    setSearchCompany,
    searchLocation,
    setSearchLocation
  } = useApp();

  // Filter states
  const [selectedJobType, setSelectedJobType] = useState<string>('All');
  const [selectedExperience, setSelectedExperience] = useState<string>('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('All');
  const [selectedEducation, setSelectedEducation] = useState<string>('All');
  const [fresherOnly, setFresherOnly] = useState<boolean>(false);

  // Sorting state
  const [sortBy, setSortBy] = useState<'latest' | 'relevance' | 'deadline' | 'salary'>('latest');

  // Layout view mode (grid vs list)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mobile filter drawer visibility
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Selected job for quick details modal
  const [selectedModalJob, setSelectedModalJob] = useState<Job | null>(null);

  // Calculate active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTitle.trim()) count++;
    if (searchCompany.trim()) count++;
    if (searchLocation.trim()) count++;
    if (selectedJobType !== 'All') count++;
    if (selectedExperience !== 'All') count++;
    if (selectedWorkMode !== 'All') count++;
    if (selectedCategory !== 'All') count++;
    if (selectedCompanyFilter !== 'All') count++;
    if (selectedEducation !== 'All') count++;
    if (fresherOnly) count++;
    return count;
  }, [
    searchTitle,
    searchCompany,
    searchLocation,
    selectedJobType,
    selectedExperience,
    selectedWorkMode,
    selectedCategory,
    selectedCompanyFilter,
    selectedEducation,
    fresherOnly
  ]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTitle('');
    setSearchCompany('');
    setSearchLocation('');
    setSelectedJobType('All');
    setSelectedExperience('All');
    setSelectedWorkMode('All');
    setSelectedCategory('All');
    setSelectedCompanyFilter('All');
    setSelectedEducation('All');
    setFresherOnly(false);
  };

  // Filtered and sorted jobs computation
  const filteredJobs = useMemo(() => {
    let result = allJobs.filter((job) => {
      // Search Title or Skills
      const titleQuery = searchTitle.trim().toLowerCase();
      if (titleQuery) {
        const matchesTitle = job.title.toLowerCase().includes(titleQuery);
        const matchesSkills = job.skills.some((s) => s.toLowerCase().includes(titleQuery));
        const matchesDesc = job.description.toLowerCase().includes(titleQuery);
        if (!matchesTitle && !matchesSkills && !matchesDesc) return false;
      }

      // Search Company (search input or sidebar filter)
      const companyQuery = (searchCompany.trim() || (selectedCompanyFilter !== 'All' ? selectedCompanyFilter : '')).toLowerCase();
      if (companyQuery && !job.company.toLowerCase().includes(companyQuery)) {
        return false;
      }

      // Location
      const locationQuery = searchLocation.trim().toLowerCase();
      if (locationQuery) {
        const matchesLoc = job.location.toLowerCase().includes(locationQuery);
        const matchesMode = job.workMode.toLowerCase().includes(locationQuery);
        if (!matchesLoc && !matchesMode) return false;
      }

      // Job Type
      if (selectedJobType !== 'All' && job.jobType !== selectedJobType) {
        return false;
      }

      // Experience Level
      if (selectedExperience !== 'All' && job.experienceLevel !== selectedExperience) {
        return false;
      }

      // Work Mode
      if (selectedWorkMode !== 'All' && job.workMode !== selectedWorkMode) {
        return false;
      }

      // Role Category
      if (selectedCategory !== 'All' && job.category !== selectedCategory) {
        return false;
      }

      // Education qualification
      if (selectedEducation !== 'All' && !job.education.toLowerCase().includes(selectedEducation.toLowerCase())) {
        return false;
      }

      // Fresher-only switch
      if (fresherOnly && !job.isFresherFriendly) {
        return false;
      }

      return true;
    });

    // Apply sorting
    return result.sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
      }
      if (sortBy === 'salary') {
        // Simple numeric extraction heuristic for salary
        const getNum = (str: string) => {
          const match = str.match(/\d+(\.\d+)?/);
          return match ? parseFloat(match[0]) : 0;
        };
        return getNum(b.salary) - getNum(a.salary);
      }
      if (sortBy === 'relevance') {
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
      // Default: 'latest' (mock jobs are already organized with newest first)
      return 0;
    });
  }, [
    allJobs,
    searchTitle,
    searchCompany,
    selectedCompanyFilter,
    searchLocation,
    selectedJobType,
    selectedExperience,
    selectedWorkMode,
    selectedCategory,
    selectedEducation,
    fresherOnly,
    sortBy
  ]);

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      
      {/* ========================================================
          1. HEADER & SEARCH BAR SECTION
          ======================================================== */}
      <section className="bg-white border-b border-slate-200/90 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Find Jobs</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Explore Tech Vacancies
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-xl">
                Discover verified career openings, entry-level fresher tracks, and internships across top MNCs and tech leaders.
              </p>
            </div>

            {/* Quick Summary Pill */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 bg-slate-100/80 px-3.5 py-2 rounded-xl border border-slate-200/80 shrink-0">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>
                <strong className="text-slate-900 tabular-nums">{filteredJobs.length}</strong> vacancies available
              </span>
            </div>
          </div>

          {/* 3-Field Search Filter Bar */}
          <div className="bg-slate-50/90 rounded-2xl p-3 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch gap-2.5">
            {/* Title / Skill */}
            <div className="flex-1 flex items-center px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 focus-within:border-blue-500 transition-colors">
              <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder="Job title, technical skill, or keyword..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="w-full text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              {searchTitle && (
                <button
                  type="button"
                  onClick={() => setSearchTitle('')}
                  className="p-1 text-slate-400 hover:text-slate-600"
                  aria-label="Clear title search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Company */}
            <div className="flex-1 flex items-center px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 focus-within:border-blue-500 transition-colors">
              <Building2 className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder="Company (TCS, Microsoft, Google...)"
                value={searchCompany}
                onChange={(e) => setSearchCompany(e.target.value)}
                className="w-full text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              {searchCompany && (
                <button
                  type="button"
                  onClick={() => setSearchCompany('')}
                  className="p-1 text-slate-400 hover:text-slate-600"
                  aria-label="Clear company search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Location */}
            <div className="flex-1 flex items-center px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 focus-within:border-blue-500 transition-colors">
              <MapPin className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder="Location / Remote (Bengaluru, Pune...)"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              {searchLocation && (
                <button
                  type="button"
                  onClick={() => setSearchLocation('')}
                  className="p-1 text-slate-400 hover:text-slate-600"
                  aria-label="Clear location search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Reset button if any search term is populated */}
            {(searchTitle || searchCompany || searchLocation) && (
              <button
                type="button"
                onClick={() => {
                  setSearchTitle('');
                  setSearchCompany('');
                  setSearchLocation('');
                }}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer shrink-0"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Quick trending search tags */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <span className="font-medium text-slate-400 mr-1">Trending filters:</span>
            {['Java', 'Python', 'AWS', 'Remote', 'Fresher', 'Internship', 'Microsoft', 'TCS'].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  if (chip === 'Remote') setSearchLocation('Remote');
                  else if (['TCS', 'Microsoft'].includes(chip)) setSearchCompany(chip);
                  else setSearchTitle(chip);
                }}
                className="px-2.5 py-1 rounded-md bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          2. MAIN LISTINGS & SIDEBAR LAYOUT
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* ====================================================
              SIDEBAR: FILTERS PANEL (Desktop)
              ==================================================== */}
          <aside className="hidden lg:block w-72 shrink-0 space-y-6 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs sticky top-24">
            
            {/* Filter Header & Clear All */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Filters</h3>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-blue-100 text-blue-700 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Fresher-Friendly Quick Switch */}
            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-950 block">Fresher Friendly Only</span>
                <span className="text-[11px] text-slate-500">0 yrs / Campus intake</span>
              </div>
              <button
                type="button"
                onClick={() => setFresherOnly(!fresherOnly)}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  fresherOnly ? 'bg-blue-600' : 'bg-slate-300'
                }`}
                role="switch"
                aria-checked={fresherOnly}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    fresherOnly ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Job Type Filter */}
            <div>
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2.5">
                Job Type
              </label>
              <div className="space-y-1.5 text-xs">
                {['All', 'Full-time', 'Internship'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedJobType(type)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left font-medium transition-colors cursor-pointer ${
                      selectedJobType === type
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{type === 'All' ? 'All Types' : type}</span>
                    {selectedJobType === type && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level Filter */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2.5">
                Experience Level
              </label>
              <div className="space-y-1.5 text-xs">
                {['All', 'Fresher (0-1 yrs)', 'Junior (1-3 yrs)', 'Mid-Senior (3-5+ yrs)'].map((exp) => (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => setSelectedExperience(exp)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left font-medium transition-colors cursor-pointer ${
                      selectedExperience === exp
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{exp === 'All' ? 'All Levels' : exp}</span>
                    {selectedExperience === exp && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Work Mode Filter */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2.5">
                Work Mode
              </label>
              <div className="space-y-1.5 text-xs">
                {['All', 'Remote', 'Hybrid', 'On-site'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setSelectedWorkMode(mode)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left font-medium transition-colors cursor-pointer ${
                      selectedWorkMode === mode
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{mode === 'All' ? 'All Modes' : mode}</span>
                    {selectedWorkMode === mode && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Role Track Category */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2.5">
                Role Track
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  'All',
                  'Software Engineering',
                  'Data & AI',
                  'Cloud & DevOps',
                  'QA & Testing',
                  'Cybersecurity'
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left font-medium transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{cat === 'All' ? 'All Tracks' : cat}</span>
                    {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Company Filter Dropdown */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                Company
              </label>
              <select
                value={selectedCompanyFilter}
                onChange={(e) => setSelectedCompanyFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All">All Companies</option>
                {MOCK_COMPANIES.map((comp) => (
                  <option key={comp.id} value={comp.name}>
                    {comp.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Educational Qualification Filter */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                Eligible Qualification
              </label>
              <select
                value={selectedEducation}
                onChange={(e) => setSelectedEducation(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All">Any Degree / STEM</option>
                <option value="B.E.">B.E. / B.Tech</option>
                <option value="MCA">MCA / Master's</option>
                <option value="M.Tech">M.Tech / M.E.</option>
                <option value="Bachelor">Bachelor's Degree</option>
              </select>
            </div>

          </aside>

          {/* ====================================================
              MAIN LISTINGS AREA
              ==================================================== */}
          <div className="flex-1 w-full min-w-0">
            
            {/* Controls Bar: Sort, View Toggle, Mobile Filter Trigger */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4 mb-6">
              
              {/* Left: Results counter & Mobile Filter button */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
                </button>

                <div className="text-xs text-slate-600 font-medium">
                  Showing <strong className="text-slate-900 font-bold tabular-nums">{filteredJobs.length}</strong> matching vacancies
                </div>
              </div>

              {/* Right: Sorting and View Toggle */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-2.5 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="latest">Latest Posted</option>
                    <option value="relevance">Relevance & Featured</option>
                    <option value="deadline">Application Deadline</option>
                    <option value="salary">Salary / Compensation</option>
                  </select>
                </div>

                {/* View Mode Toggle: Grid vs List */}
                <div className="hidden sm:flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid layout"
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                      viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    aria-label="List layout"
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                      viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Active Filter Tags Row */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-xs text-slate-400 font-medium">Active filters:</span>
                
                {searchTitle && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                    Keyword: {searchTitle}
                    <button type="button" onClick={() => setSearchTitle('')} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {searchCompany && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                    Company: {searchCompany}
                    <button type="button" onClick={() => setSearchCompany('')} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {searchLocation && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                    Location: {searchLocation}
                    <button type="button" onClick={() => setSearchLocation('')} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedJobType !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                    Type: {selectedJobType}
                    <button type="button" onClick={() => setSelectedJobType('All')} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedExperience !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                    Exp: {selectedExperience}
                    <button type="button" onClick={() => setSelectedExperience('All')} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedWorkMode !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                    Mode: {selectedWorkMode}
                    <button type="button" onClick={() => setSelectedWorkMode('All')} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedCategory !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                    Track: {selectedCategory}
                    <button type="button" onClick={() => setSelectedCategory('All')} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedCompanyFilter !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                    Firm: {selectedCompanyFilter}
                    <button type="button" onClick={() => setSelectedCompanyFilter('All')} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedEducation !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                    Degree: {selectedEducation}
                    <button type="button" onClick={() => setSelectedEducation('All')} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {fresherOnly && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                    Fresher Only
                    <button type="button" onClick={() => setFresherOnly(false)} className="hover:text-emerald-950">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline underline-offset-2 ml-1 cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Job Listings (Grid or List view) */}
            {filteredJobs.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-5' : 'space-y-4'}>
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    layout={viewMode}
                    onViewDetails={(j) => setSelectedModalJob(j)}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  No job vacancies matched your filter combination
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                  Try broadening your keyword query or resetting some filters like experience level or qualification.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ========================================================
          3. MOBILE FILTERS DRAWER / MODAL
          ======================================================== */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-sm h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">Filter Vacancies</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Fresher Switch */}
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between mb-5">
                <span className="text-xs font-bold text-blue-900">Fresher Friendly Only</span>
                <input
                  type="checkbox"
                  checked={fresherOnly}
                  onChange={(e) => setFresherOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
              </div>

              {/* Mobile Job Type */}
              <div className="mb-5">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">Job Type</label>
                <select
                  value={selectedJobType}
                  onChange={(e) => setSelectedJobType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="All">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {/* Mobile Experience */}
              <div className="mb-5">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">Experience</label>
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="All">All Experience Levels</option>
                  <option value="Fresher (0-1 yrs)">Fresher (0-1 yrs)</option>
                  <option value="Junior (1-3 yrs)">Junior (1-3 yrs)</option>
                  <option value="Mid-Senior (3-5+ yrs)">Mid-Senior (3-5+ yrs)</option>
                </select>
              </div>

              {/* Mobile Work Mode */}
              <div className="mb-5">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">Work Mode</label>
                <select
                  value={selectedWorkMode}
                  onChange={(e) => setSelectedWorkMode(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="All">All Modes</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              {/* Mobile Category */}
              <div className="mb-5">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">Role Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="All">All Tracks</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Data & AI">Data & AI</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="QA & Testing">QA & Testing</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                </select>
              </div>

              {/* Mobile Company */}
              <div className="mb-5">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">Company</label>
                <select
                  value={selectedCompanyFilter}
                  onChange={(e) => setSelectedCompanyFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="All">All Companies</option>
                  {MOCK_COMPANIES.map((comp) => (
                    <option key={comp.id} value={comp.name}>{comp.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex gap-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 py-2.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Details Modal */}
      <JobQuickModal
        job={selectedModalJob}
        onClose={() => setSelectedModalJob(null)}
      />

    </div>
  );
};
