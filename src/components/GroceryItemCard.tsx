"use client";

import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "@/redux/cartSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { AnimatePresence, motion } from "framer-motion";
import mongoose from "mongoose";
import Image from "next/image";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

interface IGrocery {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  image?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface ICartItem extends IGrocery {
  quantity: number;
}

const GroceryItemCard = ({ item }: { item: IGrocery }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { cartData } = useSelector((state: RootState) => state.cart);
  const cartItem = cartData.find((i) => i._id === item._id) as ICartItem;
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: false, amount: 0.5 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden p-3 group flex flex-col h-full"
    >
      {/* Product Image */}
      <div className="relative w-full h-[180px] rounded-xl bg-gray-50 overflow-hidden mb-3">
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-green-600 text-white text-[10px] font-medium px-2 py-1 rounded-full">
            Fresh
          </span>
        </div>

        {item.image ? (
          <Image
            src={item.image}
            fill
            alt={item.name}
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            No Image
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow">
        {/* Category */}
        <span className="text-green-600 text-[10px] font-semibold uppercase tracking-wide mb-1">
          {item.category}
        </span>

        {/* Product Name */}
        <h3 className="text-sm md:text-base font-bold text-gray-900 leading-snug line-clamp-2 min-h-[40px]">
          {item.name}
        </h3>

        {/* Price & Unit */}
        <div className="flex items-center justify-between mt-3 mb-4">
          <p className="text-lg md:text-xl font-bold text-green-600">
            ৳{item.price}
          </p>

          <span className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
            {item.unit === "piece" ? "1 piece" : item.unit}
          </span>
        </div>

        {/* Cart Controls */}
        <div className="mt-auto h-[44px]">
          <AnimatePresence mode="wait">
            {cartItem ? (
              <motion.div
                key="quantity"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className=" w-full h-full bg-green-600 text-white rounded-xl flex items-center justify-between px-3 "
              >
                <button
                  onClick={() => dispatch(decreaseQuantity(item._id))}
                  className=" w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all "
                >
                  <FaMinus size={10} />
                </button>

                <span className="font-semibold">{cartItem.quantity}</span>

                <button
                  onClick={() => dispatch(increaseQuantity(item._id))}
                  className=" w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                >
                  <FaPlus size={10} />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="add"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                onClick={() =>
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  dispatch(addToCart({ ...item, quantity: 1 } as any))
                }
                className=" w-full h-full bg-green-600 cursor-pointer hover:bg-green-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <FiShoppingCart className="text-base" />
                Add to Cart
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default GroceryItemCard;
