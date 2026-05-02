import React from "react";
import { assets } from "../assets/assets";

const SwiftHero = () => {
  return (
    <div className="relative w-full h-auto">
      {/* Hero Image */}
      <img
        className="w-137.75 sm:w-full  h-80 sm:h-auto"
        src={assets.swiftlog_hero}
        alt=""
      />

      {/* left side  */}
      <div className="flex flex-col absolute w-full px-6 sm:px-10 lg:px-18.25 top-5 sm:top-10 md:top-12 lg:top-15">
        {/* Welcome */}
        <div className="flex items-center mb-1 sm:mb-2.5 gap-1 sm:gap-2">
          <img
            className="w-4 h-4 sm:w-5 sm:h-5"
            src={assets.swift_icon}
            alt=""
          />

          <p className="font-dm-sans text-white text-[10px] sm:text-sm md:text-sm font-light leading-tight tracking-[-0.3px]">
            Welcome to Switch Logistics
          </p>
        </div>

        {/* Heading */}
        <div className="mb-2.5 ">
          <p
            className="font-clash-grotesk font-medium
           text-[40px] sm:text-5xl md:text-5xl lg:text-7xl xl:text-[80px]
           leading-10 sm:leading-10 md:leading-11 lg:leading-16 xl:leading-20
           
           text-white  drop-shadow-[5px_5px_65px_rgba(0,0,0,0.25)]"
          >
            <span>Send Packages &</span> <br />
            <span>Gifts Anywhere</span> <br /> <span>in the World</span>
          </p>
        </div>

        {/* Description */}

        <div className="mb-6 sm:mb-6 lg:mb-10">
          <p
            className="font-dm-sans text-white/70
           text-xs sm:text-sm  lg:text-base xl:text-xl
           font-normal leading-4 md:leading-5 lg:leading-6 xl:leading-relaxed max-w-85 md:max-w-120 lg:max-w-140 xl:max-w-170 "
          >
            Distance shouldn’t stop you from showing care. Swift Logistics makes
            it easy to send gifts across borders, handling delivery, tracking &
            logistics from start to finish so your package arrives safely and on
            time.
          </p>
        </div>

        <div className="flex w-full ">
          {/* Founder */}
          <button
            onClick={() =>
              document
                .getElementById("collections")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="gap-1 sm:gap-2 inline-flex px-2 sm:px-6 py-2 justify-center items-center rounded-[10px] cursor-pointer bg-[#00E27C]"
          >
            <p className="font-clash-grotesk text-black text-xs sm:text-sm font-medium leading-6 text-center">
              Send a Package
            </p>
            <img src={assets.black_arrow} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwiftHero;
