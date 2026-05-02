import { useState, useEffect } from "react";

const UpdateCategory = ({
  onClose,
  onSubmit,
  initialData = {},
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    categoryName: initialData.name || "",
    brand: initialData.brand || "John's Stores",
  });
  const [brandOpen, setBrandOpen] = useState(false);

  const brands = ["John's Stores", "Swift Logistics"];

  // Sync when initialData changes
  useEffect(() => {
    setFormData({
      categoryName: initialData.name || "",
      brand: initialData.brand || "John's Stores",
    });
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <div className="flex flex-col items-start w-[390px] p-[25px] gap-[10px] rounded-[16px] bg-white">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-end self-stretch gap-4"
      >
        <div className="flex flex-col w-full items-start gap-4">
          <p className="text-[#2D2D2D] font-medium text-base leading-[18px] font-clash-grotesk">
            Update Category
          </p>

          {/* Category Name */}
          <div className="flex flex-col w-full items-start gap-1.5">
            <label
              htmlFor="categoryName"
              className="text-[#2D2D2D] font-medium text-base leading-[18px] font-dm-sans-500"
            >
              Category Name
            </label>
            <input
              id="categoryName"
              type="text"
              value={formData.categoryName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  categoryName: e.target.value,
                }))
              }
              placeholder="Enter Category Name"
              disabled={isLoading}
              className="flex items-center w-full h-[50px] pt-[21px] pb-[21px] pl-[21px] rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white font-dm-sans text-base placeholder:text-[rgba(45,45,45,0.50)] placeholder:font-normal placeholder:leading-[18px] disabled:opacity-50"
            />
          </div>

          {/* Brand Dropdown */}
          <div className="flex flex-col w-full items-start gap-1.5 relative">
            <p className="text-[#2D2D2D] font-medium text-base leading-[18px] font-dm-sans-500">
              Brand
            </p>
            <div
              onClick={() => !isLoading && setBrandOpen(!brandOpen)}
              className={`flex items-center pl-[20px] pr-[18px] py-[16px] w-full justify-between rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white ${!isLoading ? "cursor-pointer" : "opacity-50"}`}
            >
              <div className="flex gap-1.5 items-center">
                <img
                  src={
                    formData.brand === "John's Stores"
                      ? "/john-stores.svg"
                      : "/swift-log.svg"
                  }
                  alt=""
                  className="w-4 h-4"
                />
                <p className="text-[#2D2D2D] font-medium text-base leading-[18px] tracking-[-0.5px] font-dm-sans-500">
                  {formData.brand}
                </p>
              </div>
              <img
                src="/keyboard-arrow.svg"
                alt=""
                className={`transition-transform duration-200 ${brandOpen ? "rotate-180" : ""}`}
              />
            </div>

            {/* Dropdown Options */}
            {brandOpen && (
              <div className="absolute top-full mt-1 w-full bg-white border border-[#D1D5DC] rounded-[14px] shadow-md z-10">
                {brands.map((brand) => (
                  <div
                    key={brand}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, brand }));
                      setBrandOpen(false);
                    }}
                    className={`flex items-center gap-2 px-5 py-3 cursor-pointer hover:bg-[#FAFAFA] transition-colors first:rounded-t-[14px] last:rounded-b-[14px] ${
                      formData.brand === brand ? "bg-[#F0FDF4]" : ""
                    }`}
                  >
                    <img
                      src={
                        brand === "John's Stores"
                          ? "/john-stores.svg"
                          : "/swift-log.svg"
                      }
                      alt=""
                      className="w-4 h-4"
                    />
                    <p className="text-[#2D2D2D] font-medium text-sm font-dm-sans">
                      {brand}
                    </p>
                    {formData.brand === brand && (
                      <svg
                        className="ml-auto w-4 h-4 text-[#032817]"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M3 8l3.5 3.5 6.5-7"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex justify-center items-center px-5 h-[45px] rounded-[12px] bg-[#ECECF0] disabled:opacity-50 cursor-pointer"
          >
            <p className="text-[#0A0A0A] text-center font-medium text-sm leading-[16px] font-clash-grotesk">
              Cancel
            </p>
          </button>
          <button
            type="submit"
            disabled={isLoading || !formData.categoryName.trim()}
            className="flex justify-center items-center px-5 h-[45px] rounded-[12px] bg-[#D4183D] disabled:opacity-50 cursor-pointer"
          >
            <p className="text-white text-center font-medium text-sm leading-[16px] font-clash-grotesk">
              {isLoading ? "Updating..." : "Update"}
            </p>
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCategory;
