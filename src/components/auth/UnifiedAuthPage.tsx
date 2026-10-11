import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Building2,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useCafeData } from '../../context/CafeDataContext';

export const UnifiedAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, showToast } = useCafeData();

  // Role portal toggle: 'client' | 'admin'
  const [selectedPortal, setSelectedPortal] = useState<'client' | 'admin'>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const effectiveEmail = email.trim() || (selectedPortal === 'admin' ? 'admin@cafems.io' : 'manager@cafexyz.com');
    const effectivePassword = password || 'password123';

    setTimeout(() => {
      const res = login(
        effectiveEmail,
        effectivePassword,
        selectedPortal === 'admin' ? 'super_admin' : 'cafe_client'
      );
      setIsSubmitting(false);

      if (res.role === 'super_admin') {
        showToast('Signed in to Super Admin Platform', 'success');
        navigate('/admin');
      } else {
        showToast('Signed in to Cafe Operations Workspace', 'success');
        navigate('/client');
      }
    }, 350);
  };

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    showToast(`Password recovery link dispatched to ${forgotEmail}`, 'success');
    setIsForgotPasswordOpen(false);
    setForgotEmail('');
  };

  const isDetectedAdmin = selectedPortal === 'admin' || email.toLowerCase().includes('admin');

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Production Brand Lockup */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="size-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-sm border border-stone-800 mb-3">
            <span className="font-extrabold font-mono text-base tracking-tighter">CM</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            CafeMS
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Intelligent Cafe & Hospitality Operating System
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white py-8 px-6 sm:px-8 shadow-sm rounded-3xl border border-stone-200/80">
          {/* Portal Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-stone-100/80 rounded-2xl mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setSelectedPortal('client');
                if (email === 'admin@cafems.io') setEmail('');
              }}
              className={`py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedPortal === 'client'
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Building2 className="size-3.5" />
              <span>Venue Portal</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedPortal('admin');
                if (email === 'manager@cafexyz.com') setEmail('');
              }}
              className={`py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedPortal === 'admin'
                  ? 'bg-stone-900 text-white shadow-2xs font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <ShieldCheck className="size-3.5" />
              <span>Super Admin</span>
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">
              {selectedPortal === 'admin' ? 'Super Admin Gateway' : 'Sign in to Venue'}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {selectedPortal === 'admin'
                ? 'Authorized access for platform operations & network control.'
                : 'Access live floor ordering, kitchen tickets, menu catalog & analytics.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="size-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={selectedPortal === 'admin' ? 'admin@cafems.io' : 'manager@cafexyz.com'}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-xs text-stone-500 hover:text-stone-900 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="size-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="size-8 absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-stone-300 accent-stone-900 size-3.5"
                />
                <span>Remember session for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-2 mt-4 ${
                isDetectedAdmin
                  ? 'bg-stone-900 hover:bg-stone-800'
                  : 'bg-emerald-800 hover:bg-emerald-900'
              }`}
            >
              <span>
                {isSubmitting
                  ? 'Authenticating credentials...'
                  : `Sign in to ${isDetectedAdmin ? 'Super Admin' : 'Cafe Operations'}`}
              </span>
              <ArrowRight className="size-3.5" />
            </button>
          </form>
        </div>

        {/* Global Clean Subtitle */}
        <div className="mt-6 text-center text-xs text-stone-400">
          <p>CafeMS Engine • Dedicated Operations Platform</p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-sm w-full p-6 space-y-4">
            <div>
              <h3 className="font-bold text-base text-stone-900">Reset Account Password</h3>
              <p className="text-xs text-stone-500 mt-1">
                Enter your registered work email and we will dispatch a secure single-use recovery link.
              </p>
            </div>
            <form onSubmit={handleSendResetLink} className="space-y-3">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:bg-white"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Dispatch Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedAuthPage;
