import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, MapPin, Briefcase, Calendar, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Job } from '../types/job';
import { useApp } from '../context/AppContext';

interface JobCardProps {
  job: Job;
  onViewDetails?: (job: Job) => void;
  layout?: 'grid' | 'list';
}

export const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails, layout = 'grid' }) => {
  const navigate = useNavigate();
  const { isJobSaved, toggleSaveJob, applyToJob } = useApp();
  const saved = isJobSaved(job.id);

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    applyToJob(job.id);
    window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveJob(job.id);
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/jobs/${job.id}`);
  };

  if (layout === 'list') {
    return (
      <div
        onClick={() => onViewDetails && onViewDetails(job)}
        className="group relative bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${job.companyColor || 'from-slate-700 to-slate-900'} text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0`}>
            {job.companyLogo || job.company.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {job.company}
              </span>
              <span className="text-slate-300">·</span>
              <span className={`text-[11px] font-semibold ${job.jobType === 'Internship' ? 'text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md' : 'text-slate-600'}`}>
                {job.jobType}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
              {job.title}
            </h3>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600 mt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.location} ({job.workMode})
              </span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {job.experienceYears}
              </span>
              <span className="text-slate-300">·</span>
              <span className="font-semibold text-slate-900">{job.salary}</span>
              {job.isFresherFriendly && (
                <>
                  <span className="text-slate-300">·</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Fresher Eligible
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              {job.skills.slice(0, 5).map((skill) => (
                <span key={skill} className="px-2 py-0.5 text-[11px] font-medium text-slate-700 bg-slate-100 rounded-md">
                  {skill}
                </span>
              ))}
              {job.skills.length > 5 && (
                <span className="text-[11px] font-medium text-slate-400 px-1">
                  +{job.skills.length - 5}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Deadline: {job.applicationDeadline}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveClick}
              aria-label={saved ? 'Remove from saved' : 'Save job'}
              className={`p-2.5 rounded-xl transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center ${
                saved
                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-blue-600' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleDetailsClick}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer min-h-[40px] flex items-center justify-center"
            >
              Details
            </button>

            <button
              type="button"
              onClick={handleApplyClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-blue-600 rounded-xl transition-colors cursor-pointer shadow-xs whitespace-nowrap min-h-[40px] justify-center"
            >
              <span>Apply</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onViewDetails && onViewDetails(job)}
      className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top row: Company Identity & Save Bookmark */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            {/* Company Monogram Badge */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${job.companyColor || 'from-slate-700 to-slate-900'} text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0`}>
              {job.companyLogo || job.company.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {job.company}
              </h4>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {job.title}
              </h3>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={handleSaveClick}
            aria-label={saved ? 'Remove from saved' : 'Save job'}
            className={`p-2 rounded-lg transition-colors cursor-pointer shrink-0 ${
              saved
                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${saved ? 'fill-blue-600' : ''}`} />
          </button>
        </div>

        {/* Clean Unboxed Metadata Strip */}
        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-slate-600 mb-3.5">
          <span className={`font-semibold ${job.jobType === 'Internship' ? 'text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md' : 'text-slate-800'}`}>
            {job.jobType}
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {job.location}
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            {job.experienceYears}
          </span>
          <span className="text-slate-300">·</span>
          <span className="font-semibold text-slate-900">
            {job.salary}
          </span>
          {job.isFresherFriendly && (
            <>
              <span className="text-slate-300">·</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Fresher Eligible
              </span>
            </>
          )}
        </div>

        {/* Brief Description */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>

        {/* Required Skills list */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {job.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 text-[11px] font-medium text-slate-700 bg-slate-100 rounded-md"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="text-[11px] font-medium text-slate-400 px-1">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Deadline & Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Calendar className="w-3 h-3" />
          <span>Deadline: {job.applicationDeadline}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDetailsClick}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer min-h-[40px] flex items-center justify-center"
          >
            Details
          </button>

          <button
            type="button"
            onClick={handleApplyClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-blue-600 rounded-xl transition-colors cursor-pointer shadow-xs min-h-[40px] justify-center"
          >
            <span>Apply</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
