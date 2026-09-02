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
          <img src={splashImage} alt="RescueBridge" className="splash-image" />
        </div>
      )}
    </div>
  );
}
