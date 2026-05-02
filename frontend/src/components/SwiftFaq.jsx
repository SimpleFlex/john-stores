import React, { useState } from "react";

const SwiftFaq = () => {
  const faqData = [
    {
      question: "How can I track my package?",
      answer:
        "You can track your package by logging into your account and checking the “Track Package” section. You’ll find updates on location, expected delivery time, and tracking history.",
    },
    {
      question: "What are the shipping charges?",
      answer:
        "Shipping charges depend on the weight, size, and destination of your package. You can calculate them in the checkout section.",
    },
    {
      question: "How do I cancel or change an order?",
      answer:
        "You can cancel or modify your order within 24 hours of placing it. Go to your orders page and select the order you want to change.",
    },
    {
      question: "How do I cancel or change an order?",
      answer:
        "You can cancel or modify your order within 24 hours of placing it. Go to your orders page and select the order you want to change.",
    },
    {
      question: "How do I cancel or change an order?",
      answer:
        "You can cancel or modify your order within 24 hours of placing it. Go to your orders page and select the order you want to change.",
    },
    {
      question: "How do I cancel or change an order?",
      answer:
        "You can cancel or modify your order within 24 hours of placing it. Go to your orders page and select the order you want to change.",
    },
  ];

  const [openIndexes, setOpenIndexes] = useState([]);

  const toggle = (index) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter((i) => i !== index));
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full bg-[#FAFAFA] p-[70px_60px] sm:p-[70px_241px]">
      {/* Heading */}
      <div id="swiftfq" className="mb-2 sm:mb-2.5">
        <p className="text-[#2D2D2D] text-center font-clash-grotesk text-xl sm:text-4xl font-medium leading-6 sm:leading-12">
          Frequently Asked Questions
        </p>
      </div>

      {/* Sub text */}
      <div className="text-center mb-10 sm:mb-20">
        <p className="text-[#6B6B6B] font-dm-sans max-w-75 sm:max-w-125 text-xs sm:text-base font-normal leading-4 sm:leading-5">
          Here’s everything you need to know about our services, processes, and
          how we make your experience simple and reliable.
        </p>
      </div>

      {/* FAQ Container (controls width) */}
      <div className="w-full max-w-225">
        {faqData.map((faq, index) => (
          <div key={index} className="w-full">
            {/* Question */}
            <div
              className={`flex w-full mb-4 h-12.5 sm:h-19 px-3 sm:px-6 justify-between items-center rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition-colors duration-300 ${
                openIndexes.includes(index)
                  ? "bg-[rgba(230,211,172,0.45)]"
                  : "bg-white"
              }`}
            >
              <p className="text-[#2D2D2D] font-dm-sans-500 text-sm md:text-[15px] lg:text-lg font-medium leading-7">
                {faq.question}
              </p>

              <img
                className={`w-6 h-6 sm:w-8 sm:h-8 transition-transform duration-300 cursor-pointer ${
                  openIndexes.includes(index) ? "rotate-180" : "rotate-0"
                }`}
                onClick={() => toggle(index)}
                src="/arrow.svg"
                alt=""
              />
            </div>

            {/* Answer */}
            <div
              className={`flex w-full mb-4 px-3 sm:px-6 rounded-2xl bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-300 ${
                openIndexes.includes(index)
                  ? "max-h-125 mt-1 sm:mt-2 py-3 sm:py-4"
                  : "max-h-0"
              }`}
            >
              <p className="text-[#2D2D2D] font-dm-sans text-sm md:text-sm lg:text-base leading-4 md:leading-5 lg:leading-6">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SwiftFaq;
