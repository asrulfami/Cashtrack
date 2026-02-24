# CashTrack Visualization Enhancement Plan

**Date**: 24 February 2026  
**Focus**: Charts, Graphs & Data Visualization

---

## 📊 Current Visualization Status

### Implemented Charts

| Chart | Component | Type | Status | Interactivity |
|-------|-----------|------|--------|---------------|
| Cash Flow | `CashFlowChart.tsx` | ComposedChart (Line + Area) | ✅ Good | ✅ High |
| Category Distribution | `CategoryChart.tsx` | PieChart (Donut) | ✅ Good | ✅ High |
| Budget vs Actual | `BudgetBarChart.tsx` | BarChart (Grouped) | ✅ Good | ✅ High |
| Asset Distribution | `CategoryChart.tsx` | PieChart | ✅ Basic | ❌ None |
| Investment Distribution | `CategoryChart.tsx` | PieChart | ✅ Basic | ❌ None |

### Visualization Strengths
- ✅ Consistent color system via `getCategoryColor()`
- ✅ Dark mode support across all charts
- ✅ Interactive filtering (click to highlight/filter)
- ✅ Custom tooltips with formatted data
- ✅ Responsive design (ResponsiveContainer)
- ✅ Smooth animations and transitions
- ✅ Cross-chart synchronization via DashboardContext

### Visualization Weaknesses
- ⚠️ No net worth tracking visualization
- ⚠️ No trend indicators (up/down arrows)
- ⚠️ Limited comparative analysis (vs last period)
- ⚠️ No data export from charts
- ⚠️ Missing advanced chart types (heatmap, gauge, etc.)
- ⚠️ Limited mobile optimization for tooltips
- ⚠️ No chart customization options

---

## 🎯 New Visualizations to Implement

### Priority 1: Essential Financial Charts

#### 1. Net Worth Trend Chart 📈
**Priority**: HIGH  
**Use Case**: Track overall financial health over time

**Specification**:
```typescript
type NetWorthData = {
  date: string;
  assets: number;
  investments: number;
  liabilities?: number;
  netWorth: number; // assets + investments - liabilities
};
```

**Chart Type**: Multi-line chart with area fill  
**Features**:
- Line for net worth (primary, bold)
- Stacked area for assets + investments
- Optional liability line
- Trend indicator (vs previous period)
- Milestone markers (round numbers)
- Export as image

**Implementation**:
```tsx
// src/components/NetWorthChart.tsx
import { AreaChart, Area, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function NetWorthChart({ data, interactive = true }) {
  // Implementation with:
  // - Gradient fills for assets/investments
  // - Bold line for net worth
  // - Custom tooltip with breakdown
  // - Click to see details
}
```

**UI Placement**: Dashboard (new row), Reports page

---

#### 2. Income vs Expense Comparison Chart ⚖️
**Priority**: HIGH  
**Use Case**: Monthly comparison with variance analysis

**Specification**:
```typescript
type ComparisonData = {
  month: string;
  income: number;
  expense: number;
  variance: number; // income - expense
  savingsRate: number; // (income - expense) / income * 100
};
```

**Chart Type**: Bar + Line combo (dual axis)  
**Features**:
- Bars for income/expense (grouped)
- Line for savings rate % (right axis)
- Color-coded variance (green/red)
- Target savings rate line
- Month-over-month change indicators

**Implementation**:
```tsx
// src/components/IncomeExpenseChart.tsx
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function IncomeExpenseChart({ data, targetSavingsRate = 20 }) {
  // Implementation with:
  // - Dual Y-axis (amount + percentage)
  // - Grouped bars for income/expense
  // - Line for savings rate
  // - Reference line for target savings rate
}
```

**UI Placement**: Dashboard, Reports page

---

#### 3. Category Trend Analysis Chart 📊
**Priority**: HIGH  
**Use Case**: Track spending categories over time

**Specification**:
```typescript
type CategoryTrendData = {
  month: string;
  [category: string]: number; // dynamic categories
};
```

**Chart Type**: Stacked area chart or multi-line  
**Features**:
- Top 5 categories shown
- "Others" grouped
- Toggle between stacked/individual
- Category color consistency
- Trend indicators per category

**Implementation**:
```tsx
// src/components/CategoryTrendChart.tsx
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function CategoryTrendChart({ 
  data, 
  categories, 
  mode = 'stacked' // 'stacked' | 'individual'
}) {
  // Implementation with:
  // - Dynamic category lines/areas
  // - Consistent colors from getCategoryColor()
  // - Toggle between modes
  // - Category visibility toggle
}
```

**UI Placement**: Reports page, Category detail view

---

#### 4. Budget Progress Gauge 🎯
**Priority**: MEDIUM  
**Use Case**: Visual budget utilization per category

**Specification**:
```typescript
type BudgetGaugeData = {
  category: string;
  budget: number;
  actual: number;
  percentage: number;
  daysRemaining: number;
  projectedSpend: number;
};
```

**Chart Type**: Radial bar / Gauge chart  
**Features**:
- Semi-circle gauge per category
- Color-coded zones (green <80%, yellow 80-100%, red >100%)
- Days remaining indicator
- Projected overspend warning
- Click to see details

**Implementation**:
```tsx
// src/components/BudgetGauge.tsx
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

export default function BudgetGauge({ data }) {
  // Implementation with:
  // - Semi-circle gauge
  // - Color zones
  // - Center text showing percentage
  // - Tooltip with details
}
```

**UI Placement**: Dashboard, Budget management page

---

### Priority 2: Advanced Analytics Charts

#### 5. Cash Flow Calendar Heatmap 📅
**Priority**: MEDIUM  
**Use Case**: Daily cash flow patterns

**Specification**:
```typescript
type CalendarData = {
  date: string;
  income: number;
  expense: number;
  net: number;
};
```

**Chart Type**: Calendar heatmap  
**Features**:
- Color intensity based on net flow
- Green for positive, red for negative
- Tooltip with daily breakdown
- Month view toggle
- Click to see day's transactions

**Implementation**:
```tsx
// src/components/CashFlowCalendar.tsx
import { CalendarHeatmap } from 'react-calendar-heatmap';

export default function CashFlowCalendar({ data, year = 2026 }) {
  // Implementation with:
  // - Color scale for net flow
  // - Tooltip with date details
  // - Month labels
  // - Click handler for day details
}
```

**UI Placement**: Reports page, Analytics section

---

#### 6. Savings Rate Trend Chart 💰
**Priority**: MEDIUM  
**Use Case**: Track savings rate over time

**Specification**:
```typescript
type SavingsRateData = {
  month: string;
  savingsRate: number; // percentage
  targetRate: number;
  income: number;
  savings: number;
};
```

**Chart Type**: Line chart with target line  
**Features**:
- Line for actual savings rate
- Horizontal line for target rate
- Area fill below line
- Milestone markers (25%, 50%, etc.)
- Trend line (linear regression)

**Implementation**:
```tsx
// src/components/SavingsRateChart.tsx
import { LineChart, Line, ReferenceLine, XAxis, YAxis, Tooltip } from 'recharts';

export default function SavingsRateChart({ data, targetRate }) {
  // Implementation with:
  // - Line for actual rate
  // - Reference line for target
  // - Percentage Y-axis
  // - Custom tooltip
}
```

**UI Placement**: Dashboard, Goals page

---

#### 7. Investment Performance Chart 📊
**Priority**: MEDIUM  
**Use Case**: Portfolio performance tracking

**Specification**:
```typescript
type InvestmentPerformanceData = {
  date: string;
  totalValue: number;
  costBasis: number;
  gainLoss: number;
  gainLossPercent: number;
};

type InvestmentAllocationData = {
  name: string;
  value: number;
  percent: number;
  gainLoss: number;
};
```

**Chart Type**: 
- Performance: Line chart with cost basis
- Allocation: Pie/Donut chart

**Features**:
- Portfolio value over time
- Cost basis comparison
- Asset allocation breakdown
- Individual investment performance
- Rebalance suggestions

**Implementation**:
```tsx
// src/components/InvestmentPerformanceChart.tsx
import { LineChart, Line, Area, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function InvestmentPerformanceChart({ data }) {
  // Implementation with:
  // - Line for portfolio value
  // - Area for cost basis
  // - Gain/loss indicators
  // - Custom tooltip with breakdown
}
```

**UI Placement**: Investments page, Dashboard

---

#### 8. Payment Method Distribution 💳
**Priority**: LOW  
**Use Case**: Understand payment preferences

**Specification**:
```typescript
type PaymentMethodData = {
  method: string;
  amount: number;
  percent: number;
  transactionCount: number;
};
```

**Chart Type**: Horizontal bar chart or pie chart  
**Features**:
- Breakdown by payment method
- Transaction count overlay
- Monthly trend comparison
- Cash vs card ratio

**Implementation**:
```tsx
// src/components/PaymentMethodChart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function PaymentMethodChart({ data }) {
  // Implementation with:
  // - Horizontal bars
  // - Color coding per method
  // - Tooltip with details
}
```

**UI Placement**: Reports page, Settings

---

### Priority 3: Specialized Visualizations

#### 9. Financial Goals Progress Tracker 🎯
**Priority**: MEDIUM  
**Use Case**: Visual goal progress

**Specification**:
```typescript
type GoalProgressData = {
  goal: string;
  targetAmount: number;
  currentAmount: number;
  percentage: number;
  deadline: string;
  onTrack: boolean;
  projectedDate: string;
};
```

**Chart Type**: Progress bars with timeline  
**Features**:
- Progress bar per goal
- Deadline indicator
- On-track status (green/red)
- Projected completion date
- Milestone markers

**Implementation**:
```tsx
// src/components/GoalsProgress.tsx
import { Progress } from '@/components/ui/progress';

export default function GoalsProgress({ goals }) {
  // Implementation with:
  // - Progress bars
  // - Deadline countdown
  // - Status indicators
  // - Click to edit goal
}
```

**UI Placement**: Goals page, Dashboard widget

---

#### 10. Age-Based Asset Allocation 📊
**Priority**: LOW  
**Use Case**: Retirement planning visualization

**Specification**:
```typescript
type AllocationByAgeData = {
  age: number;
  stocks: number;
  bonds: number;
  cash: number;
  other: number;
};
```

**Chart Type**: Stacked area chart  
**Features**:
- Recommended allocation by age
- Current allocation marker
- Glide path visualization
- Risk level indicator

**Implementation**:
```tsx
// src/components/AssetAllocationChart.tsx
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function AssetAllocationChart({ data, currentAge }) {
  // Implementation with:
  // - Stacked areas for allocation
  // - Current age marker
  // - Recommended glide path
}
```

**UI Placement**: Goals page, Retirement planner

---

## 🎨 Chart Enhancement Features

### Universal Chart Improvements

#### 1. Export Functionality 📤
**Add to all charts**:
```tsx
const exportChart = async () => {
  const svg = chartRef.current;
  const canvas = await rasterizeSVG(svg);
  const blob = await canvasToBlob(canvas, 'image/png');
  downloadBlob(blob, 'chart.png');
};
```

**Features**:
- Export as PNG
- Export as SVG
- Export as PDF
- Copy to clipboard
- Share functionality

---

#### 2. Chart Customization ⚙️
**Add settings panel per chart**:
```tsx
interface ChartSettings {
  showGrid: boolean;
  showLegend: boolean;
  showTooltip: boolean;
  colorScheme: 'default' | 'vibrant' | 'pastel' | 'monochrome';
  animation: boolean;
  dataPoints: boolean;
}
```

**Features**:
- Toggle grid lines
- Toggle legend
- Color scheme selector
- Animation toggle
- Data point visibility

---

#### 3. Comparative Analysis 📊
**Add to time-series charts**:
```tsx
interface ComparisonProps {
  compareWith?: 'previousPeriod' | 'samePeriodLastYear' | 'target';
  showVariance?: boolean;
  showTrendLine?: boolean;
}
```

**Features**:
- Compare with previous period
- Year-over-year comparison
- Variance indicators
- Trend lines (linear regression)
- Moving averages

---

#### 4. Interactive Drill-Down 🔍
**Add to all charts**:
```tsx
interface DrillDownProps {
  onDrillDown?: (data: any) => void;
  drillDownLevel?: 'category' | 'subcategory' | 'transaction';
}
```

**Features**:
- Click to see details
- Navigate to transaction list
- Show subcategories
- Modal with detailed view

---

#### 5. Data Annotations 📝
**Add to all charts**:
```tsx
interface AnnotationProps {
  annotations?: Array<{
    date: string;
    label: string;
    type: 'milestone' | 'alert' | 'note';
  }>;
}
```

**Features**:
- Mark significant events
- Add notes to specific points
- Highlight anomalies
- Custom markers

---

## 📐 Visualization Design System

### Color Palette

#### Primary Colors (Existing)
```typescript
const CATEGORY_COLORS = {
  "Makanan": "#3b82f6",      // Blue
  "Transportasi": "#ef4444", // Red
  "Belanja": "#f97316",      // Orange
  "Hiburan": "#8b5cf6",      // Violet
  "Kesehatan": "#14b8a6",    // Teal
  "Pendidikan": "#d946ef",   // Fuchsia
  "Tagihan": "#84cc16",      // Lime
  "Gaji": "#06b6d4",         // Cyan
  "Investasi": "#eab308",    // Yellow
  "Lainnya": "#ec4899",      // Pink
};
```

#### Semantic Colors (New)
```typescript
const SEMANTIC_COLORS = {
  // Financial
  income: "#10b981",         // Green
  expense: "#ef4444",        // Red
  balance: "#3b82f6",        // Blue
  savings: "#14b8a6",        // Teal
  
  // Status
  positive: "#10b981",       // Green
  negative: "#ef4444",       // Red
  warning: "#f59e0b",        // Amber
  info: "#3b82f6",           // Blue
  
  // Asset Classes
  stocks: "#ef4444",         // Red
  bonds: "#3b82f6",          // Blue
  cash: "#10b981",           // Green
  realEstate: "#f97316",     // Orange
  crypto: "#f59e0b",         // Amber
};
```

#### Chart Gradients (New)
```typescript
const CHART_GRADIENTS = {
  income: {
    from: "#10b981",
    to: "transparent",
  },
  expense: {
    from: "#ef4444",
    to: "transparent",
  },
  netWorth: {
    from: "#3b82f6",
    to: "transparent",
  },
};
```

---

### Typography for Charts

```typescript
const CHART_TYPOGRAPHY = {
  title: {
    fontSize: 16,
    fontWeight: 600,
    fontFamily: 'inherit',
  },
  axisLabel: {
    fontSize: 12,
    fontWeight: 400,
    fontFamily: 'inherit',
  },
  tooltip: {
    fontSize: 13,
    fontWeight: 500,
    fontFamily: 'inherit',
  },
  legend: {
    fontSize: 12,
    fontWeight: 400,
    fontFamily: 'inherit',
  },
};
```

---

### Responsive Breakpoints

```typescript
const CHART_BREAKPOINTS = {
  mobile: {
    width: '100%',
    height: 250,
    fontSize: 10,
    showGrid: false,
  },
  tablet: {
    width: '100%',
    height: 300,
    fontSize: 12,
    showGrid: true,
  },
  desktop: {
    width: '100%',
    height: 350,
    fontSize: 14,
    showGrid: true,
  },
};
```

---

## 🔧 Technical Implementation Guide

### Chart Component Template

```tsx
// src/components/[ChartName].tsx
"use client";

import {
  [ChartType],
  [ChartElements],
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useDarkMode } from "@/hooks/useDarkMode";
import formatCurrency from "@/lib/formatCurrency";
import { useMemo, useState } from "react";

interface [ChartName]Props {
  data: DataType[];
  interactive?: boolean;
  onElementClick?: (data: DataType) => void;
  settings?: ChartSettings;
}

export default function [ChartName]({
  data,
  interactive = true,
  onElementClick,
  settings = {},
}: [ChartName]Props) {
  const { isDark, textColor, gridColor, axisColor } = useDarkMode();
  const [highlight, setHighlight] = useState<string | null>(null);

  const processedData = useMemo(() => {
    // Transform data for chart
    return data;
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    
    return (
      <div className={`p-4 rounded-lg shadow-lg border ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        {/* Tooltip content */}
      </div>
    );
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <p>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={300}>
        <[ChartType] data={processedData}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="xAxisKey"
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={{ stroke: axisColor }}
          />
          <YAxis
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={{ stroke: axisColor }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            onClick={interactive ? handleLegendClick : undefined}
          />
          {/* Chart elements */}
        </[ChartType]>
      </ResponsiveContainer>
      
      {interactive && (
        <div className="text-center mt-2 text-xs text-gray-500">
          💡 Click to interact
        </div>
      )}
    </div>
  );
}
```

---

### Data Transformation Hooks

```tsx
// src/hooks/useChartData.ts
import { useMemo } from 'react';
import { type Transaction } from '@/types';

export function useNetWorthData(
  transactions: Transaction[],
  assets: Asset[],
  investments: Investment[]
) {
  return useMemo(() => {
    // Calculate net worth over time
    const data = [];
    // Implementation
    return data;
  }, [transactions, assets, investments]);
}

export function useCategoryTrendData(
  transactions: Transaction[],
  topN = 5
) {
  return useMemo(() => {
    // Get top N categories over time
    const data = [];
    // Implementation
    return data;
  }, [transactions, topN]);
}

export function useSavingsRateData(
  transactions: Transaction[]
) {
  return useMemo(() => {
    // Calculate monthly savings rate
    const data = [];
    // Implementation
    return data;
  }, [transactions]);
}
```

---

## 📱 Mobile Optimization

### Touch-Friendly Interactions
- Larger click targets (min 44x44px)
- Swipe to navigate charts
- Pinch to zoom (if applicable)
- Pull to refresh data

### Tooltip Optimization
- Full-width bottom sheet on mobile
- Larger text size
- Simplified information
- Easy dismiss

### Layout Adjustments
- Vertical layout for legends
- Simplified axis labels
- Fewer data points visible
- Progressive loading

---

## 🎯 Implementation Priority

### Phase 1 (Sprint 1-2)
1. ✅ Net Worth Trend Chart
2. ✅ Income vs Expense Comparison
3. ✅ Budget Progress Gauge

### Phase 2 (Sprint 3-4)
4. ✅ Category Trend Analysis
5. ✅ Savings Rate Trend
6. ✅ Investment Performance

### Phase 3 (Sprint 5-6)
7. ✅ Cash Flow Calendar
8. ✅ Payment Method Distribution
9. ✅ Financial Goals Progress

### Phase 4 (Sprint 7-8)
10. ✅ Age-Based Allocation
11. ✅ Universal enhancements (export, customization)
12. ✅ Mobile optimization

---

## 📊 Success Metrics for Visualizations

| Metric | Current | Target |
|--------|---------|--------|
| Chart Load Time | ~1s | <500ms |
| Interaction Latency | ~200ms | <100ms |
| Mobile Usability | 7/10 | 9/10 |
| Data Accuracy | 10/10 | 10/10 |
| User Engagement | Unknown | +30% |
| Export Usage | N/A | >20% users |

---

## 📝 Testing Checklist for Charts

- [ ] Renders with empty data
- [ ] Renders with single data point
- [ ] Renders with large dataset (1000+ points)
- [ ] Responsive on mobile/tablet/desktop
- [ ] Dark mode support
- [ ] Tooltip displays correctly
- [ ] Legend interaction works
- [ ] Click handlers fire correctly
- [ ] Animations smooth (60fps)
- [ ] Export functionality works
- [ ] Accessibility (keyboard navigation)
- [ ] Screen reader descriptions

---

**Document Version**: 1.0  
**Last Updated**: 24 February 2026  
**Status**: Ready for Implementation
