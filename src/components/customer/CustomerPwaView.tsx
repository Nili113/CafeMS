import React, { useState } from 'react';
import {
  Coffee,
  ShoppingBag,
  Bell,
  Receipt,
  Search,
  Plus,
  Minus,
  Check,
  Star,
  QrCode,
  ArrowRight,
  MessageSquare,
  Clock,
  Send,
  Utensils,
  CheckCircle2,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useCafeData } from '../../context/CafeDataContext';
import { MenuItem, MenuCategory, OrderItem } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { formatCurrency, cn } from '../../lib/utils';

export const CustomerPwaView: React.FC = () => {
  const {
    activeTableNumber,
    tables,
    menuItems,
    placeOrder,
    callWaiter,
    requestBill,
    orders,
    settleOrderWithFonepay,
    submitFeedback,
    tableAlerts,
    showToast,
  } = useCafeData();

  // Active View Tab: 'menu' | 'waiter' | 'bill' | 'feedback'
  const [activeTab, setActiveTab] = useState<'menu' | 'waiter' | 'bill' | 'feedback'>('menu');

  // Current Table
  const currentTable = tables.find((t) => t.number === activeTableNumber) || tables[0];
  const currentTableOrder = orders.find(
    (o) => o.tableNumber === activeTableNumber && o.status !== 'Completed'
  );

  // Menu Search & Category
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart State
  const [cartItems, setCartItems] = useState<{ [itemId: string]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Waiter Call State
  const [waiterReason, setWaiterReason] = useState<string>('Ready to order');
  const [waiterNote, setWaiterNote] = useState('');
  const [hasCalledWaiter, setHasCalledWaiter] = useState(false);

  // Fonepay Settlement State
  const [fonepayTxnSuccess, setFonepayTxnSuccess] = useState(false);

  // Feedback State
  const [foodRating, setFoodRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [ambienceRating, setAmbienceRating] = useState(5);
  const [feedbackTags, setFeedbackTags] = useState<string[]>(['Chiya Taste', 'Hospitality']);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const categories: ('All' | MenuCategory)[] = [
    'All',
    'Chiya & Teas',
    'Specialty Coffee',
    'Bakery & Bites',
    'Mains & Bowls',
    'Desserts',
  ];

  const waiterReasons = [
    'Ready to order',
    'Water refill',
    'Extra napkins / cutlery',
    'Bill please',
    'Assistance needed',
  ];

  // Cart handlers
  const addToCart = (item: MenuItem) => {
    if (!item.isAvailable) {
      showToast(`${item.name} is currently out of stock (86'd).`, 'warning');
      return;
    }
    setCartItems((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
    showToast(`Added ${item.name} to order tray`, 'success');
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => {
      const copy = { ...prev };
      if (copy[itemId] > 1) {
        copy[itemId] -= 1;
      } else {
        delete copy[itemId];
      }
      return copy;
    });
  };

  const totalCartCount = Object.values(cartItems).reduce((sum, count) => sum + count, 0);

  const cartOrderItems: OrderItem[] = Object.entries(cartItems).map(([id, quantity]) => {
    const item = menuItems.find((m) => m.id === id)!;
    return {
      menuItemId: id,
      name: item?.name || 'Item',
      price: item?.price || 0,
      quantity,
    };
  });

  const cartSubtotal = cartOrderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartServiceTax = Math.round(cartSubtotal * 0.1);
  const cartTotal = cartSubtotal + cartServiceTax;

  const handlePlaceOrder = () => {
    if (cartOrderItems.length === 0) return;
    placeOrder(activeTableNumber, cartOrderItems);
    setCartItems({});
    setIsCartOpen(false);
  };

  // Waiter call submission
  const handleCallWaiter = () => {
    const noteText = `${waiterReason}${waiterNote ? `: ${waiterNote}` : ''}`;
    callWaiter(activeTableNumber, noteText);
    setHasCalledWaiter(true);
    setWaiterNote('');
    setTimeout(() => setHasCalledWaiter(false), 5000);
  };

  // Fonepay payment simulation
  const handleSimulateFonepay = () => {
    setFonepayTxnSuccess(true);
    setTimeout(() => {
      if (currentTableOrder) {
        settleOrderWithFonepay(currentTableOrder.id, activeTableNumber);
      }
      setFonepayTxnSuccess(false);
      setActiveTab('feedback'); // Seamlessly lead guest to share quick feedback
    }, 1200);
  };

  // Feedback submission
  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    const overallRating = Math.round((foodRating + serviceRating + ambienceRating) / 3);
    submitFeedback({
      tableNumber: activeTableNumber,
      rating: overallRating,
      comment: feedbackComment || 'Wonderful dining experience at Cafe XYZ.',
      tags: feedbackTags as any,
    });
    setFeedbackSubmitted(true);
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeAlertForTable = tableAlerts.find(
    (a) => a.tableNumber === activeTableNumber && a.status === 'Active'
  );

  return (
    <div className="w-full max-w-md mx-auto px-4 pb-28 font-sans text-stone-900">
      {/* Table Context Banner */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200/80 mb-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-800 font-bold text-xs flex items-center justify-center font-mono">
            T{activeTableNumber}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-stone-900">{currentTable.label}</h1>
            </div>
            <p className="text-[11px] text-stone-500">Contactless Dine-in Service</p>
          </div>
        </div>

        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          Connected
        </span>
      </div>

      {/* Active Order Pill if Table has placed an order */}
      {currentTableOrder && (
        <div className="mb-4 p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-stone-900">Order #{currentTableOrder.id.replace('ord-', '')}</span>
            <span className="text-stone-400">•</span>
            <span className="text-amber-700 font-medium capitalize">{currentTableOrder.status}</span>
          </div>
          <button
            onClick={() => setActiveTab('bill')}
            className="text-xs font-semibold text-stone-900 hover:underline flex items-center gap-1"
          >
            <span>Bill: {formatCurrency(currentTableOrder.total)}</span>
            <ArrowRight className="size-3" />
          </button>
        </div>
      )}

      {/* VIEW 1: MENU */}
      {activeTab === 'menu' && (
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search chiya, coffee, bakery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 placeholder:text-stone-400 shadow-2xs"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0',
                  selectedCategory === cat
                    ? 'bg-stone-900 text-white shadow-2xs font-semibold'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dish List */}
          <div className="space-y-2.5">
            {filteredItems.map((item) => {
              const qty = cartItems[item.id] || 0;
              return (
                <div
                  key={item.id}
                  className={cn(
                    'p-3 rounded-2xl bg-white border border-stone-200/80 flex items-center gap-3.5 shadow-2xs transition-all',
                    !item.isAvailable && 'opacity-60 bg-stone-50/60'
                  )}
                >
                  {/* Photo */}
                  <div className="relative size-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/60">
                    <img
                      src={item.image}
                      alt={item.name}
                      className={cn('w-full h-full object-cover', !item.isAvailable && 'grayscale')}
                    />
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-1 text-center">
                        <span className="text-[9px] font-black uppercase text-white tracking-widest">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-stone-900 text-xs sm:text-sm tracking-tight truncate">
                      {item.name}
                    </h2>
                    <p className="text-[11px] text-stone-500 line-clamp-1 leading-relaxed mt-0.5">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-mono font-bold text-stone-900 text-xs sm:text-sm">
                        {formatCurrency(item.price)}
                      </span>

                      {/* Stock-aware add button */}
                      {item.isAvailable ? (
                        qty > 0 ? (
                          <div className="flex items-center gap-1.5 bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="size-6 rounded-md bg-white flex items-center justify-center text-stone-700 hover:bg-stone-50"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="font-mono font-bold text-xs px-1 text-stone-900">{qty}</span>
                            <button
                              onClick={() => addToCart(item)}
                              className="size-6 rounded-md bg-stone-900 text-white flex items-center justify-center"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="text-xs font-semibold px-3 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-white flex items-center gap-1 transition-all"
                          >
                            <Plus className="size-3" />
                            <span>Add</span>
                          </button>
                        )
                      ) : (
                        <span className="text-[10px] text-stone-400 font-mono italic">86’d Out</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Cart Pill if items added */}
          {totalCartCount > 0 && (
            <div className="fixed bottom-20 inset-x-4 max-w-md mx-auto z-30">
              <button
                onClick={() => setIsCartOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-stone-900 text-white font-semibold text-xs flex items-center justify-between shadow-lg active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="size-4" />
                  <span>Tray ({totalCartCount} items)</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <span>{formatCurrency(cartTotal)}</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: CALL WAITER (Inspired by Chiya Ghar flow) */}
      {activeTab === 'waiter' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs">
            <h2 className="text-base font-bold text-stone-900">Call a Waiter</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Select what you need. Staff at the counter see it immediately and come to Table {activeTableNumber}.
            </p>

            {/* Reasons Chips */}
            <div className="mt-4">
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-2">
                Reason for Call
              </label>
              <div className="flex flex-wrap gap-1.5">
                {waiterReasons.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setWaiterReason(reason)}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
                      waiterReason === reason
                        ? 'bg-stone-900 text-white font-semibold shadow-2xs'
                        : 'bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200'
                    )}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="mt-4">
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Add a short note (optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Hot water or 2 glasses"
                value={waiterNote}
                onChange={(e) => setWaiterNote(e.target.value)}
                maxLength={80}
                className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 placeholder:text-stone-400"
              />
            </div>

            {/* Big Tactile Call Button */}
            <button
              onClick={handleCallWaiter}
              className="w-full mt-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Bell className="size-4" />
              <span>Call Waiter to Table {activeTableNumber}</span>
            </button>

            {hasCalledWaiter && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Request sent! A server has been dispatched to your table.</span>
              </div>
            )}
          </div>

          {/* Current Request Status */}
          {activeAlertForTable && (
            <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-2xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Active Table Request
              </span>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-900">{activeAlertForTable.type}</span>
                <span className="text-amber-700 font-mono text-[11px]">Staff notified</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: PAY WITH FONEPAY */}
      {activeTab === 'bill' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs text-center">
            <h2 className="text-base font-bold text-stone-900">Pay with Fonepay QR</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Scan with any mobile banking app or eSewa/Khalti wallet.
            </p>

            {/* Official Fonepay Style Card */}
            <div className="my-5 p-5 rounded-2xl bg-white border border-stone-200 shadow-sm max-w-[280px] mx-auto text-center">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-3">
                <span className="font-black text-xs tracking-tight text-stone-900">CAFE XYZ</span>
                <span className="text-[10px] font-bold text-rose-600 font-mono">FONEPAY</span>
              </div>

              {/* QR Code */}
              <div className="p-2 bg-stone-50 rounded-xl inline-block border border-stone-100">
                <QRCodeSVG
                  value={`fonepay://pay?merchant=XYZ_KTM&table=${activeTableNumber}&amount=${currentTableOrder?.total || 990}`}
                  size={150}
                  level="M"
                />
              </div>

              {/* Amount */}
              <div className="mt-3">
                <span className="text-[10px] uppercase font-mono text-stone-400 block">Total Due</span>
                <div className="text-xl font-bold font-mono text-stone-900">
                  {formatCurrency(currentTableOrder?.total || 990)}
                </div>
                <span className="text-[10px] text-stone-400 font-mono">
                  Table {activeTableNumber} • Reference #{currentTableOrder?.id.replace('ord-', '') || '1041'}
                </span>
              </div>
            </div>

            {/* Bill Summary */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5 text-xs text-left mb-4">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal</span>
                <span className="font-mono">{formatCurrency(currentTableOrder?.subtotal || 900)}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Service & VAT (10%)</span>
                <span className="font-mono">{formatCurrency(currentTableOrder?.taxService || 90)}</span>
              </div>
              <div className="flex justify-between text-stone-900 font-bold pt-1.5 border-t border-stone-200">
                <span>Total Amount</span>
                <span className="font-mono">{formatCurrency(currentTableOrder?.total || 990)}</span>
              </div>
            </div>

            {/* Payment Simulation Button */}
            <button
              onClick={handleSimulateFonepay}
              disabled={fonepayTxnSuccess}
              className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-all disabled:opacity-50"
            >
              {fonepayTxnSuccess ? (
                <span>Confirming Bank Settlement...</span>
              ) : (
                <>
                  <Check className="size-3.5" />
                  <span>Simulate Payment via Banking App</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* VIEW 4: FEEDBACK (Inspired by Chiya Ghar flow) */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs">
            {!feedbackSubmitted ? (
              <form onSubmit={handleSendFeedback} className="space-y-4">
                <div>
                  <h2 className="text-base font-bold text-stone-900">How was your visit?</h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    A moment of honesty helps the kitchen and floor staff.
                  </p>
                </div>

                {/* Rating Categories */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-700">Food Quality</span>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setFoodRating(s)}
                          className="p-0.5"
                        >
                          <Star className={cn('size-4', s <= foodRating ? 'fill-amber-400' : 'text-stone-300')} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-700">Service Speed</span>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setServiceRating(s)}
                          className="p-0.5"
                        >
                          <Star className={cn('size-4', s <= serviceRating ? 'fill-amber-400' : 'text-stone-300')} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-700">Ambience</span>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setAmbienceRating(s)}
                          className="p-0.5"
                        >
                          <Star className={cn('size-4', s <= ambienceRating ? 'fill-amber-400' : 'text-stone-300')} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    What stood out most?
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Chiya Taste', 'Food Quality', 'Ambience', 'Service Speed', 'Hospitality'].map((tag) => {
                      const isSel = feedbackTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() =>
                            setFeedbackTags((prev) =>
                              isSel ? prev.filter((t) => t !== tag) : [...prev, tag]
                            )
                          }
                          className={cn(
                            'px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
                            isSel
                              ? 'bg-stone-900 text-white font-semibold'
                              : 'bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200'
                          )}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Notes for the team
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Anything you'd like to share..."
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 placeholder:text-stone-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white font-semibold text-xs transition-all shadow-2xs"
                >
                  Send Feedback
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="size-8 text-emerald-600 mx-auto" />
                <h2 className="text-base font-bold text-stone-900">Thank you!</h2>
                <p className="text-xs text-stone-500">
                  Your feedback has been sent directly to the cafe manager.
                </p>
                <button
                  onClick={() => setFeedbackSubmitted(false)}
                  className="mt-3 text-xs text-stone-700 font-semibold hover:underline"
                >
                  Write another note
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CLEAN MINIMAL BOTTOM 4-TAB NAVIGATION BAR */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200/80 z-40 max-w-md mx-auto shadow-sm">
        <div className="grid grid-cols-4 h-16">
          <button
            onClick={() => setActiveTab('menu')}
            className={cn(
              'flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
              activeTab === 'menu' ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
            )}
          >
            <Utensils className="size-4" />
            <span>Menu</span>
          </button>

          <button
            onClick={() => setActiveTab('waiter')}
            className={cn(
              'relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
              activeTab === 'waiter' ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
            )}
          >
            <Bell className="size-4" />
            <span>Call Waiter</span>
            {activeAlertForTable && (
              <span className="size-1.5 rounded-full bg-amber-500 absolute top-2 right-6 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('bill')}
            className={cn(
              'flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
              activeTab === 'bill' ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
            )}
          >
            <QrCode className="size-4" />
            <span>Pay</span>
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={cn(
              'flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
              activeTab === 'feedback' ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
            )}
          >
            <MessageSquare className="size-4" />
            <span>Feedback</span>
          </button>
        </div>
      </nav>

      {/* CART MODAL */}
      <Modal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        title={`Table ${activeTableNumber} Order Tray`}
        description="Verify items before sending to the kitchen."
      >
        <div className="space-y-4">
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {cartOrderItems.map((item) => (
              <div
                key={item.menuItemId}
                className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-xs text-stone-900">{item.name}</div>
                  <div className="text-[11px] text-stone-500 font-mono">{formatCurrency(item.price)} each</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeFromCart(item.menuItemId)}
                    className="size-6 rounded-md bg-white border border-stone-200 flex items-center justify-center text-stone-700"
                  >
                    <Minus className="size-3" />
                  </button>
                  <span className="font-mono font-bold text-xs px-1 text-stone-900">{item.quantity}</span>
                  <button
                    onClick={() => {
                      const orig = menuItems.find((m) => m.id === item.menuItemId);
                      if (orig) addToCart(orig);
                    }}
                    className="size-6 rounded-md bg-stone-900 text-white flex items-center justify-center"
                  >
                    <Plus className="size-3" />
                  </button>
                </div>

                <span className="font-mono font-bold text-xs text-stone-900 w-16 text-right">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-500">
              <span>Subtotal</span>
              <span className="font-mono">{formatCurrency(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Service & VAT (10%)</span>
              <span className="font-mono">{formatCurrency(cartServiceTax)}</span>
            </div>
            <div className="flex justify-between text-stone-900 font-bold pt-1.5 border-t border-stone-200">
              <span>Total Amount</span>
              <span className="font-mono">{formatCurrency(cartTotal)}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(false)}>
              Back
            </Button>
            <Button variant="primary" size="sm" onClick={handlePlaceOrder}>
              Send to Kitchen
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
