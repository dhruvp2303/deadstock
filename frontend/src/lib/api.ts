const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('deadstock_auth_token') : null;
    const reqHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      reqHeaders['Authorization'] = `Bearer ${token}`;
    }

    if (options.headers) {
      Object.assign(reqHeaders, options.headers);
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: reqHeaders,
    });

    if (res.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/register') {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('deadstock_auth_token');
        localStorage.removeItem('deadstock_user');
      }
      return null;
    }

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const errMsg = json?.message || (json?.errors ? Object.values(json.errors).flat().join(', ') : `Request failed with status ${res.status}`);
      if (endpoint.startsWith('/auth/')) {
        throw new Error(errMsg);
      }
      console.warn(`API request to ${endpoint} returned status: ${res.status}`, errMsg);
      return null;
    }

    return json?.data !== undefined ? json.data : json;
  } catch (err: unknown) {
    if (endpoint.startsWith('/auth/')) {
      throw err;
    }
    console.warn(`API request failed for ${endpoint}.`, err);
    return null;
  }
}

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  description?: string;
  default_decay_rate?: number;
  is_active?: boolean;
  inventories_count?: number;
}

export interface WarehouseItem {
  id: number;
  company_id: number;
  name: string;
  city?: string;
  state?: string;
  country?: string;
  capacity_sqft?: number;
  contact_phone?: string;
  inventories_count?: number;
}

export interface InventoryItem {
  id: number;
  product: string;
  sku: string;
  qty: string;
  quantity?: number;
  value: string;
  current_value?: number;
  unit_cost?: number;
  age: string;
  age_months?: number;
  demand: string;
  monthly_demand?: number;
  risk: string;
  risk_score?: number;
  risk_level?: string;
  action: string;
  tone: 'green' | 'red' | 'amber' | 'yellow' | 'blue';
  category?: string;
  category_id?: number;
  warehouse?: string;
  warehouse_id?: number;
  material?: string;
  dimensions?: string;
  ai_explanation?: string;
  forecast?: number[];
  status?: string;
  category_details?: CategoryItem;
  warehouse_details?: WarehouseItem;
}

export interface BuyerMatchItem {
  id: number;
  name: string;
  buyer_company_id?: number;
  match: string;
  match_score?: number;
  units: string;
  required_units?: number;
  location: string;
  value: string;
  potential_deal_value?: number;
  note?: string;
  tags?: string[];
  inventory_id?: number;
  inventory_sku?: string;
  breakdown?: {
    product_compatibility: string;
    quantity_compatibility: string;
    industry: string;
    location: string;
    price: string;
    overall: string;
  };
  inventory?: any;
}

export interface MarketplaceItem {
  id: number;
  title: string;
  category?: string;
  units: string;
  units_available?: number;
  price: string;
  price_per_unit?: number;
  match: string;
  match_score?: number;
  location: string;
  action: string;
  condition?: string;
  seller_company?: string;
  company_id?: number;
  inventory_id?: number;
}

export interface NotificationItem {
  id: number;
  type: string;
  severity: 'critical' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  action_url?: string;
  action_label?: string;
  is_read: boolean;
  created_at?: string;
}

export interface OfferItem {
  id: number;
  inventory_id?: number;
  listing_id?: number;
  sender_company_id?: number;
  receiver_company_id?: number;
  seller_company_id?: number;
  buyer_company_id?: number;
  offered_quantity: number;
  offered_unit_price?: number;
  offered_price_per_unit?: number;
  total_deal_value?: number;
  total_offer_amount?: number;
  counter_price?: number;
  escrow_term?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  notes?: string;
  created_at?: string;
  seller_company_name?: string;
  buyer_company_name?: string;
  listing_title?: string;
  inventory?: {
    id: number;
    sku: string;
    product_name: string;
    category?: string;
  };
  sender_company?: {
    id: number;
    name: string;
    industry?: string;
  };
  receiver_company?: {
    id: number;
    name: string;
    industry?: string;
  };
}

export interface TransactionItem {
  id: number;
  reference_no: string;
  company_id: number;
  buyer_company_id?: number;
  inventory_id: number;
  transaction_type: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  recovery_value: number;
  status: string;
  notes?: string;
  completed_at: string;
  seller_company?: { id: number; name: string };
  buyer_company?: { id: number; name: string };
  inventory?: any;
}

export interface DashboardSummary {
  total_inventory_formatted: string;
  at_risk_formatted: string;
  dead_stock_formatted: string;
  recovered_formatted: string;
  recovery_rate: string;
  high_risk_skus_count: number;
  total_skus_count: number;
  health_bar_series: number[];
  risk_distribution: { label: string; percentage: string }[];
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  profile_image?: string | null;
  company_id?: number | null;
  last_login_at?: string | null;
  last_login_ip?: string | null;
  created_at?: string;
  company?: {
    id: number;
    name: string;
    industry?: string;
    location_city?: string;
    location_state?: string;
    country?: string;
    [key: string]: any;
  };
}

export const DeadStockAPI = {
  // Master Data
  getCategories: () => fetchApi<CategoryItem[]>('/categories'),
  getWarehouses: () => fetchApi<WarehouseItem[]>('/warehouses'),

  // Inventory
  getInventory: async () => {
    const data = await fetchApi<any[]>('/inventory');
    if (!data || !Array.isArray(data)) return null;
    return data.map((item) => ({
      ...item,
      quantity: Number(item.quantity) || 0,
      current_value: Number(item.current_value) || 0,
      unit_cost: Number(item.unit_cost) || 0,
      monthly_demand: Number(item.monthly_demand) || 0,
      age_months: Number(item.age_months) || 0,
      risk_score: Number(item.risk_score) || 0,
    })) as InventoryItem[];
  },
  getInventoryDetail: (sku: string) => fetchApi<any>(`/inventory/${sku}`),
  addInventory: (payload: {
    sku: string;
    product_name: string;
    category?: string;
    category_id?: number;
    quantity: number;
    unit_cost: number;
    monthly_demand?: number;
    age_months?: number;
    material?: string;
    dimensions?: string;
    warehouse_location?: string;
    warehouse_id?: number;
  }) =>
    fetchApi<any>('/inventory', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateInventory: (
    identifier: number | string,
    payload: Partial<{
      product_name: string;
      category: string;
      category_id: number;
      quantity: number;
      unit_cost: number;
      monthly_demand: number;
      age_months: number;
      material: string;
      dimensions: string;
      warehouse_location: string;
      warehouse_id: number;
    }>
  ) =>
    fetchApi<any>(`/inventory/${identifier}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  archiveInventory: (identifier: number | string) =>
    fetchApi<any>(`/inventory/${identifier}`, {
      method: 'DELETE',
    }),
  restoreInventory: (identifier: number | string) =>
    fetchApi<any>(`/inventory/${identifier}/restore`, {
      method: 'POST',
    }),
  importInventory: (rows: any[]) =>
    fetchApi<{ success: boolean; message: string; summary: any; data: any[] }>('/inventory/import', {
      method: 'POST',
      body: JSON.stringify({ rows }),
    }),

  // Matches
  getMatches: async () => {
    const data = await fetchApi<any[]>('/matches');
    if (!data || !Array.isArray(data)) return null;
    return data.map((item) => ({
      ...item,
      match_score: Number(item.match_score) || 0,
      required_units: Number(item.required_units) || 0,
      potential_deal_value: Number(item.potential_deal_value) || 0,
    })) as BuyerMatchItem[];
  },
  getMatchesForInventory: (identifier: string) => fetchApi<any>(`/matches/${identifier}`),

  // Marketplace
  getMarketplace: async () => {
    const data = await fetchApi<any[]>('/marketplace/listings');
    if (!data || !Array.isArray(data)) return null;
    return data.map((item) => ({
      ...item,
      units_available: Number(item.units_available) || 0,
      price_per_unit: Number(item.price_per_unit) || 0,
    })) as MarketplaceItem[];
  },
  createMarketplaceListing: (payload: {
    title: string;
    category: string;
    units_available: number;
    price_per_unit: number;
    location: string;
    description?: string;
    condition?: string;
    inventory_id?: number;
  }) =>
    fetchApi<any>('/marketplace/listings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Recovery & Analytics
  getDashboardSummary: () => fetchApi<DashboardSummary>('/dashboard/summary'),
  getAnalyticsOverview: () => fetchApi<any>('/analytics/overview'),
  getSustainability: () => fetchApi<any>('/sustainability/metrics'),
  getRecoverySummary: () => fetchApi<any>('/recovery/summary'),
  getRecoveryStrategies: (sku: string) => fetchApi<any>(`/recovery/product/${sku}`),

  // Notifications
  getNotifications: () => fetchApi<NotificationItem[]>('/notifications'),
  markNotificationRead: (id: number) =>
    fetchApi<any>(`/notifications/${id}/read`, {
      method: 'PATCH',
    }),
  markNotificationAsRead: (id: number) =>
    fetchApi<any>(`/notifications/${id}/read`, {
      method: 'PATCH',
    }),

  // Offers & Negotiations
  getOffers: async () => {
    const data = await fetchApi<any[]>('/offers');
    if (!data || !Array.isArray(data)) return null;
    return data.map((item) => ({
      ...item,
      offered_quantity: Number(item.offered_quantity) || 0,
      offered_unit_price: Number(item.offered_unit_price || item.offered_price_per_unit) || 0,
      total_deal_value: Number(item.total_deal_value || item.total_offer_amount) || 0,
    })) as OfferItem[];
  },
  sendOffer: (payload: {
    sku?: string;
    inventory_id?: number;
    receiver_company_id: number;
    buyer_match_id?: number;
    offered_quantity: number;
    offered_unit_price: number;
    notes?: string;
  }) =>
    fetchApi<any>('/offers/send', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  acceptOffer: (id: number) =>
    fetchApi<{ success: boolean; message: string; data: any }>(`/offers/${id}/accept`, {
      method: 'POST',
    }),
  counterOffer: (id: number, payload: { counter_unit_price: number; counter_quantity?: number; notes?: string }) =>
    fetchApi<any>(`/offers/${id}/counter`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  rejectOffer: (id: number, notes?: string) =>
    fetchApi<any>(`/offers/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    }),

  // Transactions & Ledger
  getTransactions: () => fetchApi<TransactionItem[]>('/transactions'),
  executeRecovery: (payload: {
    sku?: string;
    inventory_id?: number;
    action_type: string;
    quantity: number;
    deal_amount: number;
    buyer_company_id?: number;
    channel_notes?: string;
  }) =>
    fetchApi<{
      success: boolean;
      message: string;
      data: {
        transaction: any;
        movement: any;
        recovery_action: any;
        updated_inventory: any;
      };
    }>('/transactions/execute-recovery', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Auth & Profile
  getMe: () => fetchApi<UserProfile>('/auth/me'),
  updateProfile: (payload: {
    name?: string;
    phone?: string | null;
    profile_image?: string | null;
    role?: string;
    company_name?: string;
    industry?: string;
    location_city?: string;
  }) =>
    fetchApi<UserProfile>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  changePassword: (payload: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) =>
    fetchApi<any>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  startDemoSession: () =>
    fetchApi<{ user: any; token: string; token_type: string; is_demo: boolean }>('/auth/demo-session', {
      method: 'POST',
    }),
  logout: async () => {
    try {
      await fetchApi<any>('/auth/logout', { method: 'POST' });
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('deadstock_auth_token');
        localStorage.removeItem('deadstock_user');
        localStorage.removeItem('deadstock_view_mode');
      }
    }
  },

  // AI & Inquiries
  askAI: (query: string) =>
    fetchApi<{ query: string; response: string; intent: string; data: any; confidence: string }>('/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ query }),
    }),
  submitDemoRequest: (payload: {
    name: string;
    company: string;
    work_email: string;
    industry?: string;
    inventory_size?: string;
    message?: string;
  }) =>
    fetchApi<any>('/contact/demo-request', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
