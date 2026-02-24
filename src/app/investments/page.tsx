"use client";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { type Investment, type InvestmentKind } from "@/types";
import formatCurrency from "@/lib/formatCurrency";
import FilterBar from "@/components/FilterBar";
import EmptyState from "@/components/EmptyState";
import InfoCard from "@/components/InfoCard";
import DecorativeFiller from "@/components/DecorativeFiller";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function InvestmentsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Investment | null>(null);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<InvestmentKind>("stock");
  const [buyDate, setBuyDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [units, setUnits] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [range, setRange] = useState<{ from?: string; to?: string }>({});
  const [q, setQ] = useState("");
  const [k, setK] = useState<string | undefined>(undefined);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (range.from) p.set("from", range.from);
    if (range.to) p.set("to", range.to);
    if (q) p.set("q", q);
    if (k) p.set("kind", k);
    return p.toString();
  }, [range, q, k]);

  const { data, mutate } = useSWR(`/api/investments?${qs}`, fetcher);
  const rows: Investment[] = Array.isArray(data)
    ? data.map((i: any) => ({
        id: i.id,
        name: i.name,
        kind: i.kind,
        buyDate: new Date(i.buyDate).toISOString().slice(0, 10),
        units: i.units,
        buyPrice: i.buyPrice,
        currentPrice: i.currentPrice,
      }))
    : [];

  const totalCurrentValue = rows.reduce((sum, i) => sum + i.units * i.currentPrice, 0);
  const totalBuyValue = rows.reduce((sum, i) => sum + i.units * i.buyPrice, 0);
  const totalGainLoss = totalCurrentValue - totalBuyValue;
  const gainLossPercent = totalBuyValue > 0 ? ((totalGainLoss / totalBuyValue) * 100).toFixed(2) : 0;

  const openForm = (row?: Investment) => {
    if (row) {
      setEditing(row);
      setName(row.name);
      setKind(row.kind);
      setBuyDate(row.buyDate);
      setUnits(String(row.units));
      setBuyPrice(String(row.buyPrice));
      setCurrentPrice(String(row.currentPrice));
    } else {
      setEditing(null);
      setName("");
      setKind("stock");
      setBuyDate(new Date().toISOString().slice(0, 10));
      setUnits("");
      setBuyPrice("");
      setCurrentPrice("");
    }
    setShowForm(true);
  };

  const closeForm = () => setShowForm(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      kind,
      buyDate,
      units: Number(units),
      buyPrice: Number(buyPrice),
      currentPrice: Number(currentPrice),
    };
    if (editing) {
      const res = await fetch(`/api/investments/${editing.id}`, {
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
      const res = await fetch(`/api/investments`, {
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
    if (!confirm("Hapus investasi ini?")) return;
    const res = await fetch(`/api/investments/${id}`, { method: "DELETE" });
    if (res.ok) mutate();
  };

  const exportFile = (format: "csv" | "xlsx") => {
    const url = `/api/export/investments?${qs}&format=${format}`;
    window.open(url, "_blank");
  };

  const kindLabels = {
    stock: "📈 Saham",
    bond: "📜 Obligasi",
    deposit: "💵 Deposito",
    mutual_fund: "📊 Reksadana",
    other: "📦 Lainnya",
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            📈 Investasi
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola portofolio investasi Anda
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
            <span>➕</span><span className="hidden sm:inline">Tambah Investasi</span><span className="sm:hidden">Tambah</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="card p-4 sm:p-5">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nilai Beli Total</p>
          <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mt-1 break-all leading-tight">
            {formatCurrency(totalBuyValue)}
          </p>
        </div>
        <div className="card p-4 sm:p-5">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nilai Saat Ini</p>
          <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 mt-1 break-all leading-tight">
            {formatCurrency(totalCurrentValue)}
          </p>
        </div>
        <div className="card p-4 sm:p-5">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gain/Loss</p>
          <p className={`text-lg sm:text-xl font-bold mt-1 break-all leading-tight ${totalGainLoss >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            {totalGainLoss >= 0 ? "📈" : "📉"} {formatCurrency(totalGainLoss)} ({gainLossPercent}%)
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar onChange={(v) => { setRange(v.range || {}); setQ(v.q || ""); setK(v.kind); }} kinds={["stock", "bond", "deposit", "mutual_fund", "other"]} showKind />

      {/* Table */}
      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] sm:min-w-[700px]">
            <thead>
              <tr className="table-header">
                <th className="py-3 px-3 sm:px-4 text-left text-xs sm:text-sm">Nama</th>
                <th className="py-3 px-3 sm:px-4 text-left text-xs sm:text-sm hidden sm:table-cell">Jenis</th>
                <th className="py-3 px-3 sm:px-4 text-left text-xs sm:text-sm hidden md:table-cell">Tgl Beli</th>
                <th className="py-3 px-3 sm:px-4 text-right text-xs sm:text-sm">Unit</th>
                <th className="py-3 px-3 sm:px-4 text-right text-xs sm:text-sm hidden sm:table-cell">Harga Beli</th>
                <th className="py-3 px-3 sm:px-4 text-right text-xs sm:text-sm hidden lg:table-cell">Harga Saat Ini</th>
                <th className="py-3 px-3 sm:px-4 text-right text-xs sm:text-sm">Nilai Saat Ini</th>
                <th className="py-3 px-3 sm:px-4 text-center text-xs sm:text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((i) => {
                const currentValue = i.units * i.currentPrice;
                const buyValue = i.units * i.buyPrice;
                const gainLoss = currentValue - buyValue;
                return (
                  <tr key={i.id} className="table-row">
                    <td className="py-3 px-3 sm:px-4 font-medium text-gray-800 dark:text-gray-200 max-w-[120px] sm:max-w-none truncate sm:whitespace-normal">
                      {i.name}
                    </td>
                    <td className="py-3 px-3 sm:px-4 hidden sm:table-cell">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 capitalize whitespace-nowrap">
                        {kindLabels[i.kind]}
                      </span>
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell whitespace-nowrap">
                      {i.buyDate}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-right text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {i.units.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-right text-gray-600 dark:text-gray-400 hidden sm:table-cell whitespace-nowrap">
                      {formatCurrency(i.buyPrice)}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-right text-gray-600 dark:text-gray-400 hidden lg:table-cell whitespace-nowrap">
                      {formatCurrency(i.currentPrice)}
                    </td>
                    <td className={`py-3 px-3 sm:px-4 text-right font-semibold whitespace-nowrap ${gainLoss >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      {formatCurrency(currentValue)}
                    </td>
                    <td className="py-3 px-3 sm:px-4">
                      <div className="flex gap-1.5 sm:gap-2 justify-center">
                        <button onClick={() => openForm(i)} className="px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors whitespace-nowrap">
                          ✏️
                        </button>
                        <button onClick={() => onDelete(i.id)} className="px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors whitespace-nowrap">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 && (
            <div className="animate-slide-up space-y-6">
              <EmptyState
                icon="📈"
                title="Belum Ada Investasi"
                description="Mulai bangun portofolio investasi Anda dengan menambahkan investasi pertama"
                action={
                  <button onClick={() => openForm()} className="btn-primary inline-flex items-center gap-2">
                    <span>➕</span><span>Tambah Investasi</span>
                  </button>
                }
              />
              
              {/* Info cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoCard
                  type="info"
                  title="📊 Jenis Investasi"
                  content="Kelola berbagai jenis investasi: Saham, Obligasi, Deposito, Reksadana, dan lainnya"
                />
                <InfoCard
                  type="insight"
                  title="📈 Pantau Kinerja"
                  content="Lacak gain/loss investasi Anda untuk mengetahui kinerja portofolio"
                />
                <InfoCard
                  type="tip"
                  title="💡 Diversifikasi"
                  content="Sebarkan investasi ke berbagai instrumen untuk mengurangi risiko"
                />
              </div>
              
              {/* Decorative filler */}
              <DecorativeFiller variant="particles" height="sm" />
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-lg border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              {editing ? "✏️ Edit Investasi" : "➕ Tambah Investasi"}
            </h2>
            <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nama Investasi</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Contoh: BBCA, SBN, dll" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Jenis</label>
                  <select value={kind} onChange={(e) => setKind(e.target.value as InvestmentKind)} className="input-field">
                    <option value="stock">📈 Saham</option>
                    <option value="bond">📜 Obligasi</option>
                    <option value="deposit">💵 Deposito</option>
                    <option value="mutual_fund">📊 Reksadana</option>
                    <option value="other">📦 Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tanggal Beli</label>
                  <input type="date" value={buyDate} onChange={(e) => setBuyDate(e.target.value)} className="input-field" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Unit</label>
                  <input type="number" value={units} onChange={(e) => setUnits(e.target.value)} className="input-field" placeholder="0" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Harga Beli</label>
                  <input type="number" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} className="input-field" placeholder="0" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Harga Saat Ini</label>
                  <input type="number" value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} className="input-field" placeholder="0" required />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                <button type="button" onClick={closeForm} className="w-full sm:w-auto px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium">
                  Batal
                </button>
                <button type="submit" className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium">
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
