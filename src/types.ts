export type Urgency = 'immediate' | 'urgent' | 'caution';

export type EmergencyCategory =
  | 'severe_bleeding'
  | 'trouble_breathing'
  | 'unconscious'
  | 'chest_pain'
  | 'fire_smoke'
  | 'poisoning'
  | 'serious_injury'
  | 'unsafe_violent'
  | 'mental_health_crisis'
  | 'other';

export interface Guidance {
  emergencyType: string;
  urgency: Urgency;
  openingMessage: string;
  steps: string[];
  doNotDo: string[];
  dispatcherSummary: string;
  category?: EmergencyCategory;
  source?: 'ai' | 'fallback';
}

export interface Country {
  code: string;
  name: string;
  number: string | null;
  flag: string;
}

export type Screen = 'home' | 'input' | 'guidance';

export interface EmergencyService {
  id: string;
  label: string;
  number: string;
  description: string;
  isMentalHealth?: boolean;
}

export interface MentalHealthResource {
  label: string;
  number: string | null;
  textLine: string | null;
  chatUrl: string | null;
  description: string;
}

export interface EmergencyQuestion {
  id: string;
  prompt: string;
  options: string[];
  lifeThreateningAnswers?: string[];
}

export interface QuestionAnswer {
  questionId: string;
  prompt: string;
  answer: string;
}
