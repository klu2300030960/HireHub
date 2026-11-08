import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  FileCheck2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Target,
  FileText,
  Search,
  CheckCircle,
  ExternalLink,
  Users
} from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { JobCard } from '../components/JobCard';
import { CompanyCard } from '../components/CompanyCard';
import { JobQuickModal } from '../components/JobQuickModal';
import { MOCK_COMPANIES } from '../data/mockCompanies';
import { Job } from '../types/job';
import { useApp } from '../context/AppContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { allJobs, searchTitle, searchCompany, searchLocation, setSearchCompany } = useApp();

  // State for active category tabs and job type tabs
  const [activeJobTypeTab, setActiveJobTypeTab] = useState<'All Jobs' | 'Full-time' | 'Internships'>('All Jobs');
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('All');
  const [activeCompanyCategory, setActiveCompanyCategory] = useState<string>('All');
  const [selectedModalJob, setSelectedModalJob] = useState<Job | null>(null);

  // Dynamic counts for Job Type tabs
  const jobTypeCounts = useMemo(() => {
    return {
      all: allJobs.length,
      fullTime: allJobs.filter((j) => j.jobType === 'Full-time').length,
      internships: allJobs.filter((j) => j.jobType === 'Internship').length
    };
  }, [allJobs]);

  // Filter jobs based on Hero SearchBar inputs, jobType tab, and category tab
  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      const matchesTitle = searchTitle.trim() === '' ||
        job.title.toLowerCase().includes(searchTitle.toLowerCase()) ||
        job.skills.some((s) => s.toLowerCase().includes(searchTitle.toLowerCase()));

      const matchesCompany = searchCompany.trim() === '' ||
        job.company.toLowerCase().includes(searchCompany.toLowerCase());

      const matchesLocation = searchLocation.trim() === '' ||
        job.location.toLowerCase().includes(searchLocation.toLowerCase()) ||
        job.workMode.toLowerCase().includes(searchLocation.toLowerCase());

      const matchesJobType =
        activeJobTypeTab === 'All Jobs' ||
        (activeJobTypeTab === 'Full-time' && job.jobType === 'Full-time') ||
        (activeJobTypeTab === 'Internships' && job.jobType === 'Internship');

      const matchesCategory = activeCategoryTab === 'All' || job.category === activeCategoryTab;

      return matchesTitle && matchesCompany && matchesLocation && matchesJobType && matchesCategory;
    });
  }, [allJobs, searchTitle, searchCompany, searchLocation, activeJobTypeTab, activeCategoryTab]);

  // Filter fresher-friendly opportunities
  const fresherJobs = useMemo(() => {
    return allJobs.filter((job) => job.isFresherFriendly);
  }, [allJobs]);

  // Filter companies by company category tab
  const filteredCompanies = useMemo(() => {
    if (activeCompanyCategory === 'All') return MOCK_COMPANIES;
    return MOCK_COMPANIES.filter((comp) => comp.category === activeCompanyCategory);
  }, [activeCompanyCategory]);

  const handleSelectCompany = (companyName: string) => {
    setSearchCompany(companyName);
    const jobsSection = document.getElementById('latest-vacancies');
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60">
      
      {/* ========================================================
          1. HERO SECTION
          ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100/60 pt-12 pb-20 border-b border-slate-200/80">
        {/* Subtle decorative grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            
            {/* Tagline kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>One Platform. Every Opportunity. Your Next Career.</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6 text-balance">
              Find Your Next Opportunity with{' '}
              <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">
                HireHub
              </span>
            </h1>

            {/* Value Proposition Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              A centralized discovery platform connecting students, freshers, and experienced software professionals with verified vacancies across top IT giants, product leaders, and global MNCs.
            </p>
          </div>

          {/* Interactive Search Bar Component */}
          <div className="mb-12">
            <SearchBar
              variant="hero"
              onSearchSubmit={() => {
                const element = document.getElementById('latest-vacancies');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>

          {/* Key Quantitative Proof Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-200/70">
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-slate-200/80 text-center">
              <div className="text-2xl font-extrabold text-slate-900 tabular-nums">1,250+</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Verified Vacancies</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-slate-200/80 text-center">
              <div className="text-2xl font-extrabold text-blue-600 tabular-nums">85+</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Tech & MNC Giants</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-slate-200/80 text-center">
              <div className="text-2xl font-extrabold text-slate-900 tabular-nums">100%</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Official Portal Links</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-slate-200/80 text-center">
              <div className="text-2xl font-extrabold text-emerald-600 tabular-nums">₹0</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Free for Job Seekers</div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          2. FEATURED TECHNOLOGY COMPANIES
          ======================================================== */}
      <section className="py-16 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Top Recruiters
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Featured Technology Companies
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Explore open roles across leading IT services, product innovators, and enterprise cloud pioneers.
              </p>
            </div>

            {/* Company Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {['All', 'IT Services & Consulting', 'Product & Big Tech', 'Enterprise & Cloud'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCompanyCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    activeCompanyCategory === cat
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat === 'All' ? 'All Companies' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Companies Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredCompanies.slice(0, 8).map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onSelectCompany={handleSelectCompany}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => navigate('/companies')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <span>Explore All {MOCK_COMPANIES.length}+ Tech Companies</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================
          3. LATEST JOB VACANCIES SECTION
          ======================================================== */}
      <section id="latest-vacancies" className="py-16 border-b border-slate-200/80 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Active Hiring
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Latest Job Vacancies
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Direct openings with transparent salary ranges, eligibility thresholds, and skill tags.
              </p>
            </div>

            {/* Primary Job Type Tabbed Interface: All Jobs | Full-time | Internships */}
            <div className="inline-flex p-1.5 bg-slate-200/80 rounded-2xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveJobTypeTab('All Jobs')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeJobTypeTab === 'All Jobs'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>All Jobs</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold tabular-nums ${
                  activeJobTypeTab === 'All Jobs' ? 'bg-slate-800 text-slate-200' : 'bg-slate-300 text-slate-700'
                }`}>
                  {jobTypeCounts.all}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveJobTypeTab('Full-time')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeJobTypeTab === 'Full-time'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Full-time</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold tabular-nums ${
                  activeJobTypeTab === 'Full-time' ? 'bg-blue-700 text-blue-100' : 'bg-slate-300 text-slate-700'
                }`}>
                  {jobTypeCounts.fullTime}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveJobTypeTab('Internships')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeJobTypeTab === 'Internships'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Internships</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold tabular-nums ${
                  activeJobTypeTab === 'Internships' ? 'bg-purple-700 text-purple-100' : 'bg-slate-300 text-slate-700'
                }`}>
                  {jobTypeCounts.internships}
                </span>
              </button>
            </div>
          </div>

          {/* Secondary Sub-Category Filter Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">Role Track:</span>
              {[
                'All',
                'Software Engineering',
                'Data & AI',
                'Cloud & DevOps',
                'QA & Testing',
                'Cybersecurity'
              ].map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategoryTab(category)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    activeCategoryTab === category
                      ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                      : 'text-slate-600 bg-white hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  {category === 'All' ? 'All Roles' : category}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="text-slate-900 font-bold tabular-nums">{filteredJobs.length}</span> {activeJobTypeTab === 'All Jobs' ? 'vacancies' : activeJobTypeTab.toLowerCase()}
            </div>
          </div>

          {/* Active Search Filter Status */}
          {(searchTitle || searchCompany || searchLocation) && (
            <div className="mb-6 p-3 bg-blue-50/80 rounded-xl border border-blue-200/80 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-blue-900">
                <Search className="w-4 h-4 text-blue-600" />
                <span>
                  Filtering by: {searchTitle && <strong>"{searchTitle}" </strong>}
                  {searchCompany && <span>at company <strong>"{searchCompany}" </strong></span>}
                  {searchLocation && <span>in <strong>"{searchLocation}" </strong></span>}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  useApp().setSearchTitle('');
                  useApp().setSearchCompany('');
                  useApp().setSearchLocation('');
                }}
                className="font-bold text-blue-700 hover:underline cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          )}

          {/* Jobs Grid */}
          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.slice(0, 6).map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onViewDetails={(j) => setSelectedModalJob(j)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No vacancies match your criteria</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                No vacancies found under <strong>{activeJobTypeTab}</strong> with the selected filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveJobTypeTab('All Jobs');
                  setActiveCategoryTab('All');
                  useApp().setSearchTitle('');
                  useApp().setSearchCompany('');
                  useApp().setSearchLocation('');
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-blue-600 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* View All Button */}
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => navigate('/jobs')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-blue-600 transition-colors shadow-sm cursor-pointer"
            >
              <span>Explore All {allJobs.length} Vacancies & Advanced Filters</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================
          4. FRESHER-FRIENDLY OPPORTUNITIES SECTION
          ======================================================== */}
      <section className="py-16 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 mb-10 shadow-xl relative overflow-hidden">
            {/* Background geometric accents */}
            <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30 mb-4">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                Campus & Off-Campus Hiring Drive
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
                Fresher-Friendly Opportunities (2024 - 2026 Batches)
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                Tailored for graduating students and entry-level aspirants. Discover vacancies that explicitly welcome 0 years of experience with transparent CGPA thresholds and campus eligibility.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/eligibility')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Check My Campus Eligibility
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/resume-analyzer')}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer"
                >
                  Analyze Fresher Resume
                </button>
              </div>
            </div>
          </div>

          {/* Curated Fresher Job Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fresherJobs.slice(0, 6).map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onViewDetails={(j) => setSelectedModalJob(j)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          5. HOW HIREHUB WORKS SECTION
          ======================================================== */}
      <section className="py-20 border-b border-slate-200/80 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Step-by-Step Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How HireHub Works for Job Seekers
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              From discovering official openings to passing eligibility checks and optimizing your resume, we streamline every step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 font-extrabold text-base flex items-center justify-center mb-5">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Discover Vacancies
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Search active IT and product vacancies across companies like TCS, Microsoft, Infosys, and Google with verified filters.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 text-xs font-medium text-blue-600">
                100% Verified Listings
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 font-extrabold text-base flex items-center justify-center mb-5">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Check Exact Eligibility
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Match your degree, branch, graduation batch, and CGPA against specific company cutoffs before spending time applying.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 text-xs font-medium text-purple-600">
                Prevents Rejections
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base flex items-center justify-center mb-5">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Analyze Resume & Skills
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Upload your resume to receive an estimated match score, see missing technical keywords, and get tailored improvement tips.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 text-xs font-medium text-indigo-600">
                Skill Gap Identification
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 font-extrabold text-base flex items-center justify-center mb-5">
                  04
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Official Direct Apply
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Apply directly on the official company careers portal (e.g. TCS NextStep, Microsoft Careers) without any middlemen.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 text-xs font-medium text-emerald-600">
                Zero Intermediaries
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          6. FEATURE HIGHLIGHTS: RESUME ANALYZER & ELIGIBILITY CHECKER
          ======================================================== */}
      <section className="py-20 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Smart Career Utilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Built-In Tools for Competitive Edge
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Evaluate your readiness and optimize your profile before submitting applications.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Feature Card 1: Resume Analyzer */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/90 flex flex-col justify-between hover:border-blue-400 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-sm">
                  <FileText className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-blue-600 uppercase">Feature Highlight</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500">PDF & DOCX Support</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                  Resume-to-Job Compatibility Analyzer
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Upload your resume and compare it against any target job role. HireHub scans your project summaries, certifications, and technical stack to calculate an estimated match percentage, highlight missing keywords, and suggest actionable revisions.
                </p>

                {/* Simulated mini preview */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700">Estimated Role Match:</span>
                    <span className="text-blue-600 font-bold tabular-nums">84% Match</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-[84%]"></div>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Matched: Java, Python, SQL, REST APIs</span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => navigate('/resume-analyzer')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  <span>Launch Resume Analyzer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Feature Card 2: Eligibility Checker */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/90 flex flex-col justify-between hover:border-blue-400 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-sm">
                  <FileCheck2 className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-indigo-600 uppercase">Feature Highlight</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500">Degree & CGPA Filter</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                  Company Eligibility & Batch Verification
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Tired of applying and getting rejected due to hidden academic restrictions? Input your education, graduation year, and CGPA once, and instantly check if you meet the published criteria for TCS, Infosys, Wipro, and other top hiring firms.
                </p>

                {/* Simulated mini preview */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700">Verification Result:</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Eligible</span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-1">
                    <div>• Degree B.Tech CSE: <span className="text-emerald-600 font-semibold">Accepted</span></div>
                    <div>• CGPA 8.4: <span className="text-emerald-600 font-semibold">Exceeds 6.5 cutoff</span></div>
                    <div>• Batch 2025: <span className="text-emerald-600 font-semibold">In active intake</span></div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => navigate('/eligibility')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  <span>Check Eligibility Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          7. CAREER BENEFITS SECTION
          ======================================================== */}
      <section className="py-20 border-b border-slate-200/80 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Why Choose HireHub
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Built Specifically for Tech Job Seekers & Freshers
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Unlike generic job boards flooded with sponsored ads and outdated postings, HireHub keeps information clean, authentic, and direct.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Direct Official Portals</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                No third-party recruiters or misleading redirection. Every "Apply" button routes directly to the company's authentic career site.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Fresher Specific Filters</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Filter by graduation batch (2024, 2025, 2026), minimum CGPA cutoffs, and eligible engineering/MCA branches effortlessly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Skill Gap Clarity</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Discover the exact technical skills required for each vacancy and find free recommended resources to bridge knowledge gaps.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">Free Local Tracking</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bookmark top vacancies and track application milestones (Applied, Interview, Selected) with offline-safe local storage.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          8. CALL-TO-ACTION SECTION
          ======================================================== */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Start Your Job Search Today
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 text-balance">
            Ready to Take the Next Step in Your Tech Career?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Join thousands of students and engineers discovering verified vacancies across Fortune 500 tech companies with HireHub.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/jobs')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <span>Explore All Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Create Free Account</span>
            </button>
          </div>

        </div>
      </section>

      {/* Quick Details Modal */}
      <JobQuickModal
        job={selectedModalJob}
        onClose={() => setSelectedModalJob(null)}
      />

    </div>
  );
};
