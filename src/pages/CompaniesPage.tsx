import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Search,
  ExternalLink,
  ArrowRight,
  MapPin,
  Users,
  Briefcase,
  Globe,
  Sparkles,
  Layers,
  Calendar,
  X,
  CheckCircle2
} from 'lucide-react';
import { MOCK_COMPANIES } from '../data/mockCompanies';
import { MOCK_JOBS } from '../data/mockJobs';
import { Company, Job } from '../types/job';
import { useApp } from '../context/AppContext';

export const CompaniesPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSearchCompany } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCompanyModal, setSelectedCompanyModal] = useState<Company | null>(null);

  // Filtered companies based on search input and category tab
  const filteredCompanies = useMemo(() => {
    return MOCK_COMPANIES.filter((comp) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        comp.name.toLowerCase().includes(q) ||
        comp.headquarters.toLowerCase().includes(q) ||
        comp.description.toLowerCase().includes(q) ||
        (comp.techStack && comp.techStack.some((tech) => tech.toLowerCase().includes(q)));

      const matchesCat = selectedCategory === 'All' || comp.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  // Navigate to Find Jobs filtered by this company
  const handleViewOpenings = (companyName: string) => {
    setSearchCompany(companyName);
    navigate('/jobs');
  };

  // Find active jobs for modal preview
  const companyJobs = useMemo(() => {
    if (!selectedCompanyModal) return [];
    return MOCK_JOBS.filter(
      (j) => j.company.toLowerCase() === selectedCompanyModal.name.toLowerCase()
    );
  }, [selectedCompanyModal]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      
      {/* ========================================================
          1. HEADER & SEARCH SECTION
          ======================================================== */}
      <section className="bg-white border-b border-slate-200/90 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Companies</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-200/60">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Verified Technology Recruiters</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Company Directory
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-xl">
                Explore Fortune 500 technology powerhouses, Big Tech product innovators, and enterprise cloud providers with active campus and experienced hiring drives.
              </p>
            </div>

            {/* Overall Stats Pill */}
            <div className="hidden sm:flex items-center gap-4 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl shrink-0 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Directory Size</span>
                <span className="font-extrabold text-slate-900 text-sm tabular-nums">{MOCK_COMPANIES.length} Leading Firms</span>
              </div>
              <div className="h-7 w-px bg-slate-200" />
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Official Links</span>
                <span className="font-extrabold text-emerald-600 text-sm">100% Direct</span>
              </div>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="bg-slate-50/90 rounded-2xl p-2 sm:p-2.5 border border-slate-200 shadow-xs flex items-center gap-2 max-w-3xl">
            <div className="flex-1 flex items-center px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 focus-within:border-blue-500 transition-colors">
              <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder="Search companies by name, tech stack (e.g. Java, Cloud), or headquarters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Clear company search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer shrink-0"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {[
              'All',
              'IT Services & Consulting',
              'Product & Big Tech',
              'Enterprise & Cloud'
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/90'
                }`}
              >
                {cat === 'All' ? `All Companies (${MOCK_COMPANIES.length})` : cat}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          2. COMPANIES DIRECTORY GRID
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Results summary bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200/80 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-900 font-bold tabular-nums">{filteredCompanies.length}</strong> technology companies
            {searchQuery && <span> matching <strong>"{searchQuery}"</strong></span>}
          </div>

          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Company Cards Grid */}
        {filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                onClick={() => setSelectedCompanyModal(company)}
                className="group relative bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top Header: Logo, Name, Category */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${company.color} text-white font-extrabold text-base flex items-center justify-center shadow-sm shrink-0`}>
                        {company.initials}
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                          {company.category}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {company.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{company.headquarters}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs font-bold text-blue-700 bg-blue-50/90 px-2.5 py-1 rounded-lg shrink-0">
                      {company.openingsCount} Roles
                    </div>
                  </div>

                  {/* Company Overview */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {company.description}
                  </p>

                  {/* Quick Metadata: Founded & Workforce */}
                  <div className="grid grid-cols-2 gap-2 mb-4 p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400 block">Global Team</span>
                      <span className="font-bold text-slate-800">{company.employeeCount || '100,000+'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Established</span>
                      <span className="font-bold text-slate-800">{company.founded || '1990'}</span>
                    </div>
                  </div>

                  {/* Tech Stack Chips */}
                  {company.techStack && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {company.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                      {company.techStack.length > 4 && (
                        <span className="text-[10px] text-slate-400 px-1 py-0.5 font-medium">
                          +{company.techStack.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                  <a
                    href={company.careersUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title="Open official company careers site"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-slate-50"
                  >
                    <span>Careers Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewOpenings(company.name);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-blue-600 rounded-xl transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>View Openings</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">
              No companies match your search
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
              We couldn't find any employers matching "{searchQuery}". Try searching for another company or clear your search query.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Show All Companies
            </button>
          </div>
        )}

      </section>

      {/* ========================================================
          3. COMPANY PROFILE DETAILED MODAL
          ======================================================== */}
      {selectedCompanyModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedCompanyModal(null)}
        >
          <div
            className="relative bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedCompanyModal(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="flex items-start gap-4 mb-6 pr-8">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedCompanyModal.color} text-white font-extrabold text-xl flex items-center justify-center shadow-md shrink-0`}>
                {selectedCompanyModal.initials}
              </div>
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {selectedCompanyModal.category}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {selectedCompanyModal.name}
                </h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {selectedCompanyModal.headquarters}
                  </span>
                  <span>·</span>
                  <span>Founded {selectedCompanyModal.founded || '1990'}</span>
                  <span>·</span>
                  <span>{selectedCompanyModal.employeeCount || '100,000+'} Employees</span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-5 text-xs sm:text-sm text-slate-600 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Company Overview
                </h4>
                <p className="leading-relaxed">
                  {selectedCompanyModal.description}
                </p>
              </div>

              {/* Hiring Tracks */}
              {selectedCompanyModal.hiringTracks && selectedCompanyModal.hiringTracks.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Key Hiring & Cadre Tracks
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedCompanyModal.hiringTracks.map((track) => (
                      <div key={track} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="font-semibold text-slate-800">{track}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary Tech Stack */}
              {selectedCompanyModal.techStack && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Primary Technology Stack
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCompanyModal.techStack.map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Sample Vacancies Listed on HireHub */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Vacancies on HireHub ({companyJobs.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCompanyModal(null);
                      handleViewOpenings(selectedCompanyModal.name);
                    }}
                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    View All in Job Search →
                  </button>
                </div>

                {companyJobs.length > 0 ? (
                  <div className="space-y-2">
                    {companyJobs.map((j) => (
                      <div
                        key={j.id}
                        onClick={() => {
                          setSelectedCompanyModal(null);
                          navigate(`/jobs/${j.id}`);
                        }}
                        className="p-3 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/40 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900 hover:text-blue-600">{j.title}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{j.location} · {j.salary}</div>
                        </div>
                        <span className="text-blue-600 font-bold shrink-0">View Details →</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    More vacancies being added for this employer. Click below to view the official careers portal.
                  </p>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <a
                href={selectedCompanyModal.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Corporate Website</span>
              </a>

              <div className="flex items-center gap-2">
                <a
                  href={selectedCompanyModal.careersUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <span>Official Careers Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
