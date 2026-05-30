"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { IoMdCart } from "react-icons/io";


interface IGrocery {
  _id?: string;
  name: string;
  category: string;
  price: string;
  unit: string;
  image?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

const GroceryItemCard = ({ item }: { item: IGrocery }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: false, amount: 0.3 }} 
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group overflow-hidden"
    >
      {/* IMAGE SECTION */}
      <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden flex items-center justify-center">
        {item.image ? (
          <Image
            src={item.image}
            fill
            alt={item.name}
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-500 ease-in-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="text-gray-300 text-sm">No Image</div>
        )}

        {/* Category Badge Floating on Image */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm border border-gray-100">
          <span className="text-[10px] md:text-xs font-bold text-green-600 uppercase tracking-wider">
            {item.category}
          </span>
        </div>
      </div>

      {/* DETAILS SECTION */}
      <div className="p-4 md:p-5 flex flex-col flex-grow bg-white">
        {/* Product Name */}
        <h3 className="text-gray-800 font-bold text-base md:text-lg line-clamp-2 leading-snug mb-1 group-hover:text-green-600 transition-colors">
          {item.name}
        </h3>

        {/* Unit Info */}
        <div className="text-xs md:text-sm font-medium mb-4 flex justify-between">
          <p className="bg-gray-100 rounded-full px-2 py-1 text-gray-700">
            {item.unit}
          </p>
          <p className="text-green-700 text-lg font-bold">৳ {item.price}</p>
        </div>

        {/* Price & Add to Cart Button (Pushed to bottom using mt-auto) */}
        <div className="mt-auto flex items-center justify-between">
          {/* <div className="flex flex-col"> */}
          {/* <span className="text-xs text-gray-400 font-medium line-through mb-0.5"> */}
          {/* Optional: You can add fake original price here if you want discounts */}
          {/* ৳{(Number(item.price) * 1.2).toFixed(2)} */}
          {/* </span> */}
          {/* <span className="text-lg md:text-xl font-extrabold text-gray-900"> */}
          {/* ৳{item.price} */}
          {/* </span> */}
          {/* </div> */}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-100 hover:bg-green-600 text-green-600 hover:text-white p-2.5 md:p-3 rounded-xl transition-colors duration-300 shadow-sm w-full text-sm font-bold cursor-pointer flex items-center gap-2 justify-center "
            aria-label="Add to cart"
          >
            <IoMdCart /> Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default GroceryItemCard;
