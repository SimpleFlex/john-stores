import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const SwiftSend = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-80 sm:h-130.5 justify-center items-center overflow-hidden">
      {/* Background Image */}
      <img
        className="absolute inset-0 w-full h-full object-cover"
        alt=""
        src={assets.gift_box_img}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(82deg,rgba(0,14,8,0.65)_4.38%,rgba(17,47,33,0.65)_98.55%)]" />

      {/* Centered Content */}
      <div className="relative flex flex-col items-center justify-center text-center gap-8.75 px-4">
        <div className="flex flex-col items-center gap-3.75">
          <div>
            <p className="text-white font-clash-grotesk text-4xl sm:text-6xl font-medium leading-10 sm:leading-15">
              Send Packages Worldwide
            </p>
            <p className="text-[#00E27C] font-clash-grotesk text-4xl sm:text-6xl font-medium leading-10 sm:leading-15">
              With Confidence
            </p>
          </div>
          <div>
            <p className="text-[#D1D5DC] font-dm-sans text-xs sm:text-base font-normal leading-5 sm:leading-7 max-w-125">
              Join thousands of satisfied customers who trust Swift Logistics
              for their international deliveries
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/swift-logistics")}
            className="inline-flex gap-1 sm:gap-2 px-4 sm:px-6 py-2 justify-center items-center rounded-[10px] bg-[#00E27C] cursor-pointer"
          >
            <p className="font-clash-grotesk text-black text-xs sm:text-sm font-medium leading-6 text-center">
              Send a Package
            </p>
            <img src={assets.black_arrow} alt="" />
          </button>

          <a
            href="https://wa.me/2349039632833"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex gap-1 sm:gap-2 px-4 sm:px-6 py-2 justify-center items-center rounded-[10px] bg-white cursor-pointer"
          >
            <img src={assets.black_what} alt="" />
            <p className="font-clash-grotesk text-black text-xs sm:text-sm font-medium leading-6 text-center">
              Talk to Support
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SwiftSend;
