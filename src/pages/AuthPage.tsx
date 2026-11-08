import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Briefcase,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CandidateProfile } from '../types/job';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, registerCandidate, candidateProfile, isAuthenticated } = useApp();

  // Determine mode from prop or path
  const [mode, setMode] = useState<'login' | 'signup'>(
    initialMode || (location.pathname.includes('signup') ? 'signup' : 'login')
  );

  useEffect(() => {
    if (location.pathname.includes('signup')) {
      setMode('signup');
    } else if (location.pathname.includes('login')) {
      setMode('login');
    }
  }, [location.pathname]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupDegree, setSignupDegree] = useState('B.Tech');
  const [signupBranch, setSignupBranch] = useState('Computer Science & Engineering');
  const [signupBatch, setSignupBatch] = useState('2025');
  const [signupCgpa, setSignupCgpa] = useState('8.2');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Email format regex
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Quick Demo fill
  const handleFillDemo = () => {
    setLoginEmail('alex.sharma@example.com');
    setLoginPassword('HireHub@2025');
    setErrors({});
  };

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!loginEmail.trim()) {
      newErrors.loginEmail = 'Email address is required.';
    } else if (!isValidEmail(loginEmail)) {
      newErrors.loginEmail = 'Please provide a valid email format.';
    }

    if (!loginPassword) {
      newErrors.loginPassword = 'Password is required.';
    } else if (loginPassword.length < 6) {
      newErrors.loginPassword = 'Password must be at least 6 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    setTimeout(() => {
      login({
        email: loginEmail,
        name: loginEmail.includes('alex') ? 'Alex Sharma' : loginEmail.split('@')[0]
      });
      setSubmitting(false);
      navigate('/dashboard');
    }, 400);
  };

  // Handle Registration submission
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!signupName.trim() || signupName.trim().length < 2) {
      newErrors.signupName = 'Full name must be at least 2 characters.';
    }

    if (!signupEmail.trim()) {
      newErrors.signupEmail = 'Email address is required.';
    } else if (!isValidEmail(signupEmail)) {
      newErrors.signupEmail = 'Please enter a valid email address.';
    }

    if (!signupDegree) {
      newErrors.signupDegree = 'Please select your educational qualification.';
    }

    if (!signupBranch.trim()) {
      newErrors.signupBranch = 'Please enter your branch / stream.';
    }

    const cgpaNum = parseFloat(signupCgpa);
    if (!signupCgpa || isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 100) {
      newErrors.signupCgpa = 'Enter a valid CGPA (0-10) or Percentage (0-100).';
    }

    if (!signupPassword) {
      newErrors.signupPassword = 'Password is required.';
    } else if (signupPassword.length < 8) {
      newErrors.signupPassword = 'Password must contain at least 8 characters.';
    }

    if (signupPassword !== signupConfirmPassword) {
      newErrors.signupConfirmPassword = 'Passwords do not match.';
    }

    if (!agreedTerms) {
      newErrors.agreedTerms = 'You must agree to the Terms of Service to create an account.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    const newProfile: CandidateProfile = {
      name: signupName.trim(),
      email: signupEmail.trim(),
      degree: signupDegree,
      branch: signupBranch.trim(),
      graduationYear: signupBatch,
      cgpa: signupCgpa.trim(),
      skills: ['Java', 'SQL', 'Git', 'Data Structures', 'Python'],
      experienceYears: '0'
    };

    setTimeout(() => {
      registerCandidate(newProfile);
      setSubmitting(false);
      navigate('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:bg-blue-600 transition-colors">
              <Briefcase className="w-6 h-6 text-blue-400 group-hover:text-white transition-colors" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              Hire<span className="text-blue-600">Hub</span>
            </span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'login' ? 'Welcome Back to HireHub' : 'Create Candidate Account'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {mode === 'login'
              ? 'Sign in to access your saved vacancies, resume analyses, and application milestones.'
              : 'Join to check eligibility cutoffs, calculate resume match scores, and apply to top IT firms.'}
          </p>
        </div>

        {/* DEMO NOTICE BANNER */}
        <div className="mb-6 p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200/80 text-xs text-blue-900 flex items-start gap-3 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold">Frontend Demonstration Notice: </strong>
            Authentication state and profile records are safely simulated using your browser's local storage. In a live production environment, authentication would be validated with backend services and JWT/OAuth tokens.
          </div>
        </div>

        {/* Main Card with Tabbed Switch */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-md">
          
          {/* Segmented Mode Toggle */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrors({});
              }}
              className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrors({});
              }}
              className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register Candidate
            </button>
          </div>

          {/* ====================================================
              MODE 1: LOGIN FORM
              ==================================================== */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Quick Fill Button */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                <span className="text-slate-500 font-medium">Quick demo testing?</span>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  Fill Demo Credentials →
                </button>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="alex.sharma@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50/80 border rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none transition-colors ${
                      errors.loginEmail ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.loginEmail && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{errors.loginEmail}</p>
                )}
              </div>

              {/* Password Field with Visibility Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-xs text-blue-600 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className={`w-full pl-10 pr-10 py-2.5 bg-slate-50/80 border rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none transition-colors ${
                      errors.loginPassword ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.loginPassword && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{errors.loginPassword}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300"
                  />
                  <span>Remember this browser</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-blue-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer active:scale-[0.99] mt-2"
              >
                <span>{submitting ? 'Authenticating...' : 'Sign In as Candidate'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ====================================================
              MODE 2: REGISTRATION FORM
              ==================================================== */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className={`w-full pl-10 pr-3.5 py-2 bg-slate-50/80 border rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none ${
                      errors.signupName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.signupName && (
                  <p className="mt-0.5 text-xs text-rose-600 font-medium">{errors.signupName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="priya.sharma@college.edu"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className={`w-full pl-10 pr-3.5 py-2 bg-slate-50/80 border rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none ${
                      errors.signupEmail ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.signupEmail && (
                  <p className="mt-0.5 text-xs text-rose-600 font-medium">{errors.signupEmail}</p>
                )}
              </div>

              {/* Educational Qualification & Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Degree / Qualification
                  </label>
                  <select
                    value={signupDegree}
                    onChange={(e) => setSignupDegree(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="B.Tech">B.Tech / B.E.</option>
                    <option value="MCA">MCA</option>
                    <option value="M.Tech">M.Tech / M.E.</option>
                    <option value="BCA">BCA / B.Sc (CS/IT)</option>
                    <option value="M.Sc">M.Sc (CS/IT/Data)</option>
                    <option value="Other STEM">Other STEM Discipline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Graduation Year
                  </label>
                  <select
                    value={signupBatch}
                    onChange={(e) => setSignupBatch(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="2024">2024 (Recent Graduate)</option>
                    <option value="2025">2025 (Final Year)</option>
                    <option value="2026">2026 (Pre-Final Year)</option>
                    <option value="2027">2027 (Sophomore)</option>
                  </select>
                </div>
              </div>

              {/* Branch and CGPA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Branch / Stream
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science"
                    value={signupBranch}
                    onChange={(e) => setSignupBranch(e.target.value)}
                    className={`w-full px-3.5 py-2 bg-slate-50/80 border rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none ${
                      errors.signupBranch ? 'border-rose-400' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                  {errors.signupBranch && (
                    <p className="mt-0.5 text-xs text-rose-600 font-medium">{errors.signupBranch}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Aggregate / CGPA
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8.4 or 78%"
                    value={signupCgpa}
                    onChange={(e) => setSignupCgpa(e.target.value)}
                    className={`w-full px-3.5 py-2 bg-slate-50/80 border rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none ${
                      errors.signupCgpa ? 'border-rose-400' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                  {errors.signupCgpa && (
                    <p className="mt-0.5 text-xs text-rose-600 font-medium">{errors.signupCgpa}</p>
                  )}
                </div>
              </div>

              {/* Password and Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password (8+ chars)
                  </label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className={`w-full pl-3.5 pr-9 py-2 bg-slate-50/80 border rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none ${
                        errors.signupPassword ? 'border-rose-400' : 'border-slate-200 focus:border-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {errors.signupPassword && (
                    <p className="mt-0.5 text-xs text-rose-600 font-medium">{errors.signupPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      className={`w-full pl-3.5 pr-9 py-2 bg-slate-50/80 border rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none ${
                        errors.signupConfirmPassword ? 'border-rose-400' : 'border-slate-200 focus:border-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {errors.signupConfirmPassword && (
                    <p className="mt-0.5 text-xs text-rose-600 font-medium">{errors.signupConfirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 mt-0.5 shrink-0"
                  />
                  <span>
                    I confirm my academic details are accurate for job eligibility checking and agree to HireHub Terms.
                  </span>
                </label>
                {errors.agreedTerms && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{errors.agreedTerms}</p>
                )}
              </div>

              {/* Submit Registration */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer active:scale-[0.99] mt-2"
              >
                <span>{submitting ? 'Creating Candidate Profile...' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Switch Footer Prompt */}
          <div className="pt-6 mt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <p>
                Don't have a candidate account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrors({});
                  }}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Register here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrors({});
                  }}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

        </div>

        {/* Benefits reminder */}
        <div className="mt-8 text-center text-xs text-slate-500 space-y-1">
          <p>HireHub accounts are 100% free for students and job seekers.</p>
          <p>No credit card required · Direct official portal links · Safe local storage</p>
        </div>

      </div>
    </div>
  );
};
