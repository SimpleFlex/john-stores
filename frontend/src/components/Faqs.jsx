import React, { useState } from "react";

const Faqs = () => {
  const faqData = [
    {
      question: "How can I track my package?",
      answer:
        "After your order or shipment is confirmed, our team will share delivery updates and tracking details with you directly via WhatsApp. This applies to both Swift Logistics deliveries and orders placed through John Stores, ensuring you stay informed until completion.",
    },
    {
      question: "How long does international delivery take?",
      answer: "International delivery takes 2 to 12 days",
    },
    {
      question: "What countries do you deliver to?",
      answer:
        "Swift Logistics handles deliveries across multiple international routes. When you submit a package request, we confirm availability for your specific destination and provide full shipping details before proceeding.",
    },
    {
      question: "Where is your office/store located?",
      answer:
        "We are located at Toomuch communication plaza, Alaba international market, Lagos state, Nigeria.",
    },
    {
      question: "When will Easy Media launch?",
      answer:
        "Easy Media is currently in development and launching soon. You'll be able to access VPNs, streaming services, virtual numbers, and more all in one place. Join the early access list to be notified first.",
    },
    {
      question: "Is John Stores and Swift Logistics a separate brand?",
      answer:
        "They operate as separate services but under the same ecosystem John's Enterprise. Johns Stores handles quality product sales while Swift Logistics handles your gift and package deliveries and shipping services. Both are created for your service.",
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
      <div id="faqs" className="mb-2.5">
        <p className="text-[#2D2D2D] text-center font-clash-grotesk text-xl sm:text-4xl font-medium leading-6 sm:leading-12">
          Frequently Asked Questions
        </p>
      </div>

      {/* Sub text */}
      <div className="text-center mb-10 sm:mb-20">
        <p className="text-[#6B6B6B] font-dm-sans max-w-75 sm:max-w-125 text-xs sm:text-base font-normal leading-4 sm:leading-5">
          Here's everything you need to know about our services, processes, and
          how we make your experience simple and reliable.
        </p>
      </div>

      {/* FAQ Container */}
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

export default Faqs;
