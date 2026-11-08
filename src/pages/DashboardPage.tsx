import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  GraduationCap,
  Briefcase,
  Bookmark,
  FileText,
  FileCheck2,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Plus,
  X,
  Edit3,
  Award,
  Layers,
  ChevronRight,
  BookOpen,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Job, ApplicationRecord } from '../types/job';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    candidateProfile,
    updateCandidateProfile,
    savedJobIds,
    toggleSaveJob,
    applications,
    updateApplicationStatus,
    allJobs,
    applyToJob
  } = useApp();

  // Profile Edit Modal state
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(candidateProfile.name);
  const [editDegree, setEditDegree] = useState(candidateProfile.degree);
  const [editBranch, setEditBranch] = useState(candidateProfile.branch);
  const [editBatch, setEditBatch] = useState(candidateProfile.graduationYear);
  const [editCgpa, setEditCgpa] = useState(candidateProfile.cgpa);

  // New skill input
  const [newSkillInput, setNewSkillInput] = useState('');

  // Save profile edits
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCandidateProfile({
      name: editName,
      degree: editDegree,
      branch: editBranch,
      graduationYear: editBatch,
      cgpa: editCgpa
    });
    setEditProfileOpen(false);
  };

  // Add skill to profile
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (trimmed && !candidateProfile.skills.includes(trimmed)) {
      updateCandidateProfile({
        skills: [...candidateProfile.skills, trimmed]
      });
      setNewSkillInput('');
    }
  };

  // Remove skill from profile
  const handleRemoveSkill = (skillToRemove: string) => {
    updateCandidateProfile({
      skills: candidateProfile.skills.filter((s) => s !== skillToRemove)
    });
  };

  // Saved Jobs list
  const savedJobsList = useMemo(() => {
    return allJobs.filter((j) => savedJobIds.includes(j.id));
  }, [allJobs, savedJobIds]);

  // Recommended Jobs based on candidate's skills and graduation batch
  const recommendedJobs = useMemo(() => {
    const candidateSkillsLower = candidateProfile.skills.map((s) => s.toLowerCase());

    const scored = allJobs.map((job) => {
      let score = 50; // base score

      // Check batch eligibility
      if (job.eligibleBatches.includes(candidateProfile.graduationYear)) {
        score += 25;
      }

      // Check skills overlap
      const matchingSkillsCount = job.skills.filter((s) =>
        candidateSkillsLower.includes(s.toLowerCase())
      ).length;

      score += Math.min(25, matchingSkillsCount * 6);

      return {
        job,
        matchPercentage: Math.min(98, score),
        matchingSkillsCount
      };
    });

    return scored.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 4);
  }, [allJobs, candidateProfile]);

  // Application statistics
  const stats = useMemo(() => {
    const totalApplied = applications.length;
    const totalSaved = savedJobIds.length;
    const inProgress = applications.filter((a) =>
      ['Assessment', 'Interview'].includes(a.status)
    ).length;
    const selectedCount = applications.filter((a) => a.status === 'Selected').length;

    return { totalApplied, totalSaved, inProgress, selectedCount };
  }, [applications, savedJobIds]);

  // Profile completion calculation
  const profileCompletion = useMemo(() => {
    let score = 0;
    if (candidateProfile.name) score += 20;
    if (candidateProfile.degree && candidateProfile.branch) score += 20;
    if (candidateProfile.graduationYear) score += 20;
    if (candidateProfile.cgpa) score += 15;
    if (candidateProfile.skills.length >= 3) score += 15;
    score += 10; // Registered account bonus
    return Math.min(100, score);
  }, [candidateProfile]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      
      {/* ========================================================
          1. DASHBOARD HEADER & WELCOME STRIP
          ======================================================== */}
      <section className="bg-white border-b border-slate-200/90 pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Candidate Dashboard</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Candidate Identity */}
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shrink-0">
                {candidateProfile.name.charAt(0)}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Welcome back, {candidateProfile.name}
                  </h1>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                    Candidate Member
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-medium">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                    {candidateProfile.degree} ({candidateProfile.branch})
                  </span>
                  <span className="text-slate-300">·</span>
                  <span>Batch of {candidateProfile.graduationYear}</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-bold text-slate-900">CGPA: {candidateProfile.cgpa}</span>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setEditName(candidateProfile.name);
                  setEditDegree(candidateProfile.degree);
                  setEditBranch(candidateProfile.branch);
                  setEditBatch(candidateProfile.graduationYear);
                  setEditCgpa(candidateProfile.cgpa);
                  setEditProfileOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/resume-analyzer')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Resume Analyzer</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/jobs')}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
              >
                <span>Find Jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          2. KPI STATISTICS & PROFILE COMPLETION ROW
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Jobs Applied</span>
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {stats.totalApplied}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Official career submissions</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Saved Vacancies</span>
              <Bookmark className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {stats.totalSaved}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Bookmarked for later</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">In Pipeline</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {stats.inProgress}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Assessment / Interview rounds</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Profile Readiness</span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tabular-nums">
              {profileCompletion}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Ready for eligibility checks</div>
          </div>
        </div>

        {/* Profile Completion Bar Banner */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Profile Strength & Criteria Status
              </span>
              <span className="text-xs font-bold text-blue-700">{profileCompletion}% Complete</span>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-3 overflow-hidden">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Academics & CGPA Configured
              </span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {candidateProfile.skills.length} Technical Skills Verified
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-600">
                Ready for TCS, Microsoft, and Infosys Cutoff Validation
              </span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/eligibility')}
              className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Verify Job Eligibility
            </button>
          </div>
        </div>

        {/* ========================================================
            3. MAIN CONTENT: 2-COLUMN DASHBOARD GRID
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* ====================================================
              LEFT 2 COLUMNS: Recommended Jobs & Saved Jobs
              ==================================================== */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* RECOMMENDED JOBS FOR YOU */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Recommended Opportunities for You
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Personalized match for {candidateProfile.degree} ({candidateProfile.branch}) · Batch {candidateProfile.graduationYear}
                  </p>
                </div>

                <Link
                  to="/jobs"
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                >
                  <span>Explore All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-4">
                {recommendedJobs.map(({ job, matchPercentage }) => (
                  <div
                    key={job.id}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="group p-4 sm:p-5 rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${job.companyColor || 'from-slate-700 to-slate-900'} text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0`}>
                        {job.companyLogo || job.company.substring(0, 2).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            {job.company}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-md">
                            {matchPercentage}% Match
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {job.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-1.5">
                          <span>{job.location} ({job.workMode})</span>
                          <span>·</span>
                          <span>{job.experienceYears}</span>
                          <span>·</span>
                          <span className="font-semibold text-slate-900">{job.salary}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-[11px] text-slate-400">
                        Deadline: {job.applicationDeadline}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveJob(job.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          <Bookmark className={`w-4 h-4 ${savedJobIds.includes(job.id) ? 'fill-blue-600 text-blue-600' : ''}`} />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/jobs/${job.id}`);
                          }}
                          className="px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-blue-600 text-white rounded-lg transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SAVED JOBS SNAPSHOT */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-blue-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    Saved Vacancies ({savedJobsList.length})
                  </h2>
                </div>

                <Link
                  to="/saved-jobs"
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                >
                  <span>Manage Saved Jobs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {savedJobsList.length > 0 ? (
                <div className="space-y-3">
                  {savedJobsList.slice(0, 3).map((job) => (
                    <div
                      key={job.id}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="p-3.5 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${job.companyColor || 'from-slate-700 to-slate-900'} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                          {job.companyLogo || job.company.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 hover:text-blue-600 truncate">
                            {job.title}
                          </h4>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {job.company} · {job.location} · <strong className="text-slate-800">{job.salary}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveJob(job.id);
                          }}
                          className="text-[11px] font-semibold text-rose-600 hover:underline p-1 cursor-pointer"
                        >
                          Remove
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            applyToJob(job.id);
                            window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
                          }}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100">
                  <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 mb-3">You haven't bookmarked any vacancies yet.</p>
                  <button
                    type="button"
                    onClick={() => navigate('/jobs')}
                    className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Browse Vacancies
                  </button>
                </div>
              )}
            </div>

            {/* RECENT APPLICATION ACTIVITY */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    Application History & Tracker ({applications.length})
                  </h2>
                </div>

                <Link
                  to="/tracker"
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                >
                  <span>Full Pipeline Board</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {applications.length > 0 ? (
                <div className="space-y-3">
                  {applications.map((app) => {
                    const matchedJob = allJobs.find((j) => j.id === app.jobId);
                    return (
                      <div
                        key={app.jobId}
                        className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900">
                              {matchedJob?.title || 'Engineering Role'}
                            </span>
                            <span className="text-slate-400">·</span>
                            <span className="font-semibold text-blue-600">
                              {matchedJob?.company || 'Technology Company'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Applied on: <strong>{app.appliedDate}</strong> · Notes: {app.notes || 'Submitted via official portal'}
                          </div>
                        </div>

                        {/* Interactive Status Selector */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] text-slate-400">Status:</span>
                          <select
                            value={app.status}
                            onChange={(e) =>
                              updateApplicationStatus(app.jobId, e.target.value as ApplicationRecord['status'])
                            }
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg border focus:outline-none cursor-pointer ${
                              app.status === 'Selected'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : app.status === 'Interview'
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : app.status === 'Assessment'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-blue-50 text-blue-800 border-blue-200'
                            }`}
                          >
                            <option value="Saved">Saved</option>
                            <option value="Applied">Applied</option>
                            <option value="Assessment">Assessment</option>
                            <option value="Interview">Interview</option>
                            <option value="Selected">Selected</option>
                            <option value="Not Selected">Not Selected</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500">No applications recorded yet. Start applying to verified openings!</p>
                </div>
              )}
            </div>

          </div>

          {/* ====================================================
              RIGHT COLUMN (1/3): Skills Summary & Quick Utilities
              ==================================================== */}
          <div className="space-y-6">
            
            {/* TECHNICAL SKILLS SUMMARY */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Technical Skill Stack ({candidateProfile.skills.length})
                </h3>
                <Link
                  to="/skill-gap"
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Skill Gap Tool →
                </Link>
              </div>

              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Skills used for role matching and ATS score calculations:
              </p>

              {/* Skills Pill List */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {candidateProfile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg group"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="Remove skill"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Skill Input Form */}
              <form onSubmit={handleAddSkill} className="flex gap-2 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  placeholder="Add skill (e.g. Docker, AWS)..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* QUICK UTILITIES LAUNCHPAD */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                Quick Access Career Tools
              </h3>

              <div className="space-y-3">
                <div
                  onClick={() => navigate('/resume-analyzer')}
                  className="group p-3.5 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/40 transition-all cursor-pointer flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Resume Compatibility Analyzer
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Upload PDF/DOCX to get estimated role match score & missing keywords.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => navigate('/eligibility')}
                  className="group p-3.5 rounded-xl border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all cursor-pointer flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      Company Eligibility Checker
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Verify academic cutoffs for TCS, Microsoft, Infosys & Wipro.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => navigate('/career-guidance')}
                  className="group p-3.5 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all cursor-pointer flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      Fresher Career Roadmaps
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Learning guides for Software Engineering, Cloud & AI tracks.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* DEMO PROFILE RESET NOTICE */}
            <div className="p-4 bg-slate-100/70 rounded-2xl border border-slate-200/80 text-xs text-slate-500">
              <span className="font-bold text-slate-800 block mb-1">Local Storage Persistent</span>
              Profile edits, bookmarked vacancies, and application milestones are saved securely in your browser's local storage.
            </div>

          </div>

        </div>

      </section>

      {/* ========================================================
          4. EDIT PROFILE MODAL
          ======================================================== */}
      {editProfileOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditProfileOpen(false)}
        >
          <div
            className="relative bg-white rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                Update Candidate Profile
              </h3>
              <button
                type="button"
                onClick={() => setEditProfileOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Degree
                  </label>
                  <select
                    value={editDegree}
                    onChange={(e) => setEditDegree(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500"
                  >
                    <option value="B.Tech">B.Tech / B.E.</option>
                    <option value="MCA">MCA</option>
                    <option value="M.Tech">M.Tech / M.E.</option>
                    <option value="BCA">BCA / B.Sc</option>
                    <option value="Other STEM">Other STEM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Batch
                  </label>
                  <select
                    value={editBatch}
                    onChange={(e) => setEditBatch(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500"
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Branch / Stream
                  </label>
                  <input
                    type="text"
                    required
                    value={editBranch}
                    onChange={(e) => setEditBranch(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    CGPA / Aggregate
                  </label>
                  <input
                    type="text"
                    required
                    value={editCgpa}
                    onChange={(e) => setEditCgpa(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
