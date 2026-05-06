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

  const isOutOfStock = !inStock;

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
    navigate(`/swift-logistics/product/${id}`);
  };

  const getImageSrc = () => {
    if (Array.isArray(image)) return image[0]?.url || image[0];
    return image;
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
      return;
    }

    const isMobile = window.innerWidth < 640;

    if (isMobile) {
      addToCart(id, null, null, quantity);
      setQuantity(1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
      return;
    }

    const btnRect = buttonRef.current.getBoundingClientRect();
    const cartEl = document.getElementById("cart-icon");
    const cartRect = cartEl?.getBoundingClientRect();

    if (!cartRect) {
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
      className="flex w-full flex-col rounded-2xl bg-white shadow-lg overflow-visible relative cursor-pointer active:scale-[0.98] transition-transform duration-150"
    >
      {flying && (
        <img
          src={getImageSrc()}
          alt=""
          className="fly-to-cart z-[9999]"
          style={flyStyle}
        />
      )}

      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-2xl">
        <img
          src={getImageSrc()}
          alt={name}
          className="w-full h-full object-cover transition-opacity duration-200"
        />
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

      <div className="flex flex-col p-3 sm:p-4 gap-1.5 sm:gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-[#2D2D2D] font-dm-sans-700 text-sm sm:text-base font-bold leading-5 sm:leading-6 tracking-[-0.5px] line-clamp-1">
            {name}
          </p>
          <p className="text-[#6A7282] font-dm-sans text-[10px] sm:text-xs font-normal leading-3.5 sm:leading-4 line-clamp-2">
            {description}
          </p>
        </div>
        <p className="text-[#006E3D] font-clash-grotesk text-sm sm:text-lg font-medium leading-5 sm:leading-6">
          {currency}
          {typeof price === "object"
            ? price.current?.toLocaleString()
            : price?.toLocaleString()}
        </p>

        {/* Quantity — desktop only */}
        <div
          className="hidden sm:flex items-center gap-3 px-2 py-1 justify-center rounded-[8px] border-2 border-[#E5E7EB] bg-white self-start"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src="/subtract.svg"
            alt=""
            className="w-3.5 h-3.5 cursor-pointer"
            onClick={handleDecrease}
          />
          <p className="text-sm">{quantity}</p>
          <img
            src="/addition.svg"
            alt=""
            className="w-3.5 h-3.5 cursor-pointer"
            onClick={handleIncrease}
          />
        </div>

        <div
          className="flex gap-2 items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* View Details — desktop */}
          <button
            onClick={handleViewDetails}
            className="hidden sm:flex px-4 py-2 justify-center cursor-pointer items-center rounded-[10px] border border-[rgba(3,40,23,0.25)] bg-[rgba(3,40,23,0.03)] shadow-[inset_0_0_36px_0_#EEEFF1]"
          >
            <p className="text-[#2A2A2A] text-center font-dm-sans-500 text-[11px] font-medium leading-6 whitespace-nowrap">
              View Details
            </p>
          </button>

          {/* Add to Cart */}
          <button
            ref={buttonRef}
            onClick={handleAddToCart}
            className={`flex flex-1 px-4 py-2 justify-center cursor-pointer items-center rounded-[10px] transition-all duration-200 active:scale-95 ${isOutOfStock && added ? "bg-[#FB2C36]" : isOutOfStock ? "bg-[#032817] shadow-md" : added ? "bg-[#00A63E]" : "bg-[#032817] shadow-md"}`}
          >
            <p className="text-white text-center font-dm-sans-500 text-[11px] sm:text-xs font-medium leading-5 whitespace-nowrap">
              {isOutOfStock && added
                ? "Out of Stock"
                : isOutOfStock
                  ? "Add to Cart"
                  : added
                    ? "✓ Added"
                    : "Add to Cart"}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwiftProductItem;
