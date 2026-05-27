"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiShieldOff, FiArrowLeft, FiHome } from "react-icons/fi";

const Unauthorized = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white p-8 md:p-12 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-lg w-full text-center border border-gray-100"
      >
        {/* Animated Shield Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Ping effect for attention */}
            <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-60"></div>
            <div className="bg-red-100 p-5 rounded-full relative z-10 shadow-inner">
              <FiShieldOff className="text-red-500 w-16 h-16 md:w-20 md:h-20" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight drop-shadow-sm">
          Access Denied
        </h1>
        <p className="text-gray-500 mb-10 text-sm md:text-base leading-relaxed px-2">
          Oops! It looks like you don't have the required permissions to access
          this page. This area is restricted to specific account roles.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm sm:text-base font-semibold rounded-xl transition-all duration-300 active:scale-95"
          >
            <FiArrowLeft className="text-lg" />
            Go Back
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white text-sm sm:text-base font-semibold rounded-xl shadow-[0_10px_20px_rgba(34,197,94,0.25)] transition-all duration-300 active:scale-95"
          >
            <FiHome className="text-lg" />
            Return to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
