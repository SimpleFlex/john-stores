import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import SwiftProductItem from "./SwiftProductItem";

const SwiftCollections = () => {
  const { swiftProducts } = useContext(ShopContext);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);

  const categories = [
    { label: "Flowers & Bouquet", icon: assets.flower_icon },
    { label: "Electronics", icon: assets.electric_icon },
    { label: "Fashion & Shoes", icon: assets.fashion_icon },
    { label: "Customized Gifts", icon: assets.gift_icon },
    { label: "Jewelry & Accessories", icon: assets.jewelry_icon },
    { label: "Games and Toys", icon: assets.games_icon },
    { label: "Sports & Entertainment", icon: assets.sports_icon },
    { label: "Tools & Home Appliances", icon: assets.tools_icon },
    { label: "Automobiles & Motorcycles", icon: assets.automobiles_icon },
  ];

  const filteredProducts =
    selectedCategory === "All"
      ? swiftProducts.filter((item) => item.inStock)
      : swiftProducts.filter(
          (item) => item.category === selectedCategory && item.inStock,
        );

  return (
    <div
      id="collections"
      className="flex w-full min-h-screen flex-col justify-center items-center px-4 sm:px-15 py-20 bg-[#FAFAFA]"
    >
      {/* Header */}
      <div className="w-full flex flex-col items-center text-center mb-8 sm:mb-15">
        <p className="text-center flex text-[#2D2D2D] mb-2 sm:mb-2.5 font-clash-grotesk text-xl sm:text-4xl font-medium leading-6 sm:leading-12">
          Our Collections
        </p>
        <p className="text-center text-[#6B6B6B] font-dm-sans max-w-75 sm:max-w-125 text-xs sm:text-base font-normal leading-4 sm:leading-5">
          Handpicked packages & gifts for every occasion
        </p>
      </div>

      {/* Mobile Filter Button */}
      <div className="flex sm:hidden w-full mb-4 gap-3 items-center">
        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-[12px] border border-white bg-[rgba(0,226,124,0.08)] flex-1 justify-center"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#032817"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          <span className="text-[#032817] font-dm-sans-500 text-sm font-medium">
            {selectedCategory === "All"
              ? "Filter by Category"
              : selectedCategory}
          </span>
          {selectedCategory !== "All" && (
            <span className="w-2 h-2 rounded-full bg-white" />
          )}
        </button>

        {selectedCategory !== "All" && (
          <button
            onClick={() => setSelectedCategory("All")}
            className="px-4 py-3 rounded-[12px] border border-[#FB2C36] bg-[rgba(251,44,54,0.06)] text-[#FB2C36] font-dm-sans-500 text-sm font-medium whitespace-nowrap"
          >
            Clear
          </button>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex sm:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setFilterOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] p-5 max-h-[85vh] overflow-y-auto">
            {/* Handle */}
            <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mx-auto mb-5" />

            {/* Drawer Header */}
            <div className="flex justify-between items-center mb-5">
              <p className="text-[#1A1A1A] font-clash-grotesk text-lg font-medium">
                Shop by Category
              </p>
              <button
                onClick={() => setFilterOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F3F4F6]"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6A7282"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Category List */}
            <div className="flex flex-col gap-2.5 mb-6">
              {categories.map((cat, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedCategory(
                      selectedCategory === cat.label ? "All" : cat.label,
                    );
                    setFilterOpen(false);
                  }}
                  className={`flex items-center gap-3.75 px-4 py-3.5 rounded-[12px] border cursor-pointer transition-all duration-200 ${
                    selectedCategory === cat.label
                      ? "border-white bg-[#1a3227]"
                      : "border-white bg-[rgba(0,226,124,0.08)]"
                  }`}
                >
                  <img src={cat.icon} alt="" className="w-5 h-5" />
                  <p
                    className={`font-dm-sans-500 text-sm font-medium leading-4.5 tracking-[-0.5px] ${
                      selectedCategory === cat.label
                        ? "text-white"
                        : "text-[#1A1A1A]"
                    }`}
                  >
                    {cat.label}
                  </p>
                  {selectedCategory === cat.label && (
                    <svg
                      className="ml-auto"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              ))}
            </div>

            {/* Sort By */}
            <p className="text-[#1A1A1A] font-dm-sans-500 text-base font-medium mb-3">
              Sort By
            </p>
            <div className="flex h-14 justify-between px-5 py-2.5 items-center gap-2.5 rounded-[10px] border border-[rgba(3,40,23,0.35)] bg-[rgba(3,40,23,0.03)] mb-2">
              <p className="text-[#1A1A1A] font-dm-sans-500 text-base font-medium">
                <span className="text-[#6A7282]">Price:</span> Low to High
              </p>
              <img src="/arrow-black.svg" alt="" />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row w-full justify-between items-start self-stretch gap-10">
        {/* Desktop Left Sidebar */}
        <div className="hidden sm:flex flex-col items-start gap-2.5 p-3.75 rounded-2xl bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)] sm:sticky top-5">
          <div className="flex mb-2.5 w-full max-w-74.75 py-2.5 px-2.5 items-center gap-10">
            <div className="flex flex-col">
              <div className="flex gap-0.5 mb-0.5">
                <img
                  className="w-1.75 h-1.75"
                  src={assets.rectangle_dot_icon}
                  alt=""
                />
                <img
                  className="w-1.75 h-1.75"
                  src={assets.rectangle_dot_icon}
                  alt=""
                />
                <img
                  className="w-1.75 h-1.75"
                  src={assets.rectangle_dot_icon}
                  alt=""
                />
              </div>
              <div className="flex gap-0.5 mb-0.5">
                <img
                  className="w-1.75 h-1.75"
                  src={assets.rectangle_dot_icon}
                  alt=""
                />
                <img
                  className="w-1.75 h-1.75"
                  src={assets.rectangle_dot_icon}
                  alt=""
                />
                <img
                  className="w-1.75 h-1.75"
                  src={assets.rectangle_dot_icon}
                  alt=""
                />
              </div>
              <div className="flex gap-0.5">
                <img
                  className="w-1.75 h-1.75"
                  src={assets.rectangle_dot_icon}
                  alt=""
                />
                <img
                  className="w-1.75 h-1.75"
                  src={assets.rectangle_dot_icon}
                  alt=""
                />
                <img
                  className="w-1.75 h-1.75"
                  src={assets.rectangle_dot_icon}
                  alt=""
                />
              </div>
            </div>
            <p className="text-[#1A1A1A] font-dm-sans-500 text-lg font-medium leading-5 tracking-[-0.5px]">
              Shop by Category
            </p>
          </div>

          {categories.map((cat, index) => (
            <div
              key={index}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === cat.label ? "All" : cat.label,
                )
              }
              className={`flex mb-2.5 w-full max-w-74.75 py-2.5 px-2.5 items-center rounded-[10px] border cursor-pointer transition-all duration-200
                ${index === 0 ? "gap-8.25" : "gap-7.75"}
                ${
                  selectedCategory === cat.label
                    ? "border-white bg-[#162c22]"
                    : "border-white bg-[rgba(0,226,124,0.08)]"
                }`}
            >
              <img src={cat.icon} alt="" />
              <p
                className={`font-dm-sans-500 text-base font-medium leading-4.5 tracking-[-0.5px] ${
                  selectedCategory === cat.label
                    ? "text-white"
                    : "text-[#1A1A1A]"
                }`}
              >
                {cat.label}
              </p>
            </div>
          ))}

          <p className="text-[#1A1A1A] mb-5 font-dm-sans-500 text-lg font-medium leading-5 tracking-[-0.5px]">
            Sort By
          </p>
          <div className="flex h-15 justify-between px-5 py-2.5 items-center gap-2.5 self-stretch rounded-[10px] border border-[rgba(3,40,23,0.35)] bg-[rgba(3,40,23,0.03)]">
            <p className="text-[#1A1A1A] font-dm-sans-500 text-lg font-medium leading-5 tracking-[-0.5px]">
              <span className="text-[#6A7282] font-dm-sans-500 text-lg font-medium leading-5 tracking-[-0.5px]">
                Price:
              </span>{" "}
              Low to High
            </p>
            <img src="/arrow-black.svg" alt="" />
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 w-full">
          {/* Active filter chip on mobile */}
          {selectedCategory !== "All" && (
            <div className="flex sm:hidden items-center gap-2 mb-4">
              <span className="text-[#6A7282] font-dm-sans text-xs">
                Showing:
              </span>
              <span className="px-3 py-1 rounded-full bg-[#032817] text-white text-xs font-dm-sans-500">
                {selectedCategory}
              </span>
            </div>
          )}

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 mx-auto">
              {filteredProducts.map((item, index) => (
                <SwiftProductItem
                  key={index}
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  description={item.description}
                  inStock={item.inStock}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9CA3AF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <p className="text-[#2D2D2D] font-clash-grotesk text-lg font-medium">
                No products found
              </p>
              <p className="text-[#6B6B6B] font-dm-sans text-sm text-center px-8">
                No in-stock items in "{selectedCategory}"
              </p>
              <button
                onClick={() => setSelectedCategory("All")}
                className="px-6 py-2.5 rounded-[10px] bg-white text-white font-dm-sans-500 text-sm"
              >
                View All Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwiftCollections;
