import React, { useContext, useState, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";

const SwiftProductItem = ({ id, image, name, price, description, inStock }) => {
  const { currency, addToCart } = useContext(ShopContext);
  const [quantity, setQuantity] = useState(1);
  const [flying, setFlying] = useState(false);
  const [flyStyle, setFlyStyle] = useState({});
  const [added, setAdded] = useState(false);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const handleIncrease = (e) => {
    e.stopPropagation();
    setQuantity(quantity + 1);
  };
  const handleDecrease = (e) => {
    e.stopPropagation();
    setQuantity(quantity > 1 ? quantity - 1 : 1);
  };

  const handleViewDetails = (e) => {
    e?.stopPropagation();
    navigate(`/swift-product/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!inStock) return;

    const isMobile = window.innerWidth < 640;

    if (isMobile) {
      // Mobile: just show ✓ Added feedback, no fling
      addToCart(id, null, null, quantity);
      setQuantity(1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
      return;
    }

    // Desktop: fling animation to cart
    const btnRect = buttonRef.current.getBoundingClientRect();
    const cartEl = document.getElementById("cart-icon");
    const cartRect = cartEl?.getBoundingClientRect();

    if (!cartRect) {
      // No cart icon found, just add silently
      addToCart(id, null, null, quantity);
      setQuantity(1);
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

    addToCart(id, null, null, quantity);
    setQuantity(1);
  };

  return (
    <div
      onClick={handleViewDetails}
      className="flex w-full pb-3 sm:pb-4 flex-col rounded-2xl bg-white shadow-lg overflow-visible relative cursor-pointer active:scale-[0.98] transition-transform duration-150"
    >
      {/* Flying image */}
      {flying && (
        <img
          src={Array.isArray(image) ? image[0] : image}
          alt=""
          className="fly-to-cart z-[9999]"
          style={flyStyle}
        />
      )}

      {/* Out of stock badge */}
      {!inStock && (
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="px-2 py-1 rounded-full bg-[#FB2C36] text-white text-[10px] font-dm-sans-500 font-medium">
            Out of Stock
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative w-full aspect-square overflow-hidden">
        <img
          src={Array.isArray(image) ? image[0] : image}
          alt={name}
          className={`w-full h-full object-cover rounded-t-3xl transition-opacity duration-200 ${
            !inStock ? "opacity-60" : ""
          }`}
        />

        {/* Mobile quick-view pill — sits over the image bottom edge */}
        <div className="sm:hidden absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-white/60 shadow-sm">
            <svg
              className="w-3 h-3 text-[#032817]"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="8" cy="8" r="3" />
              <path d="M1.5 8S4 3 8 3s6.5 5 6.5 5S12 13 8 13 1.5 8 1.5 8z" />
            </svg>
            <span className="text-[10px] font-dm-sans-500 font-medium text-[#032817] whitespace-nowrap leading-none">
              View Details
            </span>
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col p-3 sm:p-5 gap-2 sm:gap-6.25">
        <div className="flex flex-col gap-1.5 sm:gap-5">
          <div>
            <p className="text-[#2D2D2D] font-dm-sans-700 text-sm sm:text-lg font-bold leading-5 sm:leading-6.25 tracking-[-0.5px] line-clamp-1">
              {name}
            </p>
            <p className="text-[#6A7282] font-dm-sans text-[10px] sm:text-xs font-normal leading-3.5 sm:leading-5 line-clamp-2 mt-0.5">
              {description}
            </p>
          </div>
          <p className="text-[#006E3D] font-clash-grotesk text-base sm:text-xl font-medium leading-5 sm:leading-6">
            {currency}
            {price}
          </p>

          {/* Quantity — desktop only */}
          <div
            className="hidden sm:flex items-center gap-4 px-3 py-1.5 justify-center rounded-[9px] border-2 border-[#E5E7EB] bg-white self-start"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src="/subtract.svg"
              alt=""
              className="w-4 h-4 cursor-pointer"
              onClick={handleDecrease}
            />
            <p>{quantity}</p>
            <img
              src="/addition.svg"
              alt=""
              className="w-4 h-4 cursor-pointer"
              onClick={handleIncrease}
            />
          </div>
        </div>

        {/* Buttons */}
        <div
          className="flex gap-2 sm:gap-3.75 items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* View Details — desktop only */}
          <button
            onClick={handleViewDetails}
            className="hidden sm:flex px-5 py-3 justify-center cursor-pointer items-center rounded-[10px] border border-[rgba(3,40,23,0.25)] bg-[rgba(3,40,23,0.03)] shadow-[inset_0_0_36px_0_#EEEFF1]"
          >
            <p className="text-[#2A2A2A] text-center font-dm-sans-500 text-[11px] font-medium leading-6 whitespace-nowrap">
              View Details
            </p>
          </button>

          {/* Add to Cart */}
          <button
            ref={buttonRef}
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`flex flex-1 sm:flex-none px-3 sm:px-5 py-2.5 sm:py-3 justify-center cursor-pointer items-center rounded-[10px] transition-all duration-200 active:scale-95 ${
              !inStock
                ? "bg-gray-200 cursor-not-allowed"
                : added
                  ? "bg-[#00A63E] sm:bg-[#032817]"
                  : "bg-[#032817] shadow-md"
            }`}
          >
            <p className="text-white text-center font-dm-sans-500 text-[11px] sm:text-[11px] font-medium leading-5 whitespace-nowrap">
              {!inStock ? "Unavailable" : added ? "✓ Added" : "Add to Cart"}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwiftProductItem;
