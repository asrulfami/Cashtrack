"use client";

import React, { createContext, useState, useContext, useEffect, type ReactNode } from "react";
import { useTransactions } from "@/context/TransactionContext";
import { useAssets } from "@/context/AssetContext";
import { useInvestments } from "@/context/InvestmentContext";
import { useBudgets } from "@/context/BudgetContext";
import { type Transaction } from "@/types";

export type ChartData = {
  month: string;
  income: number;
  expense: number;
};

export type CategoryChartData = {
  name: string;
  value: number;
  percent?: string;
};

export type BudgetVsActualData = {
  category: string;
  budget: number;
  actual: number;
};

export type TimeRange = "7d" | "30d" | "90d" | "1y" | "all";
export type TransactionFilterType = "all" | "income" | "expense";

interface DashboardFilters {
  timeRange: TimeRange;
  transactionType: TransactionFilterType;
  selectedCategories: string[];
  startDate: Date | null;
  endDate: Date | null;
}

interface DashboardContextType {
  // Filters
  filters: DashboardFilters;
  setFilters: React.Dispatch<React.SetStateAction<DashboardFilters>>;
  
  // Filter actions
  setTimeRange: (range: TimeRange) => void;
  setTransactionType: (type: TransactionFilterType) => void;
  toggleCategory: (category: string) => void;
  clearFilters: () => void;
  setCustomDateRange: (start: Date | null, end: Date | null) => void;
  
  // Selected state for cross-highlighting
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  
  // Computed data (filtered based on current filters)
  filteredTransactions: Transaction[];
  chartData: ChartData[];
  categoryData: CategoryChartData[];
  budgetVsActualData: BudgetVsActualData[];
  assetDistributionData: CategoryChartData[];
  investmentDistributionData: CategoryChartData[];
  
  // Summary stats
  totalBalance: number;
  incomeThisPeriod: number;
  expenseThisPeriod: number;
  totalAssets: number;
  totalInvestments: number;
  
  // Loading states
  loading: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const CATEGORY_COLORS: Record<string, string> = {
  "Makanan": "#3b82f6",
  "Transportasi": "#ef4444",
  "Belanja": "#f97316",
  "Hiburan": "#8b5cf6",
  "Kesehatan": "#14b8a6",
  "Pendidikan": "#d946ef",
  "Tagihan": "#84cc16",
  "Gaji": "#06b6d4",
  "Investasi": "#eab308",
  "Lainnya": "#ec4899",
};

export const getCategoryColor = (category: string): string => {
  return CATEGORY_COLORS[category] || `hsl(${Math.abs(category.length * 37) % 360}, 70%, 50%)`;
};

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { assets } = useAssets();
  const { investments } = useInvestments();
  const { budgets } = useBudgets();

  const [filters, setFilters] = useState<DashboardFilters>({
    timeRange: "30d",
    transactionType: "all",
    selectedCategories: [],
    startDate: null,
    endDate: null,
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter transactions based on current filters
  const filteredTransactions = React.useMemo(() => {
    const now = new Date();
    let startDate = new Date();
    
    // Apply time range filter
    switch (filters.timeRange) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case "all":
      default:
        startDate = new Date(0);
        break;
    }

    // Apply custom date range if set
    if (filters.startDate) {
      startDate = filters.startDate;
    }
    const endDate = filters.endDate || now;

    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      
      // Date range filter
      if (tDate < startDate || tDate > endDate) return false;
      
      // Transaction type filter
      if (filters.transactionType !== "all") {
        const isIncome = t.amount > 0;
        if (filters.transactionType === "income" && !isIncome) return false;
        if (filters.transactionType === "expense" && isIncome) return false;
      }
      
      // Category filter
      if (filters.selectedCategories.length > 0) {
        const category = t.category || "Lainnya";
        if (!filters.selectedCategories.includes(category)) return false;
      }
      
      return true;
    });
  }, [transactions, filters]);

  // Compute chart data from filtered transactions
  const chartData = React.useMemo(() => {
    const monthlyData: { [key: string]: ChartData } = {};
    
    filteredTransactions.forEach((t) => {
      const tDate = new Date(t.date);
      const monthKey = tDate.toLocaleString("id-ID", { month: "short", year: "numeric" });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, income: 0, expense: 0 };
      }

      if (t.amount > 0) {
        monthlyData[monthKey].income += t.amount;
      } else {
        monthlyData[monthKey].expense += Math.abs(t.amount);
      }
    });

    const sortedChartData = Object.values(monthlyData).sort((a, b) => {
      const [am, ay] = a.month.split(" ");
      const [bm, by] = b.month.split(" ");
      const monthMap: { [key: string]: number } = { 
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, Mei: 4, Jun: 5, 
        Jul: 6, Agu: 7, Sep: 8, Okt: 9, Nov: 10, Des: 11 
      };
      const aDate = new Date(parseInt(ay), monthMap[am] || 0);
      const bDate = new Date(parseInt(by), monthMap[bm] || 0);
      return aDate.getTime() - bDate.getTime();
    });

    return sortedChartData;
  }, [filteredTransactions]);

  // Compute category data from filtered transactions based on transaction type filter
  const categoryData = React.useMemo(() => {
    const categoryData: { [key: string]: number } = {};

    filteredTransactions.forEach((t) => {
      const isIncome = t.amount > 0;
      const category = t.category || "Lainnya";
      
      // Group by category and transaction type for clear distinction
      const categoryKey = filters.transactionType === "all"
        ? `${category} (${isIncome ? "Pemasukan" : "Pengeluaran"})`
        : category;
      
      categoryData[categoryKey] = (categoryData[categoryKey] || 0) + Math.abs(t.amount);
    });

    const totalValue = Object.values(categoryData).reduce((sum, val) => sum + val, 0);

    return Object.entries(categoryData)
      .map(([name, value]) => ({
        name,
        value,
        percent: totalValue > 0 ? ((value / totalValue) * 100).toFixed(1) : "0",
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions, filters.transactionType]);

  // Compute budget vs actual data
  const budgetVsActualData = React.useMemo(() => {
    const now = new Date();
    
    // Calculate start date based on time range filter
    let startDate = new Date();
    switch (filters.timeRange) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case "all":
      default:
        startDate = new Date(0);
        break;
    }

    // Apply custom date range if set
    if (filters.startDate) {
      startDate = filters.startDate;
    }
    const endDate = filters.endDate || now;

    const actualByCategory: Record<string, number> = {};
    filteredTransactions.forEach((t) => {
      const tDate = new Date(t.date);
      // Use the same date range as the main filter for consistency
      if (tDate >= startDate && tDate <= endDate && t.amount < 0) {
        const category = t.category || "Lainnya";
        actualByCategory[category] = (actualByCategory[category] || 0) + Math.abs(t.amount);
      }
    });

    return budgets.map((budget) => ({
      category: budget.category?.name || "Total",
      budget: budget.amount,
      actual: budget.categoryId
        ? (actualByCategory[budget.category?.name || ""] || 0)
        : Object.values(actualByCategory).reduce((sum, val) => sum + val, 0),
    }));
  }, [budgets, filteredTransactions, filters.timeRange, filters.startDate, filters.endDate]);

  // Compute asset distribution
  const assetDistributionData = React.useMemo(() => {
    const byStatus: Record<string, number> = {};
    assets.forEach((a) => {
      const statusName = a.status === "active" ? "Aktif" : a.status === "inactive" ? "Tidak Aktif" : "Dihapuskan";
      byStatus[statusName] = (byStatus[statusName] || 0) + a.acquisitionValue;
    });
    return Object.entries(byStatus).map(([name, value]) => ({ name, value }));
  }, [assets]);

  // Compute investment distribution
  const investmentDistributionData = React.useMemo(() => {
    const kindLabels: { [key: string]: string } = {
      stock: "Saham",
      bond: "Obligasi",
      deposit: "Deposito",
      mutual_fund: "Reksadana",
      other: "Lainnya",
    };
    const byKind: Record<string, number> = {};
    investments.forEach((i) => {
      const kindName = kindLabels[i.kind];
      const currentValue = i.units * i.currentPrice;
      byKind[kindName] = (byKind[kindName] || 0) + currentValue;
    });
    return Object.entries(byKind).map(([name, value]) => ({ name, value }));
  }, [investments]);

  // Compute summary statistics
  const { totalBalance, incomeThisPeriod, expenseThisPeriod } = React.useMemo(() => {
    const now = new Date();
    let balance = 0;
    let income = 0;
    let expense = 0;

    filteredTransactions.forEach((t) => {
      balance += t.amount;
      if (t.amount > 0) {
        income += t.amount;
      } else {
        expense += Math.abs(t.amount);
      }
    });

    return { totalBalance: balance, incomeThisPeriod: income, expenseThisPeriod: expense };
  }, [filteredTransactions]);

  const totalAssets = React.useMemo(
    () => assets.reduce((sum, a) => sum + a.acquisitionValue, 0),
    [assets]
  );

  const totalInvestments = React.useMemo(
    () => investments.reduce((sum, i) => sum + i.units * i.currentPrice, 0),
    [investments]
  );

  // Filter action handlers
  const setTimeRange = (range: TimeRange) => {
    setFilters((prev) => ({ ...prev, timeRange: range, startDate: null, endDate: null }));
  };

  const setTransactionType = (type: TransactionFilterType) => {
    setFilters((prev) => ({ ...prev, transactionType: type }));
  };

  const toggleCategory = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter((c) => c !== category)
        : [...prev.selectedCategories, category],
    }));
  };

  const clearFilters = () => {
    setFilters({
      timeRange: "30d",
      transactionType: "all",
      selectedCategories: [],
      startDate: null,
      endDate: null,
    });
    setSelectedCategory(null);
  };

  const setCustomDateRange = (start: Date | null, end: Date | null) => {
    setFilters((prev) => ({ ...prev, startDate: start, endDate: end, timeRange: "all" }));
  };

  const value: DashboardContextType = {
    filters,
    setFilters,
    setTimeRange,
    setTransactionType,
    toggleCategory,
    clearFilters,
    setCustomDateRange,
    selectedCategory,
    setSelectedCategory,
    filteredTransactions,
    chartData,
    categoryData,
    budgetVsActualData,
    assetDistributionData,
    investmentDistributionData,
    totalBalance,
    incomeThisPeriod,
    expenseThisPeriod,
    totalAssets,
    totalInvestments,
    loading: transactionsLoading,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
