/* eslint-disable react-hooks/immutability */
"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BiPackage } from "react-icons/bi";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket";
import { AdminOrderCard } from "@/components/AdminOrderCard";
import mongoose from "mongoose";
import { IUser } from "@/models/user.model";
import { useSession } from "next-auth/react"; // ✅ add

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

const ManageOrdersPage = () => {
  const router = useRouter();
  const { data: session } = useSession(); // ✅ add
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ identity emit — admin এর socketId DB তে save হবে
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

    return () => {
      socket.off("connect", handleConnect);
    };
  }, [session?.user?.id]);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useEffect((): any => {
    const socket = getSocket();

    socket?.on("new-order", (newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
    });

    socket.on("order-assigned", ({ orderId, assignedDeliveryBoy }) => {
      setOrders((prev) =>
        prev?.map((o) =>
          o._id == orderId ? { ...o, assignedDeliveryBoy } : o,
        ),
      );
    });

    return () => {
      socket.off("new-order");
      socket.off("order-assigned");
    };
  }, []);

  const handleStatusChange = async (
    orderId: string,
    newStatus: IOrder["status"],
  ) => {
    try {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
      await axios.patch(`/api/admin/update-order-status/${orderId}`, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to update status", error);
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
