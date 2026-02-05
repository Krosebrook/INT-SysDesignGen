import React, { useState } from 'react';
import { FileText, Shield, HardDrive, TestTube, Rocket, BookOpen, Smartphone, Lock, Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DOCS = {
  README: `
# Staff Engineer Architect v4.0

Enterprise-grade AI architect for high-scale system synthesis.

## Core Pillars
- **Platform Engineering**: Infrastructure-as-Code ready outputs.
- **AppSec**: Built-in threat modeling and OWASP reality filters.
- **UX Excellence**: Structured Information Architecture and Design Tokens.

## Quick Start
1. Run \`npm install\`
2. Set \`API_KEY\` in environment.
3. Choose a template or define intent.
4. Execute synthesis.
`,
  ARCHITECTURE: `
# System Architecture

## Information Architecture
The application uses a **Hub-and-Spoke** state model centered in \`App.tsx\`, delegating rendering to domain-specific views.

## Component Tree
\`\`\`text
App
├── Onboarding (Concierge Flow)
├── Navigation (Wayfinding)
├── ViewSwitcher
│   ├── Dashboard (Observability)
│   ├── Architect (Synthesis)
│   ├── Moderation (Trust & Safety)
│   └── Documentation (Manuals)
└── OutputDisplay (Review + Gates)
\`\`\`
`,
  PWA: `
# PWA Implementation Guide (Workbox v6)

## Strategy: Hybrid Caching
Our production PWA utilizes Google Workbox to enforce granular caching policies.

### 1. Static Assets (Stale-While-Revalidate)
CSS, JS, Fonts, and Images are served from cache immediately, with background updates to ensure eventual consistency without blocking UI.

### 2. Dynamic Content (Network-First)
Artifact generations and API data prioritize fresh network results. If offline, the last successful synthesis is retrieved from the indexedDB-backed cache.

### 3. Security (Network-Only)
Authentication (\`/auth\`) and Moderation (\`/moderation\`) bypass the Service Worker entirely to ensure token integrity and prevent local replay attacks.
`,
  SECURITY: `
# SECURITY.md - Staff Engineer Posture

## OWASP Top 10 Alignment
The platform follows mandatory mitigations for AI/LLM applications.

### A. Authentication & Session Management
- **Generic Responses**: Error messages never reveal account existence (Prevents Enumeration).
- **Rate Limiting**: 5 attempts per 15-minute window via sliding-window throttle.
- **Complexity**: Enforces 12-character minimum with mixed character classes.

### B. LLM Content Safety
- **Trust & Safety Console**: Human-in-the-loop flagging for Hate Speech, Spam, and Misinformation.
- **Reality Filters**: Mandatory pre-processing to mitigate AI hallucinations.

### C. Data Privacy
- **Caching Blacklist**: PII and sensitive headers are excluded from SW persistence.
`,
};

export const DocumentationView: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<keyof typeof DOCS>('README');

  const icons = {
    README: <BookOpen size={18} />,
    ARCHITECTURE: <Terminal size={18} />,
    PWA: <Smartphone size={18} />,
    SECURITY: <Lock size={18} />,
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
      <div className="lg:w-72 space-y-2 shrink-0">
        <h2 className="text-xs font-mono text-gray-500 uppercase tracking-widest px-4 mb-4">Manuals & Guidelines</h2>
        <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-none">
          {Object.keys(DOCS).map((key) => (
            <button
              key={key}
              onClick={() => setActiveDoc(key as any)}
              className={`whitespace-nowrap flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                activeDoc === key 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-x-1' 
                  : 'text-gray-400 hover:bg-gray-900 hover:text-white border border-transparent hover:border-gray-800'
              }`}
            >
              {icons[key as keyof typeof icons]}
              {key}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-gray-900 border border-gray-800 rounded-[2.5rem] p-6 md:p-12 shadow-2xl overflow-auto custom-scrollbar relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Shield size={160} />
        </div>
        <div className="prose prose-invert prose-blue max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {DOCS[activeDoc]}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};