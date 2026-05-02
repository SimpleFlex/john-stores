import React, { useState, useEffect, useRef } from "react";

const MobileFilterSheet = ({
  isOpen,
  onClose,
  filters = {},
  activeFilters = {},
  onApply,
}) => {
  const { categories = [], sizes = [], priceRange = [0, 100000] } = filters;

  const [localCategory, setLocalCategory] = useState(
    activeFilters.category || "",
  );
  const [localSize, setLocalSize] = useState(activeFilters.size || "");
  const [localPrice, setLocalPrice] = useState(
    activeFilters.price || priceRange,
  );

  // Sync when sheet opens
  useEffect(() => {
    if (isOpen) {
      setLocalCategory(activeFilters.category || "");
      setLocalSize(activeFilters.size || "");
      setLocalPrice(activeFilters.price || priceRange);
    }
  }, [isOpen]);

  const activeCount = [
    localCategory,
    localSize,
    localPrice[0] !== priceRange[0] || localPrice[1] !== priceRange[1],
  ].filter(Boolean).length;

  const handleReset = () => {
    setLocalCategory("");
    setLocalSize("");
    setLocalPrice(priceRange);
  };

  const handleApply = () => {
    onApply?.({ category: localCategory, size: localSize, price: localPrice });
    onClose();
  };

  // Close on backdrop click
  const backdropRef = useRef(null);
  const handleBackdrop = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleBackdrop}
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isOpen
            ? "bg-black/40 backdrop-blur-[2px] pointer-events-auto"
            : "bg-black/0 backdrop-blur-none pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      />

      {/* Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[28px] shadow-[0_-8px_40px_rgba(0,0,0,0.15)] transition-transform duration-[380ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "82vh", display: "flex", flexDirection: "column" }}
        role="dialog"
        aria-modal="true"
        aria-label="Filter products"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-[#E5E7EB]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-4 border-b border-[#F3F4F6] flex-shrink-0">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-[#032817]"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <line x1="2" y1="4" x2="14" y2="4" />
              <line x1="4" y1="8" x2="12" y2="8" />
              <line x1="6" y1="12" x2="10" y2="12" />
            </svg>
            <p className="text-[#1A1A1A] font-dm-sans-700 text-base font-bold leading-5 tracking-[-0.3px]">
              Filters
            </p>
            {activeCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#032817] text-white text-[10px] font-medium">
                {activeCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F3F4F6] active:bg-[#E5E7EB] transition-colors"
          >
            <svg
              className="w-3.5 h-3.5 text-[#374151]"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-6">
          {/* Categories */}
          {categories.length > 0 && (
            <FilterSection title="Category">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <FilterChip
                    key={cat}
                    label={cat}
                    active={localCategory === cat}
                    onClick={() =>
                      setLocalCategory(localCategory === cat ? "" : cat)
                    }
                  />
                ))}
              </div>
            </FilterSection>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <FilterSection title="Size">
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <FilterChip
                    key={s}
                    label={s}
                    active={localSize === s}
                    onClick={() => setLocalSize(localSize === s ? "" : s)}
                    square
                  />
                ))}
              </div>
            </FilterSection>
          )}

          {/* Price Range */}
          <FilterSection title="Price Range">
            <PriceRangeSlider
              min={priceRange[0]}
              max={priceRange[1]}
              value={localPrice}
              onChange={setLocalPrice}
            />
          </FilterSection>
        </div>

        {/* Footer actions */}
        <div className="flex-shrink-0 flex gap-3 px-5 py-4 border-t border-[#F3F4F6] bg-white">
          <button
            onClick={handleReset}
            className="flex-1 py-3.5 rounded-[10px] border-2 border-[#E5E7EB] text-[#374151] font-dm-sans-500 text-sm font-medium active:bg-[#F9FAFB] transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-[2] py-3.5 rounded-[10px] bg-[#032817] text-white font-dm-sans-500 text-sm font-medium shadow-md active:opacity-90 transition-opacity"
          >
            {activeCount > 0 ? `Show Results (${activeCount})` : "Show Results"}
          </button>
        </div>
      </div>
    </>
  );
};

/* ── Sub-components ─────────────────────────────────────── */

const FilterSection = ({ title, children }) => (
  <div className="flex flex-col gap-3">
    <p className="text-[#374151] font-dm-sans font-semibold text-sm leading-5 tracking-[-0.2px]">
      {title}
    </p>
    {children}
  </div>
);

const FilterChip = ({ label, active, onClick, square = false }) => (
  <button
    onClick={onClick}
    className={`transition-all duration-150 active:scale-95 text-sm font-dm-sans font-medium ${
      square
        ? `px-3.5 py-1.5 rounded-[8px] min-w-[40px] ${
            active
              ? "border-2 border-[#00E27C] bg-[rgba(0,226,124,0.10)] text-[#032817]"
              : "border-2 border-[#E5E7EB] text-[#6A7282]"
          }`
        : `px-3.5 py-1.5 rounded-full ${
            active
              ? "bg-[#032817] text-white"
              : "bg-[#F3F4F6] text-[#374151] border border-transparent"
          }`
    }`}
  >
    {label}
  </button>
);

const PriceRangeSlider = ({ min, max, value, onChange }) => {
  const [low, high] = value;
  const pct = (v) => ((v - min) / (max - min)) * 100;

  const handleLow = (e) => {
    const v = Math.min(Number(e.target.value), high - 1);
    onChange([v, high]);
  };
  const handleHigh = (e) => {
    const v = Math.max(Number(e.target.value), low + 1);
    onChange([low, v]);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Price display */}
      <div className="flex items-center justify-between">
        <span className="text-[#032817] font-clash-grotesk font-medium text-sm">
          ₦{low.toLocaleString()}
        </span>
        <span className="text-[#9CA3AF] text-xs font-dm-sans">–</span>
        <span className="text-[#032817] font-clash-grotesk font-medium text-sm">
          ₦{high.toLocaleString()}
        </span>
      </div>

      {/* Dual range track */}
      <div className="relative h-5 flex items-center">
        {/* Track background */}
        <div className="absolute w-full h-1.5 rounded-full bg-[#E5E7EB]" />
        {/* Active range fill */}
        <div
          className="absolute h-1.5 rounded-full bg-[#032817]"
          style={{ left: `${pct(low)}%`, right: `${100 - pct(high)}%` }}
        />
        {/* Low thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={500}
          value={low}
          onChange={handleLow}
          className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#032817] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing"
        />
        {/* High thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={500}
          value={high}
          onChange={handleHigh}
          className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#032817] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing"
        />
      </div>
    </div>
  );
};

export default MobileFilterSheet;
