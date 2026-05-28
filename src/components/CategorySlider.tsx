import React from 'react'
import { LuApple, LuBaby, LuChrome, LuCoffee, LuCookie, LuFlame, LuHeart, LuMilk, LuPackage, LuWheat } from 'react-icons/lu';

const CategorySlider = () => {
  const categories = [
    {
      id: 1,
      name: "Fruits & Vegetables",
      icon: LuApple,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      id: 2,
      name: "Dairy & Eggs",
      icon: LuMilk,
      color: "bg-amber-50 text-amber-500",
    },
    {
      id: 3,
      name: "Rice, Atta & Grains",
      icon: LuWheat,
      color: "bg-orange-50 text-orange-500",
    },
    {
      id: 4,
      name: "Snacks & Biscuits",
      icon: LuCookie,
      color: "bg-rose-50 text-rose-500",
    },
    {
      id: 5,
      name: "Spices & Masalas",
      icon: LuFlame,
      color: "bg-red-50 text-red-500",
    },
    {
      id: 6,
      name: "Beverages & Drinks",
      icon: LuCoffee,
      color: "bg-sky-50 text-sky-500",
    },
    {
      id: 7,
      name: "Personal Care",
      icon: LuHeart,
      color: "bg-purple-50 text-purple-500",
    },
    {
      id: 8,
      name: "Household Essentials",
      icon: LuChrome,
      color: "bg-teal-50 text-teal-600",
    },
    {
      id: 9,
      name: "Instant & Packaged Food",
      icon: LuPackage, 
      color: "bg-indigo-50 text-indigo-500",
    },
    {
      id: 10,
      name: "Baby & Pet Care",
      icon: LuBaby,
      color: "bg-pink-50 text-pink-500",
    },
  ];
  return (
    <div>
      
    </div>
  )
}

export default CategorySlider
