import { useEffect, useRef, useState } from 'react';
import { Phone, X, Copy, Check, ChevronDown, Heart } from 'lucide-react';
import type { Country, EmergencyService } from '@/types';
import { getEmergencyServices, getMentalHealthResource } from '@/data/countries';

interface CallModalProps {
  country: Country;
  onClose: () => void;
}

function isTelSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /Android|iPhone|iPad|iPod|Windows Phone|Mobile/i.test(ua);
}

export function CallModal({ country, onClose }: CallModalProps) {
  const [copied, setCopied] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<EmergencyService | null>(null);
  const [showServices, setShowServices] = useState(false);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  const services = getEmergencyServices(country.code);
  const mentalHealth = getMentalHealthResource(country.code);

  useEffect(() => {
    if (services.length > 0 && !selectedService) {
      setSelectedService(services[0]);
    }
  }, [services, selectedService]);

  useEffect(() => {
    cancelBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const telSupported = isTelSupported();
  const number = selectedService?.number ?? country.number;

  const handleCopy = async (num: string) => {
    try {
      await navigator.clipboard.writeText(num);
      setCopied(true);
      setCopiedNumber(num);
      setTimeout(() => {
        setCopied(false);
        setCopiedNumber(null);
      }, 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const handleCall = () => {
    if (telSupported && number) {
      window.location.href = `tel:${number}`;
    } else if (number) {
      handleCopy(number);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="call-modal-title"
    >
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-lg animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 sticky top-0 bg-white">
          <div className="flex items-center gap-2 text-red-700">
            <Phone size={20} />
            <span className="font-semibold">Emergency Call</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close call dialog"
            className="text-gray-400 hover:text-gray-600 p-1 -m-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 py-5">
          <h2
            id="call-modal-title"
            className="text-lg font-bold text-gray-900 leading-snug"
          >
            You are about to call emergency services. Continue?
          </h2>

          {/* Country info */}
          <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Country
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {country.flag} {country.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Number
                </p>
                <p className="text-2xl font-extrabold text-red-700 tabular-nums">
                  {number ?? 'Verify locally'}
                </p>
              </div>
            </div>
          </div>

          {/* Service selector */}
          {services.length > 0 && (
            <div className="mt-3">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Which service do you need?
              </label>
              <button
                onClick={() => setShowServices((v) => !v)}
                className="w-full flex items-center justify-between rounded-xl bg-white border border-gray-200 px-4 py-3.5 text-left hover:border-blue-300 transition-colors"
                aria-expanded={showServices}
                aria-haspopup="listbox"
              >
                <span className="flex items-center gap-2.5">
                  {selectedService?.isMentalHealth && (
                    <Heart size={18} className="text-blue-600" />
                  )}
                  <span className="font-medium text-gray-900">
                    {selectedService?.label ?? 'Select a service'}
                  </span>
                </span>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 transition-transform ${showServices ? 'rotate-180' : ''}`}
                />
              </button>
              {showServices && (
                <ul
                  className="mt-1.5 rounded-xl bg-white border border-gray-200 shadow-lg overflow-hidden animate-fade-in"
                  role="listbox"
                >
                  {services.map((s) => (
                    <li key={s.id}>
                      <button
                        onClick={() => {
                          setSelectedService(s);
                          setShowServices(false);
                        }}
                        className={`w-full flex items-start justify-between px-4 py-3.5 text-left hover:bg-blue-50 transition-colors ${
                          s.id === selectedService?.id ? 'bg-blue-50' : ''
                        }`}
                        role="option"
                        aria-selected={s.id === selectedService?.id}
                      >
                        <span className="flex items-start gap-2.5">
                          {s.isMentalHealth && (
                            <Heart size={18} className="text-blue-600 mt-0.5 shrink-0" />
                          )}
                          <span>
                            <span className="block font-medium text-gray-900">{s.label}</span>
                            <span className="block text-sm text-gray-500">{s.description}</span>
                          </span>
                        </span>
                        <span className="text-sm font-bold text-blue-700 tabular-nums shrink-0 mt-0.5">
                          {s.number}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {selectedService && (
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  {selectedService.description}
                </p>
              )}
            </div>
          )}

          {/* Mental health resources */}
          {selectedService?.isMentalHealth && mentalHealth && (
            <div className="mt-3 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">
              <p className="text-sm font-bold text-blue-900 mb-1.5">
                {mentalHealth.label}
              </p>
              <p className="text-sm text-blue-800 leading-relaxed mb-2.5">
                {mentalHealth.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {mentalHealth.number && (
                  <button
                    onClick={() => handleCopy(mentalHealth.number!)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                  >
                    {copiedNumber === mentalHealth.number ? <Check size={15} /> : <Phone size={15} />}
                    {copiedNumber === mentalHealth.number ? 'Copied' : `Call ${mentalHealth.number}`}
                  </button>
                )}
                {mentalHealth.textLine && (
                  <button
                    onClick={() => handleCopy(mentalHealth.textLine!)}
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
              <p className="mt-2.5 text-xs text-blue-700 leading-relaxed">
                If there is immediate danger of harm, call your local emergency number now.
              </p>
            </div>
          )}

          {/* No number for region */}
          {number === null && (
            <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
              <p className="text-sm text-amber-800">
                We don't have a number for your selected region. Please verify your local
                emergency number and call it directly.
              </p>
            </div>
          )}

          {/* Verify notice */}
          <p className="mt-3 text-xs text-gray-500 leading-relaxed">
            Verify the country and number before calling.
          </p>

          {/* Action buttons */}
          <div className="mt-4 flex flex-col gap-2.5">
            {number && (
              <button
                onClick={handleCall}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 text-lg font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl shadow-lg transition-colors"
              >
                <Phone size={22} />
                Call Now
              </button>
            )}
            {!telSupported && number && (
              <button
                onClick={() => handleCopy(number)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-base font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Copied' : `Copy Number (${number})`}
              </button>
            )}
            <button
              ref={cancelBtnRef}
              onClick={onClose}
              className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
