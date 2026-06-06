'use client'
import { getSocket } from "@/lib/socket";
import { IMessage } from "@/models/message.model";
import axios from "axios";
import mongoose from "mongoose";
import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { BiSend } from "react-icons/bi";
import {motion} from 'motion/react'
import { HiOutlineSparkles } from "react-icons/hi";
import { LuLoader } from "react-icons/lu";

type props = {
  orderId: mongoose.Types.ObjectId;
  deliveryBoyId: mongoose.Types.ObjectId;
};

const DeliveryChat = ({ orderId, deliveryBoyId }: props) => {
    const [newMessage, setNewMessage] = useState("")
    const [messages, setMessages] = useState<IMessage[]>()
    const [loading, setLoading] = useState(false)

    const chatBoxRef = useRef<HTMLDivElement>(null)

    const [suggestions, setSuggestions] = useState([
    ])

    useEffect(() => {
        const socket = getSocket()
        socket.emit("join-room", orderId)  
                socket.on("send-message", (message) => {
                  if (message.roomId == orderId) {
                    setMessages((prev) => [...prev!, message]);
                  }
                });
                  return () => {
                    socket.off("send-message");
                  };
    }, [])
    
    const sendMsg = () => {
        
        const socket = getSocket()

        const message = {
            roomId: orderId,
            text: newMessage,
            senderId: deliveryBoyId,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute:"2-digit"
            })
        }

        socket.emit("Send-message", message)

        setNewMessage("")
    }


    useEffect(() => {
        chatBoxRef.current?.scrollTo({
            top: chatBoxRef.current.scrollHeight,
            behavior: "smooth"
      })  
    },[messages])

    useEffect(() => {
        const getAllMessages = async () => {
         try {
             const result = await axios.post("/api/chat/messages", { roomId: orderId })
             console.log(result.data)
             setMessages(result.data)
         } catch (error) {
            console.log(error)
         }
        }   
        getAllMessages()
    }, [])
    
    const getSuggestions = async () => {
        setLoading(true)
        try {
            const lastMessage = messages?.filter(m=>m.senderId!==deliveryBoyId).at(-1)
            // console.log(lastMessage?.text)
            const result = await axios.post("/api/chat/ai-suggesstions", {
              message: lastMessage?.text,
              role: "delivery_boy",
            });
            setSuggestions(result.data)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

  return (
    <div className="bg-white rounded-3xl shadow-lg border p-4 h-[430px] flex flex-col mt-10">
      <div className="flex justify-between items-center MB-3">
        <span className="font-semibold text-gray-700 tex-sm">
          Quick Replies
        </span>
              <motion.button
                  disabled={loading}
                  whileTap={{ scale: 0.95 }}
                  onClick={getSuggestions}
          className="px-3 py-1 text-xs flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full shadow-xl border border-purple-200"
        >
          <HiOutlineSparkles />
          {loading? <LuLoader className="w-5 h-5 animate-spin"/> :"AI Suggest"}
        </motion.button>
      </div>

      <div className="flex gap-2 flex-wrap mb-3">
        {suggestions.map((s, idx) => (
            <motion.div key={idx}
                whileTap={{scale:0.95}}
                className="px-3 py-1 text-xs bg-green-50 border border-green-200 text-green-700 cursor-default rounded-full"
                onClick={()=>setNewMessage(s)}
            >{s}</motion.div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3" ref={chatBoxRef}>
        <AnimatePresence>
          {messages?.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.senderId == deliveryBoyId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 max-w-[75%] rounded-2xl shadow ${
                  msg.senderId === deliveryBoyId
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <p>{msg.text}</p>
                <p className="text-[10px] opacity-70 mt-1 text-right ">
                  {msg.time}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex mt-3 gap-2 border-t pt-3">
        <input
          type="text"
          placeholder="Type a message..."
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
          className="flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-green-600 p-3 "
        />
        <button
          className="bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white"
          onClick={sendMsg}
        >
          <BiSend />
        </button>
      </div>
    </div>
  );
};

export default DeliveryChat;
