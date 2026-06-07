import React from "react";
import AdminDashboardClient from "../AdminDashboardClient";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import Grocery from "@/models/grocery.model";

// Importing clean line icons from React Icons
import { FiShoppingCart, FiUsers, FiTruck, FiPackage } from "react-icons/fi";

const AdminDashboard = async () => {
  await connectDb();
  const orders = await Order.find({});
  const users = await User.find({ role: "user" });
  const groceries = await Grocery.find({});

  const totalOrders = orders.length;
  const totalCustomers = users.length;
  const pendingDeliveries = orders.filter((o) => o.status === "pending").length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount || 0, 0);
  const totalProducts = groceries.length;

  const today = new Date();
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);

  const todayOrder = orders.filter(
    (o) => new Date(o.createdAt) >= startOfToday,
  );
  const todayRevenue = todayOrder.reduce(
    (sum, o) => sum + o.totalAmount || 0,
    0,
  );

  const sevenDaysOrders = orders.filter(
    (o) => new Date(o.createdAt) >= sevenDaysAgo,
  );
  const sevenDaysRevenue = sevenDaysOrders.reduce(
    (sum, o) => sum + o.totalAmount || 0,
    0,
  );

  // Stats configuration using React Icons
  const stats = [
    {
      title: "New Orders",
      value: totalOrders,
      icon: <FiShoppingCart size={22} />,
    },
    {
      title: "Total Customers",
      value: totalCustomers,
      icon: <FiUsers size={22} />,
    },
    {
      title: "Pending Deliveries",
      value: pendingDeliveries,
      icon: <FiTruck size={22} />,
    },
    {
      title: "Total Products",
      value: totalProducts,
      icon: <FiPackage size={22} />,
    },
  ];

  const chartData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const dayOrders = orders.filter(
      (o) => new Date(o.createdAt) >= date && new Date(o.createdAt) < nextDay,
    );
    const ordersCount = dayOrders.length;
    const revenueSum = dayOrders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0,
    );

    chartData.push({
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      orders: ordersCount,
      revenue: revenueSum,
    });
  }

  return (
    <AdminDashboardClient
      earnings={{
        today: todayRevenue,
        sevenDays: sevenDaysRevenue,
        total: totalRevenue,
      }}
      stats={stats}
      chartData={chartData}
    />
  );
};

export default AdminDashboard;
