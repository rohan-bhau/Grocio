"use client";
import axios from "axios";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { LuUserCog, LuUserRound } from "react-icons/lu";
import { MdDeliveryDining } from "react-icons/md";

const EditRoleMobile = () => {
  const router = useRouter();

  const roles = [
    { id: "admin", label: "Admin", icon: LuUserCog },
    { id: "user", label: "User", icon: LuUserRound },
    { id: "deliveryBoy", label: "Delivery Boy", icon: MdDeliveryDining },
  ];

  const [selectedRole, setSelectedRole] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const {update} = useSession()

  const isValid = selectedRole && mobile.length === 11;

  const handleEdit = async () => {
    if (!isValid) return;
    try {
      setLoading(true);
      await axios.post("/api/user/edit-role-mobile", {
        role: selectedRole,
        mobile,
      });
      await update({role:selectedRole})
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 px-6 flex flex-col items-center justify-center">
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold text-gray-900 text-center"
      >
        Select your role
      </motion.h2>

      <p className="text-sm text-gray-500 mt-1">
        Choose how you want to use Grocio
      </p>

      {/* Roles */}
      <div className="grid grid-cols-1 gap-4 mt-8 w-full max-w-sm">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <motion.button
              key={role.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedRole(role.id)}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all
              ${
                isSelected
                  ? "border-green-600 bg-green-100"
                  : "border-gray-300 bg-white hover:border-green-400 hover:bg-green-50"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isSelected
                    ? "bg-green-200 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <span className="text-sm font-medium text-gray-800">
                {role.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Input */}
      <div className="mt-8 w-full max-w-sm">
        <label className="text-sm text-gray-600">Mobile number</label>
        <input
          type="tel"
          placeholder="01XXXXXXXXX"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 text-sm
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      {/* Button */}
      <button
        disabled={!isValid || loading}
        onClick={handleEdit}
        className={`w-full max-w-sm mt-8 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition
        ${
          isValid
            ? "bg-green-600 text-white hover:bg-green-700 active:scale-[0.97] cursor-pointer"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        {loading ? "Processing..." : "Continue"} <FaArrowRight />
      </button>
    </div>
  );
};

export default EditRoleMobile;
