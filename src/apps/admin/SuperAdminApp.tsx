import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  TrendingUp,
  Building2,
  Key,
  Link as LinkIcon,
  Check,
  Copy,
  ShieldCheck,
  Search,
  RefreshCw,
  Eye,
  EyeOff,
  LogOut,
  Info,
  ChevronDown,
  Layers,
  ArrowUpRight,
  Clock,
  Settings as SettingsIcon,
  Radio,
  Zap,
  PanelLeftClose,
  PanelLeftOpen,
  ExternalLink,
  AlertCircle,
  Menu,
  X,
  Upload,
  Sparkles,
  RotateCcw,
  Wifi,
  CreditCard,
  Lock,
  Sliders,
  Database,
  Save,
  Bell,
  Activity,
  PauseCircle,
  PlayCircle,
  Calendar,
  Send,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useCafeData } from '../../context/CafeDataContext';
import { CafeClientRecord, ApiCredential, SystemActivity } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { NivoNetworkGrowthChart } from '../../components/charts/NivoNetworkGrowthChart';
import { ARTISANAL_CAFE_LOGOS } from '../../lib/logos';

export const SuperAdminApp: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    logout,
    clients,
    toggleClientStatus,
    dispatchEnrollmentLink,
    updateClientSubscription,
    updateClientMenuSource,
    apiCredentials,
    generateApiKey,
    revokeApiKey,
    updateApiKeyStatus,
    systemActivities,
    showToast,
    cafeLogos,
    updateCafeLogo,
    resetCafeLogo,
    getCafeLogo,
    isNetworkVerificationEnabled,
    toggleNetworkVerification,
    cafeWifiSsid,
  } = useCafeData();

  // Sidebar collapse & Profile popover state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
  });
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Automatically collapse sidebar below 1024px and close drawer on desktop
  useEffect(() => {
    const handleAutoCollapse = () => {
      const width = window.innerWidth;
      if (width < 1024) {
        setIsSidebarCollapsed(true);
      }
      if (width >= 768) {
        setIsMobileDrawerOpen(false);
      }
    };
    handleAutoCollapse();
    window.addEventListener('resize', handleAutoCollapse);
    return () => window.removeEventListener('resize', handleAutoCollapse);
  }, []);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Active navigation section
  const [currentPage, setCurrentPage] = useState<'overview' | 'clients' | 'enrollment' | 'apis' | 'activities' | 'settings'>('overview');
  const [activityFilterClientId, setActivityFilterClientId] = useState<string>('all');

  // Modals
  const [selectedClientForInfo, setSelectedClientForInfo] = useState<CafeClientRecord | null>(null);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isViewAllActivityOpen, setIsViewAllActivityOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<SystemActivity | null>(null);
  const [visibleSecretKeyId, setVisibleSecretKeyId] = useState<string | null>(null);

  // Settings suite state
  const [selectedClientForLogoModal, setSelectedClientForLogoModal] = useState<CafeClientRecord | null>(null);
  const [workspaceNotifications, setWorkspaceNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [apiLogging, setApiLogging] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30m');
  const [fonepaySimulation, setFonepaySimulation] = useState(true);

  // Enrollment form state
  const [enrollVenueName, setEnrollVenueName] = useState('');
  const [enrollEmail, setEnrollEmail] = useState('');
  const [enrollPerson, setEnrollPerson] = useState('');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [hasCopiedLink, setHasCopiedLink] = useState(false);

  // Filter & Search
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Deactive'>('all');
  const [apiSearchQuery, setApiSearchQuery] = useState('');

  // Stats
  const totalClientsCount = clients.length;
  const activeVenuesCount = clients.filter((c) => c.status === 'Active').length;
  const totalApiRequests = apiCredentials.reduce((sum, k) => sum + k.requestsToday, 0) + 1840000;
  const totalMonthlyRevenue = clients.reduce(
    (sum, c) => sum + (c.status === 'Active' ? c.monthlyRevenueEstimate : 0),
    0
  );

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
      c.personInCharge.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
      c.contactEmail.toLowerCase().includes(clientSearchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredApis = apiCredentials.filter(
    (k) =>
      k.clientName.toLowerCase().includes(apiSearchQuery.toLowerCase()) ||
      k.apiKey.toLowerCase().includes(apiSearchQuery.toLowerCase())
  );

  const handleDispatchEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollVenueName || !enrollEmail || !enrollPerson) return;
    const link = await dispatchEnrollmentLink(enrollVenueName, enrollEmail, enrollPerson);
    setGeneratedLink(link);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard`, 'success');
  };

  // Redirect to single unified login page if unauthenticated
  if (!currentUser || currentUser.role !== 'super_admin') {
    return <Navigate to="/login" replace />;
  }

  // 2. MAIN APPLICATION WORKFLOW
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-stone-900 flex font-sans">
      {/* MOBILE DRAWER BACKDROP OVERLAY */}
      {isMobileDrawerOpen && (
        <div
          onClick={() => setIsMobileDrawerOpen(false)}
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50 md:hidden animate-fadeIn"
        />
      )}

      {/* MOBILE DRAWER OFF-CANVAS SIDEBAR (md:hidden) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 bg-white z-50 shadow-2xl flex flex-col justify-between select-none md:hidden transition-transform duration-300 ease-in-out border-r border-stone-200 ${
          isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Mobile Drawer Header */}
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-xs flex items-center justify-center shadow-xs border border-emerald-500/30 tracking-tight">
                CM
              </div>
              <div>
                <span className="font-extrabold text-sm text-stone-900 tracking-tight block leading-tight">CafeMS</span>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/70 uppercase tracking-wider inline-block mt-0.5 leading-none">
                  super admin
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer transition"
              title="Close navigation"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Navigation Links for Mobile Drawer */}
          <nav className="p-3 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 px-3 py-1 block font-semibold">
              PLATFORM
            </span>

            {[
              { id: 'overview', label: 'Dashboard', icon: TrendingUp },
              { id: 'clients', label: 'Client management', icon: Building2 },
              { id: 'enrollment', label: 'Dispatch enrollment', icon: LinkIcon },
              { id: 'apis', label: 'API management', icon: Key },
              { id: 'activities', label: 'Client activities', icon: Activity },
              { id: 'settings', label: 'Settings', icon: SettingsIcon },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id as any);
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:bg-stone-100/80 hover:text-stone-900'
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Drawer Footer */}
        <div className="p-3 border-t border-stone-100 bg-white space-y-1">
          <div className="px-3 py-1 text-[11px] text-stone-400 font-mono flex items-center justify-between">
            <span>Admin Root</span>
            <span className="text-emerald-600 font-bold">Active</span>
          </div>
          <button
            onClick={() => {
              setIsMobileDrawerOpen(false);
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
          >
            <LogOut className="size-4 text-stone-400" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* DESKTOP LEFT SIDEBAR (Sticky 100vh height, permanently visible logout, pristine collapsed mode) */}
      <aside
        className={`hidden md:flex ${
          isSidebarCollapsed ? 'w-20' : 'w-60'
        } h-screen sticky top-0 transition-all duration-200 bg-white border-r border-stone-200/80 flex-col justify-between shrink-0 select-none z-30 overflow-visible`}
      >
        <div>
          {/* Brand & Collapse Header - Unified single tile of exact same size */}
          {isSidebarCollapsed ? (
            <div className="p-3 border-b border-stone-100 flex justify-center">
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                className="size-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs flex items-center justify-center shadow-xs border border-emerald-500/30 cursor-pointer transition-all duration-200 group"
                aria-label="Expand sidebar"
              >
                <span className="group-hover:hidden font-black">CM</span>
                <PanelLeftOpen className="size-5 hidden group-hover:block transition-all" />
              </button>
            </div>
          ) : (
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-xs flex items-center justify-center shadow-xs border border-emerald-500/30 tracking-tight">
                  CM
                </div>
                <div>
                  <span className="font-extrabold text-sm text-stone-900 tracking-tight block leading-tight">CafeMS</span>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/70 uppercase tracking-wider inline-block mt-0.5 leading-none">
                    super admin
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer transition"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="size-4" />
              </button>
            </div>
          )}

          {/* Main Navigation Items */}
          <nav className="p-2 space-y-1.5">
            {!isSidebarCollapsed && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 px-3 py-1 block font-semibold">
                OVERVIEW
              </span>
            )}
            
            {/* Overview / Dashboard */}
            <div className="relative group">
              <button
                onClick={() => setCurrentPage('overview')}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center size-11 mx-auto rounded-2xl' : 'justify-start gap-3 px-3 py-2 rounded-xl text-xs'
                } font-medium transition-all cursor-pointer ${
                  currentPage === 'overview'
                    ? 'bg-stone-900 text-white font-semibold shadow-xs ring-1 ring-stone-900/10'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                }`}
                title={isSidebarCollapsed ? undefined : 'Dashboard'}
              >
                <Layers className={`${isSidebarCollapsed ? 'size-5' : 'size-4'} shrink-0`} />
                {!isSidebarCollapsed && <span>Dashboard</span>}
              </button>
              {isSidebarCollapsed && (
                <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-stone-900 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 border border-stone-800">
                  Dashboard
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-stone-900" />
                </div>
              )}
            </div>

            {!isSidebarCollapsed && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 px-3 pt-2.5 pb-1 block font-semibold">
                MANAGEMENT
              </span>
            )}
            
            {/* Clients */}
            <div className="relative group">
              <button
                onClick={() => setCurrentPage('clients')}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center size-11 mx-auto rounded-2xl' : 'justify-start gap-3 px-3 py-2 rounded-xl text-xs'
                } font-medium transition-all cursor-pointer ${
                  currentPage === 'clients'
                    ? 'bg-stone-900 text-white font-semibold shadow-xs ring-1 ring-stone-900/10'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                }`}
                title={isSidebarCollapsed ? undefined : 'Client management'}
              >
                <Building2 className={`${isSidebarCollapsed ? 'size-5' : 'size-4'} shrink-0`} />
                {!isSidebarCollapsed && <span>Client management</span>}
              </button>
              {isSidebarCollapsed && (
                <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-stone-900 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 border border-stone-800">
                  Client management
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-stone-900" />
                </div>
              )}
            </div>

            {/* Enrollment Dispatch */}
            <div className="relative group">
              <button
                onClick={() => setCurrentPage('enrollment')}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center size-11 mx-auto rounded-2xl' : 'justify-start gap-3 px-3 py-2 rounded-xl text-xs'
                } font-medium transition-all cursor-pointer ${
                  currentPage === 'enrollment'
                    ? 'bg-stone-900 text-white font-semibold shadow-xs ring-1 ring-stone-900/10'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                }`}
                title={isSidebarCollapsed ? undefined : 'Dispatch enrollment'}
              >
                <LinkIcon className={`${isSidebarCollapsed ? 'size-5' : 'size-4'} shrink-0`} />
                {!isSidebarCollapsed && <span>Dispatch enrollment</span>}
              </button>
              {isSidebarCollapsed && (
                <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-stone-900 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 border border-stone-800">
                  Dispatch enrollment
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-stone-900" />
                </div>
              )}
            </div>

            {/* APIs */}
            <div className="relative group">
              <button
                onClick={() => setCurrentPage('apis')}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center size-11 mx-auto rounded-2xl' : 'justify-start gap-3 px-3 py-2 rounded-xl text-xs'
                } font-medium transition-all cursor-pointer ${
                  currentPage === 'apis'
                    ? 'bg-stone-900 text-white font-semibold shadow-xs ring-1 ring-stone-900/10'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                }`}
                title={isSidebarCollapsed ? undefined : 'API management'}
              >
                <Key className={`${isSidebarCollapsed ? 'size-5' : 'size-4'} shrink-0`} />
                {!isSidebarCollapsed && <span>API management</span>}
              </button>
              {isSidebarCollapsed && (
                <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-stone-900 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 border border-stone-800">
                  API management
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-stone-900" />
                </div>
              )}
            </div>

            {/* Activities Audit */}
            <div className="relative group">
              <button
                onClick={() => setCurrentPage('activities')}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center size-11 mx-auto rounded-2xl' : 'justify-start gap-3 px-3 py-2 rounded-xl text-xs'
                } font-medium transition-all cursor-pointer ${
                  currentPage === 'activities'
                    ? 'bg-stone-900 text-white font-semibold shadow-xs ring-1 ring-stone-900/10'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                }`}
                title={isSidebarCollapsed ? undefined : 'Client activities'}
              >
                <Activity className={`${isSidebarCollapsed ? 'size-5' : 'size-4'} shrink-0`} />
                {!isSidebarCollapsed && <span>Client activities</span>}
              </button>
              {isSidebarCollapsed && (
                <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-stone-900 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 border border-stone-800">
                  Client activities
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-stone-900" />
                </div>
              )}
            </div>

            {!isSidebarCollapsed && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 px-3 pt-2.5 pb-1 block font-semibold">
                SYSTEM
              </span>
            )}
            
            {/* Settings */}
            <div className="relative group">
              <button
                onClick={() => setCurrentPage('settings')}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center size-11 mx-auto rounded-2xl' : 'justify-start gap-3 px-3 py-2 rounded-xl text-xs'
                } font-medium transition-all cursor-pointer ${
                  currentPage === 'settings'
                    ? 'bg-stone-900 text-white font-semibold shadow-xs ring-1 ring-stone-900/10'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                }`}
                title={isSidebarCollapsed ? undefined : 'Settings'}
              >
                <SettingsIcon className={`${isSidebarCollapsed ? 'size-5' : 'size-4'} shrink-0`} />
                {!isSidebarCollapsed && <span>Settings</span>}
              </button>
              {isSidebarCollapsed && (
                <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-stone-900 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 border border-stone-800">
                  Settings
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-stone-900" />
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Sidebar Footer: Always visible and sticky on the screen */}
        <div className="p-2.5 border-t border-stone-100 bg-white">
          {!isSidebarCollapsed && (
            <div className="px-2 py-0.5 mb-1.5 text-[11px] text-stone-400 font-mono flex items-center justify-between">
              <span>Admin Root</span>
              <span className="text-emerald-600 font-bold">Active</span>
            </div>
          )}
          <div className="relative group">
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className={`w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center size-11 mx-auto rounded-2xl' : 'justify-start gap-2.5 px-3 py-2 rounded-xl text-xs'
              } font-semibold text-stone-600 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer`}
              title={isSidebarCollapsed ? undefined : 'Log out'}
            >
              <LogOut className={`${isSidebarCollapsed ? 'size-5' : 'size-4'} shrink-0 text-stone-400 group-hover:text-rose-600`} />
              {!isSidebarCollapsed && <span>Log out</span>}
            </button>
            {isSidebarCollapsed && (
              <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-rose-900 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50">
                Log out
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-rose-900" />
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN VIEW */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-stone-200/80 px-3 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="p-1.5 -ml-1 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 md:hidden cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="size-5" />
            </button>
            <span className="hidden sm:inline">Super Admin</span>
            <span className="hidden sm:inline text-stone-300">/</span>
            <strong className="text-stone-900 capitalize font-bold truncate">
              {currentPage === 'overview'
                ? 'Dashboard'
                : currentPage === 'clients'
                ? 'Client management'
                : currentPage === 'apis'
                ? 'API management'
                : 'Settings'}
            </strong>
          </div>

          <div className="flex items-center gap-3 relative">
            {/* Interactive SA Profile Button with Dropdown Popover */}
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition cursor-pointer text-left"
            >
              <div className="size-8 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center">
                SA
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-stone-900 block leading-tight">Super Admin</span>
                <span className="text-[10px] text-stone-400 block font-mono">Platform administrator</span>
              </div>
              <ChevronDown className="size-3 text-stone-400" />
            </button>

            {/* Profile Popover Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-fadeIn">
                <div className="p-3 border-b border-stone-100">
                  <div className="text-xs font-bold text-stone-900">Super Admin</div>
                  <div className="text-[11px] font-mono text-stone-500">admin@cafems.io</div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-200">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    <span>Global Root Access</span>
                  </div>
                </div>

                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate('/client');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition cursor-pointer"
                  >
                    <span>Switch to Cafe Operations</span>
                    <ExternalLink className="size-3.5 text-stone-400" />
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setCurrentPage('settings');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition cursor-pointer"
                  >
                    <span>System Settings</span>
                    <SettingsIcon className="size-3.5 text-stone-400" />
                  </button>
                </div>

                <div className="pt-1 border-t border-stone-100">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  >
                    <LogOut className="size-3.5" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* PAGE CONTENT: Dynamic responsive padding */}
        <div className="p-4 sm:p-5 lg:p-6 w-full max-w-6xl mx-auto space-y-5">
          {/* SECTION 1: OVERVIEW DASHBOARD */}
          {currentPage === 'overview' && (
            <div className="space-y-5">
              {/* Page Heading & Enrollment Link Dispatch Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 block">
                    NETWORK STATUS
                  </span>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Good morning, Super Admin
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">Here’s what’s happening across your network today.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setGeneratedLink(null);
                      setEnrollVenueName('');
                      setEnrollEmail('');
                      setEnrollPerson('');
                      setIsEnrollModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-[0.99]"
                  >
                    <LinkIcon className="size-3.5" />
                    <span>Dispatch Enrollment Link</span>
                  </button>
                </div>
              </div>

              {/* 4 Core Stat Cards (Matching archive style) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="font-medium text-slate-500">Total clients</span>
                    <div className="size-8 rounded-xl bg-emerald-50 border border-emerald-100/80 flex items-center justify-center text-emerald-600 shadow-2xs">
                      <Building2 className="size-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900">{totalClientsCount}</div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
                    <span>↑ 12.5% vs last month</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="font-medium text-slate-500">Active venues</span>
                    <div className="size-8 rounded-xl bg-indigo-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600 shadow-2xs">
                      <Radio className="size-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900">
                    {activeVenuesCount}
                    <span className="text-sm font-normal text-slate-400 ml-1">/ {totalClientsCount}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
                    <span>↑ 8.2% vs last month</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="font-medium text-slate-500">API requests</span>
                    <div className="size-8 rounded-xl bg-amber-50 border border-amber-100/80 flex items-center justify-center text-amber-600 shadow-2xs">
                      <Zap className="size-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900">1.84M</div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
                    <span>↑ 23.8% vs last month</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="font-medium text-slate-500">Monthly network revenue</span>
                    <div className="size-8 rounded-xl bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 shadow-2xs">
                      <TrendingUp className="size-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900">
                    {formatCurrency(totalMonthlyRevenue)}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
                    <span>↑ 14.6% vs last month</span>
                  </div>
                </div>
              </div>

              {/* Network Growth Chart & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Growth Chart: Smooth Curved Area Line Graph matching exact screenshot */}
                <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-stone-900">Network growth</h3>
                      <p className="text-xs text-stone-500">New client registrations over time</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium text-stone-700 cursor-pointer hover:bg-stone-100 transition">
                      <span>Last 6 months</span>
                      <ChevronDown className="size-3.5 text-stone-400" />
                    </div>
                  </div>

                  {/* Nivo Powered Network Growth Chart */}
                  <div className="relative pt-1 pb-1">
                    <NivoNetworkGrowthChart />
                  </div>

                  {/* 6-Month Metric Summary Cards: responsive layout without text wrapping */}
                  <div className="grid grid-cols-6 gap-1 sm:gap-2 text-center pt-3 border-t border-stone-100">
                    {[
                      { m: 'May', val: 24 },
                      { m: 'Jun', val: 31 },
                      { m: 'Jul', val: 36 },
                      { m: 'Aug', val: 43 },
                      { m: 'Sep', val: 51 },
                      { m: 'Oct', val: 58, isCurrent: true },
                    ].map((col) => (
                      <div key={col.m} className="p-1 rounded-xl transition hover:bg-stone-50">
                        <span className="text-[11px] font-medium text-stone-500 block">
                          {col.m}
                        </span>
                        <div
                          className={`text-base font-extrabold font-mono mt-0.5 ${
                            col.isCurrent ? 'text-emerald-600' : 'text-stone-800'
                          }`}
                        >
                          {col.val}
                        </div>
                        <span className="text-[10px] text-stone-400 block font-mono truncate">
                          <span className="hidden sm:inline">new </span>clients
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity Panel - Precisely matching Screenshot 2 */}
                <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-base text-stone-900 tracking-tight">Recent activity</h3>
                        <p className="text-xs text-stone-500 mt-0.5">Latest updates from your network</p>
                      </div>
                      <button
                        onClick={() => setIsViewAllActivityOpen(true)}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                      >
                        View all →
                      </button>
                    </div>

                    <div className="divide-y divide-stone-100">
                      {systemActivities.slice(0, 3).map((act) => (
                        <div
                          key={act.id}
                          onClick={() => setSelectedActivity(act)}
                          className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-3 group cursor-pointer hover:bg-stone-50/70 -mx-2 px-2 rounded-xl transition-all"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* Circular icon pill matching Screenshot 2 */}
                            {act.type === 'client_registered' || act.title.toLowerCase().includes('client registered') ? (
                              <div className="size-9 rounded-full bg-emerald-100/80 text-emerald-800 font-bold text-sm flex items-center justify-center shrink-0">
                                K
                              </div>
                            ) : act.type === 'api_key' || act.title.toLowerCase().includes('api key') ? (
                              <div className="size-9 rounded-full bg-indigo-100/70 text-indigo-600 flex items-center justify-center shrink-0">
                                <ArrowUpRight className="size-4.5 stroke-[2.5]" />
                              </div>
                            ) : act.type === 'client_deactivated' || act.title.toLowerCase().includes('deactivated') ? (
                              <div className="size-9 rounded-full bg-orange-100/80 text-orange-600 font-bold text-base flex items-center justify-center shrink-0">
                                !
                              </div>
                            ) : (
                              <div className="size-9 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
                                <ShieldCheck className="size-4.5" />
                              </div>
                            )}

                            <div className="min-w-0">
                              <h4 className="text-sm font-semibold text-stone-900 leading-snug group-hover:text-emerald-700 transition-colors">
                                {act.title}
                              </h4>
                              <p className="text-xs text-stone-500 mt-0.5 truncate">
                                {act.detail}
                              </p>
                            </div>
                          </div>

                          <div className="text-xs text-stone-400 font-normal shrink-0">
                            {act.timestamp}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Overview Table Preview */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Client overview</h3>
                    <p className="text-xs text-slate-500">Recently enrolled cafés and venues</p>
                  </div>
                  <button
                    onClick={() => setCurrentPage('clients')}
                    className="text-xs font-semibold text-emerald-600 hover:underline"
                  >
                    Manage clients →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-mono text-[10px] uppercase">
                        <th className="pb-2">CLIENT</th>
                        <th className="pb-2">STATUS</th>
                        <th className="pb-2 hidden sm:table-cell">JOINED</th>
                        <th className="pb-2 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {clients.slice(0, 4).map((client) => (
                        <tr key={client.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="size-8 rounded-lg bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-xs">
                                {client.name.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-slate-900 block truncate">{client.name}</span>
                                <span className="text-[11px] text-slate-400 font-mono truncate block">{client.contactEmail}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold border ${
                                client.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {client.status}
                            </span>
                          </td>
                          <td className="py-3 hidden sm:table-cell text-slate-500 font-mono">{formatDate(client.enrolledAt)}</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => setSelectedClientForInfo(client)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
                            >
                              Info
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: CLIENT MANAGEMENT (STRICT SPEC COMPLIANCE) */}
          {currentPage === 'clients' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 block">
                    TENANT DIRECTORY
                  </span>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Client management</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Supervise and manage every café in your platform network.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setGeneratedLink(null);
                    setEnrollVenueName('');
                    setEnrollEmail('');
                    setEnrollPerson('');
                    setIsEnrollModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-[0.99]"
                >
                  <LinkIcon className="size-3.5" />
                  <span>Dispatch Enrollment Link</span>
                </button>
              </div>

              {/* Toolbar */}
              <div className="p-3 bg-white rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                <div className="relative w-full sm:w-80">
                  <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={clientSearchQuery}
                    onChange={(e) => setClientSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Status:</span>
                  {(['all', 'Active', 'Deactive'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        statusFilter === st
                          ? 'bg-slate-900 text-white font-semibold'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st === 'all' ? 'All' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Client Table (Strictly NO plan column per spec!) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-400 font-mono text-[10px] uppercase">
                        <th className="py-3 px-4 sm:px-6">CLIENT / VENUE</th>
                        <th className="py-3 px-3 sm:px-4">STATUS</th>
                        <th className="py-3 px-3 hidden lg:table-cell">REGISTERED ON</th>
                        <th className="py-3 px-3 hidden md:table-cell">SUBSCRIPTION</th>
                        <th className="py-3 px-3 hidden sm:table-cell">MENU SYNC</th>
                        <th className="py-3 px-3 hidden xl:table-cell">CONTACT INFO</th>
                        <th className="py-3 px-4 sm:px-6 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredClients.map((client) => {
                        const isActive = client.status === 'Active';
                        return (
                          <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-4 sm:px-6">
                              <div className="flex items-center gap-3">
                                <div className="size-9 rounded-xl bg-white border border-slate-200 overflow-hidden shadow-2xs shrink-0 p-0.5">
                                  <img
                                    src={getCafeLogo(client.id)}
                                    alt={client.name}
                                    className="size-full object-cover rounded-lg"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <span className="font-bold text-slate-900 text-sm block truncate">{client.name}</span>
                                  <span className="text-[11px] text-slate-400 truncate block">{client.address}</span>
                                </div>
                              </div>
                            </td>

                            {/* Status Strictly Active or Deactive with instant toggle */}
                            <td className="py-4 px-3 sm:px-4 whitespace-nowrap">
                              <button
                                onClick={() => toggleClientStatus(client.id)}
                                className="group flex items-center gap-1.5 cursor-pointer"
                                title="Click to toggle status"
                              >
                                <span
                                  className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold border transition-all ${
                                    isActive
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:bg-emerald-100'
                                      : 'bg-rose-50 text-rose-700 border-rose-200 group-hover:bg-rose-100'
                                  }`}
                                >
                                  {client.status}
                                </span>
                              </button>
                            </td>

                            {/* Exact Registration / Enrolled Date */}
                            <td className="py-4 px-3 hidden lg:table-cell whitespace-nowrap">
                              <div className="flex items-center gap-1.5 text-slate-600 font-mono text-xs">
                                <Calendar className="size-3.5 text-slate-400" />
                                <span>{formatDate(client.enrolledAt)}</span>
                              </div>
                            </td>

                            {/* Subscription Plan & Renewal Date */}
                            <td className="py-4 px-3 hidden md:table-cell whitespace-nowrap">
                              <div className="space-y-0.5">
                                <span className="font-semibold text-slate-800 text-xs block">
                                  {client.subscriptionPlan || 'Enterprise Annual'}
                                </span>
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200">
                                  <span>Renew:</span>
                                  <span className="font-bold">{formatDate(client.subscriptionRenewalDate || '2026-11-14T09:30:00Z')}</span>
                                </span>
                              </div>
                            </td>

                            {/* Menu Source Toggle (Manual vs API Synced) */}
                            <td className="py-4 px-3 hidden sm:table-cell whitespace-nowrap">
                              <button
                                onClick={() =>
                                  updateClientMenuSource(
                                    client.id,
                                    client.menuSource === 'api' ? 'manual' : 'api'
                                  )
                                }
                                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border transition cursor-pointer flex items-center gap-1 ${
                                  client.menuSource === 'api'
                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                                }`}
                                title="Click to toggle menu management source"
                              >
                                <span className={`size-1.5 rounded-full ${client.menuSource === 'api' ? 'bg-indigo-600' : 'bg-slate-500'}`} />
                                <span>{client.menuSource === 'api' ? 'API Menu' : 'Manual Menu'}</span>
                              </button>
                            </td>

                            <td className="py-4 px-3 hidden xl:table-cell whitespace-nowrap">
                              <span className="font-semibold text-slate-900 block">{client.personInCharge}</span>
                              <span className="text-[11px] text-slate-400 font-mono">{client.contactEmail}</span>
                            </td>

                            {/* Info Button opening Client Details Drawer/Modal */}
                            <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                              <button
                                onClick={() => setSelectedClientForInfo(client)}
                                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
                              >
                                Info
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: API MANAGEMENT */}
          {currentPage === 'apis' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 block">
                    DEVELOPER CREDENTIALS
                  </span>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">API management</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Control tenant integrations, key rotation, and rate quotas.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const activeClient = clients.find((c) => c.status === 'Active') || clients[0];
                    if (activeClient) generateApiKey(activeClient.id);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-[0.99] self-start sm:self-auto"
                >
                  <Key className="size-3.5" />
                  <span>Issue New API Key</span>
                </button>
              </div>

              {/* API Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                  <span className="text-xs text-slate-400 block">Registered APIs</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{apiCredentials.length}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                  <span className="text-xs text-slate-400 block">Active Integrations</span>
                  <div className="text-2xl font-bold text-emerald-600 mt-1">
                    {apiCredentials.filter((a) => a.status === 'Active').length}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                  <span className="text-xs text-slate-400 block">Requests This Month</span>
                  <div className="text-2xl font-bold text-slate-900 font-mono mt-1">2.4M</div>
                </div>
              </div>

              {/* API Table */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-xs font-bold text-slate-900">Registered API Keys</h3>
                  <div className="relative w-full sm:w-64">
                    <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search API keys..."
                      value={apiSearchQuery}
                      onChange={(e) => setApiSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-400 font-mono text-[10px] uppercase">
                        <th className="py-3 px-4 sm:px-6">VENUE CLIENT</th>
                        <th className="py-3 px-3 sm:px-4">API KEY</th>
                        <th className="py-3 px-3 sm:px-4">STATUS</th>
                        <th className="py-3 px-4 hidden sm:table-cell">RATE QUOTA</th>
                        <th className="py-3 px-4 sm:px-6 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredApis.map((cred) => (
                        <tr key={cred.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 whitespace-nowrap">{cred.clientName}</td>
                          <td className="py-3.5 px-3 sm:px-4">
                            <div className="flex items-center gap-2">
                              <code className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                                {cred.apiKey}
                              </code>
                              <button
                                onClick={() => copyToClipboard(cred.apiKey, 'API Key')}
                                className="text-slate-400 hover:text-slate-700 cursor-pointer"
                              >
                                <Copy className="size-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold border ${
                                cred.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : cred.status === 'Suspended'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {cred.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-600 hidden sm:table-cell whitespace-nowrap">
                            {cred.rateLimitPerMin} req/min
                          </td>
                          <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {cred.status === 'Active' && (
                                <>
                                  <button
                                    onClick={() => updateApiKeyStatus(cred.id, 'Suspended')}
                                    className="px-2 py-1 rounded-lg text-amber-700 hover:bg-amber-50 font-semibold text-xs transition cursor-pointer flex items-center gap-1"
                                    title="Temporarily freeze API access"
                                  >
                                    <PauseCircle className="size-3.5" />
                                    <span>Suspend</span>
                                  </button>
                                  <button
                                    onClick={() => revokeApiKey(cred.id)}
                                    className="px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold text-xs transition cursor-pointer"
                                  >
                                    Revoke
                                  </button>
                                </>
                              )}
                              {cred.status === 'Suspended' && (
                                <>
                                  <button
                                    onClick={() => updateApiKeyStatus(cred.id, 'Active')}
                                    className="px-2 py-1 rounded-lg text-emerald-700 hover:bg-emerald-50 font-semibold text-xs transition cursor-pointer flex items-center gap-1"
                                    title="Unfreeze and activate API access"
                                  >
                                    <PlayCircle className="size-3.5" />
                                    <span>Resume</span>
                                  </button>
                                  <button
                                    onClick={() => revokeApiKey(cred.id)}
                                    className="px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold text-xs transition cursor-pointer"
                                  >
                                    Revoke
                                  </button>
                                </>
                              )}
                              {cred.status === 'Revoked' && (
                                <button
                                  onClick={() => updateApiKeyStatus(cred.id, 'Active')}
                                  className="px-2 py-1 rounded-lg text-slate-500 hover:bg-slate-100 font-semibold text-xs transition cursor-pointer"
                                  title="Reactivate revoked key"
                                >
                                  Reactivate
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: DEDICATED ENROLLMENT LINK DISPATCH (STANDALONE WORKSPACE) */}
          {currentPage === 'enrollment' && (
            <div className="space-y-6 animate-fadeIn pb-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 block font-semibold">
                    PARTNER ONBOARDING
                  </span>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dispatch Enrollment Link</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Generate isolated cryptographically-signed invitation links for onboarding new cafés and hospitality clients.
                  </p>
                </div>
              </div>

              {/* Grid: Dispatcher Form & Live Link Generator */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Form Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <LinkIcon className="size-4 text-emerald-600" />
                      <span>Generate New Partner Invitation</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enter venue credentials to dispatch an enrollment URL directly to the owner.
                    </p>
                  </div>

                  <form onSubmit={handleDispatchEnrollment} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Cafe / Venue Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kathmandu Coffee Hearth"
                        value={enrollVenueName}
                        onChange={(e) => setEnrollVenueName(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Owner / Manager in Charge <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anish Thapa"
                        value={enrollPerson}
                        onChange={(e) => setEnrollPerson(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Recipient Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="owner@cafe.com.np"
                        value={enrollEmail}
                        onChange={(e) => setEnrollEmail(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono">Token expires in 72h</span>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer active:scale-[0.98]"
                      >
                        <Send className="size-3.5" />
                        <span>Dispatch Enrollment Link</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Generated Token & QR Display */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
                  <div>
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                      <div>
                        <h2 className="text-sm font-bold text-slate-900">Active Enrollment Dispatch</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Secure link ready for copy & tablet QR scan</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {generatedLink ? 'Live Ready' : 'Awaiting Input'}
                      </span>
                    </div>

                    {generatedLink ? (
                      <div className="space-y-4 mt-4">
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 break-all select-all">
                          {generatedLink}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/70">
                          <div className="size-24 rounded-xl bg-white p-2 border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
                            <QRCodeSVG value={generatedLink} size={80} level="M" />
                          </div>
                          <div className="space-y-1 text-center sm:text-left">
                            <div className="text-xs font-bold text-slate-900">Direct Setup Scan</div>
                            <p className="text-[11px] text-slate-600">
                              Scan with restaurant tablet or phone to instantly start onboarding floor layout and staff.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
                        <LinkIcon className="size-8 text-slate-300 stroke-[1.5]" />
                        <span className="text-xs font-medium text-slate-500">Fill in the venue details to generate a link</span>
                        <span className="text-[11px] font-mono text-slate-400 max-w-xs">
                          An encrypted link and QR code token will generate here instantly.
                        </span>
                      </div>
                    )}
                  </div>

                  {generatedLink && (
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          copyToClipboard(generatedLink, 'Enrollment Link');
                          setHasCopiedLink(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
                      >
                        {hasCopiedLink ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                        <span>{hasCopiedLink ? 'Copied to Clipboard!' : 'Copy Enrollment Link'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Table of Recently Enrolled Venues */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Enrolled Partner Directory</h3>
                    <p className="text-xs text-slate-500">Venues registered with their timestamp and link credentials</p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{clients.length} Total Partners</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-400 font-mono text-[10px] uppercase">
                        <th className="py-2.5 px-4">PARTNER VENUE</th>
                        <th className="py-2.5 px-3">REGISTERED DATE</th>
                        <th className="py-2.5 px-3">OWNER / MANAGER</th>
                        <th className="py-2.5 px-3">CONTACT EMAIL</th>
                        <th className="py-2.5 px-3">STATUS</th>
                        <th className="py-2.5 px-4 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {clients.map((client) => (
                        <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900">{client.name}</td>
                          <td className="py-3 px-3 font-mono text-slate-600">{formatDate(client.enrolledAt)}</td>
                          <td className="py-3 px-3 text-slate-800 font-medium">{client.personInCharge}</td>
                          <td className="py-3 px-3 font-mono text-slate-500">{client.contactEmail}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold border ${
                                client.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {client.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                const dummyLink = `https://cafems.io/enroll?venue=${encodeURIComponent(client.name)}&token=${client.apiKeyId}`;
                                copyToClipboard(dummyLink, 'Partner Link');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                            >
                              Copy Link
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: CLIENT ACTIVITIES AUDIT LOG */}
          {currentPage === 'activities' && (
            <div className="space-y-6 animate-fadeIn pb-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 block font-semibold">
                    AUDIT TELEMETRY
                  </span>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Client Activities & Live Logs</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time audit log of all operational events, menu updates, and staff actions performed across café venues.
                  </p>
                </div>

                {/* Filter by Client Venue */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Filter Venue:</span>
                  <select
                    value={activityFilterClientId}
                    onChange={(e) => setActivityFilterClientId(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="all">All Registered Venues ({clients.length})</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Activity Feed Table */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="size-4 text-emerald-600" />
                    <span>Real-time Operational Events</span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    Showing {systemActivities.length} events
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-400 font-mono text-[10px] uppercase">
                        <th className="py-3 px-4 sm:px-6">TIME</th>
                        <th className="py-3 px-3 sm:px-4">CAFE VENUE</th>
                        <th className="py-3 px-3 sm:px-4">ACTOR</th>
                        <th className="py-3 px-4">EVENT</th>
                        <th className="py-3 px-4 hidden md:table-cell">DETAILS</th>
                        <th className="py-3 px-4 sm:px-6 text-right">SEVERITY</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {systemActivities
                        .filter((act) => {
                          if (activityFilterClientId === 'all') return true;
                          return (act as any).clientId === activityFilterClientId;
                        })
                        .map((act) => {
                          const badgeColor =
                            act.severity === 'success'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : act.severity === 'warning'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200';

                          return (
                            <tr key={act.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-500 whitespace-nowrap">
                                {act.timestamp}
                              </td>
                              <td className="py-3.5 px-3 sm:px-4 font-bold text-slate-900 whitespace-nowrap">
                                {(act as any).clientName || 'Cafe XYZ Artisanal Bar'}
                              </td>
                              <td className="py-3.5 px-3 sm:px-4 font-medium text-slate-700 whitespace-nowrap">
                                {act.actor}
                              </td>
                              <td className="py-3.5 px-4 font-semibold text-slate-900">
                                {act.title}
                              </td>
                              <td className="py-3.5 px-4 text-slate-600 hidden md:table-cell">
                                {act.detail}
                              </td>
                              <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold border ${badgeColor}`}>
                                  {act.severity}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: PLATFORM SETTINGS (STRICT SPEC COMPLIANCE) */}
          {currentPage === 'settings' && (
            <div className="space-y-6 animate-fadeIn pb-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 block font-semibold">
                    SYSTEM PREFERENCES
                  </span>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Settings</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Platform profile, administrative notifications, security governance, and webhook configuration.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast('Platform settings saved successfully!', 'success')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition cursor-pointer active:scale-[0.98]"
                  >
                    <Save className="size-3.5" />
                    <span>Save Preferences</span>
                  </button>
                </div>
              </div>

              {/* 1. PLATFORM PROFILE */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="size-4 text-emerald-600" />
                    <span>Platform Profile</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Platform identity, administrative contact, and region deployment info.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">Platform Name</label>
                    <input
                      type="text"
                      defaultValue="CafeMS Platform"
                      className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
                    />
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">Admin Contact Email</label>
                    <input
                      type="email"
                      defaultValue="admin@cafems.io"
                      className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none font-mono"
                    />
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                    <label className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">Operating Region</label>
                    <div className="text-xs font-bold text-slate-900 font-mono flex items-center justify-between">
                      <span>Kathmandu, Nepal</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-sans font-semibold">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. SYSTEM NOTIFICATIONS */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Bell className="size-4 text-indigo-600" />
                    <span>System Notifications</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure real-time alerts dispatched to platform administrators.
                  </p>
                </div>

                <div className="divide-y divide-slate-100">
                  <div className="py-3.5 flex items-center justify-between">
                    <div>
                      <strong className="text-xs font-bold text-slate-900 block">New client enrollment notifications</strong>
                      <p className="text-xs text-slate-500 mt-0.5">Receive alert when a newly enrolled cafe completes onboarding.</p>
                    </div>
                    <button
                      onClick={() => setWorkspaceNotifications(!workspaceNotifications)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        workspaceNotifications ? 'bg-slate-900' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          workspaceNotifications ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="py-3.5 flex items-center justify-between">
                    <div>
                      <strong className="text-xs font-bold text-slate-900 block">Tenant API surge & anomaly detection</strong>
                      <p className="text-xs text-slate-500 mt-0.5">Trigger warning when a cafe tenant exceeds unusual request velocity.</p>
                    </div>
                    <button
                      onClick={() => setApiLogging(!apiLogging)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        apiLogging ? 'bg-slate-900' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          apiLogging ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. SECURITY & ACCESS GOVERNANCE */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Lock className="size-4 text-amber-600" />
                    <span>Security & Access Governance</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Multi-factor authentication enforcement and session inactivity control.
                  </p>
                </div>

                <div className="divide-y divide-slate-100">
                  <div className="py-3.5 flex items-center justify-between">
                    <div>
                      <strong className="text-xs font-bold text-slate-900 block">Two-factor authentication (2FA)</strong>
                      <p className="text-xs text-slate-500 mt-0.5">Require multi-factor TOTP authorization for Super Admin access.</p>
                    </div>
                    <button
                      onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        twoFactorAuth ? 'bg-slate-900' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          twoFactorAuth ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="py-3.5 flex items-center justify-between">
                    <div>
                      <strong className="text-xs font-bold text-slate-900 block">Session inactivity timeout</strong>
                      <p className="text-xs text-slate-500 mt-0.5">Automatically lock idle administrative browser sessions.</p>
                    </div>
                    <select
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none"
                    >
                      <option value="15m">15 minutes</option>
                      <option value="30m">30 minutes (Standard)</option>
                      <option value="1h">1 hour</option>
                      <option value="4h">4 hours</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 4. WEBHOOK CONFIGURATIONS */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <LinkIcon className="size-4 text-emerald-600" />
                    <span>Webhook Configuration</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure outbound webhook URLs for real-time tenant enrollment and status events.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-900 block">Webhook Endpoint URL</label>
                    <input
                      type="text"
                      autoComplete="off"
                      spellCheck={false}
                      defaultValue="https://api.cafems.io/v1/webhooks/events"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-900 block">Signing Secret</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        defaultValue="whsec_live_9a8b7c6d5e4f3a2b1c"
                        className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-mono focus:outline-none"
                      />
                      <button
                        onClick={() => showToast('Webhook signing secret regenerated', 'info')}
                        className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 shrink-0 cursor-pointer"
                      >
                        Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL 1: ENROLLMENT LINK DISPATCH (NO MANUAL REGISTER FORM PER SPEC!) */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  TENANT ONBOARDING
                </span>
                <h3 className="text-lg font-bold text-slate-900">Dispatch Enrollment Link</h3>
              </div>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {!generatedLink ? (
              <form onSubmit={handleDispatchEnrollment} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cafe / Venue Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Rustic Bean Roastery"
                    value={enrollVenueName}
                    onChange={(e) => setEnrollVenueName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Owner / Manager Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Suman Shakya"
                    value={enrollPerson}
                    onChange={(e) => setEnrollPerson(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Owner Email</label>
                  <input
                    type="email"
                    required
                    placeholder="suman@rusticbean.com"
                    value={enrollEmail}
                    onChange={(e) => setEnrollEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEnrollModalOpen(false)}
                    className="px-3 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                  >
                    Generate & Send Link
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 py-2">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  <strong>Onboarding URL generated!</strong>
                  <p className="mt-0.5 text-slate-600">
                    The owner can now register their staff, floor layout, and tables via this link.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 select-all break-all">
                  {generatedLink}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      copyToClipboard(generatedLink, 'Enrollment Link');
                      setHasCopiedLink(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                  >
                    {hasCopiedLink ? 'Copied!' : 'Copy Link'}
                  </button>
                  <button
                    onClick={() => setIsEnrollModalOpen(false)}
                    className="px-3 py-2 rounded-xl text-xs text-slate-600"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: CLIENT INFO MODAL (OPENED BY INFO BUTTON) */}
      {selectedClientForInfo && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-11 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-0.5 shrink-0 shadow-2xs">
                  <img
                    src={getCafeLogo(selectedClientForInfo.id)}
                    alt={selectedClientForInfo.name}
                    className="size-full object-cover rounded-lg"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold block">
                    TENANT PROFILE & CREDENTIALS
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 truncate">{selectedClientForInfo.name}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedClientForInfo(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Tenant Brand Artwork Quick-Action Controls */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-slate-400 block uppercase font-semibold">BRAND ARTWORK</span>
                <span className="text-xs font-semibold text-slate-800 truncate block">Vector Emblem or Custom Logo</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    const client = selectedClientForInfo;
                    setSelectedClientForInfo(null);
                    setSelectedClientForLogoModal(client);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-semibold cursor-pointer shadow-2xs transition"
                >
                  <Sparkles className="size-3 text-amber-600" />
                  <span>Emblem</span>
                </button>
                <label className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs cursor-pointer shadow-2xs transition">
                  <Upload className="size-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          showToast('Logo file size must be under 5MB', 'warning');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            updateCafeLogo(selectedClientForInfo.id, ev.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Status</span>
                <span
                  className={`font-mono font-bold ${
                    selectedClientForInfo.status === 'Active' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {selectedClientForInfo.status}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Enrolled / Registered Date</span>
                <span className="font-mono font-bold text-slate-800">
                  {formatDate(selectedClientForInfo.enrolledAt)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Subscription Plan</span>
                <span className="font-semibold text-slate-800">
                  {selectedClientForInfo.subscriptionPlan || 'Enterprise Annual'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Subscription Renewal Date</span>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {formatDate(selectedClientForInfo.subscriptionRenewalDate || '2026-11-14T09:30:00Z')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Menu Source Mode</span>
                <span className="font-mono text-slate-800 font-semibold uppercase">
                  {selectedClientForInfo.menuSource === 'api' ? 'API Synced' : 'Manual Menu'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Venue Address</span>
                <strong className="text-slate-900">{selectedClientForInfo.address}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Manager / In-charge</span>
                <strong className="text-slate-900">{selectedClientForInfo.personInCharge}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Email</span>
                <span className="font-mono text-slate-900">{selectedClientForInfo.contactEmail}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Phone</span>
                <span className="font-mono text-slate-900">{selectedClientForInfo.contactPhone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Tables Provisioned</span>
                <strong className="text-slate-900">{selectedClientForInfo.tableCount} Dining Tables</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Venue Wi-Fi SSID</span>
                <span className="font-mono text-[11px] font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  {selectedClientForInfo.wifiSsid || 'CafeXYZ-Guest-5G'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Fonepay Merchant Code</span>
                <span className="font-mono text-[11px] font-semibold text-slate-800 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                  {selectedClientForInfo.fonepayMerchantCode || 'FONEPAY-KTM-0042'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Settlement Bank</span>
                <strong className="text-slate-800 text-[11px]">
                  {selectedClientForInfo.settlementBank || 'Nabil Bank Current (NPR)'}
                </strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">API Key Linkage</span>
                <span className="font-mono text-[11px] text-slate-900">{selectedClientForInfo.apiKeyId}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => {
                  toggleClientStatus(selectedClientForInfo.id);
                  setSelectedClientForInfo((prev) =>
                    prev ? { ...prev, status: prev.status === 'Active' ? 'Deactive' : 'Active' } : null
                  );
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  selectedClientForInfo.status === 'Active'
                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Toggle to {selectedClientForInfo.status === 'Active' ? 'Deactive' : 'Active'}
              </button>

              <button
                onClick={() => setSelectedClientForInfo(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW ALL RECENT ACTIVITY AUDIT LOG */}
      {isViewAllActivityOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 shrink-0">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-bold">
                  AUDIT LOG FEED
                </span>
                <h3 className="text-base font-bold text-stone-900">Multi-tenant Network Activity</h3>
                <p className="text-xs text-stone-500">Live operational, payment, security and node events</p>
              </div>
              <button
                onClick={() => setIsViewAllActivityOpen(false)}
                className="size-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {systemActivities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => {
                    setSelectedActivity(act);
                  }}
                  className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 hover:bg-stone-100/90 cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`size-2 rounded-full shrink-0 ${
                          act.severity === 'success'
                            ? 'bg-emerald-500'
                            : act.severity === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-blue-500'
                        }`}
                      />
                      <strong className="text-stone-900 font-semibold">{act.title}</strong>
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono">{act.timestamp}</span>
                  </div>
                  <p className="text-xs text-stone-600 pl-4 leading-relaxed">{act.detail}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 pl-4 pt-1">
                    <span>Actor: {act.actor}</span>
                    <span className="capitalize">{act.severity} priority</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-stone-100 shrink-0 text-xs">
              <span className="text-stone-400 font-mono text-[11px]">{systemActivities.length} total logged events</span>
              <button
                onClick={() => setIsViewAllActivityOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white font-semibold cursor-pointer hover:bg-black transition"
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ACTIVITY DETAIL MODAL */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  ACTIVITY DETAIL
                </span>
                <h3 className="text-base font-bold text-slate-900">{selectedActivity.title}</h3>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Actor</span>
                <strong className="text-slate-900">{selectedActivity.actor}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Timestamp</span>
                <span className="font-mono text-slate-600">{selectedActivity.timestamp}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-400 block mb-1">Details</span>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedActivity.detail}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedActivity(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ARTISANAL EMBLEM GENERATOR / SELECTOR */}
      {selectedClientForLogoModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="size-3 text-amber-500" />
                  <span>BRAND EMBLEM GENERATOR</span>
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Artisanal Emblem for {selectedClientForLogoModal.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Select a bespoke vector motif tailored for specialty cafes and tea houses.
                </p>
              </div>
              <button
                onClick={() => setSelectedClientForLogoModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {ARTISANAL_CAFE_LOGOS.map((emblem) => {
                const isSelected = getCafeLogo(selectedClientForLogoModal.id) === emblem.svgDataUri;
                return (
                  <button
                    key={emblem.id}
                    onClick={() => {
                      updateCafeLogo(selectedClientForLogoModal.id, emblem.svgDataUri);
                      setSelectedClientForLogoModal(null);
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-center gap-3 text-left ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="size-12 rounded-xl overflow-hidden shadow-2xs shrink-0 p-0.5 border border-slate-100">
                      <img src={emblem.svgDataUri} alt={emblem.name} className="size-full object-cover rounded-lg" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <strong className="text-xs font-bold text-slate-900 block truncate">{emblem.name}</strong>
                        {isSelected && <Check className="size-3.5 text-emerald-600 shrink-0" />}
                      </div>
                      <span className="text-[10px] text-amber-700 font-medium block">{emblem.motif}</span>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{emblem.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
              <span>Vector SVGs automatically scale crisp across all devices.</span>
              <button
                onClick={() => setSelectedClientForLogoModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
