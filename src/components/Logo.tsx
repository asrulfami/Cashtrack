import { useDarkMode } from "@/hooks/useDarkMode";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

export default function Logo({
  size = "md",
  showText = true,
  className = "",
}: LogoProps) {
  const { isDark } = useDarkMode();

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  // Color schemes for light and dark mode
  const colors = isDark
    ? {
        primary: "#3b82f6", // blue-500
        secondary: "#8b5cf6", // purple-500
        accent: "#10b981", // green-500
        gradient1: "from-blue-400",
        gradient2: "via-purple-400",
        gradient3: "to-green-400",
        text: "text-white",
        glow: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))",
      }
    : {
        primary: "#2563eb", // blue-600
        secondary: "#7c3aed", // purple-600
        accent: "#059669", // green-600
        gradient1: "from-blue-600",
        gradient2: "via-purple-600",
        gradient3: "to-green-600",
        text: "text-gray-900",
        glow: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
      };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Background gradient circle */}
        <div
          className={`absolute inset-0 rounded-xl bg-gradient-to-br ${colors.gradient1} ${colors.gradient2} ${colors.gradient3} opacity-20 blur-sm`}
        />

        {/* Main logo container */}
        <div
          className={`relative w-full h-full rounded-xl bg-gradient-to-br ${colors.gradient1} ${colors.gradient2} ${colors.gradient3} p-2 shadow-lg`}
          style={{ filter: colors.glow }}
        >
          {/* Inner design - combining money and chart elements */}
          <div className="w-full h-full bg-white/90 dark:bg-gray-900/90 rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* Chart line */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full p-1"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background grid lines */}
              <defs>
                <pattern
                  id="grid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke={isDark ? "#374151" : "#e5e7eb"}
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />

              {/* Upward trend line */}
              <path
                d="M 15 75 L 35 55 L 50 65 L 70 35 L 85 20"
                stroke={`url(#gradient)`}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Gradient definition for the line */}
              <defs>
                <linearGradient
                  id="gradient"
                  x1="0%"
                  y1="100%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor={colors.primary} />
                  <stop offset="50%" stopColor={colors.secondary} />
                  <stop offset="100%" stopColor={colors.accent} />
                </linearGradient>
              </defs>

              {/* Data points */}
              <circle cx="15" cy="75" r="3" fill={colors.primary} />
              <circle cx="35" cy="55" r="3" fill={colors.secondary} />
              <circle cx="50" cy="65" r="3" fill={colors.secondary} />
              <circle cx="70" cy="35" r="3" fill={colors.accent} />
              <circle cx="85" cy="20" r="3" fill={colors.accent} />

              {/* Dollar sign subtle background */}
              <text
                x="50"
                y="55"
                fontSize="20"
                fontWeight="bold"
                fill={isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(37, 99, 235, 0.08)"}
                textAnchor="middle"
              >
                $
              </text>
            </svg>
          </div>
        </div>

        {/* Animated glow effect */}
        <div
          className={`absolute -inset-1 rounded-xl bg-gradient-to-br ${colors.gradient1} ${colors.gradient2} ${colors.gradient3} opacity-30 blur-md -z-10 animate-pulse`}
        />
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-black ${textSizes[size]} ${colors.text} tracking-tight`}
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 dark:from-blue-400 dark:via-purple-400 dark:to-green-400 bg-clip-text text-transparent">
              Cash
            </span>
            <span className={isDark ? "text-white" : "text-gray-900"}>Track</span>
          </span>
          {size === "lg" || size === "xl" ? (
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Personal Finance Tracker
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}
