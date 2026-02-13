# Architecture Overview

## System Context
Staff Engineer Architect is a client-side Single Page Application (SPA) that interacts directly with the Google Gemini API for architectural synthesis. It uses a **Hub-and-Spoke** navigation model centered around a persistent `App.tsx` shell.

## High-Level Design (C4 Level 2)

```mermaid
graph TD
    User[Staff Engineer] -->|HTTPS| PWA[PWA Client (React)]
    PWA -->|JSON/Stream| Gemini[Google Gemini API]
    PWA -->|Read/Write| Storage[Browser LocalStorage]
    PWA -->|Cache| SW[Service Worker]
```

## Core Components

### 1. The Shell (`App.tsx`)
Acts as the main controller. It manages:
- **Global State**: User session, navigation view, and synthesis context.
- **PWA Lifecycle**: Handles `beforeinstallprompt` and SW registration.
- **Routing**: Custom view switcher (Dashboard <-> Architect <-> Templates).

### 2. Services Layer
Decoupled logic handling specific business domains:
- **`geminiService`**: Manages streaming connections to Google GenAI. Handles prompt engineering and `META_PROMPT` injection.
- **`authService`**: Implements OWASP-aligned mock authentication (Argon2 simulation, Rate Limiting).
- **`moderationService`**: content governance, PII masking, and audit logging.

### 3. Reality Filters™ Engine
A middleware-like layer in the prompt construction that injects specific constraints (e.g., "Hallucination Mitigation", "Security Validation") into the LLM context window.

## State Management
We utilize **React State** for ephemeral UI data and **LocalStorage** for persistent user data.
- `se_architect_users`: User profile DB.
- `se_architect_session`: Active session token.
- `se_architect_moderation_queue`: Flagged content.

## PWA Strategy
The application uses a **Network-First** strategy for API calls and **Stale-While-Revalidate** for static assets.
See [DEPLOYMENT.md](DEPLOYMENT.md) for SW configuration details.
