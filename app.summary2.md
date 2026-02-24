Aplikasi ini adalah "CashTrack", sebuah aplikasi web pelacak keuangan pribadi (personal finance tracker) yang dibangun menggunakan Next.js, Prisma, dan Tailwind CSS.

Alur Pengguna (User Flow):

Autentikasi: Pengguna baru kemungkinan akan masuk melalui halaman /signin. Sistem autentikasi ditangani oleh NextAuth.js, yang mengelola sesi pengguna.
Dashboard: Setelah berhasil masuk, pengguna akan diarahkan ke halaman utama (dashboard) yang menampilkan ringkasan kondisi keuangan mereka. Ini kemungkinan mencakup total aset, investasi, ringkasan transaksi (pemasukan vs. pengeluaran) melalui komponen seperti SummaryCard, CashFlowChart, dan CategoryChart.
Manajemen Data: Melalui Sidebar atau Navbar, pengguna dapat bernavigasi ke halaman-halaman khusus:
/transactions: Untuk melihat, menambah, mengubah, dan menghapus catatan transaksi harian (pemasukan dan pengeluaran).
/assets: Untuk mengelola aset yang dimiliki (misalnya, saldo bank, uang tunai).
/investments: Untuk melacak portofolio investasi.
Laporan & Ekspor: Pengguna dapat mengunjungi halaman /reports untuk melihat visualisasi data yang lebih mendalam. Selain itu, terdapat fungsionalitas untuk mengekspor data transaksi, aset, dan investasi, yang ditangani oleh API di src/app/api/export.
Fitur Utama
Dashboard Finansial: Halaman utama yang memberikan gambaran cepat tentang kesehatan finansial pengguna.
CRUD Transaksi, Aset, & Investasi: Fungsi penuh untuk membuat, membaca, memperbarui, dan menghapus (Create, Read, Update, Delete) data keuangan inti.
Kategorisasi Transaksi: Memungkinkan pengguna untuk mengelompokkan pengeluaran dan pemasukan ke dalam kategori tertentu.
Visualisasi Data: Grafik dan bagan interaktif untuk menganalisis arus kas dan distribusi pengeluaran berdasarkan kategori.
Autentikasi Pengguna: Sistem login yang aman menggunakan NextAuth.js.
Ekspor Data: Kemampuan untuk mengunduh data keuangan, kemungkinan dalam format seperti CSV.
Desain Responsif & Modern: UI yang dibangun dengan Tailwind CSS dan komponen shadcn/ui yang memastikan tampilan baik di berbagai perangkat.
Mode Gelap (Dark Mode): Terdapat DarkModeToggle, yang berarti aplikasi mendukung tema terang dan gelap.
Analisa & Potensi Peningkatan (Apa yang Kurang)
Meskipun fondasi aplikasi ini sudah sangat solid, ada beberapa area yang bisa menjadi fokus pengembangan selanjutnya untuk menjadikannya lebih lengkap:

Testing (Sangat Penting): Tidak terlihat adanya file atau direktori untuk testing (misalnya, **tests**, \*.test.ts, cypress). Menambahkan unit test (misalnya dengan Jest/Vitest) untuk logika bisnis (seperti kalkulasi)dan integration/end-to-end test(dengan Playwright atau Cypress) untuk alur pengguna sangat krusial untuk memastikan stabilitas dan kualitas kode.
Fitur Budgeting: Aplikasi ini melacak transaksi, tetapi tidak ada fitur untuk menetapkan anggaran (budget) bulanan per kategori dan melacak kemajuannya. Ini adalah fitur inti di banyak aplikasi keuangan.
Transaksi Berulang (Recurring Transactions): Tidak ada mekanisme untuk menangani transaksi yang terjadi secara rutin (misalnya, gaji bulanan, tagihan langganan). Pengguna harus memasukkannya secara manual setiap waktu.
Manajemen Profil Pengguna: Halaman /settings ada, tetapi fiturnya belum jelas. Peningkatan bisa mencakup kemampuan bagi pengguna untuk mengubah email, password, atau mengatur preferensi mata uang.
Impor Data: Aplikasi dapat mengekspor data, tetapi fitur untuk mengimpor data (misalnya dari file CSV atau OFX dari bank) akan sangat memudahkan pengguna baru untuk memulai.
Penanganan Error & Loading State yang Lebih Baik: Perlu dipastikan semua interaksi data dengan server (misalnya saat menambah transaksi) memiliki loading indicator (seperti skeleton UI) dan penanganan error yang jelas (misalnya notifikasi "toast") jika terjadi kegagalan.
