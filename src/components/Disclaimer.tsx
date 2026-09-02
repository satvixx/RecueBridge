import { AlertTriangle, X } from 'lucide-react';

interface DisclaimerProps {
  variant?: 'banner' | 'card' | 'full';
  onClose?: () => void;
}

export function Disclaimer({ variant = 'banner', onClose }: DisclaimerProps) {
  if (variant === 'full' || variant === 'card') {
    return (
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="flex gap-2.5">
          <AlertTriangle size={18} className="shrink-0 text-amber-600 mt-0.5" />
          <p className="text-sm text-amber-800 leading-relaxed">
            RescueBridge provides emergency guidance and does not replace trained emergency
            responders or medical professionals. In a life-threatening situation, contact local
            emergency services immediately. Do not delay calling. Verify the country and number
            before calling. Information is used only during this session.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5">
      <div className="flex items-center gap-2.5">
        <AlertTriangle size={16} className="shrink-0 text-amber-600" />
        <p className="text-sm text-amber-800 leading-snug flex-1">
          If someone is in immediate danger, call your local emergency number now.
          RescueBridge is only a support tool.
        </p>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Dismiss disclaimer"
            className="shrink-0 text-amber-600 hover:text-amber-800 p-1 -m-1"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
