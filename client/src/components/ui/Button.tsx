import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] rounded-md';

  const variants = {
    primary: 'bg-[#0B0F19] text-white hover:bg-black border border-transparent shadow-sm hover:shadow',
    secondary: 'bg-[#C5A880] text-[#0B0F19] hover:bg-[#B39366] font-semibold',
    outline: 'border border-[#CBD5E1] text-[#0F172A] hover:border-[#0B0F19] hover:bg-slate-50',
    ghost: 'text-[#475569] hover:text-[#0B0F19] hover:bg-slate-100',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
    md: 'text-sm px-4 py-2.5 h-10 gap-2',
    lg: 'text-base px-6 py-3 h-12 gap-2.5',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : null}
      {children}
    </button>
  );
};
