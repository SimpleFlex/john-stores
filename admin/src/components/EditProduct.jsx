import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchProductById,
  updateProduct,
  fetchCategories,
} from "../services/api.service.js";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    category: "",
    description: "",
    images: [],
    price: "",
    stockQuantity: "",
    sizeOptions: [],
    isFeatured: false,
  });

  const [categories, setCategories] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);

  const brands = ["John's Stores", "Swift Logistics"];

  useEffect(() => {
    const load = async () => {
      try {
        const [product, cats] = await Promise.all([
          fetchProductById(id),
          fetchCategories(),
        ]);
        setCategories(cats);
        if (product) {
          setFormData({
            productName: product.productName || "",
            brand: product.brand || "",
            category: product.category?._id || product.category || "",
            description: product.description || "",
            images:
              product.images?.map((img) => ({
                type: "url",
                value: img.url,
                public_id: img.public_id || "",
              })) || [],
            price: product.price || "",
            stockQuantity: product.stockQuantity || "",
            sizeOptions: product.sizeOptions || [],
            isFeatured: product.isFeatured || false,
          });
        }
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  // ── Submit ───────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Build payload — send as JSON (no file upload for now)
      const payload = {
        productName: formData.productName,
        brand: formData.brand,
        category: formData.category,
        description: formData.description,
        price: formData.price,
        stockQuantity: formData.stockQuantity,
        sizeOptions: JSON.stringify(formData.sizeOptions),
        isFeatured: String(formData.isFeatured),
        // URL images only
        imageUrls: JSON.stringify(
          formData.images
            .filter((img) => img.type === "url")
            .map((img) => img.value),
        ),
      };

      await updateProduct(id, payload);

      navigate("/products", {
        state: {
          updatedProduct: { id, ...formData },
        },
      });
    } catch (err) {
      console.error("Failed to update product:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryName = () => {
    const cat = categories.find((c) => c._id === formData.category);
    return cat?.name || "Select Category";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#032817] border-t-transparent animate-spin" />
          <p className="text-[#717182] font-dm-sans-500">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col justify-center items-start w-full p-3 rounded-[25px] border border-[rgba(107,107,107,0.15)] bg-white">
        <div className="flex items-center py-5 gap-2">
          <button
            onClick={() => navigate("/products")}
            className="flex flex-col justify-center items-center w-9 h-9 rounded-xl cursor-pointer"
          >
            <img src="/left-arrow.svg" alt="" />
          </button>
          <div className="flex flex-col items-start gap-2">
            <p className="text-[#2D2D2D] font-medium text-xl leading-4.5 tracking-[-0.2px] font-clash-grotesk">
              Edit Product
            </p>
            <p className="text-[#717182] font-medium text-sm leading-4 tracking-[-0.2px] capitalize font-dm-sans-500">
              Editing: {formData.productName}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex justify-center items-center w-full py-7.5 px-7.5 rounded-[18px] border border-[rgba(107,107,107,0.25)] bg-white"
        >
          <div className="flex flex-col w-full items-end shrink-0 gap-5">
            {/* Product Name */}
            <div className="flex flex-col w-full items-start gap-1.5">
              <label className="text-[#2D2D2D] font-medium text-base leading-4.5 font-dm-sans-500">
                Product Name
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => handleChange("productName", e.target.value)}
                placeholder="Enter product name"
                disabled={isLoading}
                className="flex items-center w-full h-15 pt-5.25 pb-5.25 pl-5.25 rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white placeholder:text-[rgba(45,45,45,0.50)] font-dm-sans disabled:opacity-50"
              />
            </div>

            {/* Brand Dropdown */}
            <div className="flex flex-col w-full items-start gap-1.5 relative">
              <p className="text-[#2D2D2D] font-medium text-base leading-4.5 font-dm-sans-500">
                Brand
              </p>
              <div
                onClick={() => setBrandOpen(!brandOpen)}
                className="flex justify-between w-full items-center px-5.25 py-4.75 rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white cursor-pointer"
              >
                <p className="text-[#2D2D2D] font-medium text-base font-dm-sans">
                  {formData.brand || "Select Brand"}
                </p>
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

            {/* Category Dropdown */}
            <div className="flex flex-col w-full items-start gap-1.5 relative">
              <p className="text-[#2D2D2D] font-medium text-base leading-4.5 font-dm-sans-500">
                Category
              </p>
              <div
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="flex justify-between w-full items-center px-5.25 py-4.75 rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white cursor-pointer"
              >
                <p className="text-[#2D2D2D] font-medium text-base font-dm-sans">
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
                  {categories.map((cat) => (
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
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col w-full items-start gap-1.5">
              <label className="text-[#2D2D2D] font-medium text-base leading-4.5 font-dm-sans-500">
                Product Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter product description..."
                disabled={isLoading}
                rows={4}
                className="flex items-center w-full pt-5.25 pb-15.25 pl-5.25 rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white placeholder:text-[rgba(45,45,45,0.50)] font-dm-sans disabled:opacity-50"
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
                <label className="text-[#2D2D2D] font-medium text-base leading-4.5 font-dm-sans-500">
                  Price (₦)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  placeholder="0"
                  disabled={isLoading}
                  className="flex items-center w-full h-[60px] pt-5.25 pb-5.25 pl-5.25 rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white font-dm-sans disabled:opacity-50"
                />
              </div>
              <div className="flex flex-col w-full items-start gap-1.5">
                <label className="text-[#2D2D2D] font-medium text-base leading-[18px] font-dm-sans-500">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) =>
                    handleChange("stockQuantity", e.target.value)
                  }
                  placeholder="0"
                  disabled={isLoading}
                  className="flex items-center w-full h-[60px] pt-[21px] pb-[21px] pl-[21px] rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white font-dm-sans disabled:opacity-50"
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
                    placeholder="e.g., M, L, XL — press Enter or +"
                    className="flex items-center w-full h-[60px] pt-[21px] pb-[21px] pl-[21px] rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white font-dm-sans"
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

            {/* Featured */}
            <div className="flex w-full items-center gap-2">
              <button
                type="button"
                onClick={() => handleChange("isFeatured", !formData.isFeatured)}
                className={`flex justify-center items-center w-[20px] h-[20px] aspect-square rounded-[4px] border border-[rgba(3,40,23,0.35)] transition-colors cursor-pointer ${formData.isFeatured ? "bg-[#032817]" : "bg-[rgba(3,40,23,0.15)]"}`}
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
              </button>
              <p className="text-[#2D2D2D] font-semibold text-base leading-[18px] font-dm-sans-700">
                Mark as Featured Product
              </p>
            </div>

            <div className="w-full h-[1px] bg-[#D1D5DC] mt-4"></div>

            {/* Actions */}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => navigate("/products")}
                disabled={isLoading}
                className="flex flex-col justify-center items-center px-[20px] h-[60px] rounded-[14px] bg-[#ECECF0] disabled:opacity-50 cursor-pointer"
              >
                <p className="text-black font-medium text-base leading-[18px] font-clash-grotesk">
                  Cancel
                </p>
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex flex-col justify-center items-center px-[20px] h-[60px] gap-[10px] rounded-[12px] border border-white bg-[#16CB5E] disabled:opacity-50 cursor-pointer"
              >
                <p className="text-white font-medium text-base leading-[18px] font-clash-grotesk">
                  {isLoading ? "Updating..." : "Update Product"}
                </p>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
