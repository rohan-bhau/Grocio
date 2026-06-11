"use client";

import { getSocket } from "@/lib/socket";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaTruck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiMapPin, FiPhone, FiUser } from "react-icons/fi";
import { BiCreditCard, BiPackage } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const DeliveryRequest = () => {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState<any[]>([]);
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);

  const fetchAssignments = async () => {
    try {
      const result = await axios.get("/api/delivery/get-assignments");
      // Filter out any assignments where order is null or not populated
      const valid = result.data.filter((a: any) => a.order && a.order._id);
      setAssignments(valid);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCurrentOrder = async () => {
    try {
      const result = await axios.get("/api/delivery/current-order");
      if (result.data.active) {
        router.push("/delivery/active-order");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Emit identity so socketId is saved in DB
  useEffect(() => {
    if (!session?.user?.id) return;
    const socket = getSocket();

    const handleConnect = () => {
      socket.emit("identity", session.user!.id);
    };

    if (socket.connected) {
      socket.emit("identity", session.user.id);
    } else {
      socket.on("connect", handleConnect);
    }

    return () => {
      socket.off("connect", handleConnect);
    };
  }, [session?.user?.id]);

  // Listen for new assignment broadcasts
  useEffect(() => {
    const socket = getSocket();

    const handleNewAssignment = (deliveryAssignment: any) => {
      // Only add if order is properly populated
      if (deliveryAssignment?.order?._id) {
        setAssignments((prev) => [deliveryAssignment, ...prev]);
      }
    };

    socket.on("new-assignment", handleNewAssignment);

    return () => {
      socket.off("new-assignment", handleNewAssignment);
    };
  }, []);

  // Load on mount
  useEffect(() => {
    fetchCurrentOrder();
    fetchAssignments();
  }, [userData]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAccept = async (id: string) => {
    try {
      await axios.get(`/api/delivery/assignment/${id}/accept-assignment`);
      router.push("/delivery/active-order");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDecline = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a._id !== id));
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/50 p-4 md:p-6 pb-24 text-gray-900">
      <div className="max-w-3xl mx-auto">
        {assignments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center mt-20 text-center"
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
              <FaTruck className="text-4xl text-gray-300" />
            </div>
            <h3 className="text-xl font-bold">No New Requests</h3>
            <p className="text-gray-500 mt-2 max-w-sm">
              You are all caught up! Waiting for new delivery assignments to
              broadcast...
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {assignments.map((a, idx) => {
                const order = a.order;

                // Safety check - skip if order not properly populated
                if (!order || !order._id) return null;

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
                    className="bg-white/90 backdrop-blur-xl rounded-[1.5rem] p-5 md:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100"
                  >
                    {/* Order ID and Time */}
                    <div className="flex justify-between items-start mb-4 border-b border-gray-100/80 pb-4">
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Order ID
                        </span>
                        <h3 className="text-lg font-extrabold mt-0.5">
                          #{order._id.toString().slice(-8).toUpperCase()}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                        <FiClock className="text-amber-500" />
                        {formatTime(a.createdAt)}
                      </div>
                    </div>

                    {/* Customer and Address */}
                    <div className="space-y-3 mb-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shrink-0">
                            <FiUser className="text-gray-500" />
                          </div>
                          <span className="font-bold text-gray-800">
                            {order.address?.fullName || "Customer"}
                          </span>
                        </div>
                        <a
                          href={`tel:${order.address?.mobile}`}
                          className="flex items-center gap-2 text-sm font-bold text-[#00a850] bg-green-50 px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
                        >
                          <FiPhone /> Call
                        </a>
                      </div>

                      <div className="flex items-start gap-3 bg-gray-50/50 p-3.5 rounded-xl border border-gray-100">
                        <FiMapPin className="text-red-500 mt-0.5 shrink-0 text-lg" />
                        <span className="text-sm font-medium text-gray-700 leading-relaxed">
                          {order.address?.fullAddress ||
                            "Address not available"}
                        </span>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="flex items-center justify-between bg-gray-50/50 p-4 rounded-xl border border-gray-100 mb-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                          {order.paymentMethod === "cod" ? (
                            <>
                              <FaTruck className="text-lg" /> Cash to Collect
                            </>
                          ) : (
                            <>
                              <BiCreditCard className="text-lg" /> Paid Online
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                          <BiPackage className="text-gray-400" />
                          {order.items?.length || 0} Item(s)
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
                      <button
                        onClick={() => handleDecline(a._id)}
                        className="flex-1 bg-white cursor-pointer border-2 border-gray-200 text-gray-600 font-bold py-3.5 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all uppercase tracking-wide text-sm"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAccept(a._id)}
                        className="flex-[2] bg-[#00a850] cursor-pointer text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_rgba(0,168,80,0.3)] active:scale-[0.98] transition-all uppercase tracking-wide text-sm"
                      >
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
