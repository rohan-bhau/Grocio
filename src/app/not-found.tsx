"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { BsCartX } from "react-icons/bs";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-6 text-center bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] z-0">
        <span className="text-[20rem] font-black select-none">404</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Floating Empty Cart Icon */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 bg-green-100/50 rounded-full flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1] blur-xl"></div>
          <BsCartX className="text-6xl md:text-8xl text-[#00a850]" />
        </motion.div>

        {/* Text Content */}
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Oops! Aisle Not Found.
        </h1>

        <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed">
          Looks like we're out of stock on this page or the link is broken.
          Let's get you back to shopping for fresh groceries!
        </p>

        {/* Go Back Home Button */}
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 bg-[#00a850] hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-sm md:text-base shadow-[0_4px_14px_rgba(0,168,80,0.3)] transition-all uppercase tracking-wide"
          >
            <FaArrowLeft />
            Back to Homepage
          </motion.button>
        </Link>
      </motion.div>

      {/* Decorative Dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute w-full h-full pointer-events-none z-0"
      >
        <div className="absolute top-20 left-[15%] w-3 h-3 bg-green-300 rounded-full opacity-50"></div>
        <div className="absolute top-40 right-[20%] w-2 h-2 bg-green-400 rounded-full opacity-60"></div>
        <div className="absolute bottom-32 left-[25%] w-4 h-4 bg-green-200 rounded-full opacity-40"></div>
        <div className="absolute bottom-20 right-[15%] w-2 h-2 bg-green-500 rounded-full opacity-30"></div>
      </motion.div>
    </div>
  );
}
