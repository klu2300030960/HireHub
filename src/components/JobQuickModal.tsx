import React from 'react';
import { X, Bookmark, MapPin, Briefcase, Calendar, GraduationCap, Award, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Job } from '../types/job';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

interface JobQuickModalProps {
  job: Job | null;
  onClose: () => void;
}

export const JobQuickModal: React.FC<JobQuickModalProps> = ({ job, onClose }) => {
  const { isJobSaved, toggleSaveJob, applyToJob } = useApp();
  const navigate = useNavigate();

  if (!job) return null;

  const saved = isJobSaved(job.id);

  const handleApply = () => {
    applyToJob(job.id);
    window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCheckEligibility = () => {
    onClose();
    navigate('/eligibility');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Block */}
        <div className="flex items-start gap-4 mb-6 pr-8">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${job.companyColor || 'from-slate-700 to-slate-900'} text-white font-bold text-lg flex items-center justify-center shadow-md shrink-0`}>
            {job.companyLogo || job.company.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {job.company}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {job.title}
            </h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.location} ({job.workMode})
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {job.experienceYears}
              </span>
              <span>·</span>
              <span className="font-bold text-slate-900">{job.salary}</span>
            </div>
          </div>
        </div>

        {/* Content Tabs / Information */}
        <div className="space-y-5 text-sm text-slate-700 max-h-[60vh] overflow-y-auto pr-1">
          {/* Eligibility Banner */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                Eligibility Criteria
              </span>
              <button
                type="button"
                onClick={handleCheckEligibility}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 underline underline-offset-2 cursor-pointer"
              >
                Check My Eligibility →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 font-medium">Eligible Degree: </span>
                <span className="text-slate-800 font-semibold">{job.education}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Batches: </span>
                <span className="text-slate-800 font-semibold">{job.eligibleBatches.join(', ')}</span>
              </div>
              {job.minCgpa && (
                <div className="sm:col-span-2">
                  <span className="text-slate-500 font-medium">Min CGPA / Aggregate: </span>
                  <span className="text-slate-800 font-semibold">{job.minCgpa}</span>
                </div>
              )}
            </div>
          </div>

          {/* Job Overview */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Role Overview
            </h4>
            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
              {job.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Key Responsibilities
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills Required */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Required Technical Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Important Timelines */}
          <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              Posted {job.postedDate}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 font-medium text-slate-800">
              <Award className="w-4 h-4 text-blue-600" />
              Deadline: {job.applicationDeadline}
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => toggleSaveJob(job.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              saved
                ? 'border-blue-200 bg-blue-50 text-blue-700'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-blue-600 text-blue-600' : ''}`} />
            <span>{saved ? 'Saved' : 'Save Vacancy'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(`/jobs/${job.id}`);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Full Details Page →
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <span>Apply via Official Portal</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
