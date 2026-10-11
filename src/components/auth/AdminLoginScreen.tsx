import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

interface AdminLoginScreenProps {
  onLoginSuccess: () => void;
  onBackToHub: () => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ onLoginSuccess, onBackToHub }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="min-h-[100dvh] bg-[#F7F6F2] flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top back button */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <button
          onClick={onBackToHub}
          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors font-medium"
        >
          <ArrowLeft className="size-3.5" />
          <span>Portal Hub</span>
        </button>
        <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400">
          Super Admin Console
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto">
        <div className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-10 shadow-sm">
          {/* Header */}
          <div className="mb-8">
            <div className="size-11 rounded-2xl bg-stone-900 text-white flex items-center justify-center mb-4 shadow-sm">
              <ShieldCheck className="size-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 block mb-1">
              IT Platform Provider
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Super Admin Sign In
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Please enter your platform credentials to manage tenant cafes.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <User className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <Lock className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-stone-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                />
                <span>Remember session</span>
              </label>
              <span className="text-stone-400 hover:text-stone-600 cursor-pointer">Need help?</span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Access Management Console</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
            <span>Demo: user: <code className="text-stone-700 font-mono">admin</code></span>
            <span>pass: <code className="text-stone-700 font-mono">admin123</code></span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-stone-400">
        <span>CafeMS SaaS Infrastructure • Kathmandu Cluster</span>
      </div>
    </div>
  );
};
