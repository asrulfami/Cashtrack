"use client";

import { type FormEvent } from "react";
import { type Budget, type BudgetPeriod } from "@/types";
import { type Category } from "@/app/settings/page";

export type BudgetFormState = {
  id?: string;
  categoryId: string;
  amount: string;
  period: BudgetPeriod;
};

export const initialBudgetFormState: BudgetFormState = {
  categoryId: "",
  amount: "",
  period: "monthly",
};

export default function BudgetFormModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  categories,
  isSubmitting = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  form: BudgetFormState;
  setForm: React.Dispatch<React.SetStateAction<BudgetFormState>>;
  categories: Category[];
  isSubmitting?: boolean;
}) {
  if (!isOpen) return null;

  const title = form.id ? "✏️ Edit Budget" : "➕ Tambah Budget";
  const expenseCategories = categories.filter((c) => c.type === "expense");

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-4 sm:p-6 w-full max-w-lg border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-gray-200">
          {title}
        </h2>
        <form onSubmit={onSubmit} className="space-y-3 sm:space-y-5">
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
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="input-field"
              disabled={isSubmitting}
            >
              <option value="">Semua Kategori (Total Budget)</option>
              {expenseCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount & Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                💵 Jumlah Budget (Rp)
              </label>
              <input
                id="amount"
                type="number"
                placeholder="0"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="input-field"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label
                htmlFor="period"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                📅 Periode
              </label>
              <select
                id="period"
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value as BudgetPeriod })}
                className="input-field"
                disabled={isSubmitting}
              >
                <option value="monthly">Bulanan</option>
                <option value="quarterly">Triwulan</option>
                <option value="yearly">Tahunan</option>
              </select>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>Tip:</strong> Budget membantu Anda mengontrol pengeluaran per kategori.
              Jika tidak memilih kategori, budget akan berlaku untuk total pengeluaran.
            </p>
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
                <>{form.id ? "💾 Simpan Perubahan" : "➕ Tambah Budget"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
