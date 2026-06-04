"use client";

import { getSocket } from "@/lib/socket";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; 

const DeliveryRequest = () => {
  const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [assignments, setAssignments] = useState<any[]>([]);

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
      setAssignments((prev) => [...prev, deliveryAssignment]);
    };

    socket.on("new-assignment", handleNewAssignment);

    return () => socket.off("new-assignment", handleNewAssignment);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Delivery Requests</h2>
        {assignments.map((a, idx) => (
          <div key={idx}>
            <p>
              <b>Order Id</b> #{a.order._id.slice(-8).toUpperCase()}
            </p>
            <p>{a.order.address.fullAddress}</p>

            <div className="flex gap-3 mt-4">
              <button className="flex-1 bg-green-600 text-white py-2 rounded-lg">
                Accept
              </button>
              <button className="flex-1 bg-red-600 text-white py-2 rounded-lg">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryRequest;
