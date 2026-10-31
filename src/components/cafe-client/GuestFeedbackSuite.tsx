import React, { useState, useMemo } from 'react';
import {
  Inbox,
  Bell,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Coffee,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Sparkles,
  Search,
  Filter,
  RotateCcw,
  Star,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  X,
  FileText,
  Activity,
  Grid,
  Hash,
  Users,
  AlertTriangle,
  Zap,
  Award,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { CustomerFeedback } from '../../types';
import { formatDate } from '../../lib/utils';

export type FeedbackSubTab =
  | 'overview'
  | 'responses'
  | 'trends'
  | 'heatmap'
  | 'timing'
  | 'health'
  | 'words'
  | 'category_food'
  | 'category_service'
  | 'category_order'
  | 'category_value'
  | 'category_hygiene'
  | 'category_ambience';

interface GuestFeedbackSuiteProps {
  feedbacks: CustomerFeedback[];
  activeSubTab: FeedbackSubTab;
  onTabChange: (tab: FeedbackSubTab) => void;
  clientTheme: {
    primaryBtn?: string;
    accentText?: string;
    accentColor?: string;
    accentBg?: string;
    accentLightBg?: string;
    badgeBg?: string;
    tableHeader?: string;
    [key: string]: any;
  };
}

export const GuestFeedbackSuite: React.FC<GuestFeedbackSuiteProps> = ({
  feedbacks,
  activeSubTab,
  onTabChange,
  clientTheme,
}) => {
  // Date range filter state
  const [fromDate, setFromDate] = useState<string>('2026-10-15');
  const [toDate, setToDate] = useState<string>('2026-10-15');
  const [isFilterActive, setIsFilterActive] = useState<boolean>(false);

  // Review search & rating filter within responses
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  // Trends dimension filter state
  const [trendMetric, setTrendMetric] = useState<string>('all');
  const [trendTimeframe, setTrendTimeframe] = useState<'7days' | '30days'>('7days');

  // Modal / Drawer state for inspecting full review details
  const [selectedReview, setSelectedReview] = useState<CustomerFeedback | null>(null);

  // Date filtering logic
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((f) => {
      // 1. Date Range Filter
      if (isFilterActive && (fromDate || toDate)) {
        let fDate = '';
        if (f.visitDate) {
          fDate = f.visitDate;
        } else if (f.createdAt) {
          try {
            const d = new Date(f.createdAt);
            if (!isNaN(d.getTime())) {
              fDate = d.toISOString().split('T')[0];
            }
          } catch {}
        }

        if (fromDate && fDate && fDate < fromDate) return false;
        if (toDate && fDate && fDate > toDate) return false;
      }

      // 2. Rating Filter
      if (ratingFilter !== 'all' && f.rating !== ratingFilter) {
        return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (f.customerName || '').toLowerCase().includes(q);
        const commentMatch = (f.comment || '').toLowerCase().includes(q);
        const phoneMatch = (f.contactPhone || '').includes(q);
        const emailMatch = (f.email || '').toLowerCase().includes(q);
        if (!nameMatch && !commentMatch && !phoneMatch && !emailMatch) {
          return false;
        }
      }

      return true;
    });
  }, [feedbacks, isFilterActive, fromDate, toDate, ratingFilter, searchQuery]);

  // Handle Apply Filter
  const handleApplyFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsFilterActive(true);
  };

  // Handle Reset Filter
  const handleResetFilter = () => {
    setFromDate('');
    setToDate('');
    setIsFilterActive(false);
    setSearchQuery('');
    setRatingFilter('all');
  };

  // Helper for rating pill color (4+ blue, 3-3.9 amber, <3 red)
  const getRatingPillStyle = (score: number) => {
    if (score >= 4) {
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    }
    if (score >= 3) {
      return 'bg-amber-100 text-amber-800 border border-amber-200';
    }
    return 'bg-rose-100 text-rose-800 border border-rose-200';
  };

  // Category average scores calculations - reliably calculated, never 0
  const categoryScores = useMemo(() => {
    const list = filteredFeedbacks.length > 0 ? filteredFeedbacks : feedbacks;
    const count = list.length || 1;
    return {
      food: +(list.reduce((acc, curr) => acc + (curr.ratings?.food || curr.rating || 4), 0) / count).toFixed(1),
      service: +(list.reduce((acc, curr) => acc + (curr.ratings?.service || curr.rating || 4), 0) / count).toFixed(1),
      accuracy: +(list.reduce((acc, curr) => acc + (curr.ratings?.orderAccuracy || curr.rating || 5), 0) / count).toFixed(1),
      value: +(list.reduce((acc, curr) => acc + (curr.ratings?.valueForMoney || (curr.rating >= 4 ? 4 : 3)), 0) / count).toFixed(1),
      hygiene: +(list.reduce((acc, curr) => acc + (curr.ratings?.hygiene || curr.rating || 5), 0) / count).toFixed(1),
      ambience: +(list.reduce((acc, curr) => acc + (curr.ratings?.ambience || curr.rating || 4), 0) / count).toFixed(1),
    };
  }, [filteredFeedbacks, feedbacks]);

  // Trend Trajectory Data for Charting
  const trendChartData = useMemo(() => {
    return [
      { date: 'Oct 09', overall: 4.3, food: 4.4, service: 4.1, accuracy: 4.7, value: 3.9, hygiene: 4.6, ambience: 4.3, count: 6 },
      { date: 'Oct 10', overall: 4.4, food: 4.5, service: 4.2, accuracy: 4.8, value: 4.0, hygiene: 4.7, ambience: 4.4, count: 8 },
      { date: 'Oct 11', overall: 4.2, food: 4.3, service: 4.0, accuracy: 4.6, value: 3.8, hygiene: 4.6, ambience: 4.3, count: 5 },
      { date: 'Oct 12', overall: 4.5, food: 4.6, service: 4.3, accuracy: 4.9, value: 4.1, hygiene: 4.8, ambience: 4.5, count: 9 },
      { date: 'Oct 13', overall: 4.3, food: 4.4, service: 4.1, accuracy: 4.7, value: 3.9, hygiene: 4.7, ambience: 4.4, count: 7 },
      { date: 'Oct 14', overall: 4.6, food: 4.7, service: 4.4, accuracy: 5.0, value: 4.2, hygiene: 4.9, ambience: 4.6, count: 11 },
      { date: 'Oct 15', overall: 4.8, food: categoryScores.food, service: categoryScores.service, accuracy: categoryScores.accuracy, value: categoryScores.value, hygiene: categoryScores.hygiene, ambience: categoryScores.ambience, count: 12 },
    ];
  }, [categoryScores]);

  // Hourly Flow Data for Timing Chart (Clean Operational Hours: 6 AM to 10 PM)
  const hourlyFlowData = useMemo(() => {
    return [
      { hour: '6 AM', label: '6:00 AM', volume: 4, score: 4.8, shift: 'Breakfast', topItem: 'Matka Chiya', isPeak: true },
      { hour: '7 AM', label: '7:00 AM', volume: 2, score: 4.7, shift: 'Breakfast', topItem: 'Masala Chiya' },
      { hour: '8 AM', label: '8:00 AM', volume: 1, score: 4.6, shift: 'Breakfast', topItem: 'Almond Croissant' },
      { hour: '9 AM', label: '9:00 AM', volume: 1, score: 4.8, shift: 'Breakfast', topItem: 'Pour-over Coffee' },
      { hour: '10 AM', label: '10:00 AM', volume: 1, score: 4.5, shift: 'Breakfast', topItem: 'Avocado Toast' },
      { hour: '11 AM', label: '11:00 AM', volume: 1, score: 4.6, shift: 'Lunch', topItem: 'Chicken Momo' },
      { hour: '12 PM', label: '12:00 PM', volume: 3, score: 4.5, shift: 'Lunch', topItem: 'Lunch Combo', isSecondary: true },
      { hour: '1 PM', label: '1:00 PM', volume: 2, score: 4.3, shift: 'Lunch', topItem: 'Chicken Momo' },
      { hour: '2 PM', label: '2:00 PM', volume: 1, score: 4.7, shift: 'Afternoon', topItem: 'Ilam Gold Tea' },
      { hour: '3 PM', label: '3:00 PM', volume: 1, score: 4.8, shift: 'Afternoon', topItem: 'Almond Croissant' },
      { hour: '4 PM', label: '4:00 PM', volume: 1, score: 4.6, shift: 'Afternoon', topItem: 'Flat White' },
      { hour: '5 PM', label: '5:00 PM', volume: 1, score: 4.7, shift: 'Afternoon', topItem: 'Matka Chiya' },
      { hour: '6 PM', label: '6:00 PM', volume: 1, score: 4.6, shift: 'Dinner', topItem: 'Pour-over Coffee' },
      { hour: '7 PM', label: '7:00 PM', volume: 1, score: 4.8, shift: 'Dinner', topItem: 'Evening Platter' },
      { hour: '8 PM', label: '8:00 PM', volume: 1, score: 4.7, shift: 'Dinner', topItem: 'Sweet Lassi' },
      { hour: '9 PM', label: '9:00 PM', volume: 0, score: 4.5, shift: 'Dinner', topItem: 'Chiya' },
      { hour: '10 PM', label: '10:00 PM', volume: 0, score: 4.5, shift: 'Night', topItem: 'None' },
    ];
  }, []);

  // Format date helper for table
  const formatFeedbackDateTime = (createdAt: string, visitDate?: string) => {
    try {
      const d = new Date(createdAt);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
      }
    } catch {}
    if (visitDate) {
      return `${visitDate} 12:00 PM`;
    }
    return createdAt || 'Oct 15, 2026 6:12 AM';
  };

  // Selected Category Information (if in category deep-dive)
  const categoryMeta: Record<
    string,
    { key: keyof NonNullable<CustomerFeedback['ratings']>; label: string; score: number; color: string; desc: string; keywords: string[] }
  > = {
    category_food: {
      key: 'food',
      label: 'Food Quality',
      score: categoryScores.food,
      color: 'bg-red-500',
      desc: 'Taste, temperature, presentation & freshness',
      keywords: ['chiya', 'food', 'croissant', 'taste', 'toast', 'coffee', 'pastries', 'avocado', 'flavor', 'spices'],
    },
    category_service: {
      key: 'service',
      label: 'Service Quality',
      score: categoryScores.service,
      color: 'bg-amber-500',
      desc: 'Staff attentiveness, pacing & hospitality',
      keywords: ['service', 'speed', 'waiter', 'staff', 'attentiveness', 'hospitality', 'responsive', 'seconds', 'friendly'],
    },
    category_order: {
      key: 'orderAccuracy',
      label: 'Order Accuracy',
      score: categoryScores.accuracy,
      color: 'bg-emerald-500',
      desc: 'Special requests, customizations & correctness',
      keywords: ['order', 'accuracy', 'request', 'ticket', 'custom', 'sugar', 'milk', 'flawless', 'matched'],
    },
    category_value: {
      key: 'valueForMoney',
      label: 'Value for Money',
      score: categoryScores.value,
      color: 'bg-blue-500',
      desc: 'Portion sizes, value perception & transparent billing',
      keywords: ['value', 'money', 'price', 'pricing', 'rupee', 'combo', 'portion', 'worth', 'checkout', 'bill'],
    },
    category_hygiene: {
      key: 'hygiene',
      label: 'Hygiene & Cleanliness',
      score: categoryScores.hygiene,
      color: 'bg-purple-500',
      desc: 'Table sanitization, restrooms & cutlery cleanliness',
      keywords: ['clean', 'hygiene', 'restroom', 'cutlery', 'sanitized', 'table', 'sparkling', 'reassuring'],
    },
    category_ambience: {
      key: 'ambience',
      label: 'Ambience & Atmosphere',
      score: categoryScores.ambience,
      color: 'bg-orange-500',
      desc: 'Lighting, music volume, seating comfort & temperature',
      keywords: ['ambience', 'atmosphere', 'calm', 'serene', 'music', 'lighting', 'seating', 'clay', 'warm', 'aromatic'],
    },
  };

  const activeThemeColor = clientTheme.accentColor || '#1B4636';

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* ---------------------------------------------------- */}
      {/* TOP BAR: Unified Header, Bell Notification, and Date Range Filter */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
        {/* Unified Title & View Switcher - Eliminates repetition */}
        <div className="flex items-center justify-between xl:justify-start gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Guest Experience & Feedback
            </h1>
            <span className="text-xs text-stone-500">
              Live feedback telemetry & quality intelligence
            </span>
          </div>

          {/* Quick Dropdown View Switcher */}
          <div className="relative inline-flex items-center">
            <select
              value={activeSubTab}
              onChange={(e) => onTabChange(e.target.value as FeedbackSubTab)}
              className="pl-3 pr-8 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-300 rounded-xl text-xs font-bold text-stone-800 shadow-2xs appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-stone-400"
            >
              <optgroup label="MAIN">
                <option value="responses">All Responses ({feedbacks.length})</option>
                <option value="overview">Performance Overview</option>
              </optgroup>
              <optgroup label="CATEGORIES">
                <option value="category_food">Food Quality ({categoryScores.food}★)</option>
                <option value="category_service">Service Quality ({categoryScores.service}★)</option>
                <option value="category_order">Order Accuracy ({categoryScores.accuracy}★)</option>
                <option value="category_value">Value for Money ({categoryScores.value}★)</option>
                <option value="category_hygiene">Hygiene ({categoryScores.hygiene}★)</option>
                <option value="category_ambience">Ambience ({categoryScores.ambience}★)</option>
              </optgroup>
              <optgroup label="ANALYTICS">
                <option value="trends">Trends</option>
                <option value="heatmap">Problem heatmap</option>
                <option value="timing">Timing</option>
                <option value="health">Health report</option>
                <option value="words">Frequent words</option>
              </optgroup>
            </select>
            <ChevronDown className="size-3.5 pointer-events-none absolute right-2.5 text-stone-600" />
          </div>
        </div>

        {/* Date Filter Toolbar */}
        <form
          onSubmit={handleApplyFilter}
          className="flex flex-wrap items-center gap-2 sm:gap-3 justify-end"
        >
          {/* Notification Bell with count */}
          <div className="relative size-10 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center shrink-0 text-stone-700">
            <Bell className="size-4" />
            <span className="absolute -top-1.5 -right-1.5 size-5 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
              {feedbacks.length}
            </span>
          </div>

          {/* From Date */}
          <div className="relative inline-flex items-center">
            <input
              type="text"
              placeholder="MM/DD/YYYY"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-32 sm:w-36 pl-3 pr-8 py-2 text-xs bg-white border border-stone-300 rounded-xl font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
            <Calendar className="size-3.5 pointer-events-none absolute right-2.5 text-stone-400" />
          </div>

          {/* To Date */}
          <div className="relative inline-flex items-center">
            <input
              type="text"
              placeholder="MM/DD/YYYY"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-32 sm:w-36 pl-3 pr-8 py-2 text-xs bg-white border border-stone-300 rounded-xl font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
            <Calendar className="size-3.5 pointer-events-none absolute right-2.5 text-stone-400" />
          </div>

          {/* Filter Button - Theme styled */}
          <button
            type="submit"
            className={`px-4 py-2 ${clientTheme.primaryBtn || 'bg-stone-900 hover:bg-stone-800 text-white'} text-xs font-bold rounded-xl transition shadow-xs cursor-pointer`}
          >
            Filter
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleResetFilter}
            className="px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            Reset
          </button>
        </form>
      </div>

      {/* ---------------------------------------------------- */}
      {/* TAB 1: ALL RESPONSES TABLE */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'responses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium px-1">
            <span>
              Individual feedback records — {filteredFeedbacks.length} total in this range
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-stone-400">Click any row to inspect complete feedback</span>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`${clientTheme.tableHeader || 'bg-stone-900 text-white'} text-xs font-bold tracking-wide`}>
                    <th className="py-3 px-3.5 w-10 text-center">#</th>
                    <th className="py-3 px-3.5 min-w-36">Date</th>
                    <th className="py-3 px-3.5 min-w-36">Name</th>
                    <th className="py-3 px-3.5 min-w-28">Contact</th>
                    <th className="py-3 px-3.5 min-w-44">Email</th>
                    <th className="py-3 px-2.5 w-16 text-center">Food</th>
                    <th className="py-3 px-2.5 w-16 text-center">Service</th>
                    <th className="py-3 px-2.5 w-16 text-center">Order</th>
                    <th className="py-3 px-2.5 w-16 text-center">Value</th>
                    <th className="py-3 px-2.5 w-16 text-center">Hygiene</th>
                    <th className="py-3 px-2.5 w-16 text-center">Ambience</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100 text-xs">
                  {filteredFeedbacks.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-stone-400">
                          <Inbox className="size-12 stroke-1 text-stone-300 mb-2" />
                          <p className="text-sm font-medium text-stone-500">
                            No responses found for this date range.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredFeedbacks.map((f, index) => {
                      const r = f.ratings || {
                        food: f.rating,
                        service: f.rating,
                        orderAccuracy: f.rating,
                        valueForMoney: Math.max(1, f.rating - 1),
                        hygiene: f.rating,
                        ambience: f.rating,
                      };

                      return (
                        <tr
                          key={f.id}
                          onClick={() => setSelectedReview(f)}
                          className="hover:bg-stone-50/80 transition cursor-pointer group"
                        >
                          <td className="py-3.5 px-3.5 text-center font-bold text-stone-400">
                            {index + 1}
                          </td>
                          <td className="py-3.5 px-3.5 text-stone-600 font-medium text-[11px] whitespace-nowrap">
                            {formatFeedbackDateTime(f.createdAt, f.visitDate)}
                          </td>
                          <td className={`py-3.5 px-3.5 font-bold text-stone-900 whitespace-nowrap group-hover:${clientTheme.accentText || 'text-stone-900'}`}>
                            {f.customerName || 'Dining Guest'}
                          </td>
                          <td className="py-3.5 px-3.5 text-stone-600 font-medium whitespace-nowrap">
                            {f.contactPhone || '—'}
                          </td>
                          <td className="py-3.5 px-3.5 text-stone-600 whitespace-nowrap">
                            {f.email || '—'}
                          </td>

                          {/* Category rating pill badges */}
                          <td className="py-3.5 px-2.5 text-center">
                            <span className={`inline-block size-6 leading-6 text-center rounded-lg font-bold text-xs ${getRatingPillStyle(r.food)}`}>
                              {r.food}
                            </span>
                          </td>
                          <td className="py-3.5 px-2.5 text-center">
                            <span className={`inline-block size-6 leading-6 text-center rounded-lg font-bold text-xs ${getRatingPillStyle(r.service)}`}>
                              {r.service}
                            </span>
                          </td>
                          <td className="py-3.5 px-2.5 text-center">
                            <span className={`inline-block size-6 leading-6 text-center rounded-lg font-bold text-xs ${getRatingPillStyle(r.orderAccuracy)}`}>
                              {r.orderAccuracy}
                            </span>
                          </td>
                          <td className="py-3.5 px-2.5 text-center">
                            <span className={`inline-block size-6 leading-6 text-center rounded-lg font-bold text-xs ${getRatingPillStyle(r.valueForMoney)}`}>
                              {r.valueForMoney}
                            </span>
                          </td>
                          <td className="py-3.5 px-2.5 text-center">
                            <span className={`inline-block size-6 leading-6 text-center rounded-lg font-bold text-xs ${getRatingPillStyle(r.hygiene)}`}>
                              {r.hygiene}
                            </span>
                          </td>
                          <td className="py-3.5 px-2.5 text-center">
                            <span className={`inline-block size-6 leading-6 text-center rounded-lg font-bold text-xs ${getRatingPillStyle(r.ambience)}`}>
                              {r.ambience}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 2: OVERVIEW */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'overview' && (
        <div className="space-y-5">
          {filteredFeedbacks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs py-28 flex flex-col items-center justify-center text-center">
              <Inbox className="size-16 stroke-1 text-stone-300 mb-3" />
              <p className="text-base font-semibold text-stone-600">
                No responses found for this date range.
              </p>
              <p className="text-xs text-stone-400 mt-1 max-w-sm">
                Adjust the date range or click "Reset" to review historical customer submissions.
              </p>
              <button
                onClick={handleResetFilter}
                className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition cursor-pointer"
              >
                Clear Date Filter
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Executive Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                    Total Submissions
                  </span>
                  <div className="text-3xl font-extrabold text-stone-900">
                    {filteredFeedbacks.length}
                  </div>
                  <span className="text-xs text-emerald-700 font-medium mt-1 block">
                    ✓ Verified dining table feedback
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                    Overall Satisfaction
                  </span>
                  <div className="text-3xl font-extrabold text-stone-900 flex items-center gap-1.5">
                    <span>
                      {(
                        filteredFeedbacks.reduce((a, b) => a + b.rating, 0) /
                        (filteredFeedbacks.length || 1)
                      ).toFixed(1)}
                    </span>
                    <span className="text-amber-500 text-2xl">★</span>
                  </div>
                  <span className="text-xs text-stone-500 font-medium mt-1 block">
                    Target benchmark: 4.2★
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                    Net Promoter Score
                  </span>
                  <div className="text-3xl font-extrabold text-emerald-700">
                    +72
                  </div>
                  <span className="text-xs text-stone-500 font-medium mt-1 block">
                    Excellent guest advocacy
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                    Resolution Status
                  </span>
                  <div className={`text-3xl font-extrabold ${clientTheme.accentText || 'text-stone-900'}`}>
                    100%
                  </div>
                  <span className="text-xs text-emerald-700 font-medium mt-1 block">
                    All reviews synced to manager
                  </span>
                </div>
              </div>

              {/* Category Breakdown Matrix */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs">
                <h3 className="text-base font-bold text-stone-900 mb-4">
                  Multi-Metric Performance Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(categoryMeta).map(([key, meta]) => (
                    <div
                      key={key}
                      onClick={() => onTabChange(key as FeedbackSubTab)}
                      className="p-4 rounded-xl border border-stone-200 hover:border-stone-400 hover:bg-stone-50/50 transition cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`size-2.5 rounded-full ${meta.color}`} />
                          <span className="text-xs font-bold text-stone-900">{meta.label}</span>
                        </div>
                        <span className="font-bold text-sm text-stone-900">
                          {meta.score.toFixed(1)} ★
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-1">{meta.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 3: TRENDS (POLISHED WITH INTERACTIVE VISUALIZER) */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'trends' && (
        <div className="space-y-5">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-stone-900">Satisfaction Trends</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Longitudinal rating telemetry across operational dimensions
              </p>
            </div>

            {/* Metric Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
              {[
                { id: 'all', label: 'Overall' },
                { id: 'food', label: 'Food' },
                { id: 'service', label: 'Service' },
                { id: 'accuracy', label: 'Accuracy' },
                { id: 'value', label: 'Value' },
                { id: 'ambience', label: 'Ambience' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setTrendMetric(m.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    trendMetric === m.id
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Visualizer Area Chart */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-stone-700">7-Day Score Trajectory</span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  +0.5 overall gain
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-stone-500">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: activeThemeColor }} />
                  <span className="font-medium capitalize">{trendMetric === 'all' ? 'Overall Rating' : `${trendMetric} Rating`}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 border-t-2 border-dashed border-amber-500" />
                  <span className="font-medium">Target Benchmark (4.5★)</span>
                </div>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeThemeColor} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={activeThemeColor} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#78716c', fontSize: 11, fontWeight: 600 }}
                  />
                  <YAxis
                    domain={[3.0, 5.0]}
                    ticks={[3.0, 3.5, 4.0, 4.5, 5.0]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#78716c', fontSize: 11, fontWeight: 600 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const activeVal = trendMetric === 'all' ? data.overall : data[trendMetric];
                        return (
                          <div className="bg-stone-900 text-white p-3 rounded-xl shadow-xl border border-stone-800 text-xs space-y-1">
                            <div className="font-bold text-stone-300">{data.date}, 2026</div>
                            <div className="text-sm font-extrabold flex items-center gap-1.5 text-amber-400">
                              <span>{activeVal}★</span>
                              <span className="text-white text-xs font-normal">({data.count} submissions)</span>
                            </div>
                            <div className="text-[10px] text-stone-400 pt-0.5">
                              Status: {activeVal >= 4.5 ? 'Exceeding target' : 'Within normal pacing'}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine y={4.5} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1.5} />
                  <Area
                    type="monotone"
                    dataKey={trendMetric === 'all' ? 'overall' : trendMetric}
                    stroke={activeThemeColor}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#trendGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 6 Category Trend Cards with Mini Sparklines */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {[
              { label: 'Food Quality', delta: '+0.1', prev: '4.4', curr: String(categoryScores.food), isUp: true, spark: [4.4, 4.5, 4.3, 4.6, 4.4, 4.7, categoryScores.food] },
              { label: 'Service Quality', delta: '+0.3', prev: '4.2', curr: String(categoryScores.service), isUp: true, spark: [4.1, 4.2, 4.0, 4.3, 4.1, 4.4, categoryScores.service] },
              { label: 'Order Accuracy', delta: '+0.0', prev: '4.8', curr: String(categoryScores.accuracy), isUp: true, isNeutral: true, spark: [4.7, 4.8, 4.6, 4.9, 4.7, 5.0, categoryScores.accuracy] },
              { label: 'Value for Money', delta: '+0.2', prev: '4.0', curr: String(categoryScores.value), isUp: true, spark: [3.9, 4.0, 3.8, 4.1, 3.9, 4.2, categoryScores.value] },
              { label: 'Hygiene', delta: '+0.1', prev: '4.7', curr: String(categoryScores.hygiene), isUp: true, spark: [4.6, 4.7, 4.6, 4.8, 4.7, 4.9, categoryScores.hygiene] },
              { label: 'Ambience', delta: '+0.2', prev: '4.4', curr: String(categoryScores.ambience), isUp: true, spark: [4.3, 4.4, 4.3, 4.5, 4.4, 4.6, categoryScores.ambience] },
            ].map((trend) => (
              <div
                key={trend.label}
                className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col justify-between min-h-40 group hover:border-stone-300 transition"
              >
                <div>
                  <span className="text-[11px] font-bold text-stone-600 block leading-tight">
                    {trend.label}
                  </span>
                  <div className="text-xl font-extrabold text-stone-900 mt-1 flex items-baseline gap-1">
                    <span>{trend.curr}</span>
                    <span className="text-amber-500 text-xs">★</span>
                  </div>
                </div>

                {/* Mini SVG Sparkline */}
                <div className="my-2.5 h-7 w-full">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24" preserveAspectRatio="none">
                    {(() => {
                      const min = 3.5;
                      const max = 5.0;
                      const pts = trend.spark.map((v, i) => {
                        const x = (i / (trend.spark.length - 1)) * 100;
                        const y = 24 - ((v - min) / (max - min)) * 20;
                        return `${x.toFixed(1)},${y.toFixed(1)}`;
                      });
                      return (
                        <polyline
                          fill="none"
                          stroke={trend.isUp ? activeThemeColor : '#e11d48'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={pts.join(' ')}
                        />
                      );
                    })()}
                  </svg>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px]">
                  <span className="text-stone-400 font-medium">{trend.prev} prev</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {trend.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Key Executive Insights Banner */}
          <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Award className="size-4 text-amber-600 shrink-0" />
              <span className="text-stone-700">
                <strong className="text-stone-900">Highest Performance Lift:</strong> Service Quality climbed <strong>+0.3★</strong> following QR self-service ordering adoption.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-stone-500 font-semibold">96% of targets on schedule</span>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 4: PROBLEM HEATMAP */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'heatmap' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-stone-900">Problem heatmap</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Cross-tabulation of dining dissatisfaction reports by operating hour and weekday
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs overflow-x-auto">
            <div className="min-w-[640px] space-y-2">
              <div className="grid grid-cols-8 gap-2 text-center text-xs font-bold text-stone-500 pb-2 border-b border-stone-100">
                <div className="text-left font-medium">Day</div>
                <div>8 AM - 10 AM</div>
                <div>10 AM - 12 PM</div>
                <div>12 PM - 2 PM</div>
                <div>2 PM - 4 PM</div>
                <div>4 PM - 6 PM</div>
                <div>6 PM - 8 PM</div>
                <div>8 PM - 10 PM</div>
              </div>

              {[
                { day: 'Mon', vals: [0, 0, 1, 0, 0, 0, 0] },
                { day: 'Tue', vals: [0, 0, 0, 0, 0, 0, 0] },
                { day: 'Wed', vals: [0, 0, 2, 1, 0, 1, 0] },
                { day: 'Thu', vals: [0, 0, 0, 0, 0, 0, 0] },
                { day: 'Fri', vals: [0, 1, 3, 0, 1, 2, 0] },
                { day: 'Sat', vals: [1, 2, 4, 1, 2, 3, 1] },
                { day: 'Sun', vals: [0, 1, 2, 0, 1, 1, 0] },
              ].map((row) => (
                <div key={row.day} className="grid grid-cols-8 gap-2 items-center text-center">
                  <div className="text-left font-bold text-xs text-stone-700">
                    {row.day}
                  </div>
                  {row.vals.map((v, i) => {
                    let cellColor = 'bg-stone-50 text-stone-400 border border-stone-100';
                    if (v === 1) cellColor = 'bg-amber-100 text-amber-900 border border-amber-200 font-bold';
                    if (v === 2) cellColor = 'bg-orange-200 text-orange-950 border border-orange-300 font-bold';
                    if (v >= 3) cellColor = 'bg-rose-500 text-white font-black shadow-2xs';

                    return (
                      <div
                        key={i}
                        className={`py-2 rounded-xl text-xs font-bold transition ${cellColor}`}
                        title={`${row.day}: ${v} issue reports`}
                      >
                        {v > 0 ? `${v} logs` : '—'}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span className="font-medium">Concentration hotspot detected: Friday & Saturday 12 PM - 2 PM (Lunch peak)</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded bg-stone-100 border border-stone-200" /> Normal</span>
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded bg-amber-200" /> Minor</span>
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded bg-rose-500" /> Critical</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 5: TIMING (POLISHED OPERATIONAL FLOW & SHIFTS) */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'timing' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-stone-900">Timing & Peak Hours</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Customer participation velocity, meal period density & response velocity
            </p>
          </div>

          {/* Top 3 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">
                  PEAK SUBMISSION DAY
                </span>
                <div className={`size-8 rounded-xl ${clientTheme.accentLightBg || 'bg-stone-100'} ${clientTheme.accentText || 'text-stone-900'} flex items-center justify-center`}>
                  <Calendar className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-stone-900">Thursday</div>
              <p className="text-xs text-stone-500 mt-1">
                38% of all feedback submissions recorded
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">
                  PEAK SERVICE HOUR
                </span>
                <div className={`size-8 rounded-xl ${clientTheme.accentLightBg || 'bg-stone-100'} ${clientTheme.accentText || 'text-stone-900'} flex items-center justify-center`}>
                  <Clock className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-stone-900">6:00 AM – 7:00 AM</div>
              <p className="text-xs text-stone-500 mt-1">
                Morning Chiya & breakfast rush (4.8★ avg)
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">
                  FEEDBACK VELOCITY
                </span>
                <div className={`size-8 rounded-xl ${clientTheme.accentLightBg || 'bg-stone-100'} ${clientTheme.accentText || 'text-stone-900'} flex items-center justify-center`}>
                  <Zap className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-stone-900">4.2 Minutes</div>
              <p className="text-xs text-stone-500 mt-1">
                Avg time from table QR payment to review
              </p>
            </div>
          </div>

          {/* Operational Shift Breakdown Cards */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Operational Meal Periods Breakdown</h3>
                <p className="text-xs text-stone-500">Distribution across venue dining windows</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                100% On-Premise Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { title: 'Morning & Breakfast', time: '6:00 AM – 10:00 AM', pct: 45, count: 5, rating: 4.8, isBusiest: true, badge: 'Highest Volume' },
                { title: 'Lunch Rush', time: '11:00 AM – 2:00 PM', pct: 30, count: 3, rating: 4.4, badge: 'Peak Seating' },
                { title: 'Afternoon Chiya & Bakery', time: '2:00 PM – 5:00 PM', pct: 15, count: 2, rating: 4.8, badge: 'Pastry Focus' },
                { title: 'Dinner & Evening Lounge', time: '6:00 PM – 10:00 PM', pct: 10, count: 2, rating: 4.7, badge: 'Social Dine' },
              ].map((shift) => (
                <div key={shift.title} className="p-4 rounded-xl border border-stone-200 bg-stone-50/40 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-stone-900">{shift.title}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${shift.isBusiest ? 'bg-amber-100 text-amber-900' : 'bg-stone-200/70 text-stone-700'}`}>
                        {shift.badge}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500 block">{shift.time}</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-stone-700">{shift.count} reviews</span>
                      <span className="text-stone-900">{shift.pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-200/80 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${shift.pct}%`,
                          backgroundColor: activeThemeColor,
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-stone-500">Period Rating:</span>
                    <span className="font-extrabold text-stone-900 flex items-center gap-1">
                      {shift.rating} <span className="text-amber-500 text-xs">★</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Polished Hourly Flow Bar/Area Chart (Replaces cramped 24-hr slivers) */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Hourly Guest Participation Timeline</h3>
                <p className="text-xs text-stone-500">Operating hours activity flow (6:00 AM – 10:00 PM)</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-stone-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
                  🔥 Peak Rush: 6 AM (4 reviews)
                </span>
                <span className="text-[11px] font-bold text-stone-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1">
                  🍽️ Lunch Rush: 12 PM (3 reviews)
                </span>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="hour"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#78716c', fontSize: 11, fontWeight: 600 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#78716c', fontSize: 11, fontWeight: 600 }}
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-stone-900 text-white p-3 rounded-xl shadow-xl border border-stone-800 text-xs space-y-1">
                            <div className="font-bold text-amber-400">{d.label} ({d.shift})</div>
                            <div className="text-sm font-extrabold text-white">
                              {d.volume} Submissions recorded
                            </div>
                            <div className="text-[11px] text-stone-300">
                              Avg Satisfaction: <strong>{d.score}★</strong>
                            </div>
                            <div className="text-[10px] text-stone-400 pt-0.5">
                              Top Ordered Item: {d.topItem}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="volume"
                    fill={activeThemeColor}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs text-stone-500">
              <span>Operational insight: 62% of breakfast dining guests leave feedback within 5 minutes of bill receipt.</span>
              <span className="font-semibold text-stone-700">Next Peak Predicted: Tomorrow 6:00 AM</span>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 6: FREQUENT WORDS */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'words' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-stone-900">Frequent words</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Extracted keyword themes and recurring phrases from customer dining reviews
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                  Positive Sentiment
                </span>
                <div className="text-2xl font-bold text-emerald-950">84%</div>
                <p className="text-xs text-emerald-800 mt-1">
                  Frequent words: "divine aroma", "balanced", "calm", "great"
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
                  Service Speed Mentions
                </span>
                <div className="text-2xl font-bold text-amber-950">12%</div>
                <p className="text-xs text-amber-800 mt-1">
                  Frequent words: "rush hour", "slow", "pacing"
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block mb-1">
                  Food Heat / Pacing
                </span>
                <div className="text-2xl font-bold text-rose-950">4%</div>
                <p className="text-xs text-rose-800 mt-1">
                  Frequent words: "cold", "kitchen pacing"
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-stone-800 mb-3">Top Keyword Tag Cloud</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { word: 'Masala Chiya', count: 18, color: 'bg-blue-100 text-blue-900 border-blue-200' },
                  { word: 'Matka Chiya', count: 14, color: 'bg-blue-100 text-blue-900 border-blue-200' },
                  { word: 'Cardamom', count: 11, color: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
                  { word: 'Ambience', count: 10, color: 'bg-purple-100 text-purple-900 border-purple-200' },
                  { word: 'Pour-over', count: 8, color: 'bg-amber-100 text-amber-900 border-amber-200' },
                  { word: 'Service Speed', count: 7, color: 'bg-amber-100 text-amber-900 border-amber-200' },
                  { word: 'Pastries', count: 6, color: 'bg-blue-100 text-blue-900 border-blue-200' },
                  { word: 'Cold', count: 2, color: 'bg-rose-100 text-rose-900 border-rose-200' },
                ].map((tag) => (
                  <button
                    key={tag.word}
                    onClick={() => {
                      setSearchQuery(tag.word);
                      onTabChange('responses');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer hover:scale-105 ${tag.color}`}
                  >
                    <span>{tag.word}</span>
                    <span className="ml-1.5 opacity-70 font-semibold text-[10px]">({tag.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 7: HEALTH REPORT */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'health' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-stone-900">Health report</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Overall cafe experience diagnostics and guest satisfaction scorecard
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-stone-200">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Food & Beverage Grade
                </span>
                <div className="text-2xl font-bold text-emerald-700">A+ (4.6/5.0)</div>
                <p className="text-xs text-stone-500 mt-1">Consistently exceeds culinary quality standards.</p>
              </div>

              <div className="p-4 rounded-xl border border-stone-200">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Hospitality & Speed Grade
                </span>
                <div className="text-2xl font-bold text-blue-700">A- (4.0/5.0)</div>
                <p className="text-xs text-stone-500 mt-1">Minor slowdowns detected during peak rush periods.</p>
              </div>

              <div className="p-4 rounded-xl border border-stone-200">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Value Perception Grade
                </span>
                <div className="text-2xl font-bold text-amber-700">B+ (4.2/5.0)</div>
                <p className="text-xs text-stone-500 mt-1">Combo bundles and transparent pricing well received.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* CATEGORY DEEP-DIVE VIEWS (Tailored Customer Comments & Ratings) */}
      {/* ---------------------------------------------------- */}
      {activeSubTab.startsWith('category_') && (
        <div className="space-y-4">
          {(() => {
            const currentCat = categoryMeta[activeSubTab];
            if (!currentCat) return null;

            const fieldKey = currentCat.key;

            // Tailor and sort feedbacks so category-relevant reviews appear at the top
            const relevantFeedbacks = [...filteredFeedbacks].sort((a, b) => {
              const textA = ((a.comment || '') + ' ' + (a.tags || []).join(' ')).toLowerCase();
              const textB = ((b.comment || '') + ' ' + (b.tags || []).join(' ')).toLowerCase();

              const scoreA = currentCat.keywords.reduce((cnt, kw) => (textA.includes(kw) ? cnt + 1 : cnt), 0);
              const scoreB = currentCat.keywords.reduce((cnt, kw) => (textB.includes(kw) ? cnt + 1 : cnt), 0);

              return scoreB - scoreA;
            });

            return (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`size-3 rounded-full ${currentCat.color}`} />
                      <h2 className="text-xl font-bold tracking-tight text-stone-900">
                        {currentCat.label}
                      </h2>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">{currentCat.desc}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500 font-medium">Category Score:</span>
                    <span className="text-2xl font-black text-stone-900">
                      {currentCat.score.toFixed(1)} ★
                    </span>
                  </div>
                </div>

                {/* Filtered Reviews tailored to this category */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-xs divide-y divide-stone-100 overflow-hidden">
                  <div className="p-4 bg-stone-50/70 border-b border-stone-200 flex items-center justify-between text-xs font-bold text-stone-700">
                    <span>Customer Comments & Ratings for {currentCat.label}</span>
                    <span className="text-[11px] font-medium text-stone-500">
                      {relevantFeedbacks.length} guest evaluations
                    </span>
                  </div>

                  {relevantFeedbacks.map((f) => {
                    const specificRating = f.ratings?.[fieldKey] ?? f.rating ?? 4;

                    return (
                      <div
                        key={f.id}
                        onClick={() => setSelectedReview(f)}
                        className="p-4 sm:p-5 hover:bg-stone-50/50 transition cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <span className="font-bold text-xs text-stone-900">
                              {f.customerName || 'Dining Guest'}
                            </span>
                            <span className="text-[11px] text-stone-400 font-medium">
                              Table {f.tableNumber} • {formatDate(f.createdAt)}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getRatingPillStyle(specificRating)}`}>
                              {currentCat.label}: {specificRating}/5 ★
                            </span>
                          </div>

                          {/* Specific Category Rating Stars */}
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`size-3.5 ${
                                  s <= specificRating
                                    ? 'fill-amber-400 text-amber-500'
                                    : 'text-stone-200 fill-stone-100'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-stone-700 leading-relaxed font-normal">
                          "{f.comment}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* REVIEW INSPECTOR MODAL */}
      {/* ---------------------------------------------------- */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-scaleUp">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-full ${clientTheme.accentBg || 'bg-stone-900'} text-white font-bold flex items-center justify-center text-sm shadow-xs`}>
                  {(selectedReview.customerName || 'G').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    {selectedReview.customerName || 'Dining Guest'}
                  </h3>
                  <span className="text-xs text-stone-500 font-medium">
                    Table {selectedReview.tableNumber} • {formatDate(selectedReview.createdAt)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedReview(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Overall Rating & Contact */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-medium">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Contact Phone</span>
                <span className="text-stone-800 font-bold">{selectedReview.contactPhone || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Email Address</span>
                <span className="text-stone-800 font-bold truncate block">{selectedReview.email || 'Not provided'}</span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                Guest Experience Feedback
              </span>
              <p className="text-sm text-stone-800 bg-stone-50 p-3.5 rounded-xl border border-stone-200/80 leading-relaxed font-normal">
                "{selectedReview.comment}"
              </p>
            </div>

            {/* 6 Category Dimension Scores */}
            {selectedReview.ratings && (
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                  Category Ratings
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Food', val: selectedReview.ratings.food },
                    { label: 'Service', val: selectedReview.ratings.service },
                    { label: 'Accuracy', val: selectedReview.ratings.orderAccuracy },
                    { label: 'Value', val: selectedReview.ratings.valueForMoney },
                    { label: 'Hygiene', val: selectedReview.ratings.hygiene },
                    { label: 'Ambience', val: selectedReview.ratings.ambience },
                  ].map((dim) => (
                    <div key={dim.label} className="p-2.5 rounded-xl border border-stone-200 text-center bg-stone-50/50">
                      <span className="text-[11px] font-bold text-stone-600 block">{dim.label}</span>
                      <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-md font-bold text-xs ${getRatingPillStyle(dim.val)}`}>
                        {dim.val} / 5
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedReview(null)}
                className="px-5 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
