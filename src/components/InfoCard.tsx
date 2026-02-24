"use client";

import { Info, Lightbulb, TrendingUp, Shield, Target, Zap } from "lucide-react";

interface InfoCardProps {
  type?: "tip" | "info" | "insight" | "security" | "goal" | "quick";
  title?: string;
  content: string;
  className?: string;
}

const iconMap = {
  tip: Lightbulb,
  info: Info,
  insight: TrendingUp,
  security: Shield,
  goal: Target,
  quick: Zap,
};

const colorMap = {
  tip: "from-yellow-500/20 via-orange-500/10 to-transparent dark:from-yellow-500/30 dark:via-orange-500/20",
  info: "from-blue-500/20 via-cyan-500/10 to-transparent dark:from-blue-500/30 dark:via-cyan-500/20",
  insight: "from-green-500/20 via-emerald-500/10 to-transparent dark:from-green-500/30 dark:via-emerald-500/20",
  security: "from-purple-500/20 via-violet-500/10 to-transparent dark:from-purple-500/30 dark:via-violet-500/20",
  goal: "from-pink-500/20 via-rose-500/10 to-transparent dark:from-pink-500/30 dark:via-rose-500/20",
  quick: "from-indigo-500/20 via-blue-500/10 to-transparent dark:from-indigo-500/30 dark:via-blue-500/20",
};

const titleMap = {
  tip: "💡 Tips",
  info: "ℹ️ Info",
  insight: "📊 Insight",
  security: "🔒 Keamanan",
  goal: "🎯 Tujuan",
  quick: "⚡ Cepat",
};

export default function InfoCard({
  type = "info",
  title,
  content,
  className = "",
}: InfoCardProps) {
  const Icon = iconMap[type];

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-4 sm:p-5
        bg-gradient-to-br ${colorMap[type]}
        backdrop-blur-xl
        border border-white/30 dark:border-white/10
        shadow-lg hover:shadow-xl
        transition-all duration-300 hover:-translate-y-0.5
        group
        ${className}
      `}
    >
      {/* Animated background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-8 -right-8 w-20 h-20 bg-white/5 dark:bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
      <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-white/5 dark:bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

      {/* Content */}
      <div className="relative z-10 flex items-start gap-3">
        <div className="flex-shrink-0 p-2 rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-200" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            {title || titleMap[type]}
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {content}
          </p>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}
