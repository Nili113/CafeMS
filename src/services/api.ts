import mockDb from '../data/mockData.json';
import {
  CafeClientRecord,
  ApiCredential,
  Table,
  MenuItem,
  MenuCategoryRecord,
  Order,
  OrderItem,
  TableAlert,
  CustomerFeedback,
  TableStatus,
  OrderStatus,
  SystemActivity,
} from '../types';

// Storage keys for local persistence so user additions/modifications work dynamically
const STORAGE_PREFIX = 'cafems_api_';

function getLocalOrInit<T>(key: string, initialValue: T): T {
  try {
    const saved = localStorage.getItem(STORAGE_PREFIX + key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(`Failed to load ${key} from storage`, e);
  }
  return initialValue;
}

function saveLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to storage`, e);
  }
}

const DEFAULT_CATEGORIES: MenuCategoryRecord[] = [
  { id: 'cat-1', name: 'Chiya & Teas', displayName: 'Chiya & Heritage Teas', position: 1, isVisible: true },
  { id: 'cat-2', name: 'Specialty Coffee', displayName: 'Specialty Espresso & Coffee', position: 2, isVisible: true },
  { id: 'cat-3', name: 'Bakery & Bites', displayName: 'Artisanal Bakery & Bites', position: 3, isVisible: true },
  { id: 'cat-4', name: 'Mains & Bowls', displayName: 'Heritage Mains & Bowls', position: 4, isVisible: true },
  { id: 'cat-5', name: 'Cold Drinks', displayName: 'Chilled Refreshers & Lassi', position: 5, isVisible: true },
  { id: 'cat-6', name: 'Desserts', displayName: 'Sweet Treats & Desserts', position: 6, isVisible: true },
];

// In-Memory & LocalStorage Cached Database initialized from mockData.json
let dbCategories: MenuCategoryRecord[] = getLocalOrInit('menuCategories', DEFAULT_CATEGORIES);
let dbClients: CafeClientRecord[] = getLocalOrInit('clients', (mockDb.clients as CafeClientRecord[]).map(c => ({
  ...c,
  subscriptionPlan: c.subscriptionPlan || 'Enterprise Annual',
  subscriptionRenewalDate: c.subscriptionRenewalDate || '2026-11-14T09:30:00Z',
  menuSource: c.menuSource || 'manual',
})));

let dbApiKeys: ApiCredential[] = getLocalOrInit('apiCredentials', (mockDb.apiCredentials as ApiCredential[]).map(k => ({
  ...k,
  status: (k.status as any) || 'Active',
})));

let dbTables: Table[] = getLocalOrInit('tables', mockDb.tables as Table[]);
let dbMenu: MenuItem[] = getLocalOrInit('menuItems', (mockDb.menuItems as MenuItem[]).map(m => ({
  ...m,
  unit: m.unit || (m.category === 'Chiya & Teas' || m.category === 'Specialty Coffee' ? 'Cup' : m.name.toLowerCase().includes('croissant') || m.name.toLowerCase().includes('momo') ? 'Plate' : 'Portion'),
  displayName: m.displayName || m.name,
  shortName: m.shortName || m.name.slice(0, 8),
})));

// Ensure default items have units and display names
saveLocal('menuItems', dbMenu);
saveLocal('menuCategories', dbCategories);

let dbOrders: Order[] = getLocalOrInit('orders', mockDb.orders as Order[]);
let dbAlerts: TableAlert[] = getLocalOrInit('tableAlerts', mockDb.tableAlerts as TableAlert[]);

const DEFAULT_FEEDBACKS: CustomerFeedback[] = [
  {
    id: 'fb-1',
    tableNumber: 4,
    orderId: 'ord-1040',
    customerName: 'Aarav Hamal',
    contactPhone: '9841234567',
    email: 'aarav.h@gmail.com',
    ageGroup: '25-34',
    visitDate: '2026-03-12',
    rating: 5,
    ratings: { food: 5, service: 5, orderAccuracy: 5, valueForMoney: 4, hygiene: 5, ambience: 5, overall: 5 },
    comment: 'The Masala Chiya in clay matka had divine aroma. Cardamom notes were perfectly balanced. Ambience is calm and serene.',
    tags: ['Chiya Taste', 'Ambience', 'Hospitality'],
    createdAt: '15 mins ago'
  },
  {
    id: 'fb-2',
    tableNumber: 6,
    orderId: 'ord-1038',
    customerName: 'Suman Shrestha',
    contactPhone: '9801987654',
    email: 'suman.shrestha@hotmail.com',
    ageGroup: '35-44',
    visitDate: '2026-03-12',
    rating: 4,
    ratings: { food: 4, service: 3, orderAccuracy: 5, valueForMoney: 4, hygiene: 4, ambience: 5, overall: 4 },
    comment: 'Great pour-over coffee! However service speed was slightly slow during rush hour peak.',
    tags: ['Food Quality', 'Service Speed'],
    createdAt: '1 hour ago'
  },
  {
    id: 'fb-3',
    tableNumber: 1,
    orderId: 'ord-1035',
    customerName: 'Priya Sharma',
    contactPhone: '9812345678',
    email: 'priya.s@yahoo.com',
    ageGroup: '18-24',
    visitDate: '2026-03-11',
    rating: 2,
    ratings: { food: 2, service: 2, orderAccuracy: 3, valueForMoney: 2, hygiene: 4, ambience: 4, overall: 2 },
    comment: 'Food was served cold and tasted bad today compared to last week. Needs immediate improvement in kitchen pacing.',
    tags: ['Food Quality', 'Service Speed'],
    createdAt: 'Yesterday'
  }
];

let dbFeedbacks: CustomerFeedback[] = getLocalOrInit('feedbacks', DEFAULT_FEEDBACKS);
let dbActivities: SystemActivity[] = getLocalOrInit(
  'activities',
  ((mockDb as any).systemActivities || []) as SystemActivity[]
);

/**
 * CafeMS Backend Mock API Service Layer
 * When connecting to real backend, replace these implementations with axios/fetch calls to `API_BASE_URL`.
 */
export const api = {
  // --- SUPER ADMIN CLIENTS ---
  async getClients(): Promise<CafeClientRecord[]> {
    return [...dbClients];
  },

  async toggleClientStatus(clientId: string): Promise<CafeClientRecord> {
    dbClients = dbClients.map((c) =>
      c.id === clientId ? { ...c, status: c.status === 'Active' ? 'Deactive' : 'Active' } : c
    );
    saveLocal('clients', dbClients);
    const updated = dbClients.find((c) => c.id === clientId)!;
    return updated;
  },

  async dispatchEnrollmentLink(
    cafeName: string,
    email: string,
    personInCharge: string
  ): Promise<{ link: string; client: CafeClientRecord }> {
    const token = 'tok_onb_' + Math.random().toString(36).substring(2, 10);
    const link = `https://cafems.io/enroll?venue=${encodeURIComponent(cafeName)}&token=${token}`;

    const newClient: CafeClientRecord = {
      id: 'client-' + (dbClients.length + 1),
      name: cafeName,
      brandTagline: 'Newly Enrolled Specialty Cafe',
      contactEmail: email,
      contactPhone: '+977 980' + Math.floor(1000000 + Math.random() * 9000000),
      personInCharge,
      address: 'Kathmandu Valley, Nepal',
      status: 'Active',
      tableCount: 10,
      apiKeyId: 'key-' + token,
      enrolledAt: new Date().toISOString(),
      monthlyRevenueEstimate: 280000,
    };

    dbClients = [newClient, ...dbClients];
    saveLocal('clients', dbClients);
    return { link, client: newClient };
  },

  // --- API CREDENTIALS ---
  async getApiCredentials(): Promise<ApiCredential[]> {
    return [...dbApiKeys];
  },

  async revokeApiKey(keyId: string): Promise<void> {
    dbApiKeys = dbApiKeys.map((k) => (k.id === keyId ? { ...k, status: 'Revoked' } : k));
    saveLocal('apiCredentials', dbApiKeys);
  },

  async updateApiKeyStatus(keyId: string, status: 'Active' | 'Suspended' | 'Revoked'): Promise<ApiCredential> {
    dbApiKeys = dbApiKeys.map((k) => (k.id === keyId ? { ...k, status } : k));
    saveLocal('apiCredentials', dbApiKeys);
    return dbApiKeys.find((k) => k.id === keyId)!;
  },

  async issueApiKey(clientId: string, clientName: string): Promise<ApiCredential> {
    const newKey: ApiCredential = {
      id: 'key-' + Date.now(),
      clientId,
      clientName,
      apiKey: 'cms_live_' + Math.random().toString(36).substring(2, 14),
      clientSecret: 'cms_sec_' + Math.random().toString(36).substring(2, 22),
      status: 'Active',
      rateLimitPerMin: 180,
      requestsToday: 0,
      lastUsedAt: 'Never',
    };
    dbApiKeys = [newKey, ...dbApiKeys];
    saveLocal('apiCredentials', dbApiKeys);
    return newKey;
  },

  async updateClientSubscription(clientId: string, renewalDate: string, plan: string): Promise<CafeClientRecord> {
    dbClients = dbClients.map((c) => (c.id === clientId ? { ...c, subscriptionRenewalDate: renewalDate, subscriptionPlan: plan } : c));
    saveLocal('clients', dbClients);
    return dbClients.find((c) => c.id === clientId)!;
  },

  async updateClientMenuSource(clientId: string, menuSource: 'manual' | 'api'): Promise<CafeClientRecord> {
    dbClients = dbClients.map((c) => (c.id === clientId ? { ...c, menuSource } : c));
    saveLocal('clients', dbClients);
    return dbClients.find((c) => c.id === clientId)!;
  },

  // --- MENU CATEGORIES (Cafe OS Structured Hierarchy) ---
  async getMenuCategories(): Promise<MenuCategoryRecord[]> {
    return [...dbCategories].sort((a, b) => a.position - b.position);
  },

  async addMenuCategory(categoryData: Omit<MenuCategoryRecord, 'id'>): Promise<MenuCategoryRecord> {
    const newCategory: MenuCategoryRecord = {
      ...categoryData,
      id: 'cat-' + Date.now(),
    };
    dbCategories = [...dbCategories, newCategory];
    saveLocal('menuCategories', dbCategories);
    return newCategory;
  },

  async updateMenuCategory(category: MenuCategoryRecord): Promise<MenuCategoryRecord> {
    dbCategories = dbCategories.map((c) => (c.id === category.id ? category : c));
    saveLocal('menuCategories', dbCategories);
    return category;
  },

  async deleteMenuCategory(categoryId: string): Promise<void> {
    dbCategories = dbCategories.filter((c) => c.id !== categoryId);
    saveLocal('menuCategories', dbCategories);
  },

  // --- TABLES ---
  async getTables(): Promise<Table[]> {
    return [...dbTables];
  },

  async updateTableStatus(tableNumber: number, status: TableStatus): Promise<Table> {
    dbTables = dbTables.map((t) => (t.number === tableNumber ? { ...t, status } : t));
    saveLocal('tables', dbTables);
    return dbTables.find((t) => t.number === tableNumber)!;
  },

  // --- MENU ---
  async getMenuItems(): Promise<MenuItem[]> {
    return [...dbMenu];
  },

  async toggleMenuItemAvailability(itemId: string): Promise<MenuItem> {
    dbMenu = dbMenu.map((m) => (m.id === itemId ? { ...m, isAvailable: !m.isAvailable } : m));
    saveLocal('menuItems', dbMenu);
    return dbMenu.find((m) => m.id === itemId)!;
  },

  async addMenuItem(itemData: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    const newItem: MenuItem = {
      ...itemData,
      id: 'm-' + Date.now(),
    };
    dbMenu = [newItem, ...dbMenu];
    saveLocal('menuItems', dbMenu);
    return newItem;
  },

  async updateMenuItem(item: MenuItem): Promise<MenuItem> {
    dbMenu = dbMenu.map((m) => (m.id === item.id ? item : m));
    saveLocal('menuItems', dbMenu);
    return item;
  },

  async deleteMenuItem(itemId: string): Promise<void> {
    dbMenu = dbMenu.filter((m) => m.id !== itemId);
    saveLocal('menuItems', dbMenu);
  },

  // --- ORDERS ---
  async getOrders(): Promise<Order[]> {
    return [...dbOrders];
  },

  async placeOrder(tableNumber: number, items: OrderItem[]): Promise<Order> {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const taxService = Math.round(subtotal * 0.1);
    const total = subtotal + taxService;

    const newOrder: Order = {
      id: 'ord-' + Math.floor(1000 + Math.random() * 9000),
      tableNumber,
      items,
      subtotal,
      taxService,
      total,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      createdAt: 'Just now',
    };

    dbOrders = [newOrder, ...dbOrders];
    saveLocal('orders', dbOrders);

    // Set Table to Occupied
    dbTables = dbTables.map((t) =>
      t.number === tableNumber
        ? {
            ...t,
            status: 'Occupied',
            currentOrderId: newOrder.id,
            currentTotal: (t.currentTotal || 0) + total,
            activeGuests: t.activeGuests || 2,
          }
        : t
    );
    saveLocal('tables', dbTables);

    return newOrder;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    dbOrders = dbOrders.map((o) => (o.id === orderId ? { ...o, status } : o));
    saveLocal('orders', dbOrders);
    return dbOrders.find((o) => o.id === orderId)!;
  },

  async settleOrderFonepay(orderId: string, tableNumber: number): Promise<void> {
    dbOrders = dbOrders.map((o) =>
      o.id === orderId
        ? { ...o, paymentStatus: 'Paid', paymentMethod: 'Fonepay', status: 'Completed' }
        : o
    );
    saveLocal('orders', dbOrders);

    // Free up table
    dbTables = dbTables.map((t) =>
      t.number === tableNumber
        ? { ...t, status: 'Available', currentOrderId: undefined, currentTotal: 0 }
        : t
    );
    saveLocal('tables', dbTables);

    // Clear bill requests for this table
    dbAlerts = dbAlerts.filter(
      (a) => !(a.tableNumber === tableNumber && a.type === 'Bill Request')
    );
    saveLocal('tableAlerts', dbAlerts);
  },

  // --- TABLE ALERTS (WAITER / BILL) ---
  async getTableAlerts(): Promise<TableAlert[]> {
    return [...dbAlerts];
  },

  async callWaiter(tableNumber: number, note?: string): Promise<TableAlert> {
    const newAlert: TableAlert = {
      id: 'alert-' + Date.now(),
      tableNumber,
      type: note ? `Order Request: ${note}` : 'Call Waiter',
      note,
      status: 'Active',
      timestamp: 'Just now',
    };
    dbAlerts = [newAlert, ...dbAlerts];
    saveLocal('tableAlerts', dbAlerts);
    return newAlert;
  },

  async requestBill(tableNumber: number, amount: number): Promise<TableAlert> {
    const newAlert: TableAlert = {
      id: 'alert-' + Date.now(),
      tableNumber,
      type: 'Bill Request',
      status: 'Active',
      timestamp: 'Just now',
      amount,
    };
    dbAlerts = [newAlert, ...dbAlerts];
    saveLocal('tableAlerts', dbAlerts);
    return newAlert;
  },

  async acknowledgeAlert(alertId: string): Promise<void> {
    dbAlerts = dbAlerts.map((a) => (a.id === alertId ? { ...a, status: 'Acknowledged' } : a));
    saveLocal('tableAlerts', dbAlerts);
  },

  async resolveAlert(alertId: string): Promise<void> {
    dbAlerts = dbAlerts.filter((a) => a.id !== alertId);
    saveLocal('tableAlerts', dbAlerts);
  },

  // --- CUSTOMER FEEDBACK ---
  async getFeedbacks(): Promise<CustomerFeedback[]> {
    return [...dbFeedbacks];
  },

  async submitFeedback(data: Omit<CustomerFeedback, 'id' | 'createdAt'>): Promise<CustomerFeedback> {
    const newFeedback: CustomerFeedback = {
      ...data,
      id: 'fb-' + Date.now(),
      createdAt: 'Just now',
    };
    dbFeedbacks = [newFeedback, ...dbFeedbacks];
    saveLocal('feedbacks', dbFeedbacks);
    return newFeedback;
  },

  // --- SYSTEM ACTIVITIES & AUDIT LOGS ---
  async getSystemActivities(): Promise<SystemActivity[]> {
    return [...dbActivities];
  },

  async logActivity(data: Omit<SystemActivity, 'id' | 'timestamp'>): Promise<SystemActivity> {
    const newAct: SystemActivity = {
      ...data,
      id: 'act-' + Date.now(),
      timestamp: 'Just now',
    };
    dbActivities = [newAct, ...dbActivities];
    saveLocal('activities', dbActivities);
    return newAct;
  },
};
