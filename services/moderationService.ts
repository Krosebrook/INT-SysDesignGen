import { FlaggedItem } from '../types';

const QUEUE_KEY = 'se_architect_moderation_queue';
const AUDIT_LOG_KEY = 'se_architect_moderation_audit';

export interface AuditLogEntry {
  id: string;
  itemId: string;
  adminId: string;
  action: 'Approved' | 'Rejected';
  timestamp: number;
  reason?: string;
}

export const moderationService = {
  getQueue: (): FlaggedItem[] => {
    const stored = localStorage.getItem(QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  flagContent: (user: string, content: string, reason: FlaggedItem['reason']): void => {
    const queue = moderationService.getQueue();
    const newItem: FlaggedItem = {
      id: Math.random().toString(36).substr(2, 9),
      user,
      content,
      reason,
      severity: reason === 'Hate Speech' ? 'High' : 'Medium',
      timestamp: Date.now(),
      status: 'Pending'
    };
    localStorage.setItem(QUEUE_KEY, JSON.stringify([...queue, newItem]));
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