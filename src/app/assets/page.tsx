"use client";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { type Asset, type AssetStatus } from "@/types";
import formatCurrency from "@/lib/formatCurrency";
import FilterBar from "@/components/FilterBar";
import EmptyState from "@/components/EmptyState";
import InfoCard from "@/components/InfoCard";
import DecorativeFiller from "@/components/DecorativeFiller";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AssetsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Asset | null>(null);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [depr, setDepr] = useState("");
  const [status, setStatus] = useState<AssetStatus>("active");
  const [range, setRange] = useState<{ from?: string; to?: string }>({});
  const [q, setQ] = useState("");

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (range.from) p.set("from", range.from);
    if (range.to) p.set("to", range.to);
    if (q) p.set("q", q);
    return p.toString();
  }, [range, q]);

  const { data, mutate } = useSWR(`/api/assets?${qs}`, fetcher);
  const rows: Asset[] = Array.isArray(data)
    ? data.map((a: any) => ({
        id: a.id,
        name: a.name,
        acquisitionValue: a.acquisitionValue,
        acquisitionDate: new Date(a.acquisitionDate).toISOString().slice(0, 10),
        depreciation: a.depreciation ?? undefined,
        status: a.status,
      }))
    : [];

  const totalValue = rows.reduce((sum, a) => sum + a.acquisitionValue, 0);

  const openForm = (row?: Asset) => {
    if (row) {
      setEditing(row);
      setName(row.name);
      setValue(String(row.acquisitionValue));
      setDate(row.acquisitionDate);
      setDepr(row.depreciation ? String(row.depreciation) : "");
      setStatus(row.status);
    } else {
      setEditing(null);
      setName("");
      setValue("");
      setDate(new Date().toISOString().slice(0, 10));
      setDepr("");
      setStatus("active");
    }
    setShowForm(true);
  };

  const closeForm = () => setShowForm(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      acquisitionValue: Number(value),
      acquisitionDate: date,
      depreciation: depr ? Number(depr) : undefined,
      status,
    };
    if (editing) {
      const res = await fetch(`/api/assets/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        mutate();
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } else {
      const res = await fetch(`/api/assets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        mutate();
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    }
    setShowForm(false);
  };

  const onDelete = async (id: string) => {
    if (!confirm("Hapus aset ini?")) return;
    const res = await fetch(`/api/assets/${id}`, { method: "DELETE" });
    if (res.ok) mutate();
  };

  const exportFile = (format: "csv" | "xlsx") => {
    const url = `/api/export/assets?${qs}&format=${format}`;
    window.open(url, "_blank");
  };

  const statusColors = {
    active: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    inactive: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    disposed: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            📦 Aset
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola aset dan depresiasi
          </p>
        </div>
        <div className="flex gap-2 flex-wrap justify-start sm:justify-end">
          <button onClick={() => exportFile("csv")} className="btn-secondary text-xs sm:text-sm px-3 py-2">
            📄 CSV
          </button>
          <button onClick={() => exportFile("xlsx")} className="btn-secondary text-xs sm:text-sm px-3 py-2">
            📊 Excel
          </button>
          <button onClick={() => openForm()} className="btn-primary text-xs sm:text-sm px-3 py-2 flex items-center gap-1.5 sm:gap-2">
            <span>➕</span><span className="hidden sm:inline">Tambah Aset</span><span className="sm:hidden">Tambah</span>
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="card p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Nilai Aset</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1 break-all leading-tight">
              {formatCurrency(totalValue)}
            </p>
          </div>
          <div className="text-3xl sm:text-4xl flex-shrink-0">🏦</div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar onChange={(v) => { setRange(v.range || {}); setQ(v.q || ""); }} />

      {/* Table */}
      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[450px] sm:min-w-[600px]">
            <thead>
              <tr className="table-header">
                <th className="py-3 px-3 sm:px-4 text-left text-xs sm:text-sm">Nama</th>
                <th className="py-3 px-3 sm:px-4 text-left text-xs sm:text-sm">Nilai Perolehan</th>
                <th className="py-3 px-3 sm:px-4 text-left text-xs sm:text-sm hidden sm:table-cell">Tanggal Perolehan</th>
                <th className="py-3 px-3 sm:px-4 text-left text-xs sm:text-sm hidden md:table-cell">Depresiasi</th>
                <th className="py-3 px-3 sm:px-4 text-left text-xs sm:text-sm">Status</th>
                <th className="py-3 px-3 sm:px-4 text-center text-xs sm:text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id} className="table-row">
                  <td className="py-3 px-3 sm:px-4 font-medium text-sm sm:text-base text-gray-800 dark:text-gray-200 max-w-[120px] sm:max-w-none truncate sm:whitespace-normal">
                    {a.name}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {formatCurrency(a.acquisitionValue)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap hidden sm:table-cell">
                    {a.acquisitionDate}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap hidden md:table-cell">
                    {a.depreciation ? `${a.depreciation}%` : "-"}
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize whitespace-nowrap ${statusColors[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    <div className="flex gap-1.5 sm:gap-2 justify-center">
                      <button onClick={() => openForm(a)} className="px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors whitespace-nowrap">
                        ✏️
                      </button>
                      <button onClick={() => onDelete(a.id)} className="px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors whitespace-nowrap">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <div className="animate-slide-up space-y-6">
              <EmptyState
                icon="📦"
                title="Belum Ada Aset"
                description="Mulai kelola aset Anda dengan menambahkan aset pertama"
                action={
                  <button onClick={() => openForm()} className="btn-primary inline-flex items-center gap-2">
                    <span>➕</span><span>Tambah Aset</span>
                  </button>
                }
              />
              
              {/* Info cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoCard
                  type="info"
                  title="📊 Kelola Aset"
                  content="Catat semua aset Anda seperti properti, kendaraan, dan peralatan dengan nilai perolehan"
                />
                <InfoCard
                  type="insight"
                  title="📈 Depresiasi"
                  content="Pantau depresiasi aset Anda untuk mengetahui nilai buku saat ini"
                />
                <InfoCard
                  type="goal"
                  title="🎯 Status Aset"
                  content="Kelola status aset: Aktif, Tidak Aktif, atau Dihapuskan"
                />
              </div>
              
              {/* Decorative filler */}
              <DecorativeFiller variant="gradient" height="sm" />
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              {editing ? "✏️ Edit Aset" : "➕ Tambah Aset"}
            </h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nama Aset</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nilai Perolehan (Rp)</label>
                  <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tanggal Perolehan</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Depresiasi (%)</label>
                  <input type="number" value={depr} onChange={(e) => setDepr(e.target.value)} className="input-field" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as AssetStatus)} className="input-field">
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                    <option value="disposed">Dihapuskan</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button type="button" onClick={closeForm} className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium">
                  Batal
                </button>
                <button type="submit" className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
