"use client";

import { motion } from "framer-motion";
import { useState, ReactNode } from "react";
import Image, { StaticImageData } from "next/image";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import {
  FiTrendingUp,
  FiChevronDown
} from "react-icons/fi";


type propType = {
  earnings: {
    today: number;
    sevenDays: number;
    total: number;
  };
  stats: (
    | { title: string; value: number; icon: StaticImageData }
    | { title: string; value: number; icon: ReactNode }
  )[];
  chartData: {
    day: string;
    orders: number;
    revenue: number;
  }[];
};

const isStaticImageData = (
  icon: StaticImageData | ReactNode,
): icon is StaticImageData =>
  typeof icon === "object" &&
  icon !== null &&
  "src" in icon &&
  typeof (icon as any).src === "string";

const AdminDashboardClient = ({ earnings, stats, chartData }: propType) => {
  const [filter, setFilter] = useState<"today" | "sevenDays" | "total">(
    "total",
  );

  const currentEarning =
    filter === "today"
      ? earnings.today
      : filter === "sevenDays"
        ? earnings.sevenDays
        : earnings.total;

  const title =
    filter === "today"
      ? "Today's Revenue"
      : filter === "sevenDays"
        ? "7-Day Revenue"
        : "Total Revenue";

  return (
    <div className="space-y-6 w-full">

      {/* DASHBOARD HEADING & FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Dashboard /{" "}
            <span className="text-blue-600 font-medium">Grocio</span>
          </p>
        </div>

        <div className="relative inline-block">
          <select
            onChange={(e) => setFilter(e.target.value as any)}
            value={filter}
            className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all"
          >
            <option value="total">Total Earning Overview</option>
            <option value="sevenDays">Last 7 Days</option>
            <option value="today">Today</option>
          </select>
          <FiChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      {/* REVENUE BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200/60 shadow-sm rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            {title}
          </h2>
          <p className="text-4xl font-extrabold text-gray-900 tracking-tight mt-1">
            $
            {currentEarning.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-xl text-green-700 text-sm font-semibold border border-green-100">
          <FiTrendingUp size={16} />
          <span>+5.45% Increased</span>
        </div>
      </motion.div>

      {/* STATS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => {
          const variations = [
            { bg: "bg-blue-50 text-blue-600", trend: "+2.00%", up: true },
            { bg: "bg-emerald-50 text-emerald-600", trend: "+5.45%", up: true },
            { bg: "bg-amber-50 text-amber-600", trend: "-2.00%", up: false },
            { bg: "bg-purple-50 text-purple-600", trend: "-25.0%", up: false },
          ][i] || { bg: "bg-gray-50 text-gray-600", trend: "0.00%", up: true };

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-gray-200/80 shadow-sm rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-400 tracking-wide">
                    {s.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">
                    {s.value.toLocaleString()}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-xl font-semibold ${variations.bg}`}
                >
                  {isStaticImageData(s.icon) ? (
                    <Image
                      src={s.icon}
                      fill
                      alt={s.title}
                      className="object-contain p-2"
                    />
                  ) : (
                    s.icon
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <span
                  className={variations.up ? "text-green-600" : "text-red-500"}
                >
                  {variations.trend}
                </span>
                <span className="text-gray-400 font-normal">
                  than last month
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AREA CHART */}
        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-800">
                Yearly Stats (Orders)
              </h3>
              <p className="text-xs text-gray-400">
                Total volume representation across days
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-gray-100 rounded-lg text-gray-600">
              Weekly View
            </span>
          </div>
          <div className="w-full h-80 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  stroke="#94a3b8"
                />
                <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BAR CHART */}
        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-800">
                Sales / Revenue
              </h3>
              <p className="text-xs text-gray-400">
                Financial distribution values per day
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-gray-100 rounded-lg text-gray-600">
              Weekly View
            </span>
          </div>
          <div className="w-full h-80 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  stroke="#94a3b8"
                />
                <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                  }}
                  cursor={{ fill: "#f8fafc" }}
                />
                <Bar
                  dataKey="revenue"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardClient;
