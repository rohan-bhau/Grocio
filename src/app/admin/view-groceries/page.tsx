/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import axios from "axios";
import { useEffect, useState, useRef, FormEvent } from "react";
import {
  AnimatePresence as FramerAnimatePresence,
  motion as m,
} from "framer-motion";
import { CiSearch } from "react-icons/ci";
import { IGrocery } from "@/models/grocery.model";
import Image from "next/image";
import { RiEdit2Line, RiDeleteBin6Line } from "react-icons/ri";
import { FiX, FiCheckCircle, FiLoader, FiAlertCircle } from "react-icons/fi";
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

const ViewGroceryPage = () => {
  const [groceries, setGroceries] = useState<IGrocery[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Edit & Loading State Management
  const [editing, setEditing] = useState<IGrocery | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backendImage, setBackendImage] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Groceries Function
  const fetchGroceries = async () => {
    try {
      const result = await axios.get("/api/admin/get-grocery");
      setGroceries(result.data);
    } catch (error) {
      console.error("Error fetching groceries:", error);
    }
  };

  useEffect(() => {
    fetchGroceries();
  }, []);

  useEffect(() => {
    if (editing) {
      setImagePreview(editing.image!);
      setBackendImage(null);
    } else {
      setImagePreview(null);
      setBackendImage(null);
    }
  }, [editing]);

  // Image Change Handler for Modal
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    setBackendImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Update Handler
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !editing ||
      !editing.name ||
      !editing.category ||
      !editing.price ||
      !editing.unit
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("groceryId", editing._id!.toString());
      formData.append("name", editing.name);
      formData.append("category", editing.category);
      formData.append("price", editing.price.toString());
      formData.append("unit", editing.unit);

      if (backendImage) {
        formData.append("image", backendImage);
      } else if (editing.image) {
        formData.append("image", editing.image);
      }

      await axios.post("/api/admin/edit-grocery", formData);

      alert("Grocery item updated successfully!");
      setEditing(null);
      fetchGroceries(); 
    } catch (error) {
      console.error(error);
      alert("Failed to update grocery item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    setIsDeletingId(id);
    try {
      await axios.post("/api/admin/delete-grocery", { groceryId: id });
      alert("Item deleted successfully!");
      fetchGroceries(); 
    } catch (error) {
      console.error(error);
      alert("Failed to delete grocery item.");
    } finally {
      setIsDeletingId(null);
    }
  };

  // Live Search Filtering
  const filteredGroceries = groceries?.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-gray-800 placeholder:text-gray-400 bg-white text-sm";

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-20 px-4 md:px-8 bg-gray-50/50 min-h-screen pt-10">
      {/* Search Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            All Grocery Stock
          </h1>
          <p className="text-gray-500 text-sm mt-1.5 font-medium">
            Manage, search, and instantly update your store inventory items.
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 stroke-[1]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-gray-400 font-medium"
            placeholder="Search by name or category..."
          />
        </div>
      </div>

      {/* Grid Layout */}
      {filteredGroceries && filteredGroceries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGroceries.map((g, i) => (
            <m.div
              key={g._id || i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group relative"
            >
              {/* Category Badge on Image */}
              <span className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-md text-gray-800 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm border border-gray-100">
                {g.category}
              </span>

              {/* Image Container */}
              <div className="relative aspect-square w-full bg-gray-50 overflow-hidden flex items-center justify-center">
                <Image
                  src={g.image || "/assets/placeholder.png"}
                  fill
                  alt={g.name}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-w-7xl) 25vw, 50vw"
                />
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                <div className="mb-4">
                  <h3 className="font-bold text-gray-800 text-base line-clamp-1 group-hover:text-emerald-600 transition-colors duration-200">
                    {g.name}
                  </h3>
                  <div className="flex items-baseline mt-2">
                    <span className="text-xs text-gray-400 font-semibold mr-1">
                      Price:
                    </span>
                    <p className="text-emerald-600 font-black text-xl flex items-baseline">
                      <span className="text-sm font-bold mr-0.5">৳</span>
                      {g.price}
                      <span className="text-gray-400 text-xs font-medium ml-1 bg-gray-50 px-1.5 py-0.5 rounded">
                        / {g.unit}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setEditing(g)}
                    className="w-full bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 border border-gray-100 hover:border-emerald-200"
                  >
                    <RiEdit2Line size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(g._id?.toString() || "")}
                    disabled={isDeletingId === g._id?.toString()}
                    className="w-full bg-gray-50 text-gray-600 cursor-pointer hover:bg-rose-50 hover:text-rose-600 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 border border-gray-100 hover:border-rose-200 disabled:opacity-50"
                  >
                    {isDeletingId === g._id?.toString() ? (
                      <FiLoader className="animate-spin" size={14} />
                    ) : (
                      <RiDeleteBin6Line size={14} />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 max-w-xl mx-auto shadow-sm">
          <FiAlertCircle className="mx-auto text-gray-300 w-12 h-12 mb-4" />
          <p className="text-gray-500 font-semibold text-base">
            No grocery items found matching your query.
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Try searching for another product name or category.
          </p>
        </div>
      )}

      {/* Edit Modal */}
      <FramerAnimatePresence>
        {editing && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <m.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Modify Product Details
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-200/70 cursor-pointer hover:text-gray-700 transition-colors"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Modal Form */}
              <form
                onSubmit={handleUpdate}
                className="p-6 overflow-y-auto max-h-[80vh] space-y-4"
              >
                {/* Image Upload and Preview */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Product Image
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
                    className="relative border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 h-44 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-emerald-400 transition-all"
                  >
                    {imagePreview ? (
                      <>
                        <div className="relative w-40 h-40">
                          <Image
                            src={imagePreview}
                            fill
                            alt="Preview"
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                          <FaCloudUploadAlt size={16} /> Change Image
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-gray-400 flex flex-col items-center gap-1">
                        <FaCloudUploadAlt size={24} />
                        <span className="text-xs font-medium">
                          Click to change image
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Grocery Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Grocery Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Enter grocery name"
                  />
                </div>

                {/* Category & Unit Dropdown */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Category
                    </label>
                    <select
                      required
                      value={editing.category}
                      onChange={(e) =>
                        setEditing({ ...editing, category: e.target.value })
                      }
                      className={`${inputClass} appearance-none bg-no-repeat bg-right pr-8 bg-[size:10px_auto] bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23b0b0b0%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.3c0%203%201.1%205.8%203.3%208.5l131.8%20131.8c2.8%202.8%205.7%204.2%208.5%204.2%202.8%200%205.7-1.4%208.5-4.2L287%2090.8c2.2-2.7%203.3-5.5%203.3-8.5%200-3-1.1-5.8-3.3-8.5z%22%2F%3E%3C%2Fsvg%3E')]`}
                    >
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Unit
                    </label>
                    <select
                      required
                      value={editing.unit}
                      onChange={(e) =>
                        setEditing({ ...editing, unit: e.target.value })
                      }
                      className={`${inputClass} appearance-none bg-no-repeat bg-right pr-8 bg-[size:10px_auto] bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23b0b0b0%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.3c0%203%201.1%205.8%203.3%208.5l131.8%20131.8c2.8%202.8%205.7%204.2%208.5%204.2%202.8%200%205.7-1.4%208.5-4.2L287%2090.8c2.2-2.7%203.3-5.5%203.3-8.5%200-3-1.1-5.8-3.3-8.5z%22%2F%3E%3C%2Fsvg%3E')]`}
                    >
                      {units.map((u, idx) => (
                        <option key={idx} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Price
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold border-r border-gray-100 pr-3">
                      ৳
                    </span>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editing.price}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          price: Number(e.target.value),
                        })
                      }
                      className={`${inputClass} pl-12`}
                      placeholder="Enter price"
                    />
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    disabled={isSubmitting}
                    className="w-1/2 bg-gray-100 text-gray-700 cursor-pointer font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-1/2 bg-gradient-to-r from-emerald-600 cursor-pointer to-teal-600 text-white font-bold py-3 rounded-xl shadow-md hover:from-emerald-700 hover:to-teal-700 transition-all text-sm flex items-center justify-center gap-2 disabled:from-gray-400 disabled:to-gray-400"
                  >
                    {isSubmitting ? (
                      <>
                        <FiLoader className="animate-spin text-base" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle className="text-base" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </m.div>
          </m.div>
        )}
      </FramerAnimatePresence>
    </div>
  );
};

export default ViewGroceryPage;
