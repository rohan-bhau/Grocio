'use client'
import dynamic from 'next/dynamic';
import { getSocket } from '@/lib/socket';
import { RootState } from '@/redux/store';
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import {AnimatePresence, motion} from 'motion/react'
import { IMessage } from '@/models/message.model';
import { BiSend } from 'react-icons/bi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { LuLoader } from 'react-icons/lu';

const LiveMap = dynamic(() => import('@/components/LiveMap'), { ssr: false });

export interface ILocation {
  latitude: number;
  longitude: number;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "pending": return "bg-amber-50 text-amber-600 ring-amber-500/20";
    case "out of delivery": return "bg-blue-50 text-blue-600 ring-blue-500/20";
    case "delivered": return "bg-green-50 text-green-600 ring-green-500/20";
    default: return "bg-gray-50 text-gray-600 ring-gray-500/20";
  }
};

const TrackOrderPage = () => {
  const { userData } = useSelector((state: RootState) => state.user)
  const { id } = useParams()
  const [order, setOrder] = useState<any>(null)
  const router = useRouter()
  const chatBoxRef = useRef<HTMLDivElement>(null)

  const [userLocation, setUserLocation] = useState<ILocation>({ latitude: 0, longitude: 0 });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({ latitude: 0, longitude: 0 });
      const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<IMessage[]>()
  
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getOrder = async () => {
      try {
        const result = await axios.get(`/api/user/get-order/${id}`)
        setOrder(result.data)
        setUserLocation({
          latitude: result.data.address.latitude,
          longitude: result.data.address.longitude,
        })

        if (result.data.assignedDeliveryBoy?.location?.coordinates) {
          setDeliveryBoyLocation({
            latitude: result.data.assignedDeliveryBoy.location.coordinates[1],
            longitude: result.data.assignedDeliveryBoy.location.coordinates[0],
          });
        }
      } catch (error) {
        console.log(error)
      }
    }
    getOrder()
  }, [userData?._id])

  useEffect(() => {
    const socket = getSocket()

    const handleLocationUpdate = (data: any) => {
      setDeliveryBoyLocation({
        latitude: data?.location?.coordinates?.[1] ?? data.location.latitude,
        longitude: data?.location?.coordinates?.[0] ?? data.location.longitude,
      })
    }

    socket.on("update-deliveryBoy-location", handleLocationUpdate)
    return () => socket.off("update-deliveryBoy-location", handleLocationUpdate)
  }, [])

        useEffect(() => {
          const socket = getSocket();
          socket.emit("join-room", id);
                    socket.on("send-message", (message) => {
                      if (message.roomId == id) {
                        setMessages((prev) => [...prev!, message]);
                      }
                    });
          return () => {
            socket.off("send-message")
          }
        }, []);

        const sendMsg = () => {
          const socket = getSocket();

          const message = {
            roomId: id,
            text: newMessage,
            senderId: userData?._id,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };

          socket.emit("Send-message", message);

          setNewMessage("");
  };

      useEffect(() => {
          chatBoxRef.current?.scrollTo({
              top: chatBoxRef.current.scrollHeight,
              behavior: "smooth"
        })  
      }, [messages])
  
      const getSuggestions = async () => {
        setLoading(true);
        try {
          const lastMessage = messages
            ?.filter((m) => m.senderId !== userData?._id)
            .at(-1);
          // console.log(lastMessage?.text)
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
  
      useEffect(() => {
          const getAllMessages = async () => {
           try {
               const result = await axios.post("/api/chat/messages", { roomId: id })
               console.log(result.data)
               setMessages(result.data)
           } catch (error) {
              console.log(error)
           }
          }   
          getAllMessages()
      },[])

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00a850] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading order details...</p>
        </div>
      </div>
    )
  }



  return (
    <div className="w-full min-h-screen bg-gray-50/50">
      <div className="max-w-2xl mx-auto pb-24">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-xl px-4 py-4 border-b border-gray-100 shadow-sm flex gap-3 items-center z-50">
          <button
            onClick={() => router.back()}
            className="p-2.5 bg-gray-50 border border-gray-100 rounded-full hover:bg-gray-100 text-gray-600 hover:text-[#00a850] transition-all"
          >
            <FaArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Track Order</h2>
            <p className="text-sm text-gray-500">
              #{order._id.toString().slice(-8).toUpperCase()}
              <span
                className={`ml-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ring-1 ring-inset ${getStatusStyle(order.status)}`}
              >
                {order.status}
              </span>
            </p>
          </div>
        </div>

        <div className="px-4 mt-6 space-y-4">
          {/* Live Map */}
          <div className="rounded-2xl overflow-hidden shadow border border-gray-100">
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
          </div>

          {/* chatbox */}
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
            <div
              className="flex-1 overflow-y-auto p-3 space-y-3"
              ref={chatBoxRef}
            >
              <AnimatePresence>
                {messages?.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.senderId == userData?._id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`px-4 py-2 max-w-[75%] rounded-2xl shadow ${
                        msg.senderId === userData?._id
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
        </div>
      </div>
    </div>
  );
}

export default TrackOrderPage