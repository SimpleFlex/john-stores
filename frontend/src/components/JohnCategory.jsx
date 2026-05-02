import React, { useContext, useState, useMemo } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import JohnProductItem from "./JohnProductItem";

// ─── Category list ────────────────────────────────────────────────────────────
// "All" uses empty string so filtering is simple: "" means no filter applied
const CATEGORIES = ["All", "Smartphones", "Audio", "Laptops", "Accessories"];

const JohnCategory = () => {
  const { johnStoresProducts } = useContext(ShopContext);

  // Track which category pill is active; "" = All
  const [activeCategory, setActiveCategory] = useState("");

  // ── Filtered products ──────────────────────────────────────────────────────
  // Memoised so it only recomputes when products list or active category changes
  const filtered = useMemo(() => {
    if (!activeCategory) return johnStoresProducts;
    return johnStoresProducts.filter(
      (p) => p.category?.toLowerCase() === activeCategory.toLowerCase(),
    );
  }, [johnStoresProducts, activeCategory]);

  // ── Category pill click handler ────────────────────────────────────────────
  const handleCategory = (cat) => {
    // "All" resets the filter; everything else sets the category
    setActiveCategory(cat === "All" ? "" : cat);
  };

  return (
    <div className="flex w-full min-h-screen flex-col justify-center items-center px-4 sm:px-6 md:px-8 py-10 sm:py-20 bg-[#FFF]">
      {/* ── Trust badges row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-20 mb-16 w-full justify-items-center">
        {/* Customers */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center">
            {[
              assets.stores_hero_icon1,
              assets.stores_hero_icon2,
              assets.stores_hero_icon3,
              assets.stores_hero_icon4,
            ].map((src, i) => (
              <img
                key={i}
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-white ${i > 0 ? "-ml-4" : ""}`}
                src={src}
                alt=""
              />
            ))}
          </div>
          <div className="flex flex-col gap-1 items-start">
            <p className="text-[#2D2D2D] font-clash-grotesk text-base sm:text-lg font-medium leading-5 sm:leading-6 [text-shadow:5px_5px_65px_rgba(0,0,0,0.25)]">
              2k
            </p>
            <p className="text-[rgba(45,45,45,0.7)] font-dm-sans-500 text-[10px] sm:text-xs font-medium leading-4 sm:leading-5 [text-shadow:5px_5px_65px_rgba(0,0,0,0.25)]">
              Customers
            </p>
          </div>
        </div>

        {/* Secured Shipping */}
        <div className="flex items-center gap-3 sm:gap-5">
          <img
            className="shrink-0 w-9 sm:w-11 h-9 sm:h-11"
            src="/secure.svg"
            alt=""
          />
          <div className="flex flex-col gap-1 items-start">
            <p className="text-[#2D2D2D] font-clash-grotesk text-base sm:text-lg font-medium whitespace-nowrap leading-5 [text-shadow:5px_5px_65px_rgba(0,0,0,0.25)]">
              Secured Shipping
            </p>
            <p className="text-[rgba(45,45,45,0.7)] font-dm-sans-500 text-[10px] sm:text-xs font-medium leading-4 [text-shadow:5px_5px_65px_rgba(0,0,0,0.25)]">
              Trusted and Guaranteed
            </p>
          </div>
        </div>

        {/* Flexible Payment */}
        <div className="flex items-center gap-3 sm:gap-5">
          <img
            className="shrink-0 w-9 sm:w-11 h-9 sm:h-11"
            src="/flexible.svg"
            alt=""
          />
          <div className="flex flex-col gap-1 items-start">
            <p className="text-[#2D2D2D] font-clash-grotesk text-base sm:text-lg font-medium whitespace-nowrap leading-5 [text-shadow:5px_5px_65px_rgba(0,0,0,0.25)]">
              Flexible Payment
            </p>
            <p className="text-[rgba(45,45,45,0.7)] font-dm-sans-500 text-[10px] sm:text-xs font-medium leading-4 [text-shadow:5px_5px_65px_rgba(0,0,0,0.25)]">
              Multiple secure payment
            </p>
          </div>
        </div>

        {/* Trusted */}
        <div className="flex items-center gap-3 sm:gap-5">
          <img
            className="shrink-0 w-9 sm:w-11 h-9 sm:h-11"
            src="/trusted.svg"
            alt=""
          />
          <div className="flex flex-col gap-1 items-start">
            <p className="text-[#2D2D2D] font-clash-grotesk text-base sm:text-lg font-medium whitespace-nowrap leading-5 [text-shadow:5px_5px_65px_rgba(0,0,0,0.25)]">
              Trusted
            </p>
            <p className="text-[rgba(45,45,45,0.7)] font-dm-sans-500 text-[10px] sm:text-xs font-medium leading-4 [text-shadow:5px_5px_65px_rgba(0,0,0,0.25)]">
              100% Authentic Products
            </p>
          </div>
        </div>
      </div>

      {/* ── Section heading + category filter pills ───────────────────────── */}
      <div
        id="shopcategory"
        className="w-full flex flex-col items-center text-center mb-10 sm:mb-15 px-4 sm:px-0"
      >
        <p className="text-[#2D2D2D] mb-1 sm:mb-2.5 font-clash-grotesk text-2xl sm:text-4xl font-medium leading-7 sm:leading-12">
          Shop by Category
        </p>
        <p className="text-[#6B6B6B] mb-10 font-dm-sans max-w-62.5 sm:max-w-125 text-xs sm:text-base font-normal leading-4 sm:leading-5">
          Browse our extensive collection of premium products
        </p>

        {/* Filter pills — active pill turns red */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6.25">
          {CATEGORIES.map((cat) => {
            // A pill is "active" when its category matches the current filter
            // "All" is active when activeCategory is empty string
            const isActive =
              cat === "All" ? activeCategory === "" : activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`inline-flex px-4 sm:px-6 cursor-pointer py-2 justify-center items-center rounded-[10px] transition-all duration-200 active:scale-95 ${
                  isActive
                    ? "bg-[#E3494E] shadow-sm" // active → red
                    : "bg-[#FAFAFA] hover:bg-[#F0F0F0]" // inactive → neutral
                }`}
              >
                <p
                  className={`font-dm-sans-500 text-xs font-medium leading-6 text-center transition-colors duration-200 ${
                    isActive ? "text-white" : "text-black"
                  }`}
                >
                  {cat}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Product grid ──────────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mx-auto mb-9 sm:mb-17.5">
          {filtered.map((item) => (
            <JohnProductItem
              key={item._id}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              reviews={item.reviews}
            />
          ))}
        </div>
      ) : (
        /* Empty state — shown when no products match the selected category */
        <div className="flex flex-col items-center gap-3 py-20 mb-9 sm:mb-17.5">
          <p className="text-[#2D2D2D] font-clash-grotesk text-lg font-medium">
            No products found
          </p>
          <p className="text-[#6B6B6B] font-dm-sans text-sm">
            Try selecting a different category
          </p>
        </div>
      )}

      {/* ── Load more button ──────────────────────────────────────────────── */}
      <button className="inline-flex px-6.5 sm:px-7.75 py-4 justify-center items-center rounded-[14px] border border-[rgba(227,73,78,0.25)] bg-[#E3494E] shadow-md active:scale-95 transition-transform duration-150">
        <p className="font-clash-grotesk text-[#FFF] text-xs font-medium leading-6 text-center">
          Load More Products
        </p>
      </button>
    </div>
  );
};

export default JohnCategory;
