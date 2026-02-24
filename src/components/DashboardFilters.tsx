"use client";

import { useDashboard } from "@/context/DashboardContext";
import { useMemo } from "react";
import { getCategoryColor } from "@/context/DashboardContext";

const TIME_RANGES: { value: "7d" | "30d" | "90d" | "1y" | "all"; label: string }[] = [
  { value: "7d", label: "7 Hari" },
  { value: "30d", label: "30 Hari" },
  { value: "90d", label: "90 Hari" },
  { value: "1y", label: "1 Tahun" },
  { value: "all", label: "Semua" },
];

export default function DashboardFilters() {
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

  // Get unique categories from data
  const categories = useMemo(() => {
    return categoryData.map((c) => c.name).sort();
  }, [categoryData]);

  const hasActiveFilters =
    filters.timeRange !== "30d" ||
    filters.transactionType !== "all" ||
    filters.selectedCategories.length > 0 ||
    selectedCategory !== null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔍</span>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Filter Interaktif
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Klik pada grafik atau gunakan filter di bawah
            </p>
          </div>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-medium"
          >
            🔄 Reset Filter
          </button>
        )}
      </div>

      {/* Time Range Buttons */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Rentang Waktu
        </label>
        <div className="flex flex-wrap gap-2">
          {TIME_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filters.timeRange === range.value
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/30 scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Type Filter */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Tipe Transaksi
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setTransactionType("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filters.transactionType === "all"
                ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 shadow-md"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setTransactionType("income")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filters.transactionType === "income"
                ? "bg-green-500 text-white shadow-md shadow-green-500/30"
                : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
            }`}
          >
            💚 Pemasukan
          </button>
          <button
            onClick={() => setTransactionType("expense")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filters.transactionType === "expense"
                ? "bg-red-500 text-white shadow-md shadow-red-500/30"
                : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
            }`}
          >
            ❤️ Pengeluaran
          </button>
        </div>
      </div>

      {/* Category Quick Filters */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Filter Kategori (Klik untuk toggle)
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isSelected = filters.selectedCategories.includes(category);
              const color = getCategoryColor(category);
              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border-2 ${
                    isSelected
                      ? "border-transparent text-white shadow-md scale-105"
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: isSelected ? color : "transparent",
                  }}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Category Highlight */}
      {selectedCategory && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <span className="text-sm text-blue-700 dark:text-blue-300">
            🎯 Kategori dipilih:
          </span>
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: getCategoryColor(selectedCategory) }}
          >
            {selectedCategory}
          </span>
          <button
            onClick={() => setSelectedCategory(null)}
            className="ml-auto text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium"
          >
            ✕ Hapus
          </button>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>📊 Filter aktif:</span>
            <div className="flex flex-wrap gap-1">
              {filters.timeRange !== "30d" && (
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                  {TIME_RANGES.find((r) => r.value === filters.timeRange)?.label}
                </span>
              )}
              {filters.transactionType !== "all" && (
                <span className={`px-2 py-0.5 rounded ${
                  filters.transactionType === "income"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                }`}>
                  {filters.transactionType === "income" ? "Pemasukan" : "Pengeluaran"}
                </span>
              )}
              {selectedCategory && (
                <span
                  className="px-2 py-0.5 text-white rounded"
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
