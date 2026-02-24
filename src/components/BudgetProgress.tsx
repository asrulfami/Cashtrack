"use client";

import formatCurrency from "@/lib/formatCurrency";

interface BudgetProgressProps {
  category?: string | null;
  budgetAmount: number;
  actualAmount: number;
  period?: string;
}

export default function BudgetProgress({
  category,
  budgetAmount,
  actualAmount,
  period = "bulan ini",
}: BudgetProgressProps) {
  const percentage = Math.min((actualAmount / budgetAmount) * 100, 100);
  const isOverBudget = actualAmount > budgetAmount;
  const remaining = budgetAmount - actualAmount;

  const getColorClass = () => {
    if (isOverBudget) return "bg-red-500";
    if (percentage > 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getBgColorClass = () => {
    if (isOverBudget) return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700";
    if (percentage > 80) return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700";
    return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700";
  };

  return (
    <div className={`p-3 sm:p-4 rounded-xl border ${getBgColorClass()} transition-all duration-200`}>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-200 truncate">
            {category || "Total Budget"}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {period}
          </p>
        </div>
        <div className="text-right min-w-[120px]">
          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
            {isOverBudget ? "Melewati Budget!" : remaining >= 0 ? "Sisa Budget" : "Over"}
          </p>
          <p className={`text-base sm:text-lg font-bold ${isOverBudget ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
            {formatCurrency(Math.abs(remaining))}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2.5 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
        <div
          className={`absolute left-0 top-0 h-full ${getColorClass()} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Stats */}
      <div className="flex flex-wrap justify-between gap-2 text-xs text-gray-600 dark:text-gray-400">
        <span className="truncate">Budget: {formatCurrency(budgetAmount)}</span>
        <span className="truncate">Realisasi: {formatCurrency(actualAmount)}</span>
        <span className="font-semibold min-w-[40px] text-right">{percentage.toFixed(0)}%</span>
      </div>

      {isOverBudget && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">
          ⚠️ Budget telah terlampaui sebesar {formatCurrency(actualAmount - budgetAmount)}!
        </p>
      )}
    </div>
  );
}
