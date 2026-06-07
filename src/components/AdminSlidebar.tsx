"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react"; 
import {
  FiGrid,
  FiPlusCircle,
  FiBox,
  FiTrendingUp,
  FiLogOut,
} from "react-icons/fi";
import logoImg from "@/../public/assets/logo.png";

const AdminSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <FiGrid size={18} />, href: "/admin" }, 
    {
      name: "Add Grocery",
      icon: <FiPlusCircle size={18} />,
      href: "/admin/add-grocery",
    },
    {
      name: "View Products",
      icon: <FiBox size={18} />,
      href: "/admin/view-groceries",
    },
    {
      name: "Manage Orders",
      icon: <FiTrendingUp size={18} />,
      href: "/admin/manage-orders",
    },
  ];

  return (
    <aside className="w-64 bg-white text-gray-700 hidden md:flex flex-col fixed inset-y-0 left-0 z-50 shadow-sm border-r border-gray-200">
      <div className="h-20 flex items-center px-6 border-b border-gray-100 gap-2">
        <Link href="/admin" className="flex items-center gap-2">
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

      <nav className="p-4 flex-1 space-y-1">
        <p className="text-xs uppercase font-bold text-gray-400 px-3 mb-4 tracking-wider">
          Admin Panel
        </p>

        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-green-50 text-green-600 shadow-sm border border-green-100/50" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span
                className={`transition-colors duration-200 ${
                  isActive
                    ? "text-green-600"
                    : "text-gray-400 group-hover:text-green-500"
                }`}
              >
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-3">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })} 
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-all duration-200 group"
        >
          <FiLogOut
            size={18}
            className="text-red-400 group-hover:text-red-500 transition-colors"
          />
          <span>Logout</span>
        </button>

        <div className="text-[10px] text-gray-400 text-center font-medium">
          &copy; 2026 Grocio Admin
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
