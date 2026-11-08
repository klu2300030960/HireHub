export interface CareerPath {
  id: string;
  title: string;
  category: 'Software Development' | 'Data Analytics & AI' | 'Cloud Computing' | 'Cybersecurity' | 'Testing & QA';
  iconName: string;
  badgeColor: string;
  gradient: string;
  shortDesc: string;
  fullDesc: string;
  salaryFresher: string;
  salaryExperienced: string;
  topEmployers: string[];
  jobCategoryFilter: string;
  keyRoles: string[];
  skills: {
    core: string[];
    languages: string[];
    frameworks: string[];
    tools: string[];
  };
  learningRoadmap: {
    stage: string;
    duration: string;
    topics: string[];
  }[];
  certifications: {
    name: string;
    provider: string;
    level: 'Entry' | 'Associate' | 'Professional';
  }[];
  sampleInterviewQuestions: {
    question: string;
    topic: string;
  }[];
}

export const CAREER_PATHS: CareerPath[] = [
  {
    id: 'software-dev',
    title: 'Software Development & Engineering',
    category: 'Software Development',
    iconName: 'Code2',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    gradient: 'from-blue-600 to-indigo-700',
    shortDesc: 'Design, code, and deploy resilient scalable applications across full-stack, backend, and distributed systems.',
    fullDesc: 'Software Development is the core engine of technology enterprises. Freshers begin with algorithmic problem solving, object-oriented programming, and API engineering before progressing to microservices and distributed cloud backends.',
    salaryFresher: '₹3.6 - ₹14 LPA',
    salaryExperienced: '₹18 - ₹45+ LPA',
    topEmployers: ['TCS', 'Infosys', 'Microsoft', 'Google', 'Amazon', 'Wipro', 'Capgemini'],
    jobCategoryFilter: 'Software Engineering',
    keyRoles: ['Graduate Software Engineer', 'Full-Stack Developer', 'Backend Java/Python Engineer', 'Frontend React Developer'],
    skills: {
      core: ['Data Structures & Algorithms', 'OOP (Inheritance, Polymorphism)', 'Database Management (SQL)', 'System Design Basics'],
      languages: ['Java', 'Python', 'C++', 'JavaScript / TypeScript'],
      frameworks: ['Spring Boot', 'React', 'Node.js / Express', 'Next.js'],
      tools: ['Git & GitHub', 'Docker', 'Postman', 'Linux CLI']
    },
    learningRoadmap: [
      {
        stage: 'Month 1-2: Foundations',
        duration: '8 Weeks',
        topics: ['Master 1 programming language (Java or Python)', 'Solve 75+ DSA problems on Arrays, Strings, and Maps', 'Git command-line basics and GitHub branching']
      },
      {
        stage: 'Month 3-4: Web & Backend',
        duration: '8 Weeks',
        topics: ['Relational Database design & complex SQL queries', 'REST API design with Spring Boot or Express', 'Frontend basics with React & Tailwind CSS']
      },
      {
        stage: 'Month 5-6: Capstone & Portfolio',
        duration: '8 Weeks',
        topics: ['Build full-stack microservices project with authentication', 'Containerize with Docker', 'Deploy to Render or Cloud Run with CI/CD']
      }
    ],
    certifications: [
      { name: 'Oracle Certified Associate (Java SE)', provider: 'Oracle', level: 'Entry' },
      { name: 'AWS Certified Cloud Practitioner', provider: 'Amazon Web Services', level: 'Entry' },
      { name: 'Meta Front-End Developer Professional', provider: 'Coursera / Meta', level: 'Associate' }
    ],
    sampleInterviewQuestions: [
      { question: 'Explain the difference between HashMap and ConcurrentHashMap in Java.', topic: 'Core Java' },
      { question: 'How would you detect and prevent race conditions in a multithreaded environment?', topic: 'Concurrency' },
      { question: 'What is the difference between SQL indexing with B-Trees vs Hash indexes?', topic: 'Databases' },
      { question: 'Design an LRU Cache with O(1) get and put time complexity.', topic: 'Data Structures' }
    ]
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics & Applied AI',
    category: 'Data Analytics & AI',
    iconName: 'BarChart3',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    gradient: 'from-emerald-600 to-teal-800',
    shortDesc: 'Extract predictive intelligence, build BI dashboards, and develop automated machine learning pipelines.',
    fullDesc: 'Data Analytics bridges business operations with mathematical modeling. As organizations accumulate massive operational datasets, professionals transform raw telemetry into automated visualizations and machine-learned forecasts.',
    salaryFresher: '₹4.0 - ₹12 LPA',
    salaryExperienced: '₹16 - ₹38+ LPA',
    topEmployers: ['Deloitte', 'Accenture', 'IBM', 'Microsoft', 'Google', 'Cognizant'],
    jobCategoryFilter: 'Data & AI',
    keyRoles: ['Associate Data Analyst', 'Business Intelligence Developer', 'Junior Data Scientist', 'ML Operations Associate'],
    skills: {
      core: ['Descriptive & Inferential Statistics', 'Data Wrangling & Cleaning', 'Exploratory Data Analysis (EDA)', 'Machine Learning Fundamentals'],
      languages: ['Python (Pandas, NumPy)', 'SQL (Advanced Window Functions)', 'R'],
      frameworks: ['Scikit-Learn', 'PyTorch / TensorFlow Basics', 'Streamlit', 'Flask'],
      tools: ['Power BI', 'Tableau', 'Excel (Power Query)', 'Jupyter Notebooks']
    },
    learningRoadmap: [
      {
        stage: 'Month 1-2: Data Wrangling & SQL',
        duration: '8 Weeks',
        topics: ['Master Advanced SQL: CTEs, Window Functions, Aggregate Queries', 'Python programming with Pandas & NumPy', 'Data cleaning heuristics']
      },
      {
        stage: 'Month 3-4: Visualization & BI',
        duration: '8 Weeks',
        topics: ['Build interactive enterprise dashboards in Power BI', 'Storytelling with data and business metrics (CAC, LTV, Churn)', 'Statistical hypothesis testing']
      },
      {
        stage: 'Month 5-6: Predictive Modeling',
        duration: '8 Weeks',
        topics: ['Supervised learning: Linear/Logistic regression, Decision Trees', 'Model evaluation metrics (ROC-AUC, F1-Score)', 'End-to-end Streamlit web dashboard']
      }
    ],
    certifications: [
      { name: 'Google Data Analytics Professional Certificate', provider: 'Google', level: 'Entry' },
      { name: 'Microsoft Certified: Power BI Data Analyst Associate (PL-300)', provider: 'Microsoft', level: 'Associate' },
      { name: 'AWS Certified Machine Learning - Specialty', provider: 'AWS', level: 'Professional' }
    ],
    sampleInterviewQuestions: [
      { question: 'How do you calculate customer churn rate using SQL window functions (LAG/LEAD)?', topic: 'Advanced SQL' },
      { question: 'What is the trade-off between Precision and Recall in fraud detection models?', topic: 'Machine Learning' },
      { question: 'Explain Central Limit Theorem and its practical significance in A/B testing.', topic: 'Statistics' },
      { question: 'How do you handle severe class imbalance in a dataset?', topic: 'Data Preprocessing' }
    ]
  },
  {
    id: 'cloud-devops',
    title: 'Cloud Computing & DevOps',
    category: 'Cloud Computing',
    iconName: 'Cloud',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    gradient: 'from-cyan-600 to-blue-800',
    shortDesc: 'Automate deployment pipelines, architect cloud infrastructure, and maintain 99.99% system availability.',
    fullDesc: 'Cloud Computing and DevOps eliminate the friction between development and infrastructure. Engineers build automated CI/CD pipelines, package containerized services, and manage cloud assets using Infrastructure-as-Code.',
    salaryFresher: '₹4.5 - ₹13 LPA',
    salaryExperienced: '₹18 - ₹42+ LPA',
    topEmployers: ['Microsoft', 'Amazon (AWS)', 'Google Cloud', 'IBM', 'Wipro', 'Capgemini'],
    jobCategoryFilter: 'Cloud & DevOps',
    keyRoles: ['Cloud Support Associate', 'Junior DevOps Engineer', 'Site Reliability Engineer (SRE)', 'Build & Release Analyst'],
    skills: {
      core: ['Linux Operating System Internals', 'Networking (TCP/IP, DNS, Subnets)', 'Infrastructure as Code (IaC)', 'CI/CD Automation'],
      languages: ['Bash / Shell Scripting', 'Python for Automation', 'YAML / JSON'],
      frameworks: ['Terraform', 'Ansible', 'Helm'],
      tools: ['Docker', 'Kubernetes (K8s)', 'AWS / Azure / GCP', 'GitHub Actions / Jenkins']
    },
    learningRoadmap: [
      {
        stage: 'Month 1-2: Linux & Networking',
        duration: '8 Weeks',
        topics: ['Master Linux system administration commands and file permissions', 'Computer networking: DNS, HTTP/HTTPS, VPC, routing, SSH keys', 'Automated Bash scripting']
      },
      {
        stage: 'Month 3-4: Containers & CI/CD',
        duration: '8 Weeks',
        topics: ['Docker containerization and multi-stage builds', 'Build automated CI/CD test and deploy pipelines with GitHub Actions', 'Container orchestration with Kubernetes basics']
      },
      {
        stage: 'Month 5-6: Cloud Infrastructure',
        duration: '8 Weeks',
        topics: ['Provision cloud services on AWS (EC2, S3, IAM, VPC, CloudWatch)', 'Infrastructure-as-Code with Terraform', 'Monitoring with Prometheus and Grafana']
      }
    ],
    certifications: [
      { name: 'AWS Certified Solutions Architect – Associate', provider: 'AWS', level: 'Associate' },
      { name: 'Microsoft Certified: Azure Administrator (AZ-104)', provider: 'Microsoft', level: 'Associate' },
      { name: 'Certified Kubernetes Administrator (CKA)', provider: 'Cloud Native Computing Foundation', level: 'Professional' }
    ],
    sampleInterviewQuestions: [
      { question: 'What is the difference between Docker images, containers, and layers?', topic: 'Containerization' },
      { question: 'Explain how a Rolling Update deployment works in Kubernetes versus a Blue-Green deployment.', topic: 'Kubernetes' },
      { question: 'How would you secure a private AWS VPC subnet with NAT Gateways?', topic: 'Cloud Networking' },
      { question: 'What is Infrastructure-as-Code, and why is Terraform state management critical?', topic: 'IaC' }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity & Information Defense',
    category: 'Cybersecurity',
    iconName: 'ShieldCheck',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    gradient: 'from-rose-600 to-red-800',
    shortDesc: 'Protect enterprise assets, conduct vulnerability assessments, and respond to cyber threat incidents.',
    fullDesc: 'Cybersecurity is critical for protecting digital sovereignty and enterprise data against sophisticated threats. Analysts monitor Security Operations Centers (SOC), conduct penetration tests, and enforce zero-trust security postures.',
    salaryFresher: '₹4.0 - ₹11 LPA',
    salaryExperienced: '₹15 - ₹36+ LPA',
    topEmployers: ['Deloitte', 'Cisco', 'IBM Security', 'TCS', 'Wipro', 'Accenture'],
    jobCategoryFilter: 'Cybersecurity',
    keyRoles: ['SOC Analyst L1', 'Security Engineer', 'Penetration Tester / Ethical Hacker', 'Vulnerability Assessment Analyst'],
    skills: {
      core: ['Network Security & Protocols', 'Cryptography & Public Key Infrastructure (PKI)', 'OWASP Top 10 Web Vulnerabilities', 'Security Information & Event Management (SIEM)'],
      languages: ['Python for Security', 'Bash', 'PowerShell', 'SQL'],
      frameworks: ['MITRE ATT&CK Framework', 'NIST Cybersecurity Framework'],
      tools: ['Wireshark', 'Burp Suite', 'Splunk / QRadar', 'Nmap', 'Metasploit']
    },
    learningRoadmap: [
      {
        stage: 'Month 1-2: Networks & OS Security',
        duration: '8 Weeks',
        topics: ['Deep packet analysis with Wireshark', 'TCP/IP handshake, firewalls, and IDS/IPS concepts', 'Linux and Windows hardening']
      },
      {
        stage: 'Month 3-4: Web Defense & SIEM',
        duration: '8 Weeks',
        topics: ['OWASP Top 10: SQL Injection, XSS, CSRF, Broken Access Control', 'Security log analysis using Splunk and SIEM dashboards', 'Incident response workflows']
      },
      {
        stage: 'Month 5-6: Hands-on Labs & CTF',
        duration: '8 Weeks',
        topics: ['Hands-on vulnerability exploitation on TryHackMe and HackTheBox', 'Vulnerability scanning with Nessus and Nmap', 'Security audit report writing']
      }
    ],
    certifications: [
      { name: 'CompTIA Security+ (SY0-701)', provider: 'CompTIA', level: 'Entry' },
      { name: 'Certified Ethical Hacker (CEH v12)', provider: 'EC-Council', level: 'Associate' },
      { name: 'Cisco Certified CyberOps Associate', provider: 'Cisco', level: 'Associate' }
    ],
    sampleInterviewQuestions: [
      { question: 'Explain how a SQL Injection occurs and how parameterized queries prevent it.', topic: 'Application Security' },
      { question: 'What is the difference between symmetric and asymmetric encryption?', topic: 'Cryptography' },
      { question: 'Describe the steps taken when responding to a suspected ransomware incident.', topic: 'Incident Response' },
      { question: 'How does an attacker exploit Cross-Site Scripting (XSS) and what mitigations exist?', topic: 'Web Vulnerabilities' }
    ]
  },
  {
    id: 'testing-qa',
    title: 'QA & Test Automation Engineering',
    category: 'Testing & QA',
    iconName: 'CheckSquare',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    gradient: 'from-amber-600 to-orange-700',
    shortDesc: 'Ensure software quality, build automated regression test suites, and conduct performance stress testing.',
    fullDesc: 'Quality Assurance engineers ensure that mission-critical software behaves reliably under all operating conditions. Software Development Engineers in Test (SDET) write robust automation suites using Playwright, Selenium, and CI/CD pipelines.',
    salaryFresher: '₹3.5 - ₹10 LPA',
    salaryExperienced: '₹14 - ₹30+ LPA',
    topEmployers: ['TCS', 'Infosys', 'Capgemini', 'Wipro', 'Cognizant', 'Oracle'],
    jobCategoryFilter: 'QA & Testing',
    keyRoles: ['Associate SDET', 'QA Automation Engineer', 'Performance Test Analyst', 'API Quality Engineer'],
    skills: {
      core: ['Software Testing Life Cycle (STLC)', 'Test Case & Bug Report Writing', 'Test Automation Frameworks (POM)', 'API & Performance Testing'],
      languages: ['Java', 'JavaScript / TypeScript', 'Python'],
      frameworks: ['Selenium WebDriver', 'Playwright', 'Cypress', 'TestNG / JUnit'],
      tools: ['Postman & Newman', 'JMeter', 'Jira & TestRail', 'Jenkins / GitHub Actions']
    },
    learningRoadmap: [
      {
        stage: 'Month 1-2: Manual & API Testing',
        duration: '8 Weeks',
        topics: ['Black-box and white-box test design techniques', 'Writing rigorous test cases and defect life cycle in Jira', 'REST API testing with Postman, collections, and assertions']
      },
      {
        stage: 'Month 3-4: UI Test Automation',
        duration: '8 Weeks',
        topics: ['Automation using Java with Selenium or TypeScript with Playwright', 'Page Object Model (POM) architectural design', 'Data-driven testing with TestNG/JUnit']
      },
      {
        stage: 'Month 5-6: CI/CD & Performance',
        duration: '8 Weeks',
        topics: ['Integrate automated tests into Jenkins / GitHub Actions CI pipelines', 'Performance and load testing with Apache JMeter', 'Cross-browser execution on cloud grids']
      }
    ],
    certifications: [
      { name: 'ISTQB Certified Tester Foundation Level (CTFL)', provider: 'ISTQB', level: 'Entry' },
      { name: 'Certified Associate in Software Testing (CAST)', provider: 'QAI', level: 'Entry' },
      { name: 'Selenium WebDriver with Java Certification', provider: 'Udemy / TestAutomationU', level: 'Associate' }
    ],
    sampleInterviewQuestions: [
      { question: 'What is the Page Object Model (POM) design pattern and why is it preferred in test automation?', topic: 'Automation Architecture' },
      { question: 'Explain the difference between Implicit Wait, Explicit Wait, and Fluent Wait in Selenium.', topic: 'WebDriver' },
      { question: 'How do you design automated tests for microservice REST APIs with authentication tokens?', topic: 'API Testing' },
      { question: 'What is the difference between Smoke Testing, Sanity Testing, and Regression Testing?', topic: 'Testing Methodologies' }
    ]
  }
];

export interface InterviewRoundGuide {
  title: string;
  roundNumber: string;
  duration: string;
  focus: string;
  description: string;
  tips: string[];
  sampleTopics: string[];
}

export const INTERVIEW_ROUNDS_GUIDE: InterviewRoundGuide[] = [
  {
    roundNumber: 'Round 1',
    title: 'Online Assessment & Aptitude / NQT',
    duration: '60 - 90 Minutes',
    focus: 'Speed, accuracy, quantitative reasoning, and programming syntax',
    description: 'Companies like TCS (NQT), Infosys, Wipro, and Capgemini evaluate thousands of applicants using automated platforms (HackerRank, Cocubes, Mettl). Tests include Quantitative Aptitude, Logical Reasoning, Verbal Ability, and 2 Hands-on Coding questions.',
    tips: [
      'Practice timed problem solving on HackerRank and IndiaBIX.',
      'Always optimize your coding solutions to pass both visible and hidden test cases (watch for integer overflow and time limits).',
      'Manage time strictly: allocate no more than 1 minute per aptitude question.'
    ],
    sampleTopics: ['Percentages, Profit & Loss, Time & Work', 'Syllogisms & Data Interpretation', 'String manipulations & Array frequency maps']
  },
  {
    roundNumber: 'Round 2',
    title: 'Core Technical Screening (DSA & CS Fundamentals)',
    duration: '45 - 60 Minutes',
    focus: 'Problem-solving approach, data structures, and fundamental CS concepts',
    description: 'Conducted 1-on-1 by a Senior Software Engineer via Microsoft Teams, Google Meet, or Zoom. You will live-code in a shared editor (CoderPad) while explaining your thought process out loud.',
    tips: [
      'Communicate continuously: state the brute-force approach first, compute its Big-O complexity, then propose an optimized solution.',
      'Check edge cases before clicking run: null pointers, empty arrays, single elements, and integer boundaries.',
      'Be prepared to write code for your favorite language from scratch without an IDE auto-complete.'
    ],
    sampleTopics: ['Two Pointers, Sliding Window, Binary Search', 'Binary Trees & Traversals', 'OOP 4 Pillars & Real-World Examples']
  },
  {
    roundNumber: 'Round 3',
    title: 'Advanced Technical & Project Deep-Dive',
    duration: '45 - 60 Minutes',
    focus: 'Academic projects, database architecture, and practical engineering skills',
    description: 'Interviewers review every line of your resume. They probe deep into your academic projects, architecture decisions, database normalization, and technologies listed.',
    tips: [
      'Know every detail of the projects on your resume: why you chose the database, how authentication works, and challenges you resolved.',
      'Be honest: if you do not know a specific concept, acknowledge it and explain how you would research the solution.',
      'Prepare a diagram or visual explanation of your project architecture.'
    ],
    sampleTopics: ['Database Normalization & ACID Properties', 'REST API status codes (200, 201, 400, 401, 403, 500)', 'Project challenges & trade-offs']
  },
  {
    roundNumber: 'Round 4',
    title: 'HR & Behavioral Interview (STAR Method)',
    duration: '20 - 30 Minutes',
    focus: 'Cultural fit, communication skills, adaptability, and career goals',
    description: 'Conducted by the Human Resources team. Evaluates your willingness to relocate, team collaboration, handling conflict, and alignment with corporate culture.',
    tips: [
      'Structure every behavioral answer using the STAR method: Situation, Task, Action, Result.',
      'Research the company’s recent products, core values, and executive leadership beforehand.',
      'Always have 2 thoughtful questions ready to ask the interviewer at the end.'
    ],
    sampleTopics: ['"Tell me about a time you handled a difficult team member."', '"Why do you want to join our company?"', '"Where do you see yourself in 3 years?"']
  }
];

export const RESUME_PREPARATION_TIPS = [
  {
    title: 'Follow Anti-ATS Reject Formatting',
    desc: 'Use clean single-column layouts with standard fonts (Arial, Calibri, Plus Jakarta Sans). Avoid tables, graphics, text boxes, and complex multi-column columns that choke parsers.'
  },
  {
    title: 'Quantify Engineering Impact',
    desc: 'Format project bullet points using the Google XYZ formula: "Accomplished [X] as measured by [Y] by doing [Z]" (e.g., "Reduced API response latency by 35% through Redis caching").'
  },
  {
    title: 'Keep Technical Skills Relevant',
    desc: 'Group competencies logically: Languages, Frameworks, Databases, and Tools. Remove outdated technologies (e.g., MS Office, Windows XP).'
  },
  {
    title: 'Include Verified Working Hyperlinks',
    desc: 'Provide clickable URLs to your GitHub profile, hosted web demos, and LinkedIn profile.'
  }
];
