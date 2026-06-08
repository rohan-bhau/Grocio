"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { FiGrid, FiBell, FiTruck, FiClock, FiLogOut } from "react-icons/fi";
import logoImg from "@/../public/assets/logo.png";

const DeliverySidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <FiGrid size={18} />,
      href: "/delivery",
    },
    {
      name: "New Requests",
      icon: <FiBell size={18} />,
      href: "/delivery/requests",
    },
    {
      name: "Active Orders",
      icon: <FiTruck size={18} />,
      href: "/delivery/active-order",
    },
    {
      name: "Order History",
      icon: <FiClock size={18} />,
      href: "/delivery/order-history",
    },
  ];

  return (
    <aside className="w-64 bg-white text-gray-700 hidden md:flex flex-col fixed inset-y-0 left-0 z-50 shadow-sm border-r border-gray-200">
      {/* Brand Logo Section */}
      <div className="h-20 flex items-center px-6 border-b border-gray-100">
        <Link href="/delivery/dashboard" className="flex items-center gap-2">
          <Image
            src={logoImg}
            alt="Grocio Logo"
            width={130}
            height={40}
            className="object-contain"
            priority
          />
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 flex-1 space-y-1">
        <p className="text-[10px] uppercase font-black text-gray-400 px-3 mb-4 tracking-widest">
          Delivery Panel
        </p>

        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 group ${
                isActive
                  ? "bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100/50"
                  : "text-gray-500 hover:bg-gray-50/80 hover:text-gray-900"
              }`}
            >
              <span
                className={`transition-colors duration-200 ${
                  isActive
                    ? "text-emerald-600"
                    : "text-gray-400 group-hover:text-emerald-500"
                }`}
              >
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Action Section */}
      <div className="p-4 border-t border-gray-100 space-y-3">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-rose-500 hover:bg-rose-50 transition-all duration-200 group"
        >
          <FiLogOut
            size={18}
            className="text-rose-400 group-hover:text-rose-500 transition-colors"
          />
          <span>Logout</span>
        </button>

        <div className="text-[10px] text-gray-400 text-center font-semibold tracking-wide">
          &copy; 2026 Grocio Delivery
        </div>
      </div>
    </aside>
  );
};

export default DeliverySidebar;
