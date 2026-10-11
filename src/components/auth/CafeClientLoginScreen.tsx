import React, { useState } from 'react';
import { ChefHat, Lock, Mail, ArrowRight, ArrowLeft, Coffee } from 'lucide-react';

interface CafeClientLoginScreenProps {
  onLoginSuccess: () => void;
  onBackToHub: () => void;
}

export const CafeClientLoginScreen: React.FC<CafeClientLoginScreenProps> = ({
  onLoginSuccess,
  onBackToHub,
}) => {
  const [email, setEmail] = useState('manager@cafexyz.com');
  const [password, setPassword] = useState('cafe123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="min-h-[100dvh] bg-[#FAF8F5] flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top back link */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <button
          onClick={onBackToHub}
          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors font-medium"
        >
          <ArrowLeft className="size-3.5" />
          <span>Portal Hub</span>
        </button>
        <span className="text-[11px] font-mono uppercase tracking-widest text-amber-800/60">
          Venue Operations
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto">
        <div className="bg-white rounded-3xl border border-stone-200/70 p-8 sm:p-10 shadow-sm">
          {/* Header */}
          <div className="mb-8">
            <div className="size-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-700 flex items-center justify-center mb-4 shadow-sm">
              <ChefHat className="size-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-800/60 block mb-1">
              Cafe XYZ • Jhamsikhel
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Manager & Kitchen Portal
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Sign in to manage live tables, stock availability, and incoming orders.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Staff Work Email
              </label>
              <div className="relative">
                <Mail className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@cafexyz.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-600 font-mono transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-600 font-mono transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-[0.99] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Open Cafe Dashboard</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
            <span>Demo: email: <code className="text-stone-700 font-mono">manager@cafexyz.com</code></span>
            <span>pass: <code className="text-stone-700 font-mono">cafe123</code></span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-stone-400">
        <span>Cafe XYZ Artisanal • Jhamsikhel Chiya & Kitchen</span>
      </div>
    </div>
  );
};
