import type { 
  User, InsertUser, 
  MerchantSite, InsertMerchantSite, 
  PosDevice, InsertPosDevice,
  Transaction, InsertTransaction,
  TransactionWithDetails, PosDeviceWithSite, MerchantSiteWithDevices
} from "@shared/schema";

const SPRING_BOOT_BASE_URL = "http://localhost:8080/api";

async function springBootRequest(method: string, endpoint: string, data?: any): Promise<Response> {
  const url = `${SPRING_BOOT_BASE_URL}${endpoint}`;
  const token = localStorage.getItem("transcope_token");
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || "Request failed");
    }

    return response;
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error("Backend server is not running. Please start the Spring Boot backend on port 8080.");
    }
    throw error;
  }
}

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await springBootRequest("POST", "/auth/login", { email, password });
    return response.json();
  },
  
  logout: async (): Promise<void> => {
    await springBootRequest("POST", "/auth/logout");
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (userId: string): Promise<{
    totalRevenue: number;
    totalTransactions: number;
    activeSites: number;
    posDevices: number;
  }> => {
    const response = await springBootRequest("GET", `/dashboard/stats/${userId}`);
    return response.json();
  },
};

// Transaction API
export const transactionApi = {
  getAll: async (userId: string): Promise<TransactionWithDetails[]> => {
    const response = await springBootRequest("GET", `/transactions/user/${userId}`);
    return response.json();
  },
  
  create: async (transaction: InsertTransaction): Promise<Transaction> => {
    const response = await springBootRequest("POST", "/transactions", transaction);
    return response.json();
  },
  
  update: async (id: string, updates: Partial<InsertTransaction>): Promise<Transaction> => {
    const response = await springBootRequest("PUT", `/transactions/${id}`, updates);
    return response.json();
  },
  
  delete: async (id: string): Promise<void> => {
    await springBootRequest("DELETE", `/transactions/${id}`);
  },
};

// Site API
export const siteApi = {
  getAll: async (userId: string): Promise<MerchantSiteWithDevices[]> => {
    const response = await springBootRequest("GET", `/sites/user/${userId}`);
    return response.json();
  },
  
  create: async (site: InsertMerchantSite): Promise<MerchantSite> => {
    const response = await springBootRequest("POST", "/sites", site);
    return response.json();
  },
  
  update: async (id: string, updates: Partial<InsertMerchantSite>): Promise<MerchantSite> => {
    const response = await springBootRequest("PUT", `/sites/${id}`, updates);
    return response.json();
  },
  
  delete: async (id: string): Promise<void> => {
    await springBootRequest("DELETE", `/sites/${id}`);
  },
};

// Device API
export const deviceApi = {
  getAll: async (userId: string): Promise<PosDeviceWithSite[]> => {
    const response = await springBootRequest("GET", `/devices/user/${userId}`);
    return response.json();
  },
  
  create: async (device: InsertPosDevice): Promise<PosDevice> => {
    const response = await springBootRequest("POST", "/devices", device);
    return response.json();
  },
  
  update: async (id: string, updates: Partial<InsertPosDevice>): Promise<PosDevice> => {
    const response = await springBootRequest("PUT", `/devices/${id}`, updates);
    return response.json();
  },
  
  delete: async (id: string): Promise<void> => {
    await springBootRequest("DELETE", `/devices/${id}`);
  },
};
