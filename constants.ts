import { RealityFilterType, ProjectTemplate } from './types';

export const DESIGN_TOKENS = {
  colors: {
    primary: '#3b82f6', // blue-500
    secondary: '#8b5cf6', // violet-500
    background: '#0f172a', // slate-900
    surface: '#1e293b', // slate-800
    border: '#334155', // slate-700
  },
  radius: '0.75rem',
  shadows: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};

export const META_PROMPT_XML = `
<meta_prompt version="4.0">

<role_identity>
You are a Staff Platform + AppSec + UX Engineer. You produce production-ready repositories with full documentation, tests, and security guardrails.
</role_identity>

<core_directive>
Analyze repo/code first, then generate missing files only; do not rewrite unchanged files.
Include Implementation Considerations, Performance/Security Notes, and Recommended Next Steps.
Perform a CLAIMS CHECK for every significant output.

QualityScore = weighted(UX_Signal: 0.3, Security_Signal: 0.4, Performance_Signal: 0.3)
</core_directive>

<deliverable_structure>
  <phase name="audit">
    **Security & UX Audit**:
    - OWASP Top 10 Mapping
    - WCAG 2.1 AA Compliance Check
    - Latency Budget Analysis
  </phase>
  
  <phase name="implementation">
    **Artifacts**:
    - Complete, runnable file contents.
    - Input validation (zod-style logic).
    - Structured logging & observability hooks.
  </phase>
  
  <phase name="validation">
    **Quality Gates**:
    - Generate a "Quality Gate Status" table in markdown.
  </phase>
</deliverable_structure>

<output_format>
  ## Executive Summary
  ## Audit Report (UX / Security / Perf)
  ## File Structure
  ## Implementation Delts / Code
  ## Documentation (README, ARCHITECTURE, SECURITY)
  ## Quality Gate Table
  ## Footer (CLAIMS CHECK)
</output_format>

</meta_prompt>
`;

export const REALITY_FILTER_LABELS: Record<RealityFilterType, string> = {
  [RealityFilterType.HALLUCINATION_MITIGATION]: 'Hallucination Mitigation',
  [RealityFilterType.BRAND_VOICE_CONSISTENCY]: 'Brand Voice Consistency',
  [RealityFilterType.PLATFORM_ALGORITHM_AWARENESS]: 'Platform Algorithm Awareness',
  [RealityFilterType.SEO_VOLATILITY_SHIELD]: 'SEO Volatility Shield',
  [RealityFilterType.CONTENT_MODERATION]: 'Content Moderation',
  [RealityFilterType.MULTI_LANGUAGE_READINESS]: 'Multi-Language Readiness',
  [RealityFilterType.ACCESSIBILITY_BASELINE]: 'Accessibility Baseline',
  [RealityFilterType.SECURITY_VALIDATION]: 'Security Validation',
};

export const REALITY_FILTER_DESCRIPTIONS: Record<RealityFilterType, string> = {
  [RealityFilterType.HALLUCINATION_MITIGATION]: 'Requires citations and fact-check levels.',
  [RealityFilterType.BRAND_VOICE_CONSISTENCY]: 'Enforces tone and voice profiles.',
  [RealityFilterType.PLATFORM_ALGORITHM_AWARENESS]: 'Checks for stale platform best practices.',
  [RealityFilterType.SEO_VOLATILITY_SHIELD]: 'Prevents over-optimization and ensures evergreen content.',
  [RealityFilterType.CONTENT_MODERATION]: 'Flags sensitive topics and provides neutral rewrites.',
  [RealityFilterType.MULTI_LANGUAGE_READINESS]: 'Ensures templates support localization.',
  [RealityFilterType.ACCESSIBILITY_BASELINE]: 'Enforces WCAG 2.1 AA standards.',
  [RealityFilterType.SECURITY_VALIDATION]: 'OWASP compliance, input validation, and secrets management.',
};

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'staff-platform-v4',
    title: 'Platform + AppSec Core',
    description: 'The Golden Path for production-ready microservices or PWAs.',
    icon: 'Terminal',
    difficulty: 'Advanced',
    tags: ['Architecture', 'AppSec', 'UX'],
    prompt: `Analyze the project intent. Execute all 5 phases: UI Flow, IA, Production Codebase, Full Doc Suite, and Audit Report. Ensure SOC2/GDPR compliance hooks are included.`
  },
  {
    id: 'pwa-specialist',
    title: 'PWA Specialist',
    description: 'Refactor any repo into a production-grade PWA with Service Workers.',
    icon: 'Smartphone',
    difficulty: 'Advanced',
    tags: ['PWA', 'AppSec', 'Platform', 'Performance'],
    prompt: `Refactor repo for PWA excellence. Minimal diffs. Add Workbox. Deliver PWA.md and SECURITY.md.`
  },
  {
    id: 'trust-safety',
    title: 'Moderation System',
    description: 'Implement a Content Moderation System with flagging and admin review.',
    icon: 'Shield',
    difficulty: 'Intermediate',
    tags: ['Safety', 'Governance', 'Operations'],
    prompt: `Design a Content Moderation System with categories for Hate Speech, Spam, and Personal Attacks.`
  },
  {
    id: 'auth-identity',
    title: 'Identity Provider',
    description: 'Secure authentication system with magic links and MFA.',
    icon: 'Lock',
    difficulty: 'Intermediate',
    tags: ['Security', 'Auth', 'Identity'],
    prompt: `Build a production-ready Identity Provider with JWT session management and AppSec best practices.`
  }
];
