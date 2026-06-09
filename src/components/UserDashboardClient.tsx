"use client";

import { useState, useMemo } from "react";
import GroceryItemCard from "./GroceryItemCard";
import { FiSearch, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface IGrocery {
  _id: string;
  name: string;
  category: string;
  price: string;
  unit: string;
  image?: string;
}

const categories = [
  "All",
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Rice, Atta & Grains",
  "Snacks & Biscuits",
  "Spice & Masalas",
  "Beverage & Drinks",
  "Personal Care",
  "Household Essentials",
  "Instant and packaged Food",
  "Baby and Pet Care",
];

const UserDashboardClient = ({ groceries }: { groceries: IGrocery[] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = useMemo(() => {
    return groceries.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [groceries, searchQuery, selectedCategory]);

  return (
    <div className="w-[90%] md:w-[80%] mx-auto mt-10 pb-16">
      {/* Search + Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">
            Popular Grocery Items
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {filtered.length} item{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Search Input */}
        <div className="relative md:ml-auto w-full md:w-80">
          <FiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or category..."
            className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00a850] focus:ring-2 focus:ring-green-100 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              selectedCategory === cat
                ? "bg-[#00a850] text-white border-[#00a850] shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#00a850] hover:text-[#00a850]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiSearch className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            No items found
          </h3>
          <p className="text-gray-500 text-sm">
            Try a different name or category
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-4 px-6 py-2.5 bg-[#00a850] text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
          >
            Clear Filters
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {filtered.map((item: any) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <GroceryItemCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default UserDashboardClient;
