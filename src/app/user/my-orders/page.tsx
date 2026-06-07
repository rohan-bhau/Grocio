"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { BsBoxSeam } from "react-icons/bs";
import { motion } from "framer-motion";
import UserOrderCard from "@/components/UserOrderCard";
import { getSocket } from "@/lib/socket";
import { useSession } from "next-auth/react";
import mongoose from "mongoose";
import { IUser } from "@/models/user.model";

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

const MyOrdersPage = () => {
  const router = useRouter();
const { data: session } = useSession();

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMyOrders = async () => {
      try {
        const result = await axios.get("/api/user/my-orders");
        setOrders(result.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    getMyOrders();
  }, []);

  useEffect(() => {
    const socket = getSocket()
    socket.on("order-assigned", ({ orderId, assignedDeliveryBoy }) => {
      setOrders((prev) => prev?.map((o) => (
        o._id==orderId? {...o, assignedDeliveryBoy} : o
      )))
    })
    return () => {socket.off("order-assigned")};
  },[])

useEffect(() => {
  if (!session?.user?.id) return;

  const socket = getSocket();

  const handleConnect = () => {
    socket.emit("identity", session?.user?.id);
  };

  if (socket.connected) {
    socket.emit("identity", session?.user?.id);
  } else {
    socket.on("connect", handleConnect);
  }

  const handleStatusUpdate = (data: { orderId: string; status: string }) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id?.toString() === data.orderId.toString()
          ? { ...order, status: data.status }
          : order,
      ),
    );
  };

  socket.off("order-status-update");
  socket.on("order-status-update", handleStatusUpdate);

  return () => {
    socket.off("connect", handleConnect);
    socket.off("order-status-update", handleStatusUpdate);
  };
}, [session?.user?.id]);

  return (
    <div className="bg-gray-50/50 min-h-screen w-full">
      <div className="max-w-3xl mx-auto px-4 pt-20 pb-12 relative">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 w-full backdrop-blur-xl bg-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-b border-gray-100 z-50">
          <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 py-4">
            <button
              onClick={() => router.push("/")}
              className="p-2.5 bg-gray-50 border border-gray-100 rounded-full hover:bg-gray-100 text-gray-600 hover:text-[#00a850] active:scale-95 transition-all"
            >
              <FaArrowLeft size={16} />
            </button>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              My Orders
            </h1>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="space-y-4 mt-2">
            {[1, 2, 3].map((skeleton) => (
              <div
                key={skeleton}
                className="w-full bg-white rounded-2xl h-32 md:h-40 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] animate-pulse p-4 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                  <div className="w-1/3 h-5 bg-gray-200 rounded-md"></div>
                  <div className="w-20 h-5 bg-gray-100 rounded-full"></div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="w-3/4 h-4 bg-gray-100 rounded-md"></div>
                  <div className="w-1/2 h-4 bg-gray-100 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        ) : orders?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center pt-24 pb-10 text-center"
          >
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100 shadow-sm">
              <BsBoxSeam className="text-4xl text-[#00a850]" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-500 text-sm md:text-base max-w-xs mb-8 leading-relaxed">
              Looks like you haven&apos;t made your first order yet. Start
              exploring our fresh groceries!
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-[#00a850] hover:bg-green-700 cursor-pointer text-white font-bold text-sm md:text-base px-8 py-3.5 rounded-xl shadow-[0_4px_14px_rgba(0,168,80,0.25)] transition-all active:scale-[0.98] uppercase tracking-wide"
            >
              Start Shopping
            </button>
          </motion.div>
        ) : (
          <div className="mt-2 space-y-4 md:space-y-6">
            {orders?.map((order, idx) => (
              <motion.div
                key={order._id?.toString() ?? idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }} // Staggered animation
              >
                <UserOrderCard order={order} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
