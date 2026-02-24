// src/lib/formatCurrency.ts

interface FormatOptions {
  compact?: boolean;
  showSymbol?: boolean;
}

const formatCurrency = (value: number, options: FormatOptions = {}): string => {
  const { compact = false, showSymbol = true } = options;
  
  if (compact) {
    // Format compact untuk display di mobile atau space terbatas
    if (value >= 1000000000000) {
      return `${(value / 1000000000000).toFixed(1)}T`;
    }
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}M`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}Jt`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}Rb`;
    }
  }
  
  // Format lengkap dengan simbol currency
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Compact format helper
const formatCompact = (value: number): string => {
  return formatCurrency(value, { compact: true, showSymbol: false });
};

export default formatCurrency;
export { formatCompact };
