import React, { useState, useEffect } from 'react';
import { FlaggedItem } from '../types';
import { CheckCircle2, XCircle, AlertTriangle, MessageSquare, Clock, Filter, ShieldAlert, History, User } from 'lucide-react';
import { moderationService, AuditLogEntry } from '../services/moderationService';

export const ModerationQueue: React.FC = () => {
  const [items, setItems] = useState<FlaggedItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    setItems(moderationService.getQueue());
    setAuditLogs(moderationService.getAuditLogs());
  }, []);

  const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
    moderationService.processItem(id, 'admin_system', action);
    setItems(moderationService.getQueue());
    setAuditLogs(moderationService.getAuditLogs());
  };

  const filteredItems = items.filter(item => filter === 'All' ? true : item.status === filter);

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'High': return 'text-red-400 bg-red-950/30 border-red-900/50';
      case 'Medium': return 'text-yellow-400 bg-yellow-950/30 border-yellow-900/50';
      case 'Low': return 'text-blue-400 bg-blue-950/30 border-blue-900/50';
      default: return 'text-gray-400 bg-gray-900 border-gray-800';
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white mb-3 flex items-center gap-3 tracking-tight">
            <div className="bg-red-600/20 p-2 rounded-xl border border-red-500/20">
              <ShieldAlert className="text-red-500" size={24} />
            </div>
            Trust & Safety
          </h2>
          <p className="text-gray-400 text-lg">Governance console for platform content moderation and safety audits.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <button 
            onClick={() => setShowLogs(!showLogs)}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border shadow-sm ${showLogs ? 'bg-blue-600 border-blue-500 text-white shadow-blue-900/20' : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'}`}
          >
            <History size={18} />
            {showLogs ? 'Return to Queue' : 'Audit Logs'}
          </button>
          
          <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-800 w-full sm:w-auto">
            {['All', 'Pending', 'Approved', 'Rejected'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  filter === f ? 'bg-gray-800 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showLogs ? (
        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-950 text-gray-500 uppercase font-mono text-[10px] tracking-widest border-b border-gray-800">
                <tr>
                  <th className="px-8 py-5">Event Timestamp</th>
                  <th className="px-8 py-5">Entity ID</th>
                  <th className="px-8 py-5">Safety Action</th>
                  <th className="px-8 py-5">Moderator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-gray-600 text-base italic">Zero audit records found in the vault.</td>
                  </tr>
                ) : (
                  auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-850 transition-colors">
                      <td className="px-8 py-5 text-gray-400 font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-8 py-5 text-gray-300 font-mono text-xs">{log.itemId}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${log.action === 'Approved' ? 'bg-green-900/20 text-green-400 border-green-900/50' : 'bg-red-900/20 text-red-400 border-red-900/50'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-gray-500 font-mono text-xs flex items-center gap-2">
                        <User size={12} />
                        {log.adminId}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredItems.length === 0 ? (
             <div className="text-center py-32 bg-gray-900/30 border-2 border-dashed border-gray-800 rounded-3xl">
               <div className="bg-green-600/10 p-5 rounded-full inline-flex mb-6 ring-1 ring-green-500/20">
                <CheckCircle2 size={56} className="text-green-500/60" />
               </div>
               <h3 className="text-2xl font-bold text-gray-300">Workspace Optimized</h3>
               <p className="text-gray-500 mt-2 max-w-md mx-auto">All content generations currently comply with platform safety standards.</p>
             </div>
          ) : (
            filteredItems.map(item => (
              <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 hover:border-gray-700 transition-all shadow-xl group">
                 <div className="flex-1">
                   <div className="flex flex-wrap items-center gap-4 mb-5">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${getSeverityColor(item.severity)}`}>
                       {item.severity} SEVERITY
                     </span>
                     <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                       <Clock size={14} className="text-gray-600" />
                       {new Date(item.timestamp).toLocaleTimeString()}
                     </div>
                     <span className="text-[10px] text-gray-600 font-mono uppercase tracking-tighter bg-gray-950 px-2 py-1 rounded border border-gray-800">UUID: {item.id}</span>
                   </div>
                   
                   <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 mb-6 font-medium text-gray-300 leading-relaxed italic relative">
                     <div className="absolute top-4 left-4 opacity-5 pointer-events-none">
                       <MessageSquare size={48} />
                     </div>
                     <p className="relative z-10 line-clamp-3">"{item.content}"</p>
                   </div>
                   
                   <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                     <div className="flex items-center gap-2 bg-gray-950/50 px-3 py-1.5 rounded-lg border border-gray-800">
                       <AlertTriangle size={16} className="text-yellow-500" />
                       <span className="text-gray-500 text-xs font-mono uppercase">Incident:</span> 
                       <span className="text-gray-200 font-bold">{item.reason}</span>
                     </div>
                     <div className="flex items-center gap-2 bg-gray-950/50 px-3 py-1.5 rounded-lg border border-gray-800">
                       <User size={16} className="text-blue-500" />
                       <span className="text-gray-500 text-xs font-mono uppercase">Origin:</span> 
                       <span className="text-blue-300 font-mono font-bold text-xs">{item.user}</span>
                     </div>
                   </div>
                 </div>

                 <div className="flex lg:flex-col justify-end gap-3 lg:w-44 shrink-0 border-t lg:border-t-0 lg:border-l border-gray-800 pt-6 lg:pt-0 lg:pl-8">
                   {item.status === 'Pending' ? (
                     <>
                       <button 
                          onClick={() => handleAction(item.id, 'Approved')}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-3.5 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-green-900/20 active:scale-95"
                       >
                         <CheckCircle2 size={18} />
                         Dismiss
                       </button>
                       <button 
                          onClick={() => handleAction(item.id, 'Rejected')}
                          className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white py-3.5 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-red-900/20 active:scale-95"
                       >
                         <XCircle size={18} />
                         Blacklist
                       </button>
                     </>
                   ) : (
                      <div className={`flex flex-col items-center justify-center h-full gap-3 p-4 rounded-2xl bg-gray-950 border border-gray-800 ${
                          item.status === 'Approved' ? 'text-green-500' : 'text-red-500'
                      }`}>
                          {item.status === 'Approved' ? <CheckCircle2 size={40} className="animate-in zoom-in duration-300" /> : <XCircle size={40} className="animate-in zoom-in duration-300" />}
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.status}</span>
                      </div>
                   )}
                 </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};