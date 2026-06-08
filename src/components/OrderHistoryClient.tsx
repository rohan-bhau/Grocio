"use client";

import React, { useState } from "react";
import { motion as m } from "framer-motion";
import {
  FiClock,
  FiCheckCircle,
  FiDollarSign,
  FiSearch,
  FiCalendar,
  FiUser,
  FiMapPin,
} from "react-icons/fi";

interface HistoryOrder {
  id: string;
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  isPaid: boolean;
  deliveredDate: string;
  deliveredTime: string;
}

interface ClientProps {
  orders: HistoryOrder[];
  totalOrdersCount: number;
  totalHistoryEarnings: number;
}

const OrderHistoryClient: React.FC<ClientProps> = ({
  orders,
  totalOrdersCount,
  totalHistoryEarnings,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter(
    (order) =>
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 pt-4">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <FiClock className="text-emerald-600" size={28} /> Order History
          </h1>
          <p className="text-gray-500 text-sm mt-0.5 font-medium">
            Reviewing your successful deliveries from the last 30 days.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <FiSearch
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search ID or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* History Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              30 Days Deliveries
            </p>
            <h3 className="text-2xl font-black text-gray-900">
              {totalOrdersCount} Orders
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <FiCheckCircle size={12} /> 100% Successful Drops
            </p>
          </div>
          <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-600">
            <FiCheckCircle size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              30 Days Period Earnings
            </p>
            <h3 className="text-2xl font-black text-emerald-600">
              ৳{totalHistoryEarnings}
            </h3>
            <p className="text-[11px] text-gray-400 font-semibold">
              Calculated at ৳40 per order payout
            </p>
          </div>
          <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-600">
            <FiDollarSign size={22} />
          </div>
        </div>
      </div>

      {/* Main Table / List View */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredOrders.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    <th className="py-4 px-6">Order ID</th>
                    <th className="py-4 px-6">Customer Detials</th>
                    <th className="py-4 px-6">Delivery Date</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">Payout</th>
                    <th className="py-4 px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredOrders.map((order, idx) => (
                    <m.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="hover:bg-gray-50/40 transition-colors"
                    >
                      <td className="py-4 px-6 font-black text-gray-900">
                        #{order.orderId}
                      </td>
                      <td className="py-4 px-6 space-y-0.5">
                        <p className="font-extrabold text-gray-800">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-gray-400 font-medium">
                          {order.phone}
                        </p>
                        <p className="text-xs text-gray-500 font-medium max-w-xs truncate">
                          {order.address}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-700">
                            {order.deliveredDate}
                          </span>
                          <span className="text-xs text-gray-400 font-medium">
                            {order.deliveredTime}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-black text-gray-900">
                            ৳{order.totalAmount}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">
                            {order.paymentMethod}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-black text-emerald-600">
                        ৳40
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide">
                            Completed
                          </span>
                        </div>
                      </td>
                    </m.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">
                      #{order.orderId}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                      Completed
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-extrabold text-gray-800 flex items-center gap-1.5">
                      <FiUser size={14} className="text-gray-400" />{" "}
                      {order.customerName} ({order.phone})
                    </h4>
                    <p className="text-xs text-gray-500 font-medium flex items-start gap-1.5">
                      <FiMapPin
                        size={14}
                        className="text-gray-400 mt-0.5 shrink-0"
                      />{" "}
                      {order.address}
                    </p>
                    <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                      <FiCalendar size={14} className="text-gray-400" />{" "}
                      Delivered: {order.deliveredDate}{" "}
                      {order.deliveredTime && `at ${order.deliveredTime}`}
                    </p>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100/70 text-xs">
                    <div>
                      <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                        Total Bill
                      </p>
                      <p className="text-gray-900 font-black text-sm">
                        ৳{order.totalAmount}{" "}
                        <span className="text-[10px] text-gray-400 font-bold uppercase">
                          ({order.paymentMethod})
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                        Your Payout
                      </p>
                      <p className="text-emerald-600 font-black text-sm">৳40</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <FiClock className="mx-auto text-gray-200 w-12 h-12 mb-3" />
            <p className="text-gray-500 font-bold text-sm">
              No delivery history found
            </p>
            <p className="text-gray-400 text-xs mt-0.5">
              Orders completed within the last 30 days will show up here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryClient;
