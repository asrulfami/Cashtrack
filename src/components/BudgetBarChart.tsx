"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import formatCurrency from "@/lib/formatCurrency";
import { getCategoryColor } from "@/context/DashboardContext";
import { useDarkMode } from "@/hooks/useDarkMode";

interface BudgetBarChartProps {
  data: Array<{
    category: string;
    budget: number;
    actual: number;
  }>;
  onCategoryClick?: (category: string | null) => void;
  selectedCategory?: string | null;
  interactive?: boolean;
}

export default function BudgetBarChart({
  data,
  onCategoryClick,
  selectedCategory,
  interactive = true
}: BudgetBarChartProps) {
  const { isDark } = useDarkMode();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const categoryData = payload[0].payload;
      const budget = categoryData.budget;
      const actual = categoryData.actual;
      const percentage = budget > 0 ? (actual / budget) * 100 : 0;
      const isOverBudget = actual > budget;
      const remaining = budget - actual;

      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-bold text-gray-800 dark:text-gray-200 mb-3">
            {categoryData.category}
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Budget:</span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {formatCurrency(budget)}
              </span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Realisasi:</span>
              <span className={`text-sm font-semibold ${isOverBudget ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                {formatCurrency(actual)}
              </span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sisa:</span>
              <span className={`text-sm font-bold ${remaining >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {formatCurrency(Math.abs(remaining))}
              </span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">Penggunaan:</span>
                <span className={`text-xs font-bold ${percentage > 100 ? "text-red-600" : percentage > 80 ? "text-yellow-600" : "text-green-600"}`}>
                  {percentage.toFixed(1)}%
                </span>
              </div>
              <div className="mt-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${isOverBudget ? "bg-red-500" : percentage > 80 ? "bg-yellow-500" : "bg-green-500"}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getOpacity = (category: string) => {
    if (!selectedCategory) return 1;
    return category === selectedCategory ? 1 : 0.3;
  };

  const handleLegendClick = (data: any) => {
    if (!interactive || !onCategoryClick || !data.value) return;
    // Toggle category filter on legend click
    onCategoryClick(selectedCategory === data.value ? null : data.value);
  };

  const handleBarClick = (data: any) => {
    if (!interactive || !onCategoryClick) return;
    onCategoryClick(selectedCategory === data.category ? null : data.category);
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} opacity={0.3} />
        <XAxis
          dataKey="category"
          stroke={isDark ? "#9ca3af" : "#6b7280"}
          angle={-45}
          textAnchor="end"
          interval={0}
          height={80}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          stroke={isDark ? "#9ca3af" : "#6b7280"}
          tickFormatter={(value) => `Rp${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={10}
          onClick={handleLegendClick}
          wrapperStyle={{
            cursor: interactive && onCategoryClick ? "pointer" : "default"
          }}
        />
        {/* Budget Bar */}
        <Bar
          dataKey="budget"
          name="Budget"
          radius={[4, 4, 0, 0]}
          onClick={handleBarClick}
          style={{
            transition: "opacity 0.3s ease",
            cursor: interactive && onCategoryClick ? "pointer" : "default",
          }}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-budget-${index}`}
              fill="#3B82F6"
              opacity={getOpacity(entry.category)}
            />
          ))}
        </Bar>
        {/* Actual Bar */}
        <Bar
          dataKey="actual"
          name="Realisasi"
          radius={[4, 4, 0, 0]}
          onClick={handleBarClick}
          style={{
            transition: "opacity 0.3s ease",
            cursor: interactive && onCategoryClick ? "pointer" : "default",
          }}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-actual-${index}`}
              fill={getCategoryColor(entry.category)}
              opacity={getOpacity(entry.category)}
            />
          ))}
        </Bar>
        {/* Reference line showing 100% budget usage */}
        <ReferenceLine
          y={Math.max(...data.map(d => d.budget))}
          stroke={isDark ? "#9CA3AF" : "#9CA3AF"}
          strokeDasharray="3 3"
          label={{
            value: "Target Budget",
            position: "top",
            fill: isDark ? "#9CA3AF" : "#9CA3AF",
            fontSize: 10
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
