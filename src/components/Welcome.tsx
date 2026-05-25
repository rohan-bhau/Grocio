'use client'
import { motion } from "motion/react";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { LuBike } from "react-icons/lu";
import { TiShoppingCart } from "react-icons/ti";

type propType={
  nextStep:(s:number)=>void
}

const Welcome = ({nextStep}:propType) => {
    return (
      <div className="flex flex-col justify-center items-center  h-screen text-center p-6">
        {/* logo */}
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <Image
            src={"/assets/welcome-logo.png"}
            width={250}
            height={40}
            alt="brand logo"
            className="w-full object-contain"
          />
        </motion.div>

        {/* description */}
        <motion.p
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.3,
          }}
          className="mt-4 text-gray-700 text-lg md:text-xl max-w-lg"
        >
          Welcome to Grocio — your smart grocery delivery solution. Order fresh
          products, track in real-time, and enjoy fast, reliable delivery at
          your doorstep.
        </motion.p>

        {/* icons */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.6,
            delay: 0.5,
          }}
          className="flex justify-center items-center gap-3 mt-10"
        >
          <TiShoppingCart className="w-15 h-15 md:w-20 md:h-20 text-green-600 drop-shadow-md" />
          <LuBike className="w-15 h-15 md:w-20 md:h-20 text-orange-500 drop-shadow-2xl" />
        </motion.div>

        {/*  buttons */}
        <motion.button
          initial={{
            opacity: 0,
            y:20
          }}
          animate={{
            opacity: 1,
           y:0
          }}
          transition={{
            duration: 0.6,
            delay: 0.8,
          }}
          className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200 cursor-pointer active:translate-y-0.5 mt-10"
          onClick={()=>nextStep(2)}
        >
          Next <FaArrowRight />
        </motion.button>
      </div>
    );
};

export default Welcome;
