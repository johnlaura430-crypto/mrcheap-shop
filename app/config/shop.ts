// MrCheap Shop Configuration
export const shopConfig = {
  // ===== SHOP INFORMATION =====
  shop: {
    name: "MrCheap Shop",
    tagline: "Quality Products at Cheap Prices!",
    description: "Your one-stop shop for all Electronics needs",
    established: "2025",
    motto: "Customer Satisfaction is Our Priority",
  },
  
  // ===== CONTACT DETAILS =====
  contact: {
    address: {
      City: "Dar es Salaam",
      Country: "Tanzania",
    },
    phone: "0673 674 715",
    whatsapp: "0673 674 715",
    email: "info@mrcheapshop.com",
    website: "mrcheapshop.vercel.app",
  },

  // ===== CURRENCY & TAX =====
  currency: {
    symbol: "TZS",
    code: "TZS",
    decimalPlaces: 2,
    thousandSeparator: ",",
    decimalSeparator: ".",
  },

  
  // ===== SHOP CATEGORIES =====
  categories: [
    { id: "electronics", name: "Electronics", icon: "📱" },
  ],
  
  // ===== PAYMENT METHODS =====
  paymentMethods: [
    { id: "cash", name: "Cash", icon: "💵", enabled: true },
  ],
  
  // ===== USER ROLES =====
  roles: [
    { 
      id: "admin", 
      name: "Administrator", 
      level: 100,
      permissions: ["all"],
      description: "Full access to everything"
    },
    { 
      id: "manager", 
      name: "Shop Manager", 
      level: 80,
      permissions: ["products", "sales", "stock", "reports", "customers"],
      description: "Can manage shop operations"
    },
    { 
      id: "sales", 
      name: "Sales Staff", 
      level: 50,
      permissions: ["sales", "customers"],
      description: "Can process sales and manage customers"
    },
    { 
      id: "stock", 
      name: "Stock Manager", 
      level: 40,
      permissions: ["products", "stock"],
      description: "Can manage products and stock"
    },
    { 
      id: "cashier", 
      name: "Cashier", 
      level: 30,
      permissions: ["sales"],
      description: "Can only process sales"
    },
  ],
  
  // ===== FEATURES =====
  features: {
    enableBarcodeScanner: true,
    enableOfflineMode: true,
    enableReceiptPrinting: true,
    enableCustomerDatabase: true,
    enableLoyaltyProgram: true,
    enableStockAlerts: true,
    enableMultiBranch: false,
    enableOnlineOrders: false,
    enableExpiryTracking: false,
  },
  
  
  // ===== RECEIPT SETTINGS =====
  receipt: {
    header: "Thank you for shopping with us!",
    footer: "Goods once sold will not be taken back\n",
    terms: [
      "Please check items at the time of purchase",
      "Keep this receipt for return/exchange",
      "Exchange within 7 days with receipt",
      "No refund, only exchange",
    ],
    showQRCode: true,
    showShopDetails: true,
    showTaxBreakup: true,
  },
  
  // ===== STOCK SETTINGS =====
  stock: {
    lowStockThreshold: 10,
    criticalStockThreshold: 5,
    autoReorder: false,
    allowNegativeStock: false,
    stockUpdateMethods: ["purchase", "sale", "adjustment", "return"],
  },
  
  // ===== INVOICE SETTINGS =====
  invoice: {
    prefix: "MCS",
    startingNumber: 1001,
    digits: 6,
    format: "{prefix}/{year}/{month}/{number}",
    showCustomerDetails: true,
    showPaymentMethod: true,
    showCashierName: true,
  },
  
  // ===== BUSINESS HOURS =====
  businessHours: {
    monday: { open: "10:00", close: "20:00" },
    tuesday: { open: "10:00", close: "20:00" },
    wednesday: { open: "10:00", close: "20:00" },
    thursday: { open: "10:00", close: "20:00" },
    friday: { open: "10:00", close: "20:00" },
    saturday: { open: "10:00", close: "16:00" },
    sunday: "Closed",
    holidays: "Closed",
  },
  
  // ===== SYSTEM SETTINGS =====
  system: {
    timezone: "Tanzania/Dar es salaam",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "HH:mm",
    autoBackup: true,
    backupTime: "02:00",
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    passwordMinLength: 8,
  },
};
