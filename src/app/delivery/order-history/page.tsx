import React from "react";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import OrderHistoryClient from "@/components/OrderHistoryClient";

const OrderHistoryPage = async () => {
  await connectDb();
  const session = await auth();
  const deliveryBoyId = session?.user?.id;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const orders = await Order.find({
    assignedDeliveryBoy: deliveryBoyId,
    status: "delivered",
    deliveryOtpVerification: true,
    createdAt: { $gte: thirtyDaysAgo },
  }).sort({ createdAt: -1 });

  const DELIVERY_RATE = 40; 

  const totalOrdersCount = orders.length;
  const totalHistoryEarnings = totalOrdersCount * DELIVERY_RATE;

  const historyOrders = orders.map((order) => ({
    id: order._id.toString(),
    orderId: order._id.toString().substring(0, 8).toUpperCase(),
    customerName: order.address?.fullName || "Unknown Customer",
    phone: order.address?.mobile || "N/A",
    address: order.address?.fullAddress || "No Address Provided",
    totalAmount: order.totalAmount || 0,
    paymentMethod: order.paymentMethod,
    isPaid: order.isPaid,
    deliveredDate: order.deliveredAt
      ? new Date(order.deliveredAt).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : order.updatedAt
        ? new Date(order.updatedAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "N/A",
    deliveredTime: order.deliveredAt
      ? new Date(order.deliveredAt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
  }));

  return (
    <div className="bg-gray-50/50 min-h-screen w-full">
      <div className="p-4 md:p-6 lg:p-8 w-full">
        <OrderHistoryClient
          orders={historyOrders}
          totalOrdersCount={totalOrdersCount}
          totalHistoryEarnings={totalHistoryEarnings}
        />
      </div>
    </div>
  );
};

export default OrderHistoryPage;
