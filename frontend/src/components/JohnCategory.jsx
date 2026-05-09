import React, { useContext, useState, useMemo, useEffect } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { fetchCategories } from "../services/category.service.js";
import JohnProductItem from "./JohnProductItem";

const JohnCategory = () => {
  const { johnStoresProducts } = useContext(ShopContext);

  const [activeCategory, setActiveCategory] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await fetchCategories();
        const johnCats = cats.filter((cat) => cat.brand === "John's Stores");
        setCategories(["All", ...johnCats.map((c) => c.name)]);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    loadCategories();
  }, []);

  const filtered = useMemo(() => {
    if (!activeCategory) return johnStoresProducts;
    return johnStoresProducts.filter((p) => {
      const catName =
        typeof p.category === "object" ? p.category?.name : p.category;
      return catName?.toLowerCase() === activeCategory.toLowerCase();
    });
  }, [johnStoresProducts, activeCategory]);

  const displayProducts = showAll ? filtered : filtered.slice(0, 16);
  const hasMore = filtered.length > 16;

  const handleCategory = (cat) => {
    setActiveCategory(cat === "All" ? "" : cat);
    setShowAll(false);
  };

  const getProductImage = (item) => {
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      return item.images[0]?.url || item.images[0];
    }
    if (item.images && !Array.isArray(item.images)) return item.images;
    if (item.image) return item.image;
    if (item.colorImages) {
      const vals =
        item.colorImages instanceof Map
          ? Array.from(item.colorImages.values())
          : Object.values(item.colorImages);
      if (vals.length > 0) return vals[0];
    }
    return null;
  };

  return (
    <div className="flex w-full min-h-screen flex-col justify-center items-center px-4 sm:px-6 md:px-8 py-10 sm:py-20 bg-[#FFF]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-20 mb-16 w-full justify-items-center">
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

        <div className="flex flex-wrap justify-center gap-3 sm:gap-6.25">
          {categories.map((cat) => {
            const isActive =
              cat === "All" ? activeCategory === "" : activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`inline-flex px-4 sm:px-6 cursor-pointer py-2 justify-center items-center rounded-[10px] transition-all duration-200 active:scale-95 ${isActive ? "bg-[#E3494E] shadow-sm" : "bg-[#FAFAFA] hover:bg-[#F0F0F0]"}`}
              >
                <p
                  className={`font-dm-sans-500 text-xs font-medium leading-6 text-center transition-colors duration-200 ${isActive ? "text-white" : "text-black"}`}
                >
                  {cat}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {displayProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-auto mb-9 sm:mb-17.5">
          {displayProducts.map((item) => (
            <JohnProductItem
              key={item._id}
              id={item._id}
              image={getProductImage(item)}
              name={item.productName || item.name}
              price={item.price}
              description={item.description}
              reviews={item.reviews}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-20 mb-9 sm:mb-17.5">
          <p className="text-[#2D2D2D] font-clash-grotesk text-lg font-medium">
            No products found
          </p>
          <p className="text-[#6B6B6B] font-dm-sans text-sm">
            Try selecting a different category
          </p>
        </div>
      )}

      {hasMore && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="inline-flex px-6.5 sm:px-7.75 py-4 justify-center items-center rounded-[14px] border border-[rgba(227,73,78,0.25)] bg-[#E3494E] shadow-md active:scale-95 transition-transform duration-150 cursor-pointer"
        >
          <p className="font-clash-grotesk text-[#FFF] text-xs font-medium leading-6 text-center">
            Load More Products
          </p>
        </button>
      )}
    </div>
  );
};

export default JohnCategory;
