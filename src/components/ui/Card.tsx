import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  nested?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  nested = true,
  glow = false,
  children,
  ...props
}) => {
  if (!nested) {
    return (
      <div
        className={cn(
          'rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all',
          glow && 'hover:shadow-glow-primary hover:border-primary/40',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  // Doppelrand Architecture (Outer protective shell + inner tactile core)
  return (
    <div
      className={cn(
        'group p-1.5 md:p-2 rounded-[1.75rem] bg-foreground/[0.03] dark:bg-white/[0.04] ring-1 ring-foreground/[0.06] dark:ring-white/[0.08] transition-all duration-300',
        glow && 'hover:ring-primary/40 hover:bg-primary/[0.02]',
        className
      )}
      {...props}
    >
      <div className="rounded-[calc(1.75rem-0.375rem)] bg-card border border-border/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] p-5 md:p-6 transition-all duration-300">
        {children}
      </div>
    </div>
  );
};
