export enum RealityFilterType {
  HALLUCINATION_MITIGATION = 'hallucination_mitigation',
  BRAND_VOICE_CONSISTENCY = 'brand_voice_consistency',
  PLATFORM_ALGORITHM_AWARENESS = 'platform_algorithm_awareness',
  SEO_VOLATILITY_SHIELD = 'seo_volatility_shield',
  CONTENT_MODERATION = 'content_moderation',
  MULTI_LANGUAGE_READINESS = 'multi_language_readiness',
  ACCESSIBILITY_BASELINE = 'accessibility_baseline',
  SECURITY_VALIDATION = 'security_validation',
}

export type RiskLevel = 'Low' | 'Medium' | 'High';
export type TargetEnvironment = 'Production' | 'Staging' | 'Experimentation';

export interface QualityGate {
  id: string;
  name: string;
  status: 'Pass' | 'Fail' | 'Pending';
  score: number;
}

export interface GenerationRequest {
  task: string;
  activeFilters: RealityFilterType[];
  context?: string;
  riskLevel?: RiskLevel;
  environment?: TargetEnvironment;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface ProjectTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  prompt: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
}

export type ViewState = 'login' | 'onboarding' | 'dashboard' | 'architect' | 'templates' | 'moderation' | 'profile' | 'documentation';

export interface UserProfile {
  email: string;
  name: string;
  role: string;
  lastLogin: number;
  avatar?: string;
  hasCompletedOnboarding?: boolean;
}

export interface FlaggedItem {
  id: string;
  user: string;
  content: string;
  reason: 'Hate Speech' | 'Spam' | 'Personal Attack' | 'Misinformation';
  severity: 'Low' | 'Medium' | 'High';
  timestamp: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}
