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
import { Table, MenuItem, TableStatus, MenuCategory, TableAlert, CafeTheme, OrderStatus, MenuCategoryRecord } from '../../types';
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
    menuCategories,
    addMenuCategory,
    updateMenuCategory,
    deleteMenuCategory,
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
      tableHeader: 'bg-[#9A3412] text-white border-b border-[#7C2D12]',
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
      tableHeader: 'bg-[#1B4636] text-white border-b border-emerald-950',
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
      tableHeader: 'bg-amber-600 text-white border-b border-amber-700',
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
      tableHeader: 'bg-stone-900 text-white border-b border-black',
    },
    espresso: {
      activeNav: 'bg-[#451A03] text-white shadow-xs',
      activeSubPill: 'bg-[#351401] text-white',
      primaryBtn: 'bg-[#451A03] hover:bg-[#351401] text-white',
      activeTab: 'bg-[#451A03] text-white font-semibold',
      accentColor: '#78350F',
      accentText: 'text-[#451A03]',
      accentBg: 'bg-[#451A03]',
      accentLightBg: 'bg-amber-50',
      accentBorder: 'border-[#451A03]',
      switchActive: 'bg-[#451A03]',
      switchText: 'text-amber-950',
      progressBarActive: 'bg-[#78350F]',
      logoBg: 'bg-[#451A03]',
      bannerBg: 'bg-amber-50/80',
      bannerBorder: 'border-amber-300',
      bannerText: 'text-amber-950',
      bannerPing: 'bg-[#78350F]',
      bannerIcon: 'text-[#78350F]',
      bannerAckBtn: 'bg-amber-100 hover:bg-amber-200 text-amber-900',
      bannerResolveBtn: 'bg-[#451A03] hover:bg-[#351401] text-white',
      badgeBg: 'bg-amber-100 text-[#451A03]',
      tableHeader: 'bg-[#451A03] text-white border-b border-[#351401]',
    },
    burgundy: {
      activeNav: 'bg-[#881337] text-white shadow-xs',
      activeSubPill: 'bg-[#4C0519] text-white',
      primaryBtn: 'bg-[#881337] hover:bg-[#4C0519] text-white',
      activeTab: 'bg-[#881337] text-white font-semibold',
      accentColor: '#9F1239',
      accentText: 'text-[#881337]',
      accentBg: 'bg-[#881337]',
      accentLightBg: 'bg-rose-50',
      accentBorder: 'border-[#881337]',
      switchActive: 'bg-[#881337]',
      switchText: 'text-rose-950',
      progressBarActive: 'bg-[#9F1239]',
      logoBg: 'bg-[#881337]',
      bannerBg: 'bg-rose-50/80',
      bannerBorder: 'border-rose-200',
      bannerText: 'text-rose-950',
      bannerPing: 'bg-[#9F1239]',
      bannerIcon: 'text-[#881337]',
      bannerAckBtn: 'bg-rose-100 hover:bg-rose-200 text-rose-900',
      bannerResolveBtn: 'bg-[#881337] hover:bg-[#4C0519] text-white',
      badgeBg: 'bg-rose-100 text-[#881337]',
      tableHeader: 'bg-[#881337] text-white border-b border-[#4C0519]',
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

  // Cafe OS Menu Hierarchy: 'items' | 'categories' | 'units'
  const [menuSubTab, setMenuSubTab] = useState<'units' | 'categories' | 'items'>('units');
  const [isMenuNavOpen, setIsMenuNavOpen] = useState(true);
  const [categorySearch, setCategorySearch] = useState('');
  const [unitSearch, setUnitSearch] = useState('');

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategoryRecord | null>(null);
  const [categoryFormName, setCategoryFormName] = useState('');
  const [categoryFormDisplayName, setCategoryFormDisplayName] = useState('');
  const [categoryFormPosition, setCategoryFormPosition] = useState(1);
  const [categoryFormVisible, setCategoryFormVisible] = useState(true);

  // Menu Units list (aligned with Cafe OS spec: bora, Plate, Piece, Packet, Ml, Litre, Glass, Bowl, Bottle, Cup, Portion)
  const [menuUnits, setMenuUnits] = useState<string[]>([
    'Plate', 'Piece', 'Cup', 'Bowl', 'Bottle', 'Ml', 'Litre', 'Glass', 'Packet', 'Portion', 'bora'
  ]);
  const [newUnitName, setNewUnitName] = useState('');

  // Filters and search
  const [tableSearch, setTableSearch] = useState('');
  const [tableStatusFilter, setTableStatusFilter] = useState<'All' | TableStatus>('All');
  const [menuSearch, setMenuSearch] = useState('');
  const [menuAvailabilityFilter, setMenuAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string>('All');
  const [feedbackRatingFilter, setFeedbackRatingFilter] = useState<number | 'all'>('all');
  const [feedbackSearch, setFeedbackSearch] = useState('');

  // Menu item form state
  const [menuFormName, setMenuFormName] = useState('');
  const [menuFormDisplayName, setMenuFormDisplayName] = useState('');
  const [menuFormShortName, setMenuFormShortName] = useState('');
  const [menuFormUnit, setMenuFormUnit] = useState('Cup');
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
    const q = menuSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      (item.displayName && item.displayName.toLowerCase().includes(q)) ||
      (item.shortName && item.shortName.toLowerCase().includes(q)) ||
      (item.unit && item.unit.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q);
    const matchesAvailability =
      menuAvailabilityFilter === 'all' ||
      (menuAvailabilityFilter === 'available' && item.isAvailable) ||
      (menuAvailabilityFilter === 'unavailable' && !item.isAvailable);
    const matchesCategory = menuCategoryFilter === 'All' || item.category === menuCategoryFilter;
    return matchesSearch && matchesAvailability && matchesCategory;
  });

  // Filtered categories
  const filteredMenuCategories = menuCategories.filter((cat) => {
    const q = categorySearch.toLowerCase().trim();
    return !q || cat.name.toLowerCase().includes(q) || cat.displayName.toLowerCase().includes(q);
  });

  // Filtered units
  const filteredMenuUnits = menuUnits.filter((u) => {
    const q = unitSearch.toLowerCase().trim();
    return !q || u.toLowerCase().includes(q);
  });

  // Filtered feedbacks with full review keyword search
  const filteredFeedbacks = feedbacks.filter((f) => {
    const matchesRating = feedbackRatingFilter === 'all' || f.rating === feedbackRatingFilter;
    const q = feedbackSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      f.comment.toLowerCase().includes(q) ||
      (f.customerName && f.customerName.toLowerCase().includes(q)) ||
      (f.tags && f.tags.some((t) => t.toLowerCase().includes(q)));
    return matchesRating && matchesSearch;
  });

  // Multi-dimensional rating analysis metrics
  const feedbackMetrics = (() => {
    if (feedbacks.length === 0) {
      return {
        food: 4.9,
        service: 4.8,
        accuracy: 5.0,
        value: 4.7,
        hygiene: 4.9,
        ambience: 4.8,
        overall: 4.9,
      };
    }
    const count = feedbacks.length;
    return {
      food: +(feedbacks.reduce((acc, f) => acc + (f.ratings?.food || f.rating || 5), 0) / count).toFixed(1),
      service: +(feedbacks.reduce((acc, f) => acc + (f.ratings?.service || f.rating || 5), 0) / count).toFixed(1),
      accuracy: +(feedbacks.reduce((acc, f) => acc + (f.ratings?.orderAccuracy || f.rating || 5), 0) / count).toFixed(1),
      value: +(feedbacks.reduce((acc, f) => acc + (f.ratings?.valueForMoney || f.rating || 5), 0) / count).toFixed(1),
      hygiene: +(feedbacks.reduce((acc, f) => acc + (f.ratings?.hygiene || f.rating || 5), 0) / count).toFixed(1),
      ambience: +(feedbacks.reduce((acc, f) => acc + (f.ratings?.ambience || f.rating || 5), 0) / count).toFixed(1),
      overall: +(feedbacks.reduce((acc, f) => acc + (f.rating || 5), 0) / count).toFixed(1),
    };
  })();

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
    setMenuFormDisplayName('');
    setMenuFormShortName('');
    setMenuFormUnit('Plate');
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
    setMenuFormDisplayName(item.displayName || item.name);
    setMenuFormShortName(item.shortName || '');
    setMenuFormUnit(item.unit || 'Plate');
    setMenuFormDesc(item.description);
    setMenuFormCategory(item.category);
    setMenuFormPrice(item.price);
    setMenuFormImage(item.image || '');
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
        displayName: menuFormDisplayName || menuFormName,
        shortName: menuFormShortName,
        unit: menuFormUnit,
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
        displayName: menuFormDisplayName || menuFormName,
        shortName: menuFormShortName,
        unit: menuFormUnit,
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

  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormName('');
    setCategoryFormDisplayName('');
    setCategoryFormPosition(menuCategories.length + 1);
    setCategoryFormVisible(true);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: MenuCategoryRecord) => {
    setEditingCategory(cat);
    setCategoryFormName(cat.name);
    setCategoryFormDisplayName(cat.displayName || cat.name);
    setCategoryFormPosition(cat.position);
    setCategoryFormVisible(cat.isVisible);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormName.trim()) {
      showToast('Category name is required', 'warning');
      return;
    }
    if (editingCategory) {
      await updateMenuCategory({
        ...editingCategory,
        name: categoryFormName,
        displayName: categoryFormDisplayName || categoryFormName,
        position: Number(categoryFormPosition) || 1,
        isVisible: categoryFormVisible,
      });
      showToast(`Category "${categoryFormName}" updated`, 'success');
    } else {
      await addMenuCategory({
        name: categoryFormName,
        displayName: categoryFormDisplayName || categoryFormName,
        position: Number(categoryFormPosition) || menuCategories.length + 1,
        isVisible: categoryFormVisible,
      });
      showToast(`Category "${categoryFormName}" added`, 'success');
    }
    setIsCategoryModalOpen(false);
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
            <span className="text-xs font-mono uppercase tracking-wider text-stone-600 px-3 py-1 block font-bold">
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
              const isMenu = item.id === 'menu';

              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => {
                      if (isMenu) {
                        setActiveSection('menu');
                        setIsMenuNavOpen((prev) => !prev);
                      } else {
                        setActiveSection(item.id as any);
                        setIsMobileDrawerOpen(false);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                      isActive
                        ? clientTheme.activeNav
                        : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="size-4.5 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.count !== null && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
                            isActive
                              ? clientTheme.activeSubPill
                              : item.isAlert && activeAlerts.length > 0
                              ? 'bg-red-500 text-white'
                              : 'bg-stone-200 text-stone-800'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                      {isMenu && (
                        <ChevronDown className={`size-3.5 text-stone-500 transition-transform ${isMenuNavOpen ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </button>

                  {/* Mobile Drawer Menu Dropdown Submenu */}
                  {isMenu && isMenuNavOpen && (
                    <div className="ml-5 pl-3 border-l-2 border-stone-300 space-y-1 py-1">
                      <button
                        onClick={() => {
                          setActiveSection('menu');
                          setMenuSubTab('units');
                          setIsMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          activeSection === 'menu' && menuSubTab === 'units'
                            ? 'font-bold text-stone-900 bg-stone-200/80'
                            : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                        }`}
                      >
                        <span>↳ Menu Unit</span>
                        <span className="text-[11px] font-mono font-bold px-1.5 py-0.2 rounded bg-stone-200 text-stone-800">
                          {menuUnits.length}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveSection('menu');
                          setMenuSubTab('categories');
                          setIsMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          activeSection === 'menu' && menuSubTab === 'categories'
                            ? 'font-bold text-stone-900 bg-stone-200/80'
                            : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                        }`}
                      >
                        <span>↳ Menu Category</span>
                        <span className="text-[11px] font-mono font-bold px-1.5 py-0.2 rounded bg-stone-200 text-stone-800">
                          {menuCategories.length}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveSection('menu');
                          setMenuSubTab('items');
                          setIsMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          activeSection === 'menu' && menuSubTab === 'items'
                            ? 'font-bold text-stone-900 bg-stone-200/80'
                            : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                        }`}
                      >
                        <span>↳ Menu Items</span>
                        <span className="text-[11px] font-mono font-bold px-1.5 py-0.2 rounded bg-stone-200 text-stone-800">
                          {menuItems.length}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
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
                onClick={() => {
                  setActiveSection('menu');
                  setIsMenuNavOpen((prev) => !prev);
                }}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center size-11 mx-auto rounded-2xl relative' : 'justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold'
                } transition cursor-pointer ${
                  activeSection === 'menu'
                    ? clientTheme.activeNav
                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                }`}
                title={isSidebarCollapsed ? undefined : 'Menu & Availability'}
              >
                <div className="flex items-center gap-2.5">
                  <UtensilsCrossed className={`${isSidebarCollapsed ? 'size-5' : 'size-4'} shrink-0`} />
                  {!isSidebarCollapsed && <span>Menu catalog</span>}
                </div>
                {!isSidebarCollapsed ? (
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
                        activeSection === 'menu' ? clientTheme.activeSubPill : 'bg-stone-200 text-stone-800'
                      }`}
                    >
                      {menuItems.length}
                    </span>
                    <ChevronDown className={`size-3.5 text-stone-500 transition-transform ${isMenuNavOpen ? 'rotate-180' : ''}`} />
                  </div>
                ) : (
                  <span className="absolute -top-1 -right-1 size-4 bg-stone-700 text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    {menuItems.length}
                  </span>
                )}
              </button>

              {/* Collapsed Tooltip Flyout */}
              {isSidebarCollapsed && (
                <div className="absolute left-[calc(100%+12px)] top-0 p-2 bg-stone-900 text-white rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50 border border-stone-800 min-w-44 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-stone-400 px-2 py-1">Menu Catalog</div>
                  <button
                    onClick={() => { setActiveSection('menu'); setMenuSubTab('units'); }}
                    className="w-full text-left px-2 py-1 text-xs rounded hover:bg-white/10 flex items-center justify-between"
                  >
                    <span>Menu Unit</span>
                    <span className="font-mono text-[10px] text-stone-400">{menuUnits.length}</span>
                  </button>
                  <button
                    onClick={() => { setActiveSection('menu'); setMenuSubTab('categories'); }}
                    className="w-full text-left px-2 py-1 text-xs rounded hover:bg-white/10 flex items-center justify-between"
                  >
                    <span>Menu Category</span>
                    <span className="font-mono text-[10px] text-stone-400">{menuCategories.length}</span>
                  </button>
                  <button
                    onClick={() => { setActiveSection('menu'); setMenuSubTab('items'); }}
                    className="w-full text-left px-2 py-1 text-xs rounded hover:bg-white/10 flex items-center justify-between"
                  >
                    <span>Menu Items</span>
                    <span className="font-mono text-[10px] text-stone-400">{menuItems.length}</span>
                  </button>
                  <div className="absolute right-full top-3 border-4 border-transparent border-r-stone-900" />
                </div>
              )}

              {/* Expanded Dropdown Submenu under Menu */}
              {!isSidebarCollapsed && isMenuNavOpen && (
                <div className="ml-5 mt-1 pl-3 border-l-2 border-stone-300 space-y-1 py-0.5">
                  <button
                    onClick={() => {
                      setActiveSection('menu');
                      setMenuSubTab('units');
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeSection === 'menu' && menuSubTab === 'units'
                        ? 'font-bold text-stone-900 bg-stone-200/80'
                        : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <span>↳ Menu Unit</span>
                    <span className="text-[11px] font-mono font-bold px-1.5 py-0.2 rounded bg-stone-200 text-stone-800">
                      {menuUnits.length}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveSection('menu');
                      setMenuSubTab('categories');
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeSection === 'menu' && menuSubTab === 'categories'
                        ? 'font-bold text-stone-900 bg-stone-200/80'
                        : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <span>↳ Menu Category</span>
                    <span className="text-[11px] font-mono font-bold px-1.5 py-0.2 rounded bg-stone-200 text-stone-800">
                      {menuCategories.length}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveSection('menu');
                      setMenuSubTab('items');
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      activeSection === 'menu' && menuSubTab === 'items'
                        ? 'font-bold text-stone-900 bg-stone-200/80'
                        : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <span>↳ Menu Items</span>
                    <span className="text-[11px] font-mono font-bold px-1.5 py-0.2 rounded bg-stone-200 text-stone-800">
                      {menuItems.length}
                    </span>
                  </button>
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
        {activeAlerts.length > 0 && (() => {
          const firstAlert = activeAlerts[0];
          const alertTableOrder = orders.find(
            (o) => o.tableNumber === firstAlert.tableNumber && o.status !== 'Completed'
          );
          return (
            <div className={`${clientTheme.bannerBg} border-b ${clientTheme.bannerBorder} px-4 sm:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-fadeIn transition-colors`}>
              <div className={`flex flex-col sm:flex-row sm:items-center gap-2 text-xs ${clientTheme.bannerText}`}>
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${clientTheme.bannerPing} animate-ping shrink-0`} />
                  <ShieldAlert className={`size-4 ${clientTheme.bannerIcon} shrink-0`} />
                  <span className="font-bold">
                    Table {firstAlert.tableNumber} Request: {firstAlert.type}
                  </span>
                  {firstAlert.note && (
                    <span className="opacity-90 italic">("{firstAlert.note}")</span>
                  )}
                </div>
                {alertTableOrder && (
                  <div className="flex items-center gap-1.5 pl-6 sm:pl-0">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-white/80 border border-stone-200/80 text-stone-800 shadow-2xs font-semibold">
                      Order: {alertTableOrder.items.map((it) => `${it.quantity}× ${it.name}`).join(', ')} • {formatCurrency(alertTableOrder.total)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => {
                    acknowledgeAlert(firstAlert.id);
                    showToast(`Acknowledged alert for Table ${firstAlert.tableNumber}`, 'info');
                  }}
                  className={`px-3 py-1 ${clientTheme.bannerAckBtn} rounded-lg text-xs font-semibold transition cursor-pointer`}
                >
                  Acknowledge
                </button>
                <button
                  onClick={() => {
                    resolveAlert(firstAlert.id);
                    showToast(`Resolved request for Table ${firstAlert.tableNumber}`, 'success');
                  }}
                  className={`px-3.5 py-1 ${clientTheme.bannerResolveBtn} rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs`}
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          );
        })()}

        {/* Main Content Area: Balanced container capped at 1400px so cards & telemetry don't stretch indefinitely */}
        <main className="p-4 sm:p-6 lg:p-8 w-full max-w-[1400px] mx-auto space-y-6 flex-1">
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
                  <div className="flex items-center justify-between text-xs sm:text-sm text-stone-700 font-bold mb-2">
                    <span>Today's revenue</span>
                    <TrendingUp className="size-4.5" style={{ color: clientTheme.accentColor }} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                    रु. 2,480.50
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-700 font-bold mt-1">
                    <span>↑ 12.8% vs yesterday</span>
                  </div>
                </button>

                <button
                  onClick={() => setIsOrdersModalOpen(true)}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-stone-300 hover:shadow-xs transition text-left cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs sm:text-sm text-stone-700 font-bold mb-2">
                    <span>Orders today</span>
                    <Coffee className="size-4.5" style={{ color: clientTheme.accentColor }} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                    86
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-700 font-bold mt-1">
                    <span>↑ 8.4% vs yesterday</span>
                  </div>
                </button>

                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-stone-700 font-bold mb-2">
                    <span>Table occupancy</span>
                    <Users className="size-4.5" style={{ color: clientTheme.accentColor }} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                    {occupancyRate}%
                    <span className="text-xs sm:text-sm font-semibold text-stone-600 ml-1.5 font-sans">
                      ({occupiedTables}/{tables.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-700 font-bold mt-1">
                    <span>{availableTables} tables available</span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-stone-700 font-bold mb-2">
                    <span>Guest rating</span>
                    <Star className="size-4.5 fill-amber-400 text-amber-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-1.5">
                    <span>{avgRating}</span>
                    <span className="text-amber-500 text-xl sm:text-2xl font-bold">★</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-700 font-bold mt-1">
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
                        className={`p-3.5 rounded-xl border-2 transition cursor-pointer relative ${
                          hasAlert
                            ? `${clientTheme.bannerBg} ${clientTheme.bannerBorder} ring-2 ring-amber-400/40`
                            : isOccupied
                            ? 'bg-[#fecaca] border-red-500 hover:border-red-600 shadow-xs'
                            : isReserved
                            ? 'bg-[#e9d5ff] border-purple-500 hover:border-purple-600 shadow-xs'
                            : 'bg-[#bbf7d0] border-emerald-500 hover:border-emerald-600 shadow-xs'
                        }`}
                      >
                        {hasAlert && (
                          <span className="absolute -top-1.5 -right-1.5 size-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                            !
                          </span>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs px-2 py-0.5 rounded-md bg-stone-900 text-white font-mono shadow-xs">
                            T-{t.number < 10 ? `0${t.number}` : t.number}
                          </span>
                          <span
                            className={`size-2.5 rounded-full ${
                              isOccupied
                                ? 'bg-red-600'
                                : isReserved
                                ? 'bg-purple-600'
                                : 'bg-emerald-600'
                            }`}
                          />
                        </div>
                        <div className="mt-2.5 text-xs flex items-center justify-between">
                          <span className="font-bold text-stone-800">{t.capacity} seats</span>
                          <span
                            className={`font-extrabold capitalize text-xs ${
                              isOccupied
                                ? 'text-red-950'
                                : isReserved
                                ? 'text-purple-950'
                                : 'text-emerald-950'
                            }`}
                          >
                            {t.status}
                          </span>
                        </div>
                        {isOccupied && (
                          <div className="mt-1.5 pt-1.5 border-t border-red-400/60 flex items-center justify-between text-xs text-red-950 font-mono font-bold">
                            <span>Active</span>
                            <span>Rs. 1,420</span>
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
                      <div className="size-32 rounded-full border-8 border-red-500 border-t-emerald-500 border-l-purple-500 flex flex-col items-center justify-center bg-stone-50">
                        <span className="text-2xl font-bold font-mono text-stone-900 leading-none">
                          {totalTables}
                        </span>
                        <span className="text-[10px] text-stone-400 uppercase font-mono mt-1">tables</span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="size-3 rounded-full bg-red-500" />
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
                        ? 'bg-red-600 text-white font-semibold'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <span className="size-2 rounded-full bg-red-500" />
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
                  const statusCardTheme =
                    table.status === 'Available'
                      ? 'border-emerald-600/80 bg-[#bbf7d0] hover:bg-[#86efac] shadow-sm'
                      : table.status === 'Occupied'
                      ? 'border-red-600/80 bg-[#fecaca] hover:bg-[#fca5a5] shadow-sm'
                      : 'border-purple-600/80 bg-[#e9d5ff] hover:bg-[#d8b4fe] shadow-sm';

                  const statusBadgeColor =
                    table.status === 'Available'
                      ? 'bg-emerald-900 text-white border-emerald-950 font-bold'
                      : table.status === 'Occupied'
                      ? 'bg-red-900 text-white border-red-950 font-bold'
                      : 'bg-purple-900 text-white border-purple-950 font-bold';

                  return (
                    <div
                      key={table.id}
                      className={`p-4 sm:p-5 rounded-2xl border-2 ${statusCardTheme} shadow-xs hover:shadow-md transition flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="min-w-10 px-2.5 h-8 rounded-xl bg-stone-900 text-white font-extrabold font-mono text-sm flex items-center justify-center shrink-0 whitespace-nowrap shadow-xs">
                              T-{table.number}
                            </span>
                            <span className="text-xs sm:text-sm text-stone-800 font-mono font-bold whitespace-nowrap">
                              {table.capacity} Seats
                            </span>
                          </div>

                          <div className="relative inline-flex items-center">
                            <select
                              value={table.status}
                              onChange={(e) =>
                                updateTableStatus(table.number, e.target.value as TableStatus)
                              }
                              className={`text-xs font-bold font-mono rounded-lg pl-3 pr-7 py-1.5 border cursor-pointer appearance-none ${statusBadgeColor} focus:outline-none focus:ring-2 focus:ring-stone-600 transition shadow-2xs`}
                            >
                              <option value="Available" className="bg-white text-stone-900">Available</option>
                              <option value="Occupied" className="bg-white text-stone-900">Occupied</option>
                              <option value="Reserved" className="bg-white text-stone-900">Reserved</option>
                            </select>
                            <ChevronDown className="size-3.5 pointer-events-none absolute right-2 text-white opacity-90" />
                          </div>
                        </div>

                        <div className="space-y-1.5 my-3 text-xs">
                          {table.status === 'Occupied' && (
                            <div className="flex items-center justify-between text-red-950 font-bold">
                              <span className="flex items-center gap-1.5 text-red-900">
                                <Clock className="size-3.5" />
                                Active Tab
                              </span>
                              <span className="font-mono text-xs sm:text-sm font-extrabold">
                                {table.currentTotal ? formatCurrency(table.currentTotal) : 'Active tab'}
                              </span>
                            </div>
                          )}
                          {table.status === 'Available' && (
                            <div className="text-emerald-950 text-xs sm:text-sm font-bold flex items-center gap-1.5">
                              <CheckCircle2 className="size-3.5 text-emerald-800" />
                              Ready for next guests
                            </div>
                          )}
                          {table.status === 'Reserved' && (
                            <div className="text-purple-950 text-xs sm:text-sm font-bold flex items-center gap-1.5">
                              <Clock className="size-3.5 text-purple-800" />
                              Reserved station
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-black/10 flex items-center gap-2">
                        <button
                          onClick={() => setSelectedTableForQr(table)}
                          className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-900 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                        >
                          <QrCode className="size-4 text-stone-700" />
                          <span>QR & Table Link</span>
                        </button>

                        <a
                          href={`/table/${table.number}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 hover:text-stone-900 transition shadow-2xs"
                          title="Open guest dining web app for this table"
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 3: CAFE OS MENU MANAGEMENT (ITEMS, CATEGORY, UNIT) */}
          {/* ======================================================== */}
          {activeSection === 'menu' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">Menu Management</h1>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
                    Restaurant catalog hierarchy: Menu Items, Menu Categories, and Menu Units with 1:1 real-time stock sync to guest tables.
                  </p>
                </div>

                {/* Dropdown Selector for Menu Catalog Sections */}
                <div className="relative inline-flex items-center self-start sm:self-auto">
                  <select
                    id="menu-catalog-view-select"
                    value={menuSubTab}
                    onChange={(e) => setMenuSubTab(e.target.value as any)}
                    className="pl-4 pr-9 py-2.5 bg-white border-2 border-stone-300 hover:border-stone-400 rounded-xl text-sm font-bold text-stone-900 shadow-xs cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-stone-400 transition"
                  >
                    <option value="units">Menu Unit ({menuUnits.length})</option>
                    <option value="categories">Menu Category ({menuCategories.length})</option>
                    <option value="items">Menu Items ({menuItems.length})</option>
                  </select>
                  <ChevronDown className="size-4 pointer-events-none absolute right-3 text-stone-700" />
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* TAB 3: MENU UNIT (Cafe OS Screenshot 1) */}
              {/* ---------------------------------------------------- */}
              {menuSubTab === 'units' && (
                <div className="space-y-4">
                  {/* Top Action Bar matching Screenshot 1 */}
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newUnitName.trim()) return;
                        if (menuUnits.includes(newUnitName.trim())) {
                          showToast('Unit already exists', 'warning');
                          return;
                        }
                        setMenuUnits([...menuUnits, newUnitName.trim()]);
                        setNewUnitName('');
                        showToast(`Unit "${newUnitName.trim()}" added`, 'success');
                      }}
                      className="flex items-center gap-2.5"
                    >
                      <input
                        type="text"
                        value={newUnitName}
                        onChange={(e) => setNewUnitName(e.target.value)}
                        placeholder="Add new unit (e.g. bora, Piece, Bowl)..."
                        className="px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-stone-400 min-w-[220px]"
                      />
                      <button
                        type="submit"
                        className={`px-4 py-2 ${clientTheme.primaryBtn} text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition cursor-pointer`}
                      >
                        + Add Unit
                      </button>
                    </form>

                    <div className="relative flex-1 max-w-sm">
                      <Search className="size-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={unitSearch}
                        onChange={(e) => setUnitSearch(e.target.value)}
                        placeholder="Search units..."
                        className="w-full pl-9 pr-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
                      />
                    </div>
                  </div>

                  {/* Menu Unit Table */}
                  <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[520px]">
                        <thead>
                          <tr className={`${clientTheme.tableHeader} text-xs font-bold uppercase tracking-wider`}>
                            <th className="py-3 px-3 w-12 text-center">#</th>
                            <th className="py-3 px-4 w-[75%]">Name</th>
                            <th className="py-3 px-3 w-[25%] text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 text-stone-800 font-sans">
                          {filteredMenuUnits.map((unit, index) => (
                            <tr key={unit} className="hover:bg-stone-50/80 transition">
                              <td className="py-3.5 px-4 text-center font-mono font-medium text-stone-500 text-sm">
                                {index + 1}
                              </td>
                              <td className="py-3.5 px-4 font-bold text-stone-900 text-sm">
                                {unit}
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => {
                                      const updated = prompt('Edit unit name:', unit);
                                      if (updated && updated.trim() && updated !== unit) {
                                        setMenuUnits(menuUnits.map((u) => (u === unit ? updated.trim() : u)));
                                        showToast(`Unit updated to "${updated.trim()}"`, 'success');
                                      }
                                    }}
                                    className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
                                    title="Edit unit"
                                  >
                                    <Edit2 className="size-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm(`Delete unit "${unit}"?`)) {
                                        setMenuUnits(menuUnits.filter((u) => u !== unit));
                                        showToast(`Unit "${unit}" removed`, 'info');
                                      }
                                    }}
                                    className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                    title="Delete unit"
                                  >
                                    <Trash2 className="size-4" />
                                  </button>
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

              {/* ---------------------------------------------------- */}
              {/* TAB 2: MENU CATEGORY (Cafe OS Screenshot 2) */}
              {/* ---------------------------------------------------- */}
              {menuSubTab === 'categories' && (
                <div className="space-y-4">
                  {/* Top Action Bar matching Screenshot 2 */}
                  <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <button
                      onClick={handleOpenAddCategory}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 ${clientTheme.primaryBtn} text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto`}
                    >
                      <Plus className="size-3.5" />
                      <span>Add Menu Category</span>
                    </button>

                    <div className="relative flex-1 max-w-md">
                      <Search className="size-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        placeholder="Search by Name | Display Name"
                        className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-stone-400"
                      />
                    </div>
                  </div>

                  {/* Menu Category Table */}
                  <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[760px]">
                        <thead>
                          <tr className={`${clientTheme.tableHeader} text-xs font-bold uppercase tracking-wider`}>
                            <th className="py-3 px-3 w-12 text-center">#</th>
                            <th className="py-3 px-4 w-[28%]">Name</th>
                            <th className="py-3 px-4 w-[24%]">Display Name</th>
                            <th className="py-3 px-3 w-[14%] text-center">Position</th>
                            <th className="py-3 px-3 w-[20%] text-center">Menu Visibility</th>
                            <th className="py-3 px-3 w-[14%] text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 text-stone-800 font-sans">
                          {filteredMenuCategories.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-12 text-center text-stone-400 text-sm">
                                No categories registered yet.
                              </td>
                            </tr>
                          ) : (
                            filteredMenuCategories.map((cat, index) => (
                              <tr key={cat.id} className="hover:bg-stone-50/80 transition">
                                <td className="py-3.5 px-4 text-center font-mono font-medium text-stone-500 text-sm">
                                  {index + 1}
                                </td>
                                <td className="py-3.5 px-4 font-bold text-stone-900 text-sm">
                                  {cat.name}
                                </td>
                                <td className="py-3.5 px-4 text-sm text-stone-700 font-medium">
                                  {cat.displayName || cat.name}
                                </td>
                                <td className="py-3.5 px-4 text-center font-mono font-bold text-stone-800 text-sm">
                                  {cat.position}
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  <div className="inline-flex items-center gap-2.5">
                                    <span className="text-xs text-stone-600 font-medium">
                                      {cat.isVisible ? 'Active' : 'Inactive'}
                                    </span>
                                    <button
                                      type="button"
                                      role="switch"
                                      aria-checked={cat.isVisible}
                                      onClick={() => {
                                        updateMenuCategory({
                                          ...cat,
                                          isVisible: !cat.isVisible,
                                        });
                                        showToast(`Category "${cat.name}" is now ${!cat.isVisible ? 'Active' : 'Hidden'}`, 'info');
                                      }}
                                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                        cat.isVisible ? 'bg-emerald-600' : 'bg-stone-300'
                                      }`}
                                    >
                                      <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                                          cat.isVisible ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                      />
                                    </button>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => handleOpenEditCategory(cat)}
                                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
                                      title="Edit category"
                                    >
                                      <Edit2 className="size-4" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (window.confirm(`Delete category "${cat.name}"?`)) {
                                          deleteMenuCategory(cat.id);
                                          showToast('Category deleted', 'info');
                                        }
                                      }}
                                      className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                      title="Delete category"
                                    >
                                      <Trash2 className="size-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* TAB 1: MENU ITEMS (Cafe OS High-Density Listing) */}
              {/* ---------------------------------------------------- */}
              {menuSubTab === 'items' && (
                <div className="space-y-4">
                  {/* Top Action Bar matching Cafe OS Screenshot 3 */}
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={handleOpenAddMenuItem}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 ${clientTheme.primaryBtn} text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition cursor-pointer`}
                      >
                        <Plus className="size-4" />
                        <span>Add Item</span>
                      </button>

                      <button
                        onClick={() => showToast('Bulk edit mode: real-time stock matrix opened', 'info')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition cursor-pointer"
                      >
                        <Sparkles className="size-4" />
                        <span>Bulk Edit</span>
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 justify-end">
                      {/* Search Input with generous space */}
                      <div className="relative flex-1 min-w-[240px] max-w-md">
                        <Search className="size-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={menuSearch}
                          onChange={(e) => setMenuSearch(e.target.value)}
                          placeholder="Search items by name, category, code, or unit..."
                          className="w-full pl-9 pr-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
                        />
                      </div>

                      {/* Category Dropdown */}
                      <div className="relative">
                        <select
                          value={menuCategoryFilter}
                          onChange={(e) => setMenuCategoryFilter(e.target.value)}
                          className="w-full sm:w-auto px-3.5 py-2 pr-9 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium text-stone-700 cursor-pointer appearance-none focus:outline-none focus:ring-1 focus:ring-stone-400"
                        >
                          <option value="All">All Categories</option>
                          {menuCategories.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.displayName || c.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="size-3.5 text-stone-400 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                      </div>

                      {/* Availability status pills */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          onClick={() => setMenuAvailabilityFilter('all')}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                            menuAvailabilityFilter === 'all'
                              ? 'bg-stone-900 text-white'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          All ({menuItems.length})
                        </button>
                        <button
                          onClick={() => setMenuAvailabilityFilter('available')}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                            menuAvailabilityFilter === 'available'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          In Stock ({menuItems.filter((i) => i.isAvailable).length})
                        </button>
                        <button
                          onClick={() => setMenuAvailabilityFilter('unavailable')}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                            menuAvailabilityFilter === 'unavailable'
                              ? 'bg-rose-600 text-white'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          Sold Out ({menuItems.filter((i) => !i.isAvailable).length})
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Cafe OS High-Density Menu Items Table */}
                  {/* Cafe OS High-Density Menu Items Table */}
                  <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[1040px]">
                        <thead>
                          <tr className={`${clientTheme.tableHeader} text-xs font-bold uppercase tracking-wider`}>
                            <th className="py-3 px-3 w-12 text-center">#</th>
                            <th className="py-3 px-4 w-[24%]">Name</th>
                            <th className="py-3 px-4 w-[16%]">Display Name</th>
                            <th className="py-3 px-3 w-[10%] text-center">Short Name</th>
                            <th className="py-3 px-3 w-[10%] text-center">Menu Unit</th>
                            <th className="py-3 px-4 w-[11%] text-right font-mono pr-6">Menu Rate</th>
                            <th className="py-3 px-3 w-[15%] text-center">Menu Category</th>
                            <th className="py-3 px-3 w-[7%] text-center">Status</th>
                            <th className="py-3 px-3 w-[7%] text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 text-stone-800 font-sans">
                          {filteredMenuItems.length === 0 ? (
                            <tr>
                              <td colSpan={9} className="py-12 text-center text-stone-400 text-sm">
                                No menu items matched the current filter.
                              </td>
                            </tr>
                          ) : (
                            filteredMenuItems.map((item, index) => (
                              <tr
                                key={item.id}
                                className={`hover:bg-stone-50/80 transition group ${
                                  !item.isAvailable ? 'bg-rose-50/30' : ''
                                }`}
                              >
                                <td className="py-3.5 px-3 text-center font-mono font-medium text-stone-500 text-xs">
                                  {index + 1}
                                </td>
                                <td className="py-3.5 px-4 font-semibold text-stone-900">
                                  <div className="text-sm font-bold text-stone-900">{item.name}</div>
                                  <div className="text-xs text-stone-500 font-normal line-clamp-1 mt-0.5">
                                    {item.description}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 text-sm text-stone-700 font-medium">
                                  {item.displayName || item.name}
                                </td>
                                <td className="py-3.5 px-3 text-center text-xs text-stone-400 font-mono">
                                  {item.shortName || '—'}
                                </td>
                                <td className="py-3.5 px-3 text-center whitespace-nowrap">
                                  <span className="inline-flex items-center justify-center min-w-[64px] px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-stone-100 text-stone-700 border border-stone-200/80">
                                    {item.unit || 'Plate'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-900 text-sm pr-6">
                                  <span className="text-stone-400 font-normal text-xs mr-1">रु.</span>
                                  {item.price}
                                </td>
                                <td className="py-3.5 px-3 text-center whitespace-nowrap">
                                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200/80">
                                    {item.category}
                                  </span>
                                </td>
                                <td className="py-3.5 px-3 text-center">
                                  <button
                                    type="button"
                                    role="switch"
                                    aria-checked={item.isAvailable}
                                    onClick={() => {
                                      toggleMenuItemAvailability(item.id);
                                      showToast(
                                        `${item.name} is now ${!item.isAvailable ? 'Available (Active)' : 'Marked as Sold Out'}`,
                                        !item.isAvailable ? 'success' : 'warning'
                                      );
                                    }}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                      item.isAvailable ? 'bg-emerald-600' : 'bg-stone-300'
                                    }`}
                                  >
                                    <span
                                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                                        item.isAvailable ? 'translate-x-5' : 'translate-x-0'
                                      }`}
                                    />
                                  </button>
                                </td>
                                <td className="py-3.5 px-3 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      onClick={() => handleOpenEditMenuItem(item)}
                                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
                                      title="Edit item"
                                    >
                                      <Edit2 className="size-4" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (window.confirm(`Delete ${item.name}?`)) {
                                          deleteMenuItem(item.id);
                                          showToast('Menu item removed', 'info');
                                        }
                                      }}
                                      className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                      title="Delete item"
                                    >
                                      <Trash2 className="size-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
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
          {/* SECTION 5: GUEST FEEDBACK & MULTI-METRIC ANALYSIS */}
          {/* ======================================================== */}
          {activeSection === 'feedback' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">Guest Experience & Feedback</h1>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Multi-metric operational audits and keyword-targeted guest sentiment analysis.
                  </p>
                </div>
              </div>

              {/* Multi-Dimensional Ratings Analysis Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {[
                  { label: 'Food & Taste', score: feedbackMetrics.food, icon: Coffee, desc: 'Quality & Flavour' },
                  { label: 'Service Speed', score: feedbackMetrics.service, icon: Clock, desc: 'Pacing & Staff' },
                  { label: 'Order Accuracy', score: feedbackMetrics.accuracy, icon: CheckCircle2, desc: 'Special Instructions' },
                  { label: 'Value for Money', score: feedbackMetrics.value, icon: DollarSign, desc: 'Portion & Pricing' },
                  { label: 'Hygiene & Clean', score: feedbackMetrics.hygiene, icon: ShieldCheck, desc: 'Table Sanity' },
                  { label: 'Ambience', score: feedbackMetrics.ambience, icon: Sparkles, desc: 'Vibe & Lighting' },
                ].map((metric) => (
                  <div key={metric.label} className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center justify-between text-stone-500 mb-2.5">
                      <span className="text-xs sm:text-sm font-bold text-stone-800">{metric.label}</span>
                      <metric.icon className="size-4 text-stone-400" />
                    </div>
                    <div className="flex items-baseline gap-1.5 my-1">
                      <span className="text-2xl sm:text-3xl font-black font-mono text-stone-900">{metric.score}</span>
                      <span className="text-amber-500 text-base sm:text-lg">★</span>
                    </div>
                    <span className="text-xs text-stone-400 mt-1 block truncate font-medium">{metric.desc}</span>
                  </div>
                ))}
              </div>

              {/* Search Bar & Rating Filter Toolbar */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
                {/* Specific Review Search (e.g. "bad", "slow", "cold", "delicious") */}
                <div className="relative flex-1 max-w-lg">
                  <Search className="size-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={feedbackSearch}
                    onChange={(e) => setFeedbackSearch(e.target.value)}
                    placeholder='Search reviews: try "bad", "slow", "cold", "momo", "chiya"...'
                    className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                  {feedbackSearch && (
                    <button
                      onClick={() => setFeedbackSearch('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>

                {/* Rating filter buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['all', 5, 4, 3, 2, 1] as const).map((star) => (
                    <button
                      key={star}
                      onClick={() => setFeedbackRatingFilter(star)}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                        feedbackRatingFilter === star
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {star === 'all' ? 'All Reviews' : `${star}★`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feed with Highlight & Full Details */}
              <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs divide-y divide-stone-100 overflow-hidden">
                {filteredFeedbacks.length === 0 ? (
                  <div className="p-12 text-center text-stone-400 text-sm">
                    No guest reviews matched "{feedbackSearch}".
                  </div>
                ) : (
                  filteredFeedbacks.map((f) => (
                    <div key={f.id} className="p-5 sm:p-6 hover:bg-stone-50/40 transition">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`size-10 sm:size-11 rounded-full font-bold text-sm flex items-center justify-center font-mono ${clientTheme.badgeBg}`}>
                            {(f.customerName || 'Guest').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                              <span>{f.customerName || 'Dining Guest'}</span>
                              {f.contactPhone && (
                                <span className="text-xs text-stone-400 font-mono font-normal">
                                  ({f.contactPhone})
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-stone-400 font-mono mt-0.5">
                              Table {f.tableNumber} • {formatDate(f.createdAt)} {f.ageGroup ? `• ${f.ageGroup}` : ''}
                            </div>
                          </div>
                        </div>

                        {/* Large, prominent star rating */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`size-4.5 sm:size-5 ${
                                s <= f.rating
                                  ? 'fill-amber-400 text-amber-500 drop-shadow-2xs'
                                  : 'text-stone-200 fill-stone-100'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-sm sm:text-base text-stone-800 pl-13 sm:pl-14 leading-relaxed font-normal">
                        "{f.comment}"
                      </p>

                      {/* Multi-metric pill breakdown if available */}
                      {f.ratings && (
                        <div className="flex flex-wrap items-center gap-2 pl-13 sm:pl-14 mt-3 text-xs font-mono text-stone-600">
                          <span className="px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200">
                            Food: {f.ratings.food}★
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200">
                            Service: {f.ratings.service}★
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200">
                            Accuracy: {f.ratings.orderAccuracy}★
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200">
                            Value: {f.ratings.valueForMoney}★
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200">
                            Hygiene: {f.ratings.hygiene}★
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200">
                            Ambience: {f.ratings.ambience}★
                          </span>
                        </div>
                      )}

                      {f.tags && f.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 pl-13 sm:pl-14 mt-2.5">
                          {f.tags.map((t, i) => (
                            <span
                              key={i}
                              className={`text-xs font-mono px-3 py-1 rounded-full ${clientTheme.accentLightBg} ${clientTheme.accentText} font-medium`}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    id: 'terracotta' as CafeTheme,
                    name: 'Himalayan Terracotta',
                    desc: 'Warm clay pot brick and spice accents. Traditional Chiya atmosphere.',
                    bg: 'bg-[#9A3412]',
                    border: 'border-[#9A3412]',
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
                    name: 'Honeycomb Amber',
                    desc: 'Crema roast and golden honeycomb. Modern artisan cafe style.',
                    bg: 'bg-amber-600',
                    border: 'border-amber-600',
                  },
                  {
                    id: 'noir' as CafeTheme,
                    name: 'Velvet Noir',
                    desc: 'Obsidian charcoal minimalism. Sleek high-end editorial bistro.',
                    bg: 'bg-stone-900',
                    border: 'border-stone-900',
                  },
                  {
                    id: 'espresso' as CafeTheme,
                    name: 'Dark Roast Espresso',
                    desc: 'Rich roasted Arabica & warm cocoa tones. Cozy heritage coffee house.',
                    bg: 'bg-[#451A03]',
                    border: 'border-[#451A03]',
                  },
                  {
                    id: 'burgundy' as CafeTheme,
                    name: 'Artisan Burgundy',
                    desc: 'Velvet berry wine & French patisserie tones. Luxurious boutique dining.',
                    bg: 'bg-[#881337]',
                    border: 'border-[#881337]',
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
              <span className={`text-[10px] font-mono uppercase tracking-wider ${clientTheme.accentText} font-semibold block mb-1`}>
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
              <div className={`mb-3 p-3 ${clientTheme.bannerBg} rounded-xl border ${clientTheme.bannerBorder} text-xs`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`font-semibold ${clientTheme.bannerText} flex items-center gap-1`}>
                    <Wifi className={`size-3.5 ${clientTheme.bannerIcon}`} />
                    Network IP (Same Wi-Fi)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isEditingLanIp) setCustomLanInput(lanHost);
                      setIsEditingLanIp(!isEditingLanIp);
                    }}
                    className={`text-[11px] ${clientTheme.bannerIcon} hover:underline font-mono cursor-pointer`}
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
                      className="flex-1 px-2.5 py-1 text-xs bg-white border border-stone-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-stone-400"
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
                      className={`px-2.5 py-1 ${clientTheme.primaryBtn} text-white rounded-lg text-xs font-semibold cursor-pointer`}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <p className={`text-[11px] ${clientTheme.bannerText}`}>
                    Host: <code className="font-mono font-bold bg-white/90 px-1 py-0.5 rounded border border-stone-200/80">{lanHost}</code>
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
                      className={`w-full py-2.5 px-4 ${clientTheme.primaryBtn} text-white font-semibold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-xs`}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={menuFormName}
                    onChange={(e) => setMenuFormName(e.target.value)}
                    placeholder="e.g. Americano"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={menuFormDisplayName}
                    onChange={(e) => setMenuFormDisplayName(e.target.value)}
                    placeholder="e.g. Americano Hot"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Short Name (POS code)
                  </label>
                  <input
                    type="text"
                    value={menuFormShortName}
                    onChange={(e) => setMenuFormShortName(e.target.value)}
                    placeholder="e.g. AMER"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Menu Unit
                  </label>
                  <select
                    value={menuFormUnit}
                    onChange={(e) => setMenuFormUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:bg-white"
                  >
                    {menuUnits.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
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
                    {menuCategories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.displayName || c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Menu Rate (रु.)
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
      {/* MODAL: ADD / EDIT MENU CATEGORY */}
      {/* ======================================================== */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-stone-200 shadow-xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <div className="mb-5">
              <span className={`text-[10px] font-mono uppercase tracking-wider ${clientTheme.accentText} font-semibold block mb-1`}>
                CAFE OS TAXONOMY
              </span>
              <h2 className="text-xl font-bold text-stone-900">
                {editingCategory ? 'Edit Menu Category' : 'Add Menu Category'}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Organize menu classification for POS and dining guests.
              </p>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={categoryFormName}
                  onChange={(e) => setCategoryFormName(e.target.value)}
                  placeholder="e.g. Burger special"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={categoryFormDisplayName}
                  onChange={(e) => setCategoryFormDisplayName(e.target.value)}
                  placeholder="e.g. Burger special"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Position (Sort Order)
                </label>
                <input
                  type="number"
                  value={categoryFormPosition}
                  onChange={(e) => setCategoryFormPosition(Number(e.target.value))}
                  placeholder="1"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div>
                  <div className="text-xs font-semibold text-stone-900">Menu Visibility</div>
                  <div className="text-[10px] text-stone-500">Show in customer digital menu</div>
                </div>
                <input
                  type="checkbox"
                  checked={categoryFormVisible}
                  onChange={(e) => setCategoryFormVisible(e.target.checked)}
                  style={{ accentColor: clientTheme.accentColor }}
                  className="size-4 rounded cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 ${clientTheme.primaryBtn} text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer`}
                >
                  {editingCategory ? 'Update Category' : 'Save Category'}
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
                  <div className={`h-full ${clientTheme.progressBarActive} rounded-full`} style={{ width: '58%' }} />
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
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-stone-200 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsHelpModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
            >
              <X className="size-4" />
            </button>

            {/* Leading Edge Software Official Header matching Cafe OS screenshot */}
            <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
              <div className="size-11 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-center justify-center p-1.5 shrink-0">
                {/* Leading Edge Geometric Motif */}
                <div className="size-full flex flex-col justify-center items-center font-black">
                  <div className="flex items-center gap-0.5">
                    <span className="w-2.5 h-2.5 bg-red-600 rounded-xs rotate-45 transform" />
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-xs rotate-45 transform" />
                  </div>
                  <span className="text-[7px] font-mono tracking-tighter text-stone-900 font-extrabold mt-0.5 leading-none">
                    LEADING EDGE
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-800 font-bold bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                  CAFE OS SUPPORT GATEWAY
                </span>
                <h2 className="text-lg font-bold text-stone-900 mt-1">Leading Edge Software</h2>
                <p className="text-xs text-stone-500">
                  Official Technical Support & Operations Portal for Kathmandu Cafe Clients
                </p>
              </div>
            </div>

            {/* Hotline & Live Support Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block mb-1">
                  KATHMANDU HQ HOTLINE
                </span>
                <div className="text-xs font-bold text-stone-900 font-mono">+977 01-4422334</div>
                <div className="text-xs font-bold text-stone-900 font-mono">+977 9801234567</div>
                <span className="text-[10px] text-emerald-700 font-medium mt-1 block">
                  Available 9:00 AM - 10:00 PM
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block mb-1">
                  ONLINE PORTAL & EMAIL
                </span>
                <div className="text-xs font-bold text-stone-900 truncate font-mono">support@leadingedge.com.np</div>
                <div className="text-xs text-cyan-700 font-mono font-medium truncate mt-0.5">
                  cafeos.leadingedge.com.np
                </div>
                <span className="text-[10px] text-stone-500 mt-1 block">
                  Average reply within 15 mins
                </span>
              </div>
            </div>

            {/* Diagnostic & Hardware Guides */}
            <div className="space-y-2 mb-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold block">
                INTEGRATIONS & HARDWARE DIAGNOSTICS
              </span>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <div className="font-semibold text-stone-900">ESC/POS Kitchen Printer (80mm)</div>
                    <div className="text-[10px] text-stone-500">LAN Printer Bridge Online • Port 9100</div>
                  </div>
                </div>
                <button
                  onClick={() => showToast('Printer test page dispatched to kitchen', 'success')}
                  className="px-2.5 py-1 bg-white border border-stone-200 hover:bg-stone-100 rounded-lg text-[11px] font-semibold text-stone-700 cursor-pointer"
                >
                  Test Print
                </button>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <div className="font-semibold text-stone-900">Fonepay Dynamic QR Merchant Node</div>
                    <div className="text-[10px] text-stone-500">Merchant Code: FONE-77291-KTM • Active</div>
                  </div>
                </div>
                <button
                  onClick={() => showToast('Fonepay node verified with settlement bank', 'success')}
                  className="px-2.5 py-1 bg-white border border-stone-200 hover:bg-stone-100 rounded-lg text-[11px] font-semibold text-stone-700 cursor-pointer"
                >
                  Verify Sync
                </button>
              </div>
            </div>

            {/* Quick Dispatch / Remote Assist Button */}
            <div className="p-3.5 rounded-xl bg-cyan-50 border border-cyan-200/80 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-cyan-950">Need Live Remote Assist?</div>
                <div className="text-[11px] text-cyan-800">
                  Allow Leading Edge engineer to remotely configure your terminal.
                </div>
              </div>
              <button
                onClick={() => showToast('Remote assist session token generated: LE-9942', 'info')}
                className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg font-bold text-xs shadow-2xs transition cursor-pointer shrink-0"
              >
                Join AnyDesk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CafeClientApp;
