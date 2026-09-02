import type { EmergencyCategory, Guidance } from '@/types';

export const FALLBACK_GUIDANCE: Record<EmergencyCategory, Guidance> = {
  severe_bleeding: {
    emergencyType: 'Severe bleeding',
    urgency: 'immediate',
    openingMessage: 'Stay calm. You can help — call emergency services right away.',
    steps: [
      'Call your local emergency number now.',
      'Put firm, steady pressure on the wound with a clean cloth.',
      'Keep pressing — do not lift the cloth to check. Add more cloth on top if it soaks through.',
      'Keep the injured area still and raise it above the heart if possible.',
      'Stay with the person and follow the dispatcher’s instructions.',
    ],
    doNotDo: [
      'Do not use a tourniquet unless a dispatcher tells you to.',
      'Do not remove an object that is stuck in the wound.',
      'Do not give the person anything to eat or drink.',
    ],
    dispatcherSummary:
      'A person is bleeding heavily from an injury. Pressure is being applied. Emergency help is needed immediately.',
    category: 'severe_bleeding',
    source: 'fallback',
  },
  trouble_breathing: {
    emergencyType: 'Trouble breathing',
    urgency: 'immediate',
    openingMessage: 'This is serious. Call emergency services right away.',
    steps: [
      'Call your local emergency number now.',
      'Help the person sit upright and lean slightly forward.',
      'Loosen tight clothing around the neck and chest.',
      'Ask if they have a rescue inhaler and help them use it.',
      'Stay calm and reassure them while you wait for help.',
    ],
    doNotDo: [
      'Do not lay the person flat if they struggle to breathe sitting up.',
      'Do not give them water or food.',
      'Do not leave them alone.',
    ],
    dispatcherSummary:
      'A person is having severe difficulty breathing. They are sitting upright. Emergency help is needed immediately.',
    category: 'trouble_breathing',
    source: 'fallback',
  },
  unconscious: {
    emergencyType: 'Unconscious person',
    urgency: 'immediate',
    openingMessage: 'Act quickly. Call emergency services and follow their guidance.',
    steps: [
      'Call your local emergency number now.',
      'Check if the person responds when you speak or gently shake their shoulder.',
      'If they are not breathing normally, the dispatcher will guide you on CPR — follow their instructions exactly.',
      'If breathing, gently roll them onto their side into the recovery position.',
      'Stay with them and watch their breathing until help arrives.',
    ],
    doNotDo: [
      'Do not move the person unless they are in danger.',
      'Do not give them food or water.',
      'Do not put anything in their mouth.',
    ],
    dispatcherSummary:
      'A person is unresponsive. Breathing status is being checked. Emergency help is needed immediately.',
    category: 'unconscious',
    source: 'fallback',
  },
  chest_pain: {
    emergencyType: 'Chest pain',
    urgency: 'immediate',
    openingMessage: 'Chest pain can be serious. Call emergency services right away.',
    steps: [
      'Call your local emergency number now.',
      'Have the person sit down and stay as still and calm as possible.',
      'Loosen tight clothing around the chest.',
      'If the dispatcher advises and the person has prescribed medication, help them take it.',
      'Stay with them and follow the dispatcher’s instructions.',
    ],
    doNotDo: [
      'Do not let the person walk or exert themselves.',
      'Do not give them food or water.',
      'Do not assume it is just indigestion.',
    ],
    dispatcherSummary:
      'A person is reporting chest pain. They are sitting still. Emergency help is needed immediately.',
    category: 'chest_pain',
    source: 'fallback',
  },
  fire_smoke: {
    emergencyType: 'Fire or smoke',
    urgency: 'immediate',
    openingMessage: 'Get out first, then call. Your safety comes first.',
    steps: [
      'Leave the building immediately if you can do so safely.',
      'Stay low to the ground to avoid smoke.',
      'Once safe, call your local emergency number.',
      'Do not go back inside for any reason.',
      'Tell the dispatcher where the fire is and whether anyone is still inside.',
    ],
    doNotDo: [
      'Do not go back inside a burning building.',
      'Do not use elevators.',
      'Do not try to fight a large fire yourself.',
    ],
    dispatcherSummary:
      'There is a fire with smoke. People are evacuating. Location and possible trapped occupants are being reported.',
    category: 'fire_smoke',
    source: 'fallback',
  },
  poisoning: {
    emergencyType: 'Suspected poisoning',
    urgency: 'urgent',
    openingMessage: 'Call emergency services. Do not try to treat this yourself.',
    steps: [
      'Call your local emergency number now.',
      'Move the person to fresh air if the poison is a gas or fumes.',
      'Take the container or label of what was taken, if it is safe to do so.',
      'Do not make the person vomit unless the dispatcher tells you to.',
      'Follow the dispatcher’s instructions exactly.',
    ],
    doNotDo: [
      'Do not make the person vomit.',
      'Do not give them anything to eat or drink unless told to.',
      'Do not wait for symptoms to get worse before calling.',
    ],
    dispatcherSummary:
      'A person may have been poisoned. The substance is being identified for the dispatcher. Emergency help is needed.',
    category: 'poisoning',
    source: 'fallback',
  },
  serious_injury: {
    emergencyType: 'Serious injury',
    urgency: 'urgent',
    openingMessage: 'Stay calm. Call emergency services and keep the person still.',
    steps: [
      'Call your local emergency number now.',
      'Keep the injured person still — do not move them unless they are in danger.',
      'Apply gentle pressure to any bleeding with a clean cloth.',
      'Keep them warm and comfortable while you wait.',
      'Follow the dispatcher’s instructions.',
    ],
    doNotDo: [
      'Do not move the person unless they are in danger.',
      'Do not try to push bones back into place.',
      'Do not give them food or drink.',
    ],
    dispatcherSummary:
      'A person has a serious injury. They are being kept still. Emergency help is needed.',
    category: 'serious_injury',
    source: 'fallback',
  },
  unsafe_violent: {
    emergencyType: 'Unsafe or violent situation',
    urgency: 'immediate',
    openingMessage: 'Your safety is the priority. Get to a safe place first.',
    steps: [
      'Move away from danger if you can do so safely.',
      'Once safe, call your local emergency number.',
      'Tell the dispatcher where you are and what is happening.',
      'Stay hidden and quiet if you cannot leave.',
      'Do not confront anyone — wait for help to arrive.',
    ],
    doNotDo: [
      'Do not put yourself in danger to help someone else.',
      'Do not confront a violent person.',
      'Do not hang up unless the dispatcher tells you to.',
    ],
    dispatcherSummary:
      'There is an unsafe or violent situation. The caller is reporting location and what is happening. Emergency help is needed immediately.',
    category: 'unsafe_violent',
    source: 'fallback',
  },
  mental_health_crisis: {
    emergencyType: 'Mental health crisis',
    urgency: 'urgent',
    openingMessage:
      'You do not have to handle this alone. If you may hurt yourself or someone else, contact emergency services now.',
    steps: [
      'If there is immediate danger of harm, call your local emergency number now.',
      'Stay with the person and keep them safe until help arrives.',
      'Listen without judgment — do not argue or dismiss their feelings.',
      'Call a crisis hotline for support and guidance.',
      'Follow the dispatcher or crisis counselor\'s instructions exactly.',
    ],
    doNotDo: [
      'Do not leave the person alone if they may be at risk.',
      'Do not try to diagnose or minimize what they are going through.',
      'Do not delay calling emergency services if there is any risk of harm.',
    ],
    dispatcherSummary:
      'A person may be experiencing a mental health crisis. Risk of harm is being assessed. Support and emergency help may be needed.',
    category: 'mental_health_crisis',
    source: 'fallback',
  },
  other: {
    emergencyType: 'Other emergency',
    urgency: 'urgent',
    openingMessage: 'When in doubt, call emergency services. It is better to ask for help.',
    steps: [
      'Call your local emergency number now.',
      'Describe clearly what is happening and where you are.',
      'Stay with the person who needs help.',
      'Follow the dispatcher’s instructions exactly.',
      'Do not hang up unless the dispatcher tells you to.',
    ],
    doNotDo: [
      'Do not put yourself in danger.',
      'Do not delay calling if the situation might be serious.',
      'Do not give the person food or drink unless the dispatcher says so.',
    ],
    dispatcherSummary:
      'An emergency situation is being reported. Details are being provided to the dispatcher. Emergency help is needed.',
    category: 'other',
    source: 'fallback',
  },
};

export const DEMO_SCENARIO =
  'Someone is bleeding badly from their arm after a fall. There is a lot of blood and they are in pain.';
