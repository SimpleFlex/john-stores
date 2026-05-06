import React, { useState } from "react";
import { assets } from "../assets/assets";
import { addEasyMediaEmail } from "../services/easymedia.service.js";

const EasyFooter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleNotify = async () => {
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      await addEasyMediaEmail({
        email,
        name: email.split("@")[0],
        location: "",
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to subscribe:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex h-80 sm:h-130.5 justify-center items-center overflow-hidden">
      <img
        className="absolute inset-0 w-full h-full object-cover"
        alt=""
        src={assets.easy_footer}
      />
      <div className="absolute inset-0 bg-[linear-gradient(82deg,rgba(4,3,47,0.9)_4.38%,rgba(22,0,223,0.65)_98.55%),url('/path-to-image')] bg-lightgray bg-center bg-cover bg-no-repeat" />
      <div className="relative flex flex-col items-center justify-center text-center gap-8.75 px-4">
        <div className="flex flex-col items-center gap-3.75">
          <div>
            <p className="text-white font-clash-grotesk text-4xl sm:text-6xl font-medium leading-10 sm:leading-15">
              Be the First to
            </p>
            <p className="text-white font-clash-grotesk text-4xl sm:text-6xl font-medium leading-10 sm:leading-15">
              Experience Easy Media
            </p>
          </div>
          <div>
            <p className="text-[#D1D5DC] font-dm-sans text-xs sm:text-base font-normal leading-5 sm:leading-7 max-w-125">
              We're building something powerful for digital access worldwide.
            </p>
          </div>
        </div>
        <div className="flex justify-center w-full mt-4">
          <div className="flex gap-2 sm:gap-3 w-full max-w-125 items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              className="flex-1 min-w-0 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-[100px] border border-white/25 bg-[rgba(9,10,4,0.05)] shadow-[inset_0_0_10px_0_rgba(0,0,0,0.1)]"
            />
            <button
              onClick={handleNotify}
              disabled={submitting || submitted}
              className="py-3 sm:py-4 px-4 sm:px-6 rounded-[100px] bg-[#D0D2FD] shadow-[-2px_-2px_4px_0_rgba(0,0,0,0.25)_inset] whitespace-nowrap"
            >
              <p className="text-black font-clash-grotesk text-sm sm:text-base font-medium leading-4.5">
                {submitted
                  ? "You're on the list!"
                  : submitting
                    ? "Sending..."
                    : "Notify Me"}
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EasyFooter;
