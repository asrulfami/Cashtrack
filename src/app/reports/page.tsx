'use client';

import React from 'react';
import SummaryCard from '@/components/SummaryCard';
import CashFlowChart from '@/components/CashFlowChart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

// Mock data for spending by category
const categoryData = [
  { name: 'Food', value: 400 },
  { name: 'Transportation', value: 300 },
  { name: 'Utilities', value: 200 },
  { name: 'Entertainment', value: 250 },
  { name: 'Other', value: 150 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ReportsPage = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Reports
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <SummaryCard title="Total Income" value={12500000} type="income" />
          <SummaryCard title="Total Expense" value={7800000} type="expense" />
          <SummaryCard title="Net Income" value={4700000} type="balance" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <CashFlowChart />
          </div>
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Spending by Category
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;