"use client";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  decorative?: boolean;
}

export default function EmptyState({
  icon = "📭",
  title,
  description,
  action,
  decorative = true,
}: EmptyStateProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-8 sm:p-12 text-center">
      {/* Animated decorative background */}
      {decorative && (
        <>
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 dark:from-gray-800/50 dark:via-blue-900/20 dark:to-purple-900/20" />
          
          {/* Animated blobs */}
          <div className="absolute top-10 left-10 w-32 h-32 sm:w-40 sm:h-40 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-10 right-10 w-24 h-24 sm:w-32 sm:h-32 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-float-medium" />
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-green-400/20 dark:bg-green-500/10 rounded-full blur-3xl animate-float-fast" />
          
          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-40 animate-pulse-glow"
                style={{
                  left: `${10 + i * 15}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
          
          {/* Decorative circles */}
          <div className="absolute top-20 right-20 w-16 h-16 border-2 border-blue-300/30 dark:border-blue-500/20 rounded-full animate-rotate" />
          <div className="absolute bottom-16 left-16 w-12 h-12 border-2 border-purple-300/30 dark:border-purple-500/20 rounded-full animate-wiggle" />
          <div className="absolute top-1/2 right-1/4 w-8 h-8 border-2 border-green-300/30 dark:border-green-500/20 rounded-full animate-bounce-in" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 animate-slide-up">
        {/* Icon with animation */}
        <div className="inline-block mb-6 animate-bounce-subtle">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 blur-xl opacity-50 animate-pulse" />
            <div className="relative text-5xl sm:text-6xl md:text-7xl">
              {icon}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {description}
          </p>
        )}

        {/* Action */}
        {action && (
          <div className="flex justify-center gap-3 flex-wrap">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
