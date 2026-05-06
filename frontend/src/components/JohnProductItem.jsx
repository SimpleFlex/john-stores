import React, { useContext, useState, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const JohnProductItem = ({ id, name, price, image, reviews }) => {
  const { currency, addToCart, navigate } = useContext(ShopContext);

  const [added, setAdded] = useState(false);
  const [flying, setFlying] = useState(false);
  const [flyStyle, setFlyStyle] = useState({});

  const buttonRef = useRef(null);

  const handleAddToCart = (e) => {
    e.stopPropagation();

    const isMobile = window.innerWidth < 640;

    if (isMobile) {
      addToCart(id, null, null, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
      return;
    }

    const btnRect = buttonRef.current.getBoundingClientRect();
    const cartEl = document.getElementById("cart-icon");
    const cartRect = cartEl?.getBoundingClientRect();

    if (!cartRect) {
      addToCart(id, null, null, 1);
      return;
    }

    const startX = btnRect.left + btnRect.width / 2;
    const startY = btnRect.top + btnRect.height / 2;
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;

    setFlyStyle({
      left: startX,
      top: startY,
      "--fly-x": `${endX - startX}px`,
      "--fly-y": `${endY - startY}px`,
    });

    setFlying(true);

    setTimeout(() => {
      setFlying(false);
      cartEl.classList.add("cart-shake");
      setTimeout(() => cartEl.classList.remove("cart-shake"), 500);
    }, 700);

    addToCart(id, null, null, 1);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart(id, null, null, 1);
    navigate("/checkout/john-stores");
  };

  const getImageSrc = () => {
    if (Array.isArray(image)) {
      return image[0]?.url || image[0];
    }
    return image;
  };

  const displayPrice = typeof price === "object" ? price.current : price;
  const oldPrice = typeof price === "object" ? price.old : null;

  // Artificial star rating if none provided
  const rating = reviews?.rating || (Math.random() * 1 + 4).toFixed(1);
  const reviewCount = reviews?.count || Math.floor(Math.random() * 20) + 1;

  return (
    <div className="flex w-full pb-4 flex-col rounded-2xl bg-white shadow-lg overflow-hidden relative">
      {flying && (
        <img
          src={getImageSrc()}
          alt=""
          className="fly-to-cart"
          style={flyStyle}
        />
      )}

      <div className="w-full aspect-square overflow-hidden rounded-t-2xl">
        <img
          src={getImageSrc()}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="px-4 py-4">
        <p className="text-[#2D2D2D] font-dm-sans-700 text-xl mb-2.5 font-extrabold leading-6.25">
          {name}
        </p>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-end gap-1.25">
            <p className="text-[#E3494E] font-clash-grotesk text-base sm:text-lg font-medium leading-6">
              {currency}
              {displayPrice?.toLocaleString()}
            </p>
            {oldPrice && (
              <p className="text-[#2A2A2A] font-clash-grotesk text-[8px] font-medium leading-4.75 line-through opacity-50">
                {currency}
                {oldPrice.toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            <img src={assets.star_icon} alt="" />
            <p className="text-[#2A2A2A] font-clash-grotesk text-[8px] font-medium opacity-50">
              {rating} ({reviewCount} Review{reviewCount !== 1 ? "s" : ""})
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap px-2">
        <button
          ref={buttonRef}
          onClick={handleAddToCart}
          className={`inline-flex cursor-pointer px-4 sm:px-6 py-2 justify-center items-center rounded-[10px] border transition-all duration-150 active:scale-95 active:shadow-none ${
            added
              ? "border-[#00A63E] bg-[rgba(0,166,62,0.08)]"
              : "border-[rgba(227,73,78,0.25)] bg-[rgba(227,73,78,0.03)] shadow-[inset_0_0_36px_0_#EEEFF1] hover:bg-[rgba(227,73,78,0.08)] active:bg-[rgba(227,73,78,0.15)]"
          }`}
        >
          <p
            className={`font-dm-sans-500 text-xs font-medium leading-6 text-center whitespace-nowrap ${added ? "text-[#00A63E]" : "text-black"}`}
          >
            {added ? "✓ Added" : "Add To Cart"}
          </p>
        </button>

        <button
          onClick={handleBuyNow}
          className="inline-flex cursor-pointer px-7 sm:px-9 py-2 justify-center items-center rounded-[10px] border border-[rgba(227,73,78,0.25)] bg-[#E3494E] shadow-md transition-all duration-150 hover:bg-[#d03f44] active:scale-95 active:shadow-none active:bg-[#bc3840]"
        >
          <p className="font-dm-sans-500 text-white text-xs font-medium leading-6 text-center">
            Buy Now
          </p>
        </button>
      </div>
    </div>
  );
};

export default JohnProductItem;
