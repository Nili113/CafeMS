export type UserRole = 'super_admin' | 'cafe_client' | 'customer';

export type CafeTheme = 'amber' | 'emerald' | 'noir' | 'terracotta';

export type TableStatus = 'Available' | 'Occupied' | 'Reserved';

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Served' | 'Completed';

export type MenuCategory = 'Chiya & Teas' | 'Specialty Coffee' | 'Bakery & Bites' | 'Mains & Bowls' | 'Desserts';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // In NPR (Rs.)
  category: MenuCategory;
  image: string; // URL or Data URL from file upload
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

export interface CustomerFeedback {
  id: string;
  tableNumber: number;
  orderId?: string;
  customerName?: string;
  rating: number; // 1 to 5
  comment: string;
  tags: ('Chiya Taste' | 'Food Quality' | 'Ambience' | 'Service Speed' | 'Hospitality' | 'Value')[];
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
  status: 'Active' | 'Revoked';
  rateLimitPerMin: number;
  requestsToday: number;
  lastUsedAt: string;
}

export interface SystemActivity {
  id: string;
  type: 'enrollment' | 'api' | 'status_change' | 'table_sync' | 'security' | 'client_registered' | 'api_key' | 'client_deactivated' | 'payment_settled';
  title: string;
  detail: string;
  actor: string;
  timestamp: string;
  severity: 'info' | 'success' | 'warning';
}
