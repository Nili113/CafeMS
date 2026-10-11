import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserRole,
  CafeTheme,
  TableStatus,
  OrderStatus,
  MenuItem,
  Table,
  Order,
  OrderItem,
  TableAlert,
  CustomerFeedback,
  CafeClientRecord,
  ApiCredential,
  SystemActivity,
} from '../types';
import { api } from '../services/api';
import { DEFAULT_CAFE_LOGOS } from '../lib/logos';

export interface CurrentUser {
  email: string;
  name: string;
  role: 'super_admin' | 'cafe_client';
  venueName?: string;
}

interface CafeDataContextType {
  // Navigation & Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTableNumber: number;
  setActiveTableNumber: (num: number) => void;

  // Authentication
  currentUser: CurrentUser | null;
  login: (email: string, password?: string, portalPreference?: 'super_admin' | 'cafe_client') => { success: boolean; role: 'super_admin' | 'cafe_client' };
  logout: () => void;

  // Theming
  cafeTheme: CafeTheme;
  setCafeTheme: (theme: CafeTheme) => void;

  // Cafe Logo & Branding System
  cafeLogos: Record<string, string>;
  updateCafeLogo: (cafeId: string, logoUrl: string) => void;
  resetCafeLogo: (cafeId: string) => void;
  getCafeLogo: (cafeId?: string) => string;

  // Super Admin Data & Actions
  clients: CafeClientRecord[];
  toggleClientStatus: (clientId: string) => Promise<void>;
  dispatchEnrollmentLink: (cafeName: string, recipientEmail: string, personInCharge: string) => Promise<string>;
  apiCredentials: ApiCredential[];
  generateApiKey: (clientId: string) => Promise<void>;
  revokeApiKey: (keyId: string) => Promise<void>;
  systemActivities: SystemActivity[];

  // Cafe Client & Operations
  tables: Table[];
  updateTableStatus: (tableNumber: number, status: TableStatus) => Promise<void>;
  menuItems: MenuItem[];
  toggleMenuItemAvailability: (itemId: string) => Promise<void>;
  updateMenuItem: (item: MenuItem) => Promise<void>;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  deleteMenuItem: (itemId: string) => Promise<void>;

  // Live Orders
  orders: Order[];
  placeOrder: (tableNumber: number, items: OrderItem[]) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  settleOrderWithFonepay: (orderId: string, tableNumber: number) => Promise<void>;

  // Table Alerts (Waiter call & Bill request)
  tableAlerts: TableAlert[];
  callWaiter: (tableNumber: number, note?: string) => Promise<void>;
  requestBill: (tableNumber: number, amount: number) => Promise<void>;
  acknowledgeAlert: (alertId: string) => Promise<void>;
  resolveAlert: (alertId: string) => Promise<void>;

  // Customer Feedback
  feedbacks: CustomerFeedback[];
  submitFeedback: (feedback: Omit<CustomerFeedback, 'id' | 'createdAt'>) => Promise<void>;

  // Venue Network & In-Store Geofence Security
  isNetworkVerificationEnabled: boolean;
  toggleNetworkVerification: (enabled: boolean) => void;
  cafeWifiSsid: string;
  isGuestInsideVenue: boolean;
  setIsGuestInsideVenue: (status: boolean) => void;
  lanHost: string;
  setLanHost: (host: string) => void;

  // Loading & Toast Notification
  isLoading: boolean;
  refreshData: () => Promise<void>;
  toastMessage: { text: string; type?: 'success' | 'info' | 'warning' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
}

const CafeDataContext = createContext<CafeDataContextType | undefined>(undefined);

export const CafeDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('cafe_client');

  const getInitialUser = (): CurrentUser | null => {
    try {
      const isExplicitlyLoggedOut = localStorage.getItem('cafems_logged_out') === 'true';
      if (isExplicitlyLoggedOut) return null;

      const raw = localStorage.getItem('cafems_auth_user');
      if (raw) return JSON.parse(raw);
    } catch (e) {}

    return null;
  };

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(getInitialUser);

  const login = (
    email: string,
    _password?: string,
    portalPreference?: 'super_admin' | 'cafe_client'
  ): { success: boolean; role: 'super_admin' | 'cafe_client' } => {
    const clean = email.trim().toLowerCase();
    let role: 'super_admin' | 'cafe_client' =
      portalPreference ||
      (clean.includes('admin') || clean === 'admin' ? 'super_admin' : 'cafe_client');
    let name = role === 'super_admin' ? 'Super Admin' : 'Alex Morgan';
    let venueName: string | undefined = role === 'super_admin' ? undefined : 'Cafe XYZ Flagship';

    const user: CurrentUser = {
      email: clean.includes('@')
        ? clean
        : role === 'super_admin'
        ? 'admin@cafems.io'
        : `${clean}@cafexyz.com`,
      name,
      role,
      venueName,
    };

    setCurrentUser(user);
    localStorage.removeItem('cafems_logged_out');
    localStorage.setItem('cafems_auth_user', JSON.stringify(user));
    return { success: true, role };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.setItem('cafems_logged_out', 'true');
    localStorage.removeItem('cafems_auth_user');
  };

  const getStoredTheme = (): CafeTheme => {
    try {
      const stored = localStorage.getItem('cafems_active_theme');
      if (stored && ['terracotta', 'emerald', 'amber', 'noir'].includes(stored)) {
        return stored as CafeTheme;
      }
    } catch (e) {
      // ignore
    }
    return 'terracotta';
  };

  const [cafeTheme, setCafeThemeState] = useState<CafeTheme>(getStoredTheme);
  const [activeTableNumber, setActiveTableNumber] = useState<number>(4);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Dynamic Cafe Logos System
  const getStoredLogos = (): Record<string, string> => {
    try {
      const stored = localStorage.getItem('cafems_cafe_logos');
      if (stored) {
        return { ...DEFAULT_CAFE_LOGOS, ...JSON.parse(stored) };
      }
    } catch (e) {}
    return DEFAULT_CAFE_LOGOS;
  };

  const [cafeLogos, setCafeLogos] = useState<Record<string, string>>(getStoredLogos);

  const updateCafeLogo = (cafeId: string, logoUrl: string) => {
    setCafeLogos((prev) => {
      const updated = { ...prev, [cafeId]: logoUrl };
      try {
        localStorage.setItem('cafems_cafe_logos', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('cafems_logo_sync', { detail: { cafeId, logoUrl } }));
      } catch (e) {}
      return updated;
    });
    showToast('Cafe brand logo updated successfully!', 'success');
  };

  const resetCafeLogo = (cafeId: string) => {
    setCafeLogos((prev) => {
      const updated = { ...prev, [cafeId]: DEFAULT_CAFE_LOGOS[cafeId] || DEFAULT_CAFE_LOGOS.default };
      try {
        localStorage.setItem('cafems_cafe_logos', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('cafems_logo_sync', { detail: { cafeId, logoUrl: updated[cafeId] } }));
      } catch (e) {}
      return updated;
    });
    showToast('Cafe logo reset to artisanal default', 'info');
  };

  const getCafeLogo = (cafeId?: string): string => {
    if (cafeId && cafeLogos[cafeId]) return cafeLogos[cafeId];
    return cafeLogos['c-1'] || DEFAULT_CAFE_LOGOS['c-1'] || DEFAULT_CAFE_LOGOS.default;
  };

  // State populated from API Layer
  const [clients, setClients] = useState<CafeClientRecord[]>([]);
  const [apiCredentials, setApiCredentials] = useState<ApiCredential[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tableAlerts, setTableAlerts] = useState<TableAlert[]>([]);
  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>([]);
  const [systemActivities, setSystemActivities] = useState<SystemActivity[]>([]);
  const [toastMessage, setToastMessage] = useState<{ text: string; type?: 'success' | 'info' | 'warning' } | null>(null);

  // Load from API Service
  const refreshData = useCallback(async () => {
    try {
      const [c, a, t, m, o, al, fb, acts] = await Promise.all([
        api.getClients(),
        api.getApiCredentials(),
        api.getTables(),
        api.getMenuItems(),
        api.getOrders(),
        api.getTableAlerts(),
        api.getFeedbacks(),
        api.getSystemActivities(),
      ]);
      setClients(c);
      setApiCredentials(a);
      setTables(t);
      setMenuItems(m);
      setOrders(o);
      setTableAlerts(al);
      setFeedbacks(fb);
      setSystemActivities(acts);
    } catch (err) {
      console.error('Failed to load data from api service', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Sync theme changes across browser windows / tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'cafems_active_theme' && e.newValue) {
        if (['terracotta', 'emerald', 'amber', 'noir'].includes(e.newValue)) {
          setCafeThemeState(e.newValue as CafeTheme);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setCafeTheme = (theme: CafeTheme) => {
    setCafeThemeState(theme);
    try {
      localStorage.setItem('cafems_active_theme', theme);
      window.dispatchEvent(new CustomEvent('cafems_theme_sync', { detail: theme }));
    } catch (e) {
      // ignore
    }
    document.documentElement.setAttribute('data-cafe-theme', theme);
  };

  // Super Admin: Strictly Active or Deactive via API
  const toggleClientStatus = async (clientId: string) => {
    const updated = await api.toggleClientStatus(clientId);
    setClients((prev) => prev.map((c) => (c.id === clientId ? updated : c)));
    showToast(`Venue status updated to ${updated.status}`, 'success');
  };

  const dispatchEnrollmentLink = async (cafeName: string, recipientEmail: string, personInCharge: string): Promise<string> => {
    const res = await api.dispatchEnrollmentLink(cafeName, recipientEmail, personInCharge);
    setClients((prev) => [res.client, ...prev]);
    showToast(`Enrollment link dispatched to ${recipientEmail}`, 'success');
    return res.link;
  };

  const generateApiKey = async (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;
    const newKey = await api.issueApiKey(clientId, client.name);
    setApiCredentials((prev) => [newKey, ...prev]);
    showToast(`Issued new API key for ${client.name}`, 'success');
  };

  const revokeApiKey = async (keyId: string) => {
    await api.revokeApiKey(keyId);
    setApiCredentials((prev) => prev.map((k) => (k.id === keyId ? { ...k, status: 'Revoked' } : k)));
    showToast('API Key revoked', 'warning');
  };

  // Tables
  const updateTableStatus = async (tableNumber: number, status: TableStatus) => {
    const updated = await api.updateTableStatus(tableNumber, status);
    setTables((prev) => prev.map((t) => (t.number === tableNumber ? updated : t)));
    showToast(`Table ${tableNumber} marked as ${status}`, 'info');
  };

  // Menu Availability Real-Time Toggle
  const toggleMenuItemAvailability = async (itemId: string) => {
    const updated = await api.toggleMenuItemAvailability(itemId);
    setMenuItems((prev) => prev.map((m) => (m.id === itemId ? updated : m)));
    showToast(
      `${updated.name} is now ${updated.isAvailable ? 'Available' : 'Unavailable (86’d)'}`,
      updated.isAvailable ? 'success' : 'warning'
    );
  };

  const updateMenuItem = async (item: MenuItem) => {
    const updated = await api.updateMenuItem(item);
    setMenuItems((prev) => prev.map((m) => (m.id === item.id ? updated : m)));
    showToast(`${updated.name} updated`, 'success');
  };

  const addMenuItem = async (itemData: Omit<MenuItem, 'id'>) => {
    const newItem = await api.addMenuItem(itemData);
    setMenuItems((prev) => [newItem, ...prev]);
    showToast(`Added ${newItem.name} to menu`, 'success');
  };

  const deleteMenuItem = async (itemId: string) => {
    await api.deleteMenuItem(itemId);
    setMenuItems((prev) => prev.filter((m) => m.id !== itemId));
    showToast('Item removed from menu', 'info');
  };

  // Orders
  const placeOrder = async (tableNumber: number, items: OrderItem[]): Promise<Order> => {
    const newOrder = await api.placeOrder(tableNumber, items);
    setOrders((prev) => [newOrder, ...prev]);
    // Refresh tables to reflect occupancy
    const updatedTables = await api.getTables();
    setTables(updatedTables);
    showToast(`Order #${newOrder.id.replace('ord-', '')} dispatched to kitchen!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const updated = await api.updateOrderStatus(orderId, status);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    showToast(`Order #${orderId.replace('ord-', '')} marked ${status}`, 'info');
  };

  const settleOrderWithFonepay = async (orderId: string, tableNumber: number) => {
    await api.settleOrderFonepay(orderId, tableNumber);
    const [updatedOrders, updatedTables, updatedAlerts] = await Promise.all([
      api.getOrders(),
      api.getTables(),
      api.getTableAlerts(),
    ]);
    setOrders(updatedOrders);
    setTables(updatedTables);
    setTableAlerts(updatedAlerts);
    showToast(`Table ${tableNumber} settled via Fonepay QR!`, 'success');
  };

  // Table Alerts (Waiter call & Bill request)
  const callWaiter = async (tableNumber: number, note?: string) => {
    const alert = await api.callWaiter(tableNumber, note);
    setTableAlerts((prev) => [alert, ...prev]);
    showToast(`Staff alerted! Waiter is on the way to Table ${tableNumber}`, 'success');
  };

  const requestBill = async (tableNumber: number, amount: number) => {
    const alert = await api.requestBill(tableNumber, amount);
    setTableAlerts((prev) => [alert, ...prev]);
    showToast(`Bill request sent for Table ${tableNumber}`, 'success');
  };

  const acknowledgeAlert = async (alertId: string) => {
    await api.acknowledgeAlert(alertId);
    setTableAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'Acknowledged' } : a))
    );
    showToast('Alert marked as acknowledged', 'info');
  };

  const resolveAlert = async (alertId: string) => {
    await api.resolveAlert(alertId);
    setTableAlerts((prev) => prev.filter((a) => a.id !== alertId));
    showToast('Alert resolved', 'info');
  };

  // Feedback
  const submitFeedback = async (data: Omit<CustomerFeedback, 'id' | 'createdAt'>) => {
    const newFb = await api.submitFeedback(data);
    setFeedbacks((prev) => [newFb, ...prev]);
    showToast('Thank you! Feedback sent to the manager.', 'success');
  };

  // Venue Network & In-Store Geofence Security
  const [isNetworkVerificationEnabled, setIsNetworkVerificationEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('cafems_network_verify_enabled');
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  });

  const [cafeWifiSsid] = useState<string>('CafeXYZ-Guest-5G');

  // Interactive toggle to simulate guest being in cafe Wi-Fi vs at home
  const [isGuestInsideVenue, setIsGuestInsideVenueState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('cafems_guest_inside_venue');
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  });

  const setIsGuestInsideVenue = (status: boolean) => {
    setIsGuestInsideVenueState(status);
    try {
      localStorage.setItem('cafems_guest_inside_venue', String(status));
    } catch {}
  };

  const toggleNetworkVerification = (enabled: boolean) => {
    setIsNetworkVerificationEnabled(enabled);
    try {
      localStorage.setItem('cafems_network_verify_enabled', String(enabled));
    } catch {}
    showToast(
      enabled
        ? 'Venue Network Enforcing Enabled: Guests must be on Cafe Wi-Fi'
        : 'Venue Network Enforcing Disabled: Remote ordering permitted',
      'info'
    );
  };

  // LAN Host for smartphone QR scanning (Defaults to 192.168.101.5:5173 or current non-localhost host)
  const [lanHost, setLanHostState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('cafems_lan_host');
      if (stored) return stored;
    } catch {}

    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return window.location.host;
    }
    return '192.168.101.5:5173';
  });

  const setLanHost = (host: string) => {
    const cleaned = host.replace(/^https?:\/\//, '').trim();
    setLanHostState(cleaned);
    try {
      localStorage.setItem('cafems_lan_host', cleaned);
    } catch {}
  };

  return (
    <CafeDataContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeTableNumber,
        setActiveTableNumber,
        currentUser,
        login,
        logout,
        cafeTheme,
        setCafeTheme,
        cafeLogos,
        updateCafeLogo,
        resetCafeLogo,
        getCafeLogo,
        clients,
        toggleClientStatus,
        dispatchEnrollmentLink,
        apiCredentials,
        generateApiKey,
        revokeApiKey,
        systemActivities,
        tables,
        updateTableStatus,
        menuItems,
        toggleMenuItemAvailability,
        updateMenuItem,
        addMenuItem,
        deleteMenuItem,
        orders,
        placeOrder,
        updateOrderStatus,
        settleOrderWithFonepay,
        tableAlerts,
        callWaiter,
        requestBill,
        acknowledgeAlert,
        resolveAlert,
        feedbacks,
        submitFeedback,
        isNetworkVerificationEnabled,
        toggleNetworkVerification,
        cafeWifiSsid,
        isGuestInsideVenue,
        setIsGuestInsideVenue,
        lanHost,
        setLanHost,
        isLoading,
        refreshData,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CafeDataContext.Provider>
  );
};

export const useCafeData = () => {
  const context = useContext(CafeDataContext);
  if (!context) {
    throw new Error('useCafeData must be used within a CafeDataProvider');
  }
  return context;
};
