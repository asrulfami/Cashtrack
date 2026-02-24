"use client";

import { useState, useEffect } from "react";

type DateRange = { from?: string; to?: string };

export default function FilterBar({
  onChange,
  categories,
  kinds,
  showType,
  showCategory,
  showKind,
}: {
  onChange: (v: { range: DateRange; q: string; type?: "income" | "expense"; categoryId?: string; kind?: string }) => void;
  categories?: { id: string; name: string }[];
  kinds?: string[];
  showType?: boolean;
  showCategory?: boolean;
  showKind?: boolean;
}) {
  const [range, setRange] = useState<DateRange>({});
  const [q, setQ] = useState("");
  const [type, setType] = useState<"income" | "expense" | "">("");
  const [categoryId, setCategoryId] = useState("");
  const [kind, setKind] = useState("");

  useEffect(() => {
    onChange({
      range,
      q,
      type: type || undefined,
      categoryId: categoryId || undefined,
      kind: kind || undefined,
    });
  }, [range, q, type, categoryId, kind, onChange]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-4">
      <div className="flex items-center gap-2 mb-3 text-gray-600 dark:text-gray-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span className="text-sm font-medium">Filter</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Dari
          </label>
          <input
            type="date"
            value={range.from || ""}
            onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
            className="input-field text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Sampai
          </label>
          <input
            type="date"
            value={range.to || ""}
            onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
            className="input-field text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            🔍 Cari
          </label>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Kata kunci..."
            className="input-field text-sm"
          />
        </div>
        {showType && (
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Tipe
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="input-field text-sm"
            >
              <option value="">Semua</option>
              <option value="income">💚 Pemasukan</option>
              <option value="expense">❤️ Pengeluaran</option>
            </select>
          </div>
        )}
        {showCategory && (
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Kategori
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="input-field text-sm"
            >
              <option value="">Semua</option>
              {(categories || []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {showKind && (
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Jenis
            </label>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              className="input-field text-sm"
            >
              <option value="">Semua</option>
              {(kinds || []).map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
