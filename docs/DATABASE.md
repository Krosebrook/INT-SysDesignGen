# Database Schema (LocalStorage)

The application uses `window.localStorage` as a document store. Below are the key keys and their schemas.

## Keys

### `se_architect_users`
Array of user profiles.

```typescript
interface StoredUser {
  email: string;        // Primary Key
  name: string;
  role: string;
  passwordHash: string; // Base64 encoded (Simulation)
  lastLogin: number;    // Timestamp
  avatar?: string;
  hasCompletedOnboarding: boolean;
}
```

### `se_architect_session`
Currently active user session.

```typescript
type Session = StoredUser; // Copy of user object
```

### `se_architect_moderation_queue`
Content flagged for review.

```typescript
interface FlaggedItem {
  id: string;           // UUID
  user: string;         // User Email
  content: string;      // The flagged text
  reason: 'Hate Speech' | 'Spam' | ...;
  severity: 'Low' | 'Medium' | 'High';
  timestamp: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}
```

### `se_architect_moderation_audit`
Immutable log of moderation actions.

```typescript
interface AuditLogEntry {
  id: string;
  itemId: string;       // Reference to FlaggedItem.id
  adminId: string;      // Actor
  action: 'Approved' | 'Rejected' | 'PII_MASKED';
  timestamp: number;
}
```

## Migrations
Since this is a client-side store, schema changes require defensive coding (e.g., optional chaining `?.`) in the service layer. No automatic migration runner is currently implemented.
