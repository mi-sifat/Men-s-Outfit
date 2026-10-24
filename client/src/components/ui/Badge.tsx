import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'sale' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-slate-900 text-white',
    accent: 'bg-[#C5A880] text-slate-950 font-semibold',
    sale: 'bg-rose-600 text-white font-semibold uppercase tracking-wider',
    outline: 'border border-slate-300 text-slate-700 bg-white/80 backdrop-blur-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium tracking-wide select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
