import { ShieldPlus } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: { box: 'h-9 w-9', icon: 18, text: 'text-lg' },
  md: { box: 'h-12 w-12', icon: 24, text: 'text-2xl' },
  lg: { box: 'h-16 w-16', icon: 32, text: 'text-3xl' },
};

export function Logo({ size = 'md' }: LogoProps) {
  const s = sizes[size];
  return (
    <div className="flex items-center gap-3">
      <div
        className={`${s.box} rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm`}
      >
        <ShieldPlus size={s.icon} className="text-white" strokeWidth={2.5} />
      </div>
      <span className={`${s.text} font-extrabold tracking-tight text-blue-800`}>
        RescueBridge
      </span>
    </div>
  );
}
