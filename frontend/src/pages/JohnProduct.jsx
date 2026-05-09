import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { fetchProductById } from "../services/product.service.js";

const JohnProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { swiftProducts, johnStoresProducts, currency, addToCart } = useShop();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleBackToShop = () => {
    navigate(-1);
    setTimeout(() => {
      const el = document.getElementById("shopcategory");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const allProducts = [...johnStoresProducts, ...swiftProducts];
      let found = allProducts.find((item) => item._id === productId);

      if (!found) {
        try {
          found = await fetchProductById(productId);
        } catch (err) {
          console.error("Failed to fetch product:", err);
        }
      }

      if (found) {
        setProductData(found);
      }
      setLoading(false);
    };
    loadProduct();
  }, [productId, johnStoresProducts, swiftProducts]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  const validateAndAdd = (action) => {
    let valid = true;

    if (productData.sizeOptions?.length > 0 && !size) {
      setSizeError(true);
      valid = false;
    }
    if (productData.color?.length > 0 && !color) {
      setColorError(true);
      valid = false;
    }

    if (!valid) return;

    addToCart(productData._id, size, color, quantity);

    if (action === "cart") {
      setAddedToCart(true);
      setQuantity(1);
      setTimeout(() => setAddedToCart(false), 2000);
    } else if (action === "buy") {
      navigate("/cart-form");
    }
  };

  const getProductImage = () => {
    if (color && productData.colorImages?.[color])
      return productData.colorImages[color];
    const imgArray = productData.images || productData.image;
    if (Array.isArray(imgArray) && imgArray.length > 0) {
      return imgArray[0]?.url || imgArray[0];
    }
    if (imgArray && !Array.isArray(imgArray)) return imgArray;
    if (productData.colorImages) {
      const vals =
        productData.colorImages instanceof Map
          ? Array.from(productData.colorImages.values())
          : Object.values(productData.colorImages);
      if (vals.length > 0) return vals[0];
    }
    return null;
  };

  const getProductName = () => productData.productName || productData.name;

  const getDisplayPrice = () => {
    if (!productData) return 0;
    return typeof productData.price === "object"
      ? productData.price.current
      : productData.price;
  };

  const isOutOfStock =
    productData?.status === "Out of Stock" ||
    productData?.inStock === false ||
    productData?.stockQuantity === 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#E3494E] border-t-transparent animate-spin" />
          <p className="text-[#6A7282] font-dm-sans text-sm">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-[#2D2D2D] font-clash-grotesk text-xl font-medium">
          Product not found
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 rounded-[10px] bg-[#E3494E] text-white font-dm-sans-500 cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 sm:px-10 lg:px-[60px] pt-8 sm:pt-16 lg:pt-[100px] pb-16 items-start gap-8 sm:gap-[60px]">
      {/* Back Button */}
      <div
        onClick={handleBackToShop}
        className="flex items-center gap-2.5 sm:gap-3.75 cursor-pointer group"
      >
        <img src="/back.svg" alt="" className="w-5 h-5 sm:w-auto sm:h-auto" />
        <p className="text-[#4A5565] font-clash-grotesk text-base sm:text-xl font-medium leading-6 group-hover:text-[#E3494E] transition-colors">
          Back to Shop
        </p>
      </div>

      {/* Product Section */}
      <div className="flex flex-col lg:flex-row items-start gap-8 sm:gap-12 lg:gap-[50px] self-stretch">
        {/* Product Image */}
        <div className="w-full lg:w-[655px] relative">
          <img
            src={getProductImage()}
            alt={getProductName()}
            className="w-full lg:w-[655px] h-[280px] sm:h-[450px] lg:h-[652px] object-cover rounded-[16px] sm:rounded-[25px]"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 rounded-[16px] sm:rounded-[25px] bg-black/40 flex items-center justify-center">
              <span className="px-5 py-2.5 rounded-full bg-[#FB2C36] text-white font-clash-grotesk text-lg font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col items-start gap-5 sm:gap-[45px] w-full lg:flex-1">
          <div className="flex flex-col items-start gap-4 sm:gap-7.5 self-stretch">
            {/* Stock Badge */}
            <div
              className={`rounded-full px-2.5 py-1 sm:px-3 sm:py-2 border-2 ${isOutOfStock ? "bg-[#FB2C36] border-[#FB2C36]" : "bg-[#E3494E] border-[#E3494E]"}`}
            >
              <p className="text-white font-dm-sans-700 text-xs sm:text-sm font-semibold leading-4 tracking-[-0.5px]">
                {isOutOfStock ? "Out of Stock" : "In Stock"}
              </p>
            </div>

            <div className="flex flex-col items-start self-stretch gap-2 sm:gap-3.75">
              <p className="text-[#2D2D2D] font-dm-sans-700 font-extrabold text-2xl sm:text-4xl leading-8 sm:leading-11.25 tracking-[-0.5px]">
                {getProductName()}
              </p>
              {productData.description && (
                <p className="text-[#6A7282] font-dm-sans font-normal text-sm sm:text-lg leading-6 sm:leading-8">
                  {productData.description}.
                </p>
              )}
            </div>

            <p className="text-[#E3494E] font-clash-grotesk font-medium text-xl sm:text-2xl leading-8.75">
              {currency} {getDisplayPrice()?.toLocaleString()}
            </p>

            {/* Size Selector */}
            {productData.sizeOptions?.length > 0 && (
              <div className="flex flex-col items-start gap-2.5 sm:gap-3.75 w-full">
                <div className="flex items-center gap-2">
                  <p className="text-[#364153] font-dm-sans font-medium text-sm sm:text-base leading-5">
                    Size
                  </p>
                  {sizeError && (
                    <span className="text-[#FB2C36] text-xs font-dm-sans">
                      — Please select a size
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {productData.sizeOptions.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSize(item);
                        setSizeError(false);
                      }}
                      disabled={isOutOfStock}
                      className={`flex px-3 sm:px-4.25 py-1.5 sm:py-2 justify-center items-center rounded-[10px] text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${item === size ? "border-2 border-[#E3494E] bg-[rgba(227,73,78,0.10)] text-[#E3494E] font-medium" : sizeError ? "border-2 border-[#FB2C36] text-[#6A7282]" : "border-2 border-[#E5E7EB] text-[#6A7282]"}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector — image thumbnails */}
            {productData.color?.length > 0 && (
              <div className="flex flex-col items-start gap-2.5 sm:gap-3.75 w-full">
                <div className="flex items-center gap-2">
                  <p className="text-[#364153] font-dm-sans font-medium text-sm sm:text-base leading-5">
                    Color
                  </p>
                  {color && (
                    <span className="text-[#6A7282] text-xs font-dm-sans capitalize">
                      — {color}
                    </span>
                  )}
                  {colorError && (
                    <span className="text-[#FB2C36] text-xs font-dm-sans">
                      — Please select a color
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {productData.color.map((item, index) => {
                    const colorImg = productData.colorImages?.[item];
                    const firstImg = (() => {
                      const arr = productData.images || productData.image;
                      if (Array.isArray(arr) && arr.length > 0)
                        return arr[0]?.url || arr[0];
                      if (arr && !Array.isArray(arr)) return arr;
                      if (productData.colorImages) {
                        const vals =
                          productData.colorImages instanceof Map
                            ? Array.from(productData.colorImages.values())
                            : Object.values(productData.colorImages);
                        if (vals.length > 0) return vals[0];
                      }
                      return null;
                    })();
                    const thumbSrc = colorImg || firstImg || null;
                    const isSelected = item === color;
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setColor(item);
                          setColorError(false);
                        }}
                        disabled={isOutOfStock}
                        title={item}
                        className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-[10px] overflow-hidden border-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ${
                          isSelected
                            ? "border-[#E3494E] scale-105 shadow-md"
                            : colorError
                              ? "border-[#FB2C36]"
                              : "border-[#E5E7EB] hover:border-[#aaa]"
                        }`}
                      >
                        {thumbSrc ? (
                          <img
                            src={thumbSrc}
                            alt={item}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#F3F4F6] flex items-center justify-center">
                            <span className="text-[#9CA3AF] text-[8px] font-dm-sans text-center px-1 leading-tight">
                              {item}
                            </span>
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-6 sm:gap-7.5 px-6 py-3 justify-center rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
              <p className="text-[#6A7282] font-dm-sans font-medium text-sm sm:text-base leading-5">
                Quantity
              </p>
              <div className="flex items-center gap-6 sm:gap-7.5 px-5 py-2.5 justify-center rounded-[10px] border-2 border-[#E5E7EB]">
                <img
                  onClick={handleDecrease}
                  src="/subtract.svg"
                  alt=""
                  className="w-4 h-4 cursor-pointer active:scale-90 transition-transform"
                />
                <p className="text-base font-medium w-5 text-center">
                  {quantity}
                </p>
                <img
                  src="/addition.svg"
                  alt=""
                  className="w-4 h-4 cursor-pointer active:scale-90 transition-transform"
                  onClick={handleIncrease}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="fixed sm:relative bottom-0 left-0 right-0 sm:bottom-auto flex gap-3 sm:gap-3.75 items-center px-4 sm:px-0 py-4 sm:py-0 bg-white sm:bg-transparent border-t border-[#F3F4F6] sm:border-0 z-40 sm:z-auto shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:shadow-none">
            <button
              onClick={() => validateAndAdd("cart")}
              disabled={isOutOfStock}
              className={`flex flex-1 sm:flex-none px-5 py-3.5 sm:px-15 sm:py-4 justify-center items-center rounded-[10px] border transition-all duration-200 active:scale-95 ${isOutOfStock ? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-60" : addedToCart ? "border-[#E3494E] bg-[rgba(227,73,78,0.10)]" : "border-[rgba(227,73,78,0.25)] bg-[rgba(227,73,78,0.03)] shadow-[inset_0_0_36px_0_#EEEFF1]"}`}
            >
              <p
                className={`text-center whitespace-nowrap font-dm-sans-500 text-sm sm:text-base font-medium leading-6 ${isOutOfStock ? "text-gray-400" : addedToCart ? "text-[#E3494E]" : "text-[#2A2A2A]"}`}
              >
                {isOutOfStock
                  ? "Out of Stock"
                  : addedToCart
                    ? "✓ Added to Cart"
                    : "Add to Cart"}
              </p>
            </button>
            <button
              disabled={isOutOfStock}
              onClick={() => validateAndAdd("buy")}
              className={`flex flex-1 sm:flex-none px-5 py-3.5 sm:px-15 sm:py-4 justify-center items-center rounded-[10px] transition-all duration-200 active:scale-95 ${isOutOfStock ? "bg-gray-300 cursor-not-allowed text-gray-400 opacity-60" : "bg-[#E3494E] shadow-md text-white"}`}
            >
              <p className="text-center font-dm-sans-500 text-sm sm:text-base whitespace-nowrap font-medium leading-6">
                Buy Now
              </p>
            </button>
          </div>
          <div className="h-20 sm:hidden" />
        </div>
      </div>
    </div>
  );
};

export default JohnProduct;
