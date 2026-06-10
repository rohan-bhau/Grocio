"use client";

import { motion } from "motion/react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { BiLeaf } from "react-icons/bi";
import { CiMail } from "react-icons/ci";
import { FaRegEye } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiLock, FiLogIn } from "react-icons/fi";
import { GoEyeClosed } from "react-icons/go";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const isValid = email && password.length >= 6;

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Using redirect false so we can handle the result manually
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,

      });
      console.log(result)
      console.log(email,password)
      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }
      if (result?.ok) {
        const callbackUrl = searchParams.get("callbackUrl") || "/";
        router.push(callbackUrl);
      window.location.href=callbackUrl
        router.refresh();
      }
    } catch (err) {
      console.log("login error:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      >
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome Back!
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
            Login to Grocio <BiLeaf className="text-green-600" />
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-gray-400">
              <CiMail />
            </span>
            <input
              type="email"
              value={email}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
            <label
              className={`absolute left-10 text-gray-500 text-sm transition-all ${focused === "email" || email ? "-top-2 text-xs bg-white px-1 text-green-600" : "top-3"}`}
            >
              Email address
            </label>
          </div>

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
              className="peer w-full border border-gray-300 rounded-xl py-3 pl-10 pr-10 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
            <label
              className={`absolute left-10 text-gray-500 text-sm transition-all ${focused === "password" || password ? "-top-2 text-xs bg-white px-1 text-green-600" : "top-3"}`}
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

          <button
            type="submit"
            disabled={!isValid || loading}
            className={`w-full py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${isValid ? "bg-green-600 text-white hover:bg-green-700 active:scale-[0.98] shadow-sm cursor-pointer" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
          >
            {loading ? (
              <div className="flex gap-2 items-center">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Logging in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <span className="flex-1 h-px bg-gray-200"></span>OR
            <span className="flex-1 h-px bg-gray-200"></span>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-xl text-sm hover:bg-green-50 hover:border-green-300 transition cursor-pointer"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <FcGoogle /> Continue with Google
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-green-600 hover:underline cursor-pointer inline-flex items-center gap-1"
          >
            <FiLogIn /> Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

// Suspense is required because useSearchParams needs it in Next.js
const LoginPage = () => (
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }
  >
    <LoginForm />
  </Suspense>
);

export default LoginPage;
