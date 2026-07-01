"use client";

import { getSocket } from "@/lib/socket";
import { IMessage } from "@/models/message.model";
import axios from "axios";
import mongoose from "mongoose";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { BiSend } from "react-icons/bi";
import { HiOutlineSparkles } from "react-icons/hi";
import { LuLoader } from "react-icons/lu";

type Props = {
  orderId: mongoose.Types.ObjectId;
  deliveryBoyId: mongoose.Types.ObjectId;
};

const DeliveryChat = ({ orderId, deliveryBoyId }: Props) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const orderIdStr = orderId?.toString();
  const deliveryBoyIdStr = deliveryBoyId?.toString();

  // Join the chat room and listen for incoming messages
  useEffect(() => {
    if (!orderIdStr) return;
    const socket = getSocket();
    socket.emit("join-room", orderIdStr);

    const handleMessage = (message: any) => {
      if (message.roomId?.toString() === orderIdStr) {
        setMessages((prev) => {
          // Prevent duplicate messages from optimistic update
          const exists = prev.some(
            (m) =>
              m.text === message.text &&
              m.senderId?.toString() === message.senderId?.toString() &&
              m.time === message.time,
          );
          if (exists) return prev;
          return [...prev, message];
        });
      }
    };

    socket.on("send-message", handleMessage);
    return () => {
      socket.off("send-message", handleMessage);
    };
  }, [orderIdStr]);

  // Load all previous messages from the database on mount
  useEffect(() => {
    if (!orderIdStr) return;
    const getAllMessages = async () => {
      try {
        const result = await axios.post("/api/chat/messages", {
          roomId: orderIdStr,
        });
        setMessages(result.data || []);
      } catch (error) {
        console.log("load messages error:", error);
      }
    };
    getAllMessages();
  }, [orderIdStr]);

  // Auto scroll to the bottom whenever messages change
  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMsg = () => {
    if (!newMessage.trim()) return;
    const socket = getSocket();

    const message = {
      roomId: orderIdStr,
      text: newMessage,
      senderId: deliveryBoyIdStr,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Emit to socket server which will save to DB and broadcast to room
    socket.emit("Send-message", message);

    // Show the message immediately for the sender without waiting for socket echo
    setMessages((prev) => [...prev, message as any]);
    setNewMessage("");
  };

  const getSuggestions = async () => {
    setLoading(true);
    try {
      const lastMessage = messages
        ?.filter((m) => m.senderId?.toString() !== deliveryBoyIdStr)
        .at(-1);
      console.log(lastMessage)
      const result = await axios.post("/api/chat/ai-suggesstions", {
        message: lastMessage?.text,
        role: "delivery_boy",
      });
      console.log(result.data)
      setSuggestions(result.data);
    } catch (error) {
      console.log("get suggestions error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] md:h-[550px] w-full bg-white">
      {/* Header with AI suggest button */}
      <div className="bg-gray-50/50 p-4 border-b border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-gray-800 text-sm tracking-tight flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00a850] rounded-full animate-pulse"></div>
            Customer Support
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

        {/* AI suggestion pills */}
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

      {/* Messages list */}
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
              className={`flex ${msg.senderId?.toString() === deliveryBoyIdStr ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2.5 max-w-[75%] text-sm shadow-sm ${
                  msg.senderId?.toString() === deliveryBoyIdStr
                    ? "bg-[#00a850] text-white rounded-2xl rounded-br-sm"
                    : "bg-gray-100/80 text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100"
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                <p
                  className={`text-[9px] font-medium mt-1 text-right ${msg.senderId?.toString() === deliveryBoyIdStr ? "text-green-100" : "text-gray-400"}`}
                >
                  {msg.time}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Message input */}
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
            className="bg-[#00a850] hover:bg-green-600 p-3.5 rounded-xl text-white shadow-[0_4px_14px_rgba(0,168,80,0.3)] transition-all active:scale-95 flex items-center justify-center cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={sendMsg}
            disabled={!newMessage.trim()}
          >
            <BiSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryChat;
