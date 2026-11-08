import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';

interface PagePlaceholderProps {
  title: string;
  pageNumber: number;
  description: string;
}

export const PagePlaceholder: React.FC<PagePlaceholderProps> = ({ title, pageNumber, description }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-7 h-7" />
        </div>
        
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Page {pageNumber} in Development Roadmap
        </span>

        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
          {title}
        </h2>

        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          {description}
        </p>

        <div className="flex flex-col gap-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
