import React, { useState, useEffect } from 'react';
import { RealityFilterType, ViewState, ProjectTemplate, UserProfile, QualityGate } from './types';
import { streamArchitectureGeneration } from './services/geminiService';
import { authService } from './services/authService';
import { FilterToggle } from './components/FilterToggle';
import { OutputDisplay } from './components/OutputDisplay';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { TemplateLibrary } from './components/TemplateLibrary';
import { Navigation } from './components/Navigation';
import { ModerationQueue } from './components/ModerationQueue';
import { ProfileSettings } from './components/ProfileSettings';
import { Onboarding } from './components/Onboarding';
import { DocumentationView } from './components/DocumentationView';
import { Sparkles, Trash2, Cpu, Settings2, ShieldCheck, AlertCircle, HelpCircle, Menu, Loader2, BarChart3 } from 'lucide-react';

const DEFAULT_FILTERS = Object.values(RealityFilterType);

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Architect State
  const [task, setTask] = useState('');
  const [context, setContext] = useState('');
  const [activeFilters, setActiveFilters] = useState<RealityFilterType[]>(DEFAULT_FILTERS);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qualityGates, setQualityGates] = useState<QualityGate[]>([
    { id: 'sec', name: 'Security Audit', status: 'Pending', score: 0 },
    { id: 'ux', name: 'UX Heuristics', status: 'Pending', score: 0 },
    { id: 'perf', name: 'Performance Budget', status: 'Pending', score: 0 },
  ]);

  useEffect(() => {
    // Check for existing session
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsAuthChecking(false);
  }, []);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [currentView]);

  const toggleFilter = (type: RealityFilterType) => {
    setActiveFilters(prev => 
      prev.includes(type) ? prev.filter(f => f !== type) : [...prev, type]
    );
  };

  const handleGenerate = async () => {
    if (!task.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setGeneratedContent('');
    setError(null);
    setQualityGates(prev => prev.map(g => ({ ...g, status: 'Pending', score: 0 })));

    try {
      await streamArchitectureGeneration(
        { task, context, activeFilters },
        (chunk) => setGeneratedContent(prev => prev + chunk)
      );
      // Mock quality gate update after generation
      setTimeout(() => {
        setQualityGates([
          { id: 'sec', name: 'Security Audit', status: 'Pass', score: 98 },
          { id: 'ux', name: 'UX Heuristics', status: 'Pass', score: 92 },
          { id: 'perf', name: 'Performance Budget', status: 'Pass', score: 85 },
        ]);
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to generate architecture.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    if (isGenerating) return;
    setTask('');
    setContext('');
    setGeneratedContent('');
    setError(null);
  };

  const handleTemplateSelect = (template: ProjectTemplate) => {
    setTask(template.prompt);
    setContext(`Targeting Template: ${template.title}\nID: ${template.id}`);
    setCurrentView('architect');
  };

  const handleOnboardingComplete = async (updatedUser: UserProfile, selectedTemplate?: ProjectTemplate) => {
    // Save onboarding completion to auth service
    const finalUser = await authService.updateProfile(updatedUser.email, { hasCompletedOnboarding: true });
    setUser(finalUser);
    if (selectedTemplate) {
      handleTemplateSelect(selectedTemplate);
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    authService.signOut();
    setUser(null);
    setCurrentView('dashboard');
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={48} />
      </div>
    );
  }

  if (!user) return <LoginScreen onLogin={(u) => setUser(u)} />;
  if (!user.hasCompletedOnboarding) return <Onboarding user={user} onComplete={handleOnboardingComplete} />;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-blue-500/30 selection:text-blue-200 flex flex-col md:flex-row overflow-hidden">
      <Navigation 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        onLogout={handleLogout}
        user={user}
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 border-b border-gray-800 bg-gray-900/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 shrink-0 z-30 sticky top-0 md:static">
          <div className="flex items-center gap-3">
             <button onClick={() => setIsMobileNavOpen(true)} className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
                <Menu size={24} />
             </button>
             <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-blue-500" />
                <h1 className="font-bold text-white tracking-tight hidden sm:block">Staff Engineer Architect v4.0</h1>
                <h1 className="font-bold text-white tracking-tight sm:hidden text-sm">SE Architect</h1>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden lg:flex items-center gap-4 mr-4">
                {qualityGates.map(gate => (
                    <div key={gate.id} className="flex flex-col items-center">
                        <span className="text-[8px] text-gray-500 font-mono uppercase">{gate.name}</span>
                        <div className="flex items-center gap-1">
                            <div className={`h-1.5 w-1.5 rounded-full ${gate.status === 'Pass' ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                            <span className="text-[10px] font-bold text-gray-300">{gate.score > 0 ? `${gate.score}%` : '--'}</span>
                        </div>
                    </div>
                ))}
             </div>
             {isGenerating && (
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-900/20 rounded-full border border-blue-500/30">
                   <Loader2 size={14} className="text-blue-400 animate-spin" />
                   <span className="text-[10px] font-mono text-blue-300 uppercase tracking-widest hidden xs:block">Synthesizing</span>
                </div>
             )}
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-[#0b1121] custom-scrollbar safe-bottom">
          {currentView === 'dashboard' && <Dashboard user={user} />}
          {currentView === 'templates' && <TemplateLibrary onSelectTemplate={handleTemplateSelect} />}
          {currentView === 'moderation' && <ModerationQueue />}
          {currentView === 'profile' && <ProfileSettings user={user} onUpdate={setUser} />}
          {currentView === 'documentation' && <DocumentationView />}

          {currentView === 'architect' && (
            <div className="h-full p-3 md:p-6 lg:max-w-[1600px] mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">
                  <div className="lg:col-span-4 flex flex-col gap-6 lg:h-full overflow-visible lg:overflow-hidden">
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 md:p-6 flex flex-col gap-5 shadow-2xl shrink-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 text-blue-300 font-medium">
                          <Settings2 size={18} />
                          <h2 className="text-sm">Synthesis Parameters</h2>
                        </div>
                        {isGenerating && <Loader2 size={16} className="text-blue-500 animate-spin" />}
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-mono text-gray-500 mb-2 uppercase tracking-widest">Project Intent</label>
                          <textarea
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            disabled={isGenerating}
                            placeholder="e.g. Build a SOC2-compliant Identity Provider with magic links..."
                            className="w-full bg-gray-950 border border-gray-700 rounded-xl p-4 text-sm text-gray-200 focus:ring-2 focus:ring-blue-500/50 outline-none h-40 transition-all placeholder:text-gray-800 disabled:opacity-50"
                          />
                        </div>
                        <div>
                           <label className="block text-[10px] font-mono text-gray-500 mb-2 uppercase tracking-widest">Global Constraints</label>
                           <textarea
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            disabled={isGenerating}
                            placeholder="Target cloud, tech stack, latency budgets..."
                            className="w-full bg-gray-950 border border-gray-700 rounded-xl p-4 text-sm text-gray-200 focus:ring-2 focus:ring-blue-500/50 outline-none h-24 transition-all placeholder:text-gray-800 disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button onClick={handleClear} disabled={isGenerating || !task} className="p-3 rounded-xl border border-gray-700 text-gray-500 hover:text-red-400 transition-all disabled:opacity-30">
                          <Trash2 size={20} />
                        </button>
                        <button
                          onClick={handleGenerate}
                          disabled={!task.trim() || isGenerating}
                          className={`flex-1 rounded-xl px-4 py-3 transition-all flex items-center justify-center gap-2 text-sm font-bold shadow-xl ${isGenerating ? 'bg-blue-900/30 text-blue-300 cursor-wait' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                        >
                          {isGenerating ? <><Loader2 size={18} className="animate-spin" /> Synthesizing...</> : <><Sparkles size={18} /> Execute Phases</>}
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-900 rounded-2xl border border-gray-800 flex-1 flex flex-col min-h-0 shadow-2xl overflow-hidden hidden lg:flex">
                      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                        <div className="flex items-center gap-2 text-blue-300 font-medium text-xs">
                          <ShieldCheck size={16} />
                          <h2>Reality Audit Gates</h2>
                        </div>
                      </div>
                      <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {DEFAULT_FILTERS.map(filter => (
                          <FilterToggle key={filter} type={filter} isActive={activeFilters.includes(filter)} onToggle={toggleFilter} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-8 h-full min-h-[500px] flex flex-col lg:overflow-hidden pb-6 md:pb-0">
                    {error ? (
                      <div className="h-full flex items-center justify-center p-8 bg-red-900/5 border border-red-900/20 rounded-2xl">
                        <div className="text-center max-w-sm">
                            <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-red-400 mb-2">Synthesis Failed</h3>
                            <p className="text-red-200/60 text-sm">{error}</p>
                            <button onClick={() => setError(null)} className="mt-6 px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm">Dismiss</button>
                        </div>
                      </div>
                    ) : (
                      <OutputDisplay content={generatedContent} isGenerating={isGenerating} currentUserEmail={user.email} />
                    )}
                  </div>
                </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;