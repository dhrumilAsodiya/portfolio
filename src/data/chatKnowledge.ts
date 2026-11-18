import { PORTFOLIO_PROFILE, PROJECTS, FAQS, SKILLS_MATRIX, TIMELINE_MILESTONES } from './siteData';

/**
 * Concise, LLM-friendly knowledge base extracted from the portfolio's siteData.
 * Only include what the chatbot needs to answer visitor questions about Dhrumil.
 */

export const CHAT_KNOWLEDGE = {
  profile: {
    name: PORTFOLIO_PROFILE.fullName,
    role: PORTFOLIO_PROFILE.role,
    location: PORTFOLIO_PROFILE.location,
    availability: PORTFOLIO_PROFILE.availability,
    email: PORTFOLIO_PROFILE.email,
    bio: PORTFOLIO_PROFILE.bioShort,
    tagline: PORTFOLIO_PROFILE.tagline,
    github: PORTFOLIO_PROFILE.githubUrl,
    linkedin: PORTFOLIO_PROFILE.linkedinUrl,
    resume: PORTFOLIO_PROFILE.resumeHref,
  },
  skills: SKILLS_MATRIX.map((s) => ({
    name: s.name,
    domain: s.domain,
    proficiency: s.proficiency,
    years: s.years,
    focus: s.focus,
    project: s.projectName,
  })),
  projects: PROJECTS.map((p) => ({
    id: p.id,
    title: p.title,
    index: p.index,
    category: p.category,
    year: p.year,
    role: p.role,
    description: p.description,
    stack: p.stack.join(', '),
    outcome: p.outcome,
    repoUrl: p.repoUrl,
  })),
  faqs: FAQS.map((f) => ({
    question: f.question,
    answer: f.answer,
  })),
  timeline: TIMELINE_MILESTONES.map((t) => ({
    year: t.year,
    title: t.title,
    organization: t.organization,
    summary: t.summary,
    skillsUnlocked: t.skillsUnlocked.join(', '),
  })),
} as const;

export const CHAT_SYSTEM_PROMPT = `
You are Dhrumil Asodiya's portfolio assistant. You only answer questions about Dhrumil Asodiya — his background, skills, projects, experience, education, and how to contact him.

Do NOT answer questions about anything else (politics, general coding help unrelated to Dhrumil's work, other people, etc.). If asked something outside this scope, politely decline using the fallback message below.

Use the provided knowledge base to answer accurately. Keep responses concise, friendly, and professional. If you don't know something from the knowledge base, say you don't have that information and suggest emailing.

Fallback message for off-topic or unknown questions:
"I am trained to answer limited questions about Dhrumil, and nothing else. Email me at dhrumilasodiya@gmail.com"

Contact details to share when asked:
- Email: dhrumilasodiya@gmail.com
- GitHub: https://github.com/dhrumilAsodiya
- LinkedIn: https://www.linkedin.com/in/dhrumil-asodiya-cs2026
- Resume: /assets/Dhrumil_Resume.pdf

Knowledge base:
${JSON.stringify(CHAT_KNOWLEDGE, null, 2)}
`.trim();

export const FALLBACK_MESSAGE =
  'I am trained to answer limited questions about Dhrumil, and nothing else. Email me at dhrumilasodiya@gmail.com';
