import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  ExternalLink,
  MapPin,
  Briefcase,
  Calendar,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileCheck2,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_JOBS } from '../data/mockJobs';
import { MOCK_COMPANIES } from '../data/mockCompanies';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isJobSaved, toggleSaveJob, applyToJob, candidateProfile } = useApp();

  // Find target job
  const job = useMemo(() => {
    return MOCK_JOBS.find((j) => j.id === id) || MOCK_JOBS[0];
  }, [id]);

  // Find company info
  const companyInfo = useMemo(() => {
    return MOCK_COMPANIES.find(
      (c) => c.name.toLowerCase() === job.company.toLowerCase()
    );
  }, [job.company]);

  // Find related jobs
  const relatedJobs = useMemo(() => {
    return MOCK_JOBS.filter(
      (j) => j.id !== job.id && (j.category === job.category || j.company === job.company)
    ).slice(0, 3);
  }, [job]);

  const saved = isJobSaved(job.id);

  const handleApply = () => {
    applyToJob(job.id);
    window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
  };

  // Quick eligibility check against candidate profile in AppContext
  const profileBatchMatch = job.eligibleBatches.includes(candidateProfile.graduationYear);
  const profileCgpaNum = parseFloat(candidateProfile.cgpa) || 0;
  const cutoffMatch = !job.minCgpa || profileCgpaNum >= 6.0;

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      
      {/* ========================================================
          1. BREADCRUMBS & TOP BAR
          ======================================================== */}
      <div className="bg-white border-b border-slate-200/90 pt-5 pb-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <nav className="flex items-center gap-2">
              <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <span>/</span>
              <Link to="/jobs" className="hover:text-blue-600 transition-colors">Find Jobs</Link>
              <span>/</span>
              <span className="text-slate-400 truncate max-w-[150px] sm:max-w-xs">{job.company}</span>
              <span>/</span>
              <span className="text-slate-900 font-semibold truncate max-w-[180px] sm:max-w-sm">{job.title}</span>
            </nav>

            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all vacancies</span>
            </Link>
          </div>

        </div>
      </div>

      {/* ========================================================
          2. JOB HEADER HERO CARD
          ======================================================== */}
      <section className="bg-white border-b border-slate-200/90 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Identity and Title */}
            <div className="flex items-start gap-4 sm:gap-5">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${job.companyColor || 'from-slate-700 to-slate-900'} text-white font-extrabold text-xl sm:text-2xl flex items-center justify-center shadow-md shrink-0`}>
                {job.companyLogo || job.company.substring(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    {job.company}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className={`text-xs font-semibold ${job.jobType === 'Internship' ? 'text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md' : 'text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md'}`}>
                    {job.jobType}
                  </span>
                  {job.isFresherFriendly && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Fresher Eligible
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {job.title}
                </h1>

                {/* Primary Quick Info Row */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-600 mt-3">
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {job.location} ({job.workMode})
                  </span>
                  <span className="text-slate-300 hidden sm:inline">·</span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    {job.experienceYears}
                  </span>
                  <span className="text-slate-300 hidden sm:inline">·</span>
                  <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {job.salary}
                  </span>
                  <span className="text-slate-300 hidden sm:inline">·</span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Posted {job.postedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Header Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 pt-2 lg:pt-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => toggleSaveJob(job.id)}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer min-h-[44px] ${
                  saved
                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-blue-600 text-blue-600' : ''}`} />
                <span>{saved ? 'Saved Vacancy' : 'Save Vacancy'}</span>
              </button>

              <button
                type="button"
                onClick={handleApply}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 active:scale-[0.99] cursor-pointer min-h-[44px]"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          3. MAIN CONTENT: 2-COLUMN LAYOUT
          ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* ====================================================
              LEFT COLUMN (2/3 width): Complete Details
              ==================================================== */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* ELIGIBILITY SUMMARY BANNER */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">
                    Official Eligibility Criteria
                  </h2>
                </div>
                <Link
                  to="/eligibility"
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                >
                  <span>Test My Eligibility</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Eligible Degrees
                  </span>
                  <span className="text-xs font-bold text-slate-800 block">
                    {job.education}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Graduation Batches
                  </span>
                  <span className="text-xs font-bold text-slate-800 block">
                    {job.eligibleBatches.join(', ')} Graduates
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Academic Cutoff
                  </span>
                  <span className="text-xs font-bold text-slate-800 block">
                    {job.minCgpa || '60% or 6.0 CGPA (No Backlogs)'}
                  </span>
                </div>
              </div>
            </div>

            {/* ROLE OVERVIEW & DESCRIPTION */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
              <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Role Overview
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* KEY RESPONSIBILITIES */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
                <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  Key Responsibilities
                </h2>
                <ul className="space-y-3 text-sm text-slate-600">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="leading-relaxed">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* REQUIRED TECHNICAL SKILLS */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between pb-2 mb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">
                  Required Technical Skills & Competencies
                </h2>
                <Link
                  to="/resume-analyzer"
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Match My Resume</span>
                </Link>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 text-xs font-bold rounded-xl border border-slate-200/80 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <p className="text-xs text-slate-500 leading-relaxed pt-2">
                Tip: Ensure these technical keywords and relevant academic/capstone projects are highlighted on your resume before applying.
              </p>
            </div>

            {/* TYPICAL SELECTION & INTERVIEW PROCESS */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
              <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Standard Hiring Process
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs font-extrabold text-blue-600 mb-1">Round 01</div>
                  <div className="text-xs font-bold text-slate-900">Online Assessment</div>
                  <div className="text-[11px] text-slate-500 mt-1">Aptitude, reasoning & coding evaluation</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs font-extrabold text-blue-600 mb-1">Round 02</div>
                  <div className="text-xs font-bold text-slate-900">Technical Interview</div>
                  <div className="text-[11px] text-slate-500 mt-1">Data structures, system concepts & live coding</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs font-extrabold text-blue-600 mb-1">Round 03</div>
                  <div className="text-xs font-bold text-slate-900">Managerial / System</div>
                  <div className="text-[11px] text-slate-500 mt-1">Project discussion & problem solving</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs font-extrabold text-blue-600 mb-1">Round 04</div>
                  <div className="text-xs font-bold text-slate-900">HR Discussion</div>
                  <div className="text-[11px] text-slate-500 mt-1">Verification, location preference & offer rollout</div>
                </div>
              </div>
            </div>

            {/* ABOUT THE COMPANY */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between pb-2 mb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">
                  About {job.company}
                </h2>
                {companyInfo && (
                  <a
                    href={companyInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>Visit Corporate Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {companyInfo?.description || `${job.company} is a premier technology employer offering expansive global opportunities, structured mentorship, and cutting-edge engineering projects.`}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block mb-0.5">Headquarters</span>
                  <span className="font-semibold text-slate-800">{companyInfo?.headquarters || job.location}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block mb-0.5">Industry Track</span>
                  <span className="font-semibold text-slate-800">{companyInfo?.category || job.category}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block mb-0.5">Active Openings</span>
                  <span className="font-semibold text-slate-800">{companyInfo?.openingsCount || '40+'} roles</span>
                </div>
              </div>
            </div>

            {/* VERIFICATION & OFFICIAL PORTAL NOTICE */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Direct Official Application Portal</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Clicking "Apply on Official Portal" redirects you directly to the verified company website ({new URL(job.applyUrl).hostname}). Zero fees or intermediaries.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleApply}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl whitespace-nowrap shadow-sm transition-colors cursor-pointer"
              >
                Launch Official Apply
              </button>
            </div>

          </div>

          {/* ====================================================
              RIGHT COLUMN (1/3 width): Sidebar Summaries & Tools
              ==================================================== */}
          <div className="space-y-6">
            
            {/* JOB SUMMARY CARD */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 pb-3 mb-4 border-b border-slate-100 uppercase tracking-wider text-xs">
                Vacancy Summary
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Compensation:</span>
                  <span className="font-bold text-slate-900 text-sm">{job.salary}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Job Type:</span>
                  <span className="font-semibold text-slate-800">{job.jobType}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Work Mode:</span>
                  <span className="font-semibold text-slate-800">{job.workMode}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Experience:</span>
                  <span className="font-semibold text-slate-800">{job.experienceYears}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-semibold text-slate-800">{job.location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Track:</span>
                  <span className="font-semibold text-slate-800">{job.category}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-slate-500">Application Deadline:</span>
                  <span className="font-bold text-rose-600">{job.applicationDeadline}</span>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={handleApply}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => toggleSaveJob(job.id)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                    saved
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-blue-600' : ''}`} />
                  <span>{saved ? 'Saved in My Jobs' : 'Save for Later'}</span>
                </button>
              </div>
            </div>

            {/* CANDIDATE ELIGIBILITY SNAPSHOT */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center gap-2 mb-3">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Profile Compatibility
                </h3>
              </div>

              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Snapshot based on your current registered profile ({candidateProfile.name}):
              </p>

              <div className="space-y-2 text-xs mb-4">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-600">Batch ({candidateProfile.graduationYear}):</span>
                  <span className={`font-bold ${profileBatchMatch ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {profileBatchMatch ? '✓ Eligible Batch' : 'Review Needed'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-600">Academic CGPA ({candidateProfile.cgpa}):</span>
                  <span className={`font-bold ${cutoffMatch ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {cutoffMatch ? '✓ Above Cutoff' : 'Below Threshold'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/eligibility')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Run Full Eligibility Verification
              </button>
            </div>

            {/* SIMILAR VACANCIES */}
            {relatedJobs.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                  Similar Opportunities
                </h3>

                <div className="space-y-3.5">
                  {relatedJobs.map((rJob) => (
                    <div
                      key={rJob.id}
                      onClick={() => {
                        navigate(`/jobs/${rJob.id}`);
                        window.scrollTo(0, 0);
                      }}
                      className="group p-3 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/40 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-blue-600">{rJob.company}</span>
                        <span className="text-[10px] text-slate-400">{rJob.jobType}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {rJob.title}
                      </h4>
                      <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                        <span>{rJob.location}</span>
                        <span className="font-semibold text-slate-800">{rJob.salary}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
};
