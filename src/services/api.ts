import mockDb from '../data/mockData.json';
import {
  CafeClientRecord,
  ApiCredential,
  Table,
  MenuItem,
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

// In-Memory & LocalStorage Cached Database initialized from mockData.json
let dbClients: CafeClientRecord[] = getLocalOrInit('clients', mockDb.clients as CafeClientRecord[]);
let dbApiKeys: ApiCredential[] = getLocalOrInit('apiCredentials', mockDb.apiCredentials as ApiCredential[]);
let dbTables: Table[] = getLocalOrInit('tables', mockDb.tables as Table[]);
let dbMenu: MenuItem[] = getLocalOrInit('menuItems', mockDb.menuItems as MenuItem[]);

// Ensure default items (e.g. Chicken Steam Momo, Sweet Lassi, Masala Chiya) are populated and active
(mockDb.menuItems as MenuItem[]).forEach((defaultItem) => {
  const existingIdx = dbMenu.findIndex((it) => it.id === defaultItem.id);
  if (existingIdx === -1) {
    dbMenu.push(defaultItem);
  } else if (['m-1', 'm-9', 'm-10'].includes(defaultItem.id)) {
    dbMenu[existingIdx] = {
      ...dbMenu[existingIdx],
      name: defaultItem.name,
      image: defaultItem.image,
      price: defaultItem.price,
      isAvailable: true,
    };
  }
});
saveLocal('menuItems', dbMenu);

let dbOrders: Order[] = getLocalOrInit('orders', mockDb.orders as Order[]);
let dbAlerts: TableAlert[] = getLocalOrInit('tableAlerts', mockDb.tableAlerts as TableAlert[]);
let dbFeedbacks: CustomerFeedback[] = getLocalOrInit('feedbacks', mockDb.feedbacks as CustomerFeedback[]);
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

  // --- SYSTEM ACTIVITIES ---
  async getSystemActivities(): Promise<SystemActivity[]> {
    return [...dbActivities];
  },
};
