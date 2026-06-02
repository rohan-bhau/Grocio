/* eslint-disable react-hooks/purity */
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import { LuCircleCheckBig } from "react-icons/lu";

const OrderSuccessPage = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] px-6 text-center overflow-hidden bg-gradient-to-b from-green-50/30 to-gray-50/50 z-0">
      {/* Dynamic Background Floating Particles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none z-[-1]"
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            className={`absolute rounded-full bg-green-400 blur-[2px]`}
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              width: `${Math.random() * 6 + 4}px`,
              height: `${Math.random() * 6 + 4}px`,
            }}
          />
        ))}
      </motion.div>

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/70 backdrop-blur-xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full flex flex-col items-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            damping: 12,
            stiffness: 100,
            delay: 0.2,
          }}
          className="relative"
        >
          <LuCircleCheckBig className="text-[#00a850] w-20 h-20 md:w-24 md:h-24 relative z-10 bg-white rounded-full" />
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0.15, 0, 0.15], scale: [1, 1.2, 1] }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "easeInOut",
            }}
            className="absolute inset-0 z-0"
          >
            <div className="w-full h-full rounded-full bg-[#00a850] blur-2xl" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-8 tracking-tight"
        >
          Order Placed Successfully!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="text-gray-500 mt-3 text-sm md:text-base leading-relaxed max-w-[90%]"
        >
          Thank you for shopping with us. Your order has been placed and is
          being processed. You can{" "}
          <span className="font-semibold text-[#00a850]">
            track its progress
          </span>{" "}
          in your orders section.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -8, 0] }}
          transition={{
            opacity: { delay: 0.7, duration: 0.4 },
            y: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 },
          }}
          className="mt-8 mb-2"
        >
          <div className="bg-green-50/80 p-4 rounded-2xl border border-green-100">
            <FiPackage className="w-8 h-8 md:w-10 md:h-10 text-[#00a850]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-8 w-full"
        >
          <Link href={"/my-orders"} className="block w-full cursor-pointer">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-[#00a850] hover:bg-green-700 text-white text-sm md:text-base font-bold px-8 py-4 rounded-xl shadow-[0_4px_14px_rgba(0,168,80,0.3)] hover:shadow-[0_6px_20px_rgba(0,168,80,0.4)] transition-all uppercase tracking-wide cursor-pointer"
            >
              Go to My Orders <FaArrowRight />
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
