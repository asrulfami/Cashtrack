// src/components/TransactionFormModal.tsx
"use client";

import { type FormEvent } from "react";
import { type TransactionType } from "@/types";
import { categories } from "@/data/categories";

export const incomeCategories = categories
  .filter((c) => c.type === "income")
  .map((c) => c.name);
export const expenseCategories = categories
  .filter((c) => c.type === "expense")
  .map((c) => c.name);

export type FormState = {
  id: string | null;
  date: string;
  description: string;
  amount: string;
  type: TransactionType;
  category: string;
};

export type FormErrors = {
  date?: string;
  description?: string;
  amount?: string;
  category?: string;
};

export const initialFormState: FormState = {
  id: null,
  date: new Date().toISOString().slice(0, 10),
  description: "",
  amount: "",
  type: "expense",
  category: expenseCategories[0],
};

export default function TransactionFormModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  errors,
  isSubmitting = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  errors: FormErrors;
  isSubmitting?: boolean;
}) {
  if (!isOpen) return null;

  const title = form.id ? "✏️ Edit Transaksi" : "➕ Tambah Transaksi";

  const handleTypeChange = (type: TransactionType) => {
    setForm((prevForm) => ({
      ...prevForm,
      type,
      category:
        type === "income" ? incomeCategories[0] : expenseCategories[0],
    }));
  };

  const currentCategories =
    form.type === "income" ? incomeCategories : expenseCategories;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-4 sm:p-6 w-full max-w-lg border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-gray-200">
          {title}
        </h2>
        <form onSubmit={onSubmit} className="space-y-3 sm:space-y-5">
          {/* Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipe
            </label>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 dark:bg-gray-700 p-1">
              <button
                type="button"
                onClick={() => handleTypeChange("expense")}
                className={`px-3 sm:px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  form.type === "expense"
                    ? "bg-white dark:bg-gray-900 text-red-600 dark:text-red-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                💸 Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("income")}
                className={`px-3 sm:px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  form.type === "income"
                    ? "bg-white dark:bg-gray-900 text-green-600 dark:text-green-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                💰 Pemasukan
              </button>
            </div>
          </div>

          {/* Date & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                📅 Tanggal
              </label>
              <input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="input-field"
              />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1">{errors.date}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                💵 Jumlah (Rp)
              </label>
              <input
                id="amount"
                type="number"
                placeholder="0"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="input-field"
              />
              {errors.amount && (
                <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              📝 Deskripsi
            </label>
            <input
              id="description"
              type="text"
              placeholder="Contoh: Bayar tagihan listrik"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="input-field"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              📁 Kategori
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input-field"
            >
              {currentCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>{form.id ? "💾 Simpan Perubahan" : "➕ Tambah"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
