"use client";

import React from "react";
import { motion as m } from "framer-motion";
import {
  FiTruck,
  FiCheckCircle,
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
  FiPieChart,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface DashboardStats {
  todayEarnings: number;
  todayCompleted: number;
  totalEarnings: number;
  totalCompleted: number;
  activeOrders: number;
}

interface WeeklyData {
  day: string;
  Earnings: number;
  Deliveries: number;
}

interface PieData {
  name: string;
  value: number;
  color: string;
}

interface ClientProps {
  stats: DashboardStats;
  weeklyData: WeeklyData[];
  pieData: PieData[];
  deliveryBoyName: string;
}

const DeliveryDashboardClient: React.FC<ClientProps> = ({
  stats,
  weeklyData,
  pieData,
  deliveryBoyName,
}) => {
  return (
    <div className="space-y-8 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Hello, {deliveryBoyName} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-0.5 font-medium">
            Your performance analytics and current earning stats are up to date.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-xl text-sm font-bold self-start sm:self-auto border border-emerald-100/50">
          <FiCalendar size={16} />
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            day: "numeric",
            month: "short",
          })}
        </div>
      </div>

      {/* Stats Grid - Updated with ৳40 rate calculation values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Today's Income */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group"
        >
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Today's Income
            </p>
            <h3 className="text-2xl font-black text-emerald-600">
              ৳{stats.todayEarnings}
            </h3>
            <p className="text-[11px] text-gray-400 font-semibold">
              ৳40 × {stats.todayCompleted} deliveries
            </p>
          </div>
          <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-600">
            <FiDollarSign size={22} />
          </div>
        </m.div>

        {/* Active Task */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group"
        >
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Active Tasks
            </p>
            <h3 className="text-2xl font-black text-amber-500">
              {stats.activeOrders}
            </h3>
            <p className="text-[11px] text-gray-400 font-semibold">
              Orders to be delivered
            </p>
          </div>
          <div className="p-3.5 bg-amber-50 rounded-xl text-amber-600">
            <FiTruck size={22} />
          </div>
        </m.div>

        {/* Lifetime Deliveries */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group"
        >
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Orders
            </p>
            <h3 className="text-2xl font-black text-gray-900">
              {stats.totalCompleted}
            </h3>
            <p className="text-[11px] text-gray-400 font-semibold">
              Successful drop-offs
            </p>
          </div>
          <div className="p-3.5 bg-teal-50 rounded-xl text-teal-600">
            <FiCheckCircle size={22} />
          </div>
        </m.div>

        {/* Total Wallet */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group"
        >
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Earning
            </p>
            <h3 className="text-2xl font-black text-gray-900">
              ৳{stats.totalEarnings}
            </h3>
            <p className="text-[11px] text-gray-400 font-semibold">
              Total lifetime payout balance
            </p>
          </div>
          <div className="p-3.5 bg-blue-50 rounded-xl text-blue-600">
            <FiDollarSign size={22} />
          </div>
        </m.div>
      </div>

      {/* Graphs & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Earnings Bar Chart */}
        <m.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <FiTrendingUp size={18} />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">
                Weekly Earnings
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                Income summary of the past 7 days
              </p>
            </div>
          </div>

          <div className="w-full h-80 text-xs font-semibold">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f3f4f6"
                  vertical={false}
                />
                <XAxis dataKey="day" stroke="#9ca3af" tickLine={false} />
                <YAxis
                  stroke="#9ca3af"
                  tickLine={false}
                  axisLine={false}
                  unit="৳"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#10b981" }}
                />
                <Bar
                  dataKey="Earnings"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={45}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </m.div>

        {/* Status Breakdown Pie Chart */}
        <m.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <FiPieChart size={18} />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">
                Task Breakdown
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                Proportion of all allocated tasks
              </p>
            </div>
          </div>

          <div className="w-full h-64 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Custom Legend for cleaner look */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-50 text-center">
            {pieData.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex items-center justify-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[11px] font-bold text-gray-500 truncate">
                    {item.name}
                  </span>
                </div>
                <p className="text-sm font-black text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>
        </m.div>
      </div>
    </div>
  );
};

export default DeliveryDashboardClient;
