import React, { useState, useMemo } from 'react';
import { ProjectTemplate, UserProfile, RiskLevel, TargetEnvironment } from '../types';
import { PROJECT_TEMPLATES } from '../constants';
import { 
  User, Code, Shield, Zap, CheckCircle2, 
  ArrowRight, ArrowLeft, ShieldCheck, 
  Layout, Briefcase, Settings, Cpu, BarChart,
  Lock, Activity, Globe
} from 'lucide-react';

interface OnboardingProps {
  user: UserProfile;
  onComplete: (updatedUser: UserProfile, selectedTemplate?: ProjectTemplate) => void;
}

const ROLES = [
  { id: 'engineer', label: 'Engineer', icon: Code, desc: 'Technical implementation focus' },
  { id: 'product', label: 'Product', icon: Layout, desc: 'Feature & UX strategy focus' },
  { id: 'ops', label: 'Ops', icon: Settings, desc: 'Infrastructure & scaling focus' },
  { id: 'exec', label: 'Executive', icon: Briefcase, desc: 'ROI & strategy focus' },
];

const TASKS = [
  { id: 'codegen', label: 'CodeGen', desc: 'Producing production code' },
  { id: 'analysis', label: 'Analysis', desc: 'System audits & deep dives' },
  { id: 'writing', label: 'Writing', desc: 'Documentation & strategy' },
  { id: 'agentic', label: 'Agentic Workflow', desc: 'Autonomous task chains' },
];

const ENVIRONMENTS: { id: TargetEnvironment; label: string }[] = [
  { id: 'Production', label: 'Production' },
  { id: 'Staging', label: 'Staging' },
  { id: 'Experimentation', label: 'Experimentation' },
];

export const Onboarding: React.FC<OnboardingProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({
    role: '',
    task: '',
    environment: 'Staging' as TargetEnvironment,
    risk: 'Medium' as RiskLevel,
    compliance: ['Internal-only'],
    model: 'gemini-3-pro-preview',
    templateId: ''
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 6));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  // STEP 2: Infer Risk Level
  const inferredRisk = useMemo(() => {
    if (selection.role === 'engineer' && selection.task === 'codegen') return 'High';
    if (selection.environment === 'Production') return 'High';
    if (selection.task === 'analysis') return 'Medium';
    return 'Low';
  }, [selection.role, selection.task, selection.environment]);

  // STEP 3: Recommended Templates
  const recommendedTemplates = PROJECT_TEMPLATES.filter(t => {
    if (inferredRisk === 'High') return t.difficulty === 'Advanced';
    return t.difficulty !== 'Advanced';
  }).slice(0, 3);

  const renderStep = () => {
    switch (step) {
      case 1: // STEP 1 — USER CONTEXT INTAKE
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">User Context Intake</h2>
              <p className="text-gray-400">Step 1 — Understand role, domain, and intent</p>
            </div>
            
            <div className="space-y-4">
              <label className="block text-xs font-mono text-gray-500 uppercase">Primary Role</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelection(prev => ({ ...prev, role: r.id }))}
                    className={`p-4 rounded-xl border transition-all text-left ${
                      selection.role === r.id ? 'bg-blue-900/20 border-blue-500 ring-1 ring-blue-500' : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <r.icon size={20} className={selection.role === r.id ? 'text-blue-400' : 'text-gray-500'} />
                    <p className="mt-2 text-sm font-bold text-white">{r.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-mono text-gray-500 uppercase">Intended Task</label>
              <div className="grid grid-cols-2 gap-3">
                {TASKS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelection(prev => ({ ...prev, task: t.id }))}
                    className={`p-3 rounded-lg border transition-all text-left ${
                      selection.task === t.id ? 'bg-blue-900/20 border-blue-500' : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <p className="text-xs font-bold text-white">{t.label}</p>
                    <p className="text-[10px] text-gray-500">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-mono text-gray-500 uppercase">Target Environment</label>
              <div className="flex gap-2">
                {ENVIRONMENTS.map(e => (
                  <button
                    key={e.id}
                    onClick={() => setSelection(prev => ({ ...prev, environment: e.id }))}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs transition-all ${
                      selection.environment === e.id ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'
                    }`}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2: // STEP 2 — DOMAIN & RISK CLASSIFICATION
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Domain & Risk Classification</h2>
              <p className="text-gray-400">Step 2 — Inferring compliance constraints</p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Activity size={18} className="text-blue-400" />
                    <span className="text-gray-400 text-sm">Inferred Risk</span>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                    inferredRisk === 'High' ? 'bg-red-900/30 text-red-400 border-red-800' :
                    inferredRisk === 'Medium' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' :
                    'bg-green-900/30 text-green-400 border-green-800'
                }`}>
                  {inferredRisk.toUpperCase()}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Lock size={18} className="text-purple-400" />
                    <span className="text-gray-400 text-sm">Compliance Flags</span>
                </div>
                <span className="text-white text-xs font-mono uppercase">
                    {inferredRisk === 'High' ? 'PII / Regulated / External' : 'Internal-only'}
                </span>
              </div>

              <div className="pt-4 border-t border-gray-700 flex gap-4">
                 <ShieldCheck className="text-blue-400 shrink-0" size={24} />
                 <p className="text-[11px] text-gray-400 leading-relaxed italic">
                    "Concierge Protocol: Governance activated for {selection.environment} targeting. Safety gates will be strictly enforced."
                 </p>
              </div>
            </div>
          </div>
        );

      case 3: // STEP 3 — TEMPLATE SELECTION
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Semantic Template Selection</h2>
              <p className="text-gray-400">Step 3 — Recommended domains for your risk level</p>
            </div>

            <div className="space-y-3">
              {recommendedTemplates.length > 0 ? recommendedTemplates.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelection(prev => ({ ...prev, templateId: t.id }))}
                  className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-4 ${
                    selection.templateId === t.id ? 'bg-blue-900/20 border-blue-500' : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="h-10 w-10 rounded-lg bg-gray-950 border border-gray-800 flex items-center justify-center text-blue-400">
                    <Zap size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{t.title}</p>
                    <p className="text-[10px] text-gray-500 italic">Matches {inferredRisk} risk profile</p>
                  </div>
                  {selection.templateId === t.id && <CheckCircle2 className="text-blue-400" size={18} />}
                </button>
              )) : (
                  <p className="text-center text-gray-500 py-10">No specific templates found for this risk level. Recommending core architect.</p>
              )}
            </div>
          </div>
        );

      case 4: // STEP 4 — MODEL PROFILE BINDING
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Model Profile Binding</h2>
              <p className="text-gray-400">Step 4 — Optimize formatting and constraints</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => setSelection(prev => ({ ...prev, model: 'gemini-3-flash-preview' }))}
                className={`p-6 rounded-xl border transition-all text-left flex gap-4 ${
                  selection.model === 'gemini-3-flash-preview' ? 'bg-blue-900/20 border-blue-500' : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                <Zap size={24} className="text-blue-400 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white">Gemini 3 Flash (Efficiency)</p>
                  <p className="text-xs text-gray-500 mt-1">High-speed, optimized for rapid prototyping and low-complexity tasks.</p>
                </div>
              </button>
              
              <button
                onClick={() => setSelection(prev => ({ ...prev, model: 'gemini-3-pro-preview' }))}
                className={`p-6 rounded-xl border transition-all text-left flex gap-4 ${
                  selection.model === 'gemini-3-pro-preview' ? 'bg-purple-900/20 border-purple-500' : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                <Cpu size={24} className="text-purple-400 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white">Gemini 3 Pro (Reasoning)</p>
                  <p className="text-xs text-gray-500 mt-1">Full-spectrum reasoning. Mandated for {inferredRisk} risk tasks.</p>
                </div>
              </button>
            </div>
          </div>
        );

      case 5: // STEP 5 — GOVERNANCE ACTIVATION
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Governance Activation</h2>
              <p className="text-gray-400">Step 5 — Enabling mandatory safety gates</p>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Safety Gates', icon: Shield, info: 'OWASP & PII filtering' },
                { label: 'Token Tracking', icon: BarChart, info: 'Budget & cost management' },
                { label: 'Output Validation', icon: CheckCircle2, info: 'Reality filter checksums' },
                { label: 'Secure Audit Log', icon: Globe, info: 'Compliance record keeping' },
              ].map(g => (
                <div key={g.label} className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <g.icon size={18} className="text-blue-500" />
                    <div>
                        <p className="text-sm text-gray-200 font-medium">{g.label}</p>
                        <p className="text-[10px] text-gray-500">{g.info}</p>
                    </div>
                  </div>
                  <div className="h-5 w-9 bg-blue-600 rounded-full flex items-center px-1">
                    <div className="h-3 w-3 bg-white rounded-full translate-x-4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 6: // STEP 6 — FIRST RUN SUCCESS
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-500 text-center">
            <div className="mb-8">
              <div className="bg-green-600/20 p-6 rounded-full inline-flex mb-6 ring-1 ring-green-500/30">
                <CheckCircle2 size={64} className="text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Governance Locked</h2>
              <p className="text-gray-400">Step 6 — Finalize concierge tunnel</p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-left space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-950 p-3 rounded-lg border border-gray-800">
                  <p className="text-[10px] text-gray-500 uppercase font-mono">Environment</p>
                  <p className="text-xs font-bold text-white uppercase">{selection.environment}</p>
                </div>
                <div className="bg-gray-950 p-3 rounded-lg border border-gray-800">
                  <p className="text-[10px] text-gray-500 uppercase font-mono">Risk Profile</p>
                  <p className="text-xs font-bold text-red-400 uppercase">{inferredRisk}</p>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Clicking **Launch Console** will execute your first tracked session. 
                Governance rules are now immutable for this profile.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isCurrentStepValid = () => {
    if (step === 1) return selection.role && selection.task;
    if (step === 3) return selection.templateId || inferredRisk === 'Low';
    return true;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      <div className="w-full max-w-xl relative">
        <div className="absolute -top-24 -left-24 h-64 w-64 bg-blue-600/10 blur-[100px] rounded-full"></div>
        <div className="absolute -bottom-24 -right-24 h-64 w-64 bg-purple-600/10 blur-[100px] rounded-full"></div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 flex">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div 
                key={i} 
                className={`flex-1 transition-all duration-700 ${i <= step ? 'bg-blue-500' : 'bg-gray-800'}`}
              />
            ))}
          </div>

          <div className="min-h-[440px]">
            {renderStep()}
          </div>

          <div className="mt-10 flex gap-4">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="flex-1 px-6 py-3 rounded-xl border border-gray-700 text-gray-400 hover:bg-gray-800 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <ArrowLeft size={18} />
                Back
              </button>
            )}
            <button
              onClick={() => step === 6 ? onComplete({ ...user, hasCompletedOnboarding: true }, PROJECT_TEMPLATES.find(t => t.id === selection.templateId)) : nextStep()}
              disabled={!isCurrentStepValid()}
              className="flex-[2] px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center gap-2 font-bold disabled:opacity-50 group"
            >
              {step === 6 ? 'Initialize System' : 'Confirm & Proceed'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-600 font-mono flex items-center justify-center gap-2 uppercase tracking-widest">
                <Shield size={12} className="text-blue-500" />
                Enterprise Governance Active
            </p>
        </div>
      </div>
    </div>
  );
};
