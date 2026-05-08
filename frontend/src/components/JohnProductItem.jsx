import React, { useContext, useState, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const JohnProductItem = ({ id, name, price, image, reviews, description }) => {
  const { currency, addToCart } = useContext(ShopContext);
  const navigate = useNavigate();

  const [added, setAdded] = useState(false);
  const [flying, setFlying] = useState(false);
  const [flyStyle, setFlyStyle] = useState({});

  const buttonRef = useRef(null);

  const handleViewDetails = (e) => {
    e?.stopPropagation();
    navigate(`/john-stores/product/${id}`);
  };

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

  const getImageSrc = () => {
    if (Array.isArray(image)) {
      return image[0]?.url || image[0];
    }
    return image;
  };

  const displayPrice = typeof price === "object" ? price.current : price;
  const oldPrice = typeof price === "object" ? price.old : null;

  const rating = reviews?.rating || (Math.random() * 1 + 4).toFixed(1);
  const reviewCount = reviews?.count || Math.floor(Math.random() * 20) + 1;

  return (
    <div
      onClick={handleViewDetails}
      className="flex w-full flex-col rounded-2xl bg-white shadow-lg overflow-hidden relative cursor-pointer active:scale-[0.98] transition-transform duration-150"
    >
      {flying && (
        <img
          src={getImageSrc()}
          alt=""
          className="fly-to-cart"
          style={flyStyle}
        />
      )}

      <div className="w-full aspect-[4/3] overflow-hidden rounded-t-2xl">
        <img
          src={getImageSrc()}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col p-3 sm:p-4 gap-1.5 sm:gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-[#2D2D2D] font-dm-sans-700 text-sm sm:text-base font-bold leading-5 sm:leading-6 tracking-[-0.5px] line-clamp-1">
            {name}
          </p>
          {description && (
            <p className="text-[#6A7282] font-dm-sans text-[10px] sm:text-xs font-normal leading-3.5 sm:leading-4 line-clamp-2">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-end gap-1.5">
            <p className="text-[#E3494E] font-clash-grotesk text-sm sm:text-lg font-medium leading-5 sm:leading-6">
              {currency}
              {displayPrice?.toLocaleString()}
            </p>
            {oldPrice && (
              <p className="text-[#2A2A2A] font-clash-grotesk text-[10px] font-medium leading-4 line-through opacity-50">
                {currency}
                {oldPrice.toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            <img src={assets.star_icon} alt="" className="w-3.5 h-3.5" />
            <p className="text-[#2A2A2A] font-clash-grotesk text-[10px] font-medium opacity-50">
              {rating} ({reviewCount} Review{reviewCount !== 1 ? "s" : ""})
            </p>
          </div>
        </div>

        <div
          className="flex gap-2 items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* View Details */}
          <button
            onClick={handleViewDetails}
            className="flex px-4 py-2 justify-center cursor-pointer items-center rounded-[10px] border border-[rgba(227,73,78,0.25)] bg-[rgba(227,73,78,0.03)] shadow-[inset_0_0_36px_0_#EEEFF1]"
          >
            <p className="text-black font-dm-sans-500 text-[11px] sm:text-xs font-medium leading-5 whitespace-nowrap">
              View Details
            </p>
          </button>

          {/* Add to Cart */}
          <button
            ref={buttonRef}
            onClick={handleAddToCart}
            className={`flex-1 px-4 py-2 justify-center cursor-pointer items-center rounded-[10px] transition-all duration-200 active:scale-95 ${
              added ? "bg-[#00A63E]" : "bg-[#E3494E] shadow-md"
            }`}
          >
            <p className="text-white text-center font-dm-sans-500 text-[11px] sm:text-xs font-medium leading-5 whitespace-nowrap">
              {added ? "✓ Added" : "Add to Cart"}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JohnProductItem;
