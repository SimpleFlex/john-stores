import React from "react";
import { assets } from "../assets/assets";

const JohnHero = () => {
  return (
    <div className="relative w-full h-auto">
      {/* Hero Image */}
      <img
        className="w-137.75 sm:w-full  h-90 sm:h-auto"
        src={assets.stores_hero_img}
        alt=""
      />

      {/* left side  */}
      <div className="flex flex-col absolute w-full px-6 sm:px-10 lg:px-18.25 top-5 sm:top-10 md:top-12 lg:top-15">
        {/* Welcome */}
        <div className="flex items-center mb-1 sm:mb-2.5 gap-1 sm:gap-2">
          <img
            className="w-4 h-4 sm:w-5 sm:h-5"
            src={assets.john_stores_icon}
            alt=""
          />

          <p className="font-dm-sans text-white text-[10px] sm:text-sm md:text-sm font-light leading-tight tracking-[-0.3px]">
            Welcome to John’s Store
          </p>
        </div>

        {/* Heading */}
        <div className="mb-2.5 ">
          <p
            className="font-clash-grotesk font-medium
             text-[40px] sm:text-5xl md:text-5xl lg:text-7xl xl:text-[80px]
             leading-10 sm:leading-10 md:leading-10 lg:leading-15 xl:leading-20
             
             text-white  drop-shadow-[5px_5px_65px_rgba(0,0,0,0.25)]"
          >
            <span>Premium Gadgets.</span> <br />
            <span>Trusted Quality.</span> <br /> <span>Guaranteed.</span>
          </p>
        </div>

        {/* Description */}

        <div className="mb-6 sm:mb-6 lg:mb-10">
          <p
            className="font-dm-sans text-white/70
             text-xs sm:text-sm  lg:text-base xl:text-xl
             font-normal leading-4 md:leading-5 lg:leading-6 xl:leading-relaxed max-w-85 md:max-w-120 lg:max-w-140 xl:max-w-170 "
          >
            Explore our collection of phones, speakers, accessories & more. Shop
            carefully selected gadgets and accessories built for performance,
            durability, and everyday reliability so you get quality you can
            trust with every purchase.
          </p>
        </div>

        <div className="flex w-full ">
          {/* Founder */}
          <button
            onClick={() =>
              document
                .getElementById("shopcategory")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="cursor-pointer gap-1 sm:gap-2 inline-flex px-2 sm:px-6 py-2 justify-center items-center rounded-[10px] bg-[#F1A31D] "
          >
            <p className="font-clash-grotesk text-black text-xs sm:text-sm font-medium leading-6 text-center">
              Shop Now
            </p>
            <img src={assets.black_arrow} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JohnHero;
