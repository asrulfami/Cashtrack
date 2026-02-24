# CashTrack - Status Aplikasi & Roadmap

## 📊 Status Terkini (v0.1.0)

### ✅ Fitur yang Sudah Diimplementasikan

#### Core Features
- [x] **Autentikasi** - NextAuth.js dengan credentials provider
- [x] **Dashboard** - Ringkasan kondisi keuangan (total saldo, income/expense, charts)
- [x] **CRUD Transaksi** - Create, Read, Update, Delete transaksi
- [x] **CRUD Aset** - Manajemen aset dengan depresiasi
- [x] **CRUD Investasi** - Portofolio investasi dengan gain/loss tracking
- [x] **Kategorisasi** - Kategori pemasukan dan pengeluaran
- [x] **Laporan** - Laporan keuangan dengan visualisasi grafik
- [x] **Ekspor Data** - Export ke CSV dan Excel (XLSX)
- [x] **Impor Data** - Import transaksi dari CSV

#### UI/UX Improvements (Terbaru)
- [x] **Logo Integration** - Logo cashtrack.png di semua halaman
- [x] **Dark Mode** - Toggle dark/light theme dengan localStorage persistence
- [x] **Loading States** - Skeleton UI untuk loading states
- [x] **Toast Notifications** - Notifikasi success/error/warning/info
- [x] **Responsive Design** - Mobile-friendly navigation
- [x] **Settings Page** - Kategori management + User profile + Import section

#### Technical Improvements
- [x] Error handling di API routes
- [x] Form validation
- [x] Loading indicators di form submissions
- [x] SWR untuk data fetching
- [x] Context API untuk state management

---

## 🚧 Fitur yang Perlu Ditambahkan (Roadmap)

### 1. Budgeting Feature (Prioritas: TINGGI)
**Deskripsi**: Memungkinkan pengguna menetapkan anggaran bulanan per kategori pengeluaran.

**Sub-tasks**:
- [ ] **Database Schema**
  - Tambah model `Budget` di Prisma
  - Fields: id, userId, categoryId, amount, period (monthly/yearly), startDate, endDate
- [ ] **API Routes**
  - `POST /api/budgets` - Create budget
  - `GET /api/budgets` - List budgets
  - `PUT /api/budgets/[id]` - Update budget
  - `DELETE /api/budgets/[id]` - Delete budget
- [ ] **UI Components**
  - BudgetForm modal
  - BudgetList/BudgetTable component
  - BudgetProgress component (progress bar)
- [ ] **Dashboard Integration**
  - Tampilkan budget vs actual di dashboard
  - Alert jika pengeluaran mendekati/melewati budget

### 2. Recurring Transactions (Prioritas: TINGGI)
**Deskripsi**: Transaksi berulang otomatis (gaji bulanan, tagihan, subscription).

**Sub-tasks**:
- [ ] **Database Schema**
  - Tambah model `RecurringTransaction` di Prisma
  - Fields: id, userId, description, amount, type, categoryId, frequency (daily/weekly/monthly/yearly), nextDate, endDate, isActive
- [ ] **API Routes**
  - `POST /api/recurring` - Create recurring transaction
  - `GET /api/recurring` - List recurring transactions
  - `PUT /api/recurring/[id]` - Update recurring transaction
  - `DELETE /api/recurring/[id]` - Delete recurring transaction
  - `POST /api/recurring/[id]/execute` - Manual execute
- [ ] **Background Job**
  - Cron job untuk auto-execute recurring transactions
  - Script untuk menjalankan scheduled transactions
- [ ] **UI Components**
  - RecurringTransactionForm
  - RecurringTransactionList
  - Toggle untuk activate/deactivate

### 3. Testing (Prioritas: SEDANG)
**Deskripsi**: Menambahkan unit tests dan integration tests untuk memastikan kualitas kode.

**Sub-tasks**:
- [ ] **Setup Testing Framework**
  - Install Jest/Vitest
  - Setup testing configuration
  - Add @testing-library/react untuk React component tests
- [ ] **Unit Tests**
  - Test utility functions (formatCurrency, utils.ts)
  - Test validation schemas (zod schemas)
  - Test context providers
- [ ] **Integration Tests**
  - Test API routes
  - Test CRUD operations
- [ ] **E2E Tests (Optional)**
  - Setup Playwright/Cypress
  - Test user flows (login, create transaction, etc.)

### 4. Error Boundaries & Better Error Handling (Prioritas: SEDANG)
**Deskripsi**: Menambahkan error boundaries dan halaman error yang lebih baik.

**Sub-tasks**:
- [ ] **Error Boundary Component**
  - Create global error boundary
  - Create error boundary for routes
- [ ] **Custom Error Pages**
  - 404 page (not found)
  - 500 page (server error)
  - 401 page (unauthorized)
- [ ] **Better Error Messages**
  - User-friendly error messages
  - Error toast notifications consistency

### 5. User Profile Management (Prioritas: SEDANG)
**Deskripsi**: Fitur lengkap untuk mengelola profil pengguna.

**Sub-tasks**:
- [ ] **Database Schema**
  - Tambah fields di User model: name, password (hash), currency, locale
- [ ] **API Routes**
  - `PUT /api/user/profile` - Update profile
  - `PUT /api/user/password` - Change password
  - `PUT /api/user/preferences` - Update preferences (currency, theme)
- [ ] **UI Components**
  - ProfileForm dengan validation
  - ChangePasswordForm
  - PreferencesForm (currency selector, language)

### 6. Multi-Currency Support (Prioritas: RENDAH)
**Deskripsi**: Dukungan untuk multiple mata uang.

**Sub-tasks**:
- [ ] Database schema update
- [ ] Currency conversion API integration
- [ ] UI currency selector
- [ ] Auto-conversion untuk reports

### 7. Data Visualization Improvements (Prioritas: RENDAH)
**Deskripsi**: Meningkatkan visualisasi data di dashboard.

**Sub-tasks**:
- [ ] Add more chart types (bar chart, line chart, pie chart)
- [ ] Interactive charts dengan tooltips
- [ ] Export charts as images
- [ ] Custom date range untuk charts

---

## 📁 Struktur File Terkini

```
src/
├── app/
│   ├── api/
│   │   ├── assets/
│   │   ├── auth/
│   │   ├── categories/
│   │   ├── export/
│   │   ├── import/          # ✨ NEW
│   │   ├── investments/
│   │   └── transactions/
│   ├── assets/
│   ├── investments/
│   ├── reports/
│   ├── settings/            # ✨ UPDATED (import + profile)
│   ├── signin/
│   ├── transactions/        # ✨ UPDATED (toast + loading)
│   ├── layout.tsx           # ✨ UPDATED (dark mode init)
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── CashFlowChart.tsx
│   ├── CategoryChart.tsx
│   ├── DarkModeToggle.tsx   # ✨ UPDATED
│   ├── FilterBar.tsx
│   ├── Navbar.tsx           # ✨ UPDATED (logo)
│   ├── Sidebar.tsx          # ✨ UPDATED (logo + sizing)
│   ├── Skeleton.tsx         # ✨ NEW
│   ├── Toast.tsx            # ✨ NEW
│   └── ...
├── context/
│   ├── AssetContext.tsx
│   ├── InvestmentContext.tsx
│   └── TransactionContext.tsx
├── hooks/
│   └── useToast.tsx         # ✨ NEW
├── lib/
│   ├── prisma.ts
│   ├── schemas/
│   └── ...
├── types/
│   └── index.ts
└── data/
    └── categories.ts
```

---

## 🎯 Prioritas Pengembangan

### Sprint 1 (Next)
1. Budgeting Feature
2. Recurring Transactions

### Sprint 2
3. Testing Setup
4. Error Boundaries

### Sprint 3
5. User Profile Management

### Backlog
6. Multi-Currency Support
7. Data Visualization Improvements

---

## 📝 Catatan Pengembangan

### Yang Sudah Diperbaiki di Versi Ini:
- ✅ Logo integration di semua halaman
- ✅ Dark mode toggle berfungsi dengan baik
- ✅ Toast notifications untuk better UX
- ✅ Loading states dengan Skeleton UI
- ✅ Import CSV untuk transaksi
- ✅ User profile section di settings
- ✅ Error handling di form submissions

### Known Issues:
- Tidak ada (build berhasil ✅)

### Dependencies yang Mungkin Perlu Ditambahkan:
```json
{
  "devDependencies": {
    "@testing-library/react": "^14.x",
    "@testing-library/jest-dom": "^6.x",
    "vitest": "^1.x",
    "@playwright/test": "^1.x"
  },
  "dependencies": {
    "node-cron": "^3.x"  // Untuk recurring transactions
  }
}
```

---

## 🔗 Referensi

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

---

**Last Updated**: 2026-02-24
**Version**: 0.1.0
