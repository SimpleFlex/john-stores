import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % 3);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative w-full h-80 sm:h-auto">
        {/* ── SLIDE 1 — John's Enterprise ── */}
        <div
          style={{
            transition: "opacity 1500ms ease-in-out",
            willChange: "opacity",
          }}
          className={`w-full ${
            current === 0
              ? "opacity-100 relative z-10"
              : "opacity-0 absolute inset-0 z-0 pointer-events-none"
          }`}
        >
          <img
            className="w-137.75 sm:w-full h-80 sm:h-auto"
            src={assets.john_hero_sec}
            alt=""
          />
          <div className="flex flex-col absolute w-full px-6 sm:px-10 lg:px-18.25 top-5 sm:top-10 md:top-12 lg:top-15">
            <div className="flex items-center mb-1 sm:mb-2.5 gap-1 sm:gap-2">
              <img
                className="w-4 h-4 sm:w-5 sm:h-5"
                src={assets.john_enterprise_icon}
                alt=""
              />
              <p className="font-dm-sans text-white text-[10px] sm:text-sm md:text-sm font-light leading-tight tracking-[-0.3px]">
                Welcome to John's Enterprise
              </p>
            </div>
            <div className="mb-2.5">
              <p className="font-clash-grotesk font-medium text-[40px] sm:text-5xl md:text-5xl lg:text-7xl xl:text-[100px] leading-10 sm:leading-10 md:leading-11 lg:leading-16 xl:leading-[5.6rem]">
                <span className="text-[#FFCFD1]">Building</span> <br />
                <span className="text-[#E3494E]">Services</span>{" "}
                <span className="text-[#FFCFD1]">
                  You <br /> Can
                </span>{" "}
                <span className="text-[#E3494E]">Trust</span>
              </p>
            </div>
            <div className="mb-6 sm:mb-6 lg:mb-10">
              <p className="font-dm-sans text-white/70 text-[10px] sm:text-sm lg:text-base xl:text-xl font-normal leading-4 md:leading-5 lg:leading-6 xl:leading-relaxed max-w-80 md:max-w-110 lg:max-w-130 xl:max-w-160">
                I built John Enterprise to solve real problems, from
                international delivery to quality technology products. Every
                service we offer is designed with reliability and customer
                satisfaction at its core.
              </p>
            </div>
            <div className="flex w-full items-end justify-between">
              <div className="flex gap-2 sm:gap-6 lg:gap-7.5">
                <img
                  className="aspect-square h-8 w-8 sm:h-13 sm:w-13 lg:h-13 lg:w-13"
                  src={assets.hero_frame}
                  alt=""
                />
                <div className="flex flex-col">
                  <p className="font-dm-sans text-[#FFF] text-[10px] sm:text-sm md:text-base lg:text-lg font-normal leading-4">
                    I am John
                  </p>
                  <p className="flex flex-wrap gap-1 items-center">
                    <span className="text-[#FFCFD1] font-clash-display text-[10px] sm:text-base md:text-lg lg:text-xl xl:text-[25px] font-medium leading-tight">
                      Founder
                    </span>
                    <span className="text-red-500 font-dm-sans text-[10px] sm:text-base md:text-lg lg:text-xl xl:text-[25px] font-semibold leading-tight tracking-[-0.5px]">
                      and
                    </span>
                    <span className="text-[#FFCFD1] font-clash-display text-[10px] sm:text-base md:text-lg lg:text-xl xl:text-[25px] font-medium leading-tight">
                      CEO
                    </span>
                  </p>
                </div>
              </div>
              <img
                className="h-8 sm:h-13 lg:h-13.75"
                src={assets.trusted_icon}
                alt=""
              />
            </div>
          </div>
        </div>

        {/* ── SLIDE 2 — Swift Logistics ── */}
        <div
          style={{
            transition: "opacity 1500ms ease-in-out",
            willChange: "opacity",
          }}
          className={`w-full ${
            current === 1
              ? "opacity-100 relative z-10"
              : "opacity-0 absolute inset-0 z-0 pointer-events-none"
          }`}
        >
          <img
            className="w-137.75 sm:w-full h-80 sm:h-auto"
            src={assets.swiftlog_hero}
            alt=""
          />
          <div className="flex flex-col absolute w-full px-6 sm:px-10 lg:px-18.25 top-5 sm:top-10 md:top-12 lg:top-15">
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
            <div className="mb-2.5">
              <p className="font-clash-grotesk font-medium text-[40px] sm:text-5xl md:text-5xl lg:text-7xl xl:text-[80px] leading-10 sm:leading-10 md:leading-11 lg:leading-16 xl:leading-20 text-white drop-shadow-[5px_5px_65px_rgba(0,0,0,0.25)]">
                <span>Send Packages &</span> <br />
                <span>Gifts Anywhere</span> <br />
                <span>in the World</span>
              </p>
            </div>
            <div className="mb-6 sm:mb-6 lg:mb-10">
              <p className="font-dm-sans text-white/70 text-xs sm:text-sm lg:text-base xl:text-xl font-normal leading-4 md:leading-5 lg:leading-6 xl:leading-relaxed max-w-85 md:max-w-120 lg:max-w-140 xl:max-w-170">
                Distance shouldn't stop you from showing care. Swift Logistics
                makes it easy to send gifts across borders, handling delivery,
                tracking & logistics from start to finish so your package
                arrives safely and on time.
              </p>
            </div>
            <div className="flex w-full">
              <button
                onClick={() => navigate("/swift-logistics")}
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

        {/* ── SLIDE 3 — John Stores ── */}
        <div
          style={{
            transition: "opacity 1500ms ease-in-out",
            willChange: "opacity",
          }}
          className={`w-full ${
            current === 2
              ? "opacity-100 relative z-10"
              : "opacity-0 absolute inset-0 z-0 pointer-events-none"
          }`}
        >
          <img
            className="w-137.75 sm:w-full h-90 sm:h-auto"
            src={assets.stores_hero_img}
            alt=""
          />
          <div className="flex flex-col absolute w-full px-6 sm:px-10 lg:px-18.25 top-5 sm:top-10 md:top-12 lg:top-15">
            <div className="flex items-center mb-1 sm:mb-2.5 gap-1 sm:gap-2">
              <img
                className="w-4 h-4 sm:w-5 sm:h-5"
                src={assets.john_stores_icon}
                alt=""
              />
              <p className="font-dm-sans text-white text-[10px] sm:text-sm md:text-sm font-light leading-tight tracking-[-0.3px]">
                Welcome to John's Store
              </p>
            </div>
            <div className="mb-2.5">
              <p className="font-clash-grotesk font-medium text-[40px] sm:text-5xl md:text-5xl lg:text-7xl xl:text-[80px] leading-10 sm:leading-10 md:leading-10 lg:leading-15 xl:leading-20 text-white drop-shadow-[5px_5px_65px_rgba(0,0,0,0.25)]">
                <span>Premium Gadgets.</span> <br />
                <span>Trusted Quality.</span> <br />
                <span>Guaranteed.</span>
              </p>
            </div>
            <div className="mb-6 sm:mb-6 lg:mb-10">
              <p className="font-dm-sans text-white/70 text-xs sm:text-sm lg:text-base xl:text-xl font-normal leading-4 md:leading-5 lg:leading-6 xl:leading-relaxed max-w-85 md:max-w-120 lg:max-w-140 xl:max-w-170">
                Explore our collection of phones, speakers, accessories & more.
                Shop carefully selected gadgets and accessories built for
                performance, durability, and everyday reliability so you get
                quality you can trust with every purchase.
              </p>
            </div>
            <div className="flex w-full">
              <button
                onClick={() => navigate("/john-stores")}
                className="cursor-pointer gap-1 sm:gap-2 inline-flex px-2 sm:px-6 py-2 justify-center items-center rounded-[10px] bg-[#F1A31D]"
              >
                <p className="font-clash-grotesk text-black text-xs sm:text-sm font-medium leading-6 text-center">
                  Shop Now
                </p>
                <img src={assets.black_arrow} alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Dots ── */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: "14px",
              height: "14px",
              transition: "background 400ms ease, border-color 400ms ease",
            }}
            className={`rounded-full cursor-pointer border-2 sm:hidden ${
              current === i
                ? "bg-white border-white"
                : "bg-transparent border-white/70"
            }`}
          />
        ))}
        {[0, 1, 2].map((i) => (
          <button
            key={`d-${i}`}
            onClick={() => setCurrent(i)}
            style={{
              width: "25px",
              height: "25px",
              transition: "background 400ms ease, border-color 400ms ease",
            }}
            className={`hidden sm:block rounded-full cursor-pointer border-2 ${
              current === i
                ? "bg-white border-white"
                : "bg-transparent border-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
