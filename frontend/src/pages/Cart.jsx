import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import CartHero from "../components/CartHero";

const Cart = () => {
  const {
    swiftProducts,
    johnStoresProducts,
    currency,
    cartItems,
    addToCart,
    navigate,
  } = useContext(ShopContext);

  const findProduct = (id) =>
    swiftProducts.find((p) => p._id == id) ||
    johnStoresProducts.find((p) => p._id == id);

  const getPrice = (product) =>
    typeof product.price === "object" ? product.price.current : product.price;

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const variantKey in cartItems[items]) {
        const quantity = cartItems[items][variantKey];
        if (quantity > 0) {
          let size = null;
          let color = null;
          if (variantKey.includes("-")) {
            const [s, c] = variantKey.split("-");
            size = s || null;
            color = c || null;
          } else if (variantKey !== "default") {
            size = variantKey;
          }
          tempData.push({ _id: items, size, color, quantity, variantKey });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  const subtotal = cartData.reduce((acc, item) => {
    const product = findProduct(item._id);
    return acc + (product ? getPrice(product) : 0) * item.quantity;
  }, 0);

  const hasJohn = cartData.some((item) =>
    johnStoresProducts.some((p) => p._id == item._id),
  );
  const hasSwift = cartData.some((item) =>
    swiftProducts.some((p) => p._id == item._id),
  );

  return (
    <div className="bg-[#FAFAFA]">
      <div className="relative w-full">
        <CartHero />
      </div>

      <div className="px-4 md:px-8 py-8 sm:py-15 flex flex-col items-start gap-6">
        <div className="flex flex-col items-start gap-2.5">
          <p className="text-[#2D2D2D] font-clash-grotesk text-2xl sm:text-4xl font-medium leading-7 sm:leading-12">
            Your Cart
          </p>
          <p className="text-[#4A5565] font-dm-sans text-xs sm:text-sm font-normal leading-4 sm:leading-6">
            Review your items before confirming your order on WhatsApp
          </p>
        </div>

        {cartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full py-20 gap-4">
            <img src="/cart.svg" alt="" className="w-16 h-16 opacity-30" />
            <p className="text-[#2D2D2D] font-clash-grotesk text-xl font-medium">
              Your cart is empty
            </p>
            <p className="text-[#6A7282] font-dm-sans text-sm">
              Add some products to get started
            </p>
            <button
              onClick={() => navigate("/swift-logistics")}
              className="mt-4 px-8 py-3 rounded-[14px] bg-[#032817] text-white font-dm-sans-500 text-sm cursor-pointer"
            >
              Browse Collections
            </button>
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row justify-between items-start self-stretch gap-6 xl:gap-10">
            {/* Product cards */}
            <div className="flex flex-col gap-4 flex-1 w-full">
              {cartData.map((item, index) => {
                const product = findProduct(item._id);
                if (!product) return null;
                const price = getPrice(product);

                return (
                  <div
                    key={index}
                    className="flex flex-row flex-nowrap items-start gap-2.5 p-[17px_16px] rounded-[14px] border border-[#F3F4F6] bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] w-full"
                  >
                    <img
                      src={
                        Array.isArray(product.image)
                          ? product.image[0]
                          : product.image
                      }
                      alt=""
                      className="w-25 sm:w-36.5 h-22.5 sm:h-32.5 shrink-0 mb-0 mr-3.75 sm:mr-6.25 rounded-lg object-cover"
                    />

                    <div className="flex-1 mr-3.75 sm:mr-10">
                      <p className="text-[#2D2D2D] mb-1 sm:mb-2 font-dm-sans-500 text-base sm:text-xl font-semibold leading-5.5 sm:leading-6.25 tracking-[-0.5px]">
                        {product.name}
                      </p>
                      {item.variantKey !== "default" && (
                        <p className="text-[#6A7282] font-dm-sans mb-2 text-xs font-normal leading-4">
                          {item.variantKey}
                        </p>
                      )}

                      <div className="flex w-22.5 sm:w-27.75 h-6.25 sm:h-7.25 gap-5 sm:gap-7.5 justify-center items-center rounded-[10px] border border-[#E5E7EB] mt-4">
                        <img
                          src="/addition.svg"
                          alt=""
                          className="w-2 h-2 sm:w-auto sm:h-auto cursor-pointer"
                          onClick={() =>
                            addToCart(item._id, item.size, item.color, 1)
                          }
                        />
                        <p className="text-xs sm:text-base">{item.quantity}</p>
                        <img
                          src="/subtract.svg"
                          alt=""
                          className="w-2 h-2 sm:w-auto sm:h-auto cursor-pointer"
                          onClick={() =>
                            addToCart(item._id, item.size, item.color, -1)
                          }
                        />
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-10 sm:gap-17.75 w-20 sm:w-29.25">
                      <img
                        src="/cancel.svg"
                        alt=""
                        className="w-3 h-3 sm:w-auto sm:h-auto cursor-pointer"
                        onClick={() =>
                          addToCart(
                            item._id,
                            item.size,
                            item.color,
                            -item.quantity,
                          )
                        }
                      />
                      <div className="flex flex-col items-end self-stretch gap-1 sm:gap-2">
                        <p className="text-[#2A2A2A] text-right font-clash-grotesk text-[10px] sm:text-[14px] font-medium leading-3 sm:leading-3.5 tracking-[-0.5px]">
                          {currency}
                          {price.toLocaleString()} each
                        </p>
                        <p className="text-[#006E3D] text-right font-clash-grotesk text-base sm:text-lg sm:text-[25px] font-medium leading-5 sm:leading-6.25">
                          {currency}
                          {(price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right-side order summary */}
            <div className="flex w-full xl:w-115 flex-col items-start gap-6.25">
              <div className="flex flex-col items-start gap-2.5 p-6 self-stretch rounded-[14px] border-2 border-[#F3F4F6] bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
                <p className="text-[#2D2D2D] font-clash-grotesk text-lg sm:text-xl font-medium leading-6.25">
                  Order Summary
                </p>

                <div className="flex justify-between items-center w-full">
                  <p className="text-[#4A5565] font-dm-sans text-sm sm:text-base font-normal leading-5 tracking-[-0.5px] opacity-50">
                    Subtotal
                  </p>
                  <p className="text-[#006E3D] text-right font-clash-grotesk text-base sm:text-lg font-medium leading-6.25">
                    {currency}
                    {subtotal.toLocaleString()}
                  </p>
                </div>

                <div className="flex justify-between items-center w-full">
                  <p className="text-[#4A5565] font-dm-sans text-sm sm:text-base font-normal leading-5 tracking-[-0.5px] opacity-50">
                    Delivery Fee
                  </p>
                  <p className="text-[#6A7282] text-right font-clash-grotesk text-sm sm:text-base font-normal leading-6.25">
                    To be confirmed
                  </p>
                </div>

                <div className="flex justify-between items-center w-full">
                  <p className="text-[#4A5565] font-dm-sans text-sm sm:text-base font-medium leading-5 tracking-[-0.5px]">
                    Estimated Total
                  </p>
                  <p className="text-[#006E3D] text-right font-clash-grotesk text-base sm:text-lg font-medium leading-6.25">
                    {currency}
                    {subtotal.toLocaleString()}
                  </p>
                </div>

                <div className="w-full px-6 py-3.75 flex flex-col justify-center items-center rounded-[10px] border border-[#DCFCE7] bg-[#F0FDF4]">
                  <p className="text-[#016630] font-dm-sans text-[8px] sm:text-[10px] font-normal leading-2 sm:leading-3 text-center w-full">
                    Final confirmation and delivery fee will be provided on
                    WhatsApp.
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center self-stretch py-5 px-6 rounded-[14px] border border-[#DBEAFE] bg-[#EFF6FF]">
                <div className="flex justify-center items-center gap-2.5">
                  <img src="/info.svg" alt="" />
                  <p className="text-[#1C398E] font-dm-sans text-[10px] sm:text-[13px] font-normal leading-5.5 text-center">
                    When you continue, your order details will be automatically
                    sent to WhatsApp for confirmation and payment instructions.
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center gap-3.25 self-stretch">
                {/* John Stores checkout button */}
                {hasJohn && (
                  <button
                    onClick={() => navigate("/checkout/john-stores")}
                    className="flex flex-col justify-center items-center self-stretch py-7.5 px-4 sm:px-38 rounded-[14px] bg-[#00A63E] cursor-pointer"
                  >
                    <p className="text-white font-clash-grotesk text-sm sm:text-base font-medium leading-4.5">
                      Checkout John Stores Items
                    </p>
                  </button>
                )}

                {/* Swift checkout button */}
                {hasSwift && (
                  <button
                    onClick={() => navigate("/checkout/swift")}
                    className="flex flex-col justify-center items-center self-stretch py-7.5 px-4 sm:px-38 rounded-[14px] bg-[#032817] cursor-pointer"
                  >
                    <p className="text-white font-clash-grotesk text-sm sm:text-base font-medium leading-4.5">
                      Checkout Swift Items
                    </p>
                  </button>
                )}

                <button
                  onClick={() => navigate("/swift-logistics")}
                  className="flex flex-col justify-center items-center self-stretch py-7.5 px-4 sm:px-38 rounded-[14px] border-2 border-[rgba(88,87,87,0.15)] bg-white cursor-pointer"
                >
                  <p className="text-[#585757] font-clash-grotesk text-sm sm:text-base font-medium leading-4.5">
                    Continue Shopping
                  </p>
                </button>

                <p className="text-[#6A7282] text-center font-dm-sans text-[12px] font-normal leading-3.5">
                  No payment required at this stage.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
