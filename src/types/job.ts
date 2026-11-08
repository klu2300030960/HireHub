export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  companyColor?: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  jobType: 'Full-time' | 'Internship' | 'Contract';
  experienceLevel: 'Fresher (0-1 yrs)' | 'Junior (1-3 yrs)' | 'Mid-Senior (3-5+ yrs)';
  experienceYears: string;
  salary: string;
  postedDate: string;
  applicationDeadline: string;
  category: 'Software Engineering' | 'Data & AI' | 'Cloud & DevOps' | 'QA & Testing' | 'Cybersecurity';
  skills: string[];
  description: string;
  responsibilities: string[];
  education: string;
  eligibleBatches: string[];
  minCgpa?: string;
  applyUrl: string;
  isFresherFriendly: boolean;
  isFeatured?: boolean;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  initials: string;
  color: string;
  category: 'IT Services & Consulting' | 'Product & Big Tech' | 'Enterprise & Cloud' | 'Fintech & Analytics';
  headquarters: string;
  openingsCount: number;
  website: string;
  careersUrl: string;
  description: string;
  founded?: string;
  employeeCount?: string;
  techStack?: string[];
  hiringTracks?: string[];
}

export interface SearchFilters {
  query: string;
  company: string;
  location: string;
  workMode: string;
  experienceLevel: string;
  category: string;
}

export interface ApplicationRecord {
  jobId: string;
  appliedDate: string;
  status: 'Saved' | 'Applied' | 'Assessment' | 'Interview' | 'Selected' | 'Not Selected';
  notes?: string;
}

export interface CandidateProfile {
  name: string;
  email: string;
  degree: string;
  branch: string;
  graduationYear: string;
  cgpa: string;
  skills: string[];
  experienceYears: string;
}
