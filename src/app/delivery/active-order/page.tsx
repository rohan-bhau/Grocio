'use client'

import dynamic from "next/dynamic";
const LiveMap = dynamic(() => import("@/components/LiveMap"), { ssr: false });
import { getSocket } from '@/lib/socket';
import { RootState } from '@/redux/store';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import DeliveryChat from "@/components/DeliveryChat";

export interface ILocation{
    latitude: number,
    longitude:number
}

const ActiveOrder = () => {
    const [activeOrder, setActiveOrder] = useState<any>(null)
    const [userLocation, setUserLocation] = useState<ILocation>({
        latitude: 0,
        longitude:0
    })
    const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
      latitude: 0,
      longitude: 0,
    });
    
    

    const { userData } = useSelector((state: RootState) => state.user)
    
    const router = useRouter()

    useEffect(() => {
         const fetchCurrentOrder = async () => {
           try {
             const result = await axios.get("/api/delivery/current-order");
               console.log(result.data.assignment);
               if (result.data.active) {
                   setActiveOrder(result.data.assignment)
                   setUserLocation({
                       latitude: result.data.assignment.order.address.latitude,
                       longitude: result.data.assignment.order.address.longitude,
                   })
               }
           } catch (error) {
             console.log(error);
           }
        };
        fetchCurrentOrder();
    }, [userData]);

    useEffect(() => {
        const socket = getSocket()
        if (!userData?._id) return;
        if (!navigator.geolocation) return;

        const watcher = navigator.geolocation.watchPosition(
          (pos) => {
            const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                
                setDeliveryBoyLocation({
                    latitude: lat,
                    longitude:lon
                })

            socket.emit("update-location", {
              userId:userData?._id,
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

    // empty active order
    if (!activeOrder) {
        return <div>
            there is no active order
        </div>
    }

  return (
    <div className="p-4 pt-30 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto">
        {/* heading */}
        <div className="fixed top-0 left-0 w-full backdrop-blur-xl bg-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-b border-gray-100 z-50">
          <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 py-4">
            <button
              onClick={() => router.push("/")}
              className="p-2.5 bg-gray-50 border border-gray-100 rounded-full hover:bg-gray-100 text-gray-600 hover:text-[#00a850] active:scale-95 transition-all"
            >
              <FaArrowLeft size={16} />
            </button>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Active Order
            </h1>
          </div>
        </div>

        <p>
          active order{" "}
          <span className='text-green-600 font-bold'>#{activeOrder.order._id.slice(-8).toUpperCase()}</span>
              </p>
              
              {/* live map */}
              <div className='rounded-xl border shadow-lg border-gray-200'>
                  <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />
              </div>


              <DeliveryChat orderId={activeOrder.order._id} deliveryBoyId={userData?._id} />

      </div>
    </div>
  );
}

export default ActiveOrder
