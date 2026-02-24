"use client";

import { useEffect, useState, useMemo } from "react";

/**
 * Hook to detect dark mode state
 * Returns current dark mode state and updates in real-time when theme changes
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial state
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    // Create a MutationObserver to watch for theme changes
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "class") {
          checkDarkMode();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const colors = useMemo(() => ({
    textColor: isDark ? "#9ca3af" : "#6b7280",
    gridColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
    axisColor: isDark ? "#4b5563" : "#e5e7eb",
    bgColor: isDark ? "#1f2937" : "#ffffff",
    borderColor: isDark ? "#374151" : "#e5e7eb",
    tooltipBg: isDark ? "#1f2937" : "#ffffff",
    tooltipBorder: isDark ? "#374151" : "#e5e7eb",
  }), [isDark]);

  return { isDark, ...colors };
}

/**
 * Get color based on dark mode state
 */
export function useThemeColors() {
  const { isDark } = useDarkMode();

  return {
    textColor: isDark ? "#9ca3af" : "#6b7280",
    gridColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
    axisColor: isDark ? "#4b5563" : "#e5e7eb",
    bgColor: isDark ? "#1f2937" : "#ffffff",
    borderColor: isDark ? "#374151" : "#e5e7eb",
    tooltipBg: isDark ? "#1f2937" : "#ffffff",
    tooltipBorder: isDark ? "#374151" : "#e5e7eb",
  };
}
