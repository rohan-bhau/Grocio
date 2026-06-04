"use client";

import { getSocket } from "@/lib/socket";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; 
import { FaArrowLeft, FaTruck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiMapPin, FiPhone, FiUser } from "react-icons/fi";
import { BiCreditCard, BiPackage } from "react-icons/bi";
import { useRouter } from "next/navigation";

const DeliveryRequest = () => {
  const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [assignments, setAssignments] = useState<any[]>([]);
  const router = useRouter()

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const result = await axios.get("/api/delivery/get-assignments");
        setAssignments(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAssignments();
  }, []);

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

  useEffect(() => {
    const socket = getSocket();

    const handleNewAssignment = (deliveryAssignment: any) => {
      setAssignments((prev) => [deliveryAssignment, ...prev]);
    };

    socket.on("new-assignment", handleNewAssignment);

    return () => socket.off("new-assignment", handleNewAssignment);
  }, []);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/50 dark:bg-[#1a1a1a] p-4 md:p-6 pb-24 text-gray-900 dark:text-gray-100">
      <div className="max-w-3xl mx-auto">
        {/* Header Section With Back Button */}
        <div className="flex items-center justify-between mb-8 sticky top-0 bg-gray-50/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md py-4 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="p-2.5 bg-gray-200 dark:bg-gray-800 cursor-pointer rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors active:scale-95"
            >
              <FaArrowLeft
                className="text-gray-700 dark:text-gray-300"
                size={16}
              />
            </button>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              New Requests
            </h2>
          </div>
          {assignments.length > 0 && (
            <span className="bg-green-100/10 dark:bg-green-900/30 text-[#00a850] font-bold px-4 py-1.5 rounded-full text-sm shadow-sm ring-1 ring-green-500/20">
              {assignments.length} Pending
            </span>
          )}
        </div>

        {/* Empty State */}
        {assignments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center mt-20 text-center"
          >
            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <FaTruck className="text-4xl text-gray-300 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold">No New Requests</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
              You are all caught up! Waiting for new delivery assignments to
              broadcast...
            </p>
          </motion.div>
        ) : (
          /* Assignment List */
          <div className="space-y-6">
            <AnimatePresence>
              {assignments.map((a, idx) => {
                const order = a.order;
                return (
                  <motion.div
                    key={a._id || idx}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.2 },
                    }}
                    transition={{ duration: 0.4 }}
                    className="bg-white/90 dark:bg-[#242424] backdrop-blur-xl rounded-[1.5rem] p-5 md:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-[#333333]"
                  >
                    {/* Top Row: Order ID & Time */}
                    <div className="flex justify-between items-start mb-4 border-b border-gray-100/80 dark:border-[#333333] pb-4">
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Order ID
                        </span>
                        <h3 className="text-lg font-extrabold mt-0.5">
                          #{order._id.slice(-8).toUpperCase()}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-lg">
                        <FiClock className="text-amber-500" />
                        {formatTime(a.createdAt)}
                      </div>
                    </div>

                    {/* Middle Row: Customer & Address */}
                    <div className="space-y-3 mb-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 bg-gray-50 dark:bg-[#333333] rounded-full flex items-center justify-center border border-gray-100 dark:border-[#444444] shrink-0">
                            <FiUser className="text-gray-500 dark:text-gray-400" />
                          </div>
                          <span className="font-bold">
                            {order.address.fullName}
                          </span>
                        </div>
                        <a
                          href={`tel:${order.address.mobile}`}
                          className="flex items-center gap-2 text-sm font-bold text-[#00a850] bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
                        >
                          <FiPhone /> Call
                        </a>
                      </div>

                      <div className="flex items-start gap-3 bg-gray-50/50 dark:bg-[#1f1f1f] p-3.5 rounded-xl border border-gray-100 dark:border-[#333333]">
                        <FiMapPin className="text-red-500 mt-0.5 shrink-0 text-lg" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
                          {order.address.fullAddress}
                        </span>
                      </div>
                    </div>

                    {/* Order Details & Summary */}
                    <div className="flex items-center justify-between bg-gray-50/50 dark:bg-[#1f1f1f] p-4 rounded-xl border border-gray-100 dark:border-[#333333] mb-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                          {order.paymentMethod === "cod" ? (
                            <FaTruck className="text-lg" />
                          ) : (
                            <BiCreditCard className="text-lg" />
                          )}
                          {order.paymentMethod === "cod"
                            ? "Cash to Collect"
                            : "Paid Online"}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          <BiPackage className="text-gray-400" />
                          {order.items.length} Item(s)
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-bold text-gray-400 uppercase">
                          Amount
                        </span>
                        <span className="text-xl font-black text-[#00a850]">
                          ৳ {order.totalAmount}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button className="flex-1 bg-white cursor-pointer dark:bg-[#242424] border-2 border-gray-200 dark:border-[#444444] text-gray-600 dark:text-gray-300 font-bold py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#333333] active:scale-[0.98] transition-all uppercase tracking-wide text-sm">
                        Decline
                      </button>
                      <button className="flex-[2] bg-[#00a850] cursor-pointer text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_rgba(0,168,80,0.3)] active:scale-[0.98] transition-all uppercase tracking-wide text-sm">
                        Accept Order
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryRequest;
