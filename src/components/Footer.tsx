import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmailInput('');
      }, 2000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand & About Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Hire<span className="text-blue-400">Hub</span>
              </span>
            </div>
            
            <p className="text-sm font-medium text-blue-400">
              One Platform. Every Opportunity. Your Next Career.
            </p>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The centralized discovery platform empowering students, fresh graduates, and tech job seekers to identify vacancies across leading MNCs, check exact eligibility criteria, and apply via official career portals.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Official career portal links only. Zero commission or placement fees.</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore Portal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">Find Vacancies</Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-white transition-colors">Featured Companies</Link>
              </li>
              <li>
                <Link to="/resume-analyzer" className="hover:text-white transition-colors">Resume Analyzer</Link>
              </li>
              <li>
                <Link to="/eligibility" className="hover:text-white transition-colors">Eligibility Checker</Link>
              </li>
              <li>
                <Link to="/career-guidance" className="hover:text-white transition-colors">Career Roadmaps</Link>
              </li>
              <li>
                <Link to="/saved-jobs" className="hover:text-white transition-colors">Saved Vacancies</Link>
              </li>
            </ul>
          </div>

          {/* Top Tech Tracks Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Career Tracks
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Software Engineering</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Data Science & AI</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Cloud & DevOps</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Cybersecurity Operations</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">QA & Test Automation</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Campus Fresher Drives</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Notifications Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Fresher Job Alerts
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Get notified of verified off-campus hiring drives and new graduate postings.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@college.edu"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer min-h-[44px]"
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <span>Get Free Job Alerts</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} HireHub. Built for career discovery and skill matching.
          </p>
          <div className="flex items-center gap-6 text-slate-400">
            <span>Notice: Sample vacancies are demonstration data with official company application links.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
