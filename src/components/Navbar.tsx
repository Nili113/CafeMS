import React, { useState } from 'react';
import {
  ShieldCheck,
  Coffee,
  Smartphone,
  Bell,
  Palette,
  Sun,
  Moon,
  QrCode,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useCafeData } from '../context/CafeDataContext';
import { UserRole, CafeTheme } from '../types';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { cn } from '../lib/utils';

export const Navbar: React.FC<{ onOpenQrScanner?: () => void }> = ({ onOpenQrScanner }) => {
  const {
    currentRole,
    setCurrentRole,
    activeTableNumber,
    setActiveTableNumber,
    cafeTheme,
    setCafeTheme,
    tableAlerts,
    tables,
  } = useCafeData();

  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isTableMenuOpen, setIsTableMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const themes: { id: CafeTheme; name: string; color: string }[] = [
    { id: 'amber', name: 'Warm Amber Roast', color: 'bg-amber-500' },
    { id: 'emerald', name: 'Emerald Artisan', color: 'bg-emerald-500' },
    { id: 'noir', name: 'Midnight Noir', color: 'bg-zinc-400' },
    { id: 'terracotta', name: 'Terracotta Hearth', color: 'bg-orange-600' },
    { id: 'espresso', name: 'Dark Roast Espresso', color: 'bg-amber-950' },
    { id: 'burgundy', name: 'Artisan Burgundy', color: 'bg-rose-900' },
  ];

  const activeAlertsCount = tableAlerts.filter((a) => a.status === 'Active').length;

  return (
    <header className="sticky top-3 z-40 px-3 sm:px-6 w-full max-w-7xl mx-auto mb-6">
      <div className="island-pill p-1.5 sm:p-2 flex items-center justify-between gap-2 sm:gap-4 shadow-xl">
        {/* Brand Identity */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3">
          <div className="size-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-sm">
            <Coffee className="size-4" strokeWidth={2.2} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-foreground">
                Cafe<span className="text-primary font-black">MS</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-widest text-muted-foreground px-1.5 py-0.5 rounded-full bg-muted border border-border/80">
                v2.5
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground -mt-0.5 truncate hidden md:inline">
              {currentRole === 'super_admin'
                ? 'IT SaaS Provider Platform'
                : currentRole === 'cafe_client'
                ? 'Cafe XYZ Operations & Kitchen'
                : `Guest Order Session • Table ${activeTableNumber}`}
            </span>
          </div>
        </div>

        {/* Role Switcher Pills (Interactive Demo Navigation) */}
        <nav className="flex items-center p-1 rounded-full bg-muted/80 border border-border/60">
          <button
            onClick={() => setCurrentRole('super_admin')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all select-none',
              currentRole === 'super_admin'
                ? 'bg-card text-foreground shadow-sm ring-1 ring-border'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <ShieldCheck className="size-3.5" strokeWidth={2} />
            <span className="hidden sm:inline">Super Admin</span>
            <span className="sm:hidden">Admin</span>
          </button>

          <button
            onClick={() => setCurrentRole('cafe_client')}
            className={cn(
              'relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all select-none',
              currentRole === 'cafe_client'
                ? 'bg-card text-foreground shadow-sm ring-1 ring-border'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Layers className="size-3.5" strokeWidth={2} />
            <span className="hidden sm:inline">Cafe Client</span>
            <span className="sm:hidden">Cafe</span>
            {activeAlertsCount > 0 && (
              <span className="size-2 rounded-full bg-rose-500 animate-ping absolute -top-0.5 -right-0.5" />
            )}
          </button>

          <button
            onClick={() => setCurrentRole('customer')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all select-none',
              currentRole === 'customer'
                ? 'bg-card text-foreground shadow-sm ring-1 ring-border'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Smartphone className="size-3.5" strokeWidth={2} />
            <span className="hidden sm:inline">Customer (QR)</span>
            <span className="sm:hidden">Table</span>
          </button>
        </nav>

        {/* Right Tools & Modals */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Table Selector (when in Customer Mode) */}
          {currentRole === 'customer' && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTableMenuOpen(!isTableMenuOpen)}
                className="text-xs h-8 px-2.5 bg-card/60 gap-1.5"
              >
                <QrCode className="size-3 text-primary" />
                <span>Table {activeTableNumber}</span>
                <ChevronDown className="size-3 opacity-60" />
              </Button>

              {isTableMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 p-2 rounded-2xl bg-card/95 border border-border shadow-xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-2 py-1">
                    Select Simulated Table
                  </p>
                  <div className="grid grid-cols-3 gap-1 mt-1 max-h-48 overflow-y-auto">
                    {tables.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setActiveTableNumber(t.number);
                          setIsTableMenuOpen(false);
                        }}
                        className={cn(
                          'p-1.5 text-xs font-semibold rounded-lg text-center transition-all',
                          t.number === activeTableNumber
                            ? 'bg-primary text-primary-foreground font-bold'
                            : 'hover:bg-muted text-foreground'
                        )}
                      >
                        T-{t.number}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Theme Switcher (Available for Cafe Client & Customer branding) */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="size-8 rounded-full hover:bg-muted"
              title="Cafe Brand Palette"
            >
              <Palette className="size-4 text-muted-foreground hover:text-foreground" />
            </Button>

            {isThemeMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 p-2 rounded-2xl bg-card/95 border border-border shadow-xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1.5 border-b border-border/60 mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-foreground">Brand Palette</span>
                  <Sparkles className="size-3 text-primary" />
                </div>
                <div className="flex flex-col gap-1">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setCafeTheme(t.id);
                        setIsThemeMenuOpen(false);
                      }}
                      className={cn(
                        'flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all text-left',
                        cafeTheme === t.id
                          ? 'bg-primary/10 text-primary font-bold'
                          : 'hover:bg-muted text-foreground'
                      )}
                    >
                      <span className={cn('size-3 rounded-full shrink-0', t.color)} />
                      <span>{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark/Light Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="size-8 rounded-full hover:bg-muted"
            title="Toggle Visual Mode"
          >
            {isDarkMode ? (
              <Sun className="size-4 text-amber-400" />
            ) : (
              <Moon className="size-4 text-slate-700" />
            )}
          </Button>

          {/* Alert Notification Dot for Cafe Staff */}
          {currentRole === 'cafe_client' && activeAlertsCount > 0 && (
            <div className="relative">
              <Badge variant="danger" size="sm" dot className="animate-bounce">
                {activeAlertsCount} Alert{activeAlertsCount > 1 ? 's' : ''}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
