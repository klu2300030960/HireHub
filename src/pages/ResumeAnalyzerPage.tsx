import React, { useState, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Printer,
  RotateCcw,
  Briefcase,
  FileCheck2,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  Info,
  Layers,
  FileUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_JOBS } from '../data/mockJobs';
import { Job } from '../types/job';

export const ResumeAnalyzerPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { candidateProfile, applyToJob, allJobs } = useApp();

  // Selected Job for comparison
  const initialJobId = searchParams.get('job') || allJobs[0].id;
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId);

  // Resume upload states
  const [uploadedFileName, setUploadedFileName] = useState<string | null>('Alex_Sharma_Software_Engineer_Resume.pdf');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('245 KB');
  const [resumeText, setResumeText] = useState<string>(
    `Alex Sharma
Computer Science & Engineering Student | Class of 2025 | CGPA: 8.4
Email: alex.sharma@example.com

SUMMARY
Passionate software engineering undergraduate with deep interest in backend engineering, distributed systems, and algorithmic problem-solving. Hands-on experience developing REST APIs in Java Spring Boot and Python.

TECHNICAL SKILLS
Languages: Java, Python, C++, SQL, JavaScript
Frameworks & Libraries: React, Spring Boot, Node.js, Express
Tools & Databases: Git, GitHub, MySQL, PostgreSQL, Docker Basics
Concepts: Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems

PROJECTS
1. E-Commerce Microservices Engine
- Architected RESTful backend using Java Spring Boot and PostgreSQL handling 5,000+ mock transactions.
- Implemented JWT-based role authentication and cached inventory queries with Redis.

2. Automated Job Matcher & Resume Parser
- Built Python-based NLP pipeline to extract technical competencies from PDF resumes.
- Automated ranking algorithms using Scikit-Learn with 88% precision.`
  );

  const [inputMode, setInputMode] = useState<'upload' | 'text'>('upload');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisCompleted, setAnalysisCompleted] = useState(true);

  const targetJob = useMemo(() => {
    return allJobs.find((j) => j.id === selectedJobId) || allJobs[0];
  }, [allJobs, selectedJobId]);

  // Handle file input upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setUploadedFileSize(`${(file.size / 1024).toFixed(1)} KB`);
      
      // If it's a text/doc file, read snippet or simulate parsing
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content && typeof content === 'string') {
          setResumeText(content.slice(0, 3000));
        }
      };
      if (file.type.includes('text')) {
        reader.readAsText(file);
      }
      runAnalysis();
    }
  };

  // Run or refresh analysis
  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisCompleted(true);
    }, 600);
  };

  // ==========================================================
  // RESUME MATCHING ENGINE
  // ==========================================================
  const matchResults = useMemo(() => {
    const textLower = resumeText.toLowerCase();

    // 1. Matched and Missing Skills
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    targetJob.skills.forEach((skill) => {
      const skillName = skill.toLowerCase();
      if (textLower.includes(skillName)) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    // 2. Keyword relevance checks
    const industryKeywords = [
      'algorithms',
      'data structures',
      'rest api',
      'git',
      'testing',
      'cloud',
      'distributed',
      'database',
      'sql',
      'agile'
    ];
    const matchedKeywords = industryKeywords.filter((kw) => textLower.includes(kw));

    // 3. Score calculation
    const skillsRatio = targetJob.skills.length > 0 ? (matchedSkills.length / targetJob.skills.length) : 1;
    const keywordsRatio = matchedKeywords.length / industryKeywords.length;
    
    // Weighted Estimated Score
    const rawScore = (skillsRatio * 55) + (keywordsRatio * 30) + 15;
    const finalScore = Math.min(96, Math.max(45, Math.round(rawScore)));

    // Score Tier
    let scoreTier: { label: string; color: string; desc: string };
    if (finalScore >= 80) {
      scoreTier = {
        label: 'Strong Compatibility',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        desc: 'Your resume shows high keyword and skill density for this role.'
      };
    } else if (finalScore >= 65) {
      scoreTier = {
        label: 'Moderate Alignment',
        color: 'text-blue-700 bg-blue-50 border-blue-200',
        desc: 'Good foundational match, with minor technical keyword gaps.'
      };
    } else {
      scoreTier = {
        label: 'Needs Keyword Optimization',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        desc: 'Essential competencies from the job description are missing.'
      };
    }

    // 4. Actionable suggestions
    const suggestions: string[] = [];
    if (missingSkills.length > 0) {
      suggestions.push(
        `Integrate missing technical skills (${missingSkills.slice(0, 3).join(', ')}) into your Skills or Academic Projects sections.`
      );
    }
    if (!textLower.includes('achieved') && !textLower.includes('%') && !textLower.includes('reduced')) {
      suggestions.push(
        'Add quantified project impact metrics (e.g., "Reduced response latency by 25%", "Processed 500+ daily requests").'
      );
    }
    if (!textLower.includes('git') && !textLower.includes('github')) {
      suggestions.push('Include a direct link to your active GitHub profile or hosted demo portfolio.');
    }
    if (!textLower.includes('docker') && !textLower.includes('cloud')) {
      suggestions.push('Highlight any exposure to containerization or basic cloud concepts (Docker, AWS, Linux).');
    }
    suggestions.push(
      `Format section headings cleanly (e.g. "Technical Skills", "Education", "Projects") to ensure smooth ATS machine readability.`
    );

    return {
      finalScore,
      scoreTier,
      matchedSkills,
      missingSkills,
      matchedKeywords,
      suggestions
    };
  }, [resumeText, targetJob]);

  // Print or Save as PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      
      {/* ========================================================
          1. HEADER SECTION
          ======================================================== */}
      <section className="bg-white border-b border-slate-200/90 pt-8 pb-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Resume Analyzer</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-200/60">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Resume-to-Job Compatibility Engine</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Resume Analyzer
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Upload your resume (PDF or DOCX) to benchmark technical keywords, identify missing competencies, and receive targeted improvement suggestions.
              </p>
            </div>

            {analysisCompleted && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Analysis Report</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ========================================================
          2. OFFICIAL ATS DISCLAIMER CALLOUT
          ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 print:hidden">
        <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 flex items-start gap-3 text-xs text-amber-950">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold">Disclaimer on Compatibility Score: </strong>
            This analysis provides HireHub's own estimated compatibility score derived from keyword density, skill overlap, and structural heuristics. It is <strong>NOT</strong> an official company ATS score or a formal guarantee of interview selection by the recruiting organization.
          </div>
        </div>
      </div>

      {/* ========================================================
          3. MAIN 2-COLUMN LAYOUT: UPLOAD & RESULTS
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ====================================================
              LEFT COLUMN (5 cols): Job Picker & Upload Interface
              ==================================================== */}
          <div className="lg:col-span-5 space-y-6 print:hidden">
            
            {/* STEP 1: SELECT TARGET JOB */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                Step 1: Select Target Vacancy
              </label>

              <select
                value={selectedJobId}
                onChange={(e) => {
                  setSelectedJobId(e.target.value);
                  runAnalysis();
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer mb-3"
              >
                {allJobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.company} — {j.title}
                  </option>
                ))}
              </select>

              {/* Target Job Quick Details */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{targetJob.company}</span>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {targetJob.jobType}
                  </span>
                </div>
                <div className="text-slate-600 font-medium">{targetJob.title}</div>
                
                <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-1">
                  <span className="text-[10px] text-slate-400 block w-full mb-1">Required Competencies:</span>
                  {targetJob.skills.map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-white text-slate-700 text-[10px] font-medium rounded border border-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 2: RESUME UPLOAD ZONE */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Step 2: Upload Resume
                </label>
                
                <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setInputMode('upload')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      inputMode === 'upload' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    File Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('text')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      inputMode === 'text' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Resume Text
                  </button>
                </div>
              </div>

              {inputMode === 'upload' ? (
                <div>
                  {/* Drag and Drop Zone with full touch area for mobile browsers */}
                  <div className="relative border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center bg-slate-50/60 hover:bg-blue-50/30 transition-all group min-h-[140px]">
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      aria-label="Upload resume file (PDF or DOCX)"
                    />
                    
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform pointer-events-none">
                      <UploadCloud className="w-6 h-6" />
                    </div>

                    <span className="text-xs sm:text-sm font-bold text-slate-900 mb-1 pointer-events-none">
                      Tap or Drop to Upload Resume
                    </span>
                    <span className="text-[11px] text-slate-500 pointer-events-none">
                      Supports PDF, DOCX, and TXT files from your phone or PC
                    </span>
                  </div>

                  {/* Active Uploaded File pill */}
                  {uploadedFileName && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <div className="min-w-0">
                          <span className="font-bold text-slate-800 block truncate">{uploadedFileName}</span>
                          <span className="text-[10px] text-slate-400">{uploadedFileSize} · Ready for analysis</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                        Loaded ✓
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* Raw text editor */
                <div>
                  <textarea
                    rows={8}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your plain resume text here..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500 leading-relaxed"
                  />
                  <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                    <span>{resumeText.length} characters parsed</span>
                    <button
                      type="button"
                      onClick={() => setResumeText('')}
                      className="text-rose-600 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {/* Run Analysis Button */}
              <button
                type="button"
                onClick={runAnalysis}
                disabled={analyzing}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
              >
                <span>{analyzing ? 'Scanning Resume & Keywords...' : 'Recalculate Match Score'}</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* ====================================================
              RIGHT COLUMN (7 cols): Analysis Report View
              ==================================================== */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* SCORE GAUGE & TIER CARD */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                
                {/* Score Big Display */}
                <div className="flex items-center gap-5">
                  <div className="relative w-24 h-24 rounded-full bg-slate-50 border-4 border-blue-600 flex flex-col items-center justify-center shrink-0 shadow-inner">
                    <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                      {matchResults.finalScore}%
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      Match
                    </span>
                  </div>

                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border mb-1.5 ${matchResults.scoreTier.color}`}>
                      {matchResults.scoreTier.label}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900">
                      Role Compatibility for {targetJob.company}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {matchResults.scoreTier.desc}
                    </p>
                  </div>
                </div>

                {/* Score Ratio Mini Bar */}
                <div className="sm:text-right text-xs text-slate-600 space-y-1">
                  <div>Skills Overlap: <strong className="text-slate-900">{matchResults.matchedSkills.length}/{targetJob.skills.length}</strong></div>
                  <div>Relevant Keywords: <strong className="text-slate-900">{matchResults.matchedKeywords.length}/10</strong></div>
                </div>

              </div>

              {/* Two Column Skills Breakdown: Matched vs Missing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                
                {/* Matched Skills */}
                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Matching Skills ({matchResults.matchedSkills.length})</span>
                  </div>

                  {matchResults.matchedSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {matchResults.matchedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 bg-white text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200 shadow-2xs"
                        >
                          {skill} ✓
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">None of the primary skills detected in resume text.</p>
                  )}
                </div>

                {/* Missing Skills */}
                <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900 uppercase tracking-wider mb-3">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Missing Skills ({matchResults.missingSkills.length})</span>
                  </div>

                  {matchResults.missingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {matchResults.missingSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 bg-white text-rose-800 text-xs font-semibold rounded-lg border border-rose-200 shadow-2xs"
                        >
                          {skill} ✗
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-700 font-medium">All essential skills matched!</p>
                  )}
                </div>

              </div>
            </div>

            {/* ACTIONABLE IMPROVEMENT SUGGESTIONS */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 pb-3 mb-4 border-b border-slate-100 uppercase tracking-wider text-xs flex items-center justify-between">
                <span>Resume Improvement Suggestions</span>
                <span className="text-[11px] text-slate-400 font-normal">Based on {targetJob.company} standards</span>
              </h3>

              <div className="space-y-3">
                {matchResults.suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 text-xs"
                  >
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                      {idx + 1}
                    </div>
                    <span className="text-slate-700 leading-relaxed">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SUMMARY REPORT BANNER & OFFICIAL APPLY */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
              <div>
                <h4 className="text-sm font-bold text-white">Satisfied with your resume optimization?</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Direct official link for {targetJob.title} at {targetJob.company}.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    applyToJob(targetJob.id);
                    window.open(targetJob.applyUrl, '_blank', 'noopener,noreferrer');
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  Apply on Official Portal
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
