import { useState, useCallback, useEffect } from 'react';
import { HomeScreen } from '@/screens/HomeScreen';
import { InputScreen } from '@/screens/InputScreen';
import { GuidanceScreen } from '@/screens/GuidanceScreen';
import { CallModal } from '@/components/CallModal';
import { getCountry, DEFAULT_COUNTRY_CODE } from '@/data/countries';
import { fetchGuidance } from '@/lib/guidanceApi';
import { DEMO_SCENARIO } from '@/data/fallbackGuidance';
import splashImage from '@/assets/splash.png';
import type { Guidance, Screen } from '@/types';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [description, setDescription] = useState('');
  const [guidance, setGuidance] = useState<Guidance | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [splashPhase, setSplashPhase] = useState<'visible' | 'leaving' | 'hidden'>('visible');

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => setSplashPhase('leaving'), 1500);
    const hideTimer = window.setTimeout(() => setSplashPhase('hidden'), 2300);
    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  const country = getCountry(countryCode);

  const runGuidance = useCallback(async (desc: string, demo: boolean) => {
    setDescription(desc);
    setLoading(true);
    setError(null);
    const result = await fetchGuidance(desc);
    setGuidance(result.guidance);
    setUsedFallback(result.usedFallback);
    if (result.error) setError(result.error);
    setLoading(false);
    setScreen('guidance');
    setIsDemo(demo);
  }, []);

  const handleNeedHelp = () => {
    setIsDemo(false);
    setDescription('');
    setError(null);
    setGuidance(null);
    setScreen('input');
  };

  const handleDemo = () => {
    setIsDemo(true);
    setDescription(DEMO_SCENARIO);
    setError(null);
    setGuidance(null);
    setScreen('input');
  };

  const handleSubmit = useCallback(
    (desc: string) => {
      runGuidance(desc, isDemo);
    },
    [runGuidance, isDemo]
  );

  const handleRetry = async () => {
    if (!description) return;
    setLoading(true);
    setError(null);
    setUsedFallback(false);
    const result = await fetchGuidance(description);
    setGuidance(result.guidance);
    setUsedFallback(result.usedFallback);
    if (result.error) {
      setError(result.error);
    } else {
      setUsedFallback(false);
    }
    setLoading(false);
  };

  const handleStartOver = () => {
    setScreen('home');
    setDescription('');
    setGuidance(null);
    setError(null);
    setIsDemo(false);
    setUsedFallback(false);
  };

  const handleCall = () => setCallOpen(true);

  return (
    <div className="min-h-screen bg-blue-50">
      {screen === 'home' && (
        <div key="home" className="screen-enter">
        <HomeScreen
          country={country}
          onCountryChange={setCountryCode}
          onNeedHelp={handleNeedHelp}
          onDemo={handleDemo}
          onCall={handleCall}
        />
        </div>
      )}

      {screen === 'input' && (
        <div key="input" className="screen-enter">
        <InputScreen
          initialDescription={description}
          isDemo={isDemo}
          onBack={handleStartOver}
          onSubmit={handleSubmit}
          onCall={handleCall}
          loading={loading}
          error={error}
          onRetry={handleRetry}
        />
        </div>
      )}

      {screen === 'guidance' && guidance && (
        <div key="guidance" className="screen-enter">
        <GuidanceScreen
          guidance={guidance}
          description={description}
          isDemo={isDemo}
          usedFallback={usedFallback}
          countryCode={countryCode}
          onCall={handleCall}
          onStartOver={handleStartOver}
        />
        </div>
      )}

      {callOpen && <CallModal country={country} onClose={() => setCallOpen(false)} />}

      {splashPhase !== 'hidden' && (
        <div
          className={`splash-screen ${splashPhase === 'leaving' ? 'splash-screen-leaving' : ''}`}
          aria-label="RescueBridge"
          role="img"
        >
          <div className="splash-decor" style={{ top: '8%', left: '6%', width: '90px', height: '90px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
              <path d="M5 10a7 7 0 0 0 14 0" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </div>
          <div className="splash-decor" style={{ bottom: '10%', right: '8%', width: '100px', height: '100px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <div className="splash-decor" style={{ top: '15%', right: '12%', width: '70px', height: '70px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="splash-decor" style={{ bottom: '18%', left: '10%', width: '80px', height: '80px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <div className="splash-decor" style={{ top: '45%', left: '4%', width: '60px', height: '60px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12l2 2 4-4" />
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.39 0 4.68.95 6.36 2.64" />
            </svg>
          </div>
          <div className="splash-decor" style={{ top: '40%', right: '5%', width: '65px', height: '65px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M2 12h20" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <img src={splashImage} alt="RescueBridge" className="splash-image" />
        </div>
      )}
    </div>
  );
}
