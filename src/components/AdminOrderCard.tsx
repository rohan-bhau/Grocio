"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IoIosArrowDown } from "react-icons/io";
import { FiMapPin, FiPhone, FiUser } from "react-icons/fi";
import { FaTruck } from "react-icons/fa";
import { BiCreditCard, BiPackage } from "react-icons/bi";
import Image from "next/image";
import mongoose from "mongoose";
import { IUser } from "@/models/user.model";
import { getSocket } from "@/lib/socket"; 

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
  assignedDeliveryBoy?: IUser;
  status: "pending" | "out of delivery" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}

export const AdminOrderCard = ({
  order,
  onStatusChange,
}: {
  order: IOrder;
  onStatusChange: (
    orderId: string,
    newStatus: IOrder["status"],
  ) => Promise<void>;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<string>(order.status);

  const formattedDate = new Date(order.createdAt!).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    const socket = getSocket();

    const handleStatusUpdate = (data: { orderId: string; status: string }) => {
      if (data.orderId === order._id?.toString()) {
        setStatus(data.status);
      }
    };

    socket.on("order-status-update", handleStatusUpdate);
    return () => socket.off("order-status-update", handleStatusUpdate);
  }, [order._id]);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      const result = await axios.post(
        `/api/admin/update-order-status/${orderId}`,
        { status },
      );
      console.log(result.data);
      setStatus(status);
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-amber-50 text-amber-600 ring-amber-500/20";
      case "out of delivery":
        return "bg-blue-50 text-blue-600 ring-blue-500/20";
      case "delivered":
        return "bg-green-50 text-green-600 ring-green-500/20";
      default:
        return "bg-red-50 text-red-600 ring-red-500/20";
    }
  };

  const getSelectStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-amber-50 text-amber-600 ring-amber-500/30 focus:ring-amber-500";
      case "out of delivery":
        return "bg-blue-50 text-blue-600 ring-blue-500/30 focus:ring-blue-500";
      case "delivered":
        return "bg-green-50 text-green-600 ring-green-500/30 focus:ring-green-500";
      default:
        return "bg-red-50 text-red-600 ring-red-500/30 focus:ring-red-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-[0_2px_24px_rgba(0,0,0,0.03)] border border-gray-100/80 transition-all overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100/80 bg-gray-50/30 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left — Order ID & Date */}
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            Order{" "}
            <span className="text-[#00a850]">
              #{order?._id?.toString()?.slice(-8).toUpperCase()}
            </span>
          </h2>
          <p className="text-sm text-gray-500 font-medium">{formattedDate}</p>
        </div>

        {/* Right — Status Badge on top, then Paid + Dropdown below */}
        <div className="flex flex-col items-end gap-2">
          {/* Row 1 — Current Status Badge */}
          <span
            className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full ring-1 ring-inset ${getStatusStyle(status)}`}
          >
            {status}
          </span>

          {/* Row 2 — Paid/Unpaid + Dropdown — delivered হলে hide */}
          {status !== "delivered" && (
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg ring-1 ring-inset ${
                  order.isPaid
                    ? "bg-emerald-50 text-emerald-600 ring-emerald-500/20"
                    : "bg-rose-50 text-rose-600 ring-rose-500/20"
                }`}
              >
                {order.isPaid ? "Paid" : "Unpaid"}
              </span>

              <div className="relative">
                <select
                  value={status.toLowerCase()}
                  onChange={(e) =>
                    handleStatusUpdate(order._id?.toString(), e.target.value)
                  }
                  className={`appearance-none outline-none text-xs font-bold uppercase tracking-wider px-4 py-1.5 pr-8 rounded-lg cursor-pointer transition-all ring-1 ring-inset focus:ring-2 ${getSelectStyle(status)}`}
                >
                  <option value="pending">Pending</option>
                  <option value="out of delivery">Out for Delivery</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-70">
                  <IoIosArrowDown size={14} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Body - Customer & Payment Info */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer Info */}
          <div>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              Customer Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <FiUser className="text-gray-400 text-lg" />
                <span className="font-semibold text-gray-800">
                  {order.address.fullName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="text-gray-400 text-lg" />
                <span className="font-medium text-gray-700">
                  {order.address.mobile}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <FiMapPin className="text-gray-400 text-lg mt-0.5 shrink-0" />
                <span className="leading-relaxed font-medium text-gray-600">
                  {order.address.fullAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              Payment Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm font-semibold text-gray-800">
                {order.paymentMethod === "cod" ? (
                  <>
                    <FaTruck className="text-gray-400 text-lg" />
                    <span>Cash On Delivery</span>
                  </>
                ) : (
                  <>
                    <BiCreditCard className="text-gray-400 text-lg" />
                    <span>Online Payment</span>
                  </>
                )}
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-500">
                  Order Total
                </span>
                <span className="text-xl font-extrabold text-[#00a850]">
                  ৳ {order.totalAmount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Assignment Info */}
        {order.assignedDeliveryBoy && (
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
                
                 <a href={`tel:${order.assignedDeliveryBoy.mobile}`}
                  className="flex items-center gap-2 text-xs font-bold text-[#00a850] bg-white px-3 py-1.5 rounded-lg border border-emerald-100 hover:bg-emerald-50 transition-colors"
                >
                  <FiPhone /> Call Rider
                </a>
              )}
            </div>
          </div>
        )}

        {/* Expandable Items */}
        <div className="mt-6 border-t border-gray-100/80 pt-4">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="flex justify-between items-center w-full group outline-none py-2"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-gray-700 group-hover:text-[#00a850] transition-colors">
              <BiPackage className="text-lg text-gray-400 group-hover:text-[#00a850]" />
              <span>
                {order.items.length} Item{order.items.length > 1 ? "s" : ""}
              </span>
            </div>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-green-50 group-hover:text-[#00a850]"
            >
              <IoIosArrowDown size={14} />
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
                <div className="pt-4 space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-gray-50/50 border border-gray-100 rounded-xl p-3"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-100">
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
                      <div className="text-sm font-bold text-gray-900">
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