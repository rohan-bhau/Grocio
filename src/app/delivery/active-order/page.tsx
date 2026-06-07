/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import dynamic from "next/dynamic";
const LiveMap = dynamic(() => import("@/components/LiveMap"), { ssr: false });
import { getSocket } from "@/lib/socket";
import { RootState } from "@/redux/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaTruck } from "react-icons/fa";
import { useSelector } from "react-redux";
import DeliveryChat from "@/components/DeliveryChat";
import { motion } from "framer-motion";
import { RiLoaderLine } from "react-icons/ri";

export interface ILocation {
  latitude: number;
  longitude: number;
}

const ActiveOrder = () => {
  const [activeOrder, setActiveOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showOtpBox, setShowOtpBox] = useState(false)
    const [otp, setOtp] = useState('')
    const [otpError, setOtpError] = useState("")
    const [sendOtpLoading, setSendOtpLoading] = useState(false)
    const [verifyOtpLoading, setVerifyOtpLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });

  const { userData } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  useEffect(() => {
    const fetchCurrentOrder = async () => {
      try {
        setLoading(true);
        const result = await axios.get("/api/delivery/current-order");
        if (result.data.active) {
          setActiveOrder(result.data.assignment);
          setUserLocation({
            latitude: result.data.assignment.order.address.latitude,
            longitude: result.data.assignment.order.address.longitude,
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentOrder();
  }, [userData]);

  useEffect(() => {
    const socket = getSocket();
    if (!userData?._id) return;
    if (!navigator.geolocation) return;

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setDeliveryBoyLocation({
          latitude: lat,
          longitude: lon,
        });

        socket.emit("update-location", {
          userId: userData?._id,
          latitude: lat,
          longitude: lon,
        });
      },
      (err) => {
        console.log(err);
      },
      { enableHighAccuracy: true },
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [userData?._id]);
    
    const sendOtp = async () => {
        setSendOtpLoading(true)
        try {
            const result = await axios.post("/api/delivery/otp/send", { orderId: activeOrder.order._id })
            console.log(result.data)
            setShowOtpBox(true)
            setSendOtpLoading(false)
        } catch (error) {
            console.log(error)
            setSendOtpLoading(false)
        }
    }

    const verifyOtp = async () => {
           setVerifyOtpLoading(true)
       try {
         const result = await axios.post("/api/delivery/otp/verify", { orderId: activeOrder.order._id, otp});
         console.log(result.data);
           setActiveOrder(null)
           setVerifyOtpLoading(false)
        //    await fetchCurrentOrder();
       } catch (error) {
           setOtpError("Otp Verification error")
           setVerifyOtpLoading(false)
       } 
    }


  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00a850] border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-sm" />
          <p className="text-gray-500 font-bold tracking-wide uppercase text-sm">
            Fetching active order...
          </p>
        </div>
      </div>
    );
  }

  // Meaningful Empty State
  if (!activeOrder) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50/50">
        <div className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-2xl border-b border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] z-50">
          <div className="max-w-3xl mx-auto px-5 py-4 flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="p-2.5 bg-gray-50 border border-gray-100 rounded-full hover:bg-gray-100 text-gray-600 hover:text-[#00a850] transition-colors active:scale-95 cursor-pointer outline-none shrink-0"
            >
              <FaArrowLeft size={16} />
            </button>
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
              Active Order
            </h2>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 text-center"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
              <FaTruck className="text-4xl text-gray-300" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              No Active Orders
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              You currently don't have any ongoing deliveries. Head back to the
              dashboard to accept new requests.
            </p>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-[#00a850] hover:bg-green-600 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_rgba(0,168,80,0.3)] hover:shadow-[0_6px_20px_rgba(0,168,80,0.4)] transition-all active:scale-95 uppercase tracking-wide text-sm outline-none cursor-pointer"
            >
              Go to Dashboard
            </button>
          </motion.div>
        </div>
      </div>
    );
    }
  // Main UI
  return (
    <div className="w-full min-h-screen bg-slate-50/50 pb-24 font-sans text-gray-900">
      <div className="max-w-3xl mx-auto">
        {/* Fixed Header (z-[9999] to stay above map) */}
        <div className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-2xl border-b border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] z-[9999]">
          <div className="max-w-3xl mx-auto px-5 py-4 flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="p-2.5 bg-gray-50 border border-gray-100 rounded-full hover:bg-gray-100 text-gray-600 hover:text-[#00a850] transition-colors active:scale-95 cursor-pointer outline-none shrink-0"
            >
              <FaArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-lg font-extrabold text-gray-900 tracking-tight">
                Current Delivery
              </h1>
              <p className="text-xs font-bold text-[#00a850] tracking-wider uppercase mt-0.5">
                On Route
              </p>
            </div>
          </div>
        </div>

        <div className="pt-24 px-4 space-y-6">
          {/* Order Highlight Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-[1.5rem] p-4 flex items-center justify-between shadow-sm"
          >
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Order ID
              </p>
              <p className="text-base font-extrabold text-gray-900">
                #{activeOrder.order._id.slice(-8).toUpperCase()}
              </p>
            </div>
            <div className="bg-green-50 text-[#00a850] px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border border-green-100">
              Active
            </div>
          </motion.div>

          {/* Live Map Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[2rem] p-2 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 relative z-10"
          >
            <div className="rounded-[1.5rem] overflow-hidden relative border border-gray-50 bg-gray-50 h-[350px] md:h-[450px]">
              <LiveMap
                userLocation={userLocation}
                deliveryBoyLocation={deliveryBoyLocation}
              />
            </div>
          </motion.div>

          {/* Delivery Chat Component Wrapper */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden relative z-10"
          >
            <DeliveryChat
              orderId={activeOrder.order._id}
              // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
              deliveryBoyId={userData?._id!}
            />
          </motion.div>
        </div>

        <div className="mt-6 bg-white rounded-xl border border-gray-100 shadow p-6">
          {!activeOrder.order.deliveryOtpVerification && !showOtpBox && (
            <button
              onClick={sendOtp}
              className="w-full py-4 bg-green-600 hover:bg-green-700 cursor-pointer font-semibold active:scale-50 text-white rounded-lg"
            >
              {sendOtpLoading ? (
                <RiLoaderLine size={16} className="animate-spin text-white text-center mx-auto flex justify-center" />
              ) : (
                "Mark as Delivered"
              )}
            </button>
          )}

          {showOtpBox && (
            <div className="mt-4">
              <input
                type="number"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                className="w-full py-3 border border-gray-100 focus:ring-2 focus:ring-green-600 outline-none rounded-lg text-center"
                placeholder="Enter otp"
                maxLength={4}
              />
              <button
                onClick={verifyOtp}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 active:scale-50 font-semibold cursor-pointer text-white py-4 rounded-lg"
              >
                {verifyOtpLoading ? (
                  <RiLoaderLine size={16} className="animate-spin flex justify-center text-white text-center mx-auto" />
                ) : (
                  "Verify OTP"
                )}
              </button>
              {otpError && <div className="text-red-600 mt-2">{otpError}</div>}
            </div>
                  )}
                  {activeOrder.order.deliveryOtpVerification && <div className="text-green-700 text-center font-bold">Delivery Completed</div>}
        </div>
      </div>
    </div>
  );
};

export default ActiveOrder;
