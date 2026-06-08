import React from "react";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import DeliveryDashboardClient from "../DeliveryDashboardClient";

const DeliveryBoyDashboard = async () => {
  await connectDb();
  const session = await auth();
  const deliveryBoyId = session?.user?.id;

  const orders = await Order.find({
    assignedDeliveryBoy: deliveryBoyId,
  });

  const todayStr = new Date().toDateString();
  const DELIVERY_RATE = 40; 

  const stats = orders.reduce(
    (acc, order) => {
      const orderDateStr = new Date(order.createdAt).toDateString();

      if (
        order.deliveryOtpVerification === true &&
        order.status === "delivered"
      ) {
        acc.totalCompleted += 1;
        acc.totalEarnings += DELIVERY_RATE;

        if (orderDateStr === todayStr) {
          acc.todayCompleted += 1;
          acc.todayEarnings += DELIVERY_RATE;
        }
      }

      if (order.status === "pending" || order.status === "out of delivery") {
        acc.activeOrders += 1;
      }

      return acc;
    },
    {
      todayEarnings: 0,
      todayCompleted: 0,
      totalEarnings: 0,
      totalCompleted: 0,
      activeOrders: 0,
    },
  );

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d;
  }).reverse();

  const weeklyEarningsData = last7Days.map((date) => {
    const dayStr = date.toDateString();
    const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" });

    const dayCompletedCount = orders.filter(
      (order) =>
        new Date(order.createdAt).toDateString() === dayStr &&
        order.status === "delivered" &&
        order.deliveryOtpVerification === true,
    ).length;

    return {
      day: dayLabel,
      Earnings: dayCompletedCount * DELIVERY_RATE,
      Deliveries: dayCompletedCount,
    };
  });

  const statusBreakdown = [
    { name: "Delivered", value: stats.totalCompleted, color: "#10b981" },
    { name: "Active / On Way", value: stats.activeOrders, color: "#f59e0b" },
    {
      name: "Pending / Others",
      value: orders.filter((o) => o.status === "pending").length,
      color: "#3b82f6",
    },
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen pl-0 a">
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
        <DeliveryDashboardClient
          stats={stats}
          weeklyData={weeklyEarningsData}
          pieData={statusBreakdown}
          deliveryBoyName={session?.user?.name || "Delivery Partner"}
        />
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;
