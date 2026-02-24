import DynamicValue from "./DynamicValue";

export default function StatCard({
  title,
  value,
  icon,
  trend,
  className = "",
}: {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}) {
  // Parse numeric value from formatted string or use number directly
  const numericValue = typeof value === 'number' 
    ? value 
    : parseFloat(value.replace(/[^0-9-]/g, '')) || 0;

  return (
    <div className={`card-hover card p-4 sm:p-5 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 line-clamp-2 leading-tight">{title}</div>
        {icon && <div className="text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2">{icon}</div>}
      </div>
      <div className="mt-2 min-h-[2.5rem] flex items-end">
        <DynamicValue 
          value={numericValue} 
          formatCurrency={true}
          compact={true}
        />
      </div>
      {trend && (
        <div className={`mt-2 text-xs sm:text-sm font-medium ${trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
          {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
        </div>
      )}
    </div>
  );
}
