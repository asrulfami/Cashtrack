"use client";

import { useDashboard } from "@/context/DashboardContext";
import { useMemo } from "react";
import { getCategoryColor } from "@/context/DashboardContext";
import { Filter, X, Calendar, Tag, Type } from "lucide-react";

const TIME_RANGES: { value: "7d" | "30d" | "90d" | "1y" | "all"; label: string; icon: string }[] = [
  { value: "7d", label: "7H", icon: "📅" },
  { value: "30d", label: "30H", icon: "📅" },
  { value: "90d", label: "90H", icon: "📅" },
  { value: "1y", label: "1T", icon: "📆" },
  { value: "all", label: "∞", icon: "🗓️" },
];

export default function EnhancedDashboardFilters() {
  const {
    filters,
    setTimeRange,
    setTransactionType,
    toggleCategory,
    clearFilters,
    selectedCategory,
    setSelectedCategory,
    categoryData,
  } = useDashboard();

  const categories = useMemo(() => {
    return categoryData.map((c) => c.name).sort();
  }, [categoryData]);

  const hasActiveFilters =
    filters.timeRange !== "30d" ||
    filters.transactionType !== "all" ||
    filters.selectedCategories.length > 0 ||
    selectedCategory !== null;

  return (
    <div className="
      relative overflow-hidden rounded-2xl p-6
      glass-card
      border border-white/30 dark:border-white/10
      shadow-xl
      animate-slide-up
    ">
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 opacity-50 blur-xl" />
      
      {/* Header */}
      <div className="relative flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Filter Interaktif
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Klik grafik atau gunakan filter di bawah
            </p>
          </div>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="
              flex items-center gap-2 px-4 py-2
              bg-gradient-to-r from-red-500 to-red-600
              hover:from-red-600 hover:to-red-700
              text-white text-sm font-semibold
              rounded-xl shadow-lg
              transform transition-all duration-300
              hover:scale-105 hover:shadow-red-500/30
              active:scale-95
            "
          >
            <X className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      {/* Time Range */}
      <div className="relative mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
            Rentang Waktu
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          {TIME_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`
                relative overflow-hidden px-4 py-2.5 rounded-xl text-sm font-bold
                transition-all duration-300 transform
                ${
                  filters.timeRange === range.value
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40 scale-105"
                    : "bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:scale-105"
                }
              `}
            >
              <span className="relative z-10">{range.label}</span>
              {filters.timeRange === range.value && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Type */}
      <div className="relative mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Type className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
            Tipe Transaksi
          </label>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTransactionType("all")}
            className={`
              px-4 py-2.5 rounded-xl text-sm font-bold
              transition-all duration-300 transform hover:scale-105
              ${
                filters.transactionType === "all"
                  ? "bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white text-white dark:text-gray-900 shadow-lg"
                  : "bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80"
              }
            `}
          >
            Semua
          </button>
          <button
            onClick={() => setTransactionType("income")}
            className={`
              px-4 py-2.5 rounded-xl text-sm font-bold
              transition-all duration-300 transform hover:scale-105
              ${
                filters.transactionType === "income"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/40"
                  : "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50"
              }
            `}
          >
            💚 Pemasukan
          </button>
          <button
            onClick={() => setTransactionType("expense")}
            className={`
              px-4 py-2.5 rounded-xl text-sm font-bold
              transition-all duration-300 transform hover:scale-105
              ${
                filters.transactionType === "expense"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/40"
                  : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"
              }
            `}
          >
            ❤️ Pengeluaran
          </button>
        </div>
      </div>

      {/* Category Filters */}
      {categories.length > 0 && (
        <div className="relative mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
              Filter Kategori
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isSelected = filters.selectedCategories.includes(category);
              const color = getCategoryColor(category);
              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`
                    px-4 py-2 rounded-full text-xs font-bold
                    transition-all duration-300 transform hover:scale-105
                    border-2
                    ${
                      isSelected
                        ? "text-white shadow-lg"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                    }
                  `}
                  style={{
                    backgroundColor: isSelected ? color : "transparent",
                    borderColor: isSelected ? color : undefined,
                  }}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Category Display */}
      {selectedCategory && (
        <div className="
          relative flex items-center gap-3 p-4
          bg-gradient-to-r from-blue-500/10 to-purple-500/10
          dark:from-blue-600/20 dark:to-purple-600/20
          border border-blue-300 dark:border-blue-600
          rounded-xl
          animate-slide-up
        ">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            🎯 Kategori dipilih:
          </span>
          <span
            className="px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg"
            style={{ backgroundColor: getCategoryColor(selectedCategory) }}
          >
            {selectedCategory}
          </span>
          <button
            onClick={() => setSelectedCategory(null)}
            className="
              ml-auto p-2 rounded-lg
              bg-blue-100 dark:bg-blue-900/50
              text-blue-600 dark:text-blue-400
              hover:bg-blue-200 dark:hover:bg-blue-900
              transition-colors duration-200
              font-bold text-sm
            "
          >
            ✕ Hapus
          </button>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="
          relative mt-6 pt-4
          border-t border-gray-200 dark:border-gray-700
          animate-fade-in
        ">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span>📊 Filter aktif:</span>
            <div className="flex flex-wrap gap-1.5">
              {filters.timeRange !== "30d" && (
                <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold shadow-sm">
                  {TIME_RANGES.find((r) => r.value === filters.timeRange)?.label}
                </span>
              )}
              {filters.transactionType !== "all" && (
                <span className={`px-3 py-1 rounded-full font-semibold shadow-sm ${
                  filters.transactionType === "income"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                    : "bg-gradient-to-r from-red-500 to-red-600 text-white"
                }`}>
                  {filters.transactionType === "income" ? "Pemasukan" : "Pengeluaran"}
                </span>
              )}
              {selectedCategory && (
                <span
                  className="px-3 py-1 text-white rounded-full font-semibold shadow-sm"
                  style={{ backgroundColor: getCategoryColor(selectedCategory) }}
                >
                  {selectedCategory}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
