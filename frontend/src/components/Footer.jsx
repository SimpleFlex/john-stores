import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="items-start px-15 pt-25 pb-[50.333px] bg-[#090A04]">
      <div className=" flex flex-col xl:flex-row gap-25 justify-between mb-12.5 items-start ">
        {/* Left side */}
        <div className="flex flex-col gap-4 xl:max-w-75">
          <div className="flex items-center gap-2.5">
            <img
              className="w-8 h-8 sm:w-10 sm:h-10"
              src={assets.john_enterprise_icon}
              alt=""
            />
            <p className="text-white font-clash-grotesk text-base font-medium leading-5 tracking-[0.48px] [-webkit-text-stroke:0.3px_#fff]">
              John's <br /> Enterprise
            </p>
          </div>
          <p className="text-white/70 font-dm-sans lg:text-base font-normal leading-6.25">
            A multi service company built to solve everyday needs through
            reliable logistics, quality products and media solutions.
          </p>
          <div className="flex gap-4">
            <a
              href="https://x.com/jegroup_co?s=21"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={assets.x_icon} alt="X / Twitter" />
            </a>
            <a
              href="https://www.instagram.com/thejohns_enterprises?igsh=ZTd6cDI4aThpdTBn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={assets.ig_icon} alt="Instagram" />
            </a>
            <a
              href="https://www.tiktok.com/@swift.logistics_?_r=1&_t=ZS-96BTCMLJV0K"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={assets.tiktok_icon} alt="TikTok" />
            </a>
          </div>
        </div>

        {/* Center side */}
        <div className="flex flex-col sm:flex-row gap-16.25">
          <div className="flex  flex-col gap-4">
            <p className="text-white font-clash-grotesk mb-5 text-[20px] font-medium leading-5">
              Our Services
            </p>
            <ul className="flex flex-col gap-4.5">
              <Link to="/swift-logistics">
                <li className="text-[#99A1AF] font-dm-sans text-base font-normal leading-4.5">
                  Swift Logistics
                </li>
              </Link>

              <Link to="/john-stores">
                <li className="text-[#99A1AF] font-dm-sans text-base font-normal leading-4.5">
                  John Stores
                </li>
              </Link>

              <Link to="/easy-media">
                <li className="text-[#99A1AF] whitespace-nowrap font-dm-sans text-base font-normal leading-4.5">
                  Easy Media (Coming Soon)
                </li>
              </Link>

              <Link to="/#about">
                <li className="text-[#99A1AF] font-dm-sans text-base font-normal leading-4.5">
                  About Us
                </li>
              </Link>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-white font-clash-grotesk mb-5 text-[20px] font-medium leading-5">
              Contact Us
            </p>
            <ul className="flex flex-col gap-4.5">
              <li className="flex gap-3 text-[#99A1AF] font-dm-sans text-base font-normal leading-4.5">
                <img className="w-4.5 h-4.5" src={assets.mail_icon} alt="" />
                <p>AJUONWUCHIEMERIE@icloud.com</p>
              </li>
              <li className="flex gap-3 text-[#99A1AF] font-dm-sans text-base font-normal leading-4.5">
                <img className="w-4.5 h-4.5" src={assets.small_phone} alt="" />
                <p>+234 903 963 2833</p>
              </li>
              <li className="flex gap-3 text-[#99A1AF] font-dm-sans text-base font-normal leading-4.5">
                <img
                  className="w-4.5 h-4.5"
                  src={assets.location_icon}
                  alt=""
                />
                <p>Toomuch communication plaza, Alaba international market,</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col items-center gap-2 ">
          <p className="text-white text-center font-clash-grotesk text-[20px] font-medium leading-5 tracking-[1px] underline decoration-solid">
            Scan Me
          </p>
          <img
            className=" w-33.75 rounded-[5px] border-4 border-[#E3494E] bg-gray-300 bg-cover bg-center"
            src={assets.qr_icon}
            alt=""
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center h-[52.667px] pr-0 md:gap-36.25 lg:gap-100 xl:gap-160 self-stretch border-t-[0.667px] border-white/10">
        <p className="text-[#99A1AF] font-dm-sans text-sm font-normal whitespace-nowrap  leading-5">
          © 2026 John Enterprise. All rights reserved
        </p>
        <div className="flex  gap-6">
          <p className="text-[#99A1AF] font-dm-sans text-sm font-normal leading-5">
            Privacy Policy
          </p>
          <p className="text-[#99A1AF] font-dm-sans text-sm font-normal leading-5">
            Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
