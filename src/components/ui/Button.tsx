import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost';
  size?: 'default' | 'sm' | 'icon';
}

export function Button({
  variant = 'default',
  size = 'default',
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'rounded-lg font-medium cursor-pointer transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed';

  const variants = {
    default: 'bg-stone-900 text-white hover:bg-stone-800',
    ghost: 'bg-transparent hover:bg-stone-100 text-stone-600',
  };

  const sizes = {
    default: 'px-4 py-2 text-sm',
    sm: 'px-2 py-1.5 text-xs',
    icon: 'w-8 h-8 p-0',
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  );
}
