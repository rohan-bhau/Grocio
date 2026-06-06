"use client";

import { getSocket } from "@/lib/socket";
import { IUser } from "@/models/user.model";
import { motion, AnimatePresence } from "framer-motion";
import mongoose from "mongoose";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiCreditCard, BiPackage } from "react-icons/bi";
import { FaTruck } from "react-icons/fa";
import { FiMapPin, FiUser, FiPhone } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { TbTruckDelivery } from "react-icons/tb";


interface IOrder {
  [x: string]: any;
  id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: [
    {
      grocery: mongoose.Types.ObjectId;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: number;
    },
  ];
  isPaid: boolean;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    fullName: string;
    mobile: string;
    city: string;
    state: string;
    postalCode: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  assignment?: mongoose.Types.ObjectId;
  assignedDeliveryBoy?: IUser

  status: "pending" | "out of delivery" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}


const UserOrderCard = ({ order }: { order: IOrder }) => {
    const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(order.status)
  const router = useRouter()

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-500/20";
      case "out of delivery":
        return "bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-500/20";
      case "delivered":
        return "bg-green-50 text-green-600 ring-1 ring-inset ring-green-500/20";
      case "cancelled":
        return "bg-red-50 text-red-600 ring-1 ring-inset ring-red-500/20";
      default:
        return "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/20";
    }
  };

  const formattedDate = new Date(order.createdAt!).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
    
  useEffect(() => {
    const socket = getSocket();

    const handleStatusUpdate = (data: {
      orderId: string;
      status: string;
    }) => {
      if (data.orderId.toString() == order?._id!.toString()) {
        setStatus(data.status);
      }
    };

    socket.on("order-status-update", handleStatusUpdate);

    return () => socket.off("order-status-update", handleStatusUpdate);
  }, [order._id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-[0_2px_24px_rgba(0,0,0,0.04)] border border-gray-100/60 transition-all duration-300"
    >
      {/* Top Header Section */}
      <div className="px-6 py-5 border-b border-gray-100/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            Order{" "}
            <span className="text-[#00a850] font-semibold">
              #{order?._id?.toString()?.slice(-8).toUpperCase()}
            </span>
          </h2>
          <p className="text-sm text-gray-500 font-medium">{formattedDate}</p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full ${
              order.isPaid
                ? "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-500/20"
                : "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-500/20"
            }`}
          >
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>

          <span
            className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full ${getStatusStyle(status)}`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shipping Details */}
          <div>
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">
              Shipping Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <FiUser className="text-gray-500 text-lg" />
                <span className="font-semibold text-gray-800">
                  {order.address.fullName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="text-gray-500 text-lg" />
                <span className="font-medium text-gray-700">
                  {order.address.mobile}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <FiMapPin className="text-gray-500 text-lg mt-0.5 shrink-0" />
                <span className="leading-relaxed font-medium text-gray-600">
                  {order.address.fullAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Payment & Summary */}
          <div>
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">
              Payment & Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm font-semibold text-gray-800">
                {order.paymentMethod === "cod" ? (
                  <>
                    <FaTruck className="text-gray-500 text-lg" />
                    <span>Cash On Delivery</span>
                  </>
                ) : (
                  <>
                    <BiCreditCard className="text-gray-500 text-lg" />
                    <span>Online Payment</span>
                  </>
                )}
              </div>

              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-600">
                  Total Amount
                </span>
                <span className="text-xl font-extrabold text-gray-900">
                  ৳ {order.totalAmount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* delivery info if assigned */}
        {order.assignedDeliveryBoy && (
          <>
            <div className="mt-6 border-t border-gray-100/80 pt-5">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Delivery Assignment
              </h3>
              <div className="flex items-center justify-between bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center border border-emerald-200">
                    <FaTruck className="text-[#00a850] text-lg" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Assigned to
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {order.assignedDeliveryBoy.name}
                    </p>
                  </div>
                </div>
                {order.assignedDeliveryBoy.mobile && (
                  <a
                    href={`tel:${order.assignedDeliveryBoy.mobile}`}
                    className="flex items-center gap-2 text-xs font-bold text-[#00a850] bg-white px-3 py-1.5 rounded-lg border border-emerald-100 hover:bg-emerald-50 transition-colors"
                  >
                    <FiPhone /> Call Rider
                  </a>
                )}
              </div>
              <button onClick={()=>router.push(`/user/track-order/${order._id.toString()}`)} className="flex items-center justify-center gap-2 mt-5 cursor-pointer w-full  font-semibold text-white bg-[#00a850] px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm active:scale-95">
                <TbTruckDelivery size={18} /> Track Your Order
              </button>
            </div>
          </>
        )}

        {/* Expandable Items Section */}
        <div className="mt-8 border-t border-gray-100/60 pt-6">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="flex justify-between items-center w-full group outline-none"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-gray-800 group-hover:text-[#00a850] transition-colors">
              <BiPackage className="text-xl text-gray-500 group-hover:text-[#00a850] transition-colors" />
              <span>
                {order.items.length} Item{order.items.length > 1 ? "s" : ""} in
                this order
              </span>
            </div>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-green-50 group-hover:text-[#00a850] group-hover:border-green-100 transition-colors"
            >
              <IoIosArrowDown />
            </motion.div>
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-5 space-y-4">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 bg-gray-50/80 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                          <Image
                            src={item.image}
                            fill
                            alt={item.name}
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-xs font-medium text-gray-500 mt-0.5">
                            {item.quantity} x {item.unit}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-extrabold text-gray-900">
                        ৳ {Number(item.price) * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default UserOrderCard;