import { Phone, ChevronDown, Play, ShieldPlus, Lock, LifeBuoy } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { Disclaimer } from '@/components/Disclaimer';
import { COUNTRIES } from '@/data/countries';
import type { Country } from '@/types';

interface HomeScreenProps {
  country: Country;
  onCountryChange: (code: string) => void;
  onNeedHelp: () => void;
  onDemo: () => void;
  onCall: () => void;
}

export function HomeScreen({
  country,
  onCountryChange,
  onNeedHelp,
  onDemo,
  onCall,
}: HomeScreenProps) {
  const [selectorOpen, setSelectorOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <div className="mx-auto w-full max-w-md flex-1 flex flex-col px-5">
        {/* Header */}
        <header className="pt-8 pb-2">
          <Logo size="md" />
        </header>

        {/* Hero */}
        <main className="flex-1 flex flex-col justify-center py-6">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-extrabold text-blue-900 leading-tight text-balance">
              Clear steps when every second matters.
            </h1>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              RescueBridge helps you contact emergency services, understand the next safe
              action, and communicate a clear summary to the dispatcher.
            </p>
          </div>

          {/* Primary actions */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={onNeedHelp}
              className="group flex items-center justify-center gap-3 rounded-2xl bg-red-600 px-6 py-6 text-2xl font-extrabold text-white shadow-lg transition-all hover:bg-red-700 active:bg-red-800 active:scale-[0.98] animate-pulse-soft"
            >
              <Phone size={28} strokeWidth={2.5} />
              I NEED HELP
            </button>
            <button
              onClick={onDemo}
              className="flex items-center justify-center gap-2.5 rounded-xl bg-white border border-blue-200 px-5 py-4 text-lg font-semibold text-blue-700 transition-colors hover:bg-blue-50 active:bg-blue-100"
            >
              <Play size={20} />
              Try Demo Scenario
            </button>
          </div>

          {/* Country selector */}
          <div className="mt-6">
            <label
              htmlFor="country-select"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Your region
            </label>
            <button
              id="country-select"
              onClick={() => setSelectorOpen((v) => !v)}
              className="w-full flex items-center justify-between rounded-xl bg-white border border-gray-200 px-4 py-4 text-left hover:border-blue-300 transition-colors"
              aria-expanded={selectorOpen}
              aria-haspopup="listbox"
            >
              <span className="flex items-center gap-2.5">
                <span className="text-xl">{country.flag}</span>
                <span className="font-medium text-gray-900">{country.name}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-base font-bold text-blue-700 tabular-nums">
                  {country.number ?? 'Verify locally'}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 transition-transform ${selectorOpen ? 'rotate-180' : ''}`}
                />
              </span>
            </button>
            {selectorOpen && (
              <ul
                className="mt-1.5 rounded-xl bg-white border border-gray-200 shadow-lg overflow-hidden animate-fade-in"
                role="listbox"
              >
                {COUNTRIES.map((c) => (
                  <li key={c.code}>
                    <button
                      onClick={() => {
                        onCountryChange(c.code);
                        setSelectorOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-blue-50 transition-colors ${
                        c.code === country.code ? 'bg-blue-50' : ''
                      }`}
                      role="option"
                      aria-selected={c.code === country.code}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="text-xl">{c.flag}</span>
                        <span className="font-medium text-gray-900">{c.name}</span>
                      </span>
                      <span className="text-sm font-bold text-blue-700 tabular-nums">
                        {c.number ?? 'Verify'}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Persistent call button */}
          <div className="mt-4">
            <Button
              variant="emergency"
              size="lg"
              icon={<Phone size={20} />}
              onClick={onCall}
            >
              Call Emergency Services
            </Button>
          </div>

          <div className="mt-4">
            <Disclaimer variant="full" />
          </div>
        </main>

        {/* Info sections */}
        <section className="py-6 space-y-4 border-t border-gray-200">
          <div className="rounded-xl bg-white border border-gray-100 p-4">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                <ShieldPlus size={18} className="text-blue-700" />
              </div>
              <h2 className="text-base font-bold text-gray-900">How it works</h2>
            </div>
            <ol className="space-y-1.5 text-sm text-gray-600 leading-relaxed">
              <li>1. Select your region to get the right emergency number.</li>
              <li>2. Describe what is happening in your own words.</li>
              <li>3. Follow the short, numbered steps and share them with the dispatcher.</li>
            </ol>
          </div>

          <div className="rounded-xl bg-white border border-gray-100 p-4">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
                <Lock size={18} className="text-green-700" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Privacy by design</h2>
            </div>
            <ul className="space-y-1.5 text-sm text-gray-600 leading-relaxed">
              <li>Location is only used when you press the button — never automatically.</li>
              <li>We never store or track your location or personal data.</li>
              <li>No account, no login, no database of your activity.</li>
            </ul>
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <div className="flex items-center gap-2.5 mb-1.5">
              <LifeBuoy size={18} className="text-amber-700" />
              <h2 className="text-base font-bold text-amber-900">
                Not a replacement for emergency services
              </h2>
            </div>
            <p className="text-sm text-amber-800 leading-relaxed">
              RescueBridge is a support tool only. It does not replace professional emergency
              services, paramedics, or a dispatcher's instructions. When in doubt, always call
              your local emergency number.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 text-center">
          <p className="text-xs text-gray-400">
            RescueBridge — a support tool for the first minutes of an emergency.
          </p>
        </footer>
      </div>
    </div>
  );
}
