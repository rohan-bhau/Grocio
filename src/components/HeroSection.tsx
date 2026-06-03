"use client";

import { useEffect, useState } from "react";
import {
  FiShoppingBag,
  FiTruck,
  FiBox,
  FiTag,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getSocket } from "@/lib/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";


const slides = [
  {
    id: 1,
    icon: (
      <FiShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 text-green-400 drop-shadow-lg" />
    ),
    title: "Welcome to Grocio 🛒",
    subtitle:
      "Order farm-fresh fruits, vegetables, and your daily essentials with just a few taps.",
    btnText: "Start Shopping",
    bg: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920&auto=format&fit=crop",
  },
  {
    id: 2,
    icon: (
      <FiTruck className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 text-yellow-400 drop-shadow-lg" />
    ),
    title: "Lightning Fast Delivery 🚀",
    subtitle:
      "Our dedicated delivery heroes ensure your groceries reach your doorstep in record time.",
    btnText: "Join as Delivery Partner",
    bg: "https://images.unsplash.com/photo-1695654390723-479197a8c4a3?q=80&w=1134&auto=format&fit=crop",
  },
  {
    id: 3,
    icon: (
      <FiBox className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 text-blue-400 drop-shadow-lg" />
    ),
    title: "Premium Quality Products 🌟",
    subtitle:
      "Explore a wide range of top-quality groceries, updated daily to bring you the best.",
    btnText: "Explore Categories",
    bg: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1920&auto=format&fit=crop",
  },
  {
    id: 4,
    icon: (
      <FiTag className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 text-red-400 drop-shadow-lg" />
    ),
    title: "Amazing Daily Offers 🎁",
    subtitle:
      "Save big on your monthly grocery bills with our exclusive discounts and combo offers.",
    btnText: "View Offers",
    bg: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1920&auto=format&fit=crop",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const {userData}=useSelector((state:RootState)=>state.user)

  useEffect(() => {
    if (userData) {
      
      // eslint-disable-next-line prefer-const
      let socket = getSocket() 
      socket.emit("identity",userData?._id )
    }
  },[userData])
 
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    
    <div className="relative w-[96%] md:w-[98%] mx-auto mt-28 h-[65vh] sm:h-[75vh] md:h-[85vh] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[current].bg}
            fill
            alt="slide"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center gap-4 sm:gap-5 md:gap-6 max-w-[90%] sm:max-w-2xl md:max-w-3xl"
          >
            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-full border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
              {slides[current].icon}
            </div>

            {/* RESPONSIVE TEXT SIZES */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-xl leading-tight">
              {slides[current].title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 drop-shadow-md">
              {slides[current].subtitle}
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className="mt-2 sm:mt-4 px-6 py-2.5 sm:px-8 sm:py-3.5 bg-linear-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white text-sm sm:text-lg font-semibold rounded-full shadow-[0_10px_20px_rgba(34,197,94,0.3)] transition-all duration-300 border border-green-400/30"
            >
              {slides[current].btnText}
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      
      <button
        onClick={prevSlide}
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20"
      >
        <FiChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20"
      >
        <FiChevronRight className="w-6 h-6 md:w-7 md:h-7" />
      </button>

      {/* RESPONSIVE DOTS */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
              current === index
                ? "w-6 sm:w-8 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                : "w-1.5 sm:w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
