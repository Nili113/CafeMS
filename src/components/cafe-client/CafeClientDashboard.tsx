import React, { useState, useRef } from 'react';
import {
  Coffee,
  QrCode,
  UtensilsCrossed,
  ChefHat,
  MessageSquareHeart,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Bell,
  Sparkles,
  Download,
  Upload,
  Image as ImageIcon,
  Edit2,
  Trash2,
  AlertCircle,
  TrendingUp,
  Star,
  Users,
  Eye,
  Check,
  X,
  Radio,
  Palette,
  Layers,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useCafeData } from '../../context/CafeDataContext';
import { Table, MenuItem, Order, TableStatus, OrderStatus, MenuCategory, CafeTheme } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { formatCurrency, formatDate, cn } from '../../lib/utils';

export const CafeClientDashboard: React.FC = () => {
  const {
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
    showToast,
    setActiveTableNumber,
    setCurrentRole,
  } = useCafeData();

  // Active Sub-Tab: 'tables' | 'menu' | 'kitchen' | 'feedback' | 'theming'
  const [activeTab, setActiveTab] = useState<'tables' | 'menu' | 'kitchen' | 'feedback' | 'theming'>('tables');

  // Table QR Modal State
  const [selectedTableForQr, setSelectedTableForQr] = useState<Table | null>(null);

  // Menu Modal State (Add / Edit)
  const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemFormName, setItemFormName] = useState('');
  const [itemFormDescription, setItemFormDescription] = useState('');
  const [itemFormPrice, setItemFormPrice] = useState(300);
  const [itemFormCategory, setItemFormCategory] = useState<MenuCategory>('Chiya & Teas');
  const [itemFormImage, setItemFormImage] = useState('/images/chiya_matka.jpg');
  const [itemFormPrepTime, setItemFormPrepTime] = useState(4);
  const [itemFormTags, setItemFormTags] = useState('Matka Brew, House Special');

  // Filter States
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string>('All');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [feedbackRatingFilter, setFeedbackRatingFilter] = useState<number | 'all'>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Image Upload by Cafe Client Owner
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size exceeds 5MB limit', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setItemFormImage(event.target.result as string);
          showToast('Image loaded successfully from local device!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setItemFormName('');
    setItemFormDescription('');
    setItemFormPrice(160);
    setItemFormCategory('Chiya & Teas');
    setItemFormImage('/images/hero_cafe_latte.jpg');
    setItemFormPrepTime(5);
    setItemFormTags('Specialty, House Made');
    setIsMenuItemModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setItemFormName(item.name);
    setItemFormDescription(item.description);
    setItemFormPrice(item.price);
    setItemFormCategory(item.category);
    setItemFormImage(item.image || '');
    setItemFormPrepTime(item.preparationTimeMinutes);
    setItemFormTags(item.tags.join(', '));
    setIsMenuItemModalOpen(true);
  };

  const handleSaveMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemFormName || itemFormPrice <= 0) return;

    const parsedTags = itemFormTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingItem) {
      updateMenuItem({
        ...editingItem,
        name: itemFormName,
        description: itemFormDescription,
        price: Number(itemFormPrice),
        category: itemFormCategory,
        image: itemFormImage,
        preparationTimeMinutes: Number(itemFormPrepTime),
        tags: parsedTags,
      });
    } else {
      addMenuItem({
        name: itemFormName,
        description: itemFormDescription,
        price: Number(itemFormPrice),
        category: itemFormCategory,
        image: itemFormImage,
        isAvailable: true,
        tags: parsedTags,
        preparationTimeMinutes: Number(itemFormPrepTime),
      });
    }

    setIsMenuItemModalOpen(false);
  };

  // Kitchen Metrics
  const activeOrders = orders.filter((o) => o.status !== 'Completed');
  const activeTableAlerts = tableAlerts.filter((a) => a.status === 'Active');

  // Customer Feedback Analytics Calculations
  const totalReviews = feedbacks.length;
  const averageRating =
    totalReviews > 0
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalReviews).toFixed(1)
      : '5.0';

  const starCounts = {
    5: feedbacks.filter((f) => f.rating === 5).length,
    4: feedbacks.filter((f) => f.rating === 4).length,
    3: feedbacks.filter((f) => f.rating === 3).length,
    2: feedbacks.filter((f) => f.rating === 2).length,
    1: feedbacks.filter((f) => f.rating === 1).length,
  };

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCategory = menuCategoryFilter === 'All' || item.category === menuCategoryFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(menuSearchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(menuSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredFeedbacks = feedbacks.filter((fb) => {
    if (feedbackRatingFilter === 'all') return true;
    return fb.rating === feedbackRatingFilter;
  });

  const categories: ('All' | MenuCategory)[] = [
    'All',
    'Chiya & Teas',
    'Specialty Coffee',
    'Bakery & Bites',
    'Mains & Bowls',
    'Desserts',
  ];

  // Table Status Color Configuration
  const getTableStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'Available':
        return {
          border: 'border-emerald-500/30',
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-500',
          badge: 'success' as const,
        };
      case 'Occupied':
        return {
          border: 'border-orange-500/30',
          bg: 'bg-orange-500/10',
          text: 'text-orange-500',
          badge: 'warning' as const,
        };
      case 'Reserved':
        return {
          border: 'border-purple-500/30',
          bg: 'bg-purple-500/10',
          text: 'text-purple-500',
          badge: 'purple' as const,
        };
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-20 animate-in fade-in duration-300">
      {/* Header & Cafe Status */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              Operations Center
            </span>
            <span className="text-xs text-muted-foreground">• Cafe XYZ • Jhamsikhel, Lalitpur</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Venue Operations & Kitchen Hub
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Live interactive floor layout, dynamic table QR generator, instantaneous 86'd stock synchronization, and customer satisfaction metrics.
          </p>
        </div>

        {/* Quick Operational Status Pills */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {activeTableAlerts.length > 0 && (
            <Badge variant="danger" dot className="animate-pulse py-1.5 px-3">
              {activeTableAlerts.length} Active Table Alert{activeTableAlerts.length > 1 ? 's' : ''}
            </Badge>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border/80 text-xs font-semibold text-foreground">
            <ChefHat className="size-3.5 text-primary" />
            <span>{activeOrders.length} Orders in Queue</span>
          </div>
        </div>
      </div>

      {/* Real-Time Table Alert Banner if Any Active Waiter/Bill pings */}
      {activeTableAlerts.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
              <Bell className="size-4 animate-bounce" />
              <span>Priority Customer Inquiries Requiring Staff Attention</span>
            </div>
            <span className="text-xs font-mono text-rose-400">Live Socket Ping</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeTableAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-xl bg-card border border-rose-500/20 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-foreground text-sm">Table {alert.tableNumber}</span>
                    <Badge variant={alert.type === 'Call Waiter' ? 'danger' : 'warning'} size="sm">
                      {alert.type}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                    {alert.type === 'Bill Request' && alert.amount ? formatCurrency(alert.amount) + ' • ' : ''}
                    {alert.timestamp}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2.5"
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    Ack
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    className="text-xs h-7 px-2.5"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    Resolved
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Feature Tabs */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-3 mb-8 overflow-x-auto no-scrollbar">
        {[
          { id: 'tables', label: 'Floor Layout & Table QRs', icon: <QrCode className="size-4" />, count: tables.length },
          { id: 'menu', label: 'Menu Catalog & Live Stock', icon: <UtensilsCrossed className="size-4" />, count: menuItems.length },
          { id: 'kitchen', label: 'Live Kitchen Monitor', icon: <ChefHat className="size-4" />, count: activeOrders.length },
          { id: 'feedback', label: 'Customer Feedback & Analytics', icon: <MessageSquareHeart className="size-4" />, count: feedbacks.length },
          { id: 'theming', label: 'Brand Theming & Colors', icon: <Palette className="size-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all select-none whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-foreground text-background shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === tab.id
                    ? 'bg-background/20 text-background'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: INTERACTIVE TABLE MANAGEMENT & QR GENERATOR */}
      {activeTab === 'tables' && (
        <div className="space-y-6">
          {/* Status Legend Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/80">
            <div>
              <h3 className="text-base font-bold text-foreground">Dining Room Floor Plan</h3>
              <p className="text-xs text-muted-foreground">
                Click any table to view, preview, or download its unique table QR code or modify its live status.
              </p>
            </div>

            {/* Strict Color Legend per Spec */}
            <div className="flex items-center gap-3 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-emerald-500 shadow-sm" />
                <span className="text-foreground">Available (Green)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-orange-500 shadow-sm" />
                <span className="text-foreground">Occupied (Orange)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-purple-500 shadow-sm" />
                <span className="text-foreground">Reserved (Purple)</span>
              </div>
            </div>
          </div>

          {/* Floor Plan Cards Grid (Double-Bezel Architecture) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {tables.map((table) => {
              const statusCfg = getTableStatusColor(table.status);
              return (
                <div
                  key={table.id}
                  onClick={() => setSelectedTableForQr(table)}
                  className="group cursor-pointer p-1.5 rounded-[1.75rem] bg-foreground/[0.03] dark:bg-white/[0.04] ring-1 ring-foreground/[0.06] hover:ring-primary/40 transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="rounded-[calc(1.75rem-0.375rem)] bg-card border border-border/70 p-5 flex flex-col justify-between h-48 relative overflow-hidden transition-all group-hover:border-primary/40">
                    {/* Top Status & Capacity */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                          Table {table.number < 10 ? `0${table.number}` : table.number}
                        </div>
                        <h4 className="font-bold text-foreground text-base mt-0.5 line-clamp-1">{table.label}</h4>
                      </div>
                      <Badge variant={statusCfg.badge} dot size="sm">
                        {table.status}
                      </Badge>
                    </div>

                    {/* Middle Info / Active Bill */}
                    <div className="space-y-1 my-auto">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="size-3.5" />
                        <span>Seating capacity: {table.capacity} guests</span>
                      </div>
                      {table.status === 'Occupied' && (
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-muted-foreground">Live Bill:</span>
                          <span className="font-mono font-bold text-orange-500">
                            {formatCurrency(table.currentTotal || 0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Hint */}
                    <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground group-hover:text-primary transition-colors">
                      <span className="flex items-center gap-1">
                        <QrCode className="size-3.5" />
                        <span>Generate & Inspect QR</span>
                      </span>
                      <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MENU MANAGEMENT & REAL-TIME AVAILABILITY SYNC */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          {/* Category Filter & Search Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/80">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setMenuCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                    menuCategoryFilter === cat
                      ? 'bg-foreground text-background shadow-sm'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search & Add Button */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:w-64">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search dish, beverage..."
                  value={menuSearchQuery}
                  onChange={(e) => setMenuSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-muted/60 border border-border focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="size-3.5" />}
                onClick={handleOpenAddModal}
                className="shrink-0"
              >
                Add Menu Item
              </Button>
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMenuItems.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'p-1.5 rounded-[1.75rem] bg-foreground/[0.03] dark:bg-white/[0.04] ring-1 ring-foreground/[0.06] transition-all',
                  !item.isAvailable && 'opacity-60 bg-muted/30'
                )}
              >
                <div className="rounded-[calc(1.75rem-0.375rem)] bg-card border border-border/70 p-4 flex flex-col justify-between h-full">
                  <div>
                    {/* Image & Availability Overlay */}
                    <div className="relative h-44 rounded-2xl overflow-hidden bg-muted mb-3 border border-border/50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className={cn(
                          'w-full h-full object-cover transition-transform duration-500 hover:scale-105',
                          !item.isAvailable && 'grayscale brightness-75'
                        )}
                      />

                      {/* Category Badge */}
                      <div className="absolute top-2.5 left-2.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md">
                          {item.category}
                        </span>
                      </div>

                      {/* 86'd Dimmed Overlay when Out of Stock */}
                      {!item.isAvailable && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="text-xs font-black uppercase tracking-widest text-rose-400 border border-rose-500/50 bg-black/80 px-3 py-1 rounded-full">
                            Out of Stock (86'd)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-bold text-foreground text-base tracking-tight">{item.name}</h4>
                      <span className="font-mono font-bold text-primary text-base shrink-0">
                        {formatCurrency(item.price)}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-muted font-medium text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Operational Controls: Real-Time Toggle & Edit */}
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                    {/* Real-Time Stock Availability Toggle */}
                    <button
                      onClick={() => toggleMenuItemAvailability(item.id)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer',
                        item.isAvailable
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                          : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/25'
                      )}
                    >
                      <span
                        className={cn(
                          'size-2 rounded-full',
                          item.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                        )}
                      />
                      <span>{item.isAvailable ? 'Available (In Stock)' : 'Unavailable (86’d)'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEditModal(item)}
                        className="size-8"
                        title="Edit Item"
                      >
                        <Edit2 className="size-3.5 text-muted-foreground hover:text-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMenuItem(item.id)}
                        className="size-8 text-destructive/70 hover:text-destructive"
                        title="Delete Item"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LIVE OPERATIONS & KITCHEN MONITOR */}
      {activeTab === 'kitchen' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/80">
            <div>
              <h3 className="text-base font-bold text-foreground">Live Kitchen Dispatch & Order Stream</h3>
              <p className="text-xs text-muted-foreground">
                Progress orders from Pending to Preparing to Served. Completed orders clear out cleanly.
              </p>
            </div>
            <Badge variant="outline" size="sm">
              Auto-Refreshing (WebSocket)
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {orders.map((order) => {
              const isCompleted = order.status === 'Completed';
              return (
                <div
                  key={order.id}
                  className={cn(
                    'p-1.5 rounded-[1.75rem] bg-foreground/[0.03] dark:bg-white/[0.04] ring-1 ring-foreground/[0.06] transition-all',
                    isCompleted && 'opacity-60'
                  )}
                >
                  <div className="rounded-[calc(1.75rem-0.375rem)] bg-card border border-border/70 p-5 flex flex-col justify-between h-full">
                    <div>
                      {/* Order Header */}
                      <div className="flex items-start justify-between pb-3 border-b border-border/60 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-foreground text-lg">Table {order.tableNumber}</span>
                            <Badge
                              variant={
                                order.status === 'Pending'
                                  ? 'warning'
                                  : order.status === 'Preparing'
                                  ? 'purple'
                                  : order.status === 'Served'
                                  ? 'success'
                                  : 'secondary'
                              }
                              size="sm"
                              dot
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <span className="text-xs font-mono text-muted-foreground">
                            Order #{order.id.replace('ord-', '')} • {order.createdAt}
                          </span>
                        </div>

                        <span className="font-mono font-bold text-foreground text-base">
                          {formatCurrency(order.total)}
                        </span>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-start justify-between text-xs">
                            <div className="flex items-start gap-2">
                              <span className="font-mono font-bold text-primary">{item.quantity}x</span>
                              <div>
                                <span className="font-medium text-foreground">{item.name}</span>
                                {item.notes && (
                                  <p className="text-[10px] text-amber-500 italic font-mono">Note: {item.notes}</p>
                                )}
                              </div>
                            </div>
                            <span className="font-mono text-muted-foreground">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Progression Workflow Buttons */}
                    <div className="pt-3 border-t border-border/60">
                      <div className="flex items-center gap-1.5">
                        {order.status === 'Pending' && (
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => updateOrderStatus(order.id, 'Preparing')}
                          >
                            Mark Preparing
                          </Button>
                        )}
                        {order.status === 'Preparing' && (
                          <Button
                            variant="success"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => updateOrderStatus(order.id, 'Served')}
                          >
                            Mark Served
                          </Button>
                        )}
                        {order.status === 'Served' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => updateOrderStatus(order.id, 'Completed')}
                          >
                            Mark Completed & Clear
                          </Button>
                        )}
                        {order.status === 'Completed' && (
                          <div className="text-xs text-muted-foreground text-center w-full py-1 font-mono">
                            Fulfilled & Settled
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOMER FEEDBACK & ANALYTICS SUITE */}
      {activeTab === 'feedback' && (
        <div className="space-y-8">
          {/* Top Analytics Summary Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Average Rating Score */}
            <Card>
              <div className="flex items-center justify-between text-muted-foreground mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider">Overall Customer Rating</span>
                <Star className="size-4 text-amber-400 fill-amber-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">{averageRating}</span>
                <span className="text-lg text-muted-foreground font-semibold">/ 5.0</span>
              </div>
              <div className="flex items-center gap-1 mt-2 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="size-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-mono text-muted-foreground ml-2">({totalReviews} verified reviews)</span>
              </div>
            </Card>

            {/* Satisfaction Rate */}
            <Card>
              <div className="flex items-center justify-between text-muted-foreground mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider">Net Delight Score</span>
                <TrendingUp className="size-4 text-emerald-500" />
              </div>
              <div className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">96.4%</div>
              <p className="text-xs text-muted-foreground mt-2">
                Positive dine-in experiences submitted directly from guest mobile tables.
              </p>
            </Card>

            {/* Star Distribution Breakdown */}
            <Card>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-3">
                Rating Breakdown
              </span>
              <div className="space-y-1.5">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = starCounts[stars as keyof typeof starCounts];
                  const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center gap-2 text-xs">
                      <span className="w-6 font-mono font-bold text-foreground text-right">{stars}★</span>
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className="h-full rounded-full bg-amber-400 transition-all duration-500"
                        />
                      </div>
                      <span className="w-8 font-mono text-[10px] text-muted-foreground text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Review Filter & Feedbacks List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Guest Feedback Submissions</h3>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground font-medium">Filter by:</span>
                {(['all', 5, 4, 3] as const).map((filter) => (
                  <button
                    key={String(filter)}
                    onClick={() => setFeedbackRatingFilter(filter as any)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      feedbackRatingFilter === filter
                        ? 'bg-foreground text-background shadow-sm'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {filter === 'all' ? 'All Ratings' : `${filter}★ Only`}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFeedbacks.map((fb) => (
                <div key={fb.id} className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs">
                        {fb.customerName ? fb.customerName.charAt(0) : 'G'}
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-xs sm:text-sm">{fb.customerName || 'Anonymous Guest'}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          Table {fb.tableNumber} • {fb.createdAt}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: fb.rating }).map((_, i) => (
                        <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-foreground/90 leading-relaxed font-normal">"{fb.comment}"</p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {fb.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DYNAMIC THEMING & BRAND CUSTOMIZATION */}
      {activeTab === 'theming' && (
        <div className="max-w-3xl space-y-6">
          <Card>
            <h3 className="text-base font-bold text-foreground mb-1">Cafe Palette & Visual Personality</h3>
            <p className="text-xs text-muted-foreground mb-6">
              Customize the cafe color profile. Changes immediately update your manager interface and the customer menu experience.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  id: 'amber',
                  name: 'Warm Amber Roast',
                  desc: 'Rich caramel espresso tones with warm walnut depth.',
                  color: 'bg-amber-500',
                },
                {
                  id: 'emerald',
                  name: 'Emerald Artisan',
                  desc: 'Botanical sage and matcha aesthetic for natural roasteries.',
                  color: 'bg-emerald-500',
                },
                {
                  id: 'noir',
                  name: 'Midnight Noir',
                  desc: 'High contrast monochrome titanium for sleek cocktail cafes.',
                  color: 'bg-zinc-300',
                },
                {
                  id: 'terracotta',
                  name: 'Terracotta Hearth',
                  desc: 'Rustic woodfired bistro warmth and brick highlights.',
                  color: 'bg-orange-600',
                },
                {
                  id: 'espresso',
                  name: 'Dark Roast Espresso',
                  desc: 'Rich roasted Arabica & warm cocoa tones. Cozy heritage coffee house.',
                  color: 'bg-amber-950',
                },
                {
                  id: 'burgundy',
                  name: 'Artisan Burgundy',
                  desc: 'Velvet berry wine & French patisserie tones. Luxurious boutique dining.',
                  color: 'bg-rose-900',
                },
              ].map((theme) => (
                <div
                  key={theme.id}
                  onClick={() => {
                    setCafeTheme(theme.id as CafeTheme);
                    showToast(`Brand palette updated to ${theme.name}`, 'success');
                  }}
                  className={cn(
                    'p-4 rounded-2xl border cursor-pointer transition-all',
                    cafeTheme === theme.id
                      ? 'border-primary ring-2 ring-primary/30 bg-primary/5'
                      : 'border-border/80 hover:border-border bg-card'
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className={cn('size-4 rounded-full shrink-0 shadow-sm', theme.color)} />
                    <span className="font-bold text-sm text-foreground">{theme.name}</span>
                    {cafeTheme === theme.id && <Check className="size-4 text-primary ml-auto" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{theme.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* MODAL: TABLE QR CODE GENERATOR & INSPECTOR */}
      <Modal
        isOpen={!!selectedTableForQr}
        onClose={() => setSelectedTableForQr(null)}
        title={selectedTableForQr ? `Table ${selectedTableForQr.number} QR Identifier` : 'Table QR'}
        description="Physical QR placard for dining tables. Scans directly into the mobile digital menu."
      >
        {selectedTableForQr && (
          <div className="space-y-6 text-center">
            {/* The Physical Table QR Placard Preview */}
            <div className="p-6 rounded-[2rem] bg-gradient-to-b from-card to-muted border border-border shadow-xl max-w-xs mx-auto">
              <div className="text-center mb-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary block">
                  Cafe XYZ Artisanal
                </span>
                <h3 className="font-extrabold text-foreground text-xl">Table {selectedTableForQr.number}</h3>
                <span className="text-xs text-muted-foreground">{selectedTableForQr.label}</span>
              </div>

              {/* Dynamic SVG QR Code */}
              <div className="bg-white p-4 rounded-2xl shadow-inner flex items-center justify-center mx-auto w-48 h-48">
                <QRCodeSVG
                  value={`https://cafems.io/table/${selectedTableForQr.number}`}
                  size={160}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <div className="mt-4 text-[10px] font-mono text-muted-foreground tracking-wider uppercase">
                Scan with Phone Camera to Order & Settle
              </div>
            </div>

            {/* Quick Status Setter for Manager */}
            <div className="p-3 rounded-2xl bg-muted/60 border border-border/60 text-left">
              <span className="text-xs font-semibold text-foreground block mb-2">Update Live Status:</span>
              <div className="grid grid-cols-3 gap-2">
                {(['Available', 'Occupied', 'Reserved'] as TableStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      updateTableStatus(selectedTableForQr.number, st);
                      setSelectedTableForQr((prev) => (prev ? { ...prev, status: st } : null));
                    }}
                    className={cn(
                      'py-1.5 px-2 rounded-xl text-xs font-semibold transition-all text-center',
                      selectedTableForQr.status === st
                        ? 'bg-foreground text-background font-bold shadow-sm'
                        : 'bg-card text-muted-foreground hover:text-foreground border border-border/60'
                    )}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions: Download QR & Test Scan in Customer View */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Download className="size-3.5" />}
                onClick={() => {
                  showToast(`High-res SVG QR for Table ${selectedTableForQr.number} prepared for print`, 'success');
                }}
              >
                Download Placard
              </Button>

              <Button
                variant="primary"
                size="sm"
                icon={<ArrowRight className="size-3.5" />}
                onClick={() => {
                  setActiveTableNumber(selectedTableForQr.number);
                  setCurrentRole('customer');
                  setSelectedTableForQr(null);
                }}
              >
                Simulate Guest Scan
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL: ADD / EDIT MENU ITEM (WITH IMAGE UPLOAD CAPABILITY AS REQUESTED) */}
      <Modal
        isOpen={isMenuItemModalOpen}
        onClose={() => setIsMenuItemModalOpen(false)}
        title={editingItem ? 'Edit Culinary Offering' : 'Add New Menu Item'}
        description="Configure pricing, category metadata, and upload photography."
      >
        <form onSubmit={handleSaveMenuItem} className="space-y-4">
          {/* Image Upload Area */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Dish / Drink Photography (Upload or Preset)
            </label>
            <div className="flex items-center gap-4">
              <div className="size-20 rounded-2xl overflow-hidden bg-muted border border-border shrink-0">
                <img src={itemFormImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-2 flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={<Upload className="size-3.5" />}
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs"
                >
                  Upload Device Photo
                </Button>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span>Presets:</span>
                  <button
                    type="button"
                    onClick={() => setItemFormImage('/images/hero_cafe_latte.jpg')}
                    className="hover:underline text-primary"
                  >
                    Latte
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setItemFormImage('/images/cafe_croissant.jpg')}
                    className="hover:underline text-primary"
                  >
                    Croissant
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setItemFormImage('/images/cafe_avocado_toast.jpg')}
                    className="hover:underline text-primary"
                  >
                    Avocado Toast
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Item Name</label>
            <input
              type="text"
              required
              placeholder="e.g., Cortado Single Origin"
              value={itemFormName}
              onChange={(e) => setItemFormName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-muted border border-border focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Category</label>
              <select
                value={itemFormCategory}
                onChange={(e) => setItemFormCategory(e.target.value as MenuCategory)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-muted border border-border focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              >
                {(['Chiya & Teas', 'Specialty Coffee', 'Bakery & Bites', 'Mains & Bowls', 'Desserts'] as MenuCategory[]).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Price (NPR / Rs.)</label>
              <input
                type="number"
                required
                min={10}
                value={itemFormPrice}
                onChange={(e) => setItemFormPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl bg-muted border border-border focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Flavor notes, brewing technique, ingredients..."
              value={itemFormDescription}
              onChange={(e) => setItemFormDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-muted border border-border focus:outline-none focus:ring-1 focus:ring-primary text-foreground resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Prep Time (Mins)</label>
              <input
                type="number"
                min={1}
                value={itemFormPrepTime}
                onChange={(e) => setItemFormPrepTime(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl bg-muted border border-border focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                placeholder="Vegan, Organic, Special"
                value={itemFormTags}
                onChange={(e) => setItemFormTags(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-muted border border-border focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-border/60">
            <Button variant="ghost" size="md" type="button" onClick={() => setIsMenuItemModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              {editingItem ? 'Save Changes' : 'Create Item'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
