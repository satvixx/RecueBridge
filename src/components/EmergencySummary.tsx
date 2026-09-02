import { MapPin, Clock, FileText } from 'lucide-react';
import type { Guidance, QuestionAnswer } from '@/types';
import type { LocationData } from '@/lib/voiceLocation';

interface EmergencySummaryProps {
  guidance: Guidance;
  answers: QuestionAnswer[];
  location: LocationData | null;
  locationManual: string | null;
  timestamp: string;
}

export function EmergencySummary({
  guidance,
  answers,
  location,
  locationManual,
  timestamp,
}: EmergencySummaryProps) {
  const locationText = location
    ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}${location.accuracy ? ` (\u00B1${Math.round(location.accuracy)}m)` : ''}`
    : locationManual
      ? locationManual
      : 'Unknown — not detected';

  return (
    <section className="card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <FileText size={18} className="text-blue-600" />
        <h3 className="text-base font-bold text-gray-900">Emergency Summary</h3>
      </div>

      {/* Emergency type */}
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">Emergency type</p>
        <p className="text-base text-gray-900 font-semibold mt-0.5">{guidance.emergencyType}</p>
      </div>

      {/* Key answers */}
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500 font-medium mb-1.5">Key information</p>
        <dl className="space-y-1.5">
          {answers.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No questions answered.</p>
          ) : (
            answers.map((ans) => (
              <div key={ans.questionId} className="flex justify-between gap-3">
                <dt className="text-sm text-gray-600 flex-shrink-0">{ans.prompt}</dt>
                <dd className="text-sm text-gray-900 font-medium text-right">{ans.answer}</dd>
              </div>
            ))
          )}
        </dl>
      </div>

      {/* Location */}
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">Location</p>
        <div className="flex items-start gap-1.5 mt-0.5">
          <MapPin size={14} className="shrink-0 text-blue-600 mt-0.5" />
          <p className="text-sm text-gray-900">{locationText}</p>
        </div>
        {location && (
          <a
            href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 ml-5 inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-800"
          >
            Open in Maps
          </a>
        )}
        {!location && locationManual && (
          <p className="mt-0.5 ml-5 text-xs text-amber-600">Manual location — automatic location unavailable</p>
        )}
      </div>

      {/* Timestamp */}
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">Time</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Clock size={14} className="shrink-0 text-blue-600" />
          <p className="text-sm text-gray-900">{timestamp}</p>
        </div>
      </div>
    </section>
  );
}
