import React, { useState, useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import { buildWhatsAppMessage } from "../utils/WhatsAppMessage";

const CartForm1 = () => {
  const { cartItems, swiftProducts, johnStoresProducts, currency, navigate } =
    useContext(ShopContext);

  const [countryOpen, setCountryOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState({});

  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  const countries = [
    "Nigeria",
    "Ghana",
    "Kenya",
    "South Africa",
    "Uganda",
    "Tanzania",
    "Rwanda",
    "Cameroon",
    "Senegal",
    "Ethiopia",
  ];

  const cities = [
    "Lagos",
    "Abuja",
    "Port Harcourt",
    "Ibadan",
    "Benin City",
    "Kano",
    "Kaduna",
    "Jos",
    "Enugu",
    "Aba",
    "Warri",
    "Owerri",
    "Calabar",
    "Onitsha",
    "Sokoto",
    "Ilorin",
    "Abeokuta",
    "Uyo",
    "Makurdi",
    "Akure",
  ];

  // ── Detect which store the cart items belong to ───────────────────────────
  // If ALL items are from John Stores → hide recipient section (self-purchase)
  // If ANY item is from Swift → show recipient section (logistics delivery)
  const { cartList, isJohnStoreOnly } = useMemo(() => {
    const list = [];
    let hasSwift = false;
    let hasJohn = false;

    for (const productId in cartItems) {
      // Check Swift first, then John Stores
      const swiftProduct = swiftProducts.find((p) => p._id === productId);
      const johnProduct = johnStoresProducts.find((p) => p._id === productId);
      const product = swiftProduct || johnProduct;

      if (!product) continue;

      if (swiftProduct) hasSwift = true;
      if (johnProduct) hasJohn = true;

      for (const variantKey in cartItems[productId]) {
        const quantity = cartItems[productId][variantKey];
        if (quantity > 0) {
          list.push({ product, variantKey, quantity });
        }
      }
    }

    // Only hide recipient when it's purely a John Stores order
    return { cartList: list, isJohnStoreOnly: hasJohn && !hasSwift };
  }, [cartItems, swiftProducts, johnStoresProducts]);

  // ── Get price regardless of product type ─────────────────────────────────
  // Swift: price is a number | John Stores: price is { current, old }
  const getPrice = (product) =>
    typeof product.price === "object" ? product.price.current : product.price;

  const subtotal = cartList.reduce(
    (acc, item) => acc + getPrice(item.product) * item.quantity,
    0,
  );

  // ── Validation ────────────────────────────────────────────────────────────
  // John Stores order: no recipient fields required
  // Swift order: recipient name + phone are required
  const validate = () => {
    const newErrors = {};
    if (!senderName.trim()) newErrors.senderName = "Full name is required";
    if (!senderPhone.trim()) newErrors.senderPhone = "Phone number is required";

    // Only validate recipient fields for Swift (logistics) orders
    if (!isJohnStoreOnly) {
      if (!recipientName.trim())
        newErrors.recipientName = "Recipient name is required";
      if (!recipientPhone.trim())
        newErrors.recipientPhone = "Recipient phone is required";
    }

    if (!country) newErrors.country = "Please select a delivery country";
    if (!city) newErrors.city = "Please select a delivery city";
    if (!deliveryAddress.trim())
      newErrors.deliveryAddress = "Delivery address is required";
    if (!deliveryDate.trim())
      newErrors.deliveryDate = "Preferred delivery date is required";
    return newErrors;
  };

  const handleWhatsApp = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorKey = Object.keys(newErrors)[0];
      const el = document.getElementById(firstErrorKey);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const message = buildWhatsAppMessage({
      senderName,
      senderPhone,
      senderEmail,
      // For John Stores orders, recipient defaults to the sender themselves
      recipientName: isJohnStoreOnly ? senderName : recipientName,
      recipientPhone: isJohnStoreOnly ? senderPhone : recipientPhone,
      country,
      city,
      deliveryAddress,
      deliveryDate,
      giftMessage,
      specialInstructions,
      cartList,
      subtotal,
      currency,
    });

    const whatsappNumber = "2349039632833";
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, "_blank");
  };

  const inputClass = (field) =>
    `w-full h-15 px-5.25 rounded-[14px] border ${
      errors[field] ? "border-[#FB2C36]" : "border-[#D1D5DC]"
    } outline-none focus:border-[#00A63E] transition-colors`;

  return (
    <div className="bg-[#FAFAFA]">
      <div className="px-4 sm:px-6 md:px-8 py-10 sm:py-12 flex justify-center">
        <div className="flex flex-col xl:flex-row w-full max-w-300 gap-6 xl:gap-10">
          {/* ── LEFT SIDE ─────────────────────────────────────────────────── */}
          <div className="flex flex-col flex-1 gap-7.5">
            {/* SENDER DETAILS — always shown */}
            <div className="flex p-5 sm:p-7.5 flex-col gap-5 rounded-2xl bg-white shadow">
              <p className="text-[#1A1A1A] font-clash-grotesk text-lg sm:text-[22px] font-medium">
                {/* John Stores: "Your Details" | Swift: "Sender Details" */}
                {isJohnStoreOnly ? "Your Details" : "Sender Details"}
              </p>

              <div className="flex flex-col gap-2" id="senderName">
                <label className="text-[#333] text-sm sm:text-base font-medium">
                  Full Name <span className="text-[#FB2C36]">*</span>
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => {
                    setSenderName(e.target.value);
                    setErrors((prev) => ({ ...prev, senderName: "" }));
                  }}
                  className={inputClass("senderName")}
                  placeholder="your full name"
                />
                {errors.senderName && (
                  <p className="text-[#FB2C36] text-xs mt-1">
                    {errors.senderName}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2" id="senderPhone">
                <label className="text-[#333] text-sm sm:text-base font-medium">
                  Phone Number <span className="text-[#FB2C36]">*</span>
                </label>
                <input
                  type="number"
                  value={senderPhone}
                  onChange={(e) => {
                    setSenderPhone(e.target.value);
                    setErrors((prev) => ({ ...prev, senderPhone: "" }));
                  }}
                  className={inputClass("senderPhone")}
                  placeholder="+234 XXX XXX XXXX"
                />
                {errors.senderPhone && (
                  <p className="text-[#FB2C36] text-xs mt-1">
                    {errors.senderPhone}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[#333] text-sm sm:text-base font-medium">
                  Email (Optional)
                </label>
                <input
                  type="text"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full h-15 px-5.25 rounded-[14px] border border-[#D1D5DC] outline-none focus:border-[#00A63E] transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* RECIPIENT DETAILS — only shown for Swift (logistics) orders */}
            {!isJohnStoreOnly && (
              <div className="flex p-5 sm:p-7.5 flex-col gap-5 rounded-2xl bg-white shadow">
                <p className="text-[#1A1A1A] font-clash-grotesk text-lg sm:text-[22px] font-medium">
                  Recipient Details
                </p>

                <div className="flex flex-col gap-2" id="recipientName">
                  <label className="text-[#333] text-sm sm:text-base font-medium">
                    Recipient Full Name{" "}
                    <span className="text-[#FB2C36]">*</span>
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => {
                      setRecipientName(e.target.value);
                      setErrors((prev) => ({ ...prev, recipientName: "" }));
                    }}
                    className={inputClass("recipientName")}
                    placeholder="recipient full name"
                  />
                  {errors.recipientName && (
                    <p className="text-[#FB2C36] text-xs mt-1">
                      {errors.recipientName}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2" id="recipientPhone">
                  <label className="text-[#333] text-sm sm:text-base font-medium">
                    Recipient Phone Number{" "}
                    <span className="text-[#FB2C36]">*</span>
                  </label>
                  <input
                    type="number"
                    value={recipientPhone}
                    onChange={(e) => {
                      setRecipientPhone(e.target.value);
                      setErrors((prev) => ({ ...prev, recipientPhone: "" }));
                    }}
                    className={inputClass("recipientPhone")}
                    placeholder="+234 XXX XXX XXXX"
                  />
                  {errors.recipientPhone && (
                    <p className="text-[#FB2C36] text-xs mt-1">
                      {errors.recipientPhone}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* DELIVERY DETAILS — always shown, inside its own card for John Stores */}
            <div className="flex p-5 sm:p-7.5 flex-col gap-5 rounded-2xl bg-white shadow">
              <p className="text-[#1A1A1A] font-clash-grotesk text-lg sm:text-[22px] font-medium">
                Delivery Details
              </p>

              {/* COUNTRY */}
              <div className="flex flex-col gap-2 relative w-full" id="country">
                <label className="text-[#333] text-sm sm:text-base font-medium">
                  Delivery Country <span className="text-[#FB2C36]">*</span>
                </label>
                <div
                  onClick={() => setCountryOpen(!countryOpen)}
                  className={`flex w-full h-15 px-5.25 items-center justify-between rounded-[14px] border ${
                    errors.country ? "border-[#FB2C36]" : "border-[#D1D5DC]"
                  } bg-white cursor-pointer`}
                >
                  <p className={country ? "text-black" : "text-gray-400"}>
                    {country || "Select Country"}
                  </p>
                  <img
                    src="/dropdown.svg"
                    className={`w-4 h-4 transition-transform duration-200 ${countryOpen ? "rotate-180" : ""}`}
                  />
                </div>
                {errors.country && (
                  <p className="text-[#FB2C36] text-xs mt-1">
                    {errors.country}
                  </p>
                )}
                {countryOpen && (
                  <div className="absolute top-full mt-2 w-full bg-white border border-[#D1D5DC] rounded-[14px] shadow-md z-50 max-h-60 overflow-y-auto">
                    {countries.map((c) => (
                      <div
                        key={c}
                        onClick={() => {
                          setCountry(c);
                          setCountryOpen(false);
                          setErrors((prev) => ({ ...prev, country: "" }));
                        }}
                        className="px-5.25 py-3 hover:bg-gray-100 cursor-pointer"
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CITY */}
              <div className="flex flex-col gap-2 relative w-full" id="city">
                <label className="text-[#333] text-sm sm:text-base font-medium">
                  Delivery City <span className="text-[#FB2C36]">*</span>
                </label>
                <div
                  onClick={() => setCityOpen(!cityOpen)}
                  className={`flex w-full h-15 px-5.25 items-center justify-between rounded-[14px] border ${
                    errors.city ? "border-[#FB2C36]" : "border-[#D1D5DC]"
                  } bg-white cursor-pointer`}
                >
                  <p className={city ? "text-black" : "text-gray-400"}>
                    {city || "Select City"}
                  </p>
                  <img
                    src="/dropdown.svg"
                    className={`w-4 h-4 transition-transform duration-200 ${cityOpen ? "rotate-180" : ""}`}
                  />
                </div>
                {errors.city && (
                  <p className="text-[#FB2C36] text-xs mt-1">{errors.city}</p>
                )}
                {cityOpen && (
                  <div className="absolute top-full mt-2 w-full bg-white border border-[#D1D5DC] rounded-[14px] shadow-md z-50 max-h-60 overflow-y-auto">
                    {cities.map((c) => (
                      <div
                        key={c}
                        onClick={() => {
                          setCity(c);
                          setCityOpen(false);
                          setErrors((prev) => ({ ...prev, city: "" }));
                        }}
                        className="px-5.25 py-3 hover:bg-gray-100 cursor-pointer"
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DELIVERY ADDRESS */}
              <div className="flex flex-col gap-2" id="deliveryAddress">
                <label className="text-[#333] text-sm sm:text-base font-medium">
                  Full Delivery Address{" "}
                  <span className="text-[#FB2C36]">*</span>
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => {
                    setDeliveryAddress(e.target.value);
                    setErrors((prev) => ({ ...prev, deliveryAddress: "" }));
                  }}
                  className={`w-full h-22.5 px-5.25 pt-5.25 pb-12.75 rounded-[14px] border ${
                    errors.deliveryAddress
                      ? "border-[#FB2C36]"
                      : "border-[#D1D5DC]"
                  } outline-none focus:border-[#00A63E] transition-colors`}
                  placeholder="Full street address including landmarks"
                />
                {errors.deliveryAddress && (
                  <p className="text-[#FB2C36] text-xs mt-1">
                    {errors.deliveryAddress}
                  </p>
                )}
              </div>

              {/* DELIVERY DATE */}
              <div className="flex flex-col gap-2" id="deliveryDate">
                <label className="text-[#333] text-sm sm:text-base font-medium">
                  Preferred Delivery Date{" "}
                  <span className="text-[#FB2C36]">*</span>
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => {
                    setDeliveryDate(e.target.value);
                    setErrors((prev) => ({ ...prev, deliveryDate: "" }));
                  }}
                  className={inputClass("deliveryDate")}
                />
                {errors.deliveryDate && (
                  <p className="text-[#FB2C36] text-xs mt-1">
                    {errors.deliveryDate}
                  </p>
                )}
              </div>
            </div>

            {/* GIFT PERSONALIZATION — always shown */}
            <div className="flex p-5 sm:p-7.5 flex-col gap-5 rounded-2xl bg-white shadow">
              <p className="text-[#1A1A1A] font-clash-grotesk text-lg sm:text-[22px] font-medium">
                Gift Personalization
              </p>

              <div className="flex flex-col gap-2">
                <label className="text-[#333] text-sm sm:text-base font-medium">
                  Gift Message (Optional)
                </label>
                <input
                  type="text"
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  className="w-full h-28.75 px-5.25 pt-5.25 pb-19 rounded-[14px] border border-[#D1D5DC] outline-none focus:border-[#00A63E] transition-colors"
                  placeholder="Add a personal message"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[#333] text-sm sm:text-base font-medium">
                  Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full h-28.75 px-5.25 pt-5.25 pb-19 rounded-[14px] border border-[#D1D5DC] outline-none focus:border-[#00A63E] transition-colors"
                  placeholder="Any instructions..."
                />
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDE — Order Summary ─────────────────────────────────── */}
          <div className="w-full xl:w-100 flex flex-col gap-6">
            <div className="p-5 sm:p-6.25 flex flex-col gap-5 rounded-[14px] border-2 border-[#F3F4F6] bg-white shadow">
              <p className="text-[#2D2D2D] font-clash-grotesk text-lg sm:text-[22px] font-medium">
                Order Summary
              </p>

              {cartList.length > 0 ? (
                cartList.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <img
                      className="w-22.5 h-16.25 rounded-lg object-cover"
                      src={
                        Array.isArray(item.product.image)
                          ? item.product.image[0]
                          : item.product.image
                      }
                      alt=""
                    />
                    <div className="flex flex-col gap-1">
                      <p className="text-[#101828] font-dm-sans-700 text-base sm:text-lg font-extrabold">
                        {item.product.name}
                      </p>
                      {item.variantKey !== "default" && (
                        <p className="text-[#4A5565] text-xs">
                          {item.variantKey}
                        </p>
                      )}
                      <p className="text-[#4A5565] text-sm">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[#6A7282] text-sm text-center">
                  No items in cart
                </p>
              )}

              <div className="flex justify-between items-center w-full">
                <p className="text-[#4A5565] opacity-50 text-sm sm:text-base">
                  Subtotal
                </p>
                <p className="text-[#006E3D] font-medium">
                  {currency}
                  {subtotal.toLocaleString()}
                </p>
              </div>

              <div className="flex justify-between items-center w-full">
                <p className="text-[#4A5565] opacity-50 text-sm sm:text-base">
                  Delivery Fee
                </p>
                <p className="text-[#6A7282] text-sm sm:text-base">
                  To be confirmed
                </p>
              </div>

              <div className="flex justify-between items-center w-full">
                <p className="text-[#4A5565] text-sm sm:text-base font-medium">
                  Estimated Total
                </p>
                <p className="text-[#006E3D] font-medium">
                  {currency}
                  {subtotal.toLocaleString()}
                </p>
              </div>

              <div className="flex justify-center items-center w-full h-9.75 rounded-[10px] border border-[#DCFCE7] bg-[#F0FDF4]">
                <p className="text-[#016630] text-[10px]">
                  Final confirmation and delivery fee will be provided on
                  WhatsApp.
                </p>
              </div>
            </div>

            <div className="flex justify-center items-center px-4 h-20.25 rounded-[14px] border border-[#DBEAFE] bg-[#EFF6FF]">
              <div className="flex gap-2.5 items-center">
                <img src="/info.svg" alt="" />
                <p className="text-[#1C398E] text-xs">
                  When you continue, your order details will be automatically
                  sent to WhatsApp for confirmation and payment instructions.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleWhatsApp}
                className="flex gap-1.25 justify-center items-center w-full h-15 rounded-[14px] bg-[#00A63E] text-white cursor-pointer active:opacity-90 transition-opacity"
              >
                <img src="/whatsapp.svg" alt="" />
                continue with WhatsApp
              </button>

              <button
                onClick={() => navigate("/swift-logistics")}
                className="w-full h-15 rounded-[14px] border bg-white cursor-pointer active:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>

              <p className="text-[#6A7282] text-center text-xs">
                No payment required at this stage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartForm1;
