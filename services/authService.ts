import { UserProfile } from '../types';

const STORAGE_KEY = 'se_architect_users';
const SESSION_KEY = 'se_architect_session';
const RATE_LIMIT_KEY = 'se_architect_rate_limits';
const RESET_TOKEN_KEY = 'se_architect_reset_tokens';

interface StoredUser extends UserProfile {
  passwordHash: string;
}

interface RateLimitData {
  attempts: number;
  lastAttempt: number;
}

interface ResetTokenData {
  token: string;
  expires: number;
}

/**
 * Enterprise-grade Auth Service (OWASP-aligned)
 */
export const authService = {
  validateEmail: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  
  validatePassword: (password: string) => {
    const hasMinLength = password.length >= 12;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;
  },

  validateUrl: (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  checkRateLimit: (email: string): void => {
    const limits: Record<string, RateLimitData> = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}');
    const userLimit = limits[email];

    if (userLimit) {
      const now = Date.now();
      const timeDiff = now - userLimit.lastAttempt;
      
      // OWASP: 5 attempts max in 15 minutes (Sliding Window / Fixed Window Approximation)
      if (userLimit.attempts >= 5 && timeDiff < 15 * 60 * 1000) {
        throw new Error("Too many authentication attempts. Please wait 15 minutes before trying again.");
      }

      // Reset window if expired
      if (timeDiff > 15 * 60 * 1000) {
        userLimit.attempts = 0;
      }
    }
  },

  recordAttempt: (email: string, success: boolean): void => {
    const limits: Record<string, RateLimitData> = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}');
    const userLimit = limits[email] || { attempts: 0, lastAttempt: 0 };
    
    if (success) {
      userLimit.attempts = 0;
    } else {
      userLimit.attempts += 1;
    }
    
    userLimit.lastAttempt = Date.now();
    limits[email] = userLimit;
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(limits));
  },

  signUp: async (name: string, email: string, password: string): Promise<UserProfile> => {
    await new Promise(r => setTimeout(r, 1000));
    const users: StoredUser[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    if (users.find(u => u.email === email)) {
      // Generic error to prevent email enumeration
      throw new Error("Account registration failed. Please try a different email or sign in.");
    }

    const newUser: StoredUser = {
      name,
      email,
      passwordHash: btoa(password), // Simulation: Use actual Argon2/bcrypt in real backend
      role: 'Staff Engineer',
      lastLogin: Date.now(),
      hasCompletedOnboarding: false
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify([...users, newUser]));
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return newUser;
  },

  signIn: async (email: string, password: string): Promise<UserProfile> => {
    authService.checkRateLimit(email);
    await new Promise(r => setTimeout(r, 1200));

    const users: StoredUser[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const user = users.find(u => u.email === email && u.passwordHash === btoa(password));

    if (!user) {
      authService.recordAttempt(email, false);
      // OWASP generic error message
      throw new Error("Invalid credentials. Please verify your email and password.");
    }

    authService.recordAttempt(email, true);
    const sessionUser = { ...user, lastLogin: Date.now() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  signOut: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): UserProfile | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  updateProfile: async (email: string, updates: Partial<UserProfile>): Promise<UserProfile> => {
    await new Promise(r => setTimeout(r, 500));
    
    // Validate Avatar URL if present
    if (updates.avatar && !authService.validateUrl(updates.avatar)) {
      throw new Error("Invalid Avatar URL format.");
    }

    const users: StoredUser[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
      throw new Error("Identity conflict: Session invalid or user not found.");
    }

    const updatedUser = { ...users[userIndex], ...updates };
    users[userIndex] = updatedUser;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  },

  /**
   * Step 1: Request Password Reset
   * Returns a token for simulation purposes (would be sent via email in prod)
   */
  requestPasswordReset: async (email: string): Promise<string | null> => {
    await new Promise(r => setTimeout(r, 1000));
    
    const users: StoredUser[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const user = users.find(u => u.email === email);
    
    if (user) {
      const token = Math.random().toString(36).substring(2, 10).toUpperCase();
      const expires = Date.now() + 15 * 60 * 1000; // 15 minutes
      
      const tokens: Record<string, ResetTokenData> = JSON.parse(localStorage.getItem(RESET_TOKEN_KEY) || '{}');
      tokens[email] = { token, expires };
      localStorage.setItem(RESET_TOKEN_KEY, JSON.stringify(tokens));
      
      console.log(`[SIMULATION] Reset Token for ${email}: ${token}`);
      return token; 
    }
    // Always return success/null to prevent enumeration, UI handles the message
    return null;
  },

  /**
   * Step 2: Confirm Password Reset
   */
  confirmPasswordReset: async (email: string, token: string, newPassword: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 1000));
    
    const tokens: Record<string, ResetTokenData> = JSON.parse(localStorage.getItem(RESET_TOKEN_KEY) || '{}');
    const tokenData = tokens[email];

    if (!tokenData) {
      throw new Error("Invalid reset request.");
    }

    if (tokenData.token !== token) {
      throw new Error("Invalid token.");
    }

    if (Date.now() > tokenData.expires) {
      throw new Error("Token expired. Please request a new one.");
    }

    if (!authService.validatePassword(newPassword)) {
      throw new Error("Password must meet complexity requirements (12+ chars, mixed case, numbers, special chars).");
    }

    // Update User
    const users: StoredUser[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex !== -1) {
      users[userIndex].passwordHash = btoa(newPassword);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      
      // Cleanup
      delete tokens[email];
      localStorage.setItem(RESET_TOKEN_KEY, JSON.stringify(tokens));
    } else {
      throw new Error("User record not found.");
    }
  }
};