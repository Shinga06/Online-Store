import { useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";
import { tracker } from "@/lib/tracker";

export function usePageTracker() {
  const location = useLocation();
  const startTime = useRef<number>(Date.now());
  const activePath = useRef<string>(location.pathname);
  const activeSearch = useRef<string>((location.search as any)?.q || "");
  const searchStr = typeof window !== "undefined" ? window.location.search : "";

  useEffect(() => {
    // Exclude admin route activities to avoid polluting customer behavior metrics
    if (location.pathname.startsWith("/admin")) return;

    startTime.current = Date.now();
    activePath.current = location.pathname;
    activeSearch.current = (location.search as any)?.q || "";

    const cleanPath = location.pathname;
    let actionType: 
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
      | "Page View" = "Page View";

    let targetId = cleanPath;
    let targetName = "Page View";
    let searchQuery: string | undefined;

    if (cleanPath.startsWith("/product/")) {
      actionType = "Product View";
      targetId = cleanPath.split("/").pop() || "";
      // Unhyphenate for a beautiful visual target name
      targetName = targetId.replace(/-/g, " ");
      targetName = targetName.charAt(0).toUpperCase() + targetName.slice(1);
    } else if (cleanPath === "/shop") {
      const urlParams = new URLSearchParams(window.location.search);
      const category = urlParams.get("category");
      const q = urlParams.get("q");

      if (q) {
        actionType = "Search";
        searchQuery = q.trim();
        targetId = `search:${searchQuery}`;
        targetName = `Search: "${searchQuery}"`;
      } else if (category) {
        actionType = "Category View";
        targetId = category;
        targetName = category.replace(/-/g, " ");
        targetName = targetName.charAt(0).toUpperCase() + targetName.slice(1);
      } else {
        targetId = "/shop";
        targetName = "Catalogue Browsing";
      }
    } else if (cleanPath === "/") {
      targetId = "home";
      targetName = "Storefront Home";
    } else if (cleanPath === "/checkout") {
      targetId = "checkout";
      targetName = "Procurement Checkout Portal";
    } else if (cleanPath === "/cart") {
      targetId = "cart";
      targetName = "Shopping Cart Overview";
    } else if (cleanPath === "/account") {
      targetId = "account";
      targetName = "Account Dashboard";
    } else if (cleanPath === "/about") {
      targetId = "about";
      targetName = "About SABS Standards Page";
    } else if (cleanPath === "/contact") {
      targetId = "contact";
      targetName = "Procurement Contact Desk";
    } else if (cleanPath === "/track") {
      targetId = "track";
      targetName = "Shipment Tracking Console";
    }

    // Immediately record page load interaction event
    tracker.track(actionType, { targetId, targetName, searchQuery });

    // Closure variables for cleaner unmount tracking
    const closurePath = cleanPath;
    const closureName = targetName;

    return () => {
      const durationSeconds = Math.round((Date.now() - startTime.current) / 1000);
      
      // Log Page View Duration only if user spent significant time (>= 2 seconds) on page
      if (durationSeconds >= 2) {
        tracker.track("Page View", {
          targetId: closurePath,
          targetName: `Time Spent on ${closureName}`,
          durationSeconds: durationSeconds
        });
      }
    };
  }, [location.pathname, searchStr]);
}
