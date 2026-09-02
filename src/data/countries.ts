import type { Country, EmergencyService, MentalHealthResource } from '@/types';

export const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', number: '911', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', number: '911', flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom', number: '999', flag: '🇬🇧' },
  { code: 'EU', name: 'European Union', number: '112', flag: '🇪🇺' },
  { code: 'AU', name: 'Australia', number: '000', flag: '🇦🇺' },
  { code: 'IN', name: 'India', number: '112', flag: '🇮🇳' },
  { code: 'XX', name: 'Other / Unknown', number: null, flag: '🌐' },
];

export const DEFAULT_COUNTRY_CODE = 'US';

export function getCountry(code: string): Country {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}

export const EMERGENCY_SERVICES: Record<string, EmergencyService[]> = {
  US: [
    { id: 'general', label: 'All Emergencies (911)', number: '911', description: 'Police, fire, or medical emergency' },
    { id: 'police', label: 'Police (non-emergency)', number: '311', description: 'Non-urgent police matters' },
    { id: 'poison', label: 'Poison Control', number: '18002221222', description: 'Poisoning and overdose help' },
    { id: 'domestic', label: 'National Domestic Violence Hotline', number: '18007997233', description: 'Domestic abuse or violence support' },
    { id: 'mentalhealth', label: '988 Suicide & Crisis Lifeline', number: '988', description: 'Mental health crisis support', isMentalHealth: true },
  ],
  CA: [
    { id: 'general', label: 'All Emergencies (911)', number: '911', description: 'Police, fire, or medical emergency' },
    { id: 'poison', label: 'Poison Control', number: '18005687666', description: 'Poisoning and overdose help' },
    { id: 'domestic', label: 'Assaulted Women Helpline', number: '18668631014', description: 'Women experiencing abuse or violence' },
    { id: 'mentalhealth', label: 'Talk Suicide Canada', number: '18334564566', description: 'Mental health crisis support', isMentalHealth: true },
  ],
  GB: [
    { id: 'general', label: 'All Emergencies (999)', number: '999', description: 'Police, fire, or medical emergency' },
    { id: 'nonurgent', label: 'Police Non-Emergency', number: '101', description: 'Non-urgent police matters' },
    { id: 'domestic', label: 'National Domestic Abuse Helpline', number: '08082000247', description: 'Domestic abuse support for women' },
    { id: 'child', label: 'NSPCC Child Protection', number: '08008005000', description: 'Child abuse or child in distress' },
    { id: 'mentalhealth', label: 'Samaritans', number: '116123', description: 'Emotional support, 24/7', isMentalHealth: true },
  ],
  EU: [
    { id: 'general', label: 'All Emergencies (112)', number: '112', description: 'Police, fire, or medical emergency' },
  ],
  AU: [
    { id: 'general', label: 'All Emergencies (000)', number: '000', description: 'Police, fire, or medical emergency' },
    { id: 'poison', label: 'Poisons Information', number: '131126', description: 'Poisoning and overdose help' },
    { id: 'domestic', label: '1800RESPECT', number: '1800737732', description: 'Sexual assault or domestic violence support' },
    { id: 'mentalhealth', label: 'Lifeline Australia', number: '131114', description: 'Mental health crisis support', isMentalHealth: true },
  ],
  IN: [
    { id: 'general', label: 'All Emergencies (112)', number: '112', description: 'Police, fire, or medical emergency' },
    { id: 'police', label: 'Police Helpline', number: '100', description: 'Police assistance' },
    { id: 'fire', label: 'Fire Brigade', number: '101', description: 'Fire and rescue services' },
    { id: 'ambulance', label: 'Ambulance', number: '102', description: 'Emergency medical transport' },
    { id: 'women', label: 'Women Helpline (1091)', number: '1091', description: 'Women in distress — abuse, violence, harassment' },
    { id: 'child', label: 'Child Helpline (1098)', number: '1098', description: 'Child abuse, missing child, or child in distress' },
    { id: 'senior', label: 'Senior Citizens Helpline', number: '14567', description: 'Elder abuse or senior citizen in distress' },
    { id: 'cybercrime', label: 'Cyber Crime Helpline', number: '1930', description: 'Report online fraud, cybercrime, or cyber abuse' },
    { id: 'poison', label: 'Poison Control', number: '18002221222', description: 'Poisoning and overdose help' },
    { id: 'mentalhealth', label: 'iCall Mental Health Helpline', number: '9152987821', description: 'Mental health support and counseling', isMentalHealth: true },
  ],
  XX: [],
};

export function getEmergencyServices(code: string): EmergencyService[] {
  return EMERGENCY_SERVICES[code] ?? [];
}

export const MENTAL_HEALTH_RESOURCES: Record<string, MentalHealthResource> = {
  US: {
    label: '988 Suicide & Crisis Lifeline',
    number: '988',
    textLine: '988',
    chatUrl: 'https://988lifeline.org/chat/',
    description: 'Call or text 988 for free, confidential support 24/7 if you are in distress or having thoughts of suicide.',
  },
  CA: {
    label: 'Talk Suicide Canada',
    number: '18334564566',
    textLine: '45645',
    chatUrl: 'https://www.talksuicide.ca/',
    description: 'Call or text for free, confidential suicide crisis support 24/7.',
  },
  GB: {
    label: 'Samaritans',
    number: '116123',
    textLine: null,
    chatUrl: 'https://www.samaritans.org/how-we-can-help/contact-samaritan/',
    description: 'Call 116 123 for free, 24/7 emotional support. You do not have to be suicidal to reach out.',
  },
  EU: {
    label: 'European Emergency (112)',
    number: '112',
    textLine: null,
    chatUrl: null,
    description: 'Call 112 for emergencies. For mental health support, contact your national crisis line.',
  },
  AU: {
    label: 'Lifeline Australia',
    number: '131114',
    textLine: '0477131114',
    chatUrl: 'https://www.lifeline.org.au/get-help/online-services/crisis-chat/',
    description: 'Call 13 11 14 or text 0477 131 114 for 24/7 crisis support and emotional support.',
  },
  IN: {
    label: 'iCall Mental Health Helpline',
    number: '9152987821',
    textLine: null,
    chatUrl: null,
    description: 'Call for free mental health support and counseling.',
  },
  XX: {
    label: 'Find your local crisis line',
    number: null,
    textLine: null,
    chatUrl: 'https://findahelpline.com/',
    description: 'If you are in immediate danger, call your local emergency number. For non-emergency support, search for a crisis line in your country.',
  },
};

export function getMentalHealthResource(code: string): MentalHealthResource {
  return MENTAL_HEALTH_RESOURCES[code] ?? MENTAL_HEALTH_RESOURCES.XX;
}

export const QUICK_SUGGESTIONS = [
  'Severe bleeding',
  'Trouble breathing',
  'Unconscious person',
  'Chest pain',
  'Fire or smoke',
  'Suspected poisoning',
  'Mental health crisis',
];
