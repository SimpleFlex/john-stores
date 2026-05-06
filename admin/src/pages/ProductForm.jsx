import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct, fetchCategories } from "../services/api.service.js";

const ProductForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const colorFileInputRef = useRef({});

  const [formData, setFormData] = useState({
    productName: "",
    brand: "John's Stores",
    category: "",
    description: "",
    images: [],
    price: "",
    stockQuantity: "",
    sizeOptions: [],
    color: [],
    colorImages: {},
    isFeatured: false,
  });

  const [categories, setCategories] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const [error, setError] = useState("");

  // Color image upload state — track previews per color
  const [colorImagePreviews, setColorImagePreviews] = useState({});
  const [colorImageFiles, setColorImageFiles] = useState({});

  const brands = ["John's Stores", "Swift Logistics"];

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    loadCategories();
  }, []);

  // Filter categories by selected brand
  const filteredCategories = categories.filter(
    (cat) => !formData.brand || cat.brand === formData.brand,
  );

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Reset category when brand changes
      if (field === "brand") {
        updated.category = "";
      }
      return updated;
    });
  };

  // ── Image handlers ───────────────────────────────────────────────
  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { type: "url", value: trimmed }],
    }));
    setImageUrlInput("");
  };

  const handleLocalImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            {
              type: "file",
              value: ev.target.result,
              name: file.name,
              fileObj: file,
            },
          ],
        }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ── Size handlers ────────────────────────────────────────────────
  const handleAddSize = () => {
    const trimmed = sizeInput.trim();
    if (!trimmed || formData.sizeOptions.includes(trimmed)) return;
    setFormData((prev) => ({
      ...prev,
      sizeOptions: [...prev.sizeOptions, trimmed],
    }));
    setSizeInput("");
  };

  const handleRemoveSize = (index) => {
    setFormData((prev) => ({
      ...prev,
      sizeOptions: prev.sizeOptions.filter((_, i) => i !== index),
    }));
  };

  // ── Color handlers ───────────────────────────────────────────────
  const handleAddColor = () => {
    const trimmed = colorInput.trim();
    if (!trimmed || formData.color.includes(trimmed)) return;
    setFormData((prev) => ({
      ...prev,
      color: [...prev.color, trimmed],
    }));
    setColorInput("");
  };

  const handleRemoveColor = (index) => {
    const removedColor = formData.color[index];
    setFormData((prev) => ({
      ...prev,
      color: prev.color.filter((_, i) => i !== index),
      colorImages: { ...prev.colorImages, [removedColor]: undefined },
    }));
    setColorImagePreviews((prev) => {
      const next = { ...prev };
      delete next[removedColor];
      return next;
    });
    setColorImageFiles((prev) => {
      const next = { ...prev };
      delete next[removedColor];
      return next;
    });
  };

  const handleColorImageUpload = (color, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setColorImageFiles((prev) => ({ ...prev, [color]: file }));
    const reader = new FileReader();
    reader.onload = (ev) => {
      setColorImagePreviews((prev) => ({ ...prev, [color]: ev.target.result }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const getCategoryName = () => {
    const cat = filteredCategories.find((c) => c._id === formData.category);
    return cat?.name || "Select Category";
  };

  // ── Submit ───────────────────────────────────────────────────────
  const handleSave = async () => {
    setError("");
    if (!formData.productName.trim()) {
      setError("Product name is required.");
      return;
    }
    if (!formData.brand) {
      setError("Please select a brand.");
      return;
    }
    if (!formData.category) {
      setError("Please select a category.");
      return;
    }
    if (!formData.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!formData.price) {
      setError("Price is required.");
      return;
    }
    if (!formData.stockQuantity) {
      setError("Stock quantity is required.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = new FormData();
      payload.append("productName", formData.productName);
      payload.append("brand", formData.brand);
      payload.append("category", formData.category);
      payload.append("description", formData.description);
      payload.append("price", formData.price);
      payload.append("stockQuantity", formData.stockQuantity);
      payload.append("sizeOptions", JSON.stringify(formData.sizeOptions));
      payload.append("color", JSON.stringify(formData.color));
      payload.append("isFeatured", String(formData.isFeatured));

      // Upload color images as regular images (they'll be in the images array)
      // We'll handle colorImages mapping after
      // Upload color images with their color name as field key
      for (const color of formData.color) {
        if (colorImageFiles[color]) {
          payload.append(`colorImage_${color}`, colorImageFiles[color]);
        }
      }

      // Build color image mapping using image indices
      // We'll send color-to-index mapping
      const fileImages = formData.images.filter((img) => img.type === "file");
      fileImages.forEach((img) => {
        payload.append("images", img.fileObj);
      });

      const urlImages = formData.images
        .filter((img) => img.type === "url")
        .map((img) => img.value);
      payload.append("imageUrls", JSON.stringify(urlImages));

      await createProduct(payload);
      navigate("/products");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save product. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col justify-center items-start w-full p-3 rounded-[25px] border border-[rgba(107,107,107,0.15)] bg-white">
        <div className="flex items-center py-[20px] gap-2">
          <button
            onClick={() => navigate("/products")}
            className="flex flex-col justify-center items-center w-[36px] h-[36px] rounded-[12px] cursor-pointer"
          >
            <img src="/left-arrow.svg" alt="Go back" />
          </button>
          <div className="flex flex-col items-start gap-2">
            <p className="text-[#2D2D2D] font-medium text-xl leading-[18px] tracking-[-0.2px] font-clash-grotesk">
              Add New Product
            </p>
            <p className="text-[#717182] font-medium text-sm leading-[16px] tracking-[-0.2px] capitalize font-dm-sans-500">
              Create a new product
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center w-full py-[30px] px-[30px] rounded-[18px] border border-[rgba(107,107,107,0.25)] bg-white">
          <div className="flex flex-col w-full items-end shrink-0 gap-5">
            {error && (
              <div className="flex w-full items-center px-4 py-3 rounded-[12px] bg-[#FFF0F0] border border-[#FFD0D0]">
                <p className="text-[#C10007] font-dm-sans text-sm">{error}</p>
              </div>
            )}

            {/* Product Name */}
            <div className="flex flex-col w-full items-start gap-1.5">
              <label className="text-[#2D2D2D] font-medium text-base leading-[18px] font-dm-sans-500">
                Product Name <span className="text-[#C10007]">*</span>
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => handleChange("productName", e.target.value)}
                placeholder="Enter product name"
                className="flex items-center w-full h-[60px] pt-[21px] pb-[21px] pl-[21px] rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white placeholder:text-[rgba(45,45,45,0.50)] font-dm-sans"
              />
            </div>

            {/* Brand Dropdown */}
            <div className="flex flex-col w-full items-start gap-1.5 relative">
              <p className="text-[#2D2D2D] font-medium text-base leading-[18px] font-dm-sans-500">
                Brand <span className="text-[#C10007]">*</span>
              </p>
              <div
                onClick={() => setBrandOpen(!brandOpen)}
                className="flex justify-between w-full items-center px-[21px] py-[19px] rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white cursor-pointer"
              >
                <div className="flex gap-0.5 items-center">
                  <img
                    src={
                      formData.brand === "John's Stores"
                        ? "/john-stores.svg"
                        : "/swift-log.svg"
                    }
                    alt=""
                    className="w-4 h-4 mr-1"
                  />
                  <p className="text-[#2D2D2D] font-medium text-base leading-[18px] tracking-[-0.5px] font-dm-sans">
                    {formData.brand}
                  </p>
                </div>
                <img
                  src="/keyboard-arrow.svg"
                  alt=""
                  className={`transition-transform ${brandOpen ? "rotate-180" : ""}`}
                />
              </div>
              {brandOpen && (
                <div className="absolute top-full mt-1 w-full bg-white border border-[#D1D5DC] rounded-[14px] shadow-md z-10">
                  {brands.map((b) => (
                    <div
                      key={b}
                      onClick={() => {
                        handleChange("brand", b);
                        setBrandOpen(false);
                      }}
                      className="px-5 py-3 hover:bg-gray-50 cursor-pointer font-dm-sans text-sm text-[#2D2D2D]"
                    >
                      {b}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Dropdown — filtered by brand */}
            <div className="flex flex-col w-full items-start gap-1.5 relative">
              <p className="text-[#2D2D2D] font-medium text-base leading-[18px] font-dm-sans-500">
                Category <span className="text-[#C10007]">*</span>
              </p>
              <div
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="flex justify-between w-full items-center px-[21px] py-[19px] rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white cursor-pointer"
              >
                <p className="text-[#2D2D2D] font-medium text-base leading-[18px] tracking-[-0.5px] font-dm-sans">
                  {getCategoryName()}
                </p>
                <img
                  src="/keyboard-arrow.svg"
                  alt=""
                  className={`transition-transform ${categoryOpen ? "rotate-180" : ""}`}
                />
              </div>
              {categoryOpen && (
                <div className="absolute top-full mt-1 w-full bg-white border border-[#D1D5DC] rounded-[14px] shadow-md z-10 max-h-48 overflow-y-auto">
                  {filteredCategories.length === 0 ? (
                    <div className="px-5 py-3 text-[#717182] text-sm font-dm-sans">
                      No categories for this brand
                    </div>
                  ) : (
                    filteredCategories.map((cat) => (
                      <div
                        key={cat._id}
                        onClick={() => {
                          handleChange("category", cat._id);
                          setCategoryOpen(false);
                        }}
                        className="px-5 py-3 hover:bg-gray-50 cursor-pointer font-dm-sans text-sm text-[#2D2D2D]"
                      >
                        {cat.name}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col w-full items-start gap-1.5">
              <label className="text-[#2D2D2D] font-medium text-base leading-[18px] font-dm-sans-500">
                Product Description <span className="text-[#C10007]">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter product description..."
                rows={4}
                className="flex items-center w-full pt-[21px] pb-[21px] pl-[21px] rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white placeholder:text-[rgba(45,45,45,0.50)] font-dm-sans resize-none"
              />
            </div>

            {/* Product Images */}
            <div className="flex flex-col w-full items-start gap-3">
              <label className="text-[#2D2D2D] font-medium text-base leading-4.5 font-dm-sans-500">
                Product Images
              </label>
              <div className="flex w-full gap-2 items-center">
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleAddImageUrl())
                  }
                  placeholder="Enter image URL"
                  className="flex items-center w-full h-15 pt-5.25 pb-5.25 pl-5.25 rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white placeholder:text-[rgba(45,45,45,0.50)] font-dm-sans"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="flex justify-center items-center w-[48px] h-[48px] rounded-[12px] bg-[#032817] shrink-0 cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 4v12M4 10h12"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex w-full items-center gap-2">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 w-full h-[50px] pl-[21px] rounded-[14px] border-[1.5px] border-dashed border-[#D1D5DC] bg-[#FAFAFA] cursor-pointer hover:border-[#032817] transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M9 2v10M5 6l4-4 4 4"
                      stroke="#717182"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 14h14"
                      stroke="#717182"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <p className="text-[rgba(45,45,45,0.50)] font-normal text-base font-dm-sans">
                    Upload from device
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleLocalImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex justify-center items-center w-[48px] h-[48px] rounded-[12px] bg-[#032817] shrink-0 cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 4v12M4 10h12"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 w-full">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.value}
                        alt={img.name || `image-${index}`}
                        className="w-[80px] h-[80px] object-cover rounded-[10px] border border-[#D1D5DC]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 flex justify-center items-center w-[20px] h-[20px] rounded-full bg-[#C10007] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                        >
                          <path
                            d="M2 2l6 6M8 2l-6 6"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                      <div className="absolute bottom-1 left-1 px-1 rounded bg-black/50">
                        <p className="text-white text-[9px] font-dm-sans">
                          {img.type === "file" ? "local" : "url"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Stock */}
            <div className="flex w-full items-start gap-5">
              <div className="flex flex-col w-full items-start gap-1.5">
                <label className="text-[#2D2D2D] font-medium text-base leading-[18px] font-dm-sans-500">
                  Price (₦) <span className="text-[#C10007]">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  placeholder="0"
                  className="flex items-center w-full h-[60px] pt-[21px] pb-[21px] pl-[21px] rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white placeholder:text-[rgba(45,45,45,0.50)] font-dm-sans"
                />
              </div>
              <div className="flex flex-col w-full items-start gap-1.5">
                <label className="text-[#2D2D2D] font-medium text-base leading-[18px] font-dm-sans-500">
                  Stock Quantity <span className="text-[#C10007]">*</span>
                </label>
                <input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) =>
                    handleChange("stockQuantity", e.target.value)
                  }
                  placeholder="0"
                  className="flex items-center w-full h-[60px] pt-[21px] pb-[21px] pl-[21px] rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white placeholder:text-[rgba(45,45,45,0.50)] font-dm-sans"
                />
              </div>
            </div>

            {/* Size Options */}
            <div className="flex flex-col w-full gap-2">
              <div className="flex flex-col w-full items-start gap-1.5">
                <label className="text-[#2D2D2D] font-medium text-base leading-[18px] font-dm-sans-500">
                  Size Options
                </label>
                <div className="flex w-full gap-2 items-center">
                  <input
                    type="text"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleAddSize())
                    }
                    placeholder="e.g., M, L, XL"
                    className="flex items-center w-full h-[60px] pt-[21px] pb-[21px] pl-[21px] rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white placeholder:text-[rgba(45,45,45,0.50)] font-dm-sans"
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="flex justify-center items-center w-[48px] h-[48px] rounded-[12px] bg-[#032817] shrink-0 cursor-pointer"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 4v12M4 10h12"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {formData.sizeOptions.length > 0 && (
                <div className="flex flex-wrap w-full gap-2">
                  {formData.sizeOptions.map((size, index) => (
                    <div
                      key={index}
                      className="flex justify-center items-center h-[32px] px-[14px] py-[2px] gap-[8px] rounded-full border-[0.67px] border-[#0A0A0A] bg-white"
                    >
                      <p className="text-[#2D2D2D] font-normal text-xs leading-[14px] font-dm-sans">
                        {size}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(index)}
                        className="flex items-center justify-center w-[14px] h-[14px] rounded-full bg-[#ECECF0] cursor-pointer"
                      >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path
                            d="M1.5 1.5l5 5M6.5 1.5l-5 5"
                            stroke="#0A0A0A"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Color Options */}
            <div className="flex flex-col w-full gap-2">
              <div className="flex flex-col w-full items-start gap-1.5">
                <label className="text-[#2D2D2D] font-medium text-base leading-[18px] font-dm-sans-500">
                  Color Options (Optional)
                </label>
                <div className="flex w-full gap-2 items-center">
                  <input
                    type="text"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddColor())
                    }
                    placeholder="e.g., Red, Blue, Black"
                    className="flex items-center w-full h-[60px] pt-[21px] pb-[21px] pl-[21px] rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white placeholder:text-[rgba(45,45,45,0.50)] font-dm-sans"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="flex justify-center items-center w-[48px] h-[48px] rounded-[12px] bg-[#032817] shrink-0 cursor-pointer"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 4v12M4 10h12"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {formData.color.length > 0 && (
                <div className="flex flex-col w-full gap-3">
                  {formData.color.map((clr, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-[12px] border border-[#D1D5DC] bg-[#FAFAFA]"
                    >
                      <div className="flex justify-center items-center h-[32px] px-[14px] gap-[8px] rounded-full border-[0.67px] border-[#0A0A0A] bg-white shrink-0">
                        <p className="text-[#2D2D2D] font-normal text-xs leading-[14px] font-dm-sans">
                          {clr}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(index)}
                          className="flex items-center justify-center w-[14px] h-[14px] rounded-full bg-[#ECECF0] cursor-pointer"
                        >
                          <svg
                            width="8"
                            height="8"
                            viewBox="0 0 8 8"
                            fill="none"
                          >
                            <path
                              d="M1.5 1.5l5 5M6.5 1.5l-5 5"
                              stroke="#0A0A0A"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        {colorImagePreviews[clr] ? (
                          <img
                            src={colorImagePreviews[clr]}
                            alt={clr}
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="#9CA3AF"
                            >
                              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                            </svg>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleColorImageUpload(clr, e)}
                          className="hidden"
                          ref={(el) => (colorFileInputRef.current[clr] = el)}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            colorFileInputRef.current[clr]?.click()
                          }
                          className="text-[#032817] font-dm-sans-500 text-xs underline cursor-pointer"
                        >
                          {colorImagePreviews[clr]
                            ? "Change"
                            : "Add image for " + clr}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Featured */}
            <div className="flex w-full items-center gap-2">
              <div
                onClick={() => handleChange("isFeatured", !formData.isFeatured)}
                className={`flex justify-center items-center w-[20px] h-[20px] aspect-square rounded-[4px] border cursor-pointer transition-colors ${formData.isFeatured ? "bg-[#032817] border-[#032817]" : "border-[rgba(3,40,23,0.35)] bg-[rgba(3,40,23,0.15)]"}`}
              >
                {formData.isFeatured && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <p className="text-[#2D2D2D] font-semibold text-base leading-[18px] font-dm-sans-700">
                Mark as Featured Product
              </p>
            </div>

            <div className="w-full h-[1px] bg-[#D1D5DC] mt-4"></div>

            {/* Actions */}
            <div className="flex gap-1">
              <button
                onClick={() => navigate("/products")}
                className="flex flex-col justify-center items-center px-[20px] h-[60px] rounded-[14px] bg-[#ECECF0] cursor-pointer"
              >
                <p className="text-black font-medium text-base leading-[18px] font-clash-grotesk">
                  Cancel
                </p>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex flex-col justify-center items-center px-[20px] h-[60px] gap-[10px] rounded-[12px] border border-white bg-[#16CB5E] disabled:opacity-60 cursor-pointer"
              >
                <p className="text-white font-medium text-base leading-[18px] font-clash-grotesk">
                  {isSaving ? "Saving..." : "Save Product"}
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
