"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Tipe untuk data yang akan ditampilkan di chart
export type ChartData = {
  month: string;
  income: number;
  expense: number;
};

// Tipe untuk props komponen
type CashFlowChartProps = {
  data: ChartData[];
};

export default function CashFlowChart({ data }: CashFlowChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 min-h-[400px] w-full border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Arus Kas Bulanan
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(128, 128, 128, 0.3)"
          />
          <XAxis
            dataKey="month"
            tick={{ fill: "#6b7280" }}
            axisLine={{ stroke: "#4b5563" }}
            tickLine={{ stroke: "#4b5563" }}
          />
          <YAxis
            tick={{ fill: "#6b7280" }}
            axisLine={{ stroke: "#4b5563" }}
            tickLine={{ stroke: "#4b5563" }}
            tickFormatter={(value) =>
              new Intl.NumberFormat("id-ID", {
                notation: "compact",
                compactDisplay: "short",
              }).format(value as number)
            }
          />
          <Tooltip
            cursor={{ fill: "rgba(100, 116, 139, 0.1)" }}
            contentStyle={{
              backgroundColor: "rgba(31, 41, 55, 0.9)",
              borderColor: "#4b5563",
              borderRadius: "0.5rem",
            }}
            labelStyle={{ fontWeight: "bold" }}
          />
          <Legend iconType="circle" iconSize={10} />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#22c55e"
            strokeWidth={2}
            name="Pemasukan"
            dot={{ r: 4, fill: "#22c55e" }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#ef4444"
            strokeWidth={2}
            name="Pengeluaran"
            dot={{ r: 4, fill: "#ef4444" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
