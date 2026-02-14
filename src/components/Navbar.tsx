"use client";
import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between bg-white dark:bg-gray-900 shadow px-6 py-3 relative">
      {/* Logo */}
      <div className="text-xl font-bold text-gray-900 dark:text-white">
        CashTrack
      </div>

      {/* Menu desktop */}
      <div className="hidden md:flex gap-4 text-gray-700 dark:text-gray-200">
        <Link href="/">Dashboard</Link>
        <Link href="/transactions">Transaksi</Link>
        <Link href="/reports">Laporan</Link>
        <Link href="/settings">Pengaturan</Link>
      </div>

      {/* User + DarkMode */}
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-700 dark:text-gray-200">
          Asrul
        </span>
        <img src="/avatar.png" alt="avatar" className="w-8 h-8 rounded-full" />
        <DarkModeToggle />

        {/* Hamburger menu (mobile) */}
        <button
          className="md:hidden ml-2 text-gray-700 dark:text-gray-200"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Dropdown mobile */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-md flex flex-col gap-2 p-4 md:hidden z-50">
          <Link
            href="/"
            className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
          >
            Dashboard
          </Link>
          <Link
            href="/transactions"
            className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
          >
            Transaksi
          </Link>
          <Link
            href="/reports"
            className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
          >
            Laporan
          </Link>
          <Link
            href="/settings"
            className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
          >
            Pengaturan
          </Link>
        </div>
      )}
    </nav>
  );
}
