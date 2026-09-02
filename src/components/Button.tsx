import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'emergency' | 'ghost' | 'outline';
type Size = 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm',
  secondary:
    'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 active:bg-blue-100',
  emergency:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-lg',
  ghost:
    'bg-transparent text-blue-700 hover:bg-blue-50 active:bg-blue-100',
  outline:
    'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100',
};

const sizeClasses: Record<Size, string> = {
  md: 'px-4 py-2.5 text-base rounded-xl gap-2',
  lg: 'px-5 py-3.5 text-lg rounded-xl gap-2.5',
  xl: 'px-6 py-5 text-xl rounded-2xl gap-3',
};

export function Button({
  variant = 'primary',
  size = 'lg',
  icon,
  fullWidth = true,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold transition-colors duration-150 select-none disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
