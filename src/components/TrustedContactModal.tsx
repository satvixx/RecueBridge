import { useState } from 'react';
import { X, MapPin, FileText, Clock, Send, AlertTriangle, Share2 } from 'lucide-react';
import type { Guidance, QuestionAnswer } from '@/types';
import type { LocationData } from '@/lib/voiceLocation';

interface TrustedContactModalProps {
  guidance: Guidance;
  answers: QuestionAnswer[];
  location: LocationData | null;
  locationManual: string | null;
  timestamp: string;
  description: string;
  onClose: () => void;
}

export function TrustedContactModal({
  guidance,
  answers,
  location,
  locationManual,
  timestamp,
  description,
  onClose,
}: TrustedContactModalProps) {
  const [step, setStep] = useState<'contact' | 'preview' | 'sent'>('contact');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMethod, setContactMethod] = useState<'sms' | 'copy'>('sms');

  const locationText = location
    ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}${location.accuracy ? ` (\u00B1${Math.round(location.accuracy)}m)` : ''}`
    : locationManual
      ? locationManual
      : 'Unknown — not detected';

  const mapsLink = location
    ? `https://www.google.com/maps?q=${location.lat},${location.lng}`
    : '';

  const buildShareText = () => {
    const lines = [
      'RescueBridge Emergency Alert',
      `Emergency type: ${guidance.emergencyType}`,
      `Time: ${timestamp}`,
      `Location: ${locationText}`,
    ];
    if (mapsLink) lines.push(`Map: ${mapsLink}`);
    if (answers.length > 0) {
      lines.push('Key information:');
      answers.forEach((a) => lines.push(`  - ${a.prompt}: ${a.answer}`));
    }
    if (description) lines.push(`Situation: ${description}`);
    return lines.join('\n');
  };

  const handleSend = async () => {
    const text = buildShareText();
    if (contactMethod === 'sms') {
      const phone = contactPhone.trim().replace(/[^\d+]/g, '');
      const target = phone ? `sms:${phone}?body=` : 'sms:?body=';
      window.location.href = `${target}${encodeURIComponent(text)}`;
    } else {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        /* clipboard unavailable */
      }
    }
    setStep('sent');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Share2 size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Share with Trusted Contact</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 -m-1 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {step === 'contact' && (
            <>
              <p className="text-sm text-gray-600 leading-relaxed">
                Enter the phone number of someone you trust. They will receive your emergency
                information.
              </p>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                  Trusted contact name (optional)
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Mom, Dad, Alex"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-0 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                  Trusted contact phone number (optional)
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. +1 555 123 4567"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-0 outline-none"
                />
                <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                  If you enter a number, your messaging app will open with it pre-filled.
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                  How to share
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setContactMethod('sms')}
                    className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold border-2 transition-colors ${
                      contactMethod === 'sms'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400'
                    }`}
                  >
                    Open in Messages
                  </button>
                  <button
                    onClick={() => setContactMethod('copy')}
                    className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold border-2 transition-colors ${
                      contactMethod === 'copy'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400'
                    }`}
                  >
                    Copy to share
                  </button>
                </div>
              </div>

              <button
                onClick={() => setStep('preview')}
                className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-base font-bold text-white hover:bg-blue-700 transition-colors"
              >
                Review what will be shared
              </button>
            </>
          )}

          {step === 'preview' && (
            <>
              <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                <div className="flex gap-2.5">
                  <AlertTriangle size={18} className="shrink-0 text-amber-600 mt-0.5" />
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Please review everything below. You must confirm before anything is sent.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    What will be shared
                  </p>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <FileText size={16} className="shrink-0 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Emergency type</p>
                      <p className="text-sm font-semibold text-gray-900">{guidance.emergencyType}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin size={16} className="shrink-0 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-semibold text-gray-900">{locationText}</p>
                      {!location && locationManual && (
                        <p className="text-xs text-amber-600 mt-0.5">Manual location</p>
                      )}
                      {!location && !locationManual && (
                        <p className="text-xs text-red-500 mt-0.5">No location available</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Clock size={16} className="shrink-0 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="text-sm font-semibold text-gray-900">{timestamp}</p>
                    </div>
                  </div>

                  {answers.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Key information</p>
                      <ul className="space-y-1">
                        {answers.map((a) => (
                          <li key={a.questionId} className="text-sm text-gray-700">
                            <span className="text-gray-500">{a.prompt}:</span>{' '}
                            <span className="font-medium">{a.answer}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {description && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Situation</p>
                      <p className="text-sm text-gray-700 italic">"{description}"</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('contact')}
                  className="flex-1 rounded-xl bg-white border-2 border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSend}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
                >
                  <Send size={16} />
                  Confirm & Share
                </button>
              </div>
            </>
          )}

          {step === 'sent' && (
            <div className="text-center py-6 space-y-3">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <Send size={28} className="text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {contactMethod === 'sms' ? 'Opened in Messages' : 'Copied to clipboard'}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {contactMethod === 'sms'
                  ? 'Your messaging app has opened with the emergency details. Select your trusted contact and send.'
                  : 'Your emergency details are copied. Paste them into a message to your trusted contact.'}
              </p>
              <button
                onClick={onClose}
                className="w-full rounded-xl bg-blue-600 px-5 py-3 text-base font-bold text-white hover:bg-blue-700 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
