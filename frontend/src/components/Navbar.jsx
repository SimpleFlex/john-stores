import React, { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { getCartCount, johnStoresProducts, swiftProducts } =
    useContext(ShopContext);

  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    const q = query.toLowerCase();

    const fromStores = johnStoresProducts
      .filter(
        (p) =>
          (p.productName || p.name)?.toLowerCase().includes(q) ||
          (typeof p.category === "object" ? p.category?.name : p.category)
            ?.toLowerCase()
            .includes(q),
      )
      .map((p) => ({ ...p, store: "stores" }));

    const fromSwift = swiftProducts
      .filter(
        (p) =>
          (p.productName || p.name)?.toLowerCase().includes(q) ||
          (typeof p.category === "object" ? p.category?.name : p.category)
            ?.toLowerCase()
            .includes(q),
      )
      .map((p) => ({ ...p, store: "swift" }));

    setResults([...fromStores, ...fromSwift].slice(0, 8));
    setOpen(true);
  }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target)
      ) {
        setMobileSearchOpen(false);
        setQuery("");
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, []);

  const handleSelect = (product) => {
    setQuery("");
    setOpen(false);
    setMobileSearchOpen(false);
    if (product.store === "stores") {
      navigate(`/john-stores/product/${product._id}`);
    } else {
      navigate(`/swift-logistics/product/${product._id}`);
    }
  };

  const getImageSrc = (product) => {
    const imgArray = product.images || product.image;
    if (Array.isArray(imgArray)) return imgArray[0]?.url || imgArray[0];
    return imgArray;
  };

  const getProductName = (product) => product.productName || product.name;
  const getPrice = (product) =>
    typeof product.price === "object" ? product.price.current : product.price;

  return (
    <div className="w-full sticky top-0 bg-white z-50 font-medium">
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4">
        <div className="flex items-center gap-2.5 shrink-0">
          <img
            className="w-8 h-8 sm:w-10 sm:h-10"
            src={assets.john_enterprise_icon}
            alt=""
          />
          <p className="text-[#121212] font-clash-grotesk font-medium leading-5 tracking-[0.48px] [-webkit-text-stroke-width:0.3px] [-webkit-text-stroke-color:#121212] hidden sm:block">
            John's <br /> Enterprise
          </p>
        </div>

        <ul className="hidden md:flex flex-wrap gap-4 xl:gap-11 text-sm">
          <NavLink to="/" className="flex flex-col items-center">
            <p className="text-[rgba(18,18,18,0.6)] font-dm-sans font-normal leading-4 tracking-[-0.32px]">
              Home
            </p>
          </NavLink>
          <NavLink to="/swift-logistics" className="flex flex-col items-center">
            <p className="text-[rgba(18,18,18,0.6)] font-dm-sans font-normal leading-4 tracking-[-0.32px]">
              Swift Logistics
            </p>
          </NavLink>
          <NavLink to="/easy-media" className="flex flex-col items-center">
            <p className="text-[rgba(18,18,18,0.6)] font-dm-sans font-normal leading-4 tracking-[-0.32px]">
              Easy Media
            </p>
          </NavLink>
          <NavLink to="/john-stores" className="flex flex-col items-center">
            <p className="text-[rgba(18,18,18,0.6)] font-dm-sans font-normal leading-4 tracking-[-0.32px]">
              John Stores
            </p>
          </NavLink>
          <NavLink to="/testimonials" className="flex flex-col items-center">
            <p className="text-[rgba(18,18,18,0.6)] font-dm-sans font-normal leading-4 tracking-[-0.32px]">
              Testimonials
            </p>
          </NavLink>
          <NavLink to="/faqs" className="flex flex-col items-center">
            <p className="text-[rgba(18,18,18,0.6)] font-dm-sans font-normal leading-4 tracking-[-0.32px]">
              FAQ
            </p>
          </NavLink>
        </ul>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          {/* Desktop Search */}
          <div ref={searchRef} className="relative hidden md:block">
            {/* FIX: was w-8 h-9 (oversized, blocking input) → w-4 h-4 flex-shrink-0
                      container: removed py-2.25 (invalid), added px-3; input: w-full → flex-1 min-w-0 */}
            <div className="flex items-center w-60 h-9 px-3 gap-2 bg-[#F1F1F1] rounded-[10px] border-[0.667px] border-[rgba(18,18,18,0)]">
              <img
                src={assets.search_icon}
                alt="Search"
                className="w-4 h-4 flex-shrink-0"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setOpen(true)}
                placeholder="Search products & services"
                className="flex-1 min-w-0 bg-transparent outline-none text-[#6B7280] font-dm-sans text-[14px] font-normal leading-none tracking-[-0.3px]"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setOpen(false);
                  }}
                  className="text-[#6B7280] text-sm cursor-pointer leading-none flex-shrink-0"
                >
                  ✕
                </button>
              )}
            </div>
            {open && (
              <div className="absolute top-full left-0 right-0 mt-1 w-full bg-white rounded-xl shadow-xl border border-[rgba(0,0,0,0.08)] z-50 overflow-hidden">
                {results.length > 0 ? (
                  results.map((product) => (
                    <button
                      key={`${product.store}-${product._id}`}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => handleSelect(product)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-[#F9F9F9] transition-colors cursor-pointer text-left"
                    >
                      <img
                        src={getImageSrc(product)}
                        alt={getProductName(product)}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        <p className="text-[#2D2D2D] font-dm-sans text-[13px] font-medium leading-5 truncate">
                          {getProductName(product)}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[10px] font-dm-sans font-medium px-1.5 py-0.5 rounded-md leading-none ${product.store === "stores" ? "bg-[#FFF0F0] text-[#E3494E]" : "bg-[#F0FFF7] text-[#00A63E]"}`}
                          >
                            {product.store === "stores"
                              ? "John's Store"
                              : "Swift Logistics"}
                          </span>
                          <span className="text-[#6B7280] font-dm-sans text-[11px] leading-4">
                            ₦{getPrice(product)?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-5 text-center text-[#6B7280] font-dm-sans text-sm">
                    No results for "{query}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Search */}
          <div ref={mobileSearchRef} className="relative md:hidden">
            {!mobileSearchOpen ? (
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="w-8 h-8 flex items-center justify-center"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#121212"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-[#F1F1F1] rounded-[10px] px-3 h-9 w-[180px]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6B7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  autoFocus
                  className="w-full bg-transparent outline-none text-[#6B7280] font-dm-sans text-[13px] font-normal"
                />
                <button
                  onClick={() => {
                    setMobileSearchOpen(false);
                    setQuery("");
                    setOpen(false);
                  }}
                  className="text-[#6B7280] text-sm cursor-pointer leading-none shrink-0"
                >
                  ✕
                </button>
              </div>
            )}
            {mobileSearchOpen && open && query.trim().length >= 2 && (
              <div className="absolute top-full right-0 mt-1 w-[260px] bg-white rounded-xl shadow-xl border border-[rgba(0,0,0,0.08)] z-50 overflow-hidden">
                {results.length > 0 ? (
                  results.map((product) => (
                    <button
                      key={`ms-${product.store}-${product._id}`}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => handleSelect(product)}
                      className="flex items-center gap-2 w-full px-3 py-2 hover:bg-[#F9F9F9] transition-colors cursor-pointer text-left"
                    >
                      <img
                        src={getImageSrc(product)}
                        alt={getProductName(product)}
                        className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        <p className="text-[#2D2D2D] font-dm-sans text-[11px] font-medium leading-4 truncate">
                          {getProductName(product)}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-dm-sans font-medium px-1 py-0.5 rounded leading-none ${product.store === "stores" ? "bg-[#FFF0F0] text-[#E3494E]" : "bg-[#F0FFF7] text-[#00A63E]"}`}
                          >
                            {product.store === "stores" ? "Store" : "Swift"}
                          </span>
                          <span className="text-[#6B7280] font-dm-sans text-[10px]">
                            ₦{getPrice(product)?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-center text-[#6B7280] font-dm-sans text-xs">
                    No results
                  </div>
                )}
              </div>
            )}
          </div>

          <Link
            to="/cart"
            className="w-5 h-5 sm:w-6 sm:h-6 relative shrink-0"
            id="cart-icon"
          >
            <img
              src="/cart.svg"
              alt="Cart"
              className="w-full h-full object-contain"
            />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-600 rounded-full border border-white"></span>
            )}
          </Link>

          <button
            onClick={() => setVisible(!visible)}
            className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 cursor-pointer focus:outline-none shrink-0"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 bg-[#121212] rounded-full transition-all duration-300 origin-center ${visible ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-[#121212] rounded-full transition-all duration-300 ${visible ? "opacity-0 scale-x-0" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-[#121212] rounded-full transition-all duration-300 origin-center ${visible ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setVisible(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 md:hidden shadow-2xl transition-transform duration-300 ease-in-out ${visible ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <img className="w-8 h-8" src={assets.john_enterprise_icon} alt="" />
            <p className="text-[#121212] font-clash-grotesk font-medium text-sm leading-5">
              John's Enterprise
            </p>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <span className="block w-4 h-0.5 bg-[#121212] rounded-full rotate-45 absolute" />
            <span className="block w-4 h-0.5 bg-[#121212] rounded-full -rotate-45 absolute" />
          </button>
        </div>
        <div className="flex flex-col px-4 py-6 gap-1">
          {[
            { to: "/", label: "Home" },
            { to: "/swift-logistics", label: "Swift Logistics" },
            { to: "/easy-media", label: "Easy Media" },
            { to: "/john-stores", label: "John Stores" },
            { to: "/testimonials", label: "Testimonials" },
            { to: "/faqs", label: "FAQ" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-[12px] transition-all duration-200 font-dm-sans text-[15px] font-normal tracking-[-0.32px] ${isActive ? "bg-[#E3494E]/10 text-[#E3494E] font-medium" : "text-[rgba(18,18,18,0.7)] hover:bg-gray-50"}`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${isActive ? "bg-[#E3494E]" : "bg-transparent"}`}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-6 py-5 border-t border-gray-100">
          <p className="text-[#6B7280] font-dm-sans text-[11px] text-center">
            © 2025 John's Enterprise
          </p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
