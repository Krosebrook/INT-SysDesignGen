import React, { useState } from 'react';
import { UserProfile } from '../types';
import { authService } from '../services/authService';
import { User, Mail, Shield, Save, Camera, Bell, Moon, Loader2, Key, Check, AlertCircle } from 'lucide-react';

interface ProfileSettingsProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is a mandatory field.");
      return;
    }

    if (avatar && !authService.validateUrl(avatar)) {
        setError("Please enter a valid URL for the avatar.");
        return;
    }
    
    setIsSaving(true);
    setError(null);
    try {
      const updatedUser = await authService.updateProfile(user.email, {
        name,
        role,
        avatar
      });
      
      onUpdate(updatedUser);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || "Platform error: Failed to sync profile changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      const token = await authService.requestPasswordReset(user.email);
      setResetRequested(true);
      if (token) {
        console.log(`Simulated Reset Token: ${token}`);
      }
      setTimeout(() => setResetRequested(false), 5000);
    } catch (err) {
      setError("Failed to trigger security workflow.");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">Identity Management</h2>
        <p className="text-gray-400 text-base md:text-lg">Govern your profile and security credentials for the Staff Architect platform.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Summary & Actions */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center shadow-xl ring-1 ring-white/5">
                <div className="relative inline-block mb-6">
                    <div className="w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center text-4xl font-black text-white shadow-2xl overflow-hidden">
                        {avatar && authService.validateUrl(avatar) ? (
                          <img src={avatar} alt={name} className="w-full h-full object-cover" />
                        ) : (
                          name.charAt(0)
                        )}
                    </div>
                    {/* Placeholder for future file upload feature */}
                    <button className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-full shadow-lg border-4 border-gray-900 transition-all hover:scale-110 cursor-default" title="Upload coming soon">
                        <Camera size={18} />
                    </button>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{name}</h3>
                <p className="text-blue-400 text-sm font-semibold tracking-wide uppercase">{role}</p>
                <div className="mt-6 pt-6 border-t border-gray-800 flex justify-center gap-4 text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                    <span>Active Session</span>
                    <span className="text-gray-800">•</span>
                    <span>v4.0.2</span>
                </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-lg">
                <h4 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 px-2">Account Hardening</h4>
                <div className="space-y-2">
                    <button 
                      onClick={handlePasswordReset}
                      className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-xl text-sm transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Key size={18} className="text-orange-500" />
                        Reset Password
                      </div>
                      {resetRequested ? <Check size={16} className="text-green-500" /> : <Shield size={16} className="text-gray-700" />}
                    </button>
                    {resetRequested && (
                      <p className="px-4 py-2 text-[10px] text-orange-400 bg-orange-950/20 rounded-lg border border-orange-900/30">
                        Check console/email for reset token (Simulation).
                      </p>
                    )}
                </div>
            </div>
        </div>

        {/* Right Col: Fields */}
        <div className="lg:col-span-8 space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-800 text-red-400 p-5 rounded-2xl text-sm flex items-center gap-3 animate-in shake-in-1 duration-300">
                <AlertCircle size={20} className="shrink-0" />
                {error}
              </div>
            )}

            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-blue-600/10 p-2 rounded-lg"><User size={24} className="text-blue-500" /></div>
                    <h3 className="text-xl font-bold text-white">System Identity</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-widest">Display Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-700 rounded-xl py-3 px-4 text-gray-200 focus:ring-2 focus:ring-blue-500/50 outline-none text-sm transition-all" 
                            placeholder="Full name"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-widest">Operational Role</label>
                        <input 
                            type="text" 
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-700 rounded-xl py-3 px-4 text-gray-200 focus:ring-2 focus:ring-blue-500/50 outline-none text-sm transition-all" 
                            placeholder="e.g. Staff Architect"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-widest">Avatar URL (Optional)</label>
                        <input 
                            type="url" 
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-700 rounded-xl py-3 px-4 text-gray-200 focus:ring-2 focus:ring-blue-500/50 outline-none text-sm transition-all placeholder:text-gray-700" 
                            placeholder="https://example.com/avatar.png"
                        />
                        <p className="text-[10px] text-gray-500 mt-2">Paste a secure HTTPS URL for your profile image.</p>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-widest">Registered Email</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-4 top-3.5 text-gray-600" />
                            <input 
                                type="email" 
                                value={user.email}
                                disabled
                                className="w-full bg-gray-950/50 border border-gray-800 rounded-xl py-3 pl-11 pr-4 text-gray-600 cursor-not-allowed text-sm font-mono" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                 <p className="text-xs text-gray-500 italic max-w-sm text-center md:text-left">
                    "Audit Log: Profile updates are recorded in the governance console and affect system-wide synthesis headers."
                 </p>
                 <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`
                        w-full md:w-auto px-10 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all
                        ${isSaved 
                            ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' 
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/30 hover:-translate-y-0.5'}
                        disabled:opacity-50 disabled:translate-y-0
                    `}
                 >
                     {isSaving ? <Loader2 size={20} className="animate-spin" /> : isSaved ? <Check size={20} /> : <Save size={20} />}
                     {isSaved ? 'Identity Synced' : isSaving ? 'Committing...' : 'Commit Changes'}
                 </button>
            </div>
        </div>

      </div>
    </div>
  );
};