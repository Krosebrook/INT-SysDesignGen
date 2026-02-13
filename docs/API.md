# API Reference

## External Integrations

### Google Gemini API
The core intelligence engine.

**Endpoint**: `ai.models.generateContentStream`  
**Model**: `gemini-3-pro-preview` (High Risk) / `gemini-3-flash-preview` (Low Risk)

**Request Structure**:
```json
{
  "model": "gemini-3-pro-preview",
  "config": {
    "temperature": 0.7,
    "systemInstruction": "..."
  },
  "contents": [
    { "role": "user", "parts": [{ "text": "..." }] }
  ]
}
```

## Internal Services

### AuthService
`services/authService.ts`

- `signIn(email, password)`: Authenticates user, returns `UserProfile`.
- `signUp(name, email, password)`: Registers new user.
- `requestPasswordReset(email)`: Initiates recovery flow.

### ModerationService
`services/moderationService.ts`

- `flagContent(user, content, reason)`: Adds item to moderation queue.
- `getQueue()`: Returns list of pending `FlaggedItem`.
- `getAuditLogs()`: Returns immutable log of actions.

### GeminiService
`services/geminiService.ts`

- `streamArchitectureGeneration(request, callback)`: 
  - `request`: `{ task: string, context: string, activeFilters: RealityFilterType[] }`
  - `callback`: Function to handle streaming text chunks.
