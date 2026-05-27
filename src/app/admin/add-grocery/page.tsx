"use client";

import Link from "next/link";
import { IoArrowBackSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { ChangeEvent, FormEvent, useState, useRef } from "react";
import Image from "next/image";
import axios from "axios";
// EKHANE FIX KORA HOYECHE: FaCloudUploadAlt er bodole FiCloudUpload use kora hoyeche
import {
  FiXCircle,
  FiPackage,
  FiPlusCircle,
} from "react-icons/fi";
import { FaCloudUploadAlt } from "react-icons/fa";

const categories = [
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

const units = ["kg", "g", "liter", "ml", "piece", "pack"];

const AddGroceryPage = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [frontendImage, setFrontendImage] = useState<string | null>(null);
  const [backendImage, setBackendImage] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setFrontendImage(null);
    setBackendImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !category || !unit || !price) {
      alert("Please fill all the required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("unit", unit);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post("/api/admin/add-grocery", formData);
      console.log(result.data);

      alert("Grocery item added successfully!");

      // Reset form
      setName("");
      setCategory("");
      setUnit("");
      setPrice("");
      removeImage();
    } catch (error) {
      console.error(error);
      alert("Failed to add grocery item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all text-gray-800 placeholder:text-gray-400 bg-white";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-20 px-4 relative">
      <Link
        href={"/"}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 font-semibold bg-white px-5 py-2.5 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50 transition-all border border-gray-100 z-10"
      >
        <IoArrowBackSharp className="text-xl" />
        <span className="hidden md:flex">Back to home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2rem] border border-gray-100 p-8 md:p-12"
      >
        <div className="flex flex-col items-center text-center mb-10 pb-6 border-b border-gray-100">
          <div className="bg-white p-5 rounded-full border-2 border-green-100 shadow-inner mb-5">
            <FiPlusCircle className="text-green-500 w-12 h-12 md:w-16 md:h-16 drop-shadow-sm" />
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Add New Grocery
          </h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Fill out the details below to add a new grocery item to your
            inventory.
          </p>
        </div>

        <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-sm font-semibold text-gray-700 flex items-center gap-1"
            >
              Grocery Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              placeholder="e.g., Miniket Rice, Sunflower Oil"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                required
                value={category}
                className={`${inputClass} appearance-none bg-no-repeat bg-right bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23b0b0b0%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.3c0%203%201.1%205.8%203.3%208.5l131.8%20131.8c2.8%202.8%205.7%204.2%208.5%204.2%202.8%200%205.7-1.4%208.5-4.2L287%2090.8c2.2-2.7%203.3-5.5%203.3-8.5%200-3-1.1-5.8-3.3-8.5z%22%2F%3E%3C%2Fsvg%3E')] bg-[size:10px_auto] pr-10`}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                Unit <span className="text-red-500">*</span>
              </label>
              <select
                name="unit"
                required
                value={unit}
                className={`${inputClass} appearance-none bg-no-repeat bg-right bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23b0b0b0%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.3c0%203%201.1%205.8%203.3%208.5l131.8%20131.8c2.8%202.8%205.7%204.2%208.5%204.2%202.8%200%205.7-1.4%208.5-4.2L287%2090.8c2.2-2.7%203.3-5.5%203.3-8.5%200-3-1.1-5.8-3.3-8.5z%22%2F%3E%3C%2Fsvg%3E')] bg-[size:10px_auto] pr-10`}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="" disabled>
                  Select Unit
                </option>
                {units.map((u, idx) => (
                  <option key={idx} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="price"
              className="text-sm font-semibold text-gray-700 flex items-center gap-1"
            >
              Price <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base font-bold border-r border-gray-200 pr-3.5 group-focus-within:border-green-400 group-focus-within:text-green-600 transition-colors z-10">
                ৳
              </span>
              <input
                type="number"
                id="price"
                placeholder="e.g. 120"
                required
                min="0"
                className={`${inputClass} pl-14`}
                onChange={(e) => setPrice(e.target.value)}
                value={price}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Product Image (Optional)
            </label>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[160px] p-6 overflow-hidden
                ${
                  frontendImage
                    ? "border-green-400 bg-green-50/30"
                    : "border-gray-300 bg-gray-50/50 hover:border-green-400 hover:bg-green-50/50"
                } group`}
            >
              <AnimatePresence mode="wait">
                {frontendImage ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative flex flex-col items-center gap-3 w-full"
                  >
                    <Image
                      src={frontendImage}
                      alt="Grocery Preview"
                      width={160}
                      height={160}
                      className="rounded-xl object-cover h-32 w-auto border-2 border-white shadow-md"
                    />
                    <span className="text-xs text-gray-500 font-medium truncate w-full px-4">
                      {backendImage?.name || "Selected Image"}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute -top-2 -right-2 md:right-20 p-1.5 rounded-full bg-white text-red-500 shadow-lg hover:bg-red-50 hover:text-red-600 transition-colors z-10"
                    >
                      <FiXCircle size={24} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4 text-gray-500 group-hover:text-green-600 transition-colors"
                  >
                    <FaCloudUploadAlt className="text-4xl md:text-5xl text-gray-400 group-hover:text-green-500 transition-colors drop-shadow-sm" />
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-gray-700 group-hover:text-green-600 transition-colors">
                        Click to Upload Image
                      </span>
                      <span className="text-xs font-medium text-gray-400">
                        Max size: 5MB
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.button
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center justify-center gap-3 px-8 py-4 text-white text-lg font-bold rounded-xl shadow-[0_10px_20px_rgba(34,197,94,0.25)] transition-all duration-300 mt-4 border border-green-500/30
              ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed shadow-none border-transparent"
                  : "bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900"
              }`}
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FiPackage className="text-xl" />
            )}
            {isSubmitting ? "Adding Grocery..." : "Add Grocery Item"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddGroceryPage;
