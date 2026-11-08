import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { FindJobsPage } from './pages/FindJobsPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { EligibilityCheckerPage } from './pages/EligibilityCheckerPage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { SavedJobsPage } from './pages/SavedJobsPage';
import { ApplicationTrackerPage } from './pages/ApplicationTrackerPage';
import { CareerGuidancePage } from './pages/CareerGuidancePage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              {/* Page 1: Home Page */}
              <Route path="/" element={<HomePage />} />

              {/* Page 2: Find Jobs Page */}
              <Route path="/jobs" element={<FindJobsPage />} />

              {/* Page 3: Job Details Page */}
              <Route path="/jobs/:id" element={<JobDetailsPage />} />

              {/* Page 4: Companies Page */}
              <Route path="/companies" element={<CompaniesPage />} />

              {/* Page 5: Candidate Login & Registration */}
              <Route path="/login" element={<AuthPage initialMode="login" />} />
              <Route path="/signup" element={<AuthPage initialMode="signup" />} />

              {/* Page 6: Candidate Dashboard */}
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Page 7: Eligibility Checker */}
              <Route path="/eligibility" element={<EligibilityCheckerPage />} />

              {/* Page 8: Resume Analyzer */}
              <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} />
              {/* Page 9: Skill Gap Analyzer */}
              <Route path="/skill-gap" element={<SkillGapPage />} />
              {/* Page 10: Saved Jobs */}
              <Route path="/saved-jobs" element={<SavedJobsPage />} />
              {/* Page 11: Application Tracker */}
              <Route path="/tracker" element={<ApplicationTrackerPage />} />
              {/* Page 12: Career Guidance */}
              <Route path="/career-guidance" element={<CareerGuidancePage />} />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
