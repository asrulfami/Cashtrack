# CashTrack
<img width="953" height="446" alt="cashtrack" src="https://github.com/user-attachments/assets/a7a2eaf8-ac47-44b6-b412-26cd8aa832bb" />
CashTrack adalah aplikasi web manajemen keuangan pribadi yang dibangun dengan Next.js dan TypeScript. Aplikasi ini memungkinkan pengguna untuk melacak pendapatan dan pengeluaran mereka, melihat riwayat transaksi, dan mendapatkan wawasan melalui visualisasi data.

## Fitur Utama

- **Dasbor Utama**: Menampilkan ringkasan keuangan termasuk total pendapatan, total pengeluaran, dan saldo saat ini.
- **Manajemen Transaksi**: Pengguna dapat melihat daftar semua transaksi dalam tabel yang mudah dibaca.
- **Visualisasi Data**: Grafik dan bagan (menggunakan Recharts) untuk memvisualisasikan aliran kas dan tren keuangan.
- **Autentikasi Pengguna**: Sistem masuk dan pendaftaran yang aman menggunakan Next-Auth.
- **Desain Responsif**: Antarmuka yang dioptimalkan untuk berbagai ukuran layar menggunakan Tailwind CSS.
- **Mode Gelap**: Tombol untuk beralih antara tema terang dan gelap.

## Teknologi yang Digunakan

- **Framework**: [Next.js](https://nextjs.org/) 16
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Manajemen State & Data Fetching**: [TanStack React Query](https://tanstack.com/query/latest)
- **Visualisasi Data**: [Recharts](https://recharts.org/)
- **Autentikasi**: [Next-Auth](https://next-auth.js.org/)
- **Linting**: [ESLint](https://eslint.org/)

## Memulai

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

1.  **Clone Repositori**
    ```bash
    git clone <URL_REPOSITORI_ANDA>
    cd cashtrack
    ```

2.  **Instal Dependensi**
    Gunakan `npm` untuk menginstal semua paket yang diperlukan.
    ```bash
    npm install
    ```

3.  **Jalankan Server Pengembangan**
    Proyek akan berjalan di `http://localhost:3000`.
    ```bash
    npm run dev
    ```

## Skrip yang Tersedia

Dalam direktori proyek, Anda dapat menjalankan:

- `npm run dev`: Menjalankan aplikasi dalam mode pengembangan.
- `npm run build`: Membangun aplikasi untuk produksi.
- `npm run start`: Memulai server produksi setelah build.
- `npm run lint`: Menjalankan linter ESLint untuk memeriksa masalah pada kode.
