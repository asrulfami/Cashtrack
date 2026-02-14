"use client";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  const menuItems = [
    { href: "/", icon: "🏠", label: "Dashboard" },
    { href: "/transactions", icon: "💰", label: "Transaksi" },
    { href: "/reports", icon: "📊", label: "Laporan" },
    { href: "/settings", icon: "⚙️", label: "Pengaturan" },
  ];

  return (
    <aside
      className={`sidebar ${open ? "w-64" : "w-20"} transition-[width] duration-500 ease-in-out`}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Tombol collapse */}
        <button
          onClick={() => setOpen(!open)}
          className="mb-6 text-sm bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
        >
          {open ? "Collapse" : "Expand"}
        </button>

        {/* Navigasi */}
        <nav className="flex flex-col gap-4 flex-1">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              <span className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                {item.icon}
              </span>
              {open && item.label}
            </Link>
          ))}
        </nav>

        {/* Footer sidebar */}
        <div className="mt-auto">
          <div className="bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:rotate-6">
            N
          </div>
        </div>
      </div>
    </aside>
  );
}
