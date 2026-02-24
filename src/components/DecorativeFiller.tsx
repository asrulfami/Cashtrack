"use client";

interface DecorativeFillerProps {
  variant?: "gradient" | "particles" | "waves" | "grid" | "dots";
  className?: string;
  height?: "sm" | "md" | "lg" | "full";
}

const heightVariants = {
  sm: "h-16 sm:h-20",
  md: "h-24 sm:h-32",
  lg: "h-32 sm:h-40 md:h-48",
  full: "h-full min-h-[200px]",
};

export default function DecorativeFiller({
  variant = "gradient",
  className = "",
  height = "md",
}: DecorativeFillerProps) {
  if (variant === "gradient") {
    return (
      <div className={`relative overflow-hidden ${heightVariants[height]} ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-green-500/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-shimmer" />
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-blue-400/20 to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-purple-400/20 to-transparent" />
      </div>
    );
  }

  if (variant === "particles") {
    return (
      <div className={`relative overflow-hidden ${heightVariants[height]} ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-800/30 dark:to-blue-900/20" />
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30 animate-pulse-glow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "waves") {
    return (
      <div className={`relative overflow-hidden ${heightVariants[height]} ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-transparent dark:from-blue-900/10" />
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute h-8 w-[200%] bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-blue-400/10 rounded-full blur-sm"
            style={{
              bottom: `${i * 20}%`,
              left: 0,
              animation: `wave ${8 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className={`relative overflow-hidden ${heightVariants[height]} ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-green-50/30 dark:from-gray-800/20 dark:to-green-900/10" />
        <div 
          className="absolute inset-0 opacity-20 dark:opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59,130,246,0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59,130,246,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute inset-0 animate-shimmer">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" 
               style={{ backgroundSize: '200% 100%' }} />
        </div>
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={`relative overflow-hidden ${heightVariants[height]} ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-blue-50/30 dark:from-purple-900/10 dark:to-blue-900/10" />
        <div 
          className="absolute inset-0 opacity-30 dark:opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(139,92,246,0.4) 2px, transparent 2px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>
    );
  }

  return null;
}
