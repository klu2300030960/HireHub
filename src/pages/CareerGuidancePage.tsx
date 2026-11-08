import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Code2,
  BarChart3,
  Cloud,
  ShieldCheck,
  CheckSquare,
  Sparkles,
  ArrowRight,
  Briefcase,
  Award,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  FileCheck2,
  TrendingUp,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Target,
  GraduationCap,
  Users
} from 'lucide-react';
import {
  CAREER_PATHS,
  INTERVIEW_ROUNDS_GUIDE,
  RESUME_PREPARATION_TIPS,
  CareerPath
} from '../data/careerGuidanceData';
import { useApp } from '../context/AppContext';

export const CareerGuidancePage: React.FC = () => {
  const navigate = useNavigate();
  const { allJobs } = useApp();

  // Selected Career Path ID
  const [selectedPathId, setSelectedPathId] = useState<string>(CAREER_PATHS[0].id);

  // Active section tab within the selected path
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'roadmap' | 'questions'>('overview');

  // Accordion state for sample interview questions
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState<number | null>(null);

  // Interactive Checklist State (stored in local state, with sensible initial checks)
  const [checkedList, setCheckedList] = useState<Record<string, boolean>>({
    'item-dsa': true,
    'item-oop': true,
    'item-sql': true,
    'item-project': false,
    'item-github': true,
    'item-resume': false,
    'item-star': false
  });

  const checklistItems = [
    { id: 'item-dsa', label: 'Solve 50+ Curated Data Structures & Algorithms problems (Arrays, Two Pointers, Trees)' },
    { id: 'item-oop', label: 'Review Object-Oriented Programming (OOP) Pillars with real-world code examples' },
    { id: 'item-sql', label: 'Practice Complex SQL Queries (JOINs, Window Functions, Group By aggregations)' },
    { id: 'item-project', label: 'Build and deploy at least 1 full-stack capstone project with live demo URL' },
    { id: 'item-github', label: 'Maintain an active GitHub profile with clean README documentations' },
    { id: 'item-resume', label: 'Format a single-column, ATS-friendly resume tailored to technical keywords' },
    { id: 'item-star', label: 'Prepare 3 STAR method behavioral stories (Leadership, Conflict Resolution, Delivery)' }
  ];

  const checklistProgress = useMemo(() => {
    const total = checklistItems.length;
    const completed = Object.values(checkedList).filter(Boolean).length;
    const percentage = Math.round((completed / total) * 100);
    return { completed, total, percentage };
  }, [checkedList, checklistItems]);

  const toggleChecklistItem = (id: string) => {
    setCheckedList((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Active Career Path object
  const activePath = useMemo(() => {
    return CAREER_PATHS.find((p) => p.id === selectedPathId) || CAREER_PATHS[0];
  }, [selectedPathId]);

  // Vacancies matching this track
  const matchingOpeningsCount = useMemo(() => {
    return allJobs.filter((j) => j.category === activePath.jobCategoryFilter).length;
  }, [allJobs, activePath.jobCategoryFilter]);

  // Icon selector helper
  const renderPathIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className={className} />;
      case 'BarChart3':
        return <BarChart3 className={className} />;
      case 'Cloud':
        return <Cloud className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'CheckSquare':
        return <CheckSquare className={className} />;
      default:
        return <Compass className={className} />;
    }
  };

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
            <span className="text-slate-900 font-semibold">Career Guidance</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-200/60">
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                <span>Engineering Roadmaps & Interview Playbook</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Career Guidance for Tech Freshers
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Explore in-depth technical roadmaps across 5 high-demand technology disciplines. Master required competencies, examine salary standards, and prepare for multi-round placement interviews.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/skill-gap"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <Target className="w-4 h-4 text-purple-600" />
                <span>Skill Gap Tool</span>
              </Link>
              <Link
                to="/resume-analyzer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>Analyze Resume</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          2. CAREER TRACK SELECTOR BUTTONS
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CAREER_PATHS.map((path) => {
            const isSelected = path.id === selectedPathId;

            return (
              <button
                key={path.id}
                type="button"
                onClick={() => {
                  setSelectedPathId(path.id);
                  setActiveTab('overview');
                  setExpandedQuestionIdx(null);
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white/80 border-slate-200/90 hover:bg-white hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {renderPathIcon(path.iconName, 'w-5 h-5')}
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>

                <div>
                  <h3 className={`text-xs sm:text-sm font-bold line-clamp-1 ${
                    isSelected ? 'text-blue-600' : 'text-slate-900'
                  }`}>
                    {path.category}
                  </h3>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    {path.salaryFresher}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          3. ACTIVE TRACK DETAILS & ROADMAP CARD
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          
          {/* Track Header Banner */}
          <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${activePath.badgeColor}`}>
                  {activePath.category}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-semibold text-slate-600">
                  Fresher Salary: <strong className="text-slate-900">{activePath.salaryFresher}</strong>
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-semibold text-slate-600">
                  Experienced: <strong className="text-slate-900">{activePath.salaryExperienced}</strong>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {activePath.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activePath.fullDesc}
              </p>
            </div>

            {/* Quick Explore Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(activePath.jobCategoryFilter)}`)}
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span>View {matchingOpeningsCount} Active Openings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="px-6 sm:px-8 border-b border-slate-100 flex items-center gap-6 overflow-x-auto text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`py-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              1. Track Overview & Roles
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('skills')}
              className={`py-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'skills'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              2. Skill Stack & Certifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('roadmap')}
              className={`py-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'roadmap'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              3. 6-Month Learning Roadmap
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('questions')}
              className={`py-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'questions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              4. Technical Interview Questions ({activePath.sampleInterviewQuestions.length})
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="p-6 sm:p-8">
            
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Target Roles */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span>Key Target Entry Roles</span>
                  </h4>
                  <ul className="space-y-2">
                    {activePath.keyRoles.map((role) => (
                      <li key={role} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="font-semibold">{role}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Top Employers */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Top Hiring Employers</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activePath.topEmployers.map((emp) => (
                      <span
                        key={emp}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-200 shadow-2xs"
                      >
                        {emp}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-3">
                    Active vacancies regularly posted on HireHub from these technology enterprises.
                  </p>
                </div>

                {/* Salary Bands */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>Compensation Standards (INR)</span>
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Fresher (0-1 yrs experience)</span>
                      <span className="text-base font-extrabold text-emerald-700">{activePath.salaryFresher}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-[11px] text-slate-500 block">Mid-Senior (3-5+ yrs experience)</span>
                      <span className="text-base font-extrabold text-slate-900">{activePath.salaryExperienced}</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: SKILLS & CERTIFICATIONS */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                
                {/* 4 Skill Categories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                    <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-2">
                      Core Computer Science
                    </span>
                    <div className="space-y-1.5">
                      {activePath.skills.core.map((s) => (
                        <div key={s} className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                    <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block mb-2">
                      Key Languages
                    </span>
                    <div className="space-y-1.5">
                      {activePath.skills.languages.map((s) => (
                        <div key={s} className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
                    <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block mb-2">
                      Frameworks & Libs
                    </span>
                    <div className="space-y-1.5">
                      {activePath.skills.frameworks.map((s) => (
                        <div key={s} className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                    <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block mb-2">
                      Tools & Platforms
                    </span>
                    <div className="space-y-1.5">
                      {activePath.skills.tools.map((s) => (
                        <div key={s} className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommended Certifications */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>Recommended Industry Certifications</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {activePath.certifications.map((cert) => (
                      <div
                        key={cert.name}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                            <span>{cert.provider}</span>
                            <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                              {cert.level}
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-900">{cert.name}</h5>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: 6-MONTH LEARNING ROADMAP */}
            {activeTab === 'roadmap' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {activePath.learningRoadmap.map((stage, idx) => (
                    <div
                      key={stage.stage}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 relative flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-blue-600 mb-2">
                          <span>Stage {idx + 1}</span>
                          <span className="text-[10px] text-slate-400">{stage.duration}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mb-3">{stage.stage}</h4>
                        
                        <ul className="space-y-2">
                          {stage.topics.map((t, tIdx) => (
                            <li key={tIdx} className="text-xs text-slate-600 flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                                {tIdx + 1}
                              </span>
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-200/60 text-[11px] text-slate-400">
                        Target: 10-12 hours dedicated weekly practice
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SAMPLE INTERVIEW QUESTIONS */}
            {activeTab === 'questions' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 mb-2">
                  Frequently asked technical interview questions for {activePath.category} roles at companies like TCS, Infosys, and Microsoft.
                </p>

                {activePath.sampleInterviewQuestions.map((q, idx) => {
                  const isExpanded = expandedQuestionIdx === idx;

                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200/80 bg-slate-50 overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedQuestionIdx(isExpanded ? null : idx)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/60 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                            Q{idx + 1}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900">
                            {q.question}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-slate-600 border border-slate-200">
                            {q.topic}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 text-xs text-slate-600 border-t border-slate-200/60 bg-white">
                          <p className="leading-relaxed">
                            <strong>Interview Strategy:</strong> Start with clear definitions and principles. When answering questions regarding <em>{q.topic}</em>, articulate the trade-offs (e.g. time vs space complexity, locking vs concurrency) and cite a concrete scenario where you implemented or resolved this.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ========================================================
          4. MASTER INTERVIEW PROCESS PLAYBOOK (4 ROUNDS)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-200/60">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Placement Rounds Playbook</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How IT & Tech Companies Evaluate Freshers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            From online national tests (NQT, HackerRank) to live coding and behavioral discussions, understand what interviewers look for in each round.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {INTERVIEW_ROUNDS_GUIDE.map((round) => (
            <div
              key={round.roundNumber}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-blue-600 mb-2">
                  <span>{round.roundNumber}</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{round.duration}</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-2">{round.title}</h3>
                
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {round.description}
                </p>

                {/* Key Tips */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Preparation Strategy:
                  </span>
                  {round.tips.map((tip, tIdx) => (
                    <div key={tIdx} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                      <span className="text-blue-500 font-bold">•</span>
                      <span className="leading-snug">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Topics */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <div className="flex flex-wrap gap-1">
                  {round.sampleTopics.map((top) => (
                    <span
                      key={top}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200"
                    >
                      {top}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          5. INTERACTIVE CANDIDATE READINESS CHECKLIST
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  Interactive Fresher Placement Readiness Checklist
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Check off key milestones before appearing for campus placement drives or off-campus assessments.
              </p>
            </div>

            {/* Checklist Progress */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                  {checklistProgress.percentage}%
                </span>
                <span className="text-[11px] text-slate-400 font-semibold block">
                  {checklistProgress.completed} of {checklistProgress.total} Complete
                </span>
              </div>

              <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${checklistProgress.percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="pt-6 space-y-3">
            {checklistItems.map((item) => {
              const isChecked = !!checkedList[item.id];

              return (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isChecked
                      ? 'bg-emerald-50/40 border-emerald-200 text-emerald-950'
                      : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                      isChecked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className={`text-xs sm:text-sm font-medium ${isChecked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {item.label}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isChecked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isChecked ? 'Ready ✓' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================
          6. RESUME PREPARATION BLUEPRINT
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-10 shadow-sm">
          
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-2">
              ATS Optimization Playbook
            </span>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              4 Golden Rules for Tech Resume Screening
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Recruiters spend an average of 6 seconds reviewing initial submissions. Ensure your resume passes both automated parsing algorithms and senior engineering reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {RESUME_PREPARATION_TIPS.map((tip, idx) => (
              <div
                key={tip.title}
                className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs mb-3">
                    0{idx + 1}
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{tip.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Ribbon */}
          <div className="pt-8 mt-8 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-300">
              Want to test your current resume against live vacancies?
            </span>
            
            <Link
              to="/resume-analyzer"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-2"
            >
              <span>Launch Resume Analyzer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};
