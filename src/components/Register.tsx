"use client";

import axios from "axios";
import { motion } from "motion/react";
import { div } from "motion/react-client";
import { useState } from "react";
import { BiLeaf } from "react-icons/bi";
import { CiMail } from "react-icons/ci";
import { FaArrowLeft, FaRegEye } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiLock, FiLogIn } from "react-icons/fi";
import { GoEyeClosed } from "react-icons/go";
import { LuUserRound } from "react-icons/lu";

type propType = {
  previousStep: (s: number) => void;
};

const RegisterForm = ({ previousStep }: propType) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = name && email && password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Registered successfully 🚀");
    }, 1500);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      console.log(result.data);
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-6">
      {/* Back */}
      <button
        onClick={() => previousStep(1)}
        className="absolute top-6 left-6 flex items-center gap-2 text-green-600 hover:text-green-700 transition cursor-pointer"
      >
        <FaArrowLeft />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Create account
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
            Join Grocio <BiLeaf className="text-green-600" />
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="mt-8 space-y-6">
          {/* Floating Input Component */}
          {[
            {
              id: "name",
              label: "Full name",
              icon: <LuUserRound />,
              type: "text",
              value: name,
              setValue: setName,
            },
            {
              id: "email",
              label: "Email address",
              icon: <CiMail />,
              type: "email",
              value: email,
              setValue: setEmail,
            },
          ].map((field) => (
            <div key={field.id} className="relative">
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-gray-400">
                  {field.icon}
                </span>

                <input
                  type={field.type}
                  value={field.value}
                  onFocus={() => setFocused(field.id)}
                  onBlur={() => setFocused(null)}
                  onChange={(e) => field.setValue(e.target.value)}
                  className="peer w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-sm bg-transparent
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                />

                <label
                  className={`absolute left-10 text-gray-500 text-sm transition-all
                  ${
                    focused === field.id || field.value
                      ? "-top-2 text-xs bg-white px-1 text-green-600"
                      : "top-3"
                  }`}
                >
                  {field.label}
                </label>
              </div>
            </div>
          ))}

          {/* Password */}
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-gray-400">
              <FiLock />
            </span>

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full border border-gray-300 rounded-xl py-3 pl-10 pr-10 text-sm bg-transparent
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />

            <label
              className={`absolute left-10 text-gray-500 text-sm transition-all
              ${
                focused === "password" || password
                  ? "-top-2 text-xs bg-white px-1 text-green-600"
                  : "top-3"
              }`}
            >
              Password
            </label>

            {showPassword ? (
              <GoEyeClosed
                onClick={() => setShowPassword(false)}
                className="absolute right-3 top-3.5 cursor-pointer text-gray-500"
              />
            ) : (
              <FaRegEye
                onClick={() => setShowPassword(true)}
                className="absolute right-3 top-3.5 cursor-pointer text-gray-500"
              />
            )}

            {password && password.length < 6 && (
              <p className="text-xs text-red-500 mt-1">
                Minimum 6 characters required
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className={`w-full py-3 rounded-xl text-sm font-medium transition-all duration-200
            flex items-center justify-center gap-2
            ${
              isValid
                ? "bg-green-600 text-white hover:bg-green-700 active:scale-[0.98] shadow-sm hover:shadow-md cursor-pointer"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <div className="flex gap-2 items-center">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{" "}
                <span>Creating Your Account...</span>
              </div>
            ) : (
              "Create account"
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <span className="flex-1 h-px bg-gray-200"></span>
            OR
            <span className="flex-1 h-px bg-gray-200"></span>
          </div>

          {/* Google */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-xl text-sm 
            hover:bg-green-50 hover:border-green-300 transition cursor-pointer"
          >
            <FcGoogle />
            Continue with Google
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Already have an account?{" "}
          <span className="text-green-600 hover:text-green-700 hover:underline underline-offset-2 cursor-pointer inline-flex items-center gap-1">
            <FiLogIn /> Sign in
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterForm;
