import React from 'react';
import { Search, Building2, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface SearchBarProps {
  onSearchSubmit?: () => void;
  variant?: 'hero' | 'compact';
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearchSubmit, variant = 'hero' }) => {
  const navigate = useNavigate();
  const {
    searchTitle,
    setSearchTitle,
    searchCompany,
    setSearchCompany,
    searchLocation,
    setSearchLocation
  } = useApp();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit();
    } else {
      // If on home page and wants to view full search results, can route to /jobs or scroll
      navigate('/jobs');
    }
  };

  const handleQuickTag = (tag: string) => {
    setSearchTitle(tag);
    if (onSearchSubmit) {
      onSearchSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form
        onSubmit={handleSearch}
        className={`bg-white rounded-2xl p-2.5 sm:p-3 shadow-xl border border-slate-200/90 flex flex-col md:flex-row items-stretch gap-2 transition-all duration-200 focus-within:border-blue-500`}
      >
        {/* Job Title / Skill Input */}
        <div className="flex-1 flex items-center px-3.5 py-2.5 bg-slate-50/80 hover:bg-slate-50 focus-within:bg-white rounded-xl border border-transparent focus-within:border-blue-400 transition-colors">
          <Search className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
          <div className="flex-1 min-w-0">
            <label htmlFor="search-title" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Job Title or Skill
            </label>
            <input
              id="search-title"
              type="text"
              placeholder="e.g. Software Engineer, Java, React..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="w-full text-sm font-medium text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Company Input / Selector */}
        <div className="flex-1 flex items-center px-3.5 py-2.5 bg-slate-50/80 hover:bg-slate-50 focus-within:bg-white rounded-xl border border-transparent focus-within:border-blue-400 transition-colors">
          <Building2 className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
          <div className="flex-1 min-w-0">
            <label htmlFor="search-company" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Company
            </label>
            <input
              id="search-company"
              type="text"
              placeholder="e.g. TCS, Infosys, Microsoft..."
              value={searchCompany}
              onChange={(e) => setSearchCompany(e.target.value)}
              className="w-full text-sm font-medium text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Location Input */}
        <div className="flex-1 flex items-center px-3.5 py-2.5 bg-slate-50/80 hover:bg-slate-50 focus-within:bg-white rounded-xl border border-transparent focus-within:border-blue-400 transition-colors">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
          <div className="flex-1 min-w-0">
            <label htmlFor="search-location" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Location / Mode
            </label>
            <input
              id="search-location"
              type="text"
              placeholder="e.g. Bengaluru, Remote, Pune..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full text-sm font-medium text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Search Submit Button */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] whitespace-nowrap cursor-pointer shrink-0"
        >
          <span>Find Jobs</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Popular / Quick Filter Suggestions */}
      {variant === 'hero' && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
          <span className="font-medium text-slate-400">Popular searches:</span>
          {['TCS Digital', 'Infosys Specialist', 'Cloud Associate', 'Java Developer', 'Data Analyst', 'Remote'].map((keyword) => (
            <button
              key={keyword}
              type="button"
              onClick={() => handleQuickTag(keyword)}
              className="px-2.5 py-1 rounded-md bg-white/80 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80 transition-colors cursor-pointer"
            >
              {keyword}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
