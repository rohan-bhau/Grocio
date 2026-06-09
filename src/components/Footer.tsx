"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { BiLeaf } from "react-icons/bi";
import logoImg from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="bg-white px-3 py-2 rounded-xl w-fit">
              <Image
                src={logoImg}
                alt="Grocio"
                width={110}
                height={36}
                className="object-contain"
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Grocio delivers fresh groceries to your doorstep in minutes.
              Quality products, reliable delivery, every time.
            </p>
            <div className="flex items-center gap-2 text-[#00a850] text-sm font-semibold">
              <BiLeaf className="text-lg" />
              <span>Fresh. Fast. Reliable.</span>
            </div>
            {/* Social */}
            <div className="flex gap-3 pt-1">
              {[
                {
                  icon: <FiFacebook size={18} />,
                  href: "#",
                  label: "Facebook",
                },
                {
                  icon: <FiInstagram size={18} />,
                  href: "#",
                  label: "Instagram",
                },
                { icon: <FiTwitter size={18} />, href: "#", label: "Twitter" },
                {
                  icon: <FaWhatsapp size={18} />,
                  href: "#",
                  label: "WhatsApp",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 bg-gray-800 hover:bg-[#00a850] rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "My Orders", href: "/user/my-orders" },
                { label: "Cart", href: "/user/cart" },
                { label: "Checkout", href: "/user/checkout" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#00a850] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-[#00a850] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Partners */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              For Partners
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Delivery Dashboard", href: "/delivery" },
                { label: "New Requests", href: "/delivery/requests" },
                { label: "Active Orders", href: "/delivery/active-order" },
                { label: "Order History", href: "/delivery/order-history" },
                { label: "Admin Panel", href: "/admin" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#00a850] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-[#00a850] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-gray-400">
                <FiMapPin
                  className="text-[#00a850] mt-0.5 shrink-0"
                  size={16}
                />
                <span>123 Green Avenue, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FiPhone className="text-[#00a850] shrink-0" size={16} />
                <a
                  href="tel:+8801700000000"
                  className="hover:text-[#00a850] transition-colors"
                >
                  +880 1700-000000
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FiMail className="text-[#00a850] shrink-0" size={16} />
                <a
                  href="mailto:support@grocio.com"
                  className="hover:text-[#00a850] transition-colors"
                >
                  support@grocio.com
                </a>
              </li>
            </ul>

            {/* Working Hours */}
            <div className="mt-6 bg-gray-800 rounded-xl p-4">
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Working Hours
              </p>
              <p className="text-xs text-gray-400">
                Mon – Fri: 8:00 AM – 10:00 PM
              </p>
              <p className="text-xs text-gray-400">
                Sat – Sun: 9:00 AM – 8:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Grocio. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs text-gray-500">
            <a href="#" className="hover:text-[#00a850] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#00a850] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-[#00a850] transition-colors">
              Refund Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
