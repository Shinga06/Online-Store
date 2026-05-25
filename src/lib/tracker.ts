import { db } from "./db";

// Generate or retrieve persistent mock B2C visitor details for high-fidelity auditing
function getTelemetry() {
  if (typeof window === "undefined") {
    return {
      deviceType: "Desktop" as const,
      browserName: "Server Node",
      osName: "Linux",
      ipAddress: "127.0.0.1",
      location: "Johannesburg, GP",
      repeatVisit: false,
    };
  }

  const STORAGE_KEY = "cbalcool_client_telemetry";
  let cached = localStorage.getItem(STORAGE_KEY);
  let telemetry;

  if (cached) {
    try {
      telemetry = JSON.parse(cached);
      telemetry.repeatVisit = true;
    } catch {
      cached = null;
    }
  }

  if (!cached) {
    const browsers = ["Chrome", "Safari", "Edge", "Firefox"];
    const devices = ["Desktop", "Mobile", "Tablet"] as const;
    const osList = ["Windows 11", "macOS Sequoia", "iOS 18", "Android 14"];
    const locations = [
      "Johannesburg, GP",
      "Cape Town, WC",
      "Durban, KZN",
      "Pretoria, GP",
      "Gqeberha, EC",
      "Bloemfontein, FS"
    ];

    const browser = browsers[Math.floor(Math.random() * browsers.length)];
    const device = devices[Math.random() < 0.6 ? 0 : Math.random() < 0.85 ? 1 : 2]; // 60% Desktop, 25% Mobile, 15% Tablet
    const os = osList[Math.floor(Math.random() * osList.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    // Generate a valid mock South African IP range
    const ip = `197.80.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}`;

    telemetry = {
      deviceType: device,
      browserName: browser,
      osName: os,
      ipAddress: ip,
      location: location,
      repeatVisit: false,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(telemetry));
  }

  return telemetry;
}

export const tracker = {
  async track(
    actionType: 
      | "Registration"
      | "Login"
      | "Product View"
      | "Category View"
      | "Search"
      | "Add to Cart"
      | "Remove from Cart"
      | "Cart Abandoned"
      | "Checkout Attempt"
      | "Purchase"
      | "Wishlist Action"
      | "Page View",
    metadata: {
      targetId?: string;
      targetName?: string;
      searchQuery?: string;
      cartTotal?: number;
      durationSeconds?: number;
    } = {}
  ) {
    if (typeof window === "undefined") return;

    // Resolve user session profile safely
    let activeCustomer = null;
    const sessionStr = localStorage.getItem("cbalcool_customer_session");
    if (sessionStr) {
      try {
        activeCustomer = JSON.parse(sessionStr);
      } catch {}
    }

    const telemetry = getTelemetry();

    const logPayload = {
      actionType,
      userType: activeCustomer ? ("Registered" as const) : ("Guest" as const),
      userId: activeCustomer?.id,
      userEmail: activeCustomer?.email,
      userName: activeCustomer?.name,
      ...metadata,
      ...telemetry,
    };

    try {
      await db.logActivity(logPayload);
    } catch (e) {
      console.warn("[Tracker] Failed to record user behavior analytics:", e);
    }
  }
};
