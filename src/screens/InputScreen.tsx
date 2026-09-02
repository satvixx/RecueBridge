import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Phone, Mic, MicOff, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/Button';
import { Disclaimer } from '@/components/Disclaimer';
import { isVoiceInputSupported, createVoiceInput } from '@/lib/voiceLocation';
import type { VoiceInputController } from '@/lib/voiceLocation';
import { QUICK_SUGGESTIONS } from '@/data/countries';

interface InputScreenProps {
  onBack: () => void;
  onSubmit: (description: string) => void;
  onCall: () => void;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  initialDescription?: string;
  isDemo: boolean;
}

export function InputScreen({
  onBack,
  onSubmit,
  onCall,
  loading,
  error,
  onRetry,
  initialDescription = '',
  isDemo,
}: InputScreenProps) {
  const [description, setDescription] = useState(initialDescription);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const voiceRef = useRef<VoiceInputController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialDescription && isDemo) {
      textareaRef.current?.focus();
    } else {
      textareaRef.current?.focus();
    }
  }, [initialDescription, isDemo]);

  const voiceSupported = isVoiceInputSupported();
  const trimmed = description.trim();
  const isEmpty = trimmed.length === 0;
  const showError = touched && isEmpty && !listening;

  const handleVoice = () => {
    setVoiceError(null);
    if (!voiceSupported) {
      setVoiceError('Voice input is not supported in this browser. Type your description instead.');
      return;
    }
    if (listening) {
      voiceRef.current?.stop();
      setListening(false);
      return;
    }
    try {
      const controller = createVoiceInput({
        onResult: (transcript) => {
          setDescription(transcript);
        },
        onEnd: () => setListening(false),
        onError: (msg) => {
          setVoiceError(msg);
          setListening(false);
        },
      });
      voiceRef.current = controller;
      controller.start();
      setListening(true);
    } catch (err) {
      setVoiceError(err instanceof Error ? err.message : 'Could not start voice input.');
      setListening(false);
    }
  };

  const handleSubmit = () => {
    setTouched(true);
    if (isEmpty || loading) return;
    onSubmit(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <div className="mx-auto w-full max-w-md flex-1 flex flex-col px-5">
        {/* Header */}
        <header className="pt-6 pb-2 flex items-center gap-3">
          <button
            onClick={onBack}
            aria-label="Go back to home"
            className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">What is happening?</h1>
        </header>

        <main className="flex-1 py-4 flex flex-col">
          <p className="text-sm text-gray-600 mb-3">
            Describe the situation in your own words. Be as specific as you can.
          </p>

          {/* Demo badge */}
          {isDemo && (
            <div className="mb-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-amber-600" />
              <p className="text-sm text-amber-800 font-medium">
                Demo scenario loaded — press “Get Immediate Steps” to continue.
              </p>
            </div>
          )}

          {/* Quick suggestions — hidden in demo mode */}
          {!isDemo && (
            <div className="mb-3">
              <p className="text-sm font-semibold text-gray-700 mb-2">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setDescription(suggestion)}
                    className="rounded-full bg-white border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Textarea */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => setTouched(true)}
              onKeyDown={handleKeyDown}
              placeholder="Example: Someone is bleeding badly from their arm."
              readOnly={isDemo}
              rows={5}
              aria-label="Emergency description"
              aria-invalid={showError}
              className="w-full rounded-2xl border-2 bg-white px-4 py-4 text-lg text-gray-900 placeholder:text-gray-400 resize-none focus:border-blue-500 focus:ring-0 transition-colors leading-relaxed"
            />
            {listening && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-semibold text-red-700">Listening…</span>
              </div>
            )}
          </div>

          {/* Voice hint */}
          {listening && (
            <p className="mt-2 text-sm text-blue-600 font-medium animate-fade-in">
              Speak clearly. Your words will appear as you talk. Tap “Stop Voice” when done.
            </p>
          )}

          {/* Validation error */}
          {showError && (
            <div className="mt-2 flex items-center gap-1.5 text-sm text-red-700">
              <AlertCircle size={16} />
              <span>Please describe what is happening before continuing.</span>
            </div>
          )}
          {voiceError && (
            <div className="mt-2 flex items-center gap-1.5 text-sm text-amber-700">
              <AlertCircle size={16} />
              <span>{voiceError}</span>
            </div>
          )}

          {/* API error with retry */}
          {error && (
            <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle size={18} className="shrink-0 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-amber-800 font-medium">
                    AI guidance is unavailable. Call emergency services and follow the
                    dispatcher's instructions.
                  </p>
                  <button
                    onClick={onRetry}
                    className="mt-1.5 text-sm font-semibold text-amber-800 underline hover:text-amber-900"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-5 flex flex-col gap-3">
            <Button
              variant="primary"
              size="lg"
              icon={loading ? undefined : <Sparkles size={20} />}
              onClick={handleSubmit}
              disabled={loading || isEmpty}
            >
              {loading ? 'Getting steps…' : 'Get Immediate Steps'}
            </Button>

            {/* Voice input — hidden in demo mode */}
            {!isDemo && (
              <Button
                variant="secondary"
                size="lg"
                icon={listening ? <MicOff size={20} /> : <Mic size={20} />}
                onClick={handleVoice}
                disabled={!voiceSupported || loading}
              >
                {listening ? 'Stop Voice' : 'Describe by Voice'}
              </Button>
            )}

            {!isDemo && (
              <Button
                variant="emergency"
                size="lg"
                icon={<Phone size={20} />}
                onClick={onCall}
                disabled={loading}
              >
                Call Emergency Services
              </Button>
            )}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="mt-5 flex flex-col items-center gap-3 animate-fade-in">
              <div className="h-10 w-10 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
              <p className="text-sm text-gray-500">Analyzing the situation…</p>
            </div>
          )}

          <div className="mt-5 mb-6">
            <Disclaimer variant="card" />
          </div>
        </main>
      </div>
    </div>
  );
}
