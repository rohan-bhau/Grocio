"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingCart,
  FiSearch,
  FiLogOut,
  FiBox,
  FiGrid,
  FiPlusCircle,
  FiList,
  FiBell,
  FiClock,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { LuBoxes, LuUserRound } from "react-icons/lu";
import logo from "@/assets/nav-logo.png";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const {cartData} = useSelector((state:RootState)=>state.cart)

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

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isSidebarOpen]);

  return (
    <>
      {/* ======================= MOBILE SIDEBAR (ADMIN & DELIVERY ONLY) ======================= */}
      <AnimatePresence>
        {isSidebarOpen && user?.role !== "user" && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            />

            <motion.div
              ref={sidebarRef}
              initial={{ x: "100%" }} // Eita ekhon right theke ashbe (tumi chaile -100% diye left thekeo ante paro)
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-[70] flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 border-2 border-white/50 flex items-center justify-center">
                    {user?.image ? (
                      <Image
                        src={user.image}
                        width={48}
                        height={48}
                        alt="user"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <LuUserRound className="text-white text-xl" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg leading-tight truncate w-32">
                      {user?.name || "User"}
                    </h2>
                    <p className="text-green-100 text-xs font-medium capitalize">
                      {user?.role} Panel
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Sidebar Links */}
              <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                {/* Admin Links */}
                {user?.role === "admin" && (
                  <>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-2">
                      Main Menu
                    </h3>
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all group font-medium"
                    >
                      <div className="p-2 bg-gray-100 group-hover:bg-green-100 rounded-lg transition-colors">
                        <FiGrid className="text-gray-500 group-hover:text-green-600" />
                      </div>{" "}
                      Dashboard
                    </Link>
                    <Link
                      href="/admin/add-grocery"
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all group font-medium"
                    >
                      <div className="p-2 bg-gray-100 group-hover:bg-green-100 rounded-lg transition-colors">
                        <FiPlusCircle className="text-gray-500 group-hover:text-green-600" />
                      </div>{" "}
                      Add Grocery
                    </Link>
                    <Link
                      href="/admin/view-groceries"
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all group font-medium"
                    >
                      <div className="p-2 bg-gray-100 group-hover:bg-green-100 rounded-lg transition-colors">
                        <LuBoxes className="text-gray-500 group-hover:text-green-600" />
                      </div>{" "}
                      View Products
                    </Link>
                    <Link
                      href="/admin/manage-orders"
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all group font-medium"
                    >
                      <div className="p-2 bg-gray-100 group-hover:bg-green-100 rounded-lg transition-colors">
                        <FiList className="text-gray-500 group-hover:text-green-600" />
                      </div>{" "}
                      Manage Orders
                    </Link>
                  </>
                )}

                {/* Delivery Boy Links */}
                {user?.role === "deliveryBoy" && (
                  <>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-2">
                      Deliveries
                    </h3>
                    <Link
                      href="/delivery/dashboard"
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-all group font-medium"
                    >
                      <div className="p-2 bg-gray-100 group-hover:bg-yellow-100 rounded-lg transition-colors">
                        <FiGrid className="text-gray-500 group-hover:text-yellow-600" />
                      </div>{" "}
                      Dashboard
                    </Link>
                    <Link
                      href="/delivery/requests"
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-all group font-medium"
                    >
                      <div className="p-2 bg-gray-100 group-hover:bg-yellow-100 rounded-lg transition-colors">
                        <FiBell className="text-gray-500 group-hover:text-yellow-600" />
                      </div>{" "}
                      New Requests
                    </Link>
                    <Link
                      href="/delivery/history"
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-all group font-medium"
                    >
                      <div className="p-2 bg-gray-100 group-hover:bg-yellow-100 rounded-lg transition-colors">
                        <FiClock className="text-gray-500 group-hover:text-yellow-600" />
                      </div>{" "}
                      History
                    </Link>
                  </>
                )}
              </div>

              {/* === LOGOUT BUTTON IN SIDEBAR BOTTOM === */}
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => signOut()}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors"
                >
                  <FiLogOut className="text-lg" />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ======================= MAIN TOP NAVBAR ======================= */}
      <div
        suppressHydrationWarning
        className="w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-600 to-green-800 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300 flex items-center justify-between h-20 px-4 md:px-8 z-50"
      >
        {/* 1. LEFT SIDE: LOGO */}
        <div className="flex-1 flex justify-start">
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
        </div>

        {/* 2. MIDDLE SIDE: SEARCH (USER) OR QUICK LINKS (ADMIN/DELIVERY) FOR DESKTOP ONLY */}
        <div className="hidden md:flex flex-[1.5] justify-center items-center gap-4">
          {user?.role === "user" && (
            <div className="relative w-full max-w-md group">
              <FiSearch className="absolute left-3 top-3 text-gray-400 group-focus-within:text-green-600 transition duration-300" />
              <input
                type="text"
                placeholder="Search groceries..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/95 backdrop-blur-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/70 focus:shadow-[0_0_10px_rgba(255,255,255,0.6)] transition-all duration-300"
              />
            </div>
          )}

          {user?.role === "admin" && (
            <>
              <Link
                href="/admin/add-grocery"
                className="flex items-center gap-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm border border-white/10"
              >
                <FiPlusCircle className="text-lg" /> Add Grocery
              </Link>
              <Link
                href="/admin/view-groceries"
                className="flex items-center gap-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm border border-white/10"
              >
                <LuBoxes className="text-lg" /> View Products
              </Link>
              <Link
                href="/admin/manage-orders"
                className="flex items-center gap-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm border border-white/10"
              >
                <FiList className="text-lg" /> Manage Orders
              </Link>
            </>
          )}

          {user?.role === "deliveryBoy" && (
            <>
              <Link
                href="/delivery/requests"
                className="flex items-center gap-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm border border-white/10"
              >
                <FiBell className="text-lg" /> New Requests
              </Link>
              <Link
                href="/delivery/history"
                className="flex items-center gap-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm border border-white/10"
              >
                <FiClock className="text-lg" /> History
              </Link>
            </>
          )}
        </div>

        {/* 3. RIGHT SIDE: CART, MENU ICON & PROFILE */}
        <div className="flex-1 flex justify-end items-center gap-4 md:gap-6">
          {/* USER: MOBILE SEARCH ICON */}
          {user?.role === "user" && (
            <div className="md:hidden" ref={searchRef}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-lg transition-all duration-300 hover:bg-white/15 hover:scale-110 active:scale-95"
              >
                <FiSearch className="text-white text-xl" />
              </button>
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
          )}

          {/* USER: CART ICON */}
          {user?.role === "user" && (
            <Link
              href="/user/cart"
              className="relative p-2 rounded-lg transition-all duration-300 hover:bg-white/15 hover:scale-110 active:scale-95"
            >
              <FiShoppingCart className="text-white text-xl" />
              
             

              <span className={`${cartData.length===0? "hidden" : ""} absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full`}>
                {cartData.length}
              </span>
            </Link>
          )}

          {/* ADMIN & DELIVERY: MOBILE HAMBURGER ICON (ON RIGHT SIDE) */}
          {user?.role !== "user" && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
              <FiMenu className="text-xl" />
            </button>
          )}

          {/* PROFILE W/ DROPDOWN (GLOBAL) */}
          <div className="relative" ref={profileRef}>
            <div
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30 transition-all duration-300 group-hover:scale-110 group-hover:border-white bg-white/10 flex items-center justify-center shadow-inner">
                {user?.image ? (
                  <Image
                    src={user.image}
                    width={32}
                    height={32}
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <LuUserRound className="text-white" />
                )}
              </div>
              <span className="hidden md:block text-sm text-white font-medium transition-all duration-300 group-hover:underline underline-offset-4">
                {user?.name?.split(" ")[0] || "Account"}
              </span>
            </div>

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
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
                      {user?.image ? (
                        <Image
                          src={user.image}
                          width={40}
                          height={40}
                          alt="user"
                          className="w-full h-full object-cover"
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
                    {user?.role === "admin" && (
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-all"
                      >
                        <FiGrid className="text-lg text-gray-400" /> Dashboard
                      </Link>
                    )}
                    {user?.role === "deliveryBoy" && (
                      <Link
                        href="/delivery/dashboard"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-yellow-50 hover:text-yellow-700 transition-all"
                      >
                        <FiGrid className="text-lg text-gray-400" /> Dashboard
                      </Link>
                    )}
                    {user?.role === "user" && (
                      <Link
                        href="/user/my-orders"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-green-50 hover:text-green-700 transition-all"
                      >
                        <FiBox className="text-lg text-gray-400" /> My Orders
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 w-full text-left mt-1 border-t border-gray-50 transition-all"
                    >
                      <FiLogOut className="text-lg text-gray-400" /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
