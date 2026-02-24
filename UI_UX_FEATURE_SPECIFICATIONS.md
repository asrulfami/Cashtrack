# CashTrack UI/UX Feature Specifications

**Date**: 24 February 2026  
**Focus**: User Interface & Experience Enhancements

---

## 🎨 Current UI/UX Analysis

### Design System Status

#### ✅ Established Elements
- **Color Palette**: Consistent semantic colors
- **Typography**: System fonts via Tailwind
- **Components**: Card-based layout system
- **Icons**: Lucide React icons
- **Dark Mode**: Full support with localStorage persistence
- **Responsive**: Mobile, tablet, desktop breakpoints
- **Animations**: Smooth transitions (200-300ms)

#### ⚠️ Missing Elements
- Design tokens file
- Component documentation
- Accessibility guidelines
- Icon usage guidelines
- Spacing system documentation

---

## 🎯 UI Features to Develop

### Priority 1: Core Navigation & Layout

#### 1. Enhanced Sidebar Navigation 🧭
**Priority**: HIGH  
**Current State**: Basic sidebar with links

**Specifications**:

**Features to Add**:
- [ ] Collapsible sidebar (mini variant)
- [ ] Keyboard shortcuts overlay (Ctrl+K)
- [ ] Recent pages quick access
- [ ] Active page indicator (animated)
- [ ] User profile section in sidebar
- [ ] Logout confirmation dialog
- [ ] Notification badge on sidebar items

**Component Structure**:
```tsx
// src/components/Sidebar.tsx
interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

interface NavItem {
  icon: React.ComponentType;
  label: string;
  href: string;
  badge?: number;
  subItems?: NavItem[];
}
```

**Design Details**:
```typescript
const SIDEBAR_WIDTH = {
  desktop: 280,
  desktopCollapsed: 80,
  mobile: 280,
};

const ANIMATION_DURATION = 300; // ms
```

**Keyboard Shortcuts**:
```
Ctrl+B - Toggle sidebar
Ctrl+K - Open command palette
Ctrl+H - Go to Home
Ctrl+T - Go to Transactions
Ctrl+R - Go to Reports
Ctrl+S - Go to Settings
```

---

#### 2. Command Palette (Cmd+K) 🔍
**Priority**: HIGH  
**Use Case**: Quick navigation and actions

**Specifications**:

**Features**:
- Search pages
- Search transactions
- Quick actions (add transaction, etc.)
- Recent searches
- Keyboard navigation

**Component Structure**:
```tsx
// src/components/CommandPalette.tsx
interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CommandItem {
  id: string;
  label: string;
  icon: React.ComponentType;
  shortcut?: string;
  action: () => void;
  category: 'navigation' | 'action' | 'transaction';
}
```

**UI Design**:
```
┌─────────────────────────────────────┐
│  🔍 Search commands, pages...       │
├─────────────────────────────────────┤
│  PAGES                              │
│  📊 Dashboard                       │
│  💰 Transactions                    │
│  📈 Reports                         │
├─────────────────────────────────────┤
│  ACTIONS                            │
│  ➕ Add Transaction        Ctrl+N   │
│  🎯 Add Budget                      │
│  📤 Export Data                     │
├─────────────────────────────────────┤
│  RECENT                             │
│  📊 Dashboard                       │
│  💰 Food Transactions               │
└─────────────────────────────────────┘
```

**Implementation**:
```tsx
import { Command } from 'cmdk';

export default function CommandPalette({ open, onOpenChange }) {
  return (
    <Command.Dialog open={open} onOpenChange={onOpenChange}>
      <Command.Input placeholder="Type a command or search..." />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        <Command.Group heading="Suggestions">
          {/* Items */}
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
```

---

#### 3. Breadcrumb Navigation 🍞
**Priority**: MEDIUM  
**Use Case**: Orientation and quick navigation

**Specifications**:

**Features**:
- Current page path display
- Clickable ancestors
- Icon for each level
- Responsive (collapse on mobile)

**Component Structure**:
```tsx
// src/components/Breadcrumb.tsx
interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
    icon?: React.ComponentType;
  }>;
}

// Usage example
<Breadcrumb items={[
  { label: 'Home', href: '/', icon: HomeIcon },
  { label: 'Transactions', href: '/transactions' },
  { label: 'Create New' },
]} />
```

**UI Design**:
```
Home / Transactions / Create New
  🏠     💰           ➕
```

---

#### 4. Page Header Component 📄
**Priority**: MEDIUM  
**Use Case**: Consistent page headers with actions

**Specifications**:

**Features**:
- Page title
- Description/subtitle
- Action buttons (right-aligned)
- Breadcrumb integration
- Responsive layout

**Component Structure**:
```tsx
// src/components/PageHeader.tsx
interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ComponentType;
  actions?: React.ReactNode;
  breadcrumb?: BreadcrumbItem[];
}

// Usage example
<PageHeader
  title="Transactions"
  description="Manage your income and expenses"
  icon={TransactionIcon}
  actions={
    <Button onClick={handleAdd}>
      <PlusIcon /> Add Transaction
    </Button>
  }
/>
```

**UI Design**:
```
┌─────────────────────────────────────────────┐
│  🏠 Home / Transactions                     │
│                                             │
│  💰 Transactions                    [+ Add] │
│  Manage your income and expenses            │
└─────────────────────────────────────────────┘
```

---

### Priority 2: Forms & Input Enhancements

#### 5. Smart Transaction Form 🧠
**Priority**: HIGH  
**Current State**: Basic form with fields

**Specifications**:

**Features to Add**:
- [ ] Recent transactions quick select
- [ ] Category suggestions based on description
- [ ] Amount suggestions based on history
- [ ] Split transaction support
- [ ] Recurring transaction toggle
- [ ] Receipt image upload
- [ ] Voice input for description (Web Speech API)
- [ ] Quick amount calculator

**Component Structure**:
```tsx
// src/components/TransactionForm.tsx
interface TransactionFormProps {
  initialData?: Transaction;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface Suggestion {
  category?: string;
  amount?: number;
  paymentMethod?: string;
  confidence: number;
}
```

**UI Layout**:
```
┌─────────────────────────────────────┐
│  ➕ Add Transaction                 │
├─────────────────────────────────────┤
│  Description: [____________] 🎤     │
│  💡 Suggestion: "Grocery shopping"  │
├─────────────────────────────────────┤
│  Amount:      [________]            │
│  💡 Avg for Makanan: Rp 150,000     │
├─────────────────────────────────────┤
│  Category:    [Makanan    ▼]        │
│  💡 Based on description            │
├─────────────────────────────────────┤
│  Date:        [24 Feb 2026]         │
│  Payment:     [BCA Debit  ▼]        │
├─────────────────────────────────────┤
│  ⚡ Make this recurring              │
│  📎 Add receipt image                │
├─────────────────────────────────────┤
│  [Cancel]           [Save]          │
└─────────────────────────────────────┘
```

**Smart Features Implementation**:
```tsx
// Auto-suggest category from description
const suggestCategory = (description: string) => {
  const keywords = {
    'makanan': ['restoran', 'cafe', 'makan', 'lunch', 'dinner'],
    'transportasi': ['gojek', 'grab', 'bensin', 'taksi'],
    'belanja': ['supermarket', 'mall', 'online', 'shopee'],
  };
  
  const lowerDesc = description.toLowerCase();
  for (const [category, keywordsList] of Object.entries(keywords)) {
    if (keywordsList.some(k => lowerDesc.includes(k))) {
      return category;
    }
  }
  return null;
};

// Get average amount for category
const useCategoryAverage = (category: string) => {
  const { transactions } = useTransactions();
  return useMemo(() => {
    const categoryTx = transactions.filter(t => t.category === category);
    const avg = categoryTx.reduce((sum, t) => sum + Math.abs(t.amount), 0) / categoryTx.length;
    return avg;
  }, [transactions, category]);
};
```

---

#### 6. Advanced Search & Filter 🔎
**Priority**: HIGH  
**Current State**: Basic FilterBar component

**Specifications**:

**Features**:
- [ ] Global search (all data)
- [ ] Advanced filter modal
- [ ] Saved filter presets
- [ ] Search history
- [ ] Search suggestions
- [ ] Boolean operators (AND, OR, NOT)
- [ ] Date range presets

**Component Structure**:
```tsx
// src/components/AdvancedSearch.tsx
interface SearchFilters {
  query: string;
  dateRange: {
    from?: string;
    to?: string;
    preset?: 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth';
  };
  amountRange: {
    min?: number;
    max?: number;
  };
  categories: string[];
  types: ('income' | 'expense')[];
  paymentMethods: string[];
  hasReceipt: boolean;
}

interface SearchResults {
  transactions: Transaction[];
  total: number;
  hasMore: boolean;
}
```

**UI Design - Search Modal**:
```
┌─────────────────────────────────────────┐
│  🔍 Search...                           │
├─────────────────────────────────────────┤
│  RECENT SEARCHES                        │
│  "makanan januari"              [✕]     │
│  "expense > 100000"               [✕]   │
├─────────────────────────────────────────┤
│  SUGGESTIONS                            │
│  💰 Category: Makanan                   │
│  📅 Date: Last 30 days                  │
│  💵 Amount: > Rp 100,000                │
└─────────────────────────────────────────┘
```

**UI Design - Filter Panel**:
```
┌─────────────────────────────────────────┐
│  🔍 Advanced Filters             [✕]    │
├─────────────────────────────────────────┤
│  Date Range:                            │
│  [This Month ▼]  [Custom Range...]      │
├─────────────────────────────────────────┤
│  Amount:                                │
│  Rp [_______] - Rp [_______]            │
├─────────────────────────────────────────┤
│  Categories:                            │
│  ☑ Makanan  ☐ Transportasi  ☐ Belanja  │
│  ☐ Hiburan  ☐ Kesehatan   ☐ Lainnya   │
├─────────────────────────────────────────┤
│  Type:                                  │
│  ☑ Income  ☑ Expense                    │
├─────────────────────────────────────────┤
│  Payment Method:                        │
│  ☑ Cash  ☑ BCA  ☑ Mandiri  ☑ Credit   │
├─────────────────────────────────────────┤
│  Options:                               │
│  ☐ Has receipt only                     │
├─────────────────────────────────────────┤
│  [Reset]          [Save as Preset] [Apply] │
└─────────────────────────────────────────┘
```

**Saved Presets**:
```tsx
interface FilterPreset {
  id: string;
  name: string;
  filters: SearchFilters;
  isDefault: boolean;
}

// Quick preset buttons
<div className="flex gap-2">
  {presets.map(preset => (
    <Button
      key={preset.id}
      variant={activePreset === preset.id ? 'primary' : 'secondary'}
      onClick={() => applyPreset(preset)}
    >
      {preset.name}
    </Button>
  ))}
</div>
```

---

#### 7. Inline Editing 📝
**Priority**: MEDIUM  
**Use Case**: Quick edits without opening forms

**Specifications**:

**Features**:
- Click to edit transaction amount
- Click to edit category
- Click to edit description
- Auto-save on blur
- Undo support

**Component Structure**:
```tsx
// src/components/InlineEdit.tsx
interface InlineEditProps<T> {
  value: T;
  onChange: (value: T) => void;
  type: 'text' | 'number' | 'select' | 'date';
  options?: SelectOption[];
  format?: (value: T) => string;
  parse?: (value: string) => T;
  validation?: (value: T) => string | null;
}

// Usage in table
<TableCell>
  <InlineEdit
    value={transaction.amount}
    onChange={(amount) => updateTransaction(transaction.id, { amount })}
    type="number"
    format={formatCurrency}
    parse={(value) => parseInt(value.replace(/[^0-9]/g, ''))}
  />
</TableCell>
```

**UI Design**:
```
Normal state:
Rp 150,000  ✏️

Hover state:
Rp 150,000  ✏️ (highlighted)

Edit state:
[Rp 150,000_] ✓ ✗

Saving state:
Rp 150,000  ⏳

Saved state:
Rp 150,000  ✓ (toast: "Saved")
```

---

### Priority 3: Data Display Enhancements

#### 8. Enhanced Transaction Table 📊
**Priority**: HIGH  
**Current State**: Basic TransactionTable component

**Specifications**:

**Features to Add**:
- [ ] Column customization (show/hide, reorder)
- [ ] Column sorting (multi-column)
- [ ] Bulk selection and actions
- [ ] Virtual scrolling for large datasets
- [ ] Row expansion for details
- [ ] Quick actions on hover
- [ ] Category color coding
- [ ] Receipt indicator

**Component Structure**:
```tsx
// src/components/TransactionTable.tsx
interface TableConfig {
  columns: Column[];
  sorting: SortingState;
  filters: FilterState;
  pagination: PaginationState;
  rowSelection: RowSelectionState;
}

interface Column {
  id: string;
  header: string;
  accessor: keyof Transaction;
  width?: number;
  visible?: boolean;
  sortable?: boolean;
  render?: (value: any, row: Transaction) => React.ReactNode;
}
```

**UI Design**:
```
┌─────────────────────────────────────────────────────────┐
│  ⚙️ Columns  📊 Sort  📥 Export  [+ Add Transaction]   │
├─────────────────────────────────────────────────────────┤
│  ☐ [Date ▼] [Description] [Category ▼] [Amount ▼] [...]│
├─────────────────────────────────────────────────────────┤
│  ☐ 24 Feb | Grocery Shopping | 🍔 Makanan | -150,000 │
│  ☐ 23 Feb | Salary | 💼 Gaji | +5,000,000  │
│  ☐ 22 Feb | Gojek | 🚗 Transport | -25,000   │
├─────────────────────────────────────────────────────────┤
│  Showing 1-20 of 150 transactions  [< Prev] [Next >]   │
└─────────────────────────────────────────────────────────┘

Bulk selection toolbar (when items selected):
┌─────────────────────────────────────────────────────────┐
│  ☑ 3 selected  [Delete] [Export] [Categorize] [Cancel] │
└─────────────────────────────────────────────────────────┘
```

**Column Customization**:
```tsx
interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  width?: number;
  order: number;
}

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: 'date', label: 'Date', visible: true, order: 0 },
  { id: 'description', label: 'Description', visible: true, order: 1 },
  { id: 'category', label: 'Category', visible: true, order: 2 },
  { id: 'paymentMethod', label: 'Payment', visible: true, order: 3 },
  { id: 'amount', label: 'Amount', visible: true, order: 4 },
  { id: 'actions', label: 'Actions', visible: true, order: 5 },
];
```

---

#### 9. Transaction Detail Drawer 📋
**Priority**: MEDIUM  
**Use Case**: View full transaction details

**Specifications**:

**Features**:
- Slide-out drawer from right
- Full transaction details
- Linked transactions (if split)
- Receipt preview
- Edit/Delete actions
- Activity history

**Component Structure**:
```tsx
// src/components/TransactionDetailDrawer.tsx
interface TransactionDetailDrawerProps {
  transactionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ActivityLog {
  action: 'created' | 'updated' | 'deleted';
  timestamp: string;
  changes?: Record<string, { old: any; new: any }>;
}
```

**UI Design**:
```
┌─────────────────────────────────────┐
│  Transaction Details           [✕]  │
├─────────────────────────────────────┤
│  🍔 Makanan                         │
│  Grocery Shopping                   │
│                                     │
│  📅 February 24, 2026               │
│  💰 Rp 150,000                      │
│  💳 BCA Debit                       │
│                                     │
│  📝 Notes:                          │
│  Weekly grocery shopping at         │
│  Superindo                          │
│                                     │
│  📎 Receipt:                        │
│  [receipt-preview.jpg]              │
│                                     │
│  📊 Activity:                       │
│  • Created on Feb 24, 10:30        │
│  • Updated on Feb 24, 11:00        │
│    - Amount: 145,000 → 150,000     │
│                                     │
│  [Edit] [Delete]                    │
└─────────────────────────────────────┘
```

---

#### 10. Summary Cards with Trends 📈
**Priority**: MEDIUM  
**Current State**: Basic StatCard component

**Specifications**:

**Features to Add**:
- [ ] Trend indicator (vs previous period)
- [ ] Sparkline chart
- [ ] Percentage change
- [ ] Color-coded trends (green/red)
- [ ] Click to see details
- [ ] Tooltip on hover

**Component Structure**:
```tsx
// src/components/StatCard.tsx
interface StatCardProps {
  title: string;
  value: number;
  format?: (value: number) => string;
  trend?: {
    value: number;
    percentage: number;
    period: string;
  };
  sparklineData?: number[];
  onClick?: () => void;
  icon?: React.ComponentType;
}

// Usage example
<StatCard
  title="Total Income"
  value={5000000}
  format={formatCurrency}
  trend={{
    value: 500000,
    percentage: 11.1,
    period: 'vs last month',
  }}
  sparklineData={[4500000, 4700000, 4500000, 5000000]}
  icon={IncomeIcon}
/>
```

**UI Design**:
```
┌─────────────────────────────┐
│  💰 Total Income            │
│                             │
│  Rp 5,000,000               │
│  📈 +Rp 500,000 (+11.1%)    │
│  vs last month              │
│                             │
│  ╭──╮                       │
│  │  ╰──╮  ╭──               │
│  ╰─────╯  ╰─────            │
└─────────────────────────────┘
```

**Implementation**:
```tsx
export default function StatCard({
  title,
  value,
  trend,
  sparklineData,
  icon: Icon,
}: StatCardProps) {
  const isPositive = trend && trend.value > 0;
  
  return (
    <div className="card card-hover">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{title}</span>
        {Icon && <Icon className="w-5 h-5 text-gray-400" />}
      </div>
      
      <div className="text-2xl font-bold">{formatCurrency(value)}</div>
      
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-sm ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? '📈' : '📉'}
          <span>+{formatCurrency(trend.value)}</span>
          <span>({trend.percentage}%)</span>
        </div>
      )}
      
      {sparklineData && (
        <div className="mt-3 h-10">
          <Sparkline data={sparklineData} />
        </div>
      )}
    </div>
  );
}
```

---

### Priority 4: Feedback & Notifications

#### 11. Enhanced Toast System 🔔
**Priority**: HIGH  
**Current State**: Basic Toast component exists

**Specifications**:

**Features to Add**:
- [ ] Undo action for deletions
- [ ] Action buttons on toasts
- [ ] Toast queue/priority
- [ ] Persistent toasts (require action)
- [ ] Toast grouping
- [ ] Progress toasts (for long operations)
- [ ] Sound notifications (optional)

**Component Structure**:
```tsx
// src/hooks/useToast.ts
interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  dismissible?: boolean;
  priority?: 'low' | 'normal' | 'high';
}

interface ToastOptions {
  undo?: {
    action: () => Promise<void>;
    label?: string;
  };
  duration?: number;
  persist?: boolean;
}

// Usage
const toast = useToast();

// Simple toast
toast.success('Transaction saved');

// Toast with undo
toast.success('Transaction deleted', {
  undo: {
    action: () => restoreTransaction(id),
    label: 'Undo',
  },
});

// Progress toast
const progressToast = toast.loading('Importing data...');
progressToast.update({ progress: 50, description: '50% complete' });
progressToast.success('Import complete!');
```

**UI Design**:
```
Success toast:
┌─────────────────────────────────────┐
│  ✓ Transaction Saved                │
│  Your transaction has been saved.   │
│                              [Undo] │
└─────────────────────────────────────┘

Progress toast:
┌─────────────────────────────────────┐
│  ⏳ Importing Data...               │
│  ████████░░░░░░░  50%              │
│  50 of 100 transactions imported    │
└─────────────────────────────────────┘

Action toast:
┌─────────────────────────────────────┐
│  ⚠️ Budget Exceeded                 │
│  You've exceeded your Food budget.  │
│           [View Budget] [Dismiss]   │
└─────────────────────────────────────┘
```

---

#### 12. Notification Center 🔔
**Priority**: MEDIUM  
**Use Case**: Track all notifications

**Specifications**:

**Features**:
- [ ] Notification bell icon in navbar
- [ ] Unread count badge
- [ ] Notification list with categories
- [ ] Mark as read/unread
- [ ] Clear all notifications
- [ ] Notification preferences

**Component Structure**:
```tsx
// src/components/NotificationCenter.tsx
interface Notification {
  id: string;
  type: 'budget_alert' | 'bill_reminder' | 'goal_milestone' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  priority: 'low' | 'normal' | 'high';
}

interface NotificationPreferences {
  budgetAlerts: boolean;
  billReminders: boolean;
  goalUpdates: boolean;
  soundEnabled: boolean;
}
```

**UI Design**:
```
Navbar:
┌─────────────────────────────────────┐
│  [...]                    🔔 [3]   │
└─────────────────────────────────────┘

Dropdown:
┌─────────────────────────────────────┐
│  Notifications                      │
│  [Mark all as read] [Settings]      │
├─────────────────────────────────────┤
│  🔴 Budget Alert                    │
│  Food budget exceeded by 20%        │
│  5 minutes ago               [View] │
├─────────────────────────────────────┤
│  🟡 Bill Reminder                   │
│  Electricity bill due tomorrow      │
│  1 hour ago                  [Pay]  │
├─────────────────────────────────────┤
│  🟢 Goal Milestone                  │
│  You've reached 50% of Emergency    │
│  Fund goal!                         │
│  1 day ago                   [View] │
├─────────────────────────────────────┤
│  [View All Notifications]           │
└─────────────────────────────────────┘
```

---

### Priority 5: Mobile Experience

#### 13. Mobile Bottom Navigation 📱
**Priority**: MEDIUM  
**Use Case**: Better mobile navigation

**Specifications**:

**Features**:
- Bottom tab bar (mobile only)
- Active tab indicator
- Badge for notifications
- Haptic feedback on tap

**Component Structure**:
```tsx
// src/components/MobileNav.tsx
interface NavItem {
  icon: React.ComponentType;
  label: string;
  href: string;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { icon: HomeIcon, label: 'Home', href: '/' },
  { icon: TransactionIcon, label: 'Transactions', href: '/transactions' },
  { icon: PlusIcon, label: 'Add', href: '/transactions?new=true', primary: true },
  { icon: ChartIcon, label: 'Reports', href: '/reports' },
  { icon: SettingsIcon, label: 'Settings', href: '/settings' },
];
```

**UI Design**:
```
┌─────────────────────────────────────┐
│                                     │
│         Page Content                │
│                                     │
├─────────────────────────────────────┤
│  🏠     💰     ➕     📊     ⚙️     │
│  Home  Trans  Add   Reports Settings│
│          [●]                        │
└─────────────────────────────────────┘
```

---

#### 14. Swipe Gestures 👆
**Priority**: LOW  
**Use Case**: Mobile quick actions

**Specifications**:

**Features**:
- Swipe left to delete
- Swipe right to edit
- Pull to refresh
- Swipe to reveal actions

**Component Structure**:
```tsx
// src/components/SwipeableTransaction.tsx
interface SwipeableTransactionProps {
  transaction: Transaction;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function SwipeableTransaction({
  transaction,
  onEdit,
  onDelete,
}: SwipeableTransactionProps) {
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => showDelete(),
    onSwipedRight: () => showEdit(),
  });
  
  return (
    <div {...swipeHandlers}>
      {/* Transaction row with swipe actions */}
    </div>
  );
}
```

**UI Design**:
```
Normal:
┌─────────────────────────────────────┐
│  Grocery Shopping    -Rp 150,000   │
└─────────────────────────────────────┘

Swiping left:
┌─────────────────────────────────────┐
│  Grocery Shopping    -Rp 150,000   │
│                      [✏️ Edit] [🗑️] │
└─────────────────────────────────────┘
```

---

## 🎨 Design System Documentation

### Design Tokens

```typescript
// src/lib/designTokens.ts
export const tokens = {
  // Colors
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
    },
    semantic: {
      income: '#10b981',
      expense: '#ef4444',
      savings: '#14b8a6',
    },
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  
  // Border Radius
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  
  // Animation
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    },
  },
};
```

---

## 📝 Accessibility Guidelines

### Keyboard Navigation
- All interactive elements focusable
- Visible focus indicators
- Logical tab order
- Keyboard shortcuts documented
- Escape closes modals/drawers

### Screen Reader Support
- ARIA labels on all interactive elements
- Live regions for dynamic content
- Descriptive link/button text
- Alt text for images
- Chart descriptions

### Visual Accessibility
- Color contrast ratio ≥ 4.5:1 (WCAG AA)
- Don't rely on color alone
- Support text resizing up to 200%
- Reduced motion option
- Focus visible at all times

---

## 📊 Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Page Load Time | ~3s | <2s |
| Time to Add Transaction | ~30s | <15s |
| Mobile Usability Score | 7/10 | 9/10 |
| Accessibility Score | 70/100 | 90/100 |
| User Satisfaction | Unknown | >4.5/5 |
| Feature Discovery | Unknown | >80% |

---

## 📅 Implementation Priority

### Phase 1 (Sprint 1-2)
1. ✅ Enhanced Sidebar Navigation
2. ✅ Smart Transaction Form
3. ✅ Enhanced Toast System

### Phase 2 (Sprint 3-4)
4. ✅ Command Palette
5. ✅ Advanced Search & Filter
6. ✅ Summary Cards with Trends

### Phase 3 (Sprint 5-6)
7. ✅ Breadcrumb Navigation
8. ✅ Page Header Component
9. ✅ Enhanced Transaction Table

### Phase 4 (Sprint 7-8)
10. ✅ Inline Editing
11. ✅ Transaction Detail Drawer
12. ✅ Notification Center
13. ✅ Mobile Bottom Navigation
14. ✅ Swipe Gestures

---

**Document Version**: 1.0  
**Last Updated**: 24 February 2026  
**Status**: Ready for Implementation
