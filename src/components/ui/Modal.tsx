import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Outer Doppelrand Shell */}
      <div
        className={cn(
          'relative w-full z-10 p-1.5 md:p-2 rounded-[2rem] bg-foreground/10 dark:bg-white/10 ring-1 ring-white/10 shadow-2xl scale-100 transition-all duration-300 max-h-[90dvh] flex flex-col',
          maxWidthClasses[maxWidth]
        )}
      >
        <div className="rounded-[calc(2rem-0.375rem)] bg-card border border-border shadow-bezel-dark p-6 overflow-y-auto custom-scrollbar flex flex-col max-h-[calc(90dvh-1rem)]">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-border/60">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
              {description && (
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="size-8 text-muted-foreground hover:text-foreground shrink-0 -mr-1"
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Body */}
          <div className="pt-4 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};
