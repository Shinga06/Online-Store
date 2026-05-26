import { createServerFn } from "@tanstack/react-start";
import { products as initialProducts, categories as initialCategories, type Product, type Category } from "./catalog";

// Types
export type DBProduct = Product & {
  stock: number;
  discountPrice?: number;
  newArrival?: boolean;
  outOfStock?: boolean;
  images: string[];
};

export type DBCategory = Category;

export type DBOrder = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  items: {
    productId: string;
    name: string;
    qty: number;
    price: number;
    size: string;
    color: string;
  }[];
  total: number;
  status: 
    | "Pending Payment" 
    | "Payment Confirmed" 
    | "Processing" 
    | "Packed" 
    | "Shipped" 
    | "Out for Delivery" 
    | "Delivered" 
    | "Cancelled"
    | "Pending"; // backward compatibility
  date: string;
  paymentMethod?: "Pay Now" | "Pay on Invoice" | "Request Quote";
  companyName?: string;
  vatNumber?: string;
  poNumber?: string;
  brandingReqs?: string;
  urgencyDate?: string;
  isQuote?: boolean;
  lastUpdated?: string;
  expectedDelivery?: string;
  courierName?: string;
  trackingNumber?: string;
  notificationLogs?: {
    channel: "WhatsApp" | "Email" | "SMS";
    trigger: string;
    timestamp: string;
    message: string;
  }[];
};


export type DBCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  dateRegistered: string;
  password?: string; // added for customer authentication
};

export type DBAdmin = {
  email: string;
  name: string;
  role: "Admin" | "Manager";
};

export type DBData = {
  products: DBProduct[];
  categories: DBCategory[];
  orders: DBOrder[];
  customers: DBCustomer[];
  admins: DBAdmin[];
};

// Seed Data
const DEFAULT_PRODUCTS: DBProduct[] = initialProducts.map((p, idx) => {
  // Let's create some low stock items (e.g. idx 3 and 7) and out of stock items (idx 0)
  let stock = Math.floor(Math.random() * 20) + 5;
  if (idx === 0) stock = 0;
  if (idx === 3) stock = 2;
  if (idx === 7) stock = 4;

  const outOfStock = stock === 0;

  // Let's add images and optional discount price
  const discountPrice = idx % 5 === 0 ? Math.round(p.price * 0.85) : undefined;
  const newArrival = idx < 4;

  return {
    ...p,
    stock,
    discountPrice,
    newArrival,
    outOfStock,
    images: [`/images/products/${p.slug}_1.jpg`, `/images/products/${p.slug}_2.jpg`],
  };
});

const DEFAULT_CATEGORIES: DBCategory[] = [...initialCategories];

const DEFAULT_CUSTOMERS: DBCustomer[] = [
  {
    id: "c1",
    name: "Thabo Mokoena",
    email: "thabo.mokoena@builders-za.com",
    phone: "+27 82 555 0192",
    ordersCount: 2,
    totalSpent: 2847,
    dateRegistered: "2026-03-10T11:20:00Z",
  },
  {
    id: "c2",
    name: "Liezel de Wet",
    email: "liezel@wetlands-spa.co.za",
    phone: "+27 71 444 9811",
    ordersCount: 1,
    totalSpent: 459,
    dateRegistered: "2026-04-15T08:45:00Z",
  },
  {
    id: "c3",
    name: "Sipho Khumalo",
    email: "sipho.khumalo@minetech.co.za",
    phone: "+27 83 999 1042",
    ordersCount: 1,
    totalSpent: 1199,
    dateRegistered: "2026-05-01T14:30:00Z",
  },
  {
    id: "c4",
    name: "Zanele Ndlovu",
    email: "zanele.n@apexsecurity.co.za",
    phone: "+27 60 123 4567",
    ordersCount: 0,
    totalSpent: 0,
    dateRegistered: "2026-05-20T10:15:00Z",
  },
];

const DEFAULT_ORDERS: DBOrder[] = [
  {
    id: "ORD-9481",
    customerName: "Thabo Mokoena",
    customerEmail: "thabo.mokoena@builders-za.com",
    customerPhone: "+27 82 555 0192",
    deliveryAddress: "42 Witkoppen Road, Fourways, Johannesburg, 2055",
    items: [
      { productId: "p1", name: "Navy Poly-Cotton Conti Suit", qty: 2, price: 649, size: "L", color: "Navy" },
      { productId: "p3", name: "Steel Toe Safety Boot", qty: 1, price: 1199, size: "9", color: "Black" },
    ],
    total: 2497,
    status: "Delivered",
    date: "2026-05-10T09:15:00Z",
  },
  {
    id: "ORD-9532",
    customerName: "Liezel de Wet",
    customerEmail: "liezel@wetlands-spa.co.za",
    customerPhone: "+27 71 444 9811",
    deliveryAddress: "Shop 12, Constantia Village, Main Road, Cape Town, 7806",
    items: [
      { productId: "p4", name: "Premium Chef Jacket", qty: 1, price: 459, size: "M", color: "White" },
    ],
    total: 459,
    status: "Shipped",
    date: "2026-05-18T11:40:00Z",
  },
  {
    id: "ORD-9580",
    customerName: "Sipho Khumalo",
    customerEmail: "sipho.khumalo@minetech.co.za",
    customerPhone: "+27 83 999 1042",
    deliveryAddress: "15 Mining Crescent, Welkom, Free State, 9459",
    items: [
      { productId: "p3", name: "Steel Toe Safety Boot", qty: 1, price: 1199, size: "10", color: "Brown" },
    ],
    total: 1199,
    status: "Pending",
    date: "2026-05-21T15:30:00Z",
  },
];

const DEFAULT_ADMINS: DBAdmin[] = [
  { email: "admin@cbalcool.co.za", name: "System Admin", role: "Admin" },
  { email: "manager@cbalcool.co.za", name: "Store Manager", role: "Manager" },
];

const SEED_DATA: DBData = {
  products: DEFAULT_PRODUCTS,
  categories: DEFAULT_CATEGORIES,
  orders: DEFAULT_ORDERS,
  customers: DEFAULT_CUSTOMERS,
  admins: DEFAULT_ADMINS,
};

// Dynamic Server-Side FS Helpers
async function getServerDb() {
  if (typeof window !== "undefined") return null;
  try {
    const fs = await import("node:fs");
    const path = await import("node:path");
    
    // Create db.json path inside project directory (e.g. inside src/lib or parent)
    const dbPath = path.resolve("./src/lib/db.json");
    
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify(SEED_DATA, null, 2), "utf-8");
    }
    
    const content = fs.readFileSync(dbPath, "utf-8");
    return {
      data: JSON.parse(content) as DBData,
      save: (data: DBData) => {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
      }
    };
  } catch (err) {
    console.error("Error accessing server database file:", err);
    return null;
  }
}

// In-Memory Fallback for server instances that don't have persistent files or for client-side fallback
let serverInMemoryDb: DBData | null = null;

async function getDbData(): Promise<DBData> {
  const serverDb = await getServerDb();
  if (serverDb) {
    return serverDb.data;
  }
  
  if (typeof window !== "undefined") {
    // Client-side LocalStorage fallback
    const local = localStorage.getItem("cbalcool_db");
    if (local) {
      try {
        return JSON.parse(local) as DBData;
      } catch {
        // ignore
      }
    }
    localStorage.setItem("cbalcool_db", JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
  
  // Server-side in-memory backup
  if (!serverInMemoryDb) {
    serverInMemoryDb = JSON.parse(JSON.stringify(SEED_DATA)) as DBData;
  }
  return serverInMemoryDb;
}

async function saveDbData(data: DBData) {
  const serverDb = await getServerDb();
  if (serverDb) {
    serverDb.save(data);
    return;
  }
  
  if (typeof window !== "undefined") {
    localStorage.setItem("cbalcool_db", JSON.stringify(data));
    return;
  }
  
  serverInMemoryDb = data;
}

// Server Functions (TanStack Start)
export const getDbFn = createServerFn({ method: "GET" }).handler(async () => {
  return await getDbData();
});

export const saveDbFn = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: DBData }) => {
    await saveDbData(data);
    return { success: true };
  });

function generateNotificationLogs(order: DBOrder, status: DBOrder["status"]) {
  if (!order.notificationLogs) {
    order.notificationLogs = [];
  }
  const timestamp = new Date().toISOString();
  const id = order.id;
  const name = order.customerName;
  const courier = order.courierName || "The Courier Guy";
  const trackNum = order.trackingNumber || "TCG-MOCK-12345";
  const deliveryDate = order.expectedDelivery 
    ? new Date(order.expectedDelivery).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" }) 
    : "within 2-3 business days";

  // Helper to push a log
  const addLog = (channel: "WhatsApp" | "Email" | "SMS", message: string) => {
    order.notificationLogs!.push({
      channel,
      trigger: `Status: ${status}`,
      timestamp,
      message,
    });
  };

  switch (status) {
    case "Pending Payment":
      addLog("Email", `Hi ${name},\n\nYour CBALCOOL order ${id} has been received and is awaiting payment confirmation.\n\nTotal amount: ZAR ${order.total.toFixed(2)}\nPayment Method: ${order.paymentMethod || "EFT Invoice"}\n\nPlease settle payment using your invoice details and email POP to accounts@cbalcool.co.za.`);
      addLog("SMS", `CBALCOOL: Order ${id} placed successfully. Awaiting payment of ZAR ${order.total.toFixed(2)}. Check your email for tax invoice instructions.`);
      break;
    case "Payment Confirmed":
      addLog("WhatsApp", `*CBALCOOL PPE Order Confirmed!* 🛡️\n\nHi ${name}, thank you for your payment for order *${id}*.\n\n💰 *Total:* ZAR ${order.total.toFixed(2)}\n📦 *Status:* SABS warehouse inventory has been allocated.\n\nWe will update you as soon as the dispatch team packages your gear!`);
      addLog("Email", `Hi ${name},\n\nWe have successfully received and verified your payment for order ${id}.\n\nYour order has been moved to our warehouse queue for packaging and quality checks.\n\nCBALCOOL Operations Desk.`);
      break;
    case "Processing":
      addLog("WhatsApp", `*CBALCOOL Packing Queue* 📦\n\nHi ${name}, order *${id}* is now being processed at our Germiston warehouse.\n\nOur safety coordinators are picking your Conti suits and boots to verify SABS compliant fittings.\n\nWe'll notify you once shipped!`);
      addLog("Email", `Hi ${name},\n\nYour order ${id} is currently in progress. Our technicians are preparing your custom sizing requirements and packaging your protective garments.\n\nThank you for choosing CBALCOOL.`);
      break;
    case "Packed":
      addLog("SMS", `CBALCOOL: Order ${id} has been carefully packaged and sealed under SABS guidelines. Ready for courier collection!`);
      addLog("Email", `Hi ${name},\n\nExcellent news! Your order ${id} has been fully packaged and is ready at our dispatch bays. Courier pick up has been scheduled.\n\nYour safety is our priority.\nCBALCOOL Logistics.`);
      break;
    case "Shipped":
      addLog("WhatsApp", `*CBALCOOL Shipment Dispatched!* 🚚\n\nHi ${name}, your safety package *${id}* is on its way!\n\n🚛 *Courier:* ${courier}\n🎫 *Tracking No:* ${trackNum}\n📅 *Expected Delivery:* ${deliveryDate}\n\nTrack your parcel here: https://thecourierguy.net/tracking/?t=${trackNum}`);
      addLog("SMS", `CBALCOOL: Order ${id} shipped via ${courier}. Tracking No: ${trackNum}. Expected arrival: ${deliveryDate}.`);
      addLog("Email", `Dear ${name},\n\nWe are pleased to inform you that your order ${id} has been dispatched.\n\nCourier: ${courier}\nTracking Number: ${trackNum}\nExpected Arrival: ${deliveryDate}\n\nTrack your shipment live at the courier page: https://thecourierguy.net/tracking/?t=${trackNum}\n\nCBALCOOL Dispatch.`);
      break;
    case "Out for Delivery":
      addLog("WhatsApp", `*CBALCOOL Delivery Alert!* 🔔\n\nHi ${name}, your order *${id}* is out for delivery today with *${courier}*!\n\nPlease ensure someone is available at your delivery address to sign for the package.\n\nWear your safety gear with pride!`);
      addLog("SMS", `CBALCOOL: Order ${id} is out for delivery today with ${courier}. Have a great day!`);
      break;
    case "Delivered":
      addLog("WhatsApp", `*CBALCOOL Order Delivered!* 🎉\n\nHi ${name}, your SABS protective garments *${id}* have been successfully delivered!\n\nWe hope you are fully satisfied with your workwear. Need bulk orders or additional gear? Visit CBALCOOL.co.za.\n\nStay Safe, Stay Productive!`);
      addLog("Email", `Dear ${name},\n\nWe have received confirmation that your order ${id} was successfully delivered.\n\nThank you for trusting CBALCOOL PPE & Workwear South Africa as your professional safety partner.\n\nWarm regards,\nCBALCOOL Customer Care.`);
      break;
    case "Cancelled":
      addLog("Email", `Dear ${name},\n\nYour order ${id} has been cancelled.\n\nIf you have any questions or believe this is an error, please contact our support team at trade@cbalcool.co.za.\n\nCBALCOOL Support.`);
      break;
  }
}

// Client API Wrapper (reactive state management with local backup sync)
let clientCachedData: DBData | null = null;
const listeners = new Set<() => void>();

export const db = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  notify() {
    listeners.forEach((l) => l());
  },

  async load(): Promise<DBData> {
    try {
      // Call server function first
      const data = await getDbFn();
      clientCachedData = data;
      // Also cache to local storage on the client
      if (typeof window !== "undefined") {
        localStorage.setItem("cbalcool_db", JSON.stringify(data));
      }
      this.notify();
      return data;
    } catch (err) {
      console.warn("Failed to load DB from server, using local fallback:", err);
      const data = await getDbData();
      clientCachedData = data;
      this.notify();
      return data;
    }
  },

  getDataSync(): DBData {
    if (clientCachedData) return clientCachedData;
    if (typeof window !== "undefined") {
      const local = localStorage.getItem("cbalcool_db");
      if (local) {
        try {
          clientCachedData = JSON.parse(local);
          return clientCachedData!;
        } catch {
          // ignore
        }
      }
    }
    return SEED_DATA;
  },

  async save(data: DBData) {
    clientCachedData = data;
    if (typeof window !== "undefined") {
      localStorage.setItem("cbalcool_db", JSON.stringify(data));
    }
    this.notify();
    try {
      await saveDbFn({ data });
    } catch (err) {
      console.warn("Failed to save DB to server, saved locally:", err);
    }
  },

  // API operations
  async getProducts() {
    const data = await this.load();
    return data.products;
  },

  async getProduct(slug: string) {
    const data = await this.load();
    return data.products.find((p) => p.slug === slug);
  },

  async saveProduct(product: Partial<DBProduct> & { id: string }) {
    const data = await this.load();
    const idx = data.products.findIndex((p) => p.id === product.id);
    const slug = product.name
      ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      : product.slug || "";
      
    const stock = product.stock !== undefined ? Number(product.stock) : 0;
    const outOfStock = stock === 0;

    const fullProduct: DBProduct = {
      id: product.id,
      slug,
      name: product.name || "Unnamed Product",
      category: product.category || "aprons",
      price: product.price !== undefined ? Number(product.price) : 0,
      discountPrice: product.discountPrice !== undefined ? Number(product.discountPrice) : undefined,
      stock,
      description: product.description || "",
      features: product.features || [],
      sizes: product.sizes || [],
      colors: product.colors || [],
      images: product.images || [`/images/products/${slug}_1.jpg`],
      badge: product.badge,
      featured: !!product.featured,
      newArrival: !!product.newArrival,
      outOfStock,
    };

    if (idx >= 0) {
      data.products[idx] = fullProduct;
    } else {
      data.products.push(fullProduct);
    }
    await this.save(data);
    return fullProduct;
  },

  async deleteProduct(id: string) {
    const data = await this.load();
    data.products = data.products.filter((p) => p.id !== id);
    await this.save(data);
    return true;
  },

  async getCategories() {
    const data = await this.load();
    return data.categories;
  },

  async saveCategory(category: DBCategory) {
    const data = await this.load();
    const idx = data.categories.findIndex((c) => c.slug === category.slug);
    if (idx >= 0) {
      data.categories[idx] = category;
    } else {
      data.categories.push(category);
    }
    await this.save(data);
    return category;
  },

  async deleteCategory(slug: string) {
    const data = await this.load();
    data.categories = data.categories.filter((c) => c.slug !== slug);
    await this.save(data);
    return true;
  },

  async getOrders() {
    const data = await this.load();
    return data.orders;
  },

  async getCustomers() {
    const data = await this.load();
    return data.customers;
  },

  async registerCustomer(customer: { name: string; email: string; phone: string; password?: string }) {
    const data = await this.load();
    const existing = data.customers.find(
      (c) => c.email.toLowerCase() === customer.email.toLowerCase()
    );
    if (existing) {
      throw new Error("An account with this email address already exists.");
    }
    const newCust: DBCustomer = {
      id: `c${data.customers.length + 1}`,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      ordersCount: 0,
      totalSpent: 0,
      dateRegistered: new Date().toISOString(),
      password: customer.password || "password123",
    };
    data.customers.push(newCust);
    await this.save(data);
    return newCust;
  },

  async loginCustomer(email: string, password?: string) {
    const data = await this.load();
    const customer = data.customers.find(
      (c) => c.email.toLowerCase() === email.toLowerCase()
    );
    if (!customer) {
      throw new Error("No account found registered under this email.");
    }
    const savedPassword = customer.password || "password123";
    if (password && savedPassword !== password) {
      throw new Error("Incorrect password. Please verify and try again.");
    }
    return customer;
  },

  async updateOrderStatus(
    id: string, 
    status: DBOrder["status"],
    courierName?: string,
    trackingNumber?: string,
    expectedDelivery?: string
  ) {
    const data = await this.load();
    const order = data.orders.find((o) => o.id === id);
    if (order) {
      order.status = status;
      order.lastUpdated = new Date().toISOString();
      if (courierName !== undefined) order.courierName = courierName;
      if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
      if (expectedDelivery !== undefined) order.expectedDelivery = expectedDelivery;
      
      // Generate notification logs
      generateNotificationLogs(order, status);
      
      await this.save(data);
    }
    return order;
  },

  async placeOrder(orderData: Omit<DBOrder, "id" | "date" | "total">) {
    const data = await this.load();
    
    // Create invoice or RFQ ID based on payment type
    const isRFQ = orderData.isQuote || orderData.paymentMethod === "Request Quote";
    const prefix = isRFQ ? "RFQ" : "ORD";
    const nextNum = Math.floor(Math.random() * 9000) + 1000;
    const id = `${prefix}-${nextNum}`;
    
    // Calculate total
    let total = 0;
    for (const item of orderData.items) {
      total += item.price * item.qty;
      
      // Decrement stock in DB product
      const product = data.products.find((p) => p.id === item.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - item.qty);
        if (product.stock === 0) {
          product.outOfStock = true;
        }
      }
    }
    
    // Paid orders immediately enter 'Processing' status, quotes and invoice terms start as 'Pending'
    const status = orderData.paymentMethod === "Pay Now" ? "Processing" : (orderData.status || "Pending");
    
    const newOrder: DBOrder = {
      ...orderData,
      status,
      id,
      total,
      date: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      notificationLogs: [],
    };

    // Seed notification logs sequentially to build a logical tracking timeline history
    if (orderData.paymentMethod === "Pay Now") {
      generateNotificationLogs(newOrder, "Pending Payment");
      generateNotificationLogs(newOrder, "Payment Confirmed");
      generateNotificationLogs(newOrder, "Processing");
    } else if (orderData.paymentMethod === "Pay on Invoice") {
      generateNotificationLogs(newOrder, "Pending Payment");
    } else {
      // Request Quote
      generateNotificationLogs(newOrder, "Pending Payment");
    }
    
    data.orders.unshift(newOrder);

    // Update Customer details
    const existingCust = data.customers.find(
      (c) => c.email.toLowerCase() === orderData.customerEmail.toLowerCase()
    );
    if (existingCust) {
      existingCust.ordersCount += 1;
      existingCust.totalSpent += total;
    } else {
      data.customers.push({
        id: `c${data.customers.length + 1}`,
        name: orderData.customerName,
        email: orderData.customerEmail,
        phone: orderData.customerPhone,
        ordersCount: 1,
        totalSpent: total,
        dateRegistered: new Date().toISOString(),
      });
    }

    await this.save(data);
    return newOrder;
  },
};

// One-time migration: purge legacy "safegear_*" storage keys
if (typeof window !== "undefined") {
  // Purge local storage cache if category images are missing to force refresh
  const localDb = localStorage.getItem("cbalcool_db");
  if (localDb) {
    try {
      const parsed = JSON.parse(localDb);
      const categories = parsed.categories || [];
      const hasImages = categories.some((c: any) => c.image);
      if (categories.length > 0 && !hasImages) {
        localStorage.removeItem("cbalcool_db");
      }
    } catch {
      localStorage.removeItem("cbalcool_db");
    }
  }

  const legacyPrefixes = ["safegear_"];
  for (const prefix of legacyPrefixes) {
    // Clean localStorage
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    }
    // Clean sessionStorage
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(prefix)) {
        sessionStorage.removeItem(key);
      }
    }
  }
}

// Initial background load in browser
if (typeof window !== "undefined") {
  db.load();
}
