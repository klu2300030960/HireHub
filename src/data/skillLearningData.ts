export interface SkillLearningResource {
  skill: string;
  category: 'Programming Languages' | 'Frameworks & Libraries' | 'Core Computer Science' | 'Cloud & DevOps' | 'Databases' | 'Testing & QA';
  importance: 'Critical' | 'High' | 'Recommended';
  estimatedWeeks: number;
  description: string;
  keyTopics: string[];
  recommendedProject: string;
  freeResources: {
    title: string;
    type: 'Documentation' | 'Course' | 'Interactive' | 'Video Track';
    url: string;
  }[];
}

export const SKILL_LEARNING_GUIDES: Record<string, SkillLearningResource> = {
  'Java': {
    skill: 'Java',
    category: 'Programming Languages',
    importance: 'Critical',
    estimatedWeeks: 3,
    description: 'Foundational enterprise object-oriented language widely used by TCS, Infosys, Wipro, Amazon, and enterprise banks.',
    keyTopics: ['Core OOP (Encapsulation, Polymorphism, Abstraction)', 'Java Collections Framework (List, Set, Map)', 'Concurrency & Multithreading', 'Stream API & Lambdas', 'JVM Memory Model & Garbage Collection'],
    recommendedProject: 'Build a Banking Transaction Engine with concurrency safety and custom exception handling.',
    freeResources: [
      { title: 'Oracle Official Java Tutorials', type: 'Documentation', url: 'https://docs.oracle.com/javase/tutorial/' },
      { title: 'Java Programming Course (University of Helsinki / MOOC.fi)', type: 'Course', url: 'https://java-programming.mooc.fi/' },
      { title: 'freeCodeCamp Java for Beginners', type: 'Video Track', url: 'https://www.freecodecamp.org' }
    ]
  },
  'Python': {
    skill: 'Python',
    category: 'Programming Languages',
    importance: 'Critical',
    estimatedWeeks: 2,
    description: 'Versatile scripting and backend language standard in Data Science, Machine Learning, Automation, and Web Services.',
    keyTopics: ['Data structures (Lists, Dicts, Tuples, Sets)', 'List Comprehensions & Generators', 'Decorators & OOP', 'Virtual Environments & Pip', 'Working with APIs & Requests'],
    recommendedProject: 'Automated Job Web Scraper with alert notifications and CSV export.',
    freeResources: [
      { title: 'Python Official Documentation & Tutorial', type: 'Documentation', url: 'https://docs.python.org/3/tutorial/' },
      { title: 'Python for Everybody (Charles Severance)', type: 'Course', url: 'https://www.py4e.com/' }
    ]
  },
  'C++': {
    skill: 'C++',
    category: 'Programming Languages',
    importance: 'High',
    estimatedWeeks: 4,
    description: 'High-performance systems programming language key for low-latency systems, game engines, and competitive programming.',
    keyTopics: ['Pointers & Dynamic Memory Management', 'STL Containers & Iterators', 'Smart Pointers (unique_ptr, shared_ptr)', 'Templates & Generic Programming', 'C++11/C++20 Modern Idioms'],
    recommendedProject: 'High-speed Cache Simulator implementing LRU/LFU replacement policies.',
    freeResources: [
      { title: 'LearnCpp.com Free Tutorials', type: 'Interactive', url: 'https://www.learncpp.com/' },
      { title: 'cppreference.com Comprehensive Wiki', type: 'Documentation', url: 'https://en.cppreference.com/' }
    ]
  },
  'C#': {
    skill: 'C#',
    category: 'Programming Languages',
    importance: 'High',
    estimatedWeeks: 3,
    description: 'Modern language designed by Microsoft for enterprise .NET backends, cloud microservices, and desktop applications.',
    keyTopics: ['LINQ queries', 'Async/Await & Task Parallel Library', 'Dependency Injection in .NET', 'Entity Framework Core', 'ASP.NET Web APIs'],
    recommendedProject: 'Build an ASP.NET Core REST API with EF Core database migrations.',
    freeResources: [
      { title: 'Microsoft Learn: C# Fundamentals', type: 'Course', url: 'https://learn.microsoft.com/en-us/training/paths/csharp-first-steps/' }
    ]
  },
  'Data Structures': {
    skill: 'Data Structures',
    category: 'Core Computer Science',
    importance: 'Critical',
    estimatedWeeks: 4,
    description: 'The foundation of technical screening interviews for Google, Microsoft, Amazon, and top product companies.',
    keyTopics: ['Arrays, Strings & Two Pointers', 'Linked Lists & Cycles', 'Stacks, Queues & Monotonic Stacks', 'Binary Trees, BSTs & Traversals', 'Hash Tables & Collision Resolution', 'Heaps & Priority Queues'],
    recommendedProject: 'Implement an in-memory Trie-based autocomplete engine with prefix querying.',
    freeResources: [
      { title: 'NeetCode Roadmap & DSA Patterns', type: 'Interactive', url: 'https://neetcode.io/roadmap' },
      { title: 'GeeksforGeeks Complete DSA Track', type: 'Course', url: 'https://www.geeksforgeeks.org/data-structures/' }
    ]
  },
  'Algorithms': {
    skill: 'Algorithms',
    category: 'Core Computer Science',
    importance: 'Critical',
    estimatedWeeks: 4,
    description: 'Algorithmic problem-solving techniques tested in online coding assessments (NQT, Hackerrank, LeetCode).',
    keyTopics: ['Binary Search on Answers', 'Breadth-First & Depth-First Search', 'Dynamic Programming (1D & 2D memoization)', 'Greedy Algorithms', 'Backtracking & Recursion', 'Graph Shortest Paths (Dijkstra)'],
    recommendedProject: 'Interactive Pathfinding Visualizer showcasing Dijkstra and A* algorithms.',
    freeResources: [
      { title: 'MIT OpenCourseWare Introduction to Algorithms (6.006)', type: 'Course', url: 'https://ocw.mit.edu' },
      { title: 'Visualgo - Visualizing Algorithms', type: 'Interactive', url: 'https://visualgo.net' }
    ]
  },
  'Problem Solving': {
    skill: 'Problem Solving',
    category: 'Core Computer Science',
    importance: 'Critical',
    estimatedWeeks: 3,
    description: 'Translating abstract requirements into clean code and debugging edge cases under timed constraints.',
    keyTopics: ['Time & Space Complexity (Big-O analysis)', 'Boundary Conditions & Edge Cases', 'Mathematical proofs and modular arithmetic', 'Bit Manipulation techniques'],
    recommendedProject: 'Solve 50 curated LeetCode Easy & Medium problems focusing on patterns.',
    freeResources: [
      { title: 'LeetCode Problem Archive', type: 'Interactive', url: 'https://leetcode.com' },
      { title: 'HackerRank Problem Solving Track', type: 'Interactive', url: 'https://www.hackerrank.com' }
    ]
  },
  'SQL': {
    skill: 'SQL',
    category: 'Databases',
    importance: 'Critical',
    estimatedWeeks: 2,
    description: 'Declarative query language essential across almost every software engineering, data analyst, and backend position.',
    keyTopics: ['Complex JOINs (INNER, LEFT, FULL, CROSS)', 'Window Functions (ROW_NUMBER, RANK, LAG/LEAD)', 'Subqueries & CTEs (WITH clause)', 'Indexes & Query Execution Plans', 'ACID Transactions & Isolation Levels'],
    recommendedProject: 'Design an E-Commerce relational database schema with indexed analytic queries.',
    freeResources: [
      { title: 'SQLBolt - Learn SQL Interactively', type: 'Interactive', url: 'https://sqlbolt.com/' },
      { title: 'PostgreSQL Official Documentation', type: 'Documentation', url: 'https://www.postgresql.org/docs/' }
    ]
  },
  'PostgreSQL': {
    skill: 'PostgreSQL',
    category: 'Databases',
    importance: 'High',
    estimatedWeeks: 2,
    description: 'World’s most advanced open-source relational database engine, trusted by fast-growing startups and enterprises.',
    keyTopics: ['JSONB data types', 'Full-Text Search', 'Partitioning and Index Tuning', 'Connection Pooling with PgBouncer'],
    recommendedProject: 'Configure a partitioned logging database with JSONB document querying.',
    freeResources: [
      { title: 'PostgreSQL Tutorial', type: 'Course', url: 'https://www.postgresqltutorial.com/' }
    ]
  },
  'Spring Boot': {
    skill: 'Spring Boot',
    category: 'Frameworks & Libraries',
    importance: 'Critical',
    estimatedWeeks: 3,
    description: 'Enterprise standard framework for building production-grade microservices and RESTful backends in Java.',
    keyTopics: ['Inversion of Control & Dependency Injection', 'Spring MVC & REST Controllers', 'Spring Data JPA & Hibernate ORM', 'Spring Security with JWT', 'Actuator, Logging & Configuration'],
    recommendedProject: 'Build a Student Course Registration Microservice with JWT authentication and MySQL.',
    freeResources: [
      { title: 'Spring Guides Official Quickstarts', type: 'Documentation', url: 'https://spring.io/guides' },
      { title: 'Baeldung Spring Boot Tutorials', type: 'Documentation', url: 'https://www.baeldung.com/spring-boot' }
    ]
  },
  'React': {
    skill: 'React',
    category: 'Frameworks & Libraries',
    importance: 'High',
    estimatedWeeks: 3,
    description: 'The dominant UI library for modern web applications developed by Meta and used worldwide.',
    keyTopics: ['JSX & Component Architecture', 'Hooks (useState, useEffect, useMemo, useCallback)', 'State Management & Context API', 'Component Lifecycle & Virtual DOM', 'Routing & Data Fetching'],
    recommendedProject: 'Build an Interactive Kanban Task Board with drag-and-drop and persistent storage.',
    freeResources: [
      { title: 'React Official Documentation (react.dev)', type: 'Documentation', url: 'https://react.dev' },
      { title: 'Full Stack Open by University of Helsinki', type: 'Course', url: 'https://fullstackopen.com/' }
    ]
  },
  'TypeScript': {
    skill: 'TypeScript',
    category: 'Programming Languages',
    importance: 'High',
    estimatedWeeks: 2,
    description: 'Typed superset of JavaScript providing compile-time type safety for scalable frontend and backend codebases.',
    keyTopics: ['Interfaces, Types & Union/Intersection types', 'Generics & Utility Types (Partial, Pick, Omit)', 'Type Narrowing & Guards', 'tsconfig Configuration & Strict Mode'],
    recommendedProject: 'Migrate a vanilla JavaScript utility library to strictly-typed TypeScript with generic helpers.',
    freeResources: [
      { title: 'TypeScript Official Handbook', type: 'Documentation', url: 'https://www.typescriptlang.org/docs/' }
    ]
  },
  'Node.js': {
    skill: 'Node.js',
    category: 'Frameworks & Libraries',
    importance: 'High',
    estimatedWeeks: 2,
    description: 'Asynchronous event-driven JavaScript runtime for scalable network applications.',
    keyTopics: ['Event Loop & Non-blocking I/O', 'Buffers, Streams & File System', 'Express.js middleware architecture', 'RESTful API routing and error handling'],
    recommendedProject: 'Build a Real-Time Chat Server with WebSockets and authentication.',
    freeResources: [
      { title: 'Node.js Official Documentation & Learn Guides', type: 'Documentation', url: 'https://nodejs.org/en/learn' }
    ]
  },
  'Docker': {
    skill: 'Docker',
    category: 'Cloud & DevOps',
    importance: 'High',
    estimatedWeeks: 2,
    description: 'Containerization standard to package applications and dependencies into standardized lightweight units.',
    keyTopics: ['Dockerfiles & Multi-stage builds', 'Images vs Containers', 'Port mapping & Volumes', 'Docker Compose multi-container orchestration', 'Docker Hub registries'],
    recommendedProject: 'Containerize a Full-Stack React + Node.js + PostgreSQL app using Docker Compose.',
    freeResources: [
      { title: 'Docker Official Get Started Guide', type: 'Documentation', url: 'https://docs.docker.com/get-started/' },
      { title: 'Docker Curriculum by Prakhar Srivastav', type: 'Interactive', url: 'https://docker-curriculum.com/' }
    ]
  },
  'Kubernetes': {
    skill: 'Kubernetes',
    category: 'Cloud & DevOps',
    importance: 'Recommended',
    estimatedWeeks: 3,
    description: 'Industry standard container orchestration platform for automating application deployment, scaling, and operations.',
    keyTopics: ['Pods, Deployments & ReplicaSets', 'Services & Ingress Controllers', 'ConfigMaps & Secrets', 'Persistent Volumes', 'Horizontal Pod Autoscaling'],
    recommendedProject: 'Deploy a multi-pod web app on Minikube with rolling updates and health probes.',
    freeResources: [
      { title: 'Kubernetes Official Interactive Basics', type: 'Documentation', url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/' }
    ]
  },
  'AWS': {
    skill: 'AWS',
    category: 'Cloud & DevOps',
    importance: 'High',
    estimatedWeeks: 3,
    description: 'Leading cloud services platform powering millions of businesses globally across compute, storage, and networking.',
    keyTopics: ['EC2 instances & Auto-scaling', 'S3 buckets & Storage classes', 'IAM Roles, Users & Policies', 'Lambda serverless computing', 'VPC, Subnets & Security Groups'],
    recommendedProject: 'Deploy a serverless REST API using AWS Lambda, API Gateway, and DynamoDB.',
    freeResources: [
      { title: 'AWS Cloud Practitioner Free Essentials', type: 'Course', url: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/' }
    ]
  },
  'Azure': {
    skill: 'Azure',
    category: 'Cloud & DevOps',
    importance: 'High',
    estimatedWeeks: 3,
    description: 'Microsoft enterprise cloud platform powering Fortune 500 infrastructure and SaaS solutions.',
    keyTopics: ['Azure Virtual Machines', 'Azure App Service & Azure Functions', 'Azure Entra ID (formerly Azure AD)', 'Azure Blob Storage & Cosmos DB'],
    recommendedProject: 'Deploy an automated web application using Azure App Service and GitHub Actions.',
    freeResources: [
      { title: 'Microsoft Learn Azure Fundamentals (AZ-900)', type: 'Course', url: 'https://learn.microsoft.com' }
    ]
  },
  'Git': {
    skill: 'Git',
    category: 'Cloud & DevOps',
    importance: 'Critical',
    estimatedWeeks: 1,
    description: 'Distributed version control system ubiquitous in every professional software development team.',
    keyTopics: ['Branching, Merging & Fast-forward', 'Rebasing vs Merging', 'Resolving Merge Conflicts', 'Stashing & Cherry-picking', 'Pull Request workflows & GitHub conventions'],
    recommendedProject: 'Simulate a team repository workflow with feature branches, PR reviews, and conflict resolution.',
    freeResources: [
      { title: 'Pro Git Book (Free by Scott Chacon)', type: 'Documentation', url: 'https://git-scm.com/book/en/v2' },
      { title: 'Learn Git Branching Interactive Sandbox', type: 'Interactive', url: 'https://learngitbranching.js.org/' }
    ]
  },
  'Distributed Systems': {
    skill: 'Distributed Systems',
    category: 'Core Computer Science',
    importance: 'High',
    estimatedWeeks: 4,
    description: 'Core concepts behind building resilient, highly available applications across multiple networked machines.',
    keyTopics: ['CAP Theorem & PACELC', 'Consistency Models (Eventual vs Strong)', 'Load Balancing & Caching (Redis/CDN)', 'Message Queues (Kafka, RabbitMQ)', 'Idempotency & Distributed Transactions'],
    recommendedProject: 'Design a Distributed Rate Limiter using Redis sliding window algorithms.',
    freeResources: [
      { title: 'System Design Primer (Donne Martin)', type: 'Documentation', url: 'https://github.com/donnemartin/system-design-primer' }
    ]
  },
  'Machine Learning': {
    skill: 'Machine Learning',
    category: 'Core Computer Science',
    importance: 'High',
    estimatedWeeks: 4,
    description: 'Building predictive statistical models from structured and unstructured datasets.',
    keyTopics: ['Supervised Learning (Regression, Classification)', 'Unsupervised Learning (K-Means, PCA)', 'Model Evaluation (Precision, Recall, ROC-AUC)', 'Feature Engineering & Normalization'],
    recommendedProject: 'House Price Prediction or Customer Churn Classifier with Scikit-Learn.',
    freeResources: [
      { title: 'Machine Learning Specialization (Andrew Ng)', type: 'Course', url: 'https://www.coursera.org' }
    ]
  },
  'Selenium': {
    skill: 'Selenium',
    category: 'Testing & QA',
    importance: 'High',
    estimatedWeeks: 2,
    description: 'Industry automated testing framework for browser automation and end-to-end regression validation.',
    keyTopics: ['WebDriver architecture', 'Locators (XPath, CSS Selectors)', 'Explicit & Implicit Waits', 'Page Object Model (POM)', 'TestNG / JUnit Integration'],
    recommendedProject: 'Automate a multi-step E-Commerce checkout flow and generate HTML test reports.',
    freeResources: [
      { title: 'Selenium Official Documentation', type: 'Documentation', url: 'https://www.selenium.dev/documentation/' }
    ]
  }
};

export const getLearningGuideForSkill = (skillName: string): SkillLearningResource => {
  // Direct match or case-insensitive match
  const key = Object.keys(SKILL_LEARNING_GUIDES).find(
    (k) => k.toLowerCase() === skillName.toLowerCase()
  );

  if (key && SKILL_LEARNING_GUIDES[key]) {
    return SKILL_LEARNING_GUIDES[key];
  }

  // Fallback dynamic generator for any skill in mock data
  return {
    skill: skillName,
    category: 'Frameworks & Libraries',
    importance: 'High',
    estimatedWeeks: 2,
    description: `Core competency required for modern technology and engineering teams working with ${skillName}.`,
    keyTopics: [
      `Foundations & Architecture of ${skillName}`,
      `Industry Best Practices and Design Patterns`,
      `Integration with backend services and APIs`,
      `Debugging, performance profiling, and optimization`
    ],
    recommendedProject: `Build a portfolio project that demonstrates hands-on implementation of ${skillName}.`,
    freeResources: [
      { title: `${skillName} Official Documentation`, type: 'Documentation', url: 'https://google.com' },
      { title: `freeCodeCamp ${skillName} Guides`, type: 'Interactive', url: 'https://freecodecamp.org' }
    ]
  };
};
