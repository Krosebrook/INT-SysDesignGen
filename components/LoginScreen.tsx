import React, { useState } from 'react';
import { UserProfile } from '../types';
import { authService } from '../services/authService';
import { Lock, Mail, ArrowRight, ShieldCheck, User, RefreshCw, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (!authService.validateEmail(email)) {
        throw new Error("Please enter a valid work email address.");
      }

      if (mode !== 'forgot' && !authService.validatePassword(password)) {
        throw new Error("Password must be at least 8 characters long.");
      }

      if (mode === 'signup') {
        const user = await authService.signUp(name, email, password);
        onLogin(user);
      } else if (mode === 'signin') {
        const user = await authService.signIn(email, password);
        onLogin(user);
      } else {
        await authService.resetPassword(email);
        setMessage('If an account exists for this email, you will receive a reset link shortly.');
        setTimeout(() => setMode('signin'), 3000);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const titles = {
    signin: 'Sign In to Console',
    signup: 'Create Account',
    forgot: 'Reset Password'
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="bg-blue-600/20 p-4 rounded-2xl inline-flex mb-4 ring-1 ring-blue-500/30">
            <ShieldCheck size={48} className="text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Staff Engineer Architect</h1>
          <p className="text-gray-400">Enterprise-grade system design generator</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            {mode === 'signup' && <User size={20} className="text-blue-400" />}
            {mode === 'signin' && <Lock size={20} className="text-blue-400" />}
            {mode === 'forgot' && <RefreshCw size={20} className="text-blue-400" />}
            {titles[mode]}
          </h2>

          {message && (
            <div className="mb-4 p-3 bg-green-900/20 border border-green-800 text-green-400 rounded-lg text-sm flex items-start gap-2">
              <ShieldCheck size={16} className="mt-0.5 shrink-0" />
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-800 text-red-400 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-500" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-gray-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700"
                    placeholder="Jane Doe"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-gray-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg py-2.5 pl-10 pr-10 text-gray-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700"
                    placeholder="••••••••••••"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-3 font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'forgot' ? 'Send Reset Link' : mode === 'signup' ? 'Create Account' : 'Sign In'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-3 text-sm">
             {mode === 'signin' && (
               <>
                 <button onClick={() => setMode('forgot')} className="text-gray-400 hover:text-blue-400 transition-colors">Forgot Password?</button>
                 <span className="text-gray-600">Don't have an account? <button onClick={() => setMode('signup')} className="text-blue-400 hover:text-blue-300 font-medium">Sign Up</button></span>
               </>
             )}
             
             {mode === 'signup' && (
                <span className="text-gray-600">Already have an account? <button onClick={() => setMode('signin')} className="text-blue-400 hover:text-blue-300 font-medium">Sign In</button></span>
             )}

             {mode === 'forgot' && (
                <button onClick={() => setMode('signin')} className="text-gray-400 hover:text-white transition-colors">Back to Sign In</button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
