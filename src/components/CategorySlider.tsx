"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuApple,
  LuBaby,
  LuChrome,
  LuCoffee,
  LuCookie,
  LuFlame,
  LuHeart,
  LuMilk,
  LuPackage,
  LuWheat,
} from "react-icons/lu";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const categories = [
  {
    id: 1,
    name: "Fruits & Vegetables",
    icon: LuApple,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    id: 2,
    name: "Dairy & Eggs",
    icon: LuMilk,
    color: "bg-amber-50 text-amber-500 border-amber-100",
  },
  {
    id: 3,
    name: "Rice, Atta & Grains",
    icon: LuWheat,
    color: "bg-orange-50 text-orange-500 border-orange-100",
  },
  {
    id: 4,
    name: "Snacks & Biscuits",
    icon: LuCookie,
    color: "bg-rose-50 text-rose-500 border-rose-100",
  },
  {
    id: 5,
    name: "Spices & Masalas",
    icon: LuFlame,
    color: "bg-red-50 text-red-500 border-red-100",
  },
  {
    id: 6,
    name: "Beverages & Drinks",
    icon: LuCoffee,
    color: "bg-sky-50 text-sky-500 border-sky-100",
  },
  {
    id: 7,
    name: "Personal Care",
    icon: LuHeart,
    color: "bg-purple-50 text-purple-500 border-purple-100",
  },
  {
    id: 8,
    name: "Household Essentials",
    icon: LuChrome,
    color: "bg-teal-50 text-teal-600 border-teal-100",
  },
  {
    id: 9,
    name: "Instant Food",
    icon: LuPackage,
    color: "bg-indigo-50 text-indigo-500 border-indigo-100",
  },
  {
    id: 10,
    name: "Baby & Pet Care",
    icon: LuBaby,
    color: "bg-pink-50 text-pink-500 border-pink-100",
  },
];

const CategorySlider = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftBtn(scrollLeft > 10);
      setShowRightBtn(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount =
        direction === "left" ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scroll("right");
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered]);

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, []);

  return (
    <motion.div
      className="w-[95%] md:w-[85%] mx-auto mt-16 relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-6 px-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
          🛒 Shop by Category
        </h2>
      </div>

      <div className="relative group">
        <AnimatePresence>
          {showLeftBtn && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => scroll("left")}
              className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-gray-100 text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all focus:outline-none"
            >
              <FiChevronLeft size={24} />
            </motion.button>
          )}
        </AnimatePresence>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 md:gap-6 overflow-x-auto px-4 py-6 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style
            dangerouslySetInnerHTML={{
              __html: `div::-webkit-scrollbar { display: none; }`,
            }}
          />

          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className={`min-w-[140px] md:min-w-[160px] flex flex-col items-center justify-center rounded-[1.5rem] border ${cat.color} bg-opacity-50 shadow-sm hover:shadow-lg transition-all cursor-pointer p-6 gap-4`}
              >
                <div className="bg-white p-4 rounded-full shadow-sm">
                  <Icon className="text-3xl md:text-4xl" />
                </div>
                <p className="text-sm font-bold text-center leading-tight">
                  {cat.name}
                </p>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {showRightBtn && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => scroll("right")}
              className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-gray-100 text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all focus:outline-none"
            >
              <FiChevronRight size={24} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CategorySlider;
