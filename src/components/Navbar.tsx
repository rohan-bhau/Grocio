"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiSearch, FiLogOut, FiBox } from "react-icons/fi";
import { LuUserRound } from "react-icons/lu";
import logo from "@/assets/nav-logo.png";

interface IUser {
  _id?: any;
  name: string;
  email: string;
  role: "user" | "deliveryBoy" | "admin";
  image?: string;
}

const Navbar = ({ user }: { user: IUser }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      suppressHydrationWarning
      className="w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-green-600 to-green-800 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300 flex items-center justify-between h-20 px-4 md:px-8 z-50"
    >
      {/* LOGO */}
      <Link href="/" className="flex items-center group">
        <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm transition-all duration-300 group-hover:scale-[1.05] group-hover:shadow-md">
          <Image
            src={logo}
            width={120}
            height={40}
            alt="Grocio logo"
            priority
            style={{ height: "auto" }}
          />
        </div>
      </Link>

      {/* DESKTOP SEARCH */}
      <div className="hidden md:flex w-full max-w-md mx-6">
        <div className="relative w-full group">
          <FiSearch className="absolute left-3 top-3 text-gray-400 group-focus-within:text-green-600 transition duration-300" />
          <input
            type="text"
            placeholder="Search groceries..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/95 backdrop-blur-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/70 focus:shadow-[0_0_10px_rgba(255,255,255,0.6)] transition-all duration-300"
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* MOBILE SEARCH ICON */}
        <div className="md:hidden" ref={searchRef}>
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 rounded-lg transition-all duration-300 hover:bg-white/15 hover:scale-110 active:scale-95"
          >
            <FiSearch className="text-white text-xl" />
          </button>

          {/* MOBILE SEARCH DROPDOWN */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-[85px] left-0 w-full px-2 sm:px-0"
              >
                <div className="w-full bg-white p-3 rounded-xl shadow-xl border border-gray-100">
                  <div className="relative w-full">
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search groceries..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CART */}
        <Link
          href="/cart"
          className="relative p-2 rounded-lg transition-all duration-300 hover:bg-white/15 hover:scale-110 active:scale-95"
        >
          <FiShoppingCart className="text-white text-xl" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            0
          </span>
        </Link>

        {/* PROFILE W/ DROPDOWN */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30 transition-all duration-300 group-hover:scale-110 group-hover:border-white">
              {user?.image ? (
                <Image src={user.image} width={32} height={32} alt="user" />
              ) : (
                <div className="w-full h-full bg-white/20 flex items-center justify-center">
                  <LuUserRound className="text-white" />
                </div>
              )}
            </div>

            <span className="hidden md:block text-sm text-white font-medium transition-all duration-300 group-hover:underline underline-offset-4">
              {user?.name?.split(" ")[0] || "Account"}
            </span>
          </div>

          {/* PROFILE DROPDOWN MENU */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsProfileOpen(false)}
                className="absolute right-0 mt-4 w-56 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {user?.image ? (
                      <Image
                        src={user.image}
                        width={40}
                        height={40}
                        alt="user"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600">
                        <LuUserRound size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 truncate w-32">
                      {user?.name || "Guest User"}
                    </span>
                    <span className="text-xs font-medium text-green-600 capitalize">
                      {user?.role || "User"}
                    </span>
                  </div>
                </div>

                <div className="p-2 flex flex-col gap-1">
                  <Link
                    href="/my-orders"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 transition-all duration-300 hover:bg-green-50 hover:text-green-700 group"
                  >
                    <FiBox className="text-lg text-gray-400 group-hover:text-green-600 transition-colors" />
                    My Orders
                  </Link>

                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 transition-all duration-300 hover:bg-red-50 hover:text-red-600 group w-full text-left"
                  >
                    <FiLogOut className="text-lg text-gray-400 group-hover:text-red-500 transition-colors" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
