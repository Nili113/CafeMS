import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'purple' | 'danger';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-primary/15 text-primary border-primary/25',
    secondary: 'bg-secondary text-secondary-foreground border-border/80',
    outline: 'border border-border text-foreground bg-transparent',
    success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
    warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25',
    purple: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/25',
    danger: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/25',
  };

  const dotColors = {
    default: 'bg-primary',
    secondary: 'bg-muted-foreground',
    outline: 'bg-foreground',
    success: 'bg-emerald-500 animate-pulse',
    warning: 'bg-amber-500 animate-pulse',
    purple: 'bg-purple-500',
    danger: 'bg-rose-500 animate-ping-slow',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider uppercase font-semibold',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('size-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
};
