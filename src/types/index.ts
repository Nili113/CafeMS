export type UserRole = 'super_admin' | 'cafe_client' | 'customer';

export type CafeTheme = 'amber' | 'emerald' | 'noir' | 'terracotta' | 'espresso' | 'burgundy';

export type TableStatus = 'Available' | 'Occupied' | 'Reserved';

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Served' | 'Completed';

export type MenuCategory = string;

export interface MenuCategoryRecord {
  id: string;
  name: string;
  displayName: string;
  position: number;
  isVisible: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  displayName?: string;
  shortName?: string;
  description: string;
  price: number; // In NPR (Rs.)
  unit?: string; // e.g. "Cup", "Plate", "Bowl", "Bottle", "Ml", "Pot", "Portion"
  category: MenuCategory;
  image?: string; // Optional URL or Data URL
  isAvailable: boolean; // Real-time toggle
  tags: string[]; // e.g. ["Matka Brew", "House Favorite", "Single Origin"]
  preparationTimeMinutes: number;
}

export interface Table {
  id: string;
  number: number;
  label: string; // e.g. "Table 04 (Library Alcove)"
  capacity: number;
  status: TableStatus; // Green Available, Orange Occupied, Purple Reserved
  currentOrderId?: string;
  currentTotal?: number;
  activeGuests?: number;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  unit?: string;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  subtotal: number;
  taxService: number; // 10%
  total: number;
  status: OrderStatus;
  paymentStatus: 'Unpaid' | 'Paid';
  paymentMethod?: 'Fonepay' | 'Cash' | 'Card';
  createdAt: string;
}

export interface TableAlert {
  id: string;
  tableNumber: number;
  type: string;
  status: 'Active' | 'Acknowledged' | 'Resolved';
  timestamp: string;
  note?: string;
  amount?: number;
}

export interface FeedbackRatings {
  food: number;
  service: number;
  orderAccuracy: number;
  valueForMoney: number;
  hygiene: number;
  ambience: number;
  overall: number;
}

export interface CustomerFeedback {
  id: string;
  tableNumber: number;
  orderId?: string;
  customerName?: string;
  contactPhone?: string;
  email?: string;
  ageGroup?: string;
  visitDate?: string;
  rating: number; // 1 to 5 overall
  ratings?: FeedbackRatings;
  comment: string;
  tags: ('Chiya Taste' | 'Food Quality' | 'Ambience' | 'Service Speed' | 'Hospitality' | 'Value' | 'Hygiene' | 'Order Accuracy' | string)[];
  createdAt: string;
}

export interface CafeClientRecord {
  id: string;
  name: string;
  brandTagline: string;
  contactEmail: string;
  contactPhone: string;
  personInCharge: string;
  address: string;
  status: 'Active' | 'Deactive'; // Strictly Active or Deactive per spec
  tableCount: number;
  apiKeyId: string;
  enrolledAt: string;
  monthlyRevenueEstimate: number;
  subscriptionPlan?: string; // e.g. "Enterprise Annual", "Pro Quarterly"
  subscriptionRenewalDate?: string; // ISO string
  menuSource?: 'manual' | 'api'; // 'manual' | 'api'
  wifiSsid?: string;
  fonepayMerchantCode?: string;
  settlementBank?: string;
}

export interface ApiCredential {
  id: string;
  clientId: string;
  clientName: string;
  apiKey: string;
  clientSecret: string;
  status: 'Active' | 'Suspended' | 'Revoked';
  rateLimitPerMin: number;
  requestsToday: number;
  lastUsedAt: string;
}

export interface SystemActivity {
  id: string;
  type: 'enrollment' | 'api' | 'status_change' | 'table_sync' | 'security' | 'client_registered' | 'api_key' | 'client_deactivated' | 'payment_settled' | 'client_action' | 'menu_update';
  title: string;
  detail: string;
  actor: string;
  clientId?: string;
  clientName?: string;
  timestamp: string;
  severity: 'info' | 'success' | 'warning';
}

