// Mock data for frontend development
export const mockUser = {
  id: "demo-user-id",
  username: "merchant",
  email: "merchant@transcope.com",
  merchantName: "TechCorp Ltd",
  industry: "Technology",
  role: "MERCHANT",
  createdAt: new Date("2024-03-01"),
};

export const mockSites = [
  {
    id: "site-1",
    name: "Downtown Store",
    address: "123 Main St, New York, NY 10001",
    userId: "demo-user-id",
    createdAt: new Date("2024-03-01"),
    devices: [
      {
        id: "device-1",
        deviceId: "POS-001",
        model: "Square Terminal",
        siteId: "site-1",
        createdAt: new Date("2024-03-01"),
      },
      {
        id: "device-2",
        deviceId: "POS-002",
        model: "Clover Flex",
        siteId: "site-1",
        createdAt: new Date("2024-03-02"),
      }
    ]
  },
  {
    id: "site-2",
    name: "Mall Location",
    address: "456 Mall Blvd, New York, NY 10002",
    userId: "demo-user-id",
    createdAt: new Date("2024-03-05"),
    devices: [
      {
        id: "device-3",
        deviceId: "POS-003",
        model: "Square Terminal",
        siteId: "site-2",
        createdAt: new Date("2024-03-05"),
      }
    ]
  }
];

export const mockDevices = [
  {
    id: "device-1",
    deviceId: "POS-001",
    model: "Square Terminal",
    siteId: "site-1",
    createdAt: new Date("2024-03-01"),
    site: mockSites[0]
  },
  {
    id: "device-2",
    deviceId: "POS-002",
    model: "Clover Flex",
    siteId: "site-1",
    createdAt: new Date("2024-03-02"),
    site: mockSites[0]
  },
  {
    id: "device-3",
    deviceId: "POS-003",
    model: "Square Terminal",
    siteId: "site-2",
    createdAt: new Date("2024-03-05"),
    site: mockSites[1]
  }
];

export const mockTransactions = [
  {
    id: "txn-1",
    amount: "145.99",
    currency: "USD",
    status: "AUTHORIZED",
    type: "PURCHASE",
    customerName: "John Smith",
    timestamp: new Date("2024-03-15T14:30:00"),
    userId: "demo-user-id",
    posDeviceId: "device-1",
    posDevice: mockDevices[0],
    site: mockSites[0]
  },
  {
    id: "txn-2",
    amount: "89.50",
    currency: "USD",
    status: "AUTHORIZED",
    type: "PURCHASE",
    customerName: "Sarah Johnson",
    timestamp: new Date("2024-03-15T13:15:00"),
    userId: "demo-user-id",
    posDeviceId: "device-2",
    posDevice: mockDevices[1],
    site: mockSites[0]
  },
  {
    id: "txn-3",
    amount: "32.75",
    currency: "USD",
    status: "REFUNDED",
    type: "REFUND",
    customerName: "Michael Brown",
    timestamp: new Date("2024-03-14T16:45:00"),
    userId: "demo-user-id",
    posDeviceId: "device-1",
    posDevice: mockDevices[0],
    site: mockSites[0]
  }
];

export const mockStats = {
  totalRevenue: 268.24,
  totalTransactions: 3,
  activeSites: 2,
  posDevices: 3
};