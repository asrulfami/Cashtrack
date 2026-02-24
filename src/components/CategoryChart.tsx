"use client";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import formatCurrency from "@/lib/formatCurrency";
import { getCategoryColor } from "@/context/DashboardContext";
import { useDarkMode } from "@/hooks/useDarkMode";

export type CategoryChartData = {
  name: string;
  value: number;
  percent?: string;
};

type CategoryChartProps = {
  data: CategoryChartData[];
  onCategoryClick?: (category: string | null) => void;
  selectedCategory?: string | null;
  interactive?: boolean;
};

type RechartsPayloadItem = {
  name?: string;
  value?: number;
  payload?: {
    percent?: number | string;
  };
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: RechartsPayloadItem[];
};

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  const { isDark } = useDarkMode();

  if (active && payload && payload.length) {
    const data = payload[0];
    const percent = data.payload?.percent;
    const color = getCategoryColor(data.name as string);
    
    return (
      <div className={`
        relative overflow-hidden
        p-4 rounded-2xl shadow-2xl border backdrop-blur-xl
        ${isDark 
          ? "bg-gray-800/90 border-gray-700 text-white" 
          : "bg-white/90 border-gray-200 text-gray-900"
        }
      `}>
        {/* Decorative element */}
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: color }}
        />
        
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="w-4 h-4 rounded-full shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${color}, ${color}dd)`,
              boxShadow: `0 0 10px ${color}80`
            }}
          />
          <p className="font-bold text-base">{data.name}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <span className="text-xs text-gray-600 dark:text-gray-400">Total:</span>
            <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {formatCurrency(data.value as number)}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30">
            <span className="text-xs text-gray-600 dark:text-gray-400">Persentase:</span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {percent}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default function CategoryChart({
  data,
  onCategoryClick,
  selectedCategory,
  interactive = true
}: CategoryChartProps) {
  const { isDark, textColor } = useDarkMode();

  const handleSliceClick = (clickedData: any) => {
    if (!interactive || !onCategoryClick) return;

    if (clickedData && clickedData.name) {
      if (selectedCategory === clickedData.name) {
        onCategoryClick(null);
      } else {
        onCategoryClick(clickedData.name);
      }
    }
  };

  const getOpacity = (category: string) => {
    if (!selectedCategory) return 1;
    return category === selectedCategory ? 1 : 0.3;
  };

  const getScale = (category: string) => {
    if (!selectedCategory) return 1;
    return category === selectedCategory ? 1.05 : 1;
  };

  return (
    <div className="w-full h-full">
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[320px] w-full text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-2">🥧</div>
            <p>Tidak ada data pengeluaran untuk ditampilkan.</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={100}
              paddingAngle={2}
              labelLine={false}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              legendType="circle"
              onClick={handleSliceClick}
              style={{
                cursor: interactive && onCategoryClick ? "pointer" : "default",
                outline: "none"
              }}
            >
              {data.map((entry, index) => {
                const color = getCategoryColor(entry.name);
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={color}
                    opacity={getOpacity(entry.name)}
                    style={{
                      transition: "all 0.3s ease",
                      transform: `scale(${getScale(entry.name)})`,
                      transformOrigin: "center"
                    }}
                  />
                );
              })}
            </Pie>
            <Tooltip
              content={<CustomTooltip />}
              wrapperStyle={{ outline: "none" }}
            />
            <Legend
              iconSize={10}
              wrapperStyle={{
                paddingTop: "20px",
                color: textColor
              }}
              onClick={(data: any) => {
                if (interactive && onCategoryClick && data.value) {
                  onCategoryClick(selectedCategory === data.value ? null : data.value);
                }
              }}
              style={{
                cursor: interactive && onCategoryClick ? "pointer" : "default"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
      {interactive && onCategoryClick && (
        <div className="text-center mt-2 text-xs text-gray-500 dark:text-gray-400">
          💡 Klik pada kategori untuk filter
          {selectedCategory && (
            <button
              onClick={() => onCategoryClick(null)}
              className="ml-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Hapus filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
