import featureFormbuilder from '@/src/assets/core/feature-formbuilder.jpg';
import featureConnect from '@/src/assets/core/feature-connect.webp';
import featureDelegate from '@/src/assets/core/feature-delegate.webp';
import featureMemory from '@/src/assets/core/feature-memory.webp';
import featureSandbox from '@/src/assets/core/feature-sandbox.webp';
import featureSearch from '@/src/assets/core/feature-search.webp';

export const PORTFOLIO_PROFILE = {
  firstName: 'Dhrumil',
  lastName: 'Asodiya',
  fullName: 'Dhrumil Asodiya',
  role: 'Full-Stack Software Engineer',
  location: 'Ahmedabad, Gujarat, India · Remote',
  availability: 'Open for Full-Time Roles & Contract Work',
  email: 'dhrumilasodiya@gmail.com',
  tagline: 'CS Graduate building scalable full-stack applications with Java, Spring Boot, Next.js, and PostgreSQL.',
  bioShort:
    'Building full-stack web applications with Java, Spring Boot, Next.js, and PostgreSQL. Experience with enterprise architectures, dynamic form builders, desktop applications, and modern microservices.',
  resumeHref: '/assets/Dhrumil_Resume.pdf',
  githubUrl: 'https://github.com/dhrumilAsodiya',
  xUrl: undefined,
  linkedinUrl: 'https://www.linkedin.com/in/dhrumil-asodiya-cs2026',
};

export type NavTarget = 'About' | 'Work' | 'Connect';

export interface NavMenuItem {
  label: string;
  mutedPrefix?: string;
  href: string;
  description: string;
  external?: boolean;
}

export interface NavSection {
  category: string;
  heading: string;
  items: NavMenuItem[];
}

export const NAV_MENUS: Record<NavTarget, NavSection[]> = {
  About: [
    {
      category: 'Profile',
      heading: 'Dhrumil',
      items: [
        { label: 'Overview', href: '#top', description: 'Background and focus areas' },
        { label: 'Skill Map', href: '#skills', description: 'Interactive radar & depth matrix' },
        { label: 'Progress Timeline', href: '#timeline', description: '2022–2026 career & craft trajectory' },
        { label: 'FAQs', href: '#faqs', description: 'How I work with teams' },
      ],
    },
    {
      category: 'Credentials',
      heading: 'CV',
      items: [
        { label: 'View Capabilities', href: '#experience', description: 'Full stack & engagement overview' },
      ],
    },
  ],
  Work: [
    {
      category: 'Project Gallery',
      heading: 'Projects',
      items: [
        { label: 'FormBuilder3', mutedPrefix: '01 ', href: '#project-formbuilder', description: 'Enterprise configuration-driven form builder' },
        { label: 'Career Compass', mutedPrefix: '02 ', href: '#project-career-compass', description: 'Data-driven career guidance platform' },
        { label: 'Second Brain Notepad', mutedPrefix: '03 ', href: '#project-second-brain', description: 'Tauri v2 + Rust local-first notes' },
        { label: 'New CMS', mutedPrefix: '04 ', href: '#project-new-cms', description: 'Modular Spring Boot microservices platform' },
        { label: 'Finanger', mutedPrefix: '05 ', href: '#project-finanger', description: 'Full-stack personal finance platform' },
        { label: 'Attendance Management', mutedPrefix: '06 ', href: '#project-attendance', description: 'Student & employee attendance tracker' },
      ],
    },
    {
      category: 'Stack',
      heading: 'Explore',
      items: [
        { label: 'Core Disciplines', mutedPrefix: 'For ', href: '#disciplines', description: 'Frontend, backend systems & infrastructure' },
        { label: 'Skill Visualization', mutedPrefix: 'For ', href: '#skills', description: 'Capability radar & proficiency bars' },
        { label: 'Career Timeline', mutedPrefix: 'For ', href: '#timeline', description: 'Progression from 2022 to present' },
      ],
    },
  ],
  Connect: [
    {
      category: 'Channels',
      heading: 'Reach Out',
      items: [
        { label: 'Send Message', href: '#experience', description: 'Open quick contact form' },
        { label: 'GitHub', mutedPrefix: 'Go to ', href: 'https://github.com/dhrumilAsodiya', description: 'Open source repositories', external: true },
        { label: 'LinkedIn', mutedPrefix: 'Go to ', href: 'https://www.linkedin.com/in/dhrumil-asodiya-cs2026', description: 'Work history & recommendations', external: true },
      ],
    },
  ],
};

export type QuickTabKey = 'bio' | 'stack' | 'contact';

export const QUICK_TABS: Record<QuickTabKey, { label: string; command: string }> = {
  bio: {
    label: 'bio',
    command: 'CS Graduate building scalable full-stack applications with Java, Spring Boot, Next.js, and PostgreSQL.',
  },
  stack: {
    label: 'stack',
    command: 'Java · Spring Boot · Next.js · PostgreSQL · Python · Node.js',
  },
  contact: {
    label: 'contact',
    command: 'dhrumilasodiya@gmail.com',
  },
};

export const WORK_QUICK_JUMP = [
  {
    label: 'Project Gallery (01–06)',
    sublabel: 'Filterable showcase with lightbox case studies',
    href: '#projects',
  },
  {
    label: 'Skill Visualization',
    sublabel: 'Interactive capability radar & technical depth',
    href: '#skills',
  },
  {
    label: 'Progress Timeline',
    sublabel: '2022–2026 milestones & engineering trajectory',
    href: '#timeline',
  },
  {
    label: 'Availability & Engagement',
    sublabel: 'Advisory, Contract & Full-Time',
    href: '#experience',
  },
];

export type ProjectCategory = 'All' | 'Enterprise Systems' | 'Frontend & UI' | 'Infrastructure';

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'All',
  'Enterprise Systems',
  'Frontend & UI',
  'Infrastructure',
];

export interface ProjectItem {
  id: string;
  index: string;
  category: Exclude<ProjectCategory, 'All'>;
  year: string;
  role: string;
  kicker: string;
  title: string;
  description: string;
  architecture: string;
  outcome: string;
  metricLabel: string;
  metricValue: string;
  stack: string[];
  image: string;
  artClass: string;
  repoUrl: string;
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'formbuilder',
    index: '01',
    category: 'Enterprise Systems',
    year: '2026',
    role: 'Lead Full-Stack Engineer',
    kicker: '#1 Enterprise Systems · Spring Boot 3 / PostgreSQL',
    title: 'FormBuilder3',
    description:
      'Enterprise-grade, configuration-driven form builder built as a GTU final-year project and internship deliverable. Eliminates custom development work for every new data-capture form.',
    architecture:
      'Spring Boot 3 backend with automatic versioned PostgreSQL table generation per published form, a no-code IF-THEN rule engine (6+ operators) evaluated on both client and server, multi-step workflow/approval engine with RBAC (ADMIN/MENTOR/INTERN), and endpoint-level @PreAuthorize security.',
    outcome:
      'Reduced per-form development effort from days to minutes; 16 database entities, 50+ API endpoints, 100+ backend classes, production-ready with security audit and testing guides.',
    metricLabel: 'API Endpoints',
    metricValue: '50+',
    stack: ['Spring Boot 3', 'Java 21', 'Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'Zustand'],
    image: featureFormbuilder,
    artClass: 'landing-feature-art--feature-automation',
    repoUrl: 'https://github.com/dhrumilAsodiya/Formbuilder3',
  },
  {
    id: 'career-compass',
    index: '02',
    category: 'Enterprise Systems',
    year: '2026',
    role: 'Full-Stack Engineer',
    kicker: '#2 Enterprise Systems · Spring Boot / Java',
    title: 'Career Compass',
    description:
      'Career guidance system built with Spring Boot, helping students and professionals navigate career paths with data-driven recommendations.',
    architecture:
      'Spring Boot backend with REST API design, Java-based business logic, Docker containerization, and a structured data model for career pathway mapping.',
    outcome:
      'Delivered a production-ready career guidance platform with clean architecture and deployment-ready Docker configuration.',
    metricLabel: 'Commits',
    metricValue: '14+',
    stack: ['Spring Boot', 'Java', 'Docker', 'Maven'],
    image: featureMemory,
    artClass: 'landing-feature-art--feature-memory',
    repoUrl: 'https://github.com/dhrumilAsodiya/Career-Compass_Final',
  },
  {
    id: 'second-brain',
    index: '03',
    category: 'Infrastructure',
    year: '2026',
    role: 'Full-Stack Developer',
    kicker: '#3 Infrastructure · Tauri v2 / Rust',
    title: 'Second Brain Notepad',
    description:
      'Windows desktop application built with Tauri v2 (Rust backend) and TypeScript/React frontend. Features SQLite persistence, global hotkey capture, browser extension integration, and a vault-based note organization system.',
    architecture:
      'Tauri v2 desktop shell with Rust backend, SQLite database with migrations, React 19 + Vite frontend, native messaging for browser extension, global hotkey (Ctrl+Shift+S) capture, and portable Windows distribution.',
    outcome:
      '22 of 28 implementation steps complete — includes continuous autosave, session restore, vault search/filter, clipboard service, Chrome/Edge extension, and portable NSIS installer build.',
    metricLabel: 'Implementation Steps',
    metricValue: '22/28',
    stack: ['Tauri v2', 'Rust', 'React 19', 'TypeScript', 'Vite', 'SQLite'],
    image: featureSandbox,
    artClass: 'landing-feature-art--feature-sandbox',
    repoUrl: 'https://github.com/dhrumilAsodiya/second_brain_notepad',
  },
  {
    id: 'new-cms',
    index: '04',
    category: 'Infrastructure',
    year: '2026',
    role: 'Platform Architect',
    kicker: '#4 Infrastructure · Spring Boot Microservices',
    title: 'New CMS',
    description:
      'Modular CMS platform architected as a suite of Spring Boot microservices — gateway, content, media, IAM, workflow, schema, search, audit, form, and notification services.',
    architecture:
      'Spring Boot microservices architecture with API gateway, service-to-service communication, database-per-service pattern, Docker Compose orchestration, and phased implementation plan across three phases.',
    outcome:
      'Designed a complete multi-service CMS architecture with 11+ services, CI/CD scripts, database structure documentation, and service startup/shutdown automation.',
    metricLabel: 'Microservices',
    metricValue: '11+',
    stack: ['Spring Boot', 'Java', 'Docker', 'PostgreSQL', 'Microservices'],
    image: featureDelegate,
    artClass: 'landing-feature-art--feature-delegate',
    repoUrl: 'https://github.com/dhrumilAsodiya/new_cms',
  },
  {
    id: 'finanger',
    index: '05',
    category: 'Frontend & UI',
    year: '2026',
    role: 'Full-Stack Developer',
    kicker: '#5 Frontend & UI · Spring Boot / Next.js',
    title: 'Finanger',
    description:
      'Full-stack personal finance management platform with JWT-secured per-user data isolation, transaction management, and dashboard analytics.',
    architecture:
      'Spring Boot backend with Spring Security and Clerk OAuth2 for authentication, REST APIs scoped to authenticated user JWT claims, Next.js frontend with Tailwind CSS, Shadcn UI, and Recharts for data visualization, deployed on Vercel.',
    outcome:
      'Live production deployment at finanger.vercel.app with end-to-end testing, responsive UI, and strict per-user data isolation via JWT claim-based query scoping.',
    metricLabel: 'Live Deployment',
    metricValue: 'Vercel',
    stack: ['Spring Boot', 'Java 11+', 'Next.js 14', 'TypeScript', 'Tailwind CSS', 'Shadcn UI', 'Recharts', 'PostgreSQL'],
    image: featureConnect,
    artClass: 'landing-feature-art--feature-connect',
    repoUrl: 'https://github.com/dhrumilAsodiya/finanger',
  },
  {
    id: 'attendance',
    index: '06',
    category: 'Frontend & UI',
    year: '2025',
    role: 'Java Developer',
    kicker: '#6 Frontend & UI · Java 100%',
    title: 'Attendance Management System',
    description:
      'Attendance tracking system built entirely in Java, managing student/employee attendance records with a focus on simplicity and reliability.',
    architecture:
      'Java-based application with modular code structure for attendance tracking, record management, and report generation.',
    outcome:
      'Delivered a clean, maintainable Java application for attendance management with straightforward data handling and reporting.',
    metricLabel: 'Language',
    metricValue: 'Java 100%',
    stack: ['Java'],
    image: featureSearch,
    artClass: 'landing-feature-art--feature-search',
    repoUrl: 'https://github.com/dhrumilAsodiya/AttendanceManagementSystem',
  },
];

/* Skill Visualization Data */
export type SkillDomain = 'All' | 'Frontend & UI' | 'AI-Assisted Dev' | 'Backend & Infra';

export const SKILL_DOMAINS: SkillDomain[] = [
  'All',
  'Frontend & UI',
  'AI-Assisted Dev',
  'Backend & Infra',
];

export interface RadarAxis {
  id: string;
  label: string;
  shortLabel: string;
  level: number; // 0 to 100 scale
  years: string;
  domain: Exclude<SkillDomain, 'All'>;
  summary: string;
}

export const RADAR_AXES: RadarAxis[] = [
  {
    id: 'java-spring',
    label: 'Java & Spring Boot',
    shortLabel: 'Java',
    level: 92,
    years: '2 yrs',
    domain: 'Backend & Infra',
    summary: 'Spring Boot, Spring Security, REST APIs, RBAC, JWT authentication, multi-tenant architectures.',
  },
  {
    id: 'nextjs-react',
    label: 'Next.js & React',
    shortLabel: 'Frontend',
    level: 88,
    years: '1 yr',
    domain: 'Frontend & UI',
    summary: 'Next.js App Router, React 19, TypeScript, Tailwind CSS, Shadcn UI, responsive design.',
  },
  {
    id: 'postgresql-sql',
    label: 'PostgreSQL & SQL',
    shortLabel: 'Databases',
    level: 85,
    years: '2 yrs',
    domain: 'Backend & Infra',
    summary: 'PostgreSQL, MySQL, schema design, queries, JPA/Hibernate.',
  },
  {
    id: 'python-node',
    label: 'Python & Node.js',
    shortLabel: 'Python/Node',
    level: 80,
    years: '1 yr',
    domain: 'Backend & Infra',
    summary: 'Python, Django, FastAPI, Node.js, Express.js — learned during Ranucle internship.',
  },
  {
    id: 'ai-workflows',
    label: 'AI-Assisted Development',
    shortLabel: 'AI Tools',
    level: 78,
    years: '1 yr',
    domain: 'AI-Assisted Dev',
    summary: 'Claude Code, Gemini, Antigravity, structured prompting workflows.',
  },
  {
    id: 'devops-tools',
    label: 'DevOps & Tools',
    shortLabel: 'DevOps',
    level: 75,
    years: '1 yrs',
    domain: 'Backend & Infra',
    summary: 'Git, GitHub, Docker, Vercel, VS Code, IntelliJ IDEA.',
  },
];

export interface SkillMatrixItem {
  id: string;
  name: string;
  domain: Exclude<SkillDomain, 'All'>;
  axisId: string;
  proficiency: number; // 0 to 100
  years: string;
  focus: string;
  projectId: string;
  projectName: string;
}

export const SKILLS_MATRIX: SkillMatrixItem[] = [
  {
    id: 'java-springboot',
    name: 'Java & Spring Boot',
    domain: 'Backend & Infra',
    axisId: 'java-spring',
    proficiency: 92,
    years: '2 yrs',
    focus: 'Spring Boot, Spring Security, REST APIs, RBAC, JWT',
    projectId: 'formbuilder',
    projectName: 'FormBuilder3',
  },
  {
    id: 'nextjs-react',
    name: 'Next.js & React',
    domain: 'Frontend & UI',
    axisId: 'nextjs-react',
    proficiency: 88,
    years: '2 yrs',
    focus: 'App Router, TypeScript, Tailwind, Shadcn UI',
    projectId: 'finanger',
    projectName: 'Finanger',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL & SQL',
    domain: 'Backend & Infra',
    axisId: 'postgresql-sql',
    proficiency: 85,
    years: '2 yrs',
    focus: 'Schema design, queries, JPA/Hibernate',
    projectId: 'formbuilder',
    projectName: 'FormBuilder3',
  },
  {
    id: 'python-node',
    name: 'Python & Node.js',
    domain: 'Backend & Infra',
    axisId: 'python-node',
    proficiency: 80,
    years: '1 yr',
    focus: 'Python, Django, FastAPI, Node.js, Express.js',
    projectId: 'attendance',
    projectName: 'Attendance Management System',
  },
  {
    id: 'ai-assisted-dev',
    name: 'AI-Assisted Development',
    domain: 'AI-Assisted Dev',
    axisId: 'ai-workflows',
    proficiency: 78,
    years: '1 yr',
    focus: 'Claude Code, Gemini, Antigravity',
    projectId: 'new-cms',
    projectName: 'New CMS',
  },
  {
    id: 'devops-git',
    name: 'DevOps & Tools',
    domain: 'Backend & Infra',
    axisId: 'devops-tools',
    proficiency: 75,
    years: '2 yrs',
    focus: 'Git, GitHub, Docker, Vercel',
    projectId: 'finanger',
    projectName: 'Finanger',
  },
];

/* Progress Timeline Data */
export type TimelineTrack = 'All' | 'Roles' | 'Shipped Systems' | 'Foundations';

export const TIMELINE_TRACKS: TimelineTrack[] = [
  'All',
  'Roles',
  'Shipped Systems',
  'Foundations',
];

export interface TimelineMilestone {
  id: string;
  year: string;
  period: string;
  track: Exclude<TimelineTrack, 'All'>;
  stage: string;
  title: string;
  organization: string;
  summary: string;
  outcomes: string[];
  skillsUnlocked: string[];
  progressIndex: number; // 1 to 6
}

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    id: 'm-2022',
    year: '2022',
    period: '2022 — 2026',
    track: 'Foundations',
    stage: 'Stage 01 · Engineering Degree',
    title: 'Bachelor of Computer Engineering',
    organization: 'Government Engineering College, PATAN · GTU',
    summary:
      'Enrolled in Computer Engineering under Gujarat Technological University (GTU), mastering systems-level programming in C, database architecture, and Spring Boot enterprise applications.',
    outcomes: [
      'Strengthened systems programming foundations in C and computer engineering core domains.',
      'Engineered relational database models with SQL & PostgreSQL, transitioning into Spring Boot services.',
    ],
    skillsUnlocked: ['Computer Engineering', 'C (Programming Language)', 'Spring Boot', 'SQL', 'PostgreSQL'],
    progressIndex: 1,
  },
  {
    id: 'm-2026-silver',
    year: '2026',
    period: 'Jan 2026 — Jun 2026',
    track: 'Roles',
    stage: 'Stage 02 · Enterprise Modernization',
    title: 'Software Engineer Intern',
    organization: 'Silver Touch Technologies Ltd · Java Department',
    summary:
      'Modernized legacy enterprise government infrastructure, spearheaded full UI/UX overhaul of admin panel V2, and established AI-assisted development workflows across the engineering team.',
    outcomes: [
      'Analyzed legacy Java/JSP government codebase to map full request lifecycles, resolving structural security gaps and dependency conflicts.',
      'Overhauled admin panel V2 by rewriting 80+ JSP pages on a custom-built CSS design system and fixing critical drag-and-drop menu plugins.',
      'Pioneered adoption of AI-assisted engineering workflows (Claude Code, Gemini, Antigravity) with structured prompting presentations.',
    ],
    skillsUnlocked: ['Java & Spring', 'Legacy Modernization', 'JSP Overhaul', 'REST APIs', 'Gemini & Antigravity'],
    progressIndex: 2,
  },
  {
    id: 'm-2026-ranucle-intern',
    year: '2026',
    period: 'Aug 2026 — Nov 2026',
    track: 'Shipped Systems',
    stage: 'Stage 03 · Microservices & APIs',
    title: 'Software Engineer Intern',
    organization: 'Ranucle · Gandhinagar',
    summary:
      'Engineered high-throughput backend services and distributed microservices across modern Python, Django, FastAPI, and Node.js ecosystems.',
    outcomes: [
      'Designed and deployed modular RESTful APIs using Python, Django, FastAPI, and Flask with MongoDB database storage.',
      'Implemented client-server architectures with Node.js and Express.js, optimizing server latency and authentication flows.',
    ],
    skillsUnlocked: ['Python & Django', 'FastAPI & Flask', 'Node.js & Express.js', 'MongoDB', 'API Development'],
    progressIndex: 3,
  },
  {
    id: 'm-2026-ranucle-eng',
    year: '2026',
    period: 'Nov 2026 — Present',
    track: 'Roles',
    stage: 'Stage 04 · Production Engineering',
    title: 'Software Engineer',
    organization: 'Ranucle · Gandhinagar (On-site)',
    summary:
      'Driving production-grade full-stack systems engineering, scalable client-server architectures, and mission-critical cloud deployments.',
    outcomes: [
      'Architecting scalable production applications integrating modern frontend frameworks (Next.js, HTML5) with high-performance backend microservices.',
      'Managing end-to-end software development lifecycle, technical project leadership, debugging, and continuous cloud delivery pipelines.',
    ],
    skillsUnlocked: ['Scalable Architecture', 'Production APIs', 'Next.js', 'Technical Project Leadership', 'Cloud Development'],
    progressIndex: 4,
  },
];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    id: 'who',
    question: 'Who are you and what do you build?',
    answer:
      'I am Dhrumil Asodiya, a Computer Science Engineering graduate from Gujarat Technological University and a Full-Stack Software Engineer. I build scalable full-stack applications using Java, Spring Boot, Next.js, and PostgreSQL, with experience in enterprise architectures, dynamic form builders, desktop applications, and modern microservices.',
  },
  {
    id: 'stack',
    question: 'What is your core technical stack?',
    answer:
      'Languages: Java, JavaScript (ES6+), TypeScript, C, SQL. Backend: Spring Boot, Spring Security, REST API Design, RBAC. Frontend: Next.js, React, JSP, HTML5, CSS3. Databases: PostgreSQL, MySQL. Tools: Git, GitHub, VS Code, IntelliJ IDEA. AI-assisted development with Claude Code, Gemini, and Antigravity.',
  },
  {
    id: 'availability',
    question: 'Are you open to full-time roles or consulting?',
    answer:
      'Yes — I am currently open to full-time Software Developer roles as well as contract work. I recently completed a 6-month software development internship at Silver Touch Technologies Ltd (Java Department) and am looking to leverage my skills in production-grade, high-performance systems.',
  },
  {
    id: 'approach',
    question: 'How do you approach product design and engineering?',
    answer:
      'I focus on clean architecture, security-first design (RBAC, JWT, endpoint-level authorization), and end-to-end ownership — from database design and REST APIs to responsive frontend UI and deployment. I also integrate AI-assisted development workflows to ship faster without compromising quality.',
  },
  {
    id: 'contact',
    question: 'How can we get in touch?',
    answer:
      'Use the Contact modal in the Experience & Roles section below, or email dhrumilasodiya@gmail.com directly with details about your team, timeline, and goals. You can also reach me on LinkedIn or GitHub.',
  },
];

export const FOOTER_COLUMNS = [
  {
    category: 'Profile',
    title: 'Dhrumil Asodiya',
    links: [
      { label: 'Overview', href: '#top' },
      { label: 'Project Gallery', href: '#projects' },
      { label: 'Skill Map', href: '#skills' },
      { label: 'Progress Timeline', href: '#timeline' },
      { label: 'Download Resume', href: '/assets/Dhrumil_Resume.pdf' },
    ],
  },
  {
    category: 'Work',
    title: 'Projects',
    links: [
      { label: 'FormBuilder3', href: '#project-formbuilder' },
      { label: 'Career Compass', href: '#project-career-compass' },
      { label: 'Second Brain Notepad', href: '#project-second-brain' },
      { label: 'New CMS', href: '#project-new-cms' },
      { label: 'Finanger', href: '#project-finanger' },
      { label: 'Attendance Management System', href: '#project-attendance' },
    ],
  },
  {
    category: 'Channels',
    title: 'Social',
    links: [
      { label: 'GitHub', prefix: 'Go to ', href: 'https://github.com/dhrumilAsodiya' },
      { label: 'LinkedIn', prefix: 'Go to ', href: 'https://www.linkedin.com/in/dhrumil-asodiya-cs2026' },
    ],
  },
  {
    category: 'Direct',
    title: 'Contact',
    links: [
      { label: 'dhrumilasodiya@gmail.com', href: 'mailto:dhrumilasodiya@gmail.com' },
      { label: 'Book Intro Call', href: '#experience' },
      { label: 'View Availability', href: '#experience' },
    ],
  },
];


