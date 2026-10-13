import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  UtensilsCrossed,
  Coffee,
  Bell,
  CreditCard,
  MessageSquare,
  Search,
  Plus,
  Minus,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Send,
  AlertTriangle,
  Receipt,
  RotateCcw,
  Star,
  Wifi,
  WifiOff,
  Lock,
  MapPin,
  Info,
  X,
  QrCode,
  ArrowLeft,
  ChevronLeft,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useCafeData } from '../../context/CafeDataContext';
import { MenuItem, MenuCategory, OrderItem, CustomerFeedback, CafeTheme } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';

interface DishAddOn {
  id: string;
  name: string;
  price: number;
}

export const CustomerApp: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const tableNumberFromUrl = id ? parseInt(id, 10) : 4;
  const currentTableNumber = isNaN(tableNumberFromUrl) || tableNumberFromUrl <= 0 ? 4 : tableNumberFromUrl;

  const {
    cafeTheme,
    menuItems,
    placeOrder,
    callWaiter,
    tableAlerts,
    orders,
    settleOrderWithFonepay,
    submitFeedback,
    isNetworkVerificationEnabled,
    cafeWifiSsid,
    isGuestInsideVenue,
    setIsGuestInsideVenue,
    showToast,
    getCafeLogo,
  } = useCafeData();

  // Navigation tab: 'home' | 'menu' | 'waiter' | 'pay' | 'feedback'
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'waiter' | 'pay' | 'feedback'>('home');

  // Search & category filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Cart / active ordering session state
  const [cart, setCart] = useState<{ [itemId: string]: number }>({});
  const [isTrayExpanded, setIsTrayExpanded] = useState(false);

  // Dish showcase modal & custom add-on state
  const [selectedDishForModal, setSelectedDishForModal] = useState<MenuItem | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [dishSpecialNote, setDishSpecialNote] = useState('');

  // Waiter call state
  const [selectedReason, setSelectedReason] = useState('Water refill');
  const [waiterNote, setWaiterNote] = useState('');
  const [isCallingWaiter, setIsCallingWaiter] = useState(false);

  // Fonepay payment state
  const [isPaymentSimulated, setIsPaymentSimulated] = useState(false);

  // Feedback form state
  const [foodRating, setFoodRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [ambienceRating, setAmbienceRating] = useState(5);
  const [orderAccuracyRating, setOrderAccuracyRating] = useState(5);
  const [valueRating, setValueRating] = useState(5);
  const [hygieneRating, setHygieneRating] = useState(5);
  const [contactPhone, setContactPhone] = useState('');
  const [ageGroup, setAgeGroup] = useState('20-30');
  const [selectedTags, setSelectedTags] = useState<(
    | 'Chiya Taste'
    | 'Food Quality'
    | 'Ambience'
    | 'Service Speed'
    | 'Hospitality'
    | 'Value'
  )[]>(['Chiya Taste', 'Ambience']);
  const [customerName, setCustomerName] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);

  // Reactive theme state synced via Context + LocalStorage + CustomEvent + StorageEvent
  const [activeTheme, setActiveTheme] = useState<CafeTheme>(() => {
    try {
      const stored = localStorage.getItem('cafems_active_theme');
      if (stored && ['terracotta', 'emerald', 'amber', 'noir'].includes(stored)) {
        return stored as CafeTheme;
      }
    } catch (e) {}
    return cafeTheme || 'terracotta';
  });

  // Sync with context prop changes
  useEffect(() => {
    if (cafeTheme && cafeTheme !== activeTheme) {
      setActiveTheme(cafeTheme);
    }
  }, [cafeTheme]);

  // Sync across tabs and with custom events dispatched by client portal
  useEffect(() => {
    const handleSync = (e: any) => {
      const newTheme = e.detail || e.newValue;
      if (newTheme && ['terracotta', 'emerald', 'amber', 'noir'].includes(newTheme)) {
        setActiveTheme(newTheme as CafeTheme);
      }
    };
    window.addEventListener('cafems_theme_sync', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('cafems_theme_sync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Comprehensive, 100% color-harmonious theme tokens (Zero clashing orange on green!)
  const themeStylesMap: Record<
    CafeTheme,
    {
      name: string;
      headerBg: string;
      accentColor: string;
      primaryBtn: string;
      bannerBg: string;
      bannerDot: string;
      badgeBg: string;
      tagActive: string;
      successCardBg: string;
      successCircle: string;
      successTitle: string;
      successText: string;
      tabActive: string;
      tabIndicator: string;
      focusRing: string;
      starActive: string;
      accentText: string;
      greetingCardBg: string;
      greetingBadge: string;
      progressBarActive: string;
      progressStepActive: string;
      orderCodeColor: string;
      orderStatusPill: string;
      bottomNavActiveBg: string;
      bottomNavActiveText: string;
      tileCardBg: string;
      tileIconBg: string;
      tileHoverText: string;
    }
  > = {
    terracotta: {
      name: 'Himalayan Terracotta',
      headerBg: 'bg-[#9A3412]',
      accentColor: '#9A3412',
      primaryBtn: 'bg-[#9A3412] hover:bg-[#7C2D12] text-white',
      bannerBg: 'bg-orange-50 border-orange-200 text-orange-950',
      bannerDot: 'bg-[#9A3412]',
      badgeBg: 'bg-orange-100 text-orange-900 border-orange-200',
      tagActive: 'bg-[#9A3412] text-white',
      successCardBg: 'bg-orange-50 border-orange-200',
      successCircle: 'bg-[#9A3412] text-white',
      successTitle: 'text-orange-950',
      successText: 'text-orange-800',
      tabActive: 'text-[#9A3412]',
      tabIndicator: 'bg-[#9A3412]',
      focusRing: 'focus:ring-orange-500/20',
      starActive: 'text-orange-500',
      accentText: 'text-orange-800',
      greetingCardBg: 'bg-gradient-to-br from-[#9A3412] to-[#7C2D12] text-white border-transparent shadow-sm',
      greetingBadge: 'bg-orange-100 text-orange-900 border-orange-200',
      progressBarActive: 'bg-orange-500',
      progressStepActive: 'text-orange-400 font-bold',
      orderCodeColor: 'text-orange-400',
      orderStatusPill: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      bottomNavActiveBg: 'bg-orange-100 text-[#9A3412]',
      bottomNavActiveText: 'text-[#9A3412]',
      tileCardBg: 'bg-white hover:bg-orange-50/40 border-stone-200/90 hover:border-orange-300',
      tileIconBg: 'bg-gradient-to-br from-[#9A3412] to-[#7C2D12] text-white shadow-orange-950/20',
      tileHoverText: 'group-hover:text-[#9A3412]',
    },
    emerald: {
      name: 'Botanical Emerald',
      headerBg: 'bg-[#1B4636]',
      accentColor: '#1B4636',
      primaryBtn: 'bg-[#1B4636] hover:bg-[#123327] text-white',
      bannerBg: 'bg-emerald-50 border-emerald-200 text-emerald-950',
      bannerDot: 'bg-[#1B4636]',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      tagActive: 'bg-[#1B4636] text-white',
      successCardBg: 'bg-emerald-50 border-emerald-200',
      successCircle: 'bg-[#1B4636] text-white',
      successTitle: 'text-emerald-950',
      successText: 'text-emerald-800',
      tabActive: 'text-[#1B4636]',
      tabIndicator: 'bg-[#1B4636]',
      focusRing: 'focus:ring-emerald-500/20',
      starActive: 'text-emerald-600',
      accentText: 'text-emerald-800',
      greetingCardBg: 'bg-gradient-to-br from-[#1B4636] to-[#123327] text-white border-transparent shadow-sm',
      greetingBadge: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      progressBarActive: 'bg-emerald-400',
      progressStepActive: 'text-emerald-400 font-bold',
      orderCodeColor: 'text-emerald-400',
      orderStatusPill: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      bottomNavActiveBg: 'bg-emerald-100 text-[#1B4636]',
      bottomNavActiveText: 'text-[#1B4636]',
      tileCardBg: 'bg-white hover:bg-emerald-50/40 border-stone-200/90 hover:border-emerald-300',
      tileIconBg: 'bg-gradient-to-br from-[#1B4636] to-[#123327] text-white shadow-emerald-950/20',
      tileHoverText: 'group-hover:text-[#1B4636]',
    },
    amber: {
      name: 'Espresso Amber',
      headerBg: 'bg-[#B45309]',
      accentColor: '#B45309',
      primaryBtn: 'bg-[#B45309] hover:bg-[#92400E] text-white',
      bannerBg: 'bg-amber-50 border-amber-200 text-amber-950',
      bannerDot: 'bg-[#B45309]',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
      tagActive: 'bg-[#B45309] text-white',
      successCardBg: 'bg-amber-50 border-amber-200',
      successCircle: 'bg-[#B45309] text-white',
      successTitle: 'text-amber-950',
      successText: 'text-amber-800',
      tabActive: 'text-[#B45309]',
      tabIndicator: 'bg-[#B45309]',
      focusRing: 'focus:ring-amber-500/20',
      starActive: 'text-amber-500',
      accentText: 'text-amber-800',
      greetingCardBg: 'bg-gradient-to-br from-[#92400E] to-[#78350F] text-white border-transparent shadow-sm',
      greetingBadge: 'bg-amber-100 text-amber-900 border-amber-200',
      progressBarActive: 'bg-amber-400',
      progressStepActive: 'text-amber-400 font-bold',
      orderCodeColor: 'text-amber-400',
      orderStatusPill: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      bottomNavActiveBg: 'bg-amber-100 text-[#B45309]',
      bottomNavActiveText: 'text-[#B45309]',
      tileCardBg: 'bg-white hover:bg-amber-50/40 border-stone-200/90 hover:border-amber-300',
      tileIconBg: 'bg-gradient-to-br from-[#B45309] to-[#92400E] text-white shadow-amber-950/20',
      tileHoverText: 'group-hover:text-[#B45309]',
    },
    noir: {
      name: 'Velvet Noir',
      headerBg: 'bg-[#18181B]',
      accentColor: '#18181B',
      primaryBtn: 'bg-[#18181B] hover:bg-black text-white',
      bannerBg: 'bg-stone-100 border-stone-300 text-stone-900',
      bannerDot: 'bg-stone-900',
      badgeBg: 'bg-stone-200 text-stone-900 border-stone-300',
      tagActive: 'bg-stone-900 text-white',
      successCardBg: 'bg-stone-100 border-stone-300',
      successCircle: 'bg-stone-900 text-white',
      successTitle: 'text-stone-950',
      successText: 'text-stone-700',
      tabActive: 'text-stone-900',
      tabIndicator: 'bg-stone-900',
      focusRing: 'focus:ring-stone-500/20',
      starActive: 'text-stone-900',
      accentText: 'text-stone-900',
      greetingCardBg: 'bg-gradient-to-br from-[#1C1917] to-[#0C0A09] text-white border-stone-800 shadow-sm',
      greetingBadge: 'bg-stone-200 text-stone-900 border-stone-300',
      progressBarActive: 'bg-stone-200',
      progressStepActive: 'text-stone-200 font-bold',
      orderCodeColor: 'text-stone-300',
      orderStatusPill: 'bg-stone-700 text-stone-200 border-stone-600',
      bottomNavActiveBg: 'bg-stone-200 text-stone-900',
      bottomNavActiveText: 'text-stone-900',
      tileCardBg: 'bg-white hover:bg-stone-100 border-stone-200/90 hover:border-stone-400',
      tileIconBg: 'bg-gradient-to-br from-[#27272A] to-[#18181B] text-white shadow-stone-900/20',
      tileHoverText: 'group-hover:text-stone-900',
    },
    espresso: {
      name: 'Dark Roast Espresso',
      headerBg: 'bg-[#451A03]',
      accentColor: '#78350F',
      primaryBtn: 'bg-[#451A03] hover:bg-[#351401] text-white',
      bannerBg: 'bg-amber-50 border-amber-300 text-amber-950',
      bannerDot: 'bg-[#451A03]',
      badgeBg: 'bg-amber-100 text-amber-950 border-amber-300',
      tagActive: 'bg-[#451A03] text-white',
      successCardBg: 'bg-amber-50 border-amber-300',
      successCircle: 'bg-[#451A03] text-white',
      successTitle: 'text-amber-950',
      successText: 'text-amber-900',
      tabActive: 'text-[#451A03]',
      tabIndicator: 'bg-[#451A03]',
      focusRing: 'focus:ring-amber-900/20',
      starActive: 'text-amber-700',
      accentText: 'text-[#451A03]',
      greetingCardBg: 'bg-gradient-to-br from-[#451A03] to-[#270E02] text-white border-transparent shadow-sm',
      greetingBadge: 'bg-amber-200/90 text-amber-950 border-amber-300',
      progressBarActive: 'bg-amber-600',
      progressStepActive: 'text-amber-400 font-bold',
      orderCodeColor: 'text-amber-300',
      orderStatusPill: 'bg-amber-900/40 text-amber-200 border-amber-700/50',
      bottomNavActiveBg: 'bg-amber-100 text-[#451A03]',
      bottomNavActiveText: 'text-[#451A03]',
      tileCardBg: 'bg-white hover:bg-amber-50/40 border-stone-200/90 hover:border-amber-400',
      tileIconBg: 'bg-gradient-to-br from-[#451A03] to-[#270E02] text-white shadow-amber-950/20',
      tileHoverText: 'group-hover:text-[#451A03]',
    },
    burgundy: {
      name: 'Artisan Burgundy',
      headerBg: 'bg-[#881337]',
      accentColor: '#9F1239',
      primaryBtn: 'bg-[#881337] hover:bg-[#4C0519] text-white',
      bannerBg: 'bg-rose-50 border-rose-200 text-rose-950',
      bannerDot: 'bg-[#881337]',
      badgeBg: 'bg-rose-100 text-rose-900 border-rose-200',
      tagActive: 'bg-[#881337] text-white',
      successCardBg: 'bg-rose-50 border-rose-200',
      successCircle: 'bg-[#881337] text-white',
      successTitle: 'text-rose-950',
      successText: 'text-rose-900',
      tabActive: 'text-[#881337]',
      tabIndicator: 'bg-[#881337]',
      focusRing: 'focus:ring-rose-900/20',
      starActive: 'text-rose-600',
      accentText: 'text-[#881337]',
      greetingCardBg: 'bg-gradient-to-br from-[#881337] to-[#4C0519] text-white border-transparent shadow-sm',
      greetingBadge: 'bg-rose-200/90 text-rose-950 border-rose-300',
      progressBarActive: 'bg-rose-500',
      progressStepActive: 'text-rose-300 font-bold',
      orderCodeColor: 'text-rose-300',
      orderStatusPill: 'bg-rose-900/40 text-rose-200 border-rose-700/50',
      bottomNavActiveBg: 'bg-rose-100 text-[#881337]',
      bottomNavActiveText: 'text-[#881337]',
      tileCardBg: 'bg-white hover:bg-rose-50/40 border-stone-200/90 hover:border-rose-300',
      tileIconBg: 'bg-gradient-to-br from-[#881337] to-[#4C0519] text-white shadow-rose-950/20',
      tileHoverText: 'group-hover:text-[#881337]',
    },
  };

  const themeStyles = themeStylesMap[activeTheme] || themeStylesMap.terracotta;

  // Active table order from store
  const activeTableOrder = orders.find(
    (o) => o.tableNumber === currentTableNumber && o.status !== 'Completed'
  );

  // Active alerts for this specific table
  const activeTableAlert = tableAlerts.find(
    (a) => a.tableNumber === currentTableNumber && a.status === 'Active'
  );

  // Category list
  const categories: string[] = [
    'All',
    'Chiya & Teas',
    'Specialty Coffee',
    'Bakery & Bites',
    'Mains & Bowls',
    'Desserts',
  ];

  // Waiter quick reasons
  const waiterReasons = [
    'Water refill',
    'Ready to order',
    'Bill please',
    'Extra cutlery / napkins',
    'Clear table',
    'Assistance needed',
  ];

  // Category-tailored add-ons mapping
  const getAddOnsForDish = (item: MenuItem): DishAddOn[] => {
    if (item.category === 'Chiya & Teas') {
      return [
        { id: 'matka', name: 'Clay Matka Earthenware Cup', price: 0 },
        { id: 'sugar_less', name: 'Less Sugar / No Sugar', price: 0 },
        { id: 'extra_ginger', name: 'Extra Crushed Ginger & Clove', price: 20 },
        { id: 'buffalo_milk', name: 'Rich Buffalo Milk Brew', price: 30 },
        { id: 'oat_milk', name: 'Oat Milk Substitution', price: 50 },
      ];
    }
    if (item.category === 'Specialty Coffee') {
      return [
        { id: 'extra_shot', name: 'Extra Espresso Shot', price: 40 },
        { id: 'oat_milk', name: 'Oat Milk Substitution', price: 50 },
        { id: 'less_sugar', name: 'Less Sugar / Unsweetened', price: 0 },
        { id: 'vanilla_drizzle', name: 'Vanilla Bean Drizzle', price: 30 },
      ];
    }
    if (item.category === 'Mains & Bowls') {
      return [
        { id: 'extra_jhol', name: 'Extra Spicy Jhol / Sesame Achar', price: 30 },
        { id: 'fried_crisp', name: 'Crispy Pan-Fried Finish', price: 40 },
        { id: 'poached_egg', name: 'Organic Poached Egg', price: 40 },
        { id: 'mild_spice', name: 'Mild Spicing (Low Heat)', price: 0 },
      ];
    }
    if (item.category === 'Bakery & Bites') {
      return [
        { id: 'warmed', name: 'Oven Warmed & Crispy', price: 0 },
        { id: 'extra_honey', name: 'Himalayan Honey & Whipped Butter', price: 40 },
        { id: 'whipped_cream', name: 'Artisanal Whipped Cream', price: 30 },
      ];
    }
    return [
      { id: 'extra_pistachio', name: 'Toasted Pistachio & Saffron', price: 30 },
      { id: 'less_sweet', name: 'Light Sweetness', price: 0 },
    ];
  };

  const handleToggleAddOn = (addOnName: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnName)
        ? prev.filter((item) => item !== addOnName)
        : [...prev, addOnName]
    );
  };

  const handleCallWaiterWithDish = async () => {
    if (!selectedDishForModal) return;

    if (isNetworkVerificationEnabled && !isGuestInsideVenue) {
      showToast(
        'Staff alerts are restricted to guests physically seated inside the cafe.',
        'warning'
      );
      return;
    }

    setIsCallingWaiter(true);
    const addOnSummary = selectedAddOns.length > 0 ? ` with ${selectedAddOns.join(', ')}` : '';
    const noteSummary = dishSpecialNote.trim() ? ` [${dishSpecialNote.trim()}]` : '';
    const orderSpec = `1× ${selectedDishForModal.name}${addOnSummary}${noteSummary}`;

    await callWaiter(currentTableNumber, orderSpec);
    setIsCallingWaiter(false);
    setSelectedDishForModal(null);
    setSelectedAddOns([]);
    setDishSpecialNote('');
    showToast(`Staff alerted! Waiter is on their way for your ${selectedDishForModal.name}.`, 'success');
  };

  const handleAddCustomizedDishToCart = () => {
    if (!selectedDishForModal) return;
    handleAddToCart(selectedDishForModal);
    setSelectedDishForModal(null);
    setSelectedAddOns([]);
    setDishSpecialNote('');
  };

  const dishBasePrice = selectedDishForModal ? selectedDishForModal.price : 0;
  const currentAddOns = selectedDishForModal ? getAddOnsForDish(selectedDishForModal) : [];
  const addOnsTotalPrice = selectedAddOns.reduce((sum, name) => {
    const found = currentAddOns.find((a) => a.name === name);
    return sum + (found ? found.price : 0);
  }, 0);
  const modalTotalPrice = dishBasePrice + addOnsTotalPrice;

  const isSelectedDishVegetarian = selectedDishForModal
    ? selectedDishForModal.id !== 'm-9' &&
      !selectedDishForModal.name.toLowerCase().includes('chicken') &&
      !selectedDishForModal.name.toLowerCase().includes('egg') &&
      !selectedDishForModal.name.toLowerCase().includes('meat')
    : true;

  // Helper to cleanly format the staff notification banner so it never overflows or looks clunky
  const formatStaffAlert = (alert: { type: string; note?: string }) => {
    const raw = alert.type || '';
    const note = alert.note || '';
    const combined = `${raw} ${note}`.trim();

    if (combined.toLowerCase().includes('order') || combined.includes('×') || combined.includes('x')) {
      const targetText = note || raw.replace(/^Order Request:\s*/i, '');
      const parts = targetText.split(/,|\band\b/i);
      const firstItem = parts[0].trim();
      
      // Clean up add-on suffix if present
      const hasAddOns = /with\s+/i.test(firstItem);
      const cleanFirstItem = firstItem.replace(/\s+with\s+.*$/i, '').replace(/\[.*\]/g, '').trim();

      let summary = cleanFirstItem || 'Table Order';
      if (parts.length > 1) {
        summary += ` +${parts.length - 1} more`;
      } else if (hasAddOns) {
        summary += ' (+add-on)';
      }

      return {
        badge: 'Order Request',
        title: 'Table Order',
        details: summary,
      };
    }

    if (combined.toLowerCase().includes('bill')) {
      return {
        badge: 'Bill',
        title: 'Bill Request',
        details: 'Bill requested',
      };
    }

    return {
      badge: 'Waiter',
      title: 'Staff Notified',
      details: raw || 'Assistance requested',
    };
  };

  // Dynamic greeting based on current local hour
  const getDynamicGreetingInfo = () => {
    const hour = new Date().getHours();
    const commonSubtitle =
      'Look through the menu. When you are ready, call a waiter and we will take your order.';
    if (hour >= 5 && hour < 12) {
      return {
        greeting: 'Good morning',
        subtitle: commonSubtitle,
      };
    }
    if (hour >= 12 && hour < 17) {
      return {
        greeting: 'Good afternoon',
        subtitle: commonSubtitle,
      };
    }
    if (hour >= 17 && hour < 22) {
      return {
        greeting: 'Good evening',
        subtitle: commonSubtitle,
      };
    }
    return {
      greeting: 'Late night cravings',
      subtitle: commonSubtitle,
    };
  };

  const greetingInfo = getDynamicGreetingInfo();

  // Real-time link between Client and Customer: Show all items so sold-out status is 1:1 synced
  const filteredMenuItems = menuItems.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      (item.displayName && item.displayName.toLowerCase().includes(q)) ||
      (item.shortName && item.shortName.toLowerCase().includes(q)) ||
      item.description.toLowerCase().includes(q);
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Curated House Favorites prioritizing Momo, Masala Chiya, and Sweet Lassi
  const priorityFavoriteIds = ['m-9', 'm-1', 'm-10', 'm-3', 'm-6', 'm-5'];
  const popularItems = (() => {
    const list: MenuItem[] = [];
    priorityFavoriteIds.forEach((id) => {
      const found = menuItems.find((m) => m.id === id);
      if (found && !list.some((item) => item.id === found.id)) {
        list.push(found);
      }
    });
    menuItems.forEach((item) => {
      if (list.length < 4 && !list.some((p) => p.id === item.id)) {
        list.push(item);
      }
    });
    return list.slice(0, 4);
  })();

  // Cart calculations
  const cartItemIds = Object.keys(cart).filter((id) => cart[id] > 0);
  const totalCartCount = cartItemIds.reduce((sum, id) => sum + cart[id], 0);
  const cartSubtotal = cartItemIds.reduce((sum, id) => {
    const item = menuItems.find((m) => m.id === id);
    return sum + (item ? item.price * cart[id] : 0);
  }, 0);

  // Bill calculation for payment tab
  const billItems: OrderItem[] = activeTableOrder?.items || [
    { menuItemId: 'm-9', name: 'Chicken Steam Momo', price: 320, quantity: 2 },
    { menuItemId: 'm-1', name: 'Masala Chiya', price: 140, quantity: 2 },
    { menuItemId: 'm-10', name: 'Sweet Lassi', price: 180, quantity: 1 },
  ];
  const billSubtotal = billItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const billVat = Math.round(billSubtotal * 0.1);
  const billGrandTotal = billSubtotal + billVat;
  const fonepayRefNumber = `FN-${currentTableNumber}04-${Math.floor(1000 + Math.random() * 9000)}`;

  // Cart operations
  const handleAddToCart = (item: MenuItem) => {
    if (!item.isAvailable) {
      showToast(`${item.name} is currently sold out.`, 'warning');
      return;
    }
    setCart((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
    showToast(`Added ${item.name} to order`, 'success');
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[itemId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: next };
    });
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (cartItemIds.length === 0) return;

    if (isNetworkVerificationEnabled && !isGuestInsideVenue) {
      showToast(
        `Ordering locked: You must be connected to ${cafeWifiSsid} inside Cafe XYZ to place orders.`,
        'warning'
      );
      return;
    }

    const items: OrderItem[] = cartItemIds.map((id) => {
      const m = menuItems.find((item) => item.id === id)!;
      return {
        menuItemId: m.id,
        name: m.name,
        price: m.price,
        quantity: cart[id],
      };
    });

    await placeOrder(currentTableNumber, items);
    setCart({});
    setIsTrayExpanded(false);
    showToast(`Order sent to kitchen for Table ${currentTableNumber}!`, 'success');
  };

  // Dispatch waiter call
  const handleCallWaiter = async () => {
    if (isNetworkVerificationEnabled && !isGuestInsideVenue) {
      showToast(
        'Staff alerts are restricted to guests physically seated inside the cafe.',
        'warning'
      );
      return;
    }

    setIsCallingWaiter(true);
    const combinedNote = `${selectedReason}${waiterNote ? `: ${waiterNote}` : ''}`;
    await callWaiter(currentTableNumber, combinedNote);
    setIsCallingWaiter(false);
    setWaiterNote('');
    showToast(`Staff alerted for Table ${currentTableNumber}`, 'success');
  };

  // Simulate Fonepay Payment
  const handleSimulatePayment = async () => {
    if (activeTableOrder) {
      await settleOrderWithFonepay(activeTableOrder.id, currentTableNumber);
    }
    setIsPaymentSimulated(true);
    showToast('Payment verified via Fonepay Nepal QR!', 'success');
  };

  // Submit Feedback
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    const avgScore = Math.round(
      (foodRating + serviceRating + ambienceRating + orderAccuracyRating + valueRating + hygieneRating) / 6
    );
    await submitFeedback({
      tableNumber: currentTableNumber,
      orderId: activeTableOrder?.id,
      customerName: customerName.trim() || 'Dining Guest',
      contactPhone: contactPhone.trim() || undefined,
      ageGroup,
      rating: avgScore,
      ratings: {
        food: foodRating,
        service: serviceRating,
        orderAccuracy: orderAccuracyRating,
        valueForMoney: valueRating,
        hygiene: hygieneRating,
        ambience: ambienceRating,
        overall: avgScore,
      },
      comment: feedbackText || 'Wonderful dining and chiya experience.',
      tags: selectedTags,
    });
    setIsFeedbackSent(true);
    showToast('Thank you! Your feedback has been sent to Cafe XYZ.', 'success');
  };

  const toggleTag = (
    tag: 'Chiya Taste' | 'Food Quality' | 'Ambience' | 'Service Speed' | 'Hospitality' | 'Value'
  ) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="min-h-[100dvh] h-[100dvh] bg-[#F4F4F0] text-stone-900 flex justify-center items-center p-0 sm:p-3 md:p-4 font-sans antialiased overflow-hidden">
      {/* Mobile viewport container: 100dvh dynamic mobile height with iOS safe-area support */}
      <div className="w-full sm:max-w-[420px] h-[100dvh] sm:h-[min(840px,95vh)] bg-white sm:rounded-3xl sm:border sm:border-stone-200/90 sm:shadow-2xl flex flex-col overflow-hidden relative">        {/* 1. CLEAN APP BAR */}
        <header className={`${themeStyles.headerBg} text-white px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between shrink-0 shadow-xs transition-colors duration-300`}>
          <div className="flex items-center gap-2.5 min-w-0">
            {activeTab !== 'home' && (
              <button
                onClick={() => setActiveTab('home')}
                className="size-8 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer active:scale-95 shrink-0"
                title="Back to Welcome Portal"
                aria-label="Back to Welcome Portal"
              >
                <ArrowLeft className="size-4.5" />
              </button>
            )}

            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 cursor-pointer group text-left transition hover:opacity-95 min-w-0"
              title="Return to Welcome Portal"
            >
              <div className="size-9 rounded-xl bg-white/20 border border-white/25 backdrop-blur-xs text-white flex items-center justify-center shadow-xs overflow-hidden p-0.5 group-hover:scale-105 transition-transform shrink-0">
                <img
                  src={getCafeLogo('c-1')}
                  alt="Cafe Logo"
                  className="size-full object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="truncate">
                <div className="font-black text-base tracking-tight leading-tight text-white drop-shadow-2xs truncate">Cafe XYZ</div>
                <div className="text-[11px] text-white/85 font-medium tracking-normal leading-tight truncate">Specialty Chiya & Kitchen</div>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/25 text-xs font-bold font-mono text-white shadow-xs">
              <span className={`size-2 rounded-full ${isGuestInsideVenue ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>Table {currentTableNumber}</span>
            </div>
          </div>
        </header>

        {/* 2. ACTIVE NOTIFICATION / WAITER STATUS CHIP (COMPACT & SLEEK, NEVER CLUNKY) */}
        {activeTableAlert && (() => {
          const alertInfo = formatStaffAlert(activeTableAlert);
          return (
            <div className={`${themeStyles.bannerBg} px-4 py-2.5 flex items-center justify-between gap-3 text-xs shrink-0 border-b shadow-2xs transition-all`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="relative flex size-2 shrink-0">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${themeStyles.bannerDot} opacity-75`} />
                  <span className={`relative inline-flex rounded-full size-2 ${themeStyles.bannerDot}`} />
                </span>
                <div className="min-w-0 flex items-center gap-1.5 truncate">
                  <span className="opacity-80 shrink-0">Staff notified:</span>
                  <span className="font-bold truncate">{alertInfo.details}</span>
                </div>
              </div>
              <span className="shrink-0 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 opacity-90 border border-black/5">
                En route
              </span>
            </div>
          );
        })()}

        {/* 3. SCROLLABLE SCREEN CONTENT */}
        <div className="flex-1 overflow-y-auto no-scrollbar overscroll-contain p-4 pb-24 space-y-4">
          {/* ======================================================== */}
          {/* TAB 0: OPENING / WELCOME DASHBOARD (4 TILES SYSTEM) */}
          {/* ======================================================== */}
          {activeTab === 'home' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Dynamic Time-Aware Welcoming Greeting Card with Rich Artistic Background */}
              <div className={`relative p-5 sm:p-6 rounded-2xl ${themeStyles.greetingCardBg} overflow-hidden transition-all duration-300 shadow-sm`}>
                {/* Decorative overlapping translucent background circles */}
                <div className="absolute -right-8 -bottom-10 size-44 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute right-6 -top-10 size-32 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute -right-2 top-8 size-20 rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute right-24 bottom-2 size-12 rounded-full bg-white/5 pointer-events-none" />

                <div className="relative z-10 max-w-[280px] sm:max-w-[340px]">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2 drop-shadow-xs">
                    {greetingInfo.greeting}
                  </h2>
                  <p className="text-xs sm:text-[13px] text-white/90 leading-relaxed font-medium">
                    {greetingInfo.subtitle}
                  </p>
                </div>
              </div>

              {/* Title & prompt prompting customer to select */}
              <div className="pt-0.5 px-0.5">
                <h3 className="text-base font-bold text-stone-900 tracking-tight">
                  What are you looking for today?
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  Click on an item to continue
                </p>
              </div>

              {/* 4-Tile Grid System (2x2) - 100% Theme Adaptive with Clean Layout */}
              <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                {/* 1. Menu Tile */}
                <button
                  onClick={() => setActiveTab('menu')}
                  className={`group relative p-4 sm:p-5 rounded-2xl sm:rounded-3xl ${themeStyles.tileCardBg} shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[135px] sm:min-h-[145px] text-left active:scale-[0.98] border`}
                >
                  <div className={`size-12 sm:size-13 rounded-2xl ${themeStyles.tileIconBg} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                    <Coffee className="size-6 text-white" />
                  </div>
                  <div>
                    <div className={`font-bold text-base sm:text-lg text-stone-900 ${themeStyles.tileHoverText} transition-colors`}>
                      Menu
                    </div>
                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      Brews, bites & kitchen food
                    </p>
                  </div>
                </button>

                {/* 2. Call Waiter Tile */}
                <button
                  onClick={() => setActiveTab('waiter')}
                  className={`group relative p-4 sm:p-5 rounded-2xl sm:rounded-3xl ${themeStyles.tileCardBg} shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[135px] sm:min-h-[145px] text-left active:scale-[0.98] border`}
                >
                  <div className={`size-12 sm:size-13 rounded-2xl ${themeStyles.tileIconBg} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                    <Bell className="size-6 text-white" />
                  </div>
                  <div>
                    <div className={`font-bold text-base sm:text-lg text-stone-900 ${themeStyles.tileHoverText} transition-colors`}>
                      Call Waiter
                    </div>
                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      Water, refill & service
                    </p>
                  </div>
                </button>

                {/* 3. Fonepay QR Tile */}
                <button
                  onClick={() => setActiveTab('pay')}
                  className={`group relative p-4 sm:p-5 rounded-2xl sm:rounded-3xl ${themeStyles.tileCardBg} shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[135px] sm:min-h-[145px] text-left active:scale-[0.98] border`}
                >
                  <div className={`size-12 sm:size-13 rounded-2xl ${themeStyles.tileIconBg} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                    <QrCode className="size-6 text-white" />
                  </div>
                  <div>
                    <div className={`font-bold text-base sm:text-lg text-stone-900 ${themeStyles.tileHoverText} transition-colors`}>
                      Fonepay QR
                    </div>
                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      Scan & settle table bill
                    </p>
                  </div>
                </button>

                {/* 4. Review Tile */}
                <button
                  onClick={() => setActiveTab('feedback')}
                  className={`group relative p-4 sm:p-5 rounded-2xl sm:rounded-3xl ${themeStyles.tileCardBg} shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[135px] sm:min-h-[145px] text-left active:scale-[0.98] border`}
                >
                  <div className={`size-12 sm:size-13 rounded-2xl ${themeStyles.tileIconBg} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                    <Star className="size-6 text-white" />
                  </div>
                  <div>
                    <div className={`font-bold text-base sm:text-lg text-stone-900 ${themeStyles.tileHoverText} transition-colors`}>
                      Review
                    </div>
                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      Rate dining & ambience
                    </p>
                  </div>
                </button>
              </div>

              {/* Live Kitchen Order Progress Tracker Card (Shown when order exists) */}
              {activeTableOrder && (
                <div className="p-4 rounded-2xl bg-stone-900 text-white shadow-sm space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold ${themeStyles.orderCodeColor}`}>
                        {`ORD-${activeTableOrder.tableNumber}01`}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">Live Kitchen Order</span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${themeStyles.orderStatusPill} border`}>
                      {activeTableOrder.status}
                    </span>
                  </div>

                  <p className="text-xs text-stone-300 leading-snug line-clamp-2">
                    {activeTableOrder.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                  </p>

                  <div className="pt-1 space-y-1.5">
                    <div className="grid grid-cols-4 gap-1.5">
                      {['Received', 'Preparing', 'Ready', 'Served'].map((step, idx) => {
                        const currentStatus = activeTableOrder.status;
                        const stepOrder = ['Received', 'Preparing', 'Ready', 'Served'];
                        const currentIdx = stepOrder.indexOf(currentStatus);
                        const isCompleted = idx <= (currentIdx >= 0 ? currentIdx : 3);

                        return (
                          <div
                            key={step}
                            className={`h-1.5 rounded-full transition-all ${
                              isCompleted ? themeStyles.progressBarActive : 'bg-stone-700'
                            }`}
                          />
                        );
                      })}
                    </div>
                    <div className="grid grid-cols-4 text-[9px] font-mono text-center text-stone-400">
                      <span>Received</span>
                      <span>Preparing</span>
                      <span>Ready</span>
                      <span className={themeStyles.progressStepActive}>Served</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Hospitality info footer card */}
              <div className="p-3.5 rounded-2xl bg-stone-100/90 border border-stone-200/80 text-xs text-stone-600 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="size-4 text-stone-500" />
                  <span className="text-[11px] font-medium text-stone-700">Wi-Fi: {cafeWifiSsid || 'Cafe-XYZ-Guest'}</span>
                </div>
                <span className="text-[11px] font-mono text-stone-500 font-medium">Table {currentTableNumber}</span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 1: MENU VIEW */}
          {/* ======================================================== */}
          {activeTab === 'menu' && (
            <div className="space-y-4 animate-fadeIn">

              {/* Live Kitchen Order Progress Tracker Card (Shown only when order exists) */}
              {activeTableOrder && (
                <div className="p-4 rounded-2xl bg-stone-900 text-white shadow-sm space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold ${themeStyles.orderCodeColor}`}>
                        {`ORD-${activeTableOrder.tableNumber}01`}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">Live Kitchen Order</span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${themeStyles.orderStatusPill} border`}>
                      {activeTableOrder.status}
                    </span>
                  </div>

                  <p className="text-xs text-stone-300 leading-snug line-clamp-2">
                    {activeTableOrder.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                  </p>

                  {/* 4-Step Progress Bar matching exact active theme */}
                  <div className="pt-1 space-y-1.5">
                    <div className="grid grid-cols-4 gap-1.5">
                      {['Received', 'Preparing', 'Ready', 'Served'].map((step, idx) => {
                        const currentStatus = activeTableOrder.status;
                        const stepOrder = ['Received', 'Preparing', 'Ready', 'Served'];
                        const currentIdx = stepOrder.indexOf(currentStatus);
                        const isCompleted = idx <= (currentIdx >= 0 ? currentIdx : 3);

                        return (
                          <div
                            key={step}
                            className={`h-1.5 rounded-full transition-all ${
                              isCompleted ? themeStyles.progressBarActive : 'bg-stone-700'
                            }`}
                          />
                        );
                      })}
                    </div>
                    <div className="grid grid-cols-4 text-[9px] font-mono text-center text-stone-400">
                      <span>Received</span>
                      <span>Preparing</span>
                      <span>Ready</span>
                      <span className={themeStyles.progressStepActive}>Served</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Search Bar */}
              <div className="relative">
                <Search className="size-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tea brews, coffee, bites..."
                  className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              {/* Popular Picks Horizontal Scroll (Textual, No Photos) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    House Favorites
                  </h3>
                  <span className="text-[11px] text-stone-400 font-mono">Curated picks</span>
                </div>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
                  {popularItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedDishForModal(item);
                        setSelectedAddOns([]);
                        setDishSpecialNote('');
                      }}
                      className="w-32 shrink-0 p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-left transition cursor-pointer hover:border-stone-400 hover:bg-stone-100/70 active:scale-[0.98] group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-md bg-stone-200/80 text-stone-700 font-bold">
                            {item.unit || 'Plate'}
                          </span>
                          {!item.isAvailable && (
                            <span className="text-[9px] font-mono px-1 py-0.5 rounded-md bg-rose-100 text-rose-700 font-bold">
                              Sold Out
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-bold text-stone-900 line-clamp-1">{item.name}</div>
                      </div>
                      <div className="text-[11px] font-mono font-bold text-stone-900 mt-2">
                        {formatCurrency(item.price)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === cat
                        ? `${themeStyles.primaryBtn} text-white shadow-xs`
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Dish List (Textual, With Rich Description, Unit & 1:1 Live Sold-out status) */}
              <div className="space-y-3 pt-1">
                {filteredMenuItems.map((item) => {
                  const isInCart = cart[item.id] > 0;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedDishForModal(item);
                        setSelectedAddOns([]);
                        setDishSpecialNote('');
                      }}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer group active:bg-stone-50/50 flex items-start justify-between gap-3 ${
                        !item.isAvailable
                          ? 'bg-stone-50/60 border-stone-200/60 opacity-80'
                          : 'bg-white border-stone-200/80 shadow-xs hover:border-stone-300'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`size-2 rounded-full shrink-0 ${
                              !item.isAvailable
                                ? 'bg-rose-500'
                                : item.category === 'Bakery & Bites' || item.category === 'Mains & Bowls'
                                ? 'bg-amber-600'
                                : 'bg-emerald-600'
                            }`}
                          />
                          <h4 className="text-xs font-bold text-stone-900 truncate group-hover:text-amber-950 transition-colors">
                            {item.name}
                          </h4>
                          {item.unit && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-600 border border-stone-200/60">
                              {item.unit}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="text-xs font-bold font-mono text-stone-900 mt-2 flex items-center gap-2">
                          <span>{formatCurrency(item.price)}</span>
                          <span className="text-[10px] text-stone-400 font-sans font-normal underline decoration-dotted">
                            Options & add-ons →
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 pt-0.5" onClick={(e) => e.stopPropagation()}>
                        {!item.isAvailable ? (
                          <span className="px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold bg-stone-200 text-stone-500 cursor-not-allowed">
                            Sold Out
                          </span>
                        ) : isInCart ? (
                          <div className="flex items-center gap-2 bg-stone-100 border border-stone-200 rounded-full p-1">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                              className="size-6 rounded-full bg-white text-stone-700 flex items-center justify-center hover:bg-stone-200 transition cursor-pointer"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="text-xs font-mono font-bold text-stone-900 min-w-4 text-center">
                              {cart[item.id]}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                              className={`size-6 rounded-full ${themeStyles.primaryBtn} flex items-center justify-center text-white`}
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: CALL WAITER */}
          {/* ======================================================== */}
          {activeTab === 'waiter' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs text-center">
                <div className="size-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
                  <Bell className="size-6" />
                </div>
                <h3 className="text-base font-bold text-stone-900">Need Table Service?</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Alert your server directly at Table {currentTableNumber}. The kitchen will be notified immediately.
                </p>

                {/* Reason Selection Chips */}
                <div className="my-5 text-left">
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-2">
                    Select Reason
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {waiterReasons.map((reason) => (
                      <button
                        key={reason}
                        onClick={() => setSelectedReason(reason)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          selectedReason === reason
                            ? `${themeStyles.primaryBtn} text-white shadow-xs`
                            : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Note */}
                <div className="mb-5 text-left">
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                    Optional Note
                  </label>
                  <input
                    type="text"
                    value={waiterNote}
                    onChange={(e) => setWaiterNote(e.target.value)}
                    placeholder="e.g. Warm water with lemon"
                    className={`w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 ${themeStyles.focusRing}`}
                  />
                </div>

                {/* Action Call Button */}
                <button
                  disabled={isCallingWaiter || (isNetworkVerificationEnabled && !isGuestInsideVenue)}
                  onClick={handleCallWaiter}
                  className={`w-full py-3.5 px-4 ${
                    isNetworkVerificationEnabled && !isGuestInsideVenue
                      ? 'bg-stone-200 text-stone-500 cursor-not-allowed border border-stone-300'
                      : `${themeStyles.primaryBtn} text-white shadow-md`
                  } font-bold rounded-2xl text-xs transition cursor-pointer flex items-center justify-center gap-2`}
                >
                  {isNetworkVerificationEnabled && !isGuestInsideVenue ? (
                    <>
                      <Lock className="size-4" />
                      <span>Restricted: Venue Wi-Fi Required</span>
                    </>
                  ) : (
                    <>
                      <Bell className="size-4" />
                      <span>Call Waiter to Table {currentTableNumber}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-600 space-y-2">
                <div className="font-semibold text-stone-900">Hospitality Promise</div>
                <p className="text-[11px] text-stone-500">
                  Floor captains monitor requests live from Cafe XYZ kitchen. Average response time is under 90 seconds.
                </p>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: PAY WITH FONEPAY (ONLY QR CODE - NO AMOUNT) */}
          {/* ======================================================== */}
          {activeTab === 'pay' && (
            <div className="space-y-4 animate-fadeIn">
              {isPaymentSimulated ? (
                <div className={`p-6 rounded-2xl ${themeStyles.successCardBg} border text-center animate-fadeIn`}>
                  <div className={`size-12 rounded-full ${themeStyles.successCircle} flex items-center justify-center mx-auto mb-3 shadow-xs`}>
                    <Check className="size-6" />
                  </div>
                  <h3 className={`text-base font-bold ${themeStyles.successTitle}`}>Payment Completed</h3>
                  <p className={`text-xs ${themeStyles.successText} mt-1`}>
                    Settled via Fonepay Nepal QR. Thank you for dining with us!
                  </p>

                  <div className="my-4 p-4 rounded-xl bg-white border border-stone-200/80 text-left font-mono text-xs space-y-1.5 text-stone-700 shadow-2xs">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Merchant:</span>
                      <span className="font-bold">Cafe XYZ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Ref:</span>
                      <span className="font-bold">{fonepayRefNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Table:</span>
                      <span>Table {currentTableNumber}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsPaymentSimulated(false)}
                    className={`w-full py-2.5 px-4 ${themeStyles.primaryBtn} text-white text-xs font-semibold rounded-xl transition cursor-pointer`}
                  >
                    View QR Again
                  </button>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs text-center space-y-4">
                  <div className="flex items-center justify-between text-left border-b border-stone-100 pb-3">
                    <div>
                      <span className={`text-[10px] font-mono uppercase tracking-wider ${themeStyles.accentText} font-bold block`}>
                        FONEPAY NEPAL
                      </span>
                      <h3 className="text-sm font-bold text-stone-900">Scan QR to Pay</h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                      Table {currentTableNumber}
                    </span>
                  </div>

                  {/* Pure QR Presentation - No Amount Displayed */}
                  <div className="py-2 flex flex-col items-center justify-center">
                    <div className="p-4 bg-stone-50 rounded-2xl border-2 border-stone-200/90 inline-block shadow-sm">
                      <div className="p-3 bg-white rounded-xl shadow-xs border border-stone-100">
                        <QRCodeSVG
                          value={`fonepay://pay?merchant=CafeXYZ&table=${currentTableNumber}&ref=${fonepayRefNumber}`}
                          size={190}
                          level="H"
                        />
                      </div>
                    </div>
                    <p className="text-xs font-medium text-stone-600 mt-3.5">
                      Scan with any Mobile Banking, Fonepay, eSewa, or Khalti app
                    </p>
                    <p className="text-[11px] font-mono text-stone-400 mt-1">
                      Ref: {fonepayRefNumber}
                    </p>
                  </div>

                  <button
                    onClick={handleSimulatePayment}
                    className={`w-full py-3 px-4 ${themeStyles.primaryBtn} text-white font-bold rounded-xl text-xs shadow-xs transition cursor-pointer flex items-center justify-center gap-2`}
                  >
                    <CreditCard className="size-4" />
                    <span>Confirm / Simulate QR Settle</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: FEEDBACK */}
          {/* ======================================================== */}
          {activeTab === 'feedback' && (
            <div className="space-y-4 animate-fadeIn">
              {isFeedbackSent ? (
                <div className={`p-6 rounded-2xl ${themeStyles.successCardBg} border text-center animate-fadeIn`}>
                  <div className={`size-12 rounded-full ${themeStyles.successCircle} flex items-center justify-center mx-auto mb-3 shadow-xs`}>
                    <Check className="size-6" />
                  </div>
                  <h3 className={`text-base font-bold ${themeStyles.successTitle}`}>Dhanyabad!</h3>
                  <p className={`text-xs ${themeStyles.successText} mt-1`}>
                    Your dining review has been recorded. It helps Alex and the Cafe XYZ team maintain our high standards.
                  </p>
                  <button
                    onClick={() => {
                      setIsFeedbackSent(false);
                      setFeedbackText('');
                    }}
                    className={`mt-4 px-4 py-2 ${themeStyles.primaryBtn} text-white text-xs font-semibold rounded-xl transition cursor-pointer`}
                  >
                    Submit Another Feedback
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmitFeedback}
                  className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-4"
                >
                  <div className="text-center pb-2 border-b border-stone-100">
                    <h3 className="text-base font-bold text-stone-900">How was your visit?</h3>
                    <p className="text-xs text-stone-500 mt-0.5">Table {currentTableNumber} feedback</p>
                  </div>

                  <div className="space-y-3">
                    {/* Dimension 1: Food & Chiya */}
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-xs text-stone-800 block">Food & Chiya</span>
                        <span className="text-[10px] font-mono text-amber-700 font-bold">
                          {foodRating}.0 / 5.0
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFoodRating(star)}
                            className="p-0.5 transition-all cursor-pointer hover:scale-110 active:scale-95"
                          >
                            <Star
                              className={`size-4 transition-all ${
                                star <= foodRating
                                  ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                                  : 'text-stone-300 hover:text-stone-400 fill-stone-100'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dimension 2: Service Speed */}
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-xs text-stone-800 block">Service Speed</span>
                        <span className="text-[10px] font-mono text-amber-700 font-bold">
                          {serviceRating}.0 / 5.0
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setServiceRating(star)}
                            className="p-0.5 transition-all cursor-pointer hover:scale-110 active:scale-95"
                          >
                            <Star
                              className={`size-4 transition-all ${
                                star <= serviceRating
                                  ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                                  : 'text-stone-300 hover:text-stone-400 fill-stone-100'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dimension 3: Ambience */}
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-xs text-stone-800 block">Ambience</span>
                        <span className="text-[10px] font-mono text-amber-700 font-bold">
                          {ambienceRating}.0 / 5.0
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setAmbienceRating(star)}
                            className="p-0.5 transition-all cursor-pointer hover:scale-110 active:scale-95"
                          >
                            <Star
                              className={`size-4 transition-all ${
                                star <= ambienceRating
                                  ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                                  : 'text-stone-300 hover:text-stone-400 fill-stone-100'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dimension 4: Order Accuracy */}
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-xs text-stone-800 block">Order Accuracy</span>
                        <span className="text-[10px] font-mono text-amber-700 font-bold">
                          {orderAccuracyRating}.0 / 5.0
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setOrderAccuracyRating(star)}
                            className="p-0.5 transition-all cursor-pointer hover:scale-110 active:scale-95"
                          >
                            <Star
                              className={`size-4 transition-all ${
                                star <= orderAccuracyRating
                                  ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                                  : 'text-stone-300 hover:text-stone-400 fill-stone-100'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dimension 5: Value for Money */}
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-xs text-stone-800 block">Value for Money</span>
                        <span className="text-[10px] font-mono text-amber-700 font-bold">
                          {valueRating}.0 / 5.0
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setValueRating(star)}
                            className="p-0.5 transition-all cursor-pointer hover:scale-110 active:scale-95"
                          >
                            <Star
                              className={`size-4 transition-all ${
                                star <= valueRating
                                  ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                                  : 'text-stone-300 hover:text-stone-400 fill-stone-100'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dimension 6: Hygiene */}
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-xs text-stone-800 block">Cleanliness & Hygiene</span>
                        <span className="text-[10px] font-mono text-amber-700 font-bold">
                          {hygieneRating}.0 / 5.0
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setHygieneRating(star)}
                            className="p-0.5 transition-all cursor-pointer hover:scale-110 active:scale-95"
                          >
                            <Star
                              className={`size-4 transition-all ${
                                star <= hygieneRating
                                  ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                                  : 'text-stone-300 hover:text-stone-400 fill-stone-100'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-2">
                      Highlights
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {(
                        [
                          'Chiya Taste',
                          'Food Quality',
                          'Ambience',
                          'Service Speed',
                          'Hospitality',
                          'Value',
                        ] as const
                      ).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`px-2.5 py-1 rounded-full text-xs transition cursor-pointer ${
                            selectedTags.includes(tag)
                              ? `${themeStyles.tagActive} font-semibold shadow-2xs`
                              : 'bg-stone-50 text-stone-600 border border-stone-200'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Subin S."
                        className={`w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 ${themeStyles.focusRing}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="98XXXXXXXX"
                        className={`w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 ${themeStyles.focusRing}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1">
                      Age Group
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {['18-24', '25-34', '35-44', '45+'].map((group) => (
                        <button
                          key={group}
                          type="button"
                          onClick={() => setAgeGroup(group)}
                          className={`py-1.5 rounded-lg text-xs font-medium border text-center transition cursor-pointer ${
                            ageGroup === group
                              ? `${themeStyles.primaryBtn} text-white border-transparent`
                              : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          {group}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1">
                      Comments & Suggestions
                    </label>
                    <textarea
                      rows={3}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Share your thoughts about your meal and tea..."
                      className={`w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 ${themeStyles.focusRing}`}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 px-4 ${themeStyles.primaryBtn} text-white font-bold rounded-xl text-xs shadow-xs transition cursor-pointer flex items-center justify-center gap-2`}
                  >
                    <Send className="size-3.5" />
                    <span>Send Feedback</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* 4. BOTTOM ACTIVE CART TRAY */}
        {totalCartCount > 0 && activeTab === 'menu' && (
          <div className="bg-white border-t border-stone-200 p-3 shadow-lg shrink-0 z-20">
            {isTrayExpanded && (
              <div className="max-h-48 overflow-y-auto mb-3 divide-y divide-stone-100 pr-1">
                {cartItemIds.map((id) => {
                  const it = menuItems.find((m) => m.id === id);
                  if (!it) return null;
                  return (
                    <div key={id} className="py-1.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-stone-900">{it.name}</div>
                        <div className="text-[11px] text-stone-500 font-mono">
                          {formatCurrency(it.price * cart[id])}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(id, -1)}
                          className="size-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="font-mono font-bold text-xs w-4 text-center">
                          {cart[id]}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(id, 1)}
                          className={`size-6 rounded-full ${themeStyles.primaryBtn} flex items-center justify-center text-white`}
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setIsTrayExpanded(!isTrayExpanded)}
                className="text-left cursor-pointer flex-1"
              >
                <div className="text-[11px] font-mono text-stone-500">
                  {totalCartCount} item{totalCartCount > 1 ? 's' : ''} in tray
                </div>
                <div className="text-sm font-bold font-mono text-stone-900">
                  {formatCurrency(cartSubtotal)}
                </div>
              </button>

              <button
                disabled={isNetworkVerificationEnabled && !isGuestInsideVenue}
                onClick={handlePlaceOrder}
                className={`py-2.5 px-4 ${
                  isNetworkVerificationEnabled && !isGuestInsideVenue
                    ? 'bg-stone-200 text-stone-500 cursor-not-allowed border border-stone-300'
                    : `${themeStyles.primaryBtn} text-white shadow-xs`
                } font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5`}
              >
                {isNetworkVerificationEnabled && !isGuestInsideVenue ? (
                  <>
                    <Lock className="size-3.5" />
                    <span>Venue Wi-Fi Required</span>
                  </>
                ) : (
                  <>
                    <span>Send to Kitchen</span>
                    <ChevronRight className="size-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* 5. BOTTOM NAVIGATION BAR (SMOOTH, FAVORABLE, THEME-HARMONIOUS - REPLACING CHUNKY GREENISH TILES) */}
        {activeTab !== 'home' && (
          <nav
            aria-label="Customer Navigation"
            className="bg-white/95 backdrop-blur-md border-t border-stone-200/80 px-2 py-1.5 shrink-0 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-all"
          >
            <div className="grid grid-cols-4 gap-1">
              {/* 1. Menu */}
              <button
                onClick={() => setActiveTab('menu')}
                className="relative py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer group active:scale-95"
              >
                <div
                  className={`relative px-3.5 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                    activeTab === 'menu'
                      ? `${themeStyles.bottomNavActiveBg} shadow-2xs`
                      : 'text-stone-400 group-hover:text-stone-600'
                  }`}
                >
                  <Coffee className={`size-4.5 ${activeTab === 'menu' ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-1 -right-1 size-4 rounded-full bg-stone-900 text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-xs">
                      {totalCartCount}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[11px] leading-tight transition-colors ${
                    activeTab === 'menu'
                      ? 'font-bold text-stone-900'
                      : 'font-medium text-stone-500 group-hover:text-stone-700'
                  }`}
                >
                  Menu
                </span>
              </button>

              {/* 2. Call Waiter */}
              <button
                onClick={() => setActiveTab('waiter')}
                className="relative py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer group active:scale-95"
              >
                <div
                  className={`relative px-3.5 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                    activeTab === 'waiter'
                      ? `${themeStyles.bottomNavActiveBg} shadow-2xs`
                      : 'text-stone-400 group-hover:text-stone-600'
                  }`}
                >
                  <Bell className={`size-4.5 ${activeTab === 'waiter' ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                  {activeTableAlert && (
                    <span className="absolute top-0 right-1.5 size-2 rounded-full bg-amber-500 animate-ping" />
                  )}
                  {activeTableAlert && (
                    <span className="absolute top-0 right-1.5 size-2 rounded-full bg-amber-500" />
                  )}
                </div>
                <span
                  className={`text-[11px] leading-tight transition-colors ${
                    activeTab === 'waiter'
                      ? 'font-bold text-stone-900'
                      : 'font-medium text-stone-500 group-hover:text-stone-700'
                  }`}
                >
                  Call Waiter
                </span>
              </button>

              {/* 3. Fonepay QR */}
              <button
                onClick={() => setActiveTab('pay')}
                className="relative py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer group active:scale-95"
              >
                <div
                  className={`relative px-3.5 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                    activeTab === 'pay'
                      ? `${themeStyles.bottomNavActiveBg} shadow-2xs`
                      : 'text-stone-400 group-hover:text-stone-600'
                  }`}
                >
                  <QrCode className={`size-4.5 ${activeTab === 'pay' ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                </div>
                <span
                  className={`text-[11px] leading-tight transition-colors ${
                    activeTab === 'pay'
                      ? 'font-bold text-stone-900'
                      : 'font-medium text-stone-500 group-hover:text-stone-700'
                  }`}
                >
                  Fonepay QR
                </span>
              </button>

              {/* 4. Review */}
              <button
                onClick={() => setActiveTab('feedback')}
                className="relative py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer group active:scale-95"
              >
                <div
                  className={`relative px-3.5 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                    activeTab === 'feedback'
                      ? `${themeStyles.bottomNavActiveBg} shadow-2xs`
                      : 'text-stone-400 group-hover:text-stone-600'
                  }`}
                >
                  <Star className={`size-4.5 ${activeTab === 'feedback' ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                </div>
                <span
                  className={`text-[11px] leading-tight transition-colors ${
                    activeTab === 'feedback'
                      ? 'font-bold text-stone-900'
                      : 'font-medium text-stone-500 group-hover:text-stone-700'
                  }`}
                >
                  Review
                </span>
              </button>
            </div>
          </nav>
        )}
        {/* 6. DISH SHOWCASE & "CALL WAITER TO ORDER" MODAL (DYNAMICALLY THEMED) */}
        {selectedDishForModal && (
          <div className="absolute inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex flex-col justify-end animate-fadeIn">
            {/* Click outside backdrop */}
            <div
              onClick={() => setSelectedDishForModal(null)}
              className="flex-1 cursor-pointer"
            />

            {/* Bottom Sheet Card Container */}
            <div className="bg-white rounded-t-3xl border-t border-stone-200/90 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-slideUp">
              {/* Textual Showcase Header (No Dish Photos, Pure Information) */}
              <div className={`${themeStyles.headerBg} text-white p-5 shrink-0 relative shadow-sm`}>
                {/* Close Button */}
                <button
                  onClick={() => setSelectedDishForModal(null)}
                  className="absolute top-4 right-4 size-8 rounded-full bg-black/25 hover:bg-black/40 text-white flex items-center justify-center transition cursor-pointer"
                  aria-label="Close dish preview"
                >
                  <X className="size-4" />
                </button>

                <div className="flex flex-wrap items-center gap-2 mb-2 pr-10">
                  {/* Dietary Dot indicator */}
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-black/25 text-white/90">
                    <span className={`size-1.5 rounded-full ${isSelectedDishVegetarian ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span>{isSelectedDishVegetarian ? 'Veg' : 'Non-Veg'}</span>
                  </span>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/20 text-white">
                    {selectedDishForModal.category}
                  </span>

                  {selectedDishForModal.unit && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/20 text-white">
                      Unit: {selectedDishForModal.unit}
                    </span>
                  )}

                  {!selectedDishForModal.isAvailable && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white shadow-xs">
                      Sold Out
                    </span>
                  )}
                </div>

                <div className="flex items-end justify-between gap-4 mt-1">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-white">
                      {selectedDishForModal.displayName || selectedDishForModal.name}
                    </h3>
                    {selectedDishForModal.shortName && (
                      <span className="text-[11px] font-mono text-white/70">
                        Code: {selectedDishForModal.shortName}
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-white/70 font-mono block">Rate</span>
                    <span className="text-xl font-extrabold font-mono text-white">
                      {formatCurrency(selectedDishForModal.price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scrollable Content: Tags & Add-ons */}
              <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
                {/* Description */}
                <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100">
                  {selectedDishForModal.description}
                </p>

                {/* Sold out notice banner */}
                {!selectedDishForModal.isAvailable && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                    <span className="size-2 rounded-full bg-rose-500 shrink-0" />
                    <span>This item is marked as Sold Out by cafe management and cannot be ordered right now.</span>
                  </div>
                )}

                {/* Tags Pill Row */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-[10px] font-mono font-semibold">
                    <Clock className="size-3 text-stone-500" />
                    <span>{selectedDishForModal.preparationTimeMinutes} min prep</span>
                  </span>

                  {selectedDishForModal.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-stone-50 border border-stone-200/80 text-stone-600 text-[10px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* ADD-ONS YOU CAN ASK FOR */}
                {selectedDishForModal.isAvailable && (
                  <div className="pt-2 border-t border-stone-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold">
                        ADD-ONS YOU CAN ASK FOR
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">Select any</span>
                    </div>

                    <div className="space-y-1.5">
                      {currentAddOns.map((addOn) => {
                        const isChecked = selectedAddOns.includes(addOn.name);
                        return (
                          <div
                            key={addOn.id}
                            onClick={() => handleToggleAddOn(addOn.name)}
                            className={`p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                              isChecked
                                ? `${themeStyles.bannerBg} border-stone-300 shadow-2xs`
                                : 'bg-stone-50/70 border-stone-200/70 hover:bg-stone-50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                style={{
                                  borderColor: isChecked ? themeStyles.accentColor : undefined,
                                  backgroundColor: isChecked ? themeStyles.accentColor : undefined,
                                }}
                                className={`size-4 rounded-md border flex items-center justify-center text-white transition-all ${
                                  isChecked ? '' : 'border-stone-300 bg-white'
                                }`}
                              >
                                {isChecked && <Check className="size-3 stroke-[3]" />}
                              </div>
                              <span className="text-xs font-semibold text-stone-800">
                                {addOn.name}
                              </span>
                            </div>

                            <span className={`text-xs font-mono font-bold ${addOn.price > 0 ? 'text-stone-900' : 'text-emerald-700'}`}>
                              {addOn.price > 0 ? `+${formatCurrency(addOn.price)}` : 'Free'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Optional Note to Kitchen / Waiter */}
                {selectedDishForModal.isAvailable && (
                  <div className="pt-1">
                    <input
                      type="text"
                      value={dishSpecialNote}
                      onChange={(e) => setDishSpecialNote(e.target.value)}
                      placeholder="Special request (e.g. extra hot, separate cup, no cinnamon)..."
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>
                )}
              </div>

              {/* Modal Sticky Bottom Action Footer */}
              <div className="p-3.5 bg-stone-50/90 border-t border-stone-200 flex flex-col gap-2 shrink-0">
                <div className="flex items-center justify-between text-xs px-0.5">
                  <span className="text-stone-500 font-medium">Estimated Total:</span>
                  <span className="text-sm font-extrabold font-mono text-stone-900">
                    {formatCurrency(modalTotalPrice)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Primary: Call Waiter to Order */}
                  <button
                    onClick={handleCallWaiterWithDish}
                    disabled={!selectedDishForModal.isAvailable || isCallingWaiter}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer active:scale-[0.98] ${
                      !selectedDishForModal.isAvailable
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300'
                        : themeStyles.primaryBtn
                    }`}
                  >
                    <Bell className="size-3.5" />
                    <span>{!selectedDishForModal.isAvailable ? 'Sold Out' : 'Call waiter to order'}</span>
                  </button>

                  {/* Secondary: Add to Self-Order Tray */}
                  <button
                    onClick={handleAddCustomizedDishToCart}
                    disabled={!selectedDishForModal.isAvailable}
                    className={`py-2.5 px-3 rounded-xl font-semibold text-xs border flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-[0.98] ${
                      !selectedDishForModal.isAvailable
                        ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                        : 'border-stone-300 bg-white hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <Plus className="size-3.5 text-stone-500" />
                    <span>{!selectedDishForModal.isAvailable ? 'Sold Out' : 'Add to self-order tray'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerApp;
