"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft, FaMinus, FaPlus } from "react-icons/fa";
import { BiTrash } from "react-icons/bi";

import {
decreaseQuantity,
increaseQuantity,
removeFromCart,
} from "@/redux/cartSlice";
import { AppDispatch, RootState } from "@/redux/store";

export default function CartPage() {
const { cartData, subTotal, deliveryFee, total } = useSelector(
(state: RootState) => state.cart
);

const dispatch = useDispatch<AppDispatch>();

return (
  <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
    {/* Header */}{" "}
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-8"
    >
      {" "}
      <FaArrowLeft />
      Back to Home{" "}
    </Link>
    <div className="mb-10">
      <h1 className="text-4xl font-bold text-slate-900">Shopping Cart</h1>

      <p className="text-slate-500 mt-2">
        {cartData.length} item{cartData.length !== 1 ? "s" : ""} in your cart
      </p>
    </div>
    {cartData.length === 0 ? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-slate-900">
          Your cart is empty
        </h2>

        <p className="text-slate-500 mt-3 mb-8">
          Looks like you haven't added any products yet.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Continue Shopping
        </Link>
      </motion.div>
    ) : (
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-5">
          <AnimatePresence>
            {cartData.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="
                bg-white
                rounded-3xl
                border
                border-slate-100
                shadow-sm
                hover:shadow-md
                transition-all
                p-5
              "
              >
                <div className="flex flex-col md:flex-row gap-5">
                  {/* Image */}
                  <div className="relative w-32 h-32 rounded-2xl bg-slate-50 overflow-hidden shrink-0">
                    <Image
                      src={item.image as string}
                      fill
                      alt={item.name}
                      className="object-contain p-3"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {item.name}
                        </h3>

                        <p className="text-slate-500 text-sm mt-1">
                          {item.unit}
                        </p>

                        <p className="text-green-600 font-semibold mt-3">
                          ৳{item.price} each
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          item._id && dispatch(removeFromCart(item._id))
                        }
                        className="
                        w-10
                        h-10
                        rounded-xl
                        bg-red-50
                        text-red-500
                        hover:bg-red-100
                        transition
                        flex
                        items-center
                        justify-center
                      "
                      >
                        <BiTrash size={20} />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-4">
                      {/* Quantity */}
                      <div
                        className="
                        flex
                        items-center
                        gap-4
                        bg-slate-100
                        rounded-full
                        px-3
                        py-2
                        w-fit
                      "
                      >
                        <button
                          onClick={() =>
                            item._id && dispatch(decreaseQuantity(item._id))
                          }
                          className="
                          w-9
                          h-9
                          rounded-full
                          bg-white
                          shadow-sm
                          flex
                          items-center
                          justify-center
                        "
                        >
                          <FaMinus size={11} />
                        </button>

                        <span className="font-semibold text-lg">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            item._id && dispatch(increaseQuantity(item._id))
                          }
                          className="
                          w-9
                          h-9
                          rounded-full
                          bg-white
                          shadow-sm
                          flex
                          items-center
                          justify-center
                        "
                        >
                          <FaPlus size={11} />
                        </button>
                      </div>

                      {/* Total */}
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-slate-400">Item Total</p>

                        <p className="text-2xl font-bold text-slate-900">
                          ৳{Number(item.price) * item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="
          bg-white
          rounded-3xl
          p-6
          shadow-lg
          border
          border-slate-100
          h-fit
          sticky
          top-24
        "
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Order Summary
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>৳{subTotal}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span>৳{deliveryFee}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Items</span>
              <span>{cartData.length}</span>
            </div>

            <hr />

            <div className="flex justify-between text-xl font-bold text-slate-900">
              <span>Total</span>
              <span>৳{total}</span>
            </div>
          </div>

          <div className="mt-6 bg-green-50 rounded-2xl p-4">
            <p className="text-sm text-green-700">
              {subTotal < 500
                ? `Add ৳${500 - subTotal} more for free delivery 🚚`
                : "Free delivery unlocked 🎉"}
            </p>

            <div className="w-full h-2 bg-green-100 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-green-600 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((subTotal / 500) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          <Link href={"/user/checkout"}>
            <button
              className="
            mt-6
            w-full
            h-14
            bg-green-600
            hover:bg-green-700
            text-white
            font-semibold
            rounded-2xl
            transition
            active:translate-y-0.5
          "
            >
              Proceed to Checkout
            </button>
          </Link>
        </motion.div>
      </div>
    )}
  </div>
);
}
