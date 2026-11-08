import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Sparkles,
  ArrowRight,
  Code2,
  Clock,
  Layers,
  ExternalLink,
  Plus,
  X,
  Target,
  Trophy,
  Briefcase,
  ChevronRight,
  FileCheck2,
  FolderGit2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getLearningGuideForSkill, SkillLearningResource } from '../data/skillLearningData';

export const SkillGapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { candidateProfile, updateCandidateProfile, applyToJob, allJobs, showToast } = useApp();

  // Selected job id from URL or fallback to first job
  const initialJobId = searchParams.get('job') || allJobs[0].id;
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId);

  // New skill input state for in-page addition
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isAddingCustomSkill, setIsAddingCustomSkill] = useState(false);

  // Currently inspected skill for the learning roadmap
  const [inspectedSkillName, setInspectedSkillName] = useState<string | null>(null);

  // Active filter for skills matrix (All, Matched, Missing)
  const [filterTab, setFilterTab] = useState<'all' | 'missing' | 'matched'>('all');

  // Target job lookup
  const targetJob = useMemo(() => {
    return allJobs.find((j) => j.id === selectedJobId) || allJobs[0];
  }, [allJobs, selectedJobId]);

  // Skill comparison calculation
  const { matchedSkills, missingSkills, matchPercentage, totalRequired, estimatedWeeksToBridge } = useMemo(() => {
    const candidateSkillsLower = candidateProfile.skills.map((s) => s.trim().toLowerCase());
    const matched: string[] = [];
    const missing: string[] = [];

    targetJob.skills.forEach((skill) => {
      const lower = skill.trim().toLowerCase();
      if (candidateSkillsLower.includes(lower)) {
        matched.push(skill);
      } else {
        missing.push(skill);
      }
    });

    const total = targetJob.skills.length;
    const percentage = total > 0 ? Math.round((matched.length / total) * 100) : 100;

    // Calculate total weeks to bridge gap
    const weeks = missing.reduce((acc, skill) => {
      const guide = getLearningGuideForSkill(skill);
      return acc + (guide.estimatedWeeks || 2);
    }, 0);

    return {
      matchedSkills: matched,
      missingSkills: missing,
      matchPercentage: percentage,
      totalRequired: total,
      estimatedWeeksToBridge: weeks
    };
  }, [candidateProfile.skills, targetJob]);

  // Set initial inspected skill to first missing skill, or first matched skill
  const currentInspectedSkill = useMemo(() => {
    if (inspectedSkillName) {
      return getLearningGuideForSkill(inspectedSkillName);
    }
    if (missingSkills.length > 0) {
      return getLearningGuideForSkill(missingSkills[0]);
    }
    if (targetJob.skills.length > 0) {
      return getLearningGuideForSkill(targetJob.skills[0]);
    }
    return getLearningGuideForSkill('Java');
  }, [inspectedSkillName, missingSkills, targetJob.skills]);

  // Handler: Add a skill directly to candidate's profile
  const handleAddSkillToProfile = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    
    // Check if skill is already present
    const alreadyPresent = candidateProfile.skills.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase()
    );

    if (alreadyPresent) {
      showToast(`${trimmed} is already in your profile!`);
      return;
    }

    const updated = [...candidateProfile.skills, trimmed];
    updateCandidateProfile({ skills: updated });
    showToast(`Added ${trimmed} to your profile skills!`);
    setNewSkillInput('');
    setIsAddingCustomSkill(false);
  };

  // Handler: Remove a skill from candidate's profile
  const handleRemoveSkillFromProfile = (skillToRemove: string) => {
    const updated = candidateProfile.skills.filter(
      (s) => s.toLowerCase() !== skillToRemove.toLowerCase()
    );
    updateCandidateProfile({ skills: updated });
    showToast(`Removed ${skillToRemove} from profile.`);
  };

  // Readiness tier badge formatting
  const readinessTier = useMemo(() => {
    if (matchPercentage >= 80) {
      return {
        label: 'Interview Ready',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        barColor: 'bg-emerald-500',
        description: 'You possess the majority of technical competencies required for this role.'
      };
    } else if (matchPercentage >= 50) {
      return {
        label: 'Moderate Alignment',
        color: 'text-blue-700 bg-blue-50 border-blue-200',
        barColor: 'bg-blue-600',
        description: 'Strong foundational match. Bridging 1-2 core skills will significantly increase your hiring odds.'
      };
    } else {
      return {
        label: 'Upskilling Recommended',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        barColor: 'bg-amber-500',
        description: 'Several core skills are missing. Follow the curated learning path below to close the gap.'
      };
    }
  }, [matchPercentage]);

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
            <span className="text-slate-900 font-semibold">Skill Gap Analyzer</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-200/60">
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                <span>Career Readiness & Curriculum Matching</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Skill Gap Analyzer
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Benchmark your technical stack against target company requirements, pinpoint missing competencies, and follow targeted learning tracks with practice projects.
              </p>
            </div>

            {/* Quick Profile Summary Badge */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                {candidateProfile.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {candidateProfile.name}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {candidateProfile.degree} ({candidateProfile.graduationYear}) · {candidateProfile.skills.length} skills listed
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          2. JOB SELECTOR & CANDIDATE SKILLSET BAR
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
          
          {/* Vacancy Selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-1">
                Select Target Opportunity to Compare
              </label>
              <p className="text-xs text-slate-500">
                Choose from verified openings across IT service giants and product enterprises.
              </p>
            </div>

            <div className="w-full md:w-96">
              <select
                value={selectedJobId}
                onChange={(e) => {
                  setSelectedJobId(e.target.value);
                  setInspectedSkillName(null);
                }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
              >
                {allJobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.company} — {j.title} ({j.jobType})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Job Snapshot Banner */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-sm shadow-2xs">
                {targetJob.companyLogo || targetJob.company.slice(0, 3).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{targetJob.title}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                    {targetJob.category}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {targetJob.company} · {targetJob.location} · {targetJob.salary}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to={`/jobs/${targetJob.id}`}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Job Details
              </Link>
              <button
                type="button"
                onClick={() => {
                  applyToJob(targetJob.id);
                  window.open(targetJob.applyUrl, '_blank', 'noopener,noreferrer');
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Official Apply</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Candidate Profile Skills Manager on the page */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Your Current Profile Skills ({candidateProfile.skills.length})
                </span>
              </div>
              
              {!isAddingCustomSkill && (
                <button
                  type="button"
                  onClick={() => setIsAddingCustomSkill(true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              )}
            </div>

            {/* In-page Add Custom Skill Form */}
            {isAddingCustomSkill && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddSkillToProfile(newSkillInput);
                }}
                className="flex items-center gap-2 mb-3 p-3 bg-blue-50/60 rounded-xl border border-blue-200"
              >
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  placeholder="e.g. Docker, Spring Boot, React, AWS..."
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingCustomSkill(false)}
                  className="px-2 py-1.5 text-slate-500 hover:text-slate-700 text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            )}

            {/* Candidate Skill Chips */}
            <div className="flex flex-wrap gap-2">
              {candidateProfile.skills.map((skill) => {
                const isRequiredByJob = targetJob.skills.some(
                  (s) => s.toLowerCase() === skill.toLowerCase()
                );
                return (
                  <span
                    key={skill}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                      isRequiredByJob
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {isRequiredByJob && <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />}
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkillFromProfile(skill)}
                      title={`Remove ${skill}`}
                      className="text-slate-400 hover:text-rose-600 transition-colors ml-1 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          3. READINESS OVERVIEW METRICS & PROGRESS
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Big Readiness Card (7 cols) */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border mb-1.5 ${readinessTier.color}`}>
                    {readinessTier.label}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Skill Alignment with {targetJob.company}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums">
                    {matchPercentage}%
                  </span>
                  <span className="text-xs text-slate-400 font-semibold block">Readiness</span>
                </div>
              </div>

              {/* Linear Progress Bar */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full ${readinessTier.barColor} transition-all duration-500 rounded-full`}
                  style={{ width: `${matchPercentage}%` }}
                />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {readinessTier.description}
              </p>
            </div>

            {/* Quick breakdown metrics footer */}
            <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-100 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-lg font-extrabold text-slate-900 block">{totalRequired}</span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Required</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-lg font-extrabold text-emerald-700 block">{matchedSkills.length}</span>
                <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">Acquired</span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100">
                <span className="text-lg font-extrabold text-rose-700 block">{missingSkills.length}</span>
                <span className="text-[10px] font-semibold text-rose-800 uppercase tracking-wider">Skill Gap</span>
              </div>
            </div>
          </div>

          {/* Action Estimate Card (5 cols) */}
          <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Clock className="w-4 h-4" />
                <span>Upskilling Timeline</span>
              </div>
              
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                ~{estimatedWeeksToBridge} {estimatedWeeksToBridge === 1 ? 'Week' : 'Weeks'} to Full Match
              </h3>
              
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Based on standard self-paced study (10–12 hours/week), mastering these {missingSkills.length} key competencies will bridge your technical gap for this opening.
              </p>

              {missingSkills.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-700/80">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                    Priority Skill Targets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {missingSkills.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setInspectedSkillName(s)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800/90 text-amber-300 border border-amber-400/30 hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        {s} →
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 mt-6 border-t border-slate-700/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Next Step:</span>
              <Link
                to={`/resume-analyzer?job=${targetJob.id}`}
                className="text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-1 transition-colors"
              >
                <span>Check Resume Keywords</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          4. SKILLS COMPARISON MATRIX & ROADMAP EXPLORER
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ====================================================
              LEFT COLUMN (5 cols): Job Required Skills Matrix
              ==================================================== */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span>Required Skills Breakdown</span>
                </h3>

                {/* Filter Tabs */}
                <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setFilterTab('all')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      filterTab === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    All ({targetJob.skills.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterTab('missing')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      filterTab === 'missing' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Missing ({missingSkills.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterTab('matched')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      filterTab === 'matched' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Matched ({matchedSkills.length})
                  </button>
                </div>
              </div>

              {/* Skills List */}
              <div className="space-y-2.5 mt-4">
                {targetJob.skills
                  .filter((skill) => {
                    const isMatched = matchedSkills.includes(skill);
                    if (filterTab === 'missing') return !isMatched;
                    if (filterTab === 'matched') return isMatched;
                    return true;
                  })
                  .map((skill) => {
                    const isMatched = matchedSkills.includes(skill);
                    const isInspected = currentInspectedSkill.skill.toLowerCase() === skill.toLowerCase();
                    const guide = getLearningGuideForSkill(skill);

                    return (
                      <div
                        key={skill}
                        onClick={() => setInspectedSkillName(skill)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isInspected
                            ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-2xs'
                            : 'border-slate-200/80 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {isMatched ? (
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                              <AlertCircle className="w-4 h-4" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                                {skill}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {guide.category}
                              </span>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-500 block">
                              {isMatched ? '✓ Acquired in Profile' : `Gap · ~${guide.estimatedWeeks}w to master`}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {!isMatched && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddSkillToProfile(skill);
                              }}
                              className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold border border-blue-200 cursor-pointer"
                              title="Mark as learned and add to profile"
                            >
                              + Add
                            </button>
                          )}
                          <ChevronRight className={`w-4 h-4 transition-transform ${isInspected ? 'text-blue-600 translate-x-0.5' : 'text-slate-300'}`} />
                        </div>
                      </div>
                    );
                  })}
              </div>

            </div>
          </div>

          {/* ====================================================
              RIGHT COLUMN (7 cols): In-Depth Learning Roadmap
              ==================================================== */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
              
              {/* Header for Inspected Skill */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {currentInspectedSkill.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                      ~{currentInspectedSkill.estimatedWeeks} Weeks Est.
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      currentInspectedSkill.importance === 'Critical'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {currentInspectedSkill.importance} Priority
                    </span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>{currentInspectedSkill.skill}</span>
                    {matchedSkills.includes(currentInspectedSkill.skill) && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        In Profile ✓
                      </span>
                    )}
                  </h3>
                  
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {currentInspectedSkill.description}
                  </p>
                </div>

                {/* Mark as mastered / add to profile button */}
                <div className="shrink-0">
                  {matchedSkills.includes(currentInspectedSkill.skill) ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveSkillFromProfile(currentInspectedSkill.skill)}
                      className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
                    >
                      Remove from Profile
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAddSkillToProfile(currentInspectedSkill.skill)}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      <span>Mark Mastered & Add</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Key Topics / Syllabus to Master */}
              <div className="pt-6">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Key Syllabus & Core Concepts to Master</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentInspectedSkill.keyTopics.map((topic, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-700"
                    >
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed font-medium">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Practical Project */}
              <div className="pt-6">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-purple-600" />
                  <span>Resume-Worthy Hands-on Project</span>
                </h4>

                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-purple-950 block mb-1">
                      Recommended Practical Milestone:
                    </span>
                    <p className="text-xs text-purple-900 leading-relaxed">
                      {currentInspectedSkill.recommendedProject}
                    </p>
                    <span className="text-[11px] text-purple-700/80 mt-1.5 block">
                      Add this completed project to your GitHub and list it under the projects section of your HireHub resume.
                    </span>
                  </div>
                </div>
              </div>

              {/* Free Curated Learning Tracks & Docs */}
              <div className="pt-6">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Curated Free Resources & Documentation</span>
                </h4>

                <div className="space-y-2">
                  {currentInspectedSkill.freeResources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-300 transition-all flex items-center justify-between gap-3 text-xs group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-600 border border-slate-200 shrink-0">
                          {res.type}
                        </span>
                        <span className="font-semibold text-slate-800 group-hover:text-blue-600 truncate">
                          {res.title}
                        </span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Callout Banner */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">Compare Another Role or Check Eligibility?</h4>
                <p className="text-xs text-slate-300 mt-1 max-w-md">
                  Verify academic branch, graduation batch, and CGPA cutoffs for {targetJob.company}.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <Link
                  to={`/eligibility?job=${targetJob.id}`}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
                >
                  Eligibility Check
                </Link>
                <Link
                  to={`/resume-analyzer?job=${targetJob.id}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Resume Match
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
