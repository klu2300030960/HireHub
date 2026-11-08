import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  GraduationCap,
  Briefcase,
  Award,
  Search,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Info,
  Building2,
  Plus,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Job } from '../types/job';
import { MOCK_JOBS } from '../data/mockJobs';

export const EligibilityCheckerPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { candidateProfile, updateCandidateProfile, applyToJob, toggleSaveJob, isJobSaved } = useApp();

  // Target Job selection state (can be set via ?job=id query param or defaults to first job)
  const initialJobId = searchParams.get('job') || MOCK_JOBS[0].id;
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId);

  // Candidate evaluation inputs (initialized from AppContext profile)
  const [degree, setDegree] = useState(candidateProfile.degree || 'B.Tech');
  const [branch, setBranch] = useState(candidateProfile.branch || 'Computer Science & Engineering');
  const [batch, setBatch] = useState(candidateProfile.graduationYear || '2025');
  const [cgpa, setCgpa] = useState(candidateProfile.cgpa || '8.4');
  const [backlogs, setBacklogs] = useState<'0' | '1' | '2+'>('0');
  const [experienceYears, setExperienceYears] = useState(candidateProfile.experienceYears || '0');
  const [candidateSkills, setCandidateSkills] = useState<string[]>(
    candidateProfile.skills.length > 0
      ? candidateProfile.skills
      : ['Java', 'Python', 'SQL', 'Data Structures', 'Git']
  );
  const [newSkillInput, setNewSkillInput] = useState('');

  // Selected job entity
  const targetJob = useMemo(() => {
    return MOCK_JOBS.find((j) => j.id === selectedJobId) || MOCK_JOBS[0];
  }, [selectedJobId]);

  // Handle adding skill
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (trimmed && !candidateSkills.includes(trimmed)) {
      setCandidateSkills([...candidateSkills, trimmed]);
      setNewSkillInput('');
    }
  };

  // Handle removing skill
  const handleRemoveSkill = (skill: string) => {
    setCandidateSkills(candidateSkills.filter((s) => s !== skill));
  };

  // Sync with AppContext profile
  const handleSyncFromProfile = () => {
    setDegree(candidateProfile.degree);
    setBranch(candidateProfile.branch);
    setBatch(candidateProfile.graduationYear);
    setCgpa(candidateProfile.cgpa);
    setCandidateSkills(candidateProfile.skills);
    setExperienceYears(candidateProfile.experienceYears);
  };

  // Save current form values back to candidate profile in AppContext
  const handleSaveToProfile = () => {
    updateCandidateProfile({
      degree,
      branch,
      graduationYear: batch,
      cgpa,
      skills: candidateSkills,
      experienceYears
    });
  };

  // ==========================================================
  // ELIGIBILITY EVALUATION ENGINE
  // ==========================================================
  const evaluation = useMemo(() => {
    const cgpaNum = parseFloat(cgpa) || 0;
    const reasons: Array<{
      criterion: string;
      status: 'pass' | 'fail' | 'warning';
      candidateValue: string;
      requiredValue: string;
      explanation: string;
    }> = [];

    let failCount = 0;
    let warningCount = 0;

    // 1. Degree & Branch Criterion
    const degreeLower = degree.toLowerCase();
    const branchLower = branch.toLowerCase();
    const requiredEduLower = targetJob.education.toLowerCase();

    const degreeMatches =
      requiredEduLower.includes(degreeLower) ||
      (degreeLower.includes('b.tech') && requiredEduLower.includes('b.e')) ||
      (degreeLower.includes('mca') && requiredEduLower.includes('mca')) ||
      requiredEduLower.includes('stem') ||
      requiredEduLower.includes('all engineering');

    const circuitBranches = ['computer science', 'cs', 'it', 'information technology', 'ece', 'electronics', 'software', 'data science', 'ai'];
    const isCircuitBranch = circuitBranches.some((b) => branchLower.includes(b));

    if (degreeMatches && isCircuitBranch) {
      reasons.push({
        criterion: 'Educational Degree & Branch',
        status: 'pass',
        candidateValue: `${degree} in ${branch}`,
        requiredValue: targetJob.education,
        explanation: `Your degree and specialization are recognized by ${targetJob.company}.`
      });
    } else if (degreeMatches && !isCircuitBranch) {
      warningCount++;
      reasons.push({
        criterion: 'Educational Degree & Branch',
        status: 'warning',
        candidateValue: `${degree} in ${branch}`,
        requiredValue: targetJob.education,
        explanation: `Degree qualifies, but your non-circuit branch may require written aptitude assessment clearing.`
      });
    } else {
      failCount++;
      reasons.push({
        criterion: 'Educational Degree & Branch',
        status: 'fail',
        candidateValue: `${degree} in ${branch}`,
        requiredValue: targetJob.education,
        explanation: `Degree does not meet the published minimum academic stream requirement.`
      });
    }

    // 2. Graduation Year / Batch Criterion
    const batchMatches = targetJob.eligibleBatches.includes(batch);
    if (batchMatches) {
      reasons.push({
        criterion: 'Graduation Year / Batch',
        status: 'pass',
        candidateValue: `Class of ${batch}`,
        requiredValue: `${targetJob.eligibleBatches.join(', ')} Graduates`,
        explanation: `Your graduation batch is currently active in ${targetJob.company}'s intake pipeline.`
      });
    } else {
      failCount++;
      reasons.push({
        criterion: 'Graduation Year / Batch',
        status: 'fail',
        candidateValue: `Class of ${batch}`,
        requiredValue: `${targetJob.eligibleBatches.join(', ')} Graduates`,
        explanation: `This opening is strictly restricted to ${targetJob.eligibleBatches.join(', ')} batches.`
      });
    }

    // 3. Academic CGPA / Percentage Cutoff
    let minCgpaCutoff = 6.0;
    if (targetJob.minCgpa) {
      const match = targetJob.minCgpa.match(/\d+(\.\d+)?/);
      if (match) minCgpaCutoff = parseFloat(match[0]);
    }

    if (cgpaNum >= minCgpaCutoff) {
      reasons.push({
        criterion: 'Academic CGPA / Percentage',
        status: 'pass',
        candidateValue: `${cgpa} CGPA`,
        requiredValue: `Minimum ${minCgpaCutoff} CGPA or 60%`,
        explanation: `Your aggregate of ${cgpa} comfortably exceeds the required cutoff of ${minCgpaCutoff}.`
      });
    } else if (cgpaNum >= minCgpaCutoff - 0.4) {
      warningCount++;
      reasons.push({
        criterion: 'Academic CGPA / Percentage',
        status: 'warning',
        candidateValue: `${cgpa} CGPA`,
        requiredValue: `Minimum ${minCgpaCutoff} CGPA`,
        explanation: `Borderline score: within 0.4 points of cutoff. Requires verification if percentage conversion rules apply.`
      });
    } else {
      failCount++;
      reasons.push({
        criterion: 'Academic CGPA / Percentage',
        status: 'fail',
        candidateValue: `${cgpa} CGPA`,
        requiredValue: `Minimum ${minCgpaCutoff} CGPA or 60%`,
        explanation: `Does not meet the published cutoff (${cgpa} vs ${minCgpaCutoff} required).`
      });
    }

    // 4. Backlog / Arrears Policy
    if (backlogs === '0') {
      reasons.push({
        criterion: 'Active Backlog Policy',
        status: 'pass',
        candidateValue: '0 Active Backlogs',
        requiredValue: 'No Active Backlogs Permitted',
        explanation: 'Clean academic record satisfies strict campus recruitment guidelines.'
      });
    } else if (backlogs === '1') {
      warningCount++;
      reasons.push({
        criterion: 'Active Backlog Policy',
        status: 'warning',
        candidateValue: '1 Active Backlog',
        requiredValue: '0 to 1 permitted depending on tier',
        explanation: 'Some MNCs permit 1 active backlog subject to clearance before joining date.'
      });
    } else {
      failCount++;
      reasons.push({
        criterion: 'Active Backlog Policy',
        status: 'fail',
        candidateValue: `${backlogs} Active Backlogs`,
        requiredValue: 'No active backlogs permitted',
        explanation: 'Multiple active arrears violate corporate joining prerequisites.'
      });
    }

    // 5. Technical Skills Competency
    const candidateSkillsLower = candidateSkills.map((s) => s.toLowerCase());
    const matchedSkills = targetJob.skills.filter((skill) =>
      candidateSkillsLower.some((cs) => cs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cs))
    );
    const missingSkills = targetJob.skills.filter(
      (skill) => !matchedSkills.includes(skill)
    );

    const matchRatio = matchedSkills.length / targetJob.skills.length;
    if (matchRatio >= 0.5) {
      reasons.push({
        criterion: 'Core Skills Alignment',
        status: 'pass',
        candidateValue: `${matchedSkills.length} of ${targetJob.skills.length} skills matched`,
        requiredValue: targetJob.skills.slice(0, 4).join(', '),
        explanation: `Solid foundational match in: ${matchedSkills.join(', ')}.`
      });
    } else {
      warningCount++;
      reasons.push({
        criterion: 'Core Skills Alignment',
        status: 'warning',
        candidateValue: `${matchedSkills.length} of ${targetJob.skills.length} skills matched`,
        requiredValue: targetJob.skills.slice(0, 4).join(', '),
        explanation: `Recommended to learn missing skills before interview: ${missingSkills.slice(0, 3).join(', ')}.`
      });
    }

    // Overall verdict determination
    let overallVerdict: 'Eligible' | 'Not Eligible' | 'Needs Verification';
    if (failCount > 0) {
      overallVerdict = 'Not Eligible';
    } else if (warningCount > 0) {
      overallVerdict = 'Needs Verification';
    } else {
      overallVerdict = 'Eligible';
    }

    return {
      overallVerdict,
      failCount,
      warningCount,
      passCount: reasons.filter((r) => r.status === 'pass').length,
      reasons,
      matchedSkills,
      missingSkills
    };
  }, [degree, branch, batch, cgpa, backlogs, candidateSkills, targetJob]);

  // Alternative jobs where candidate is 100% eligible
  const alternativeEligibleJobs = useMemo(() => {
    return MOCK_JOBS.filter(
      (j) => j.id !== targetJob.id && j.eligibleBatches.includes(batch)
    ).slice(0, 3);
  }, [targetJob, batch]);

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
            <span className="text-slate-900 font-semibold">Eligibility Checker</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-200/60">
                <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Instant Academic & Batch Validation</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Company Eligibility Checker
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Compare your degree, branch, graduation year, CGPA, and backlog record against strict published cutoffs for leading IT giants, Big Tech, and MNCs.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleSyncFromProfile}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Sync Saved Profile</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          2. MAIN 2-COLUMN LAYOUT
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ====================================================
              LEFT COLUMN (5 cols): Target Job & Candidate Form
              ==================================================== */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* TARGET JOB SELECTOR CARD */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                1. Select Target Job Vacancy
              </label>

              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer mb-4"
              >
                {MOCK_JOBS.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.company} — {j.title}
                  </option>
                ))}
              </select>

              {/* Selected Job Overview Pill Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{targetJob.company}</span>
                  <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                    {targetJob.jobType}
                  </span>
                </div>
                <div className="text-slate-600 font-medium">{targetJob.title}</div>
                <div className="pt-2 border-t border-slate-200/70 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Eligible Batches:</span>
                    <span className="font-semibold text-slate-800">{targetJob.eligibleBatches.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Min Cutoff:</span>
                    <span className="font-semibold text-slate-800">{targetJob.minCgpa || '60% / 6.0 CGPA'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CANDIDATE PROFILE FORM */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  2. Candidate Credentials
                </h3>
                <span className="text-[11px] text-slate-400">Interactive Evaluation</span>
              </div>

              {/* Degree */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Degree / Qualification
                </label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="B.Tech">B.Tech / B.E.</option>
                  <option value="MCA">MCA</option>
                  <option value="M.Tech">M.Tech / M.E.</option>
                  <option value="BCA">BCA / B.Sc (CS/IT)</option>
                  <option value="M.Sc">M.Sc (CS/IT/Data)</option>
                  <option value="Other STEM">Other STEM Discipline</option>
                </select>
              </div>

              {/* Branch */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Branch / Stream
                </label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Graduation Batch and CGPA */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Graduation Batch
                  </label>
                  <select
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="2024">2024 (Graduated)</option>
                    <option value="2025">2025 (Final Year)</option>
                    <option value="2026">2026 (Pre-Final)</option>
                    <option value="2027">2027 (Sophomore)</option>
                    <option value="2023">2023 or earlier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    CGPA / Aggregate
                  </label>
                  <input
                    type="text"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    placeholder="e.g. 8.4"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Backlogs & Experience */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Active Backlogs
                  </label>
                  <select
                    value={backlogs}
                    onChange={(e) => setBacklogs(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="0">0 (Clean record)</option>
                    <option value="1">1 Active Backlog</option>
                    <option value="2+">2+ Active Backlogs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Experience
                  </label>
                  <select
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="0">0 years (Fresher)</option>
                    <option value="1">1 year</option>
                    <option value="2">2 years</option>
                    <option value="3+">3+ years</option>
                  </select>
                </div>
              </div>

              {/* Skills Tag Cloud */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Candidate Technical Skills ({candidateSkills.length})
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {candidateSkills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-800 text-[11px] font-semibold rounded-md"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add skill (e.g. Java, React)..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={handleSaveToProfile}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Save inputs to My Profile
                </button>
              </div>
            </div>

          </div>

          {/* ====================================================
              RIGHT COLUMN (7 cols): Evaluation Verdict & Breakdown
              ==================================================== */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* VERDICT HERO CARD */}
            <div
              className={`rounded-3xl p-6 sm:p-8 border shadow-sm transition-all ${
                evaluation.overallVerdict === 'Eligible'
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : evaluation.overallVerdict === 'Needs Verification'
                  ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                  : 'bg-rose-50/70 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm ${
                      evaluation.overallVerdict === 'Eligible'
                        ? 'bg-emerald-600'
                        : evaluation.overallVerdict === 'Needs Verification'
                        ? 'bg-amber-600'
                        : 'bg-rose-600'
                    }`}
                  >
                    {evaluation.overallVerdict === 'Eligible' ? (
                      <CheckCircle2 className="w-7 h-7" />
                    ) : evaluation.overallVerdict === 'Needs Verification' ? (
                      <AlertTriangle className="w-7 h-7" />
                    ) : (
                      <XCircle className="w-7 h-7" />
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block opacity-80">
                      Overall Assessment Verdict
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {evaluation.overallVerdict}
                    </h2>
                  </div>
                </div>

                {/* Score badge */}
                <div className="text-right">
                  <div className="text-xs font-semibold opacity-75">Criteria Score</div>
                  <div className="text-xl font-extrabold tabular-nums">
                    {evaluation.passCount} / {evaluation.reasons.length} Passed
                  </div>
                </div>
              </div>

              {/* Verdict Summary Message */}
              <p className="text-xs sm:text-sm leading-relaxed mb-6">
                {evaluation.overallVerdict === 'Eligible' && (
                  <span>
                    Congratulations! Your academic qualifications, graduation batch ({batch}), and CGPA ({cgpa}) satisfy all published recruitment prerequisites for <strong>{targetJob.title}</strong> at <strong>{targetJob.company}</strong>.
                  </span>
                )}
                {evaluation.overallVerdict === 'Needs Verification' && (
                  <span>
                    Your profile closely aligns, but {evaluation.warningCount} criterion requires recruiter verification or stream review. You may still be eligible to appear for screening.
                  </span>
                )}
                {evaluation.overallVerdict === 'Not Eligible' && (
                  <span>
                    Your credentials currently do not satisfy {evaluation.failCount} essential criteria published for this role. Check the detailed failure reasons below or explore alternative vacancies.
                  </span>
                )}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-black/10">
                {evaluation.overallVerdict === 'Eligible' && (
                  <button
                    type="button"
                    onClick={() => {
                      applyToJob(targetJob.id);
                      window.open(targetJob.applyUrl, '_blank', 'noopener,noreferrer');
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
                  >
                    <span>Proceed to Official Application Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => navigate(`/jobs/${targetJob.id}`)}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                >
                  View Full Job Details
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/resume-analyzer')}
                  className="px-4 py-2.5 bg-white/70 hover:bg-white text-slate-800 rounded-xl text-xs font-semibold border border-black/10 transition-colors cursor-pointer"
                >
                  Scan Resume Compatibility
                </button>
              </div>
            </div>

            {/* DETAILED REASONS & CRITERIA BREAKDOWN */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 pb-3 mb-5 border-b border-slate-100 uppercase tracking-wider text-xs flex items-center justify-between">
                <span>Detailed Criteria Comparison & Explanations</span>
                <span className="text-[11px] text-slate-400 font-normal">Candidate vs Employer Threshold</span>
              </h3>

              <div className="space-y-4">
                {evaluation.reasons.map((r, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border transition-colors ${
                      r.status === 'pass'
                        ? 'bg-slate-50/70 border-slate-200/80'
                        : r.status === 'warning'
                        ? 'bg-amber-50/40 border-amber-200/80'
                        : 'bg-rose-50/40 border-rose-200/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {r.status === 'pass' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {r.status === 'warning' && (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        {r.status === 'fail' && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <h4 className="text-xs font-bold text-slate-900">
                          {r.criterion}
                        </h4>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          r.status === 'pass'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'warning'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {r.status === 'pass' ? 'Requirement Met' : r.status === 'warning' ? 'Needs Review' : 'Cutoff Not Met'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-2 pt-1 border-t border-slate-200/50">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Your Input:</span>
                        <span className="font-semibold text-slate-800">{r.candidateValue}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Employer Cutoff:</span>
                        <span className="font-semibold text-slate-800">{r.requiredValue}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {r.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ALTERNATIVE VACANCIES IF NOT ELIGIBLE OR FOR QUICK ACCESS */}
            {alternativeEligibleJobs.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Alternative Openings Matching Batch {batch}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Explore other verified vacancies that explicitly hire graduates from your year
                    </p>
                  </div>
                  <Link to="/jobs" className="text-xs font-bold text-blue-600 hover:underline">
                    View All →
                  </Link>
                </div>

                <div className="space-y-3">
                  {alternativeEligibleJobs.map((altJob) => (
                    <div
                      key={altJob.id}
                      onClick={() => setSelectedJobId(altJob.id)}
                      className="p-3.5 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900 hover:text-blue-600">
                          {altJob.company} — {altJob.title}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {altJob.location} · {altJob.salary} · Min {altJob.minCgpa || '6.0 CGPA'}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJobId(altJob.id);
                        }}
                        className="px-3 py-1 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors shrink-0"
                      >
                        Check Eligibility
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

    </div>
  );
};
