import type { Guidance } from '@/types';

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speakGuidance(guidance: Guidance): void {
  if (!isSpeechSynthesisSupported()) return;
  window.speechSynthesis.cancel();

  const parts = [
    guidance.openingMessage,
    `Urgency: ${guidance.urgency}.`,
    'Here are the steps.',
    ...guidance.steps.map((step, i) => `Step ${i + 1}. ${step}`),
    'Do not do the following.',
    ...guidance.doNotDo,
  ];

  const utterance = new SpeechSynthesisUtterance(parts.join(' '));
  utterance.rate = 0.92;
  utterance.pitch = 1;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeaking(): boolean {
  return isSpeechSynthesisSupported() && window.speechSynthesis.speaking;
}
