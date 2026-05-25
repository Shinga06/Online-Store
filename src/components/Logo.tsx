import React from "react";

interface LogoProps {
  /**
   * The display layout variant
   * - "horizontal": Fits the storefront header height
   * - "stacked": Larger centered logo for the footer
   * - "large": Maximum-impact central logo for the admin login screen
   * - "sidebar": Fits the admin sidebar height
   */
  variant?: "horizontal" | "stacked" | "large" | "sidebar";
  /**
   * Extra classes for layout container
   */
  className?: string;
}

export function Logo({
  variant = "horizontal",
  className = "",
}: LogoProps) {
  
  // 1. VARIANT: Horizontal (Storefront Header)
  if (variant === "horizontal") {
    return (
      <div className={`flex items-center shrink-0 ${className}`}>
        {/* Renders the EXACT original logo image with its natural white background */}
        <img
          src="/images/logo.png"
          alt="CBALCOOL Corporate Solutions"
          className="h-14 w-auto object-contain transition-transform duration-300 hover:scale-102 rounded-sm"
        />
      </div>
    );
  }

  // 2. VARIANT: Sidebar (Admin Dashboard Sidebar)
  if (variant === "sidebar") {
    return (
      <div className={`flex items-center shrink-0 ${className}`}>
        {/* Renders the EXACT original logo image with its natural white background */}
        <img
          src="/images/logo.png"
          alt="CBALCOOL Corporate Solutions"
          className="h-12 w-auto object-contain rounded-sm"
        />
      </div>
    );
  }

  // 3. VARIANT: Stacked (Storefront Footer)
  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center shrink-0 ${className}`}>
        {/* Renders the EXACT original logo image with its natural white background */}
        <img
          src="/images/logo.png"
          alt="CBALCOOL Corporate Solutions"
          className="h-36 w-auto object-contain transition-transform duration-300 hover:scale-102 rounded-sm"
        />
      </div>
    );
  }

  // 4. VARIANT: Large (Admin Login Gate)
  if (variant === "large") {
    return (
      <div className={`flex flex-col items-center shrink-0 ${className}`}>
        {/* Renders the EXACT original logo image with its natural white background */}
        <img
          src="/images/logo.png"
          alt="CBALCOOL Corporate Solutions"
          className="h-52 w-auto object-contain transition-transform duration-300 hover:scale-102 rounded-md shadow-lg"
        />
      </div>
    );
  }

  return null;
}
