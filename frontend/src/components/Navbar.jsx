import React, { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { getCartCount, johnStoresProducts, swiftProducts, navigate } =
    useContext(ShopContext);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const searchRef = useRef(null);

  // Filter both stores as user types
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
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
      .map((p) => ({ ...p, store: "stores" }));

    const fromSwift = swiftProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
      .map((p) => ({ ...p, store: "swift" }));

    setResults([...fromStores, ...fromSwift].slice(0, 8));
    setOpen(true);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (product) => {
    setQuery("");
    setOpen(false);
    if (product.store === "stores") {
      navigate(`/john-stores/product/${product._id}`);
    } else {
      navigate(`/swift-logistics/product/${product._id}`);
    }
  };

  return (
    <div className="w-full relative z-50 font-medium">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img
            className="w-8 h-8 sm:w-10 sm:h-10"
            src={assets.john_enterprise_icon}
            alt=""
          />
          <p className="text-[#121212] font-clash-grotesk font-medium leading-5 tracking-[0.48px] [-webkit-text-stroke-width:0.3px] [-webkit-text-stroke-color:#121212]">
            John's <br /> Enterprise
          </p>
        </div>

        {/* Desktop Navbar: visible lg+ */}
        <ul className="hidden lg:flex flex-wrap gap-4 xl:gap-11 text-sm">
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

        {/* Right side */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          {/* Search box: visible md+ */}
          <div ref={searchRef} className="relative hidden md:flex flex-col">
            <div className="flex items-center w-60 h-9 py-2.25 gap-2.5 bg-[#F1F1F1] rounded-[10px] border-[0.667px] border-[rgba(18,18,18,0)]">
              <img
                src={assets.search_icon}
                alt="Search"
                className="w-8 h-9 cursor-pointer mr-2"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setOpen(true)}
                placeholder="Search products & services"
                className="w-full bg-transparent outline-none text-[#6B7280] font-dm-sans text-[14px] font-normal leading-3.75 tracking-[-0.3px]"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setOpen(false);
                  }}
                  className="mr-2 text-[#6B7280] text-sm cursor-pointer leading-none"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dropdown results */}
            {open && (
              <div className="absolute top-10 left-0 w-72 bg-white rounded-xl shadow-xl border border-[rgba(0,0,0,0.08)] z-50 overflow-hidden">
                {results.length > 0 ? (
                  results.map((product) => (
                    <button
                      key={`${product.store}-${product._id}`}
                      onClick={() => handleSelect(product)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-[#F9F9F9] transition-colors cursor-pointer text-left"
                    >
                      <img
                        src={
                          Array.isArray(product.image)
                            ? product.image[0]
                            : product.image
                        }
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        <p className="text-[#2D2D2D] font-dm-sans text-[13px] font-medium leading-5 truncate">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[10px] font-dm-sans font-medium px-1.5 py-0.5 rounded-md leading-none ${
                              product.store === "stores"
                                ? "bg-[#FFF0F0] text-[#E3494E]"
                                : "bg-[#F0FFF7] text-[#00A63E]"
                            }`}
                          >
                            {product.store === "stores"
                              ? "John's Store"
                              : "Swift Logistics"}
                          </span>
                          <span className="text-[#6B7280] font-dm-sans text-[11px] leading-4">
                            ₦
                            {(product.store === "stores"
                              ? product.price.current
                              : product.price
                            ).toLocaleString()}
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

          {/* Cart */}
          <Link to="/cart" className="w-5 h-5 sm:w-6 sm:h-6" id="cart-icon">
            <img
              src="/cart.svg"
              alt="Cart"
              className="w-full h-full object-contain"
            />
            {getCartCount() > 0 && (
              <span className="absolute top-7 right-12 sm:top-7 sm:right-19 lg:top-7 lg:right-8 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-600 rounded-full border border-white"></span>
            )}
          </Link>

          {/* Hamburger: visible below lg */}
          <button
            onClick={() => setVisible(!visible)}
            className="lg:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 bg-[#121212] rounded-full transition-all duration-300 origin-center ${
                visible ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-[#121212] rounded-full transition-all duration-300 ${
                visible ? "opacity-0 scale-x-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-[#121212] rounded-full transition-all duration-300 origin-center ${
                visible ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          visible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setVisible(false)}
      />

      {/* Mobile Slide-in Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 lg:hidden shadow-2xl transition-transform duration-300 ease-in-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Menu Header */}
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

        {/* Nav Links */}
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
                `flex items-center gap-3 px-4 py-3.5 rounded-[12px] transition-all duration-200 font-dm-sans text-[15px] font-normal tracking-[-0.32px] ${
                  isActive
                    ? "bg-[#E3494E]/10 text-[#E3494E] font-medium"
                    : "text-[rgba(18,18,18,0.7)] hover:bg-gray-50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                      isActive ? "bg-[#E3494E]" : "bg-transparent"
                    }`}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Mobile search */}
        <div className="px-4 pb-4">
          <div className="flex items-center w-full h-10 gap-2 bg-[#F1F1F1] rounded-[10px] px-3">
            <img
              src={assets.search_icon}
              alt="Search"
              className="w-4 h-4 opacity-50"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products & services"
              className="w-full bg-transparent outline-none text-[#6B7280] font-dm-sans text-[13px] font-normal"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setOpen(false);
                }}
                className="text-[#6B7280] text-sm cursor-pointer leading-none"
              >
                ✕
              </button>
            )}
          </div>
          {/* Mobile dropdown */}
          {open && query.trim().length >= 2 && (
            <div className="mt-1 w-full bg-white rounded-xl shadow-xl border border-[rgba(0,0,0,0.08)] overflow-hidden">
              {results.length > 0 ? (
                results.map((product) => (
                  <button
                    key={`mob-${product.store}-${product._id}`}
                    onClick={() => {
                      handleSelect(product);
                      setVisible(false);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-[#F9F9F9] transition-colors cursor-pointer text-left"
                  >
                    <img
                      src={
                        Array.isArray(product.image)
                          ? product.image[0]
                          : product.image
                      }
                      alt={product.name}
                      className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <p className="text-[#2D2D2D] font-dm-sans text-[12px] font-medium leading-5 truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-dm-sans font-medium px-1.5 py-0.5 rounded-md leading-none ${
                            product.store === "stores"
                              ? "bg-[#FFF0F0] text-[#E3494E]"
                              : "bg-[#F0FFF7] text-[#00A63E]"
                          }`}
                        >
                          {product.store === "stores"
                            ? "John's Store"
                            : "Swift"}
                        </span>
                        <span className="text-[#6B7280] font-dm-sans text-[11px]">
                          ₦
                          {(product.store === "stores"
                            ? product.price.current
                            : product.price
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-4 text-center text-[#6B7280] font-dm-sans text-sm">
                  No results for "{query}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer inside menu */}
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
