/* eslint-disable react-hooks/immutability */
"use client";

import { IOrder } from "@/models/order.model";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BiCreditCard, BiPackage } from "react-icons/bi";
import { FaTruck, FaArrowLeft } from "react-icons/fa";
import { FiMapPin, FiUser, FiPhone } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from "next/navigation";

// --- Admin Order Card Component ---
const AdminOrderCard = ({
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
    const [status, setStatus] = useState<string>(order.status)

  const formattedDate = new Date(order.createdAt!).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

    const handleStatusUpdate = async (orderId:string, status:string) => {
      try {
          const result = await axios.post(`/api/admin/update-order-status/${orderId}`,{status})
          console.log(result.data)
          setStatus(status)
      } catch (error) {
        console.log(error)
      }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-[0_2px_24px_rgba(0,0,0,0.03)] border border-gray-100/80 transition-all overflow-hidden"
    >
      {/* Header - Order ID, Date & Admin Controls */}
      <div className="px-6 py-4 border-b border-gray-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            Order{" "}
            <span className="text-[#00a850]">
              #{order?._id?.toString()?.slice(-8).toUpperCase()}
            </span>
          </h2>
          <p className="text-sm text-gray-500 font-medium">{formattedDate}</p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg ${
              order.isPaid
                ? "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-500/20"
                : "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-500/20"
            }`}
          >
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>

          {/* Admin Status Dropdown */}
          <div className="relative">
            <select
              value={status.toLowerCase()}
              onChange={(e) => handleStatusUpdate(order._id?.toString(), e.target.value)}
              className={`appearance-none outline-none text-xs font-bold uppercase tracking-wider px-4 py-1.5 pr-8 rounded-lg cursor-pointer transition-all ring-1 ring-inset focus:ring-2  ${
              status.toLowerCase() === "pending"
                  ? "bg-amber-50 text-amber-600 ring-amber-500/30 focus:ring-amber-500"
                  : status.toLowerCase() === "out for delivery"
                    ? "bg-blue-50 text-blue-600 ring-blue-500/30 focus:ring-blue-500"
                    : status.toLowerCase() === "delivered"
                      ? "bg-green-50 text-green-600 ring-green-500/30 focus:ring-green-500"
                      : "bg-red-50 text-red-600 ring-red-500/30 focus:ring-red-500"
              }`}
            >
              <option value="pending">Pending</option>
              <option value="out of delivery">Out for Delivery</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-70">
              <IoIosArrowDown size={14} />
            </div>
          </div>
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

// --- Main Page Component ---
const ManageOrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await axios.get("/api/admin/get-orders");
      setOrders(result.data);
    } catch (error) {
      console.error("Failed to fetch admin orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: IOrder["status"],
  ) => {
    try {
      // Optimistic UI Update
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order,
        ),
      );

      // API Call - Adjust the endpoint as per your backend route
      await axios.patch(`/api/admin/update-order-status/${orderId}`, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to update status", error);
      // Revert on failure by fetching again
      fetchOrders();
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen w-full pb-16">
      {/* Top Header */}
      <div className="sticky top-0 w-full backdrop-blur-xl bg-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-b border-gray-100 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2.5 bg-gray-50 border border-gray-100 rounded-full hover:bg-gray-100 text-gray-600 hover:text-[#00a850] transition-all"
            >
              <FaArrowLeft size={16} />
            </button>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Manage Orders
            </h1>
          </div>
          <div className="text-sm font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            Total Orders: {orders?.length || 0}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8">
        {loading ? (
          /* Loading Skeleton */
          <div className="space-y-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="w-full bg-white rounded-2xl h-64 border border-gray-100 animate-pulse p-6"
              >
                <div className="flex justify-between items-center mb-8">
                  <div className="w-1/4 h-6 bg-gray-100 rounded-lg"></div>
                  <div className="w-24 h-8 bg-gray-100 rounded-lg"></div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <div className="w-full h-4 bg-gray-50 rounded"></div>
                    <div className="w-3/4 h-4 bg-gray-50 rounded"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="w-full h-4 bg-gray-50 rounded"></div>
                    <div className="w-1/2 h-4 bg-gray-50 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center pt-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BiPackage className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">No Orders Found</h2>
            <p className="text-gray-500 mt-2">
              There are currently no orders in the system.
            </p>
          </div>
        ) : (
          /* Order List */
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <motion.div
                key={order._id?.toString() || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <AdminOrderCard
                  order={order}
                  onStatusChange={handleStatusChange}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrdersPage;
