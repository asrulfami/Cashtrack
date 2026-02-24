"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import DynamicValue from "./DynamicValue";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    percentage: number;
  };
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const gradientVariants = {
  balance: "from-blue-500/20 via-blue-600/10 to-transparent dark:from-blue-600/30 dark:via-blue-700/20",
  income: "from-green-500/20 via-green-600/10 to-transparent dark:from-green-600/30 dark:via-green-700/20",
  expense: "from-red-500/20 via-red-600/10 to-transparent dark:from-red-600/30 dark:via-red-700/20",
  asset: "from-orange-500/20 via-orange-600/10 to-transparent dark:from-orange-600/30 dark:via-orange-700/20",
  investment: "from-purple-500/20 via-purple-600/10 to-transparent dark:from-purple-600/30 dark:via-purple-700/20",
};

export default function StatCard({
  title,
  value,
  trend,
  icon,
  className = "",
  onClick,
}: StatCardProps) {
  const isPositive = trend && trend.value > 0;
  const isNegative = trend && trend.value < 0;
  const isNeutral = trend && trend.value === 0;

  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6
        bg-gradient-to-br ${gradientVariants[title.toLowerCase().includes('income') ? 'income' :
          title.toLowerCase().includes('expense') || title.toLowerCase().includes('pengeluaran') ? 'expense' :
          title.toLowerCase().includes('aset') || title.toLowerCase().includes('asset') ? 'asset' :
          title.toLowerCase().includes('investasi') || title.toLowerCase().includes('investment') ? 'investment' :
          'balance']}
        backdrop-blur-xl
        border border-white/30 dark:border-white/10
        shadow-xl hover:shadow-2xl
        transition-all duration-300
        hover:-translate-y-1 hover:scale-[1.02]
        group cursor-pointer
        min-h-[120px] sm:min-h-[130px] md:min-h-[140px] lg:min-h-[150px]
        w-full
        ${className}
      `}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>

      {/* Decorative circles dengan animasi */}
      <div className="absolute -top-10 -right-10 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white/5 dark:bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 animate-float-slow" />
      <div className="absolute -bottom-8 -left-8 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/5 dark:bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 animate-float-medium" />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-particle-float"
            style={{
              left: `${20 + i * 30}%`,
              top: `${60 + (i % 2) * 20}%`,
              animationDelay: `${i * 1.5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between gap-2 sm:gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-1.5 sm:gap-2">
          <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 line-clamp-2 leading-tight flex-1">
            {title}
          </span>
          {icon && (
            <div className="p-1.5 sm:p-2 rounded-lg bg-white/20 dark:bg-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              {icon}
            </div>
          )}
        </div>

        {/* Value - Using DynamicValue for automatic font sizing */}
        <div className="flex-1 flex items-end min-h-[2rem] sm:min-h-[2.5rem]">
          <DynamicValue 
            value={value} 
            formatCurrency={true}
            compact={true}
            className="w-full"
          />
        </div>

        {/* Trend */}
        {trend && (
          <div className={`
            flex items-center gap-1.5 text-xs sm:text-sm font-medium mt-1 sm:mt-2
            ${isPositive ? 'text-green-600 dark:text-green-400' : ''}
            ${isNegative ? 'text-red-600 dark:text-red-400' : ''}
            ${isNeutral ? 'text-gray-500 dark:text-gray-400' : ''}
          `}>
            {isPositive && <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />}
            {isNegative && <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />}
            {isNeutral && <Minus className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />}
            <span className="truncate">
              {isPositive && '+'}
              {trend.percentage.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}
