import { type Transaction } from "@/types";
import { seedTransactions } from "@/data/seed";

const STORAGE_KEY = "cashtrack_transactions";

/**
 * Menyimpan array transaksi ke localStorage.
 * @param {Transaction[]} transactions - Array transaksi yang akan disimpan.
 */
const saveTransactions = (transactions: Transaction[]): void => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const rawData = JSON.stringify(transactions);
    window.localStorage.setItem(STORAGE_KEY, rawData);
  } catch (error) {
    console.error("Gagal menyimpan transaksi ke localStorage:", error);
  }
};

/**
 * Mengambil semua transaksi dari localStorage, atau memuat data awal jika kosong.
 * @returns {Promise<Transaction[]>} Promise yang akan resolve dengan array transaksi.
 */
export const getTransactions = async (): Promise<Transaction[]> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      return resolve([]);
    }

    try {
      const rawData = window.localStorage.getItem(STORAGE_KEY);
      // Jika tidak ada data, inisialisasi dengan data contoh
      if (!rawData || JSON.parse(rawData).length === 0) {
        // Buat data transaksi lengkap dengan ID unik
        const initialTransactions: Transaction[] = seedTransactions.map((t, index) => ({
          ...t,
          id: String(index + 1),
        }));
        saveTransactions(initialTransactions);
        return resolve(initialTransactions);
      }
      // Jika data ada, parse dan kembalikan
      return resolve(JSON.parse(rawData));
    } catch (error) {
      console.error(
        "Gagal mengambil atau menyemai transaksi dari localStorage:",
        error
      );
      return resolve([]);
    }
  });
};

/**
 * Menambahkan transaksi baru secara asinkron.
 * @param {Omit<Transaction, "id">} newTransactionData - Data transaksi baru tanpa ID.
 * @returns {Promise<Transaction>} Promise yang akan resolve dengan transaksi baru yang telah ditambahkan.
 */
export const addTransaction = async (
  newTransactionData: Omit<Transaction, "id">
): Promise<Transaction> => {
  const transactions = await getTransactions();
  const newId = Date.now().toString(36);
  const newTransaction: Transaction = {
    id: newId,
    ...newTransactionData,
  };
  const updatedTransactions = [...transactions, newTransaction];
  saveTransactions(updatedTransactions);
  return newTransaction;
};

/**
 * Memperbarui transaksi yang ada secara asinkron.
 * @param {Transaction} updatedTransaction - Data transaksi yang sudah diperbarui.
 * @returns {Promise<Transaction>} Promise yang akan resolve dengan transaksi yang telah diperbarui.
 */
export const updateTransaction = async (
  updatedTransaction: Transaction
): Promise<Transaction> => {
  let transactions = await getTransactions();
  transactions = transactions.map((t) =>
    t.id === updatedTransaction.id ? updatedTransaction : t
  );
  saveTransactions(transactions);
  return updatedTransaction;
};

/**
 * Menghapus transaksi berdasarkan ID secara asinkron.
 * @param {number} id - ID transaksi yang akan dihapus.
 * @returns {Promise<void>}
 */
export const deleteTransaction = async (id: string): Promise<void> => {
  let transactions = await getTransactions();
  transactions = transactions.filter((t) => t.id !== id);
  saveTransactions(transactions);
};
