import React from 'react';
import { ExternalLink, ArrowRight, Building2 } from 'lucide-react';
import { Company } from '../types/job';

interface CompanyCardProps {
  company: Company;
  onSelectCompany?: (companyName: string) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company, onSelectCompany }) => {
  return (
    <div className="group bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${company.color} text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0`}>
              {company.initials}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {company.name}
              </h3>
              <span className="text-xs text-slate-500">
                {company.headquarters}
              </span>
            </div>
          </div>

          <a
            href={company.careersUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Official Careers Page"
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {company.description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs font-semibold text-blue-700 bg-blue-50/80 px-2.5 py-1 rounded-md">
          {company.openingsCount} Open Roles
        </div>

        <button
          type="button"
          onClick={() => onSelectCompany && onSelectCompany(company.name)}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <span>View Openings</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
