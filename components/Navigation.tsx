import React from 'react';
import { ViewState, UserProfile } from '../types';
import { LayoutDashboard, PenTool, LayoutTemplate, ShieldAlert, User, X, BookOpen, ChevronRight, Bot } from 'lucide-react';

interface NavigationProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onLogout: () => void;
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView, onLogout, user, isOpen, onClose }) => {
  const navItems: { id: ViewState, label: string, icon: any }[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'architect', label: 'Architect', icon: PenTool },
    { id: 'moderation', label: 'Moderation', icon: ShieldAlert },
    { id: 'documentation', label: 'Docs', icon: BookOpen },
    { id: 'profile', label: 'Settings', icon: User },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={onClose} />}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-1.5 rounded shadow-lg shadow-blue-900/20"><Bot className="text-white" size={20} /></div>
            <div>
               <h1 className="font-bold text-sm text-white leading-tight">Staff Architect</h1>
               <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">v4.0 Alpha</p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-gray-500 hover:text-white"><X size={20} /></button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { onChangeView(item.id); onClose(); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${currentView === item.id ? 'bg-blue-900/20 text-blue-200 shadow-sm ring-1 ring-blue-700/50' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={currentView === item.id ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'} />
                {item.label}
              </div>
              {currentView === item.id && <ChevronRight size={14} className="text-blue-500" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 mt-auto">
          <div className="bg-gray-950 rounded-lg p-3 mb-4 flex items-center gap-3 border border-gray-800">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shrink-0">{user.name.charAt(0)}</div>
              <div className="overflow-hidden">
                  <p className="text-xs font-medium text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-gray-500 truncate capitalize">{user.role}</p>
              </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/10 transition-colors">
              <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>
    </>
  );
};
import { LogOut } from 'lucide-react';
