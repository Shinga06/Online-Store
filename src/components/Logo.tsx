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
        {/* Padded high-contrast container for dark-on-transparent logos */}
        <div className="bg-white p-1 px-3 rounded-md shadow-xs flex items-center justify-center">
          <img
            src="/images/logo.bg.png"
            alt="CBALCOOL Corporate Solutions"
            className="h-11 w-auto object-contain transition-transform duration-300 hover:scale-102"
          />
        </div>
      </div>
    );
  }

  // 2. VARIANT: Sidebar (Admin Dashboard Sidebar)
  if (variant === "sidebar") {
    return (
      <div className={`flex items-center shrink-0 ${className}`}>
        {/* Padded high-contrast container for dark-on-transparent logos */}
        <div className="bg-white p-1 px-3 rounded-md shadow-xs flex items-center justify-center">
          <img
            src="/images/logo.bg.png"
            alt="CBALCOOL Corporate Solutions"
            className="h-9 w-auto object-contain"
          />
        </div>
      </div>
    );
  }

  // 3. VARIANT: Stacked (Storefront Footer / Alternate center)
  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center shrink-0 ${className}`}>
        {/* Padded high-contrast container for dark-on-transparent logos */}
        <div className="bg-white p-2.5 rounded-lg shadow-xs flex items-center justify-center">
          <img
            src="/images/logo.bg.png"
            alt="CBALCOOL Corporate Solutions"
            className="h-32 w-auto object-contain transition-transform duration-300 hover:scale-102"
          />
        </div>
      </div>
    );
  }

  // 4. VARIANT: Large (Admin Login Gate)
  if (variant === "large") {
    return (
      <div className={`flex flex-col items-center shrink-0 ${className}`}>
        {/* Padded high-contrast container for dark-on-transparent logos */}
        <div className="bg-white p-3.5 rounded-lg shadow-md flex items-center justify-center">
          <img
            src="/images/logo.bg.png"
            alt="CBALCOOL Corporate Solutions"
            className="h-44 w-auto object-contain transition-transform duration-300 hover:scale-102"
          />
        </div>
      </div>
    );
  }

  return null;
}
