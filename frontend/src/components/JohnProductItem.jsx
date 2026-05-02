import React, { useContext, useState, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const JohnProductItem = ({ id, name, price, image, reviews }) => {
  const { currency, addToCart, navigate } = useContext(ShopContext);

  const [added, setAdded] = useState(false);
  const [flying, setFlying] = useState(false);
  const [flyStyle, setFlyStyle] = useState({});

  // Ref on the Add to Cart button — used to get its position for the fling start point
  const buttonRef = useRef(null);

  // ── Add to Cart ────────────────────────────────────────────────────────────
  const handleAddToCart = (e) => {
    e.stopPropagation();

    const isMobile = window.innerWidth < 640;

    if (isMobile) {
      // Mobile: skip animation, just show ✓ Added feedback
      addToCart(id, null, null, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
      return;
    }

    // Desktop: fling product image toward the cart icon
    const btnRect = buttonRef.current.getBoundingClientRect();
    const cartEl = document.getElementById("cart-icon");
    const cartRect = cartEl?.getBoundingClientRect();

    // Can't fling without knowing where the cart is
    if (!cartRect) {
      addToCart(id, null, null, 1);
      return;
    }

    // Calculate start (button center) and end (cart icon center) positions
    const startX = btnRect.left + btnRect.width / 2;
    const startY = btnRect.top + btnRect.height / 2;
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;

    // Pass positions as CSS vars so the keyframe animation can use them
    setFlyStyle({
      left: startX,
      top: startY,
      "--fly-x": `${endX - startX}px`,
      "--fly-y": `${endY - startY}px`,
    });

    setFlying(true);

    // After animation completes: hide the flying image and shake the cart
    setTimeout(() => {
      setFlying(false);
      cartEl.classList.add("cart-shake");
      setTimeout(() => cartEl.classList.remove("cart-shake"), 500);
    }, 700);

    addToCart(id, null, null, 1);
  };

  // ── Buy Now ────────────────────────────────────────────────────────────────
  // Adds to cart immediately then opens the checkout form
  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart(id, null, null, 1);
    navigate("/cart-form");
  };

  return (
    <div className="flex w-full pb-4 flex-col rounded-2xl bg-white shadow-lg overflow-hidden relative">
      {/* Flying image — fixed position, animates from button center to cart icon */}
      {flying && (
        <img
          src={Array.isArray(image) ? image[0] : image}
          alt=""
          className="fly-to-cart"
          style={flyStyle}
        />
      )}

      <img src={Array.isArray(image) ? image[0] : image} alt={name} />

      <div className="px-4 py-4">
        <p className="text-[#2D2D2D] font-dm-sans-700 text-xl mb-2.5 font-extrabold leading-6.25">
          {name}
        </p>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-end gap-1.25">
            <p className="text-[#E3494E] font-clash-grotesk text-base sm:text-lg font-medium leading-6">
              {currency}
              {price.current.toLocaleString()}
            </p>
            <p className="text-[#2A2A2A] font-clash-grotesk text-[8px] font-medium leading-4.75 line-through opacity-50">
              {currency}
              {price.old.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <img src={assets.star_icon} alt="" />
            <p className="text-[#2A2A2A] font-clash-grotesk text-[8px] font-medium opacity-50">
              {reviews.rating} {reviews.count}k Reviews
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap px-2">
        {/* Add to Cart — flings on desktop, ✓ checkmark on mobile */}
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

        {/* Buy Now — adds to cart and navigates straight to checkout */}
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
