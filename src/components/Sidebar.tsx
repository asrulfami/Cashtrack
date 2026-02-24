"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { href: "/", icon: "🏠", label: "Dashboard", gradient: "from-blue-500 to-cyan-500" },
    { href: "/transactions", icon: "💳", label: "Transaksi", gradient: "from-green-500 to-emerald-500" },
    { href: "/assets", icon: "🏦", label: "Aset", gradient: "from-orange-500 to-red-500" },
    { href: "/investments", icon: "📈", label: "Investasi", gradient: "from-purple-500 to-pink-500" },
    { href: "/reports", icon: "📊", label: "Laporan", gradient: "from-indigo-500 to-blue-500" },
    { href: "/settings", icon: "⚙️", label: "Pengaturan", gradient: "from-gray-500 to-gray-700" },
  ];

  const toggleMobile = () => setMobileOpen(!mobileOpen);
  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile menu button - visible only on mobile */}
      <button
        onClick={toggleMobile}
        className="md:hidden fixed top-3 left-3 z-50 p-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 touch-manipulation"
        aria-label="Toggle menu"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity touch-none"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${open ? "w-64" : "w-20"}
          sidebar transition-[width] duration-300 ease-in-out
          fixed md:static inset-y-0 left-0 z-40
          transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          md:w-auto
          max-w-[85vw] md:max-w-none
        `}
      >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-purple-600/10 to-green-600/10 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-green-900/20" />

      {/* Glass effect overlay */}
      <div className="absolute inset-0 backdrop-blur-xl bg-white/30 dark:bg-gray-900/30" />

      <div className="relative p-2 flex flex-col h-full z-10">
        {/* Logo dengan glow effect */}
        <div
          className={`flex items-center justify-center py-3 sm:py-4 mb-3 sm:mb-4 ${open ? "px-2" : "px-1"}`}
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-pulse" />
            <Logo size="md" showText={false} />
          </div>
        </div>

        {/* Toggle button dengan gradient */}
        <button
          onClick={() => setOpen(!open)}
          className="mb-3 sm:mb-4 p-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 touch-manipulation"
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <svg
            className={`w-5 h-5 text-white transition-transform duration-300 ${open ? "" : "rotate-180"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Navigation dengan enhanced styling */}
        <nav className="flex flex-col gap-1 sm:gap-1.5 flex-1 overflow-y-auto pb-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  group relative overflow-hidden
                  nav-link
                  ${isActive
                    ? "nav-link-active shadow-lg"
                    : "hover:bg-white/50 dark:hover:bg-gray-700/50"
                  }
                  transition-all duration-300
                  hover:scale-105 hover:shadow-lg
                  active:scale-95
                  touch-manipulation
                `}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {/* Active indicator dengan gradient */}
                {isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-20`} />
                )}
                
                {/* Icon dengan glow saat hover */}
                <span className="text-lg sm:text-xl relative z-10 group-hover:scale-125 transition-transform duration-300">
                  {item.icon}
                </span>

                {open && (
                  <>
                    <span className="font-semibold text-xs sm:text-sm relative z-10 line-clamp-2">{item.label}</span>
                    {isActive && (
                      <span
                        className={`ml-auto w-2 h-2 rounded-full bg-gradient-to-r ${item.gradient} animate-pulse shadow-lg flex-shrink-0`}
                        style={{
                          boxShadow: `0 0 10px currentColor`
                        }}
                      />
                    )}
                  </>
                )}
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Link>
            );
          })}
        </nav>

        {/* Footer dengan gradient */}
        {open && (
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            <div className="text-center">
              <p className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CashTrack v0.1.0
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                Personal Finance Tracker
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
    </>
  );
}
