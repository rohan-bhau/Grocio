"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { FiXCircle } from "react-icons/fi";

const OrderCancelledPage = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] px-6 text-center overflow-hidden z-0 bg-slate-50">
      {/* Dynamic Background Floating Particles (Soft Red/Gray) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none z-[-1]"
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            className={`absolute rounded-full bg-red-400 blur-[2px]`}
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
        className="bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full flex flex-col items-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            damping: 12,
            stiffness: 100,
            delay: 0.2,
          }}
          className="relative"
        >
          <FiXCircle className="text-red-500 w-20 h-20 md:w-24 md:h-24 relative z-10 bg-white rounded-full" />
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
            <div className="w-full h-full rounded-full bg-red-500 blur-2xl" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-8 tracking-tight"
        >
          Checkout Cancelled
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="text-gray-500 mt-3 text-sm md:text-base leading-relaxed max-w-[90%]"
        >
          Your order process was cancelled and no charges were made. Don't
          worry, your items are still saved in your cart.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-10 w-full flex flex-col gap-4"
        >
          {/* Primary Action - Go back to Cart */}
          <Link href={"/user/cart"} className="block w-full">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-[#00a850] hover:bg-green-700 text-white text-sm md:text-base font-bold px-8 py-4 rounded-xl shadow-[0_4px_14px_rgba(0,168,80,0.3)] hover:shadow-[0_6px_20px_rgba(0,168,80,0.4)] transition-all uppercase tracking-wide"
            >
              <FaShoppingCart /> Return to Cart
            </motion.button>
          </Link>

          {/* Secondary Action - Go to Homepage */}
          <Link href={"/"} className="block w-full">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-700 text-sm md:text-base font-bold px-8 py-3.5 rounded-xl transition-all uppercase tracking-wide"
            >
              <FaArrowLeft /> Continue Shopping
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderCancelledPage;
