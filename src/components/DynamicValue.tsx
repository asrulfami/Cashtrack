"use client";

import { useMemo } from "react";
import formatCurrency from "@/lib/formatCurrency";

interface DynamicValueProps {
  value: string | number;
  className?: string;
  formatCurrency?: boolean;
  compact?: boolean;
}

/**
 * Component untuk menampilkan nilai dengan font size yang otomatis menyesuaikan panjang nominal
 * - Nominal pendek: font besar
 * - Nominal panjang: font kecil
 * - Responsive untuk mobile dan desktop
 */
export default function DynamicValue({ 
  value, 
  className = "",
  formatCurrency: shouldFormatCurrency = false,
  compact = false,
}: DynamicValueProps) {
  // Hitung panjang karakter untuk menentukan ukuran font
  const valueStr = useMemo(() => {
    if (typeof value === 'number') {
      if (shouldFormatCurrency) {
        if (compact) {
          return formatCurrency(value, { compact: true, showSymbol: false });
        }
        return formatCurrency(value);
      }
      return value.toString();
    }
    return value;
  }, [value, shouldFormatCurrency, compact]);

  // Hitung jumlah digit angka (tanpa simbol currency, koma, minus)
  const digitCount = useMemo(() => {
    const digits = valueStr.replace(/[^0-9]/g, '');
    return digits.length;
  }, [valueStr]);

  // Tentukan ukuran font berdasarkan jumlah digit
  // Mobile-first approach dengan penyesuaian lebih halus
  const sizeClass = useMemo(() => {
    if (digitCount <= 3) {
      // Sangat pendek: 0 - 999
      return 'text-3xl sm:text-4xl md:text-5xl';
    } else if (digitCount <= 6) {
      // Pendek: 1,000 - 999,999 (Ribuan)
      return 'text-2xl sm:text-3xl md:text-4xl';
    } else if (digitCount <= 9) {
      // Sedang: 1Jt - 999Jt (Juta)
      return 'text-xl sm:text-2xl md:text-3xl';
    } else if (digitCount <= 12) {
      // Panjang: 1M - 999M (Miliar)
      return 'text-lg sm:text-xl md:text-2xl';
    } else if (digitCount <= 15) {
      // Sangat panjang: 1T - 999T (Triliun)
      return 'text-base sm:text-lg md:text-xl';
    } else {
      // Ekstrem: > 999T
      return 'text-sm sm:text-base md:text-lg';
    }
  }, [digitCount]);

  return (
    <div 
      className={`
        font-bold 
        bg-gradient-to-r from-gray-900 to-gray-700 
        dark:from-white dark:to-gray-300 
        bg-clip-text text-transparent
        ${sizeClass}
        leading-none
        max-w-full
        tracking-tight
        break-all
        ${className}
      `}
      title={typeof value === 'number' ? value.toLocaleString('id-ID') : value}
    >
      {valueStr}
    </div>
  );
}
