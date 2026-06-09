/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-require-imports */
"use client";

import { AppDispatch, RootState } from "@/redux/store";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useMemo } from "react";
import { BsSearch } from "react-icons/bs";
import { FaArrowLeft, FaCreditCard } from "react-icons/fa";
import {
  FiHome,
  FiMapPin,
  FiUser,
  FiPhone,
  FiMap,
  FiCheckCircle,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { TbCurrentLocation } from "react-icons/tb";
import { ImCreditCard } from "react-icons/im";
import { FaTruckMoving } from "react-icons/fa6";
import axios from "axios";
import { clearCart } from "@/redux/cartSlice";

const CheckoutPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: RootState) => state.user);
  const { subTotal, deliveryFee, total, cartData } = useSelector(
    (state: RootState) => state.cart,
  );

  const [isMounted, setIsMounted] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null,
  );
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [markerIcon, setMarkerIcon] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    postalCode: "",
    fullAddress: "",
  });

  useEffect(() => {
    setIsMounted(true);
    const L = require("leaflet");
    const svgPin = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:40px;height:40px;filter:drop-shadow(0px 4px 4px rgba(0,0,0,0.3))"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#ffffff"></circle></svg>`;
    const customRedIcon = L.divIcon({
      className: "",
      html: svgPin,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
    setMarkerIcon(customRedIcon);
    const savedLocation = localStorage.getItem("grocio_checkout_location");
    if (savedLocation) {
      const [lat, lng] = JSON.parse(savedLocation) as [number, number];
      setMarkerPosition([lat, lng]);
      setMapCenter([lat, lng]);
      fetchAddressFromCoords(lat, lng);
    } else {
      handleCurrentLocation();
    }
  }, []);

  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({
        ...prev,
        fullName: userData.name || prev.fullName,
        mobile: userData.mobile || prev.mobile,
      }));
    }
  }, [userData]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 2) {
        fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`,
          { headers: { "Accept-Language": "en-US,en" } },
        )
          .then((res) => res.json())
          .then((data) => {
            setSuggestions(data);
            setShowSuggestions(true);
          })
          .catch((err) => console.error(err));
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { "Accept-Language": "en-US,en" } },
      );
      const data = await res.json();
      if (data?.address) {
        setAddress((prev) => ({
          ...prev,
          city:
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.suburb ||
            "",
          state: data.address.state || "",
          postalCode: data.address.postcode || "",
          fullAddress: data.display_name || "",
        }));
      }
    } catch (error) {
      console.error("fetchAddressFromCoords error:", error);
    }
  };

  const handleSelectSuggestion = (place: any) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    setMarkerPosition([lat, lon]);
    setMapCenter([lat, lon]);
    setSearchQuery("");
    setShowSuggestions(false);
    localStorage.setItem(
      "grocio_checkout_location",
      JSON.stringify([lat, lon]),
    );
    fetchAddressFromCoords(lat, lon);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setMarkerPosition([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          localStorage.setItem(
            "grocio_checkout_location",
            JSON.stringify([latitude, longitude]),
          );
          fetchAddressFromCoords(latitude, longitude);
        },
        (err) => {
          console.log("geolocation error:", err);
          const defaultPos: [number, number] = [24.4102, 88.9817];
          setMarkerPosition(defaultPos);
          setMapCenter(defaultPos);
          fetchAddressFromCoords(defaultPos[0], defaultPos[1]);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 },
      );
    }
  };

  const MapFlyTo = ({ target }: { target: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
      map.flyTo(target, 16, { animate: true, duration: 0.8 });
    }, [target[0], target[1], map]);
    return null;
  };

  const DraggableMarker = () => {
    const markerRef = useRef<any>(null);
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            const { lat, lng } = marker.getLatLng();
            setMarkerPosition([lat, lng]);
            setMapCenter([lat, lng]);
            localStorage.setItem(
              "grocio_checkout_location",
              JSON.stringify([lat, lng]),
            );
            fetchAddressFromCoords(lat, lng);
          }
        },
      }),
      [],
    );
    return markerPosition && markerIcon ? (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={markerPosition}
        ref={markerRef}
        icon={markerIcon}
      />
    ) : null;
  };

  // Place COD order and clear cart
  const handleCod = async () => {
    if (!address.fullAddress || !markerPosition) {
      alert("Please map your delivery location first!");
      return;
    }
    try {
      await axios.post("/api/user/order", {
        userId: userData?._id,
        items: cartData.map((item) => ({
          grocery: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          image: item.image,
          quantity: item.quantity,
        })),
        totalAmount: total,
        address: {
          ...address,
          latitude: markerPosition[0],
          longitude: markerPosition[1],
        },
        paymentMethod,
      });
      dispatch(clearCart());
      router.push("/user/order-success");
    } catch (error) {
      console.log("handleCod error:", error);
    }
  };

  // Place online order, clear cart, redirect to Stripe
  const handleOnlineOrder = async () => {
    if (!address.fullAddress || !markerPosition) {
      alert("Please map your delivery location first!");
      return;
    }
    try {
      const result = await axios.post("/api/user/payment", {
        userId: userData?._id,
        items: cartData.map((item) => ({
          grocery: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          image: item.image,
          quantity: item.quantity,
        })),
        totalAmount: total,
        address: {
          ...address,
          latitude: markerPosition[0],
          longitude: markerPosition[1],
        },
        paymentMethod,
      });
      dispatch(clearCart());
      window.location.href = result.data.url;
    } catch (error) {
      console.log("handleOnlineOrder error:", error);
    }
  };

  const inputClass =
    "w-full border-b-2 border-gray-100 bg-transparent py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-[#00a850] focus:outline-none transition-colors";

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 pt-8">
      <div className="w-[92%] md:w-[85%] max-w-6xl mx-auto relative">
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-gray-600 hover:text-[#00a850] font-semibold transition-colors"
            onClick={() => router.push("/user/cart")}
          >
            <FaArrowLeft />
            <span>Back to Cart</span>
          </motion.button>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 absolute left-1/2 -translate-x-1/2">
            Secure Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Contact details section */}
            <div className="bg-white rounded-[1.5rem] shadow-[0_2px_20px_rgba(0,0,0,0.04)] p-6 md:p-8 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="bg-green-100 text-[#00a850] w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  1
                </span>
                Contact Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <FiUser /> Full Name
                  </label>
                  <input
                    type="text"
                    value={address.fullName}
                    placeholder="e.g. John Doe"
                    className={inputClass}
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <FiPhone /> Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={address.mobile}
                    placeholder="e.g. +880 1XXX XXXXXX"
                    className={inputClass}
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        mobile: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Delivery address section */}
            <div className="bg-white rounded-[1.5rem] shadow-[0_2px_20px_rgba(0,0,0,0.04)] p-6 md:p-8 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="bg-green-100 text-[#00a850] w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  2
                </span>
                Delivery Address
              </h2>
              <div className="space-y-6">
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <FiMap /> Pinpoint Location
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1 z-[1001]">
                      <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && suggestions.length > 0)
                            handleSelectSuggestion(suggestions[0]);
                        }}
                        placeholder="Search area or landmark..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:bg-white focus:border-[#00a850] focus:ring-4 focus:ring-green-50 outline-none transition-all"
                      />
                      <AnimatePresence>
                        {showSuggestions && suggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto z-50"
                          >
                            {suggestions.map((place, idx) => (
                              <div
                                key={idx}
                                onClick={() => handleSelectSuggestion(place)}
                                className="px-4 py-3 border-b border-gray-50 hover:bg-green-50 cursor-pointer text-sm text-gray-700 transition-colors"
                              >
                                {place.display_name}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <button
                      onClick={() => {
                        if (suggestions.length > 0)
                          handleSelectSuggestion(suggestions[0]);
                      }}
                      className="bg-gray-900 text-white px-6 rounded-xl text-sm font-semibold hover:bg-gray-800 active:scale-95 transition-all"
                    >
                      Search
                    </button>
                  </div>

                  <div className="relative h-[300px] md:h-[350px] w-full rounded-2xl overflow-hidden border-2 border-gray-100 z-0">
                    <button
                      onClick={handleCurrentLocation}
                      className="absolute bottom-6 right-8 z-[1000] bg-green-600 p-2.5 rounded-full shadow-md border-none hover:bg-green-700 transition-all active:scale-95"
                    >
                      <TbCurrentLocation size={22} className="text-white" />
                    </button>
                    {isMounted && markerPosition ? (
                      <MapContainer
                        center={mapCenter || markerPosition}
                        zoom={16}
                        scrollWheelZoom={true}
                        className="w-full h-full"
                      >
                        <TileLayer
                          attribution="OSM"
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <DraggableMarker />
                        {mapCenter && <MapFlyTo target={mapCenter} />}
                      </MapContainer>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 gap-3">
                        <div className="w-8 h-8 border-4 border-[#00a850] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium">
                          Loading map...
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-[11px] md:text-xs font-medium shadow-lg z-[1000] flex items-center gap-2 pointer-events-none whitespace-nowrap">
                      <FiMapPin className="text-red-400" /> Drag the red pin to
                      exact location
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <FiHome /> Complete Address
                  </label>
                  <input
                    type="text"
                    value={address.fullAddress}
                    placeholder="House no, Floor, Street, Landmark"
                    className={inputClass}
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        fullAddress: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { label: "City", key: "city", placeholder: "e.g. Dhaka" },
                    {
                      label: "State/Div",
                      key: "state",
                      placeholder: "e.g. Dhaka",
                    },
                    {
                      label: "Postal Code",
                      key: "postalCode",
                      placeholder: "e.g. 1212",
                    },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={(address as any)[field.key]}
                        placeholder={field.placeholder}
                        className={inputClass}
                        onChange={(e) =>
                          setAddress((prev) => ({
                            ...prev,
                            [field.key]: e.target.value,
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment and order summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-[1.5rem] shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 p-6 md:p-8 flex flex-col sticky top-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  <FaCreditCard />
                </span>
                Payment Method
              </h2>
              <div className="space-y-4 mb-6">
                {[
                  {
                    id: "online",
                    label: "Pay Online (Stripe)",
                    icon: <ImCreditCard className="text-xl" />,
                  },
                  {
                    id: "cod",
                    label: "Cash on Delivery",
                    icon: <FaTruckMoving className="text-xl" />,
                  },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`relative flex items-center justify-between w-full border-2 rounded-xl p-4 transition-all duration-200 outline-none ${paymentMethod === pm.id ? "border-[#00a850] bg-green-50/50 shadow-sm" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={
                          paymentMethod === pm.id
                            ? "text-[#00a850]"
                            : "text-gray-400"
                        }
                      >
                        {pm.icon}
                      </span>
                      <span
                        className={`font-semibold text-sm ${paymentMethod === pm.id ? "text-[#00a850]" : "text-gray-600"}`}
                      >
                        {pm.label}
                      </span>
                    </div>
                    {paymentMethod === pm.id && (
                      <FiCheckCircle className="text-[#00a850] text-xl" />
                    )}
                  </button>
                ))}
              </div>
              <div className="space-y-3 text-sm text-gray-600 border-y border-gray-100 pb-4 pt-4 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">
                    ৳ {subTotal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-gray-800">
                    ৳ {deliveryFee}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-gray-800">Total</span>
                <span className="text-xl font-black text-[#00a850]">
                  ৳ {total}
                </span>
              </div>
              <button
                onClick={() =>
                  paymentMethod === "cod" ? handleCod() : handleOnlineOrder()
                }
                className="w-full bg-[#00a850] hover:bg-green-700 text-white text-sm font-bold py-4 rounded-xl transition-all shadow-[0_4px_14px_rgba(0,168,80,0.3)] active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-wide"
              >
                {paymentMethod === "cod" ? "Place Order" : "Proceed to Payment"}
              </button>
              {paymentMethod === "online" && (
                <p className="text-[10px] text-center text-gray-400 mt-4 font-medium uppercase tracking-wider">
                  100% Safe and Secure Payments
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
