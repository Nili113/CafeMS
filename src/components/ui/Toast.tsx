import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useCafeData } from '../../context/CafeDataContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useCafeData();

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 className="size-4 text-emerald-400 shrink-0" strokeWidth={2} />,
    warning: <AlertCircle className="size-4 text-amber-400 shrink-0" strokeWidth={2} />,
    info: <Info className="size-4 text-sky-400 shrink-0" strokeWidth={2} />,
  };

  const type = toastMessage.type || 'info';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-none">
      <div className="p-1 rounded-full bg-foreground/10 dark:bg-white/10 ring-1 ring-white/15 shadow-2xl backdrop-blur-xl">
        <div className="px-4 py-2.5 rounded-full bg-card/95 border border-border/80 flex items-center gap-2.5 shadow-lg">
          {icons[type]}
          <span className="text-xs sm:text-sm font-medium text-foreground tracking-tight">
            {toastMessage.text}
          </span>
        </div>
      </div>
    </div>
  );
};
