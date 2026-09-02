export interface VoiceInputCallbacks {
  onResult: (transcript: string, isFinal: boolean) => void;
  onEnd?: () => void;
  onError?: (message: string) => void;
}

export interface VoiceInputController {
  start: () => void;
  stop: () => void;
}

export function isVoiceInputSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  );
}

function removeRepeatedWords(transcript: string): string {
  const words = transcript.trim().split(/\s+/);
  return words.filter((word, index) => {
    if (index === 0) return true;
    return word.toLocaleLowerCase() !== words[index - 1].toLocaleLowerCase();
  }).join(' ');
}

export function createVoiceInput(
  callbacks: VoiceInputCallbacks
): VoiceInputController {
  const Ctor =
    (window as unknown as { SpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;

  if (!Ctor) {
    throw new Error('Voice input is not supported in this browser.');
  }

  const recognition = new Ctor();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  let manualStop = false;
  let deliveredTranscript = '';

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = Array.from(event.results)
      .slice(event.resultIndex)
      .map((result) => result[0]?.transcript ?? '')
      .join(' ');
    const cleaned = removeRepeatedWords(transcript);
    if (!cleaned || cleaned === deliveredTranscript) return;
    deliveredTranscript = cleaned;
    callbacks.onResult(cleaned, true);
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    if (event.error === 'no-speech' || event.error === 'aborted') {
      return;
    }
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      manualStop = true;
      callbacks.onError?.('Microphone permission denied. Please allow microphone access and try again.');
      return;
    }
    callbacks.onError?.(event.error || 'Voice input error');
  };

  recognition.onend = () => {
    if (!manualStop) callbacks.onEnd?.();
    else callbacks.onEnd?.();
  };

  return {
    start: () => {
      manualStop = false;
      deliveredTranscript = '';
      try {
        recognition.start();
      } catch {
        throw new Error('Could not start voice input. Please try again.');
      }
    },
    stop: () => {
      manualStop = true;
      try {
        recognition.stop();
      } catch {
        callbacks.onEnd?.();
      }
    },
  };
}

export interface LocationData {
  lat: number;
  lng: number;
  accuracy?: number;
}

export function isGeolocationSupported(): boolean {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator;
}

export function getCurrentLocation(): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    if (!isGeolocationSupported()) {
      reject(new Error('Location is not supported on this device.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          reject(new Error('Location permission denied. You can still share your location manually.'));
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          reject(new Error('Location unavailable. Try again or share your location manually.'));
        } else if (err.code === err.TIMEOUT) {
          reject(new Error('Location request timed out. Try again or share your location manually.'));
        } else {
          reject(new Error('Could not get location.'));
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

export function buildMapsLink(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}
