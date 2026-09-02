import type { EmergencyCategory, EmergencyQuestion } from '@/types';

export const QUESTION_TEMPLATES: Record<EmergencyCategory, EmergencyQuestion[]> = {
  severe_bleeding: [
    {
      id: 'bleeding_amount',
      prompt: 'How much blood is there?',
      options: ['Soaking through cloth', 'Steady flow', 'Small amount', 'I don\'t know'],
      lifeThreateningAnswers: ['Soaking through cloth', 'Steady flow'],
    },
    {
      id: 'conscious',
      prompt: 'Is the person conscious and responsive?',
      options: ['Yes', 'No', 'I don\'t know'],
      lifeThreateningAnswers: ['No'],
    },
    {
      id: 'object_stuck',
      prompt: 'Is there an object stuck in the wound?',
      options: ['Yes', 'No', 'I don\'t know'],
    },
  ],

  trouble_breathing: [
    {
      id: 'breathing_status',
      prompt: 'Is the person breathing right now?',
      options: ['Yes — but struggling', 'No — not breathing', 'I don\'t know'],
      lifeThreateningAnswers: ['No — not breathing', 'I don\'t know'],
    },
    {
      id: 'choking',
      prompt: 'Is the person choking or unable to speak?',
      options: ['Yes — they cannot speak', 'No — they can speak', 'I don\'t know'],
      lifeThreateningAnswers: ['Yes — they cannot speak'],
    },
    {
      id: 'breathing_onset',
      prompt: 'Did the breathing trouble start suddenly or gradually?',
      options: ['Suddenly', 'Gradually over time', 'I don\'t know'],
    },
  ],

  unconscious: [
    {
      id: 'responsive',
      prompt: 'Does the person respond when you speak or gently shake their shoulder?',
      options: ['Yes — they respond', 'No — no response', 'I don\'t know'],
      lifeThreateningAnswers: ['No — no response'],
    },
    {
      id: 'breathing',
      prompt: 'Is the person breathing normally?',
      options: ['Yes — breathing normally', 'No — not breathing', 'I don\'t know'],
      lifeThreateningAnswers: ['No — not breathing', 'I don\'t know'],
    },
    {
      id: 'cause',
      prompt: 'Do you know what caused them to become unresponsive?',
      options: ['They fell or were hit', 'They collapsed suddenly', 'They took something', 'I don\'t know'],
    },
  ],

  chest_pain: [
    {
      id: 'pain_spread',
      prompt: 'Does the pain spread to the arm, jaw, neck, or back?',
      options: ['Yes', 'No', 'I don\'t know'],
      lifeThreateningAnswers: ['Yes'],
    },
    {
      id: 'other_symptoms',
      prompt: 'Are there other symptoms with the chest pain?',
      options: ['Sweating or nausea', 'Shortness of breath', 'Dizziness', 'None of these'],
      lifeThreateningAnswers: ['Sweating or nausea', 'Shortness of breath'],
    },
    {
      id: 'conscious',
      prompt: 'Is the person still conscious?',
      options: ['Yes', 'No', 'I don\'t know'],
      lifeThreateningAnswers: ['No'],
    },
  ],

  fire_smoke: [
    {
      id: 'fire_location',
      prompt: 'Where is the fire?',
      options: ['In a building', 'In my home', 'Outdoors', 'In a vehicle'],
    },
    {
      id: 'trapped',
      prompt: 'Is anyone trapped or unable to get out?',
      options: ['Yes', 'No', 'I don\'t know'],
      lifeThreateningAnswers: ['Yes'],
    },
    {
      id: 'smoke_visible',
      prompt: 'Can you see or smell smoke where you are?',
      options: ['Yes — heavy smoke', 'Yes — light smoke', 'No smoke here'],
      lifeThreateningAnswers: ['Yes — heavy smoke'],
    },
    {
      id: 'evacuated',
      prompt: 'Has everyone gotten out safely?',
      options: ['Yes — everyone is out', 'No — someone is still inside', 'I don\'t know'],
      lifeThreateningAnswers: ['No — someone is still inside'],
    },
  ],

  poisoning: [
    {
      id: 'conscious',
      prompt: 'Is the person conscious?',
      options: ['Yes', 'No', 'I don\'t know'],
      lifeThreateningAnswers: ['No'],
    },
    {
      id: 'breathing',
      prompt: 'Is the person breathing?',
      options: ['Yes', 'No', 'I don\'t know'],
      lifeThreateningAnswers: ['No', 'I don\'t know'],
    },
    {
      id: 'what_taken',
      prompt: 'Do you know what was swallowed or taken?',
      options: ['Yes — I know what it is', 'No — I don\'t know'],
    },
  ],

  serious_injury: [
    {
      id: 'neck_back',
      prompt: 'Could the person have injured their neck or back?',
      options: ['Yes', 'No', 'I don\'t know'],
      lifeThreateningAnswers: ['Yes'],
    },
    {
      id: 'conscious',
      prompt: 'Is the person conscious?',
      options: ['Yes', 'No', 'I don\'t know'],
      lifeThreateningAnswers: ['No'],
    },
    {
      id: 'bleeding',
      prompt: 'Is there severe bleeding?',
      options: ['Yes — heavy bleeding', 'A little', 'No bleeding'],
      lifeThreateningAnswers: ['Yes — heavy bleeding'],
    },
  ],

  unsafe_violent: [
    {
      id: 'safe_place',
      prompt: 'Are you in a safe place right now?',
      options: ['Yes', 'No', 'I don\'t know'],
      lifeThreateningAnswers: ['No'],
    },
    {
      id: 'weapon',
      prompt: 'Is there a weapon involved?',
      options: ['Yes', 'No', 'I don\'t know'],
      lifeThreateningAnswers: ['Yes'],
    },
    {
      id: 'can_leave',
      prompt: 'Can you safely leave the area?',
      options: ['Yes', 'No — I cannot leave', 'I don\'t know'],
      lifeThreateningAnswers: ['No — I cannot leave'],
    },
  ],

  mental_health_crisis: [
    {
      id: 'self_harm_risk',
      prompt: 'Is there a risk of the person harming themselves or someone else?',
      options: ['Yes', 'No', 'I don\'t know'],
      lifeThreateningAnswers: ['Yes', 'I don\'t know'],
    },
    {
      id: 'means_available',
      prompt: 'Does the person have access to means to harm themselves?',
      options: ['Yes', 'No', 'I don\'t know'],
      lifeThreateningAnswers: ['Yes'],
    },
    {
      id: 'alone',
      prompt: 'Is the person alone right now?',
      options: ['Yes — alone', 'No — someone is with them', 'I don\'t know'],
    },
  ],

  other: [
    {
      id: 'immediate_danger',
      prompt: 'Is the person in immediate danger right now?',
      options: ['Yes', 'No', 'I don\'t know'],
      lifeThreateningAnswers: ['Yes'],
    },
    {
      id: 'conscious',
      prompt: 'Is the person conscious?',
      options: ['Yes', 'No', 'I don\'t know'],
      lifeThreateningAnswers: ['No'],
    },
    {
      id: 'breathing',
      prompt: 'Is the person breathing?',
      options: ['Yes', 'No', 'I don\'t know'],
      lifeThreateningAnswers: ['No', 'I don\'t know'],
    },
  ],
};

export function getQuestionsForCategory(category: EmergencyCategory | undefined): EmergencyQuestion[] {
  if (!category) return QUESTION_TEMPLATES.other;
  return QUESTION_TEMPLATES[category] ?? QUESTION_TEMPLATES.other;
}
