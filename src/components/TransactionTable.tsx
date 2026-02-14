export default function TransactionTable() {
  const transactions = [
    { id: 1, date: "2026-02-01", description: "Gaji", amount: 5000 },
    { id: 2, date: "2026-02-03", description: "Belanja", amount: -1200 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
        Transaksi Terbaru
      </h3>
      <table className="w-full min-w-[400px] text-left">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="py-2 text-gray-700 dark:text-gray-200 font-semibold">
              Tanggal
            </th>
            <th className="py-2 text-gray-700 dark:text-gray-200 font-semibold">
              Deskripsi
            </th>
            <th className="py-2 text-gray-700 dark:text-gray-200 font-semibold">
              Jumlah
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr
              key={t.id}
              className="border-b border-gray-200 dark:border-gray-700"
            >
              <td className="py-2 text-gray-700 dark:text-gray-200">
                {t.date}
              </td>
              <td className="py-2 text-gray-700 dark:text-gray-200">
                {t.description}
              </td>
              <td
                className={`py-2 font-semibold ${
                  t.amount < 0 ? "text-red-500" : "text-green-500"
                }`}
              >
                Rp {t.amount.toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
