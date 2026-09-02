import { useState, useEffect } from 'react';
import {
  Phone,
  Volume2,
  Square,
  Copy,
  Check,
  MapPin,
  RotateCcw,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Info,
  Ban,
  Heart,
  Share2,
  Edit3,
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Disclaimer } from '@/components/Disclaimer';
import { SupportChat } from '@/components/SupportChat';
import { QuestionFlow } from '@/components/QuestionFlow';
import { EmergencySummary } from '@/components/EmergencySummary';
import { TrustedContactModal } from '@/components/TrustedContactModal';
import { speakGuidance, stopSpeaking, isSpeechSynthesisSupported } from '@/lib/speech';
import {
  isGeolocationSupported,
  getCurrentLocation,
  buildMapsLink,
  type LocationData,
} from '@/lib/voiceLocation';
import { FALLBACK_MESSAGE } from '@/lib/guidanceApi';
import { getMentalHealthResource } from '@/data/countries';
import { getQuestionsForCategory } from '@/data/emergencyQuestions';
import type { Guidance, Urgency, QuestionAnswer } from '@/types';

interface GuidanceScreenProps {
  guidance: Guidance;
  description: string;
  isDemo: boolean;
  usedFallback: boolean;
  countryCode: string;
  onCall: () => void;
  onStartOver: () => void;
}

const urgencyConfig: Record<
  Urgency,
  { label: string; badge: string; bar: string; icon: typeof Clock }
> = {
  immediate: {
    label: 'IMMEDIATE — CALL NOW',
    badge: 'bg-red-600 text-white',
    bar: 'bg-red-600',
    icon: ShieldAlert,
  },
  urgent: {
    label: 'URGENT — CALL SOON',
    badge: 'bg-amber-500 text-white',
    bar: 'bg-amber-500',
    icon: Clock,
  },
  caution: {
    label: 'CAUTION — ASSESS CAREFULLY',
    badge: 'bg-blue-600 text-white',
    bar: 'bg-blue-600',
    icon: Info,
  },
};

export function GuidanceScreen({
  guidance,
  description,
  isDemo,
  usedFallback,
  countryCode,
  onCall,
  onStartOver,
}: GuidanceScreenProps) {
  const [speaking, setSpeaking] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedLocation, setCopiedLocation] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationManual, setLocationManual] = useState<string | null>(null);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [showQuestions, setShowQuestions] = useState(true);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [trustedContactOpen, setTrustedContactOpen] = useState(false);
  const [manualLocationInput, setManualLocationInput] = useState('');
  const [timestamp] = useState(() => new Date().toLocaleString());

  const ttsSupported = isSpeechSynthesisSupported();
  const geoSupported = isGeolocationSupported();
  const urgency = urgencyConfig[guidance.urgency];
  const UrgencyIcon = urgency.icon;
  const mentalHealth = getMentalHealthResource(countryCode);
  const questions = getQuestionsForCategory(guidance.category);

  const handleCopyMhNumber = async (num: string) => {
    try {
      await navigator.clipboard.writeText(num);
      setCopiedNumber(num);
      setTimeout(() => setCopiedNumber(null), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const handleReadAloud = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    speakGuidance(guidance);
    setSpeaking(true);
    const interval = setInterval(() => {
      if (!isSpeechSynthesisSupported() || !window.speechSynthesis.speaking) {
        setSpeaking(false);
        clearInterval(interval);
      }
    }, 400);
  };

  const buildEnhancedSummary = () => {
    let summary = guidance.dispatcherSummary;
    if (answers.length > 0) {
      const answerParts = answers
        .filter((a) => a.answer !== 'Unknown')
        .map((a) => `${a.prompt.replace(/\?$/, '')}: ${a.answer}`);
      if (answerParts.length > 0) {
        summary += ` ${answerParts.join('. ')}.`;
      }
    }
    if (location) {
      summary += ` Location: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}.`;
    } else if (locationManual) {
      summary += ` Location (manual): ${locationManual}.`;
    }
    return summary;
  };

  const handleCopySummary = async () => {
    const text = `${buildEnhancedSummary()}\n\nSituation: ${description}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const handleShareLocation = async () => {
    if (!geoSupported) {
      setLocationError('Location is not supported on this device. You can enter a location manually below.');
      return;
    }
    if (location) {
      await copyLocationToClipboard();
      return;
    }
    setLocationLoading(true);
    setLocationError(null);
    try {
      const loc = await getCurrentLocation();
      setLocation(loc);
      await copyLocationToClipboard(loc);
    } catch (err) {
      setLocationError(err instanceof Error ? err.message : 'Could not get location.');
    } finally {
      setLocationLoading(false);
    }
  };

  const copyLocationToClipboard = async (loc?: LocationData) => {
    const data = loc ?? location;
    if (!data) return;
    const link = buildMapsLink(data.lat, data.lng);
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLocation(true);
      setTimeout(() => setCopiedLocation(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const handleManualLocationSubmit = () => {
    const trimmed = manualLocationInput.trim();
    if (trimmed) {
      setLocationManual(trimmed);
      setLocationError(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <div className="mx-auto w-full max-w-md flex-1 flex flex-col px-5">
        {/* Header */}
        <header className="pt-6 pb-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Your Guidance</h1>
          {isDemo && (
            <span className="rounded-full bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 border border-amber-300">
              DEMO
            </span>
          )}
        </header>

        <main className="flex-1 pb-6 space-y-4">
          {/* Demo banner */}
          {isDemo && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
              <div className="flex gap-2.5">
                <AlertTriangle size={18} className="shrink-0 text-amber-600 mt-0.5" />
                <p className="text-sm text-amber-800 leading-relaxed">
                  <span className="font-bold">Demo only</span> — do not use this to delay
                  contacting emergency services.
                </p>
              </div>
            </div>
          )}

          {/* Fallback notice */}
          {usedFallback && (
            <div className="rounded-xl bg-red-50 border-2 border-red-300 px-4 py-3">
              <div className="flex gap-2.5">
                <AlertTriangle size={20} className="shrink-0 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-900 leading-relaxed">
                    {FALLBACK_MESSAGE}
                  </p>
                  <p className="mt-1 text-sm text-red-700 leading-relaxed">
                    Showing built-in safety steps for this type of emergency.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Urgency bar */}
          <div className={`h-1.5 w-full rounded-full ${urgency.bar}`} />

          {/* Emergency type + urgency badge */}
          <section className="card p-5 animate-slide-up">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Emergency type
                </p>
                <h2 className="text-xl font-bold text-gray-900 mt-0.5">
                  {guidance.emergencyType}
                </h2>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold tracking-wide whitespace-nowrap ${urgency.badge}`}
              >
                <UrgencyIcon size={14} />
                {urgency.label}
              </span>
            </div>
            <p className="mt-3 text-base text-blue-700 font-medium leading-relaxed">
              {guidance.openingMessage}
            </p>
          </section>

          {/* AI-guided question flow */}
          {showQuestions && questions.length > 0 && (
            <QuestionFlow
              questions={questions}
              onComplete={(result) => {
                setAnswers(result);
                setShowQuestions(false);
              }}
              onSkip={() => {
                setAnswers([]);
                setShowQuestions(false);
              }}
            />
          )}

          {/* Edit answers button after completing questions */}
          {!showQuestions && answers.length > 0 && (
            <button
              onClick={() => setShowQuestions(true)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors px-1"
            >
              <Edit3 size={15} />
              Review answers
            </button>
          )}

          {/* Emergency Summary — only after questions are done */}
          {!showQuestions && (
            <EmergencySummary
              guidance={guidance}
              answers={answers}
              location={location}
              locationManual={locationManual}
              timestamp={timestamp}
            />
          )}

          {/* Summary for dispatcher */}
          {!showQuestions && (
            <section className="card p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Summary for dispatcher
                </p>
                <button
                  onClick={handleCopySummary}
                  aria-label={copiedSummary ? 'Dispatcher summary copied' : 'Copy dispatcher summary'}
                  title={copiedSummary ? 'Copied' : 'Copy dispatcher summary'}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  {copiedSummary ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
              <p className="mt-1 text-base text-gray-900 leading-relaxed">
                {buildEnhancedSummary()}
              </p>
              <div className="mt-2 rounded-lg bg-gray-50 px-3 py-2">
                <p className="text-sm text-gray-600 italic leading-relaxed">"{description}"</p>
              </div>
            </section>
          )}

          {/* Steps — numbered instruction cards */}
          {!showQuestions && (
            <section className="space-y-2.5">
              <h3 className="text-base font-bold text-gray-900 px-1">What to do now</h3>
              {guidance.steps.slice(0, 5).map((step, i) => (
                <div
                  key={i}
                  className="card p-4 flex gap-3.5 items-start animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white text-base font-extrabold">
                    {i + 1}
                  </span>
                  <p className="text-base text-gray-800 leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </section>
          )}

          {/* Do Not Do */}
          {!showQuestions && (
            <section className="rounded-2xl bg-red-50 border border-red-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Ban size={20} className="text-red-600" />
                <h3 className="text-base font-bold text-red-900">Do Not Do</h3>
              </div>
              <ul className="space-y-2.5">
                {guidance.doNotDo.map((item, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-red-500" />
                    <span className="text-base text-red-900 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Mental health resources */}
          {!showQuestions && guidance.category === 'mental_health_crisis' && mentalHealth && (
            <section className="rounded-2xl bg-blue-50 border border-blue-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Heart size={20} className="text-blue-600" />
                <h3 className="text-base font-bold text-blue-900">Crisis Support Resources</h3>
              </div>
              <p className="text-sm text-blue-800 font-medium mb-2">{mentalHealth.label}</p>
              <p className="text-sm text-blue-700 leading-relaxed mb-3">{mentalHealth.description}</p>
              <div className="flex flex-wrap gap-2">
                {mentalHealth.number && (
                  <button
                    onClick={() => handleCopyMhNumber(mentalHealth.number!)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                  >
                    {copiedNumber === mentalHealth.number ? <Check size={15} /> : <Phone size={15} />}
                    {copiedNumber === mentalHealth.number ? 'Copied' : `Call ${mentalHealth.number}`}
                  </button>
                )}
                {mentalHealth.textLine && (
                  <button
                    onClick={() => handleCopyMhNumber(mentalHealth.textLine!)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                  >
                    {copiedNumber === mentalHealth.textLine ? <Check size={15} /> : <Copy size={15} />}
                    {copiedNumber === mentalHealth.textLine ? 'Copied' : `Text ${mentalHealth.textLine}`}
                  </button>
                )}
                {mentalHealth.chatUrl && (
                  <a
                    href={mentalHealth.chatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                  >
                    Chat Online
                  </a>
                )}
              </div>
              <p className="mt-3 text-xs text-blue-700 leading-relaxed">
                If there is immediate danger of harm, call your local emergency number now.
              </p>
            </section>
          )}

          {/* Supportive chat companion — only for mental health crisis */}
          {!showQuestions && guidance.category === 'mental_health_crisis' && (
            <SupportChat countryCode={countryCode} />
          )}

          {/* Location result */}
          {!showQuestions && location && (
            <section className="card p-4 animate-fade-in">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="shrink-0 text-blue-600 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">Your location</p>
                  <p className="text-sm text-gray-600 tabular-nums">
                    {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                    {location.accuracy && ` (${'\u00B1'}${Math.round(location.accuracy)}m)`}
                  </p>
                  <a
                    href={buildMapsLink(location.lat, location.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800"
                  >
                    Open in Maps
                  </a>
                </div>
                {copiedLocation && (
                  <span className="inline-flex items-center gap-1 text-sm text-green-600 font-medium">
                    <Check size={16} /> Copied
                  </span>
                )}
              </div>
            </section>
          )}

          {/* Manual location result */}
          {!showQuestions && !location && locationManual && (
            <section className="card p-4 animate-fade-in">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="shrink-0 text-blue-600 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">Manual location</p>
                  <p className="text-sm text-gray-600">{locationManual}</p>
                </div>
              </div>
            </section>
          )}

          {locationError && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-center gap-2 text-sm text-amber-800">
              <AlertTriangle size={16} />
              {locationError}
            </div>
          )}

          {/* Manual location input */}
          {!showQuestions && !location && (
            <div className="card p-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Enter location manually
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualLocationInput}
                  onChange={(e) => setManualLocationInput(e.target.value)}
                  placeholder="e.g. 123 Main St, near the park"
                  aria-label="Manual location"
                  className="flex-1 rounded-xl border-2 border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-0 outline-none"
                />
                <button
                  onClick={handleManualLocationSubmit}
                  disabled={!manualLocationInput.trim()}
                  className="shrink-0 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {!showQuestions && (
            <div className="flex flex-col gap-3 pt-1">
              <button
                onClick={onCall}
                className="flex items-center justify-center gap-2.5 rounded-xl bg-red-600 px-5 py-4 text-lg font-bold text-white shadow-lg transition-colors hover:bg-red-700 active:bg-red-800"
              >
                <Phone size={22} />
                Call Emergency Services
              </button>

              <Button
                variant="primary"
                size="lg"
                icon={<Share2 size={18} />}
                onClick={() => setTrustedContactOpen(true)}
              >
                Share with Trusted Contact
              </Button>

              <Button
                variant="primary"
                size="lg"
                icon={speaking ? <Square size={18} /> : <Volume2 size={20} />}
                onClick={handleReadAloud}
                disabled={!ttsSupported}
              >
                {speaking ? 'Stop Reading' : 'Read Instructions Aloud'}
              </Button>

              <Button
                variant="secondary"
                size="lg"
                icon={<MapPin size={18} />}
                onClick={handleShareLocation}
                disabled={locationLoading}
              >
                {locationLoading
                  ? 'Getting location...'
                  : location
                    ? copiedLocation
                      ? 'Location Copied'
                      : 'Copy Location Link'
                    : geoSupported
                      ? 'Share My Location'
                      : 'Location unavailable — enter manually'}
              </Button>

              <Button
                variant="ghost"
                size="lg"
                icon={<RotateCcw size={18} />}
                onClick={onStartOver}
              >
                Start Over
              </Button>
            </div>
          )}

          {!showQuestions && (
            <div className="pt-2">
              <Disclaimer variant="full" />
            </div>
          )}
        </main>
      </div>

      {trustedContactOpen && (
        <TrustedContactModal
          guidance={guidance}
          answers={answers}
          location={location}
          locationManual={locationManual}
          timestamp={timestamp}
          description={description}
          onClose={() => setTrustedContactOpen(false)}
        />
      )}
    </div>
  );
}
