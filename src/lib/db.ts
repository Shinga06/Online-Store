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
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
};

export type DBCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  dateRegistered: string;
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
  { email: "admin@safegear.co.za", name: "System Admin", role: "Admin" },
  { email: "manager@safegear.co.za", name: "Store Manager", role: "Manager" },
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
    const local = localStorage.getItem("safegear_db");
    if (local) {
      try {
        return JSON.parse(local) as DBData;
      } catch {
        // ignore
      }
    }
    localStorage.setItem("safegear_db", JSON.stringify(SEED_DATA));
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
    localStorage.setItem("safegear_db", JSON.stringify(data));
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
        localStorage.setItem("safegear_db", JSON.stringify(data));
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
      const local = localStorage.getItem("safegear_db");
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
      localStorage.setItem("safegear_db", JSON.stringify(data));
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

  async updateOrderStatus(id: string, status: DBOrder["status"]) {
    const data = await this.load();
    const order = data.orders.find((o) => o.id === id);
    if (order) {
      order.status = status;
      await this.save(data);
    }
    return order;
  },

  async placeOrder(orderData: Omit<DBOrder, "id" | "date" | "total">) {
    const data = await this.load();
    
    // Create invoice ID
    const nextNum = Math.floor(Math.random() * 9000) + 1000;
    const id = `ORD-${nextNum}`;
    
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
    
    const newOrder: DBOrder = {
      ...orderData,
      id,
      total,
      date: new Date().toISOString(),
    };
    
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

// Initial background load in browser
if (typeof window !== "undefined") {
  db.load();
}
