import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right' | 'nested';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

    const variantClasses = {
      primary:
        'bg-primary text-primary-foreground shadow-sm hover:opacity-90 hover:shadow-glow-primary',
      secondary:
        'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/60',
      outline:
        'border border-border/80 bg-background/50 hover:bg-accent hover:text-accent-foreground backdrop-blur-sm',
      ghost:
        'hover:bg-accent hover:text-accent-foreground text-foreground',
      danger:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
      success:
        'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
    };

    const sizeClasses = {
      sm: 'text-xs h-8 px-3 rounded-full gap-1.5',
      md: 'text-sm h-10 px-4 rounded-full gap-2',
      lg: 'text-base h-12 px-6 rounded-full gap-2.5',
      icon: 'h-9 w-9 rounded-full p-0 flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        {...props}
      >
        {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
        {children && <span>{children}</span>}
        {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        {icon && iconPosition === 'nested' && (
          <span className="shrink-0 ml-1.5 size-6 rounded-full bg-black/10 dark:bg-white/15 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
