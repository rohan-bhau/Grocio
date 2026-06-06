'use client'
import dynamic from 'next/dynamic';
import { getSocket } from '@/lib/socket';
import { RootState } from '@/redux/store';
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaBoxOpen } from 'react-icons/fa';
import { FiMapPin, FiPhone, FiUser } from 'react-icons/fi';
import { BiPackage } from 'react-icons/bi';
import { useSelector } from 'react-redux';

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

  const [userLocation, setUserLocation] = useState<ILocation>({ latitude: 0, longitude: 0 });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({ latitude: 0, longitude: 0 });

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
              <span className={`ml-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ring-1 ring-inset ${getStatusStyle(order.status)}`}>
                {order.status}
              </span>
            </p>
          </div>
        </div>

        <div className="px-4 mt-6 space-y-4">

          {/* Live Map */}
          <div className="rounded-2xl overflow-hidden shadow border border-gray-100">
            <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />
          </div>



        </div>
      </div>
    </div>
  )
}

export default TrackOrderPage