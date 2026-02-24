"use client";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import formatCurrency from "@/lib/formatCurrency";
import { useDarkMode } from "@/hooks/useDarkMode";

export type ChartData = {
  month: string;
  income: number;
  expense: number;
};

type CashFlowChartProps = {
  data: ChartData[];
  highlight?: "income" | "expense" | null;
  onLineClick?: (type: "income" | "expense" | null) => void;
  interactive?: boolean;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: any[];
  label?: string;
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  const { isDark } = useDarkMode();

  if (active && payload && payload.length) {
    const income = payload.find((p) => p.dataKey === "income")?.value || 0;
    const expense = payload.find((p) => p.dataKey === "expense")?.value || 0;
    const balance = income - expense;

    return (
      <div className={`
        relative overflow-hidden
        p-4 rounded-2xl shadow-2xl border backdrop-blur-xl
        ${isDark 
          ? "bg-gray-800/90 border-gray-700 text-white" 
          : "bg-white/90 border-gray-200 text-gray-900"
        }
      `}>
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-red-500 to-blue-500" />
        
        <p className="font-bold text-sm mb-3 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {label}
        </p>
        
        <div className="space-y-2">
          {/* Income */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/30">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg"></div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Pemasukan:</span>
            <span className="text-sm font-bold text-green-600 dark:text-green-400 ml-auto">
              {formatCurrency(income)}
            </span>
          </div>
          
          {/* Expense */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/30">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg"></div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Pengeluaran:</span>
            <span className="text-sm font-bold text-red-600 dark:text-red-400 ml-auto">
              {formatCurrency(expense)}
            </span>
          </div>
          
          {/* Balance */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 shadow-lg"></div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Saldo:</span>
            <span className={`text-sm font-bold ml-auto ${
              balance >= 0 
                ? "text-blue-600 dark:text-blue-400 neon-glow" 
                : "text-orange-600 dark:text-orange-400"
            }`}>
              {formatCurrency(balance)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default function CashFlowChart({
  data,
  highlight,
  onLineClick,
  interactive = true
}: CashFlowChartProps) {
  const { isDark, textColor, gridColor, axisColor } = useDarkMode();

  const getLineOpacity = (type: "income" | "expense") => {
    if (!highlight) return 1;
    return highlight === type ? 1 : 0.3;
  };

  const getStrokeWidth = (type: "income" | "expense") => {
    if (!highlight) return 3;
    return highlight === type ? 4 : 2;
  };

  const handleLineClick = (type: "income" | "expense") => {
    if (!interactive || !onLineClick) return;
    onLineClick(highlight === type ? null : type);
  };

  return (
    <div className="w-full h-full">
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[320px] w-full text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>Data tidak tersedia untuk menampilkan chart.</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="month"
              tick={{ fill: textColor, fontSize: 12 }}
              axisLine={{ stroke: axisColor }}
              tickLine={{ stroke: axisColor }}
            />
            <YAxis
              tick={{ fill: textColor, fontSize: 12 }}
              axisLine={{ stroke: axisColor }}
              tickLine={{ stroke: axisColor }}
              tickFormatter={(value) =>
                new Intl.NumberFormat("id-ID", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(value as number)
              }
            />
            <Tooltip
              content={<CustomTooltip />}
              wrapperStyle={{ outline: "none" }}
            />
            <Legend
              iconType="circle"
              iconSize={10}
              onClick={(data: any) => {
                if (interactive && onLineClick) {
                  const type = data.value === "Pemasukan" ? "income" : "expense";
                  handleLineClick(type);
                }
              }}
              wrapperStyle={{
                cursor: interactive && onLineClick ? "pointer" : "default"
              }}
            />
            {/* Area fills */}
            <Area
              type="monotone"
              dataKey="income"
              stroke="none"
              fill="url(#incomeGradient)"
              opacity={getLineOpacity("income")}
              style={{ transition: "opacity 0.3s ease" }}
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="none"
              fill="url(#expenseGradient)"
              opacity={getLineOpacity("expense")}
              style={{ transition: "opacity 0.3s ease" }}
            />
            {/* Lines */}
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={getStrokeWidth("income")}
              name="Pemasukan"
              opacity={getLineOpacity("income")}
              dot={{ r: 5, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 8, strokeWidth: 0, fill: "#10b981" }}
              style={{
                transition: "opacity 0.3s ease, stroke-width 0.3s ease",
                cursor: interactive && onLineClick ? "pointer" : "default"
              }}
              onClick={() => handleLineClick("income")}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              strokeWidth={getStrokeWidth("expense")}
              name="Pengeluaran"
              opacity={getLineOpacity("expense")}
              dot={{ r: 5, fill: "#ef4444", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 8, strokeWidth: 0, fill: "#ef4444" }}
              style={{
                transition: "opacity 0.3s ease, stroke-width 0.3s ease",
                cursor: interactive && onLineClick ? "pointer" : "default"
              }}
              onClick={() => handleLineClick("expense")}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
      {interactive && onLineClick && (
        <div className="text-center mt-2 text-xs text-gray-500 dark:text-gray-400">
          💡 Klik pada garis atau legenda untuk highlight
          {highlight && (
            <button
              onClick={() => onLineClick(null)}
              className="ml-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Hapus highlight
            </button>
          )}
        </div>
      )}
    </div>
  );
}
