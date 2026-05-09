import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DeleteProduct from "../components/DeleteProduct";
import { fetchProducts, deleteProduct } from "../services/api.service.js";

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDelete, setShowDelete] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (location.state?.updatedProduct) {
      const updated = location.state.updatedProduct;
      setProducts((prev) =>
        prev.map((p) =>
          p.id === String(updated.id)
            ? {
                ...p,
                name: updated.productName,
                brand: updated.brand,
                category: updated.category?.name || updated.category,
                price: Number(updated.price),
                stock: Number(updated.stockQuantity),
                status:
                  Number(updated.stockQuantity) > 0
                    ? "In Stock"
                    : "Out of Stock",
              }
            : p,
        ),
      );
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      const normalized = data.products.map((p) => {
        const firstColorImage =
          p.colorImages instanceof Map
            ? Array.from(p.colorImages.values())[0]
            : p.colorImages && typeof p.colorImages === "object"
              ? Object.values(p.colorImages)[0]
              : null;

        return {
          id: p._id,
          image: p.images?.[0]?.url || p.images?.[0] || firstColorImage || null,
          name: p.productName,
          brand: p.brand,
          brandIcon:
            p.brand === "John's Stores" ? "/john-stores.svg" : "/swift-log.svg",
          category: p.category?.name || p.category || "-",
          price: p.price,
          stock: p.stockQuantity,
          status: p.status,
        };
      });
      setProducts(normalized);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    setIsDeleting(true);
    try {
      await deleteProduct(selectedProduct.id);
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
      setShowDelete(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusStyle = (status) => {
    return status === "In Stock"
      ? "bg-[#DCFCE7] text-[#008236]"
      : "bg-[#FFE2E2] text-[#C10007]";
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col justify-end items-center w-full pt-[25px] pb-[14px] px-[15px] gap-5 rounded-[25px] border border-[rgba(107,107,107,0.15)] bg-white">
        {/* Top bar */}
        <div className="flex w-full justify-between items-center px-1 gap-3">
          <p className="text-[#717182] font-medium text-sm lg:text-base leading-[25px] tracking-[-0.2px] capitalize font-dm-sans-500">
            Manage Products For Both Brands Here
          </p>
          <div
            onClick={() => navigate("/products/new")}
            className="flex justify-center items-center px-4 lg:px-6 h-[45px] gap-[3px] rounded-[10px] bg-[#032817] cursor-pointer shrink-0"
          >
            <img src="/addition.svg" alt="" />
            <p className="text-white text-center font-medium text-xs lg:text-sm leading-[20px] font-dm-sans-500">
              Add New Product
            </p>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="min-w-[786px]">
            {/* Header row */}
            <div className="flex items-center gap-[24px] px-1 mb-1">
              {[
                { label: "Product image", width: "w-[97px]" },
                { label: "Product Name", width: "w-[160px]" },
                { label: "Brand", width: "w-[120px]" },
                { label: "Category", width: "w-[110px]" },
                { label: "Price", width: "w-[80px]" },
                { label: "Stock", width: "w-[70px]" },
                { label: "Status", width: "w-[90px]" },
                { label: "Actions", width: "w-[90px]" },
              ].map((header, idx) => (
                <div
                  key={idx}
                  className={`flex items-center ${header.width} h-[65px] px-[2px] shrink-0`}
                >
                  <p className="text-[#717182] font-medium text-xs leading-[14px] font-clash-grotesk">
                    {header.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Body */}
            {loading ? (
              <div className="flex justify-center py-10 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full border-2 border-[#032817] border-t-transparent animate-spin" />
                  <p className="text-[#717182] font-dm-sans-500 text-sm">
                    Loading products...
                  </p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="flex justify-center py-10 px-1">
                <p className="text-[#717182] font-dm-sans-500 text-sm">
                  No products found
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 px-1">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-[24px] border-b border-[#D1D5DC] pb-3"
                  >
                    {/* Image */}
                    <div className="flex items-center w-[97px] h-[65px] px-[2px] shrink-0">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-[60px] h-[60px] object-cover rounded"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="w-[60px] h-[60px] rounded bg-[#F3F4F6] items-center justify-center"
                        style={{ display: product.image ? "none" : "flex" }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <rect width="24" height="24" rx="4" fill="#E5E7EB" />
                          <path d="M4 15l4-4 3 3 4-5 5 6H4z" fill="#9CA3AF" />
                          <circle cx="8.5" cy="8.5" r="1.5" fill="#9CA3AF" />
                        </svg>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="flex items-center w-[160px] h-[65px] px-[2px] shrink-0">
                      <p className="text-[#717182] font-medium text-xs leading-[14px] font-clash-grotesk break-words">
                        {product.name}
                      </p>
                    </div>

                    {/* Brand */}
                    <div className="flex items-center w-[120px] h-[65px] px-[2px] shrink-0">
                      <div className="flex items-center gap-1">
                        <img
                          src={product.brandIcon}
                          alt=""
                          className="w-4 h-4 shrink-0"
                        />
                        <p className="text-[#717182] font-medium text-xs leading-[14px] font-clash-grotesk">
                          {product.brand}
                        </p>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="flex items-center w-[110px] h-[65px] px-[2px] shrink-0">
                      <p className="text-[#717182] font-medium text-xs leading-[14px] font-clash-grotesk break-words">
                        {product.category}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="flex items-center w-[80px] h-[65px] px-[2px] shrink-0">
                      <p className="text-[#717182] font-medium text-xs leading-[14px] font-clash-grotesk">
                        ₦{product.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Stock */}
                    <div className="flex items-center w-[70px] h-[65px] px-[2px] shrink-0">
                      <p className="text-[#717182] font-medium text-xs leading-[14px] font-clash-grotesk">
                        {product.stock}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="flex items-center w-[90px] h-[65px] px-[2px] shrink-0">
                      <div
                        className={`flex justify-center items-center px-[8px] h-[24px] shrink-0 rounded-[4px] ${getStatusStyle(product.status)}`}
                      >
                        <p className="font-medium text-xs leading-[14px] tracking-[-0.5px] font-dm-sans-500 whitespace-nowrap">
                          {product.status}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center w-[90px] h-[65px] px-[2px] shrink-0">
                      <div className="flex items-center gap-[8px]">
                        <button
                          onClick={() =>
                            navigate(`/products/edit/${product.id}`)
                          }
                          className="flex justify-center items-center w-[32px] h-[32px] rounded-[12px] cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <img src="/write.svg" alt="Edit" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowDelete(true);
                          }}
                          className="flex justify-center items-center w-[32px] h-[32px] rounded-[12px] cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <img src="/delete.svg" alt="Delete" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDelete && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div onClick={(e) => e.stopPropagation()}>
            <DeleteProduct
              onClose={() => {
                setShowDelete(false);
                setSelectedProduct(null);
              }}
              onConfirm={handleDeleteProduct}
              isLoading={isDeleting}
              productName={selectedProduct.name}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
