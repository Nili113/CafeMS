import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  LayoutGrid,
  Coffee,
  MessageSquare,
  LogOut,
  HelpCircle,
  Bell,
  Search,
  Plus,
  QrCode,
  Download,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  Clock,
  Star,
  CheckCircle2,
  AlertCircle,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  Edit2,
  Trash2,
  ArrowUpRight,
  Mail,
  FileText,
  DollarSign,
  Users,
  ShieldAlert,
  Palette,
  ChefHat,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Inbox,
  Archive,
  Wifi,
  WifiOff,
  Smartphone,
  Laptop,
  ShieldCheck,
  Menu,
  RotateCcw,
  CreditCard,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useCafeData } from '../../context/CafeDataContext';
import { Table, MenuItem, TableStatus, MenuCategory, TableAlert, CafeTheme, OrderStatus } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { NivoPacingChart } from '../../components/charts/NivoPacingChart';
import { ARTISANAL_CAFE_LOGOS } from '../../lib/logos';

export const CafeClientApp: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    logout,
    cafeTheme,
    setCafeTheme,
    tables,
    updateTableStatus,
    menuItems,
    toggleMenuItemAvailability,
    updateMenuItem,
    addMenuItem,
    deleteMenuItem,
    orders,
    updateOrderStatus,
    tableAlerts,
    acknowledgeAlert,
    resolveAlert,
    feedbacks,
    isNetworkVerificationEnabled,
    toggleNetworkVerification,
    cafeWifiSsid,
    lanHost,
    setLanHost,
    showToast,
    updateCafeLogo,
    resetCafeLogo,
    getCafeLogo,
  } = useCafeData();

  // QR Modal configuration: Smartphone (Wi-Fi LAN) vs Laptop (Localhost)
  const [qrHostMode, setQrHostMode] = useState<'lan' | 'local'>('lan');
  const [isEditingLanIp, setIsEditingLanIp] = useState(false);
  const [customLanInput, setCustomLanInput] = useState('');

  // Service pacing chart telemetry state
  const [pacingTimeRange, setPacingTimeRange] = useState<'today' | '7days' | '30days'>('today');
  const [hoveredPacingPoint, setHoveredPacingPoint] = useState<{ label: string; amount: string; orders: number } | null>(null);

  // Dynamic theme styling matching the active venue palette
  const clientTheme = {
    terracotta: {
      activeNav: 'bg-[#9A3412] text-white shadow-xs',
      activeSubPill: 'bg-[#7C2D12] text-white',
      primaryBtn: 'bg-[#9A3412] hover:bg-[#7C2D12] text-white',
      activeTab: 'bg-[#9A3412] text-white font-semibold',
      accentColor: '#9A3412',
      accentText: 'text-[#9A3412]',
      accentBg: 'bg-[#9A3412]',
      accentLightBg: 'bg-orange-50',
      accentBorder: 'border-[#9A3412]',
      switchActive: 'bg-[#9A3412]',
      switchText: 'text-orange-900',
      progressBarActive: 'bg-[#9A3412]',
      logoBg: 'bg-[#9A3412]',
      bannerBg: 'bg-orange-50',
      bannerBorder: 'border-orange-200',
      bannerText: 'text-orange-950',
      bannerPing: 'bg-[#9A3412]',
      bannerIcon: 'text-[#9A3412]',
      bannerAckBtn: 'bg-orange-100 hover:bg-orange-200 text-orange-900',
      bannerResolveBtn: 'bg-[#9A3412] hover:bg-[#7C2D12] text-white',
      badgeBg: 'bg-orange-100 text-[#7C2D12]',
    },
    emerald: {
      activeNav: 'bg-[#1B4636] text-white shadow-xs',
      activeSubPill: 'bg-emerald-950/60 text-white',
      primaryBtn: 'bg-[#1B4636] hover:bg-emerald-950 text-white',
      activeTab: 'bg-[#1B4636] text-white font-semibold',
      accentColor: '#1B4636',
      accentText: 'text-[#1B4636]',
      accentBg: 'bg-[#1B4636]',
      accentLightBg: 'bg-emerald-50',
      accentBorder: 'border-[#1B4636]',
      switchActive: 'bg-[#1B4636]',
      switchText: 'text-[#1B4636]',
      progressBarActive: 'bg-[#1B4636]',
      logoBg: 'bg-[#1B4636]',
      bannerBg: 'bg-emerald-50',
      bannerBorder: 'border-emerald-200',
      bannerText: 'text-emerald-950',
      bannerPing: 'bg-[#1B4636]',
      bannerIcon: 'text-[#1B4636]',
      bannerAckBtn: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900',
      bannerResolveBtn: 'bg-[#1B4636] hover:bg-emerald-950 text-white',
      badgeBg: 'bg-emerald-100 text-[#1B4636]',
    },
    amber: {
      activeNav: 'bg-amber-600 text-white shadow-xs',
      activeSubPill: 'bg-amber-700/60 text-white',
      primaryBtn: 'bg-amber-600 hover:bg-amber-700 text-white',
      activeTab: 'bg-amber-600 text-white font-semibold',
      accentColor: '#D97706',
      accentText: 'text-amber-600',
      accentBg: 'bg-amber-600',
      accentLightBg: 'bg-amber-50',
      accentBorder: 'border-amber-600',
      switchActive: 'bg-amber-600',
      switchText: 'text-amber-800',
      progressBarActive: 'bg-amber-600',
      logoBg: 'bg-amber-600',
      bannerBg: 'bg-amber-50',
      bannerBorder: 'border-amber-200',
      bannerText: 'text-amber-950',
      bannerPing: 'bg-amber-500',
      bannerIcon: 'text-amber-600',
      bannerAckBtn: 'bg-amber-100 hover:bg-amber-200 text-amber-900',
      bannerResolveBtn: 'bg-amber-600 hover:bg-amber-700 text-white',
      badgeBg: 'bg-amber-100 text-amber-800',
    },
    noir: {
      activeNav: 'bg-stone-900 text-white shadow-xs',
      activeSubPill: 'bg-stone-950/60 text-white',
      primaryBtn: 'bg-stone-900 hover:bg-stone-950 text-white',
      activeTab: 'bg-stone-900 text-white font-semibold',
      accentColor: '#18181B',
      accentText: 'text-stone-900',
      accentBg: 'bg-stone-900',
      accentLightBg: 'bg-stone-100',
      accentBorder: 'border-stone-900',
      switchActive: 'bg-stone-900',
      switchText: 'text-stone-900',
      progressBarActive: 'bg-stone-900',
      logoBg: 'bg-stone-900',
      bannerBg: 'bg-stone-100',
      bannerBorder: 'border-stone-300',
      bannerText: 'text-stone-900',
      bannerPing: 'bg-stone-700',
      bannerIcon: 'text-stone-700',
      bannerAckBtn: 'bg-stone-200 hover:bg-stone-300 text-stone-900',
      bannerResolveBtn: 'bg-stone-900 hover:bg-black text-white',
      badgeBg: 'bg-stone-200 text-stone-900',
    },
  }[cafeTheme || 'terracotta'];

  // Collapsible sidebar state & Mobile Drawer state
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

  // Profile popover state
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Navigation section: 'dashboard' | 'tables' | 'menu' | 'kitchen' | 'feedback' | 'theming'
  const [activeSection, setActiveSection] = useState<'dashboard' | 'tables' | 'menu' | 'kitchen' | 'feedback' | 'theming'>('dashboard');

  // Modals
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [selectedTableForQr, setSelectedTableForQr] = useState<Table | null>(null);
  const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);

  // Filters and search
  const [tableSearch, setTableSearch] = useState('');
  const [tableStatusFilter, setTableStatusFilter] = useState<'All' | TableStatus>('All');
  const [menuSearch, setMenuSearch] = useState('');
  const [menuAvailabilityFilter, setMenuAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string>('All');
  const [feedbackRatingFilter, setFeedbackRatingFilter] = useState<number | 'all'>('all');

  // Menu item form state
  const [menuFormName, setMenuFormName] = useState('');
  const [menuFormDesc, setMenuFormDesc] = useState('');
  const [menuFormCategory, setMenuFormCategory] = useState<MenuCategory>('Chiya & Teas');
  const [menuFormPrice, setMenuFormPrice] = useState(160);
  const [menuFormImage, setMenuFormImage] = useState('/images/chiya_matka.jpg');
  const [menuFormAvailable, setMenuFormAvailable] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active unhandled alerts from dining guests
  const activeAlerts = tableAlerts.filter((a) => a.status === 'Active');

  // Occupancy metrics
  const totalTables = tables.length;
  const occupiedTables = tables.filter((t) => t.status === 'Occupied').length;
  const availableTables = tables.filter((t) => t.status === 'Available').length;
  const reservedTables = tables.filter((t) => t.status === 'Reserved').length;
  const occupancyRate = totalTables > 0 ? Math.round((occupiedTables / totalTables) * 100) : 0;

  // Filtered tables
  const filteredTables = tables.filter((table) => {
    const matchesSearch = table.number.toString().includes(tableSearch);
    const matchesStatus = tableStatusFilter === 'All' || table.status === tableStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered menu items
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesAvailability =
      menuAvailabilityFilter === 'all' ||
      (menuAvailabilityFilter === 'available' && item.isAvailable) ||
      (menuAvailabilityFilter === 'unavailable' && !item.isAvailable);
    const matchesCategory = menuCategoryFilter === 'All' || item.category === menuCategoryFilter;
    return matchesSearch && matchesAvailability && matchesCategory;
  });

  // Filtered feedbacks
  const filteredFeedbacks = feedbacks.filter((f) => {
    if (feedbackRatingFilter === 'all') return true;
    return f.rating === feedbackRatingFilter;
  });

  // Average feedback rating calculation
  const totalFeedbackCount = feedbacks.length;
  const avgRating =
    totalFeedbackCount > 0
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedbackCount).toFixed(1)
      : '4.8';

  // Handle local image upload for menu item
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size exceeds 5MB limit', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMenuFormImage(event.target.result as string);
          showToast('Image uploaded successfully', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddMenuItem = () => {
    setEditingMenuItem(null);
    setMenuFormName('');
    setMenuFormDesc('');
    setMenuFormCategory('Chiya & Teas');
    setMenuFormPrice(160);
    setMenuFormImage('/images/chiya_matka.jpg');
    setMenuFormAvailable(true);
    setIsMenuItemModalOpen(true);
  };

  const handleOpenEditMenuItem = (item: MenuItem) => {
    setEditingMenuItem(item);
    setMenuFormName(item.name);
    setMenuFormDesc(item.description);
    setMenuFormCategory(item.category);
    setMenuFormPrice(item.price);
    setMenuFormImage(item.image);
    setMenuFormAvailable(item.isAvailable);
    setIsMenuItemModalOpen(true);
  };

  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuFormName.trim()) {
      showToast('Please enter item name', 'warning');
      return;
    }
    if (editingMenuItem) {
      await updateMenuItem({
        ...editingMenuItem,
        name: menuFormName,
        description: menuFormDesc,
        category: menuFormCategory,
        price: Number(menuFormPrice),
        image: menuFormImage,
        isAvailable: menuFormAvailable,
      });
      showToast('Menu item updated', 'success');
    } else {
      await addMenuItem({
        name: menuFormName,
        description: menuFormDesc,
        category: menuFormCategory,
        price: Number(menuFormPrice),
        image: menuFormImage,
        isAvailable: menuFormAvailable,
        preparationTimeMinutes: 5,
        tags: ['Specialty'],
      });
      showToast('New menu item registered', 'success');
    }
    setIsMenuItemModalOpen(false);
  };

  // Redirect unauthenticated visitors to unified login page
  if (!currentUser || currentUser.role !== 'cafe_client') {
    return <Navigate to="/login" replace />;
  }

  // ----------------------------------------------------
  // MAIN APP SHELL WITH SENIOR-GRADE LEFT SIDEBAR
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex font-sans antialiased">
      {/* MOBILE DRAWER BACKDROP (md:hidden) */}
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
              <div className={`size-9 rounded-xl ${clientTheme.logoBg} text-white font-bold text-xs flex items-center justify-center shadow-xs border border-black/5 overflow-hidden p-0.5`}>
                <img
                  src={getCafeLogo('c-1')}
                  alt="Cafe Logo"
                  className="size-full object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <span className="font-black text-base text-stone-900 tracking-tight">Cafe XYZ</span>
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
              MANAGEMENT
            </span>

            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, count: null },
              { id: 'tables', label: 'Tables & Floor', icon: Coffee, count: totalTables },
              { id: 'menu', label: 'Menu catalog', icon: UtensilsCrossed, count: menuItems.length },
              { id: 'kitchen', label: 'Kitchen & Alerts', icon: Bell, count: activeAlerts.length, isAlert: true },
              { id: 'feedback', label: 'Guest feedback', icon: MessageSquare, count: `${avgRating}★` },
              { id: 'theming', label: 'Brand & theming', icon: Palette, count: cafeTheme },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id as any);
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? clientTheme.activeNav
                      : 'text-stone-600 hover:bg-stone-100/80 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="size-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                        isActive
                          ? clientTheme.activeSubPill
                          : item.isAlert && activeAlerts.length > 0
                          ? 'bg-red-500 text-white'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Drawer Footer */}
        <div className="p-3 border-t border-stone-100 bg-white space-y-1">
          <button
            onClick={() => {
              setIsMobileDrawerOpen(false);
              setIsHelpModalOpen(true);
            }}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-stone-100/80 text-stone-600 transition cursor-pointer text-xs"
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="size-4 text-stone-400" />
              <span>Need a Hand</span>
            </div>
            <ChevronRight className="size-3.5 text-stone-400" />
          </button>
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

      {/* 1. COLLAPSIBLE DESKTOP/TABLET SIDEBAR (Hidden on mobile phones) */}
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
                className={`size-11 rounded-2xl ${clientTheme.logoBg} hover:opacity-90 text-white font-extrabold text-sm flex items-center justify-center shadow-xs cursor-pointer transition-all duration-200 group`}
                aria-label="Expand sidebar"
              >
                <UtensilsCrossed className="size-5 group-hover:hidden" />
                <PanelLeftOpen className="size-5 hidden group-hover:block transition-all" />
              </button>
            </div>
          ) : (
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`size-9 rounded-xl ${clientTheme.logoBg} text-white font-bold text-xs flex items-center justify-center shadow-xs border border-black/5 overflow-hidden p-0.5`}>
                  <img
                    src={getCafeLogo('c-1')}
                    alt="Cafe Logo"
                    className="size-full object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <span className="font-black text-base text-stone-900 tracking-tight">Cafe XYZ</span>
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

          {/* Operations Navigation Links */}
          <nav className="p-2 space-y-1.5">
            {!isSidebarCollapsed && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 px-3 py-1 block font-semibold">
                MANAGEMENT
              </span>
            )}

            {/* Dashboard */}
            <div className="relative group">
              <button
                onClick={() => setActiveSection('dashboard')}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center size-11 mx-auto rounded-2xl' : 'justify-between px-3 py-2 rounded-xl text-xs font-semibold'
                } transition cursor-pointer ${
                  activeSection === 'dashboard'
                    ? clientTheme.activeNav
                    : 'text-stone-600 hover:bg-stone-100/80 hover:text-stone-900'
                }`}
                title={isSidebarCollapsed ? undefined : 'Dashboard'}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutGrid className={`${isSidebarCollapsed ? 'size-5' : 'size-4'} shrink-0`} />
                  {!isSidebarCollapsed && <span>Dashboard</span>}
                </div>
              </button>
              {isSidebarCollapsed && (
                <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-stone-900 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 border border-stone-800">
                  Dashboard
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-stone-900" />
                </div>
              )}
            </div>

            {/* Tables & Floor */}
            <div className="relative group">
              <button
                onClick={() => setActiveSection('tables')}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center size-11 mx-auto rounded-2xl relative' : 'justify-between px-3 py-2 rounded-xl text-xs font-semibold'
                } transition cursor-pointer ${
                  activeSection === 'tables'
                    ? clientTheme.activeNav
                    : 'text-stone-600 hover:bg-stone-100/80 hover:text-stone-900'
                }`}
                title={isSidebarCollapsed ? undefined : 'Tables & Floor'}
              >
                <div className="flex items-center gap-2.5">
                  <Coffee className={`${isSidebarCollapsed ? 'size-5' : 'size-4'} shrink-0`} />
                  {!isSidebarCollapsed && <span>Tables & Floor</span>}
                </div>
                {!isSidebarCollapsed ? (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                      activeSection === 'tables' ? clientTheme.activeSubPill : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {totalTables}
                  </span>
                ) : (
                  <span className="absolute -top-1 -right-1 size-4 bg-stone-700 text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    {totalTables}
                  </span>
                )}
              </button>
              {isSidebarCollapsed && (
                <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-stone-900 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 border border-stone-800">
                  Tables & Floor ({totalTables})
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-stone-900" />
                </div>
              )}
            </div>

            {/* Menu catalog */}
            <div className="relative group">
              <button
                onClick={() => setActiveSection('menu')}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center size-11 mx-auto rounded-2xl relative' : 'justify-between px-3 py-2 rounded-xl text-xs font-semibold'
                } transition cursor-pointer ${
                  activeSection === 'menu'
                    ? clientTheme.activeNav
                    : 'text-stone-600 hover:bg-stone-100/80 hover:text-stone-900'
                }`}
                title={isSidebarCollapsed ? undefined : 'Menu & Availability'}
              >
                <div className="flex items-center gap-2.5">
                  <UtensilsCrossed className={`${isSidebarCollapsed ? 'size-5' : 'size-4'} shrink-0`} />
                  {!isSidebarCollapsed && <span>Menu catalog</span>}
                </div>
                {!isSidebarCollapsed ? (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                      activeSection === 'menu' ? clientTheme.activeSubPill : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {menuItems.length}
                  </span>
                ) : (
                  <span className="absolute -top-1 -right-1 size-4 bg-stone-700 text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    {menuItems.length}
                  </span>
                )}
              </button>
              {isSidebarCollapsed && (
                <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-stone-900 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 border border-stone-800">
                  Menu catalog ({menuItems.length})
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-stone-900" />
                </div>
              )}
            </div>

            {/* Kitchen & Alerts */}
            <div className="relative group">
              <button
                onClick={() => setActiveSection('kitchen')}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center size-11 mx-auto rounded-2xl relative' : 'justify-between px-3 py-2 rounded-xl text-xs font-semibold'
                } transition cursor-pointer ${
                  activeSection === 'kitchen'
                    ? clientTheme.activeNav
                    : 'text-stone-600 hover:bg-stone-100/80 hover:text-stone-900'
                }`}
                title={isSidebarCollapsed ? undefined : 'Kitchen & Live Alerts'}
              >
                <div className="flex items-center gap-2.5">
                  <Bell className={`${isSidebarCollapsed ? 'size-5' : 'size-4'} shrink-0`} />
                  {!isSidebarCollapsed && <span>Kitchen & Alerts</span>}
                </div>
                {activeAlerts.length > 0 && !isSidebarCollapsed && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-rose-500 text-white animate-pulse">
                    {activeAlerts.length}
                  </span>
                )}
                {activeAlerts.length > 0 && isSidebarCollapsed && (
                  <span className="absolute -top-1 -right-1 size-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                    {activeAlerts.length}
                  </span>
                )}
              </button>
              {isSidebarCollapsed && (
                <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-stone-900 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 border border-stone-800">
                  Kitchen & Alerts {activeAlerts.length > 0 && `(${activeAlerts.length})`}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-stone-900" />
                </div>
              )}
            </div>

            {/* Guest Feedback */}
            <div className="relative group">
              <button
                onClick={() => setActiveSection('feedback')}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center size-11 mx-auto rounded-2xl relative' : 'justify-between px-3 py-2 rounded-xl text-xs font-semibold'
                } transition cursor-pointer ${
                  activeSection === 'feedback'
                    ? clientTheme.activeNav
                    : 'text-stone-600 hover:bg-stone-100/80 hover:text-stone-900'
                }`}
                title={isSidebarCollapsed ? undefined : 'Guest Feedback'}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className={`${isSidebarCollapsed ? 'size-5' : 'size-4'} shrink-0`} />
                  {!isSidebarCollapsed && <span>Guest feedback</span>}
                </div>
                {!isSidebarCollapsed && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                      activeSection === 'feedback'
                        ? clientTheme.activeSubPill
                        : clientTheme.badgeBg
                    }`}
                  >
                    {avgRating}★
                  </span>
                )}
              </button>
              {isSidebarCollapsed && (
                <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-stone-900 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 border border-stone-800">
                  Guest feedback ({avgRating}★)
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-stone-900" />
                </div>
              )}
            </div>

            {/* Brand & Theming */}
            <div className="relative group">
              <button
                onClick={() => setActiveSection('theming')}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center size-11 mx-auto rounded-2xl relative' : 'justify-between px-3 py-2 rounded-xl text-xs font-semibold'
                } transition cursor-pointer ${
                  activeSection === 'theming'
                    ? clientTheme.activeNav
                    : 'text-stone-600 hover:bg-stone-100/80 hover:text-stone-900'
                }`}
                title={isSidebarCollapsed ? undefined : 'Brand & Theming'}
              >
                <div className="flex items-center gap-2.5">
                  <Palette className={`${isSidebarCollapsed ? 'size-5' : 'size-4'} shrink-0`} />
                  {!isSidebarCollapsed && <span>Brand & theming</span>}
                </div>
                {!isSidebarCollapsed && (
                  <span className="text-[10px] capitalize font-mono text-stone-400">
                    {cafeTheme}
                  </span>
                )}
              </button>
              {isSidebarCollapsed && (
                <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-stone-900 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 border border-stone-800">
                  Theme ({cafeTheme})
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-stone-900" />
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Sidebar Footer: Need a Hand & Log out */}
        <div className="p-2.5 border-t border-stone-100 bg-white space-y-1.5">
          <div className="relative group">
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className={`w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center size-11 mx-auto rounded-2xl' : 'justify-between p-2 rounded-xl'
              } hover:bg-stone-100/80 text-stone-600 transition cursor-pointer`}
              title={isSidebarCollapsed ? undefined : 'Need a Hand'}
            >
              <div className="flex items-center gap-2">
                <HelpCircle className={`${isSidebarCollapsed ? 'size-5' : 'size-4'} text-stone-400 shrink-0`} />
                {!isSidebarCollapsed && <span className="text-xs font-medium">Need a Hand</span>}
              </div>
              {!isSidebarCollapsed && <ChevronRight className="size-3.5 text-stone-400" />}
            </button>
            {isSidebarCollapsed && (
              <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-stone-900 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 border border-stone-800">
                Need a Hand
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-stone-900" />
              </div>
            )}
          </div>

          <div className="relative group">
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className={`w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center size-11 mx-auto rounded-2xl' : 'justify-start gap-2 p-2 rounded-xl text-xs'
              } font-semibold text-stone-600 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer`}
              title={isSidebarCollapsed ? undefined : 'Log out'}
            >
              <LogOut className={`${isSidebarCollapsed ? 'size-5' : 'size-4'} text-stone-400 shrink-0 group-hover:text-rose-600`} />
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

      {/* 2. MAIN WORKSPACE CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-3 sm:px-6 h-14 sticky top-0 z-30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-medium min-w-0">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="p-1.5 -ml-1 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 md:hidden cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="size-5" />
            </button>
            <span className="font-bold text-stone-900 truncate">Cafe XYZ</span>
            <span className="text-stone-300">/</span>
            <span className="text-stone-500 capitalize truncate">
              {activeSection === 'dashboard' ? 'Overview & Live Metrics' : activeSection}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Live Alerts Bell */}
            <button
              onClick={() => setActiveSection('kitchen')}
              className="size-9 rounded-xl border border-stone-200 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition cursor-pointer relative"
              title="Table Alerts"
            >
              <Bell className="size-4" />
              {activeAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 size-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {activeAlerts.length}
                </span>
              )}
            </button>

            {/* User Profile with interactive popover */}
            <div className="relative pl-2 border-l border-stone-200">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-stone-50 transition cursor-pointer text-left"
              >
                <div
                  style={{ backgroundColor: clientTheme.accentColor }}
                  className="size-8 rounded-full text-white font-bold text-xs flex items-center justify-center font-mono shadow-xs"
                >
                  AM
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-stone-900 leading-tight">Alex Morgan</div>
                  <div className="text-[10px] text-stone-400">Venue Manager</div>
                </div>
                <ChevronDown className="size-3 text-stone-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown Popover */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-fadeIn">
                  <div className="p-3 border-b border-stone-100">
                    <div className="text-xs font-bold text-stone-900">Alex Morgan</div>
                    <div className="text-[11px] font-mono text-stone-500">manager@cafexyz.com</div>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-stone-50 text-stone-700 text-[10px] font-medium border border-stone-200">
                      <span className="size-1.5 rounded-full" style={{ backgroundColor: clientTheme.accentColor }} />
                      <span>Cafe XYZ Flagship • Manager</span>
                    </div>
                  </div>

                  <div className="p-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        window.open('/table/4', '_blank');
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition cursor-pointer"
                    >
                      <span>Preview Customer Dining App</span>
                      <ExternalLink className="size-3.5 text-stone-400" />
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setActiveSection('theming');
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition cursor-pointer"
                    >
                      <span>Theme Customization</span>
                      <Palette className="size-3.5 text-stone-400" />
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
          </div>
        </header>

        {/* Live Guest Request Alert Banner (Theme adaptive - zero hardcoding) */}
        {activeAlerts.length > 0 && (
          <div className={`${clientTheme.bannerBg} border-b ${clientTheme.bannerBorder} px-4 sm:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-fadeIn transition-colors`}>
            <div className={`flex items-center gap-2.5 text-xs ${clientTheme.bannerText}`}>
              <span className={`size-2 rounded-full ${clientTheme.bannerPing} animate-ping shrink-0`} />
              <ShieldAlert className={`size-4 ${clientTheme.bannerIcon} shrink-0`} />
              <span className="font-semibold">
                Table {activeAlerts[0].tableNumber} is requesting: {activeAlerts[0].type}
              </span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={() => {
                  acknowledgeAlert(activeAlerts[0].id);
                  showToast(`Acknowledged alert for Table ${activeAlerts[0].tableNumber}`, 'info');
                }}
                className={`px-3 py-1 ${clientTheme.bannerAckBtn} rounded-lg text-xs font-semibold transition cursor-pointer`}
              >
                Acknowledge
              </button>
              <button
                onClick={() => {
                  resolveAlert(activeAlerts[0].id);
                  showToast(`Resolved request for Table ${activeAlerts[0].tableNumber}`, 'success');
                }}
                className={`px-3.5 py-1 ${clientTheme.bannerResolveBtn} rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs`}
              >
                Mark Resolved
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area: Responsive dynamic padding matching SuperAdmin */}
        <main className="p-4 sm:p-5 lg:p-6 max-w-6xl w-full mx-auto space-y-6 flex-1">
          {/* ======================================================== */}
          {/* SECTION 1: DASHBOARD */}
          {/* ======================================================== */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-stone-900">
                    Good morning, Alex
                  </h1>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Live operational telemetry for Cafe XYZ • Jhamsikhel
                  </p>
                </div>
                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                  <button
                    onClick={() => setActiveSection('theming')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-stone-200 hover:bg-stone-50 text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
                  >
                    <Palette className="size-3.5 text-stone-500" />
                    <span className="capitalize">{cafeTheme} Theme</span>
                  </button>
                  <button
                    onClick={handleOpenAddMenuItem}
                    className={`inline-flex items-center gap-2 px-4 py-2 ${clientTheme.primaryBtn} text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer`}
                  >
                    <Plus className="size-4" />
                    <span>Add menu item</span>
                  </button>
                </div>
              </div>

              {/* 4 Stats Cards matching Super Admin's bold, clean typography */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <button
                  onClick={() => setIsRevenueModalOpen(true)}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-stone-300 hover:shadow-xs transition text-left cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                    <span className="font-medium">Today's revenue</span>
                    <TrendingUp className="size-4" style={{ color: clientTheme.accentColor }} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                    रु. 2,480.50
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
                    <span>↑ 12.8% vs yesterday</span>
                  </div>
                </button>

                <button
                  onClick={() => setIsOrdersModalOpen(true)}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-stone-300 hover:shadow-xs transition text-left cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                    <span className="font-medium">Orders today</span>
                    <Coffee className="size-4" style={{ color: clientTheme.accentColor }} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                    86
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
                    <span>↑ 8.4% vs yesterday</span>
                  </div>
                </button>

                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                    <span className="font-medium">Table occupancy</span>
                    <Users className="size-4" style={{ color: clientTheme.accentColor }} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                    {occupancyRate}%
                    <span className="text-xs sm:text-sm font-normal text-stone-400 ml-1.5 font-sans">
                      ({occupiedTables}/{tables.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
                    <span>{availableTables} tables available</span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                    <span className="font-medium">Guest rating</span>
                    <Star className="size-4 fill-amber-400 text-amber-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-1.5">
                    <span>{avgRating}</span>
                    <span className="text-amber-500 text-xl sm:text-2xl font-normal">★</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
                    <span>↑ 0.3 vs last week • 128 reviews</span>
                  </div>
                </div>
              </div>

              {/* Service Pacing & Dining Velocity React Chart matching Super Admin */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-stone-900">Dining Volume & Velocity Pacing</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Peak: 6:00 PM – 8:00 PM
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Hourly guest volume, ticket pacing, and revenue telemetry over time
                    </p>
                  </div>

                  {/* Interactive Range Switcher */}
                  <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold text-stone-600 self-start sm:self-auto">
                    {(['today', '7days', '30days'] as const).map((rng) => (
                      <button
                        key={rng}
                        onClick={() => {
                          setPacingTimeRange(rng);
                          setHoveredPacingPoint(null);
                        }}
                        className={`px-3 py-1 rounded-lg transition cursor-pointer capitalize ${
                          pacingTimeRange === rng
                            ? 'bg-white text-stone-900 shadow-2xs font-bold'
                            : 'hover:text-stone-900 text-stone-500'
                        }`}
                      >
                        {rng === 'today' ? 'Today' : rng === '7days' ? '7 Days' : '30 Days'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nivo Powered Responsive Area Spline Chart */}
                <div className="relative pt-1 pb-1">
                  <NivoPacingChart
                    timeRange={pacingTimeRange}
                    accentColor={clientTheme.accentColor}
                  />
                </div>

                {/* Operations Telemetry Sub-cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60">
                    <span className="text-[10px] font-mono uppercase text-stone-400 block font-semibold">
                      AVG TABLE TURN TIME
                    </span>
                    <div className="text-sm font-bold font-mono text-stone-900 mt-0.5">
                      34 minutes
                    </div>
                    <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Optimal seat utilization</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60">
                    <span className="text-[10px] font-mono uppercase text-stone-400 block font-semibold">
                      QR SCAN-TO-ORDER SPEED
                    </span>
                    <div className="text-sm font-bold font-mono text-stone-900 mt-0.5">
                      2.4 mins
                    </div>
                    <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Zero ordering friction</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60">
                    <span className="text-[10px] font-mono uppercase text-stone-400 block font-semibold">
                      FONEPAY SUCCESS RATE
                    </span>
                    <div className="text-sm font-bold font-mono text-stone-900 mt-0.5">
                      100.0%
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">Instant QR gateway settlement</p>
                  </div>
                </div>
              </div>

              {/* Live Floor Station Matrix (Visual 12-Table Quick View) */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold">
                      STATION TELEMETRY
                    </span>
                    <h2 className="text-base font-bold text-stone-900">
                      Live Dining Table Stations ({totalTables} tables)
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveSection('tables')}
                    className={`text-xs font-semibold ${clientTheme.accentText} hover:opacity-80 flex items-center gap-1 cursor-pointer`}
                  >
                    Manage tables & QR codes →
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {tables.map((t) => {
                    const isOccupied = t.status === 'Occupied';
                    const isReserved = t.status === 'Reserved';
                    const hasAlert = activeAlerts.some((a) => a.tableNumber === t.number);

                    return (
                      <div
                        key={t.id}
                        onClick={() => {
                          setSelectedTableForQr(t);
                          setActiveSection('tables');
                        }}
                        className={`p-3 rounded-xl border transition cursor-pointer relative ${
                          hasAlert
                            ? `${clientTheme.bannerBg} ${clientTheme.bannerBorder} ring-2 ring-amber-400/40`
                            : isOccupied
                            ? 'bg-stone-50/90 border-stone-200 hover:border-stone-400'
                            : isReserved
                            ? 'bg-purple-50/50 border-purple-200/70 hover:border-purple-300'
                            : 'bg-white border-stone-200/70 hover:border-emerald-400'
                        }`}
                      >
                        {hasAlert && (
                          <span className="absolute -top-1.5 -right-1.5 size-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                            !
                          </span>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-stone-900 font-mono">
                            T-{t.number < 10 ? `0${t.number}` : t.number}
                          </span>
                          <span
                            className={`size-2 rounded-full ${
                              isOccupied
                                ? 'bg-orange-500'
                                : isReserved
                                ? 'bg-purple-500'
                                : 'bg-emerald-500'
                            }`}
                          />
                        </div>
                        <div className="mt-2 text-[11px] text-stone-500 flex items-center justify-between">
                          <span>{t.capacity} seats</span>
                          <span
                            className={`font-semibold capitalize text-[10px] ${
                              isOccupied
                                ? 'text-orange-700'
                                : isReserved
                                ? 'text-purple-700'
                                : 'text-emerald-700'
                            }`}
                          >
                            {t.status}
                          </span>
                        </div>
                        {isOccupied && (
                          <div className="mt-1 pt-1 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-600 font-mono">
                            <span>Active</span>
                            <span className="font-bold">Rs. 1,420</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2-Column Overview: Floor Occupancy & Guest Feedback */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block font-semibold">
                          FLOOR STATUS
                        </span>
                        <h2 className="text-base font-bold text-stone-900">Table Occupancy</h2>
                      </div>
                      <button
                        onClick={() => setActiveSection('tables')}
                        className={`text-xs font-semibold ${clientTheme.accentText} hover:opacity-80 flex items-center gap-1 cursor-pointer`}
                      >
                        Floor plan <ChevronRight className="size-3" />
                      </button>
                    </div>

                    <div className="flex items-center justify-around py-4">
                      <div className="size-32 rounded-full border-8 border-orange-500 border-t-emerald-500 border-l-purple-500 flex flex-col items-center justify-center bg-stone-50">
                        <span className="text-2xl font-bold font-mono text-stone-900 leading-none">
                          {totalTables}
                        </span>
                        <span className="text-[10px] text-stone-400 uppercase font-mono mt-1">tables</span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="size-3 rounded-full bg-orange-500" />
                          <span className="text-xs text-stone-600 w-20">Occupied</span>
                          <span className="text-xs font-bold font-mono text-stone-900">{occupiedTables}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="size-3 rounded-full bg-emerald-500" />
                          <span className="text-xs text-stone-600 w-20">Available</span>
                          <span className="text-xs font-bold font-mono text-stone-900">{availableTables}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="size-3 rounded-full bg-purple-500" />
                          <span className="text-xs text-stone-600 w-20">Reserved</span>
                          <span className="text-xs font-bold font-mono text-stone-900">{reservedTables}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live floor sync
                    </span>
                    <span className="font-mono">12 active stations</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block font-semibold">
                          GUEST SATISFACTION
                        </span>
                        <h2 className="text-base font-bold text-stone-900">Recent Feedback</h2>
                      </div>
                      <button
                        onClick={() => setActiveSection('feedback')}
                        className={`text-xs font-semibold ${clientTheme.accentText} hover:opacity-80 flex items-center gap-1 cursor-pointer`}
                      >
                        All reviews <ChevronRight className="size-3" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="size-6 rounded-full bg-stone-200 text-stone-800 text-[10px] font-bold flex items-center justify-center font-mono">
                              SA
                            </span>
                            <span className="text-xs font-bold text-stone-900">Samir A.</span>
                            <span className="text-[11px] text-stone-400 font-mono">Table 04 • 1h ago</span>
                          </div>
                          <div className="text-amber-500 text-xs tracking-wider">★★★★★</div>
                        </div>
                        <p className="text-xs text-stone-600 italic">
                          "The authentic Matka Chiya has incredible aromatic spice. QR ordering was blazing fast!"
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="size-6 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center font-mono">
                              AS
                            </span>
                            <span className="text-xs font-bold text-stone-900">Ananya S.</span>
                            <span className="text-[11px] text-stone-400 font-mono">Table 01 • 2h ago</span>
                          </div>
                          <div className="text-amber-500 text-xs tracking-wider">★★★★★</div>
                        </div>
                        <p className="text-xs text-stone-600 italic">
                          "Almond croissant is genuinely French-bakery standard. Love the warm ambient atmosphere."
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 text-xs text-stone-400 flex items-center justify-between">
                    <span>Average satisfaction score</span>
                    <span className="font-bold font-mono text-stone-800">96.4%</span>
                  </div>
                </div>
              </div>

              {/* Top Performing Artisanal Items Breakdown */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold">
                      MENU PERFORMANCE
                    </span>
                    <h2 className="text-base font-bold text-stone-900">
                      Top Selling Artisanal Items Today
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveSection('menu')}
                    className={`text-xs font-semibold ${clientTheme.accentText} hover:opacity-80 flex items-center gap-1 cursor-pointer`}
                  >
                    View menu catalog →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {[
                    { name: 'Himalayan Matka Chiya', category: 'Chiya & Tea', orders: 42, rev: 'Rs. 5,040', pct: '88%' },
                    { name: 'Organic Highland Arabica Pour-over', category: 'Coffee & Brews', orders: 31, rev: 'Rs. 7,750', pct: '65%' },
                    { name: 'Artisan Almond Croissant', category: 'Bakery & Pastries', orders: 26, rev: 'Rs. 7,280', pct: '54%' },
                    { name: 'Avocado & Poached Egg Sourdough', category: 'Brunch & Savory', orders: 19, rev: 'Rs. 7,980', pct: '40%' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-stone-900">{item.name}</h4>
                          <span className="text-[10px] text-stone-400 font-mono">{item.category}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-extrabold font-mono text-stone-900">{item.rev}</span>
                          <span className="text-[10px] text-stone-500 font-mono block">{item.orders} orders</span>
                        </div>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${clientTheme.progressBarActive}`}
                          style={{ width: item.pct }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 2: TABLES & FLOOR PLAN */}
          {/* ======================================================== */}
          {activeSection === 'tables' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-stone-900">Floor Layout & Tables</h1>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Click any table to generate, inspect, or download its contactless ordering QR code.
                  </p>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200/80 shadow-xs">
                <div className="relative flex-1 max-w-sm">
                  <Search className="size-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="Search table number..."
                    className="w-full pl-9 pr-3.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <button
                    onClick={() => setTableStatusFilter('All')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                      tableStatusFilter === 'All'
                        ? clientTheme.activeTab
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <span>All</span>
                    <span className="font-mono text-[10px] opacity-80">{totalTables}</span>
                  </button>

                  <button
                    onClick={() => setTableStatusFilter('Available')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                      tableStatusFilter === 'Available'
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <span>Available</span>
                    <span className="font-mono text-[10px] opacity-80">{availableTables}</span>
                  </button>

                  <button
                    onClick={() => setTableStatusFilter('Occupied')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                      tableStatusFilter === 'Occupied'
                        ? 'bg-orange-500 text-white font-semibold'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <span className="size-2 rounded-full bg-orange-500" />
                    <span>Occupied</span>
                    <span className="font-mono text-[10px] opacity-80">{occupiedTables}</span>
                  </button>

                  <button
                    onClick={() => setTableStatusFilter('Reserved')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                      tableStatusFilter === 'Reserved'
                        ? 'bg-purple-600 text-white font-semibold'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <span className="size-2 rounded-full bg-purple-500" />
                    <span>Reserved</span>
                    <span className="font-mono text-[10px] opacity-80">{reservedTables}</span>
                  </button>
                </div>
              </div>

              {/* Venue Network & Anti-Fraud Security Banner */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isNetworkVerificationEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {isNetworkVerificationEnabled ? <Wifi className="size-5" /> : <WifiOff className="size-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-stone-900">Venue Network Guard</h4>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                        isNetworkVerificationEnabled
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}>
                        {isNetworkVerificationEnabled ? `Enforcing: ${cafeWifiSsid}` : 'Allow Any Network'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {isNetworkVerificationEnabled
                        ? `Remote orders blocked: Customers must be connected to cafe Wi-Fi (${cafeWifiSsid}) or seated at the table.`
                        : 'Unrestricted mode: Remote testing enabled. Anyone with the table link can dispatch orders.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => toggleNetworkVerification(!isNetworkVerificationEnabled)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border flex items-center gap-1.5 ${
                      isNetworkVerificationEnabled
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
                    }`}
                  >
                    <ShieldCheck className="size-3.5" />
                    <span>{isNetworkVerificationEnabled ? 'Wi-Fi Enforcing: ON' : 'Wi-Fi Enforcing: OFF'}</span>
                  </button>
                </div>
              </div>

              {/* 12 Tables Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredTables.map((table) => {
                  const statusBorderColor =
                    table.status === 'Available'
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : table.status === 'Occupied'
                      ? 'border-orange-300 bg-orange-50/20'
                      : 'border-purple-300 bg-purple-50/20';

                  const statusBadgeColor =
                    table.status === 'Available'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : table.status === 'Occupied'
                      ? 'bg-orange-100 text-orange-800 border-orange-200'
                      : 'bg-purple-100 text-purple-800 border-purple-200';

                  return (
                    <div
                      key={table.id}
                      className={`p-4 rounded-2xl bg-white border ${statusBorderColor} shadow-xs hover:shadow-md transition flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="min-w-10 px-2 h-8 rounded-xl bg-stone-100 text-stone-900 font-bold font-mono text-sm flex items-center justify-center shrink-0 whitespace-nowrap border border-stone-200/60 shadow-2xs">
                              T-{table.number}
                            </span>
                            <span className="text-xs text-stone-400 font-mono whitespace-nowrap">
                              {table.capacity} Seats
                            </span>
                          </div>

                          <div className="relative inline-flex items-center">
                            <select
                              value={table.status}
                              onChange={(e) =>
                                updateTableStatus(table.number, e.target.value as TableStatus)
                              }
                              className={`text-[11px] font-semibold font-mono rounded-lg pl-2.5 pr-6 py-1 border cursor-pointer appearance-none ${statusBadgeColor} focus:outline-none focus:ring-1 focus:ring-stone-400 transition`}
                            >
                              <option value="Available">Available</option>
                              <option value="Occupied">Occupied</option>
                              <option value="Reserved">Reserved</option>
                            </select>
                            <ChevronDown className="size-3 pointer-events-none absolute right-1.5 opacity-60" />
                          </div>
                        </div>

                        <div className="space-y-1.5 my-3 text-xs text-stone-500">
                          {table.status === 'Occupied' && (
                            <div className="flex items-center justify-between text-stone-700 font-medium">
                              <span className="flex items-center gap-1 text-orange-600">
                                <Clock className="size-3" />
                                Active Tab
                              </span>
                              <span className="font-mono text-[11px]">
                                {table.currentTotal ? formatCurrency(table.currentTotal) : 'Active tab'}
                              </span>
                            </div>
                          )}
                          {table.status === 'Available' && (
                            <div className="text-emerald-700 text-[11px] font-medium flex items-center gap-1">
                              <CheckCircle2 className="size-3" />
                              Ready for next guests
                            </div>
                          )}
                          {table.status === 'Reserved' && (
                            <div className="text-purple-700 text-[11px] font-medium flex items-center gap-1">
                              <Clock className="size-3" />
                              Reserved station
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                        <button
                          onClick={() => setSelectedTableForQr(table)}
                          className="flex-1 py-1.5 px-2.5 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <QrCode className="size-3.5 text-stone-500" />
                          <span>Generate QR</span>
                        </button>

                        <a
                          href={`/table/${table.number}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-500 hover:text-stone-900 transition"
                          title="Open guest dining web app for this table"
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 3: MENU & AVAILABILITY (WITH TOGGLE SWITCH) */}
          {/* ======================================================== */}
          {activeSection === 'menu' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-stone-900">Menu Catalog & Availability</h1>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Toggle dish availability in real time. Sold-out dishes immediately dim and lock on customer ordering screens across all tables.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddMenuItem}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 ${clientTheme.primaryBtn} text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto`}
                >
                  <Plus className="size-4" />
                  <span>Add menu item</span>
                </button>
              </div>

              {/* Toolbar */}
              <div className="space-y-3 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="size-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      placeholder="Search dishes or tea brews..."
                      className="w-full pl-9 pr-3.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setMenuAvailabilityFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                        menuAvailabilityFilter === 'all'
                          ? clientTheme.activeTab
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      All items ({menuItems.length})
                    </button>
                    <button
                      onClick={() => setMenuAvailabilityFilter('available')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                        menuAvailabilityFilter === 'available'
                          ? 'bg-emerald-600 text-white font-semibold'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      In Stock ({menuItems.filter((i) => i.isAvailable).length})
                    </button>
                    <button
                      onClick={() => setMenuAvailabilityFilter('unavailable')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                        menuAvailabilityFilter === 'unavailable'
                          ? 'bg-red-600 text-white font-semibold'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      Sold Out ({menuItems.filter((i) => !i.isAvailable).length})
                    </button>
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-stone-100">
                  {['All', 'Chiya & Teas', 'Specialty Coffee', 'Bakery & Bites', 'Mains & Bowls', 'Desserts'].map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setMenuCategoryFilter(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                          menuCategoryFilter === cat
                            ? clientTheme.activeTab
                            : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200/60'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Menu Cards Grid with SENIOR-ENGINEERED TOGGLE SWITCH */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMenuItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between transition ${
                      !item.isAvailable ? 'opacity-70 bg-stone-50/60' : 'hover:border-stone-300 hover:shadow-sm'
                    }`}
                  >
                    <div>
                      {/* Photo Thumbnail */}
                      <div className="w-full h-40 rounded-xl overflow-hidden bg-stone-100 mb-3 border border-stone-200/70 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/images/chiya_matka.jpg';
                          }}
                        />
                        <span className="absolute top-2.5 left-2.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-stone-800 shadow-xs">
                          {item.category}
                        </span>
                        {!item.isAvailable && (
                          <span className="absolute inset-0 bg-stone-900/60 flex items-center justify-center text-xs font-mono font-bold text-white uppercase tracking-wider">
                            Sold Out
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-sm font-bold text-stone-900">{item.name}</h3>
                        <div className="text-sm font-bold font-mono text-stone-900">
                          {formatCurrency(item.price)}
                        </div>
                      </div>

                      <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom bar with INTERACTIVE TOGGLE SWITCH */}
                    <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
                      {/* Linear/iOS Style Toggle Switch */}
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={item.isAvailable}
                          onClick={() => {
                            toggleMenuItemAvailability(item.id);
                            showToast(
                              `${item.name} is now ${!item.isAvailable ? 'Available (In Stock)' : 'Marked as Sold Out'}`,
                              !item.isAvailable ? 'success' : 'warning'
                            );
                          }}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            item.isAvailable ? clientTheme.switchActive : 'bg-stone-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                              item.isAvailable ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span
                          className={`text-xs font-semibold ${
                            item.isAvailable ? clientTheme.switchText : 'text-stone-400'
                          }`}
                        >
                          {item.isAvailable ? 'In Stock' : 'Sold Out'}
                        </span>
                      </div>

                      {/* Edit & Delete Action Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditMenuItem(item)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
                          title="Edit item"
                        >
                          <Edit2 className="size-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${item.name}?`)) {
                              deleteMenuItem(item.id);
                              showToast('Menu item removed', 'info');
                            }
                          }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="Delete item"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 4: KITCHEN & ALERTS */}
          {/* ======================================================== */}
          {activeSection === 'kitchen' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-stone-900">Live Kitchen & Table Alerts</h1>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Real-time guest inquiries dispatched from table QR sessions in the dining room.
                  </p>
                </div>
              </div>

              {/* Active alerts banner cards */}
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Active Dining Inquiries ({activeAlerts.length})
                </h2>
                {activeAlerts.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-white border border-stone-200/80 text-center text-stone-400 text-xs">
                    <CheckCircle2 className="size-8 mx-auto text-emerald-500 mb-2 opacity-60" />
                    All guest inquiries resolved. Floor is running smoothly.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {activeAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-2xl ${clientTheme.bannerBg} border ${clientTheme.bannerBorder} shadow-xs flex flex-col justify-between`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`size-8 rounded-xl ${clientTheme.badgeBg} font-bold font-mono text-xs flex items-center justify-center shadow-2xs`}>
                              T-{alert.tableNumber}
                            </span>
                            <span className={`text-[10px] font-mono ${clientTheme.accentText} bg-white/90 border border-stone-200/60 px-2 py-0.5 rounded-full font-medium`}>
                              {formatDate(alert.timestamp)}
                            </span>
                          </div>
                          <div className={`text-sm font-bold ${clientTheme.bannerText}`}>
                            {alert.type}
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-stone-200/50 flex items-center gap-2">
                          <button
                            onClick={() => {
                              acknowledgeAlert(alert.id);
                              showToast(`Acknowledged Table ${alert.tableNumber}`, 'info');
                            }}
                            className={`flex-1 py-1.5 px-2 ${clientTheme.bannerAckBtn} rounded-lg text-xs font-semibold transition cursor-pointer`}
                          >
                            Acknowledge
                          </button>
                          <button
                            onClick={() => {
                              resolveAlert(alert.id);
                              showToast(`Resolved Table ${alert.tableNumber}`, 'success');
                            }}
                            className={`flex-1 py-1.5 px-2 ${clientTheme.bannerResolveBtn} rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs`}
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Kitchen Tickets List with Themed 4-Stage Progress Bars */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Active Dining Tickets ({orders.filter((o) => o.status !== 'Completed').length})
                  </h2>
                  <span className="text-[11px] font-mono text-stone-400">
                    Live syncing with Table QR sessions
                  </span>
                </div>

                <div className="space-y-4">
                  {orders
                    .filter((o) => o.status !== 'Completed')
                    .map((order) => {
                      const steps: OrderStatus[] = ['Pending', 'Preparing', 'Ready', 'Served'];
                      const currentIdx = steps.indexOf(order.status);

                      return (
                        <div
                          key={order.id}
                          className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-4 transition hover:border-stone-300 hover:shadow-md"
                        >
                          {/* Ticket Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3.5">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <span className="font-mono font-bold text-xs px-3 py-1.5 rounded-xl bg-stone-900 text-white shadow-xs flex items-center gap-1.5">
                                <span>Table {order.tableNumber}</span>
                              </span>
                              <span className="text-xs font-mono font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200/70">
                                #{order.id}
                              </span>
                              <span
                                className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                                  order.status === 'Served'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : order.status === 'Ready'
                                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                                    : order.status === 'Preparing'
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : 'bg-stone-100 text-stone-700 border-stone-200'
                                }`}
                              >
                                <span className={`size-1.5 rounded-full ${
                                  order.status === 'Served'
                                    ? 'bg-emerald-500'
                                    : order.status === 'Ready'
                                    ? 'bg-blue-500'
                                    : order.status === 'Preparing'
                                    ? 'bg-amber-500 animate-ping'
                                    : 'bg-stone-400'
                                }`} />
                                {order.status === 'Pending' ? 'Received (Queued)' : order.status}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-xs text-stone-400 font-mono">Total</span>
                              <span className="font-mono font-bold text-base text-stone-900">
                                {formatCurrency(order.total)}
                              </span>
                            </div>
                          </div>

                          {/* Items Breakdown Cards */}
                          <div>
                            <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-semibold mb-2">
                              Ordered Items ({order.items.reduce((s, it) => s + it.quantity, 0)})
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {order.items.map((it) => (
                                <div
                                  key={it.menuItemId}
                                  className="inline-flex items-center gap-2 bg-stone-50 border border-stone-200/80 px-2.5 py-1.5 rounded-xl"
                                >
                                  <span className="size-5 rounded-md bg-stone-900 text-white font-mono font-bold text-[11px] flex items-center justify-center shrink-0">
                                    {it.quantity}×
                                  </span>
                                  <span className="text-xs font-semibold text-stone-800">
                                    {it.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Executive 4-Stage KDS Pipeline Stepper */}
                          <div className="p-3 rounded-2xl bg-stone-50/80 border border-stone-200/70">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {[
                                { stage: 'Pending', label: 'Received', stepNum: '1', icon: Inbox },
                                { stage: 'Preparing', label: 'Preparing', stepNum: '2', icon: ChefHat },
                                { stage: 'Ready', label: 'Ready', stepNum: '3', icon: Bell },
                                { stage: 'Served', label: 'Served', stepNum: '4', icon: Sparkles },
                              ].map((st, sIdx) => {
                                const isCurrent = sIdx === (currentIdx >= 0 ? currentIdx : 0);
                                const isPassed = sIdx < (currentIdx >= 0 ? currentIdx : 0);

                                return (
                                  <div
                                    key={st.stage}
                                    className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${
                                      isCurrent
                                        ? `${clientTheme.primaryBtn} border-transparent shadow-xs ring-2 ring-stone-900/10`
                                        : isPassed
                                        ? 'bg-stone-900 border-stone-900 text-white'
                                        : 'bg-white border-stone-200 text-stone-400'
                                    }`}
                                  >
                                    <div
                                      className={`size-6 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                                        isCurrent
                                          ? 'bg-white/20 text-white'
                                          : isPassed
                                          ? 'bg-stone-800 text-emerald-400'
                                          : 'bg-stone-100 text-stone-400'
                                      }`}
                                    >
                                      {isPassed ? (
                                        <Check className="size-3.5 stroke-[3]" />
                                      ) : (
                                        <st.icon className={`size-3.5 ${isCurrent ? 'animate-pulse' : ''}`} />
                                      )}
                                    </div>
                                    <div className="min-w-0 text-left">
                                      <div className="text-[10px] font-mono uppercase tracking-wider opacity-70">
                                        Step {st.stepNum}
                                      </div>
                                      <div className="text-xs font-bold truncate">
                                        {st.label}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Action controls for kitchen staff */}
                          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100">
                            <div className="text-xs text-stone-400 flex items-center gap-1.5">
                              <Clock className="size-3.5 text-stone-400" />
                              <span className="font-mono text-[11px]">Table session live</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {order.status === 'Pending' && (
                                <button
                                  onClick={() => {
                                    updateOrderStatus(order.id, 'Preparing');
                                    showToast(`Table ${order.tableNumber}: Kitchen started preparing`, 'info');
                                  }}
                                  className={`px-3.5 py-1.5 ${clientTheme.primaryBtn} text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5`}
                                >
                                  <ChefHat className="size-3.5" />
                                  <span>Advance to Preparing →</span>
                                </button>
                              )}
                              {order.status === 'Preparing' && (
                                <button
                                  onClick={() => {
                                    updateOrderStatus(order.id, 'Ready');
                                    showToast(`Table ${order.tableNumber}: Dishes are ready!`, 'success');
                                  }}
                                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                                >
                                  <Bell className="size-3.5" />
                                  <span>Advance to Ready →</span>
                                </button>
                              )}
                              {order.status === 'Ready' && (
                                <button
                                  onClick={() => {
                                    updateOrderStatus(order.id, 'Served');
                                    showToast(`Table ${order.tableNumber}: Order served to table`, 'success');
                                  }}
                                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                                >
                                  <Sparkles className="size-3.5" />
                                  <span>Mark as Served →</span>
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  updateOrderStatus(order.id, 'Completed');
                                  showToast(`Table ${order.tableNumber}: Order archived & closed`, 'success');
                                }}
                                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                              >
                                <Archive className="size-3.5 text-stone-500" />
                                <span>Archive Ticket</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 5: FEEDBACK */}
          {/* ======================================================== */}
          {activeSection === 'feedback' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-stone-900">Guest Feedback & Ratings</h1>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Live satisfaction sentiment gathered from contactless dining guests at Cafe XYZ.
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-xs">
                  <div className="text-3xl font-bold font-mono text-stone-900">{avgRating}</div>
                  <div>
                    <div className="text-amber-500 text-sm">★★★★★</div>
                    <div className="text-[11px] text-stone-400 font-mono">from 128 reviews</div>
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs md:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                      Rating Breakdown
                    </h3>
                    <span className="text-[11px] font-mono text-stone-400">
                      All 5 Tiers
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {[
                      { stars: '5★', count: 112, pct: '88%' },
                      { stars: '4★', count: 12, pct: '49%' },
                      { stars: '3★', count: 3, pct: '12%' },
                      { stars: '2★', count: 0, pct: '0%' },
                      { stars: '1★', count: 0, pct: '0%' },
                    ].map((tier) => (
                      <div key={tier.stars} className="flex items-center gap-3">
                        <span className="w-5 font-mono font-bold text-stone-700">
                          {tier.stars}
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-stone-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${clientTheme.progressBarActive}`}
                            style={{ width: tier.pct }}
                          />
                        </div>
                        <span className="w-8 text-right font-mono text-stone-400">
                          {tier.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block font-medium">
                      NEW THIS WEEK
                    </span>
                    <div className="text-2xl font-bold font-mono text-stone-900 mt-1">7</div>
                    <p className="text-xs text-stone-500 mt-1">Customer retention is up 14%.</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
                    <span className={`text-[10px] font-mono uppercase tracking-wider block font-semibold ${clientTheme.accentText}`}>
                      RESPONSE RATE
                    </span>
                    <div className="text-2xl font-bold font-mono text-stone-900 mt-1">94%</div>
                    <p className="text-xs text-stone-500 mt-1">Average server response: 84s</p>
                  </div>
                </div>
              </div>

              {/* Feed */}
              <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs divide-y divide-stone-100 overflow-hidden">
                {filteredFeedbacks.map((f) => (
                  <div key={f.id} className="p-5 hover:bg-stone-50/40 transition">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`size-8 rounded-full font-bold text-xs flex items-center justify-center font-mono ${clientTheme.badgeBg}`}>
                          {(f.customerName || 'Guest').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900">{f.customerName || 'Dining Guest'}</div>
                          <div className="text-[11px] text-stone-400 font-mono">
                            Table {f.tableNumber} • {formatDate(f.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="text-amber-500 text-xs">
                        {'★'.repeat(f.rating)}
                        {'☆'.repeat(5 - f.rating)}
                      </div>
                    </div>
                    <p className="text-xs text-stone-700 pl-10.5">"{f.comment}"</p>
                    {f.tags && f.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 pl-10.5 mt-2">
                        {f.tags.map((t, i) => (
                          <span
                            key={i}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${clientTheme.accentLightBg} ${clientTheme.accentText}`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 6: BRAND & THEME CUSTOMIZATION */}
          {/* ======================================================== */}
          {activeSection === 'theming' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-stone-900">Brand Identity & Theming</h1>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Customize your cafe logo and signature colorway. Updates automatically across dining tables and staff terminals.
                  </p>
                </div>
              </div>

              {/* CARD 1: CAFE LOGO MANAGEMENT */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-2xl border-2 border-stone-200 shadow-sm overflow-hidden bg-stone-50 p-1 shrink-0">
                      <img
                        src={getCafeLogo('c-1')}
                        alt="Cafe Active Logo"
                        className="size-full object-cover rounded-xl"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-stone-900">Cafe XYZ Active Logo</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Shown to customers in the digital menu app and staff terminals
                      </p>
                    </div>
                  </div>

                  {/* Upload custom logo button */}
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold shadow-xs cursor-pointer transition active:scale-[0.98]">
                      <Upload className="size-3.5" />
                      <span>Upload Custom Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              showToast('Logo must be under 5MB', 'warning');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              if (ev.target?.result) {
                                updateCafeLogo('c-1', ev.target.result as string);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    <button
                      onClick={() => resetCafeLogo('c-1')}
                      className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-500 hover:text-stone-800 transition cursor-pointer"
                      title="Reset to default logo"
                    >
                      <RotateCcw className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Artisanal Generated Logos Carousel / Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold flex items-center gap-1.5">
                      <Sparkles className="size-3 text-amber-500" />
                      <span>GENERATE OR PICK ARTISANAL EMBLEM</span>
                    </span>
                    <span className="text-xs text-stone-400">Click any preset to apply</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {ARTISANAL_CAFE_LOGOS.map((emblem) => {
                      const isActive = getCafeLogo('c-1') === emblem.svgDataUri;
                      return (
                        <button
                          key={emblem.id}
                          onClick={() => updateCafeLogo('c-1', emblem.svgDataUri)}
                          className={`p-3 rounded-xl border-2 transition cursor-pointer flex flex-col items-center text-center gap-2 group ${
                            isActive
                              ? 'border-stone-900 bg-stone-50 ring-2 ring-stone-900/10'
                              : 'border-stone-200/80 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                          }`}
                        >
                          <div className="size-12 rounded-xl overflow-hidden shadow-2xs group-hover:scale-105 transition-transform p-0.5">
                            <img src={emblem.svgDataUri} alt={emblem.name} className="size-full object-cover rounded-lg" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-stone-900 block leading-tight truncate">
                              {emblem.name}
                            </span>
                            <span className="text-[10px] text-stone-400 block mt-0.5">
                              {emblem.motif}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* CARD 2: VENUE COLORWAY SELECTION */}
              <div>
                <h2 className="text-sm font-bold text-stone-900 mb-2">Signature Dining Palette</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    id: 'terracotta' as CafeTheme,
                    name: 'Himalayan Terracotta',
                    desc: 'Warm clay pot brick and spice accents. Traditional Chiya atmosphere.',
                    bg: 'bg-amber-700',
                    border: 'border-amber-700',
                  },
                  {
                    id: 'emerald' as CafeTheme,
                    name: 'Botanical Emerald',
                    desc: 'Deep mountain tea garden pine and herbal green freshness.',
                    bg: 'bg-[#1B4636]',
                    border: 'border-[#1B4636]',
                  },
                  {
                    id: 'amber' as CafeTheme,
                    name: 'Espresso Amber',
                    desc: 'Crema roast and golden honeycomb. Modern artisan cafe style.',
                    bg: 'bg-yellow-700',
                    border: 'border-yellow-700',
                  },
                  {
                    id: 'noir' as CafeTheme,
                    name: 'Velvet Noir',
                    desc: 'Obsidian charcoal minimalism. Sleek high-end editorial bistro.',
                    bg: 'bg-stone-900',
                    border: 'border-stone-900',
                  },
                ].map((th) => {
                  const isSelected = cafeTheme === th.id;
                  return (
                    <button
                      key={th.id}
                      onClick={() => {
                        setCafeTheme(th.id);
                        showToast(`Venue palette switched to ${th.name}!`, 'success');
                      }}
                      className={`p-5 rounded-2xl bg-white border-2 text-left transition cursor-pointer flex flex-col justify-between shadow-xs ${
                        isSelected ? `${th.border} ring-2 ring-stone-900/10 shadow-md` : 'border-stone-200/80 hover:border-stone-300'
                      }`}
                    >
                      <div>
                        <div className={`w-full h-20 rounded-xl ${th.bg} mb-4 flex items-center justify-center text-white shadow-inner`}>
                          <Palette className="size-6 opacity-80" />
                        </div>
                        <h3 className="text-sm font-bold text-stone-900 flex items-center justify-between">
                          <span>{th.name}</span>
                          {isSelected && <Check className="size-4 text-emerald-600" />}
                        </h3>
                        <p className="text-xs text-stone-500 mt-1">{th.desc}</p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs font-mono">
                        <span className="text-stone-400">Customer PWA:</span>
                        <span className="font-semibold text-stone-800">
                          {isSelected ? 'Active Now' : 'Click to apply'}
                        </span>
                      </div>
                    </button>
                  );
                })}
                </div>
              </div>

              {/* CARD 3: IN-STORE WI-FI GEOFENCE PROTECTION (FOR CAFE XYZ) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
                <div className="border-b border-stone-100 pb-3">
                  <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <Wifi className="size-4 text-indigo-600" />
                    <span>In-Store Wi-Fi Geofence Protection</span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Prevent remote ordering. Dining guests must be physically present inside Cafe XYZ to place table orders.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex items-center justify-between">
                    <div>
                      <strong className="text-xs font-bold text-stone-900 block">Enforce In-Venue Network</strong>
                      <p className="text-[11px] text-stone-500 mt-0.5">Blocks orders from users browsing remotely</p>
                    </div>
                    <button
                      onClick={() => toggleNetworkVerification(!isNetworkVerificationEnabled)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isNetworkVerificationEnabled ? 'bg-emerald-600' : 'bg-stone-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          isNetworkVerificationEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1">
                    <label className="text-xs font-bold text-stone-900 block">Venue Wi-Fi SSID</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        defaultValue={cafeWifiSsid || 'CafeXYZ-Guest-5G'}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg text-stone-800 font-mono focus:outline-none focus:ring-1 focus:ring-stone-400"
                      />
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded font-mono font-semibold shrink-0">
                        Active Subnet
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 4: FONEPAY NEPAL PAYMENT GATEWAY ROUTING (FOR CAFE XYZ) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
                <div className="border-b border-stone-100 pb-3">
                  <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <CreditCard className="size-4 text-emerald-600" />
                    <span>Fonepay Nepal Payment Gateway Routing</span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Cafe XYZ merchant credentials and direct bank settlement for contactless table QR checkout.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/40">
                    <span className="text-[10px] font-mono uppercase text-stone-400 block font-semibold">MERCHANT CODE</span>
                    <span className="font-mono font-bold text-xs text-stone-800 mt-1 block">FONEPAY-KTM-0042</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/40">
                    <span className="text-[10px] font-mono uppercase text-stone-400 block font-semibold">SETTLEMENT BANK</span>
                    <span className="font-bold text-xs text-stone-800 mt-1 block">Nabil Bank Current (NPR)</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/40 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-stone-400 block font-semibold">TERMINAL STATUS</span>
                      <span className="font-bold text-xs text-emerald-700 mt-0.5 block">Active QR Escrow</span>
                    </div>
                    <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ======================================================== */}
      {/* MODAL: TABLE QR CODE GENERATOR */}
      {/* ======================================================== */}
      {selectedTableForQr && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-stone-200 shadow-xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedTableForQr(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <div className="text-center mb-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 font-semibold block mb-1">
                CONTACTLESS DINING QR
              </span>
              <h2 className="text-xl font-bold text-stone-900">
                Table {selectedTableForQr.number}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Scan with any smartphone camera to launch menu ordering.
              </p>
            </div>

            {/* Target Mode Switcher: Smartphone Wi-Fi Scan vs Localhost */}
            <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl mb-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setQrHostMode('lan')}
                className={`py-1.5 px-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  qrHostMode === 'lan'
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <Smartphone className="size-3.5" />
                <span>Phone Scan (Wi-Fi)</span>
              </button>

              <button
                type="button"
                onClick={() => setQrHostMode('local')}
                className={`py-1.5 px-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  qrHostMode === 'local'
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <Laptop className="size-3.5" />
                <span>This PC (Localhost)</span>
              </button>
            </div>

            {/* Wi-Fi LAN IP Settings (Shown when Phone Scan is selected) */}
            {qrHostMode === 'lan' && (
              <div className="mb-3 p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-amber-900 flex items-center gap-1">
                    <Wifi className="size-3.5 text-amber-700" />
                    Network IP (Same Wi-Fi)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isEditingLanIp) setCustomLanInput(lanHost);
                      setIsEditingLanIp(!isEditingLanIp);
                    }}
                    className="text-[11px] text-amber-800 hover:underline font-mono cursor-pointer"
                  >
                    {isEditingLanIp ? 'Cancel' : 'Change IP'}
                  </button>
                </div>

                {isEditingLanIp ? (
                  <div className="flex items-center gap-1.5 mt-1">
                    <input
                      type="text"
                      value={customLanInput}
                      onChange={(e) => setCustomLanInput(e.target.value)}
                      placeholder="192.168.101.5:5173"
                      className="flex-1 px-2.5 py-1 text-xs bg-white border border-stone-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customLanInput.trim()) {
                          setLanHost(customLanInput.trim());
                          setIsEditingLanIp(false);
                          showToast('Updated network scan IP', 'success');
                        }
                      }}
                      className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] text-amber-800">
                    Host: <code className="font-mono font-bold bg-amber-100/80 px-1 py-0.5 rounded">{lanHost}</code>
                    <span className="block mt-0.5 text-stone-500">
                      Your phone must be connected to the same Wi-Fi network.
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* QR Code Canvas */}
            {(() => {
              const qrTargetUrl =
                qrHostMode === 'lan'
                  ? `http://${lanHost}/table/${selectedTableForQr.number}`
                  : `${window.location.origin}/table/${selectedTableForQr.number}`;

              return (
                <>
                  <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col items-center justify-center my-3">
                    <div className="p-3 bg-white rounded-xl shadow-xs border border-stone-100">
                      <QRCodeSVG
                        value={qrTargetUrl}
                        size={175}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                    <div className="text-[11px] font-mono text-stone-600 font-semibold mt-3 truncate max-w-xs text-center select-all bg-white px-2.5 py-1 rounded-lg border border-stone-200/80">
                      {qrTargetUrl}
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(qrTargetUrl);
                        showToast(`Copied ${qrHostMode === 'lan' ? 'Phone' : 'Table'} URL to clipboard`, 'success');
                      }}
                      className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Copy Dining URL</span>
                    </button>

                    <a
                      href={qrTargetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 text-center"
                    >
                      <ExternalLink className="size-3.5" />
                      <span>Open Dining App in New Tab</span>
                    </a>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT MENU ITEM */}
      {/* ======================================================== */}
      {isMenuItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-stone-200 shadow-xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsMenuItemModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <div className="mb-5">
              <span className={`text-[10px] font-mono uppercase tracking-wider ${clientTheme.accentText} font-semibold block mb-1`}>
                KITCHEN REGISTRY
              </span>
              <h2 className="text-xl font-bold text-stone-900">
                {editingMenuItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Register culinary dish or tea brew for Cafe XYZ catalog.
              </p>
            </div>

            <form onSubmit={handleSaveMenuItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Dish Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                    <img
                      src={menuFormImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Upload className="size-3.5" />
                      <span>Upload from Device</span>
                    </button>
                    <p className="text-[10px] text-stone-400 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  value={menuFormName}
                  onChange={(e) => setMenuFormName(e.target.value)}
                  placeholder="e.g. Himalayan Matka Chiya"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={menuFormDesc}
                  onChange={(e) => setMenuFormDesc(e.target.value)}
                  placeholder="Flavor notes, brewing spices, ingredients..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={menuFormCategory}
                    onChange={(e) => setMenuFormCategory(e.target.value as MenuCategory)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:bg-white"
                  >
                    <option value="Chiya & Teas">Chiya & Teas</option>
                    <option value="Specialty Coffee">Specialty Coffee</option>
                    <option value="Bakery & Bites">Bakery & Bites</option>
                    <option value="Mains & Bowls">Mains & Bowls</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Price (रु.)
                  </label>
                  <input
                    type="number"
                    required
                    value={menuFormPrice}
                    onChange={(e) => setMenuFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div>
                  <div className="text-xs font-semibold text-stone-900">Stock Availability</div>
                  <div className="text-[10px] text-stone-500">Uncheck to mark 86'd out of stock</div>
                </div>
                <input
                  type="checkbox"
                  checked={menuFormAvailable}
                  onChange={(e) => setMenuFormAvailable(e.target.checked)}
                  style={{ accentColor: clientTheme.accentColor }}
                  className="size-4 rounded cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsMenuItemModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 ${clientTheme.primaryBtn} text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer`}
                >
                  {editingMenuItem ? 'Save Changes' : 'Register Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: REVENUE DETAILS */}
      {/* ======================================================== */}
      {isRevenueModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-stone-200 shadow-xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsRevenueModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <span className={`text-[10px] font-mono uppercase tracking-wider ${clientTheme.accentText} font-semibold block mb-1`}>
              REVENUE REPORT
            </span>
            <h2 className="text-xl font-bold text-stone-900">Today's Revenue</h2>
            <p className="text-xs text-stone-500 mt-0.5">Live telemetry sync</p>

            <div className={`my-5 p-4 rounded-xl ${clientTheme.bannerBg} border ${clientTheme.bannerBorder}`}>
              <span className="text-xs text-stone-500">Total collected</span>
              <div className="text-3xl font-bold font-mono text-stone-900 mt-1">{formatCurrency(2480.50)}</div>
              <div className="text-xs text-emerald-700 font-medium mt-1">
                +12.8% compared with yesterday
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-stone-400 font-mono">ORDERS</span>
                <div className="text-base font-bold text-stone-900 mt-0.5">86</div>
                <span className="text-[10px] text-stone-500">completed today</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-stone-400 font-mono">AVG. ORDER</span>
                <div className="text-base font-bold text-stone-900 mt-0.5">Rs. 28.84</div>
                <span className="text-[10px] text-stone-500">per ticket</span>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-stone-100 text-xs">
              <div className="font-semibold text-stone-800 mb-2">Payment Mix</div>
              <div>
                <div className="flex justify-between text-stone-600 mb-1">
                  <span>Digital Wallet (Fonepay QR)</span>
                  <span className="font-mono font-bold">58%</span>
                </div>
                <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-amber-600 rounded-full" style={{ width: '58%' }} />
                </div>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-stone-600 mb-1">
                  <span>Cash & Counter Settle</span>
                  <span className="font-mono font-bold">42%</span>
                </div>
                <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-stone-400 rounded-full" style={{ width: '42%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ORDERS REPORT */}
      {/* ======================================================== */}
      {isOrdersModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-stone-200 shadow-xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsOrdersModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-semibold block mb-1">
              ORDER REPORT
            </span>
            <h2 className="text-xl font-bold text-stone-900">Today's Orders</h2>
            <p className="text-xs text-stone-500 mt-0.5">86 completed table orders today</p>

            <div className="my-4 divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
              <div className="p-3 bg-stone-50 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-stone-900">Table 08 • Jamie R.</div>
                  <div className="text-stone-500 text-[11px]">2 Matka Chiya, 1 Croissant</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-stone-900">Rs. 960.00</div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Paid via Fonepay
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-stone-900">Table 03 • Kim L.</div>
                  <div className="text-stone-500 text-[11px]">1 Avocado Toast, 2 Oat Lattes</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-stone-900">Rs. 725.00</div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Paid via Fonepay
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: HELP CENTER */}
      {/* ======================================================== */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-stone-200 shadow-xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsHelpModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold block mb-1">
              OPERATIONS SUPPORT
            </span>
            <h2 className="text-xl font-bold text-stone-900">Need a Hand?</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Everything you need to keep Cafe XYZ running smoothly.
            </p>

            <div className="my-5 p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center">
                  <Mail className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-900">Support Desk</div>
                  <div className="text-[10px] text-stone-500">support@cafems.io</div>
                </div>
              </div>
              <button
                onClick={() => showToast('Support ticket dispatch simulated', 'success')}
                className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CafeClientApp;
