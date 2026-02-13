import { FlaggedItem } from '../types';

const QUEUE_KEY = 'se_architect_moderation_queue';
const AUDIT_LOG_KEY = 'se_architect_moderation_audit';

export interface AuditLogEntry {
  id: string;
  itemId: string;
  adminId: string;
  action: 'Approved' | 'Rejected' | 'PII_MASKED';
  timestamp: number;
  reason?: string;
}

export const moderationService = {
  getQueue: (): FlaggedItem[] => {
    const stored = localStorage.getItem(QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  flagContent: (user: string, content: string, reason: FlaggedItem['reason']): void => {
    let safeContent = content;
    let piiDetected = false;

    // 1. Email Redaction
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    if (emailRegex.test(safeContent)) {
      safeContent = safeContent.replace(emailRegex, '[EMAIL REDACTED]');
      piiDetected = true;
    }

    // 2. Phone Redaction (Basic US/International format)
    const phoneRegex = /\b(\+?1?[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}\b/g;
    if (phoneRegex.test(safeContent)) {
      safeContent = safeContent.replace(phoneRegex, '[PHONE REDACTED]');
      piiDetected = true;
    }
    
    // 3. IP Address Redaction (IPv4)
    const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
    if (ipRegex.test(safeContent)) {
      safeContent = safeContent.replace(ipRegex, '[IP REDACTED]');
      piiDetected = true;
    }

    const queue = moderationService.getQueue();
    const id = Math.random().toString(36).substr(2, 9);

    const newItem: FlaggedItem = {
      id,
      user,
      content: safeContent,
      reason,
      severity: reason === 'Hate Speech' ? 'High' : 'Medium',
      timestamp: Date.now(),
      status: 'Pending'
    };
    localStorage.setItem(QUEUE_KEY, JSON.stringify([...queue, newItem]));

    // Log PII action to audit trail
    if (piiDetected) {
      const logs: AuditLogEntry[] = JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]');
      const newLog: AuditLogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        itemId: id,
        adminId: 'SYSTEM_PRIVACY_GUARD',
        action: 'PII_MASKED',
        timestamp: Date.now(),
        reason: 'Automated redaction of sensitive data pattern (GDPR/CCPA Safety).'
      };
      localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify([...logs, newLog]));
    }
  },

  processItem: (itemId: string, adminId: string, status: 'Approved' | 'Rejected'): void => {
    const queue = moderationService.getQueue();
    const index = queue.findIndex(i => i.id === itemId);
    
    if (index !== -1) {
      queue[index].status = status;
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
      
      // Log for audit purposes
      const logs: AuditLogEntry[] = JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]');
      const newLog: AuditLogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        itemId,
        adminId,
        action: status,
        timestamp: Date.now()
      };
      localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify([...logs, newLog]));
    }
  },

  getAuditLogs: (): AuditLogEntry[] => {
    const stored = localStorage.getItem(AUDIT_LOG_KEY);
    return stored ? JSON.parse(stored) : [];
  }
};