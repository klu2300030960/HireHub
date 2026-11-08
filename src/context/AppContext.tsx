import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, ApplicationRecord, CandidateProfile } from '../types/job';
import { MOCK_JOBS } from '../data/mockJobs';

interface AppContextType {
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;
  applications: ApplicationRecord[];
  applyToJob: (jobId: string) => void;
  updateApplicationStatus: (jobId: string, status: ApplicationRecord['status']) => void;
  addApplicationRecord: (record: ApplicationRecord) => void;
  updateApplicationNotes: (jobId: string, notes: string) => void;
  deleteApplication: (jobId: string) => void;
  searchTitle: string;
  setSearchTitle: (q: string) => void;
  searchCompany: string;
  setSearchCompany: (c: string) => void;
  searchLocation: string;
  setSearchLocation: (l: string) => void;
  candidateProfile: CandidateProfile;
  updateCandidateProfile: (profile: Partial<CandidateProfile>) => void;
  isAuthenticated: boolean;
  login: (profile?: Partial<CandidateProfile>) => void;
  logout: () => void;
  registerCandidate: (profile: CandidateProfile) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  allJobs: Job[];
}

const DEFAULT_PROFILE: CandidateProfile = {
  name: 'Alex Sharma',
  email: 'alex.sharma@example.com',
  degree: 'B.Tech',
  branch: 'Computer Science & Engineering',
  graduationYear: '2025',
  cgpa: '8.4',
  skills: ['Java', 'Python', 'SQL', 'Data Structures', 'React', 'Git'],
  experienceYears: '0'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hirehub_saved_jobs');
      return saved ? JSON.parse(saved) : ['job-tcs-ninja-2025', 'job-infy-se-specialist'];
    } catch {
      return ['job-tcs-ninja-2025'];
    }
  });

  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    try {
      const stored = localStorage.getItem('hirehub_applications');
      return stored ? JSON.parse(stored) : [
        {
          jobId: 'job-tcs-ninja-2025',
          appliedDate: '2026-11-01',
          status: 'Assessment',
          notes: 'NQT assessment link received; test scheduled for Nov 15th'
        },
        {
          jobId: 'job-msft-swe-assoc',
          appliedDate: '2026-10-24',
          status: 'Interview',
          notes: 'Technical screening passed. System design & algorithms interview scheduled'
        },
        {
          jobId: 'job-infy-se-specialist',
          appliedDate: '2026-11-04',
          status: 'Applied',
          notes: 'Application registered on Infosys Career portal with resume'
        },
        {
          jobId: 'job-wipro-turbo-2025',
          appliedDate: '2026-10-18',
          status: 'Selected',
          notes: 'Offer letter received for Turbo cadre! Verification ongoing'
        }
      ];
    } catch {
      return [];
    }
  });

  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>(() => {
    try {
      const stored = localStorage.getItem('hirehub_user_profile');
      return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('hirehub_is_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [searchTitle, setSearchTitle] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('hirehub_saved_jobs', JSON.stringify(savedJobIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedJobIds]);

  useEffect(() => {
    try {
      localStorage.setItem('hirehub_applications', JSON.stringify(applications));
    } catch (e) {
      console.error(e);
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem('hirehub_user_profile', JSON.stringify(candidateProfile));
    } catch (e) {
      console.error(e);
    }
  }, [candidateProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('hirehub_is_authenticated', isAuthenticated ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  }, [isAuthenticated]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const login = (profile?: Partial<CandidateProfile>) => {
    if (profile) {
      setCandidateProfile(prev => ({ ...prev, ...profile }));
    }
    setIsAuthenticated(true);
    showToast(`Welcome back, ${profile?.name || candidateProfile.name}!`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('You have signed out successfully.');
  };

  const registerCandidate = (profile: CandidateProfile) => {
    setCandidateProfile(profile);
    setIsAuthenticated(true);
    showToast(`Account created successfully! Welcome to HireHub, ${profile.name}.`);
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds(prev => {
      const exists = prev.includes(jobId);
      const next = exists ? prev.filter(id => id !== jobId) : [...prev, jobId];
      showToast(exists ? 'Removed job from saved list' : 'Job successfully saved to your list!');
      return next;
    });
  };

  const isJobSaved = (jobId: string) => savedJobIds.includes(jobId);

  const applyToJob = (jobId: string) => {
    const job = MOCK_JOBS.find(j => j.id === jobId);
    const exists = applications.some(a => a.jobId === jobId);
    if (!exists) {
      const newRecord: ApplicationRecord = {
        jobId,
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'Applied',
        notes: `Applied for ${job?.title || 'Job'}`
      };
      setApplications(prev => [newRecord, ...prev]);
    }
    showToast(`Redirecting to official ${job?.company || 'company'} career portal...`);
  };

  const updateApplicationStatus = (jobId: string, status: ApplicationRecord['status']) => {
    setApplications(prev =>
      prev.map(app => (app.jobId === jobId ? { ...app, status } : app))
    );
    showToast(`Application milestone updated to "${status}".`);
  };

  const addApplicationRecord = (record: ApplicationRecord) => {
    setApplications(prev => {
      const filtered = prev.filter(a => a.jobId !== record.jobId);
      return [record, ...filtered];
    });
    showToast(`Application added with status "${record.status}".`);
  };

  const updateApplicationNotes = (jobId: string, notes: string) => {
    setApplications(prev =>
      prev.map(app => (app.jobId === jobId ? { ...app, notes } : app))
    );
    showToast('Application notes updated.');
  };

  const deleteApplication = (jobId: string) => {
    setApplications(prev => prev.filter(app => app.jobId !== jobId));
    showToast('Application removed from tracker.');
  };

  const updateCandidateProfile = (profile: Partial<CandidateProfile>) => {
    setCandidateProfile(prev => ({ ...prev, ...profile }));
    showToast('Profile updated successfully!');
  };

  return (
    <AppContext.Provider
      value={{
        savedJobIds,
        toggleSaveJob,
        isJobSaved,
        applications,
        applyToJob,
        updateApplicationStatus,
        addApplicationRecord,
        updateApplicationNotes,
        deleteApplication,
        searchTitle,
        setSearchTitle,
        searchCompany,
        setSearchCompany,
        searchLocation,
        setSearchLocation,
        candidateProfile,
        updateCandidateProfile,
        isAuthenticated,
        login,
        logout,
        registerCandidate,
        toastMessage,
        showToast,
        allJobs: MOCK_JOBS
      }}
    >
      {children}
      {/* Sleek Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-lg shadow-xl text-sm border border-slate-700 transition-all">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span>{toastMessage}</span>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
