/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import dynamic from "next/dynamic";
import { getSocket } from "@/lib/socket";
import { RootState } from "@/redux/store";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "motion/react";
import { IMessage } from "@/models/message.model";
import { BiSend } from "react-icons/bi";
import { HiOutlineSparkles } from "react-icons/hi";
import { LuLoader } from "react-icons/lu";

const LiveMap = dynamic(() => import("@/components/LiveMap"), { ssr: false });

export interface ILocation {
  latitude: number;
  longitude: number;
}

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-amber-50 text-amber-600 ring-amber-500/20";
    case "out of delivery":
    case "out for delivery":
      return "bg-blue-50 text-blue-600 ring-blue-500/20";
    case "delivered":
      return "bg-green-50 text-[#00a850] ring-green-500/20";
    default:
      return "bg-gray-50 text-gray-600 ring-gray-500/20";
  }
};

const TrackOrderPage = () => {
  const { userData } = useSelector((state: RootState) => state.user);
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const router = useRouter();
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // id string এ convert করো
  const idStr = id?.toString();
  const userIdStr = userData?._id?.toString();

  useEffect(() => {
    const getOrder = async () => {
      try {
        const result = await axios.get(`/api/user/get-order/${idStr}`);
        setOrder(result.data);
        setUserLocation({
          latitude: result.data.address.latitude,
          longitude: result.data.address.longitude,
        });

        if (result.data.assignedDeliveryBoy?.location?.coordinates) {
          setDeliveryBoyLocation({
            latitude: result.data.assignedDeliveryBoy.location.coordinates[1],
            longitude: result.data.assignedDeliveryBoy.location.coordinates[0],
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (idStr) getOrder();
  }, [userIdStr, idStr]);

  useEffect(() => {
    const socket = getSocket();

    const handleLocationUpdate = (data: any) => {
      setDeliveryBoyLocation({
        latitude: data?.location?.coordinates?.[1] ?? data.location.latitude,
        longitude: data?.location?.coordinates?.[0] ?? data.location.longitude,
      });
    };

    socket.on("update-deliveryBoy-location", handleLocationUpdate);
    return () =>
      socket.off("update-deliveryBoy-location", handleLocationUpdate);
  }, []);

  useEffect(() => {
    const socket = getSocket();

    const handleStatusUpdate = (data: { orderId: string; status: string }) => {
      if (data.orderId?.toString() === idStr) {
        setOrder((prev: any) => ({ ...prev, status: data.status }));

        if (data.status === "delivered") {
          router.push("/user/my-orders");
        }
      }
    };

    socket.on("order-status-update", handleStatusUpdate);
    return () => socket.off("order-status-update", handleStatusUpdate);
  }, [idStr, router]);

  useEffect(() => {
    if (!idStr) return;

    const socket = getSocket();

    // Room join করো
    socket.emit("join-room", idStr);

    const handleMessage = (message: any) => {
      if (message.roomId?.toString() === idStr) {
        setMessages((prev) => {
          // Duplicate check
          const alreadyExists = prev.some(
            (m) =>
              m.text === message.text &&
              m.senderId?.toString() === message.senderId?.toString() &&
              m.time === message.time,
          );
          if (alreadyExists) return prev;
          return [...prev, message];
        });
      }
    };

    socket.on("send-message", handleMessage);

    return () => {
      socket.off("send-message", handleMessage);
    };
  }, [idStr]);

  useEffect(() => {
    if (!idStr) return;

    const getAllMessages = async () => {
      try {
        const result = await axios.post("/api/chat/messages", {
          roomId: idStr,
        });
        setMessages(result.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    getAllMessages();
  }, [idStr]);

  //  Auto scroll
  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  //  Send message with optimistic update
  const sendMsg = () => {
    if (!newMessage.trim()) return;

    const socket = getSocket();

    const message = {
      roomId: idStr,
      text: newMessage,
      senderId: userIdStr,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socket.emit("Send-message", message);

    //  Optimistic update
    setMessages((prev) => [...prev, message as any]);
    setNewMessage("");
  };

  const getSuggestions = async () => {
    setLoading(true);
    try {
      const lastMessage = messages
        ?.filter((m) => m.senderId?.toString() !== userIdStr)
        .at(-1);

      if (!lastMessage?.text) {
        setLoading(false);
        return;
      }
      const result = await axios.post("/api/chat/ai-suggesstions", {
        message: lastMessage?.text,
        role: "user",
      });
      setSuggestions(result.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00a850] border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-sm" />
          <p className="text-gray-500 font-bold tracking-wide uppercase text-sm">
            Locating your order...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/50 pb-24 font-sans text-gray-900 relative">
      <div className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-2xl border-b border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] z-[9999]">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2.5 bg-gray-50 border border-gray-100 rounded-full hover:bg-gray-100 text-gray-600 hover:text-[#00a850] transition-colors active:scale-95 cursor-pointer outline-none shrink-0"
          >
            <FaArrowLeft size={16} />
          </button>
          <div className="flex-1 overflow-hidden">
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight line-clamp-1">
              Live Tracking
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-bold text-gray-400 tracking-wider">
                #{order._id.toString().slice(-8).toUpperCase()}
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full ring-1 ring-inset ${getStatusStyle(order.status)}`}
              >
                {order.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto pt-24 px-4 space-y-8">
        {/* Live Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-[2rem] p-2 md:p-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative z-10"
        >
          <div className="rounded-[1.5rem] overflow-hidden relative border border-gray-50 bg-gray-50 h-[300px] md:h-[400px]">
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
          </div>
        </motion.div>

        {/* Chat Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col h-[580px] overflow-hidden relative z-10"
        >
          {/* Chat Header */}
          <div className="bg-gray-50/50 p-4 border-b border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-gray-800 text-sm tracking-tight flex items-center gap-2">
                <div className="w-2 h-2 bg-[#00a850] rounded-full animate-pulse"></div>
                Support Chat
              </span>
              <motion.button
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={getSuggestions}
                className="px-4 py-1.5 text-xs font-bold flex items-center gap-1.5 bg-purple-50 text-purple-600 rounded-full border border-purple-100 hover:bg-purple-100 hover:border-purple-200 transition-colors shadow-sm outline-none cursor-pointer disabled:opacity-50"
              >
                <HiOutlineSparkles className="text-sm" />
                {loading ? (
                  <LuLoader className="w-4 h-4 animate-spin" />
                ) : (
                  "AI Suggest"
                )}
              </motion.button>
            </div>

            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-2 flex-wrap"
                >
                  {suggestions.map((s, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3.5 py-1.5 text-xs font-semibold bg-white border border-gray-200 text-gray-600 cursor-pointer rounded-full hover:border-[#00a850] hover:text-[#00a850] transition-colors shadow-sm"
                      onClick={() => setNewMessage(s)}
                    >
                      {s}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-white scroll-smooth"
            ref={chatBoxRef}
          >
            <AnimatePresence>
              {messages?.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${
                    msg.senderId?.toString() === userIdStr
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2.5 max-w-[75%] text-sm shadow-sm ${
                      msg.senderId?.toString() === userIdStr
                        ? "bg-[#00a850] text-white rounded-2xl rounded-br-sm"
                        : "bg-gray-100/80 text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <p
                      className={`text-[9px] font-medium mt-1 text-right ${
                        msg.senderId?.toString() === userIdStr
                          ? "text-green-100"
                          : "text-gray-400"
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Type a message..."
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMsg()}
                value={newMessage}
                className="flex-1 bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl outline-none focus:bg-white focus:border-[#00a850] focus:ring-4 focus:ring-green-50 transition-all text-sm font-medium placeholder-gray-400"
              />
              <button
                className="bg-[#00a850] hover:bg-green-600 p-3.5 rounded-xl text-white shadow-[0_4px_14px_rgba(0,168,80,0.3)] hover:shadow-[0_6px_20px_rgba(0,168,80,0.4)] transition-all active:scale-95 flex items-center justify-center cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={sendMsg}
                disabled={!newMessage.trim()}
              >
                <BiSend size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
