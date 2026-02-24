import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { TransactionProvider } from "@/context/TransactionContext";
import { AssetProvider } from "@/context/AssetContext";
import { InvestmentProvider } from "@/context/InvestmentContext";
import { BudgetProvider } from "@/context/BudgetContext";
import { DashboardProvider } from "@/context/DashboardContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CashTrack - Personal Finance Tracker",
  description: "Track your income, expenses, assets, and investments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              const saved = localStorage.getItem("theme");
              const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
              if (saved === "dark" || (!saved && prefersDark)) {
                document.documentElement.classList.add("dark");
              }
            })()`,
          }}
        />
      </head>
      <body className="flex min-h-screen min-h-dvh bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 text-gray-900 dark:text-gray-100 antialiased relative overflow-x-hidden overflow-y-scroll">
        <AnimatedBackground />
        <TransactionProvider>
          <AssetProvider>
            <InvestmentProvider>
              <BudgetProvider>
                <DashboardProvider>
                  <Sidebar />
                  <div className="flex-1 flex flex-col relative z-10 min-w-0 min-h-screen min-h-dvh">
                    <Navbar />
                    <main className="p-3 sm:p-4 md:p-6 lg:p-8 flex-1 w-full overflow-x-hidden overflow-y-auto">
                      {children}
                    </main>
                  </div>
                </DashboardProvider>
              </BudgetProvider>
            </InvestmentProvider>
          </AssetProvider>
        </TransactionProvider>
      </body>
    </html>
  );
}
