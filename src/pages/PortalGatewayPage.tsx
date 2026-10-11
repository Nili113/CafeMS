import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ChefHat,
  Smartphone,
  ArrowRight,
  Coffee,
  Sparkles,
} from 'lucide-react';
import { useCafeData } from '../context/CafeDataContext';

export const PortalGatewayPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeTableNumber, setActiveTableNumber } = useCafeData();

  return (
    <div className="min-h-[100dvh] bg-[#F7F5F0] text-stone-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="px-6 py-5 border-b border-stone-200/80 bg-white/80 backdrop-blur-md max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-sm shadow-2xs">
            CM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-stone-900">
                Cafe<span className="text-amber-700">MS</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Chiya & Cafe OS
              </span>
            </div>
            <p className="text-[11px] text-stone-500 -mt-0.5">
              Multi-Tenant Operating System for Cafes & Chiya Spots
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-stone-400 hidden sm:inline">
          3 Dedicated Independent Apps
        </span>
      </header>

      {/* Main Hero & 3 App Cards */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-10 sm:py-16 w-full flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-semibold">
            Unified Ecosystem
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-4">
            Select Your Dedicated Portal
          </h1>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            Choose from the three dedicated applications below to enter the platform.
          </p>
        </div>

        {/* 3 Standalone Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* APP 1: SUPER ADMIN */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-7 shadow-sm hover:border-stone-400 transition-all flex flex-col justify-between group">
            <div>
              <div className="size-11 rounded-2xl bg-stone-100 border border-stone-200 text-stone-900 flex items-center justify-center mb-5">
                <ShieldCheck className="size-5" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Portal 01
              </span>
              <h2 className="text-lg font-bold text-stone-900 mb-1">Super Admin</h2>
              <span className="text-xs text-amber-700 font-medium block mb-3">
                Platform IT Provider
              </span>
              <p className="text-xs text-stone-500 leading-relaxed mb-6">
                Manage enrolled cafe tenants, toggle Active/Deactive statuses, dispatch enrollment onboarding links, and supervise API key credentials.
              </p>
            </div>

            <button
              onClick={() => navigate('/admin')}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white text-xs font-semibold flex items-center justify-between transition-all"
            >
              <span>Launch Admin</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>

          {/* APP 2: CAFE CLIENT (OWNER / KITCHEN) */}
          <div className="bg-white rounded-3xl border border-amber-300/80 p-7 shadow-sm hover:border-amber-500 transition-all flex flex-col justify-between group relative ring-1 ring-amber-200/50">
            <div className="absolute top-4 right-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Cafe XYZ
              </span>
            </div>

            <div>
              <div className="size-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-5">
                <ChefHat className="size-5" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 block mb-1">
                Portal 02
              </span>
              <h2 className="text-lg font-bold text-stone-900 mb-1">Cafe Client</h2>
              <span className="text-xs text-amber-700 font-medium block mb-3">
                Venue Manager & Kitchen
              </span>
              <p className="text-xs text-stone-500 leading-relaxed mb-6">
                Live floor plan with 12 color-coded tables, physical QR generator, real-time 86'd stock toggle, photo upload, and live waiter alerts.
              </p>
            </div>

            <button
              onClick={() => navigate('/cafe')}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-[0.99] text-white text-xs font-bold flex items-center justify-between transition-all shadow-xs"
            >
              <span>Launch Cafe Operations</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>

          {/* APP 3: CUSTOMER DINING PWA */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-7 shadow-sm hover:border-stone-400 transition-all flex flex-col justify-between group">
            <div>
              <div className="size-11 rounded-2xl bg-stone-100 border border-stone-200 text-stone-900 flex items-center justify-center mb-5">
                <Smartphone className="size-5" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Portal 03
              </span>
              <h2 className="text-lg font-bold text-stone-900 mb-1">Customer App</h2>
              <span className="text-xs text-amber-700 font-medium block mb-3">
                Dine-In Table QR Experience
              </span>
              <p className="text-xs text-stone-500 leading-relaxed mb-4">
                Mobile-first ordering, Matka Chiya & espresso catalog, live stock status, Call Waiter, Request Bill, and Fonepay digital QR payment.
              </p>

              {/* Table Quick Selector */}
              <div className="mb-6 pt-3 border-t border-stone-100">
                <span className="text-[11px] text-stone-400 block mb-2">Simulate Dine-in Table:</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 3, 4, 6].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setActiveTableNumber(num);
                        navigate(`/table/${num}`);
                      }}
                      className="py-1 px-2 rounded-lg bg-stone-100 hover:bg-amber-50 text-xs font-mono font-bold text-stone-700 hover:text-amber-800 border border-stone-200/80 transition-all"
                    >
                      T-{num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/table/${activeTableNumber}`)}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white text-xs font-semibold flex items-center justify-between transition-all"
            >
              <span>Launch Table {activeTableNumber}</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-stone-200/60 text-center text-xs text-stone-400 bg-white/50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>CafeMS • Multi-Tenant Cafe & Chiya Operating System</span>
          <span className="font-mono text-[11px]">Jhamsikhel • Thamel • Lakeside</span>
        </div>
      </footer>
    </div>
  );
};
