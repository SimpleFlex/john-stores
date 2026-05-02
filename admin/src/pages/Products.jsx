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

  // ── Apply updated product from EditProduct navigation state ──────
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
      const normalized = data.products.map((p) => ({
        id: p._id,
        image: p.images?.[0]?.url || "/api/placeholder/60/60",
        name: p.productName,
        brand: p.brand,
        brandIcon:
          p.brand === "John's Stores" ? "/john-stores.svg" : "/swift-log.svg",
        category: p.category?.name || p.category || "-",
        price: p.price,
        stock: p.stockQuantity,
        status: p.status,
      }));
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
      {/* body */}
      <div className="flex flex-col justify-end items-center w-full pt-[25px] pb-[14px] px-[15px] gap-5 rounded-[25px] border border-[rgba(107,107,107,0.15)] bg-white">
        <div className="flex w-full justify-between items-center px-1">
          <p className="text-[#717182] font-medium text-base leading-[25px] tracking-[-0.2px] capitalize font-dm-sans-500">
            Manage Products For <br /> Both Brands Here
          </p>
          <div
            onClick={() => navigate("/products/new")}
            className="flex justify-center items-center w-[178px] h-[45px] gap-[3px] rounded-[10px] bg-[#032817] cursor-pointer"
          >
            <img src="/addition.svg" alt="" />
            <p className="text-white text-center font-medium text-sm leading-[20px] font-dm-sans-500">
              Add New Product
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="flex flex-col px-1 items-center justify-end bg-white w-full">
          {/* Header */}
          <div className="flex items-start gap-[24px] w-full">
            {[
              "Product image",
              "Product Name",
              "Brand",
              "Category",
              "Price",
              "Stock",
              "Status",
              "Actions",
            ].map((header, idx) => (
              <div
                key={idx}
                className={`flex items-center ${
                  idx === 0
                    ? "w-[97px]"
                    : idx === 1
                      ? "w-[137px]"
                      : idx === 2
                        ? "w-[104px]"
                        : idx === 3
                          ? "w-[104px]"
                          : idx === 4
                            ? "w-[74px]"
                            : idx === 5
                              ? "w-[74px]"
                              : idx === 6
                                ? "w-[98px]"
                                : "w-[98px]"
                } h-[65px] px-[2px]`}
              >
                <p className="text-[#717182] font-medium text-xs leading-[14px] font-clash-grotesk">
                  {header}
                </p>
              </div>
            ))}
          </div>

          {/* Rows */}
          {loading ? (
            <div className="flex justify-center py-10 w-full">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border-2 border-[#032817] border-t-transparent animate-spin" />
                <p className="text-[#717182] font-dm-sans-500 text-sm">
                  Loading products...
                </p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex justify-center py-10 w-full">
              <p className="text-[#717182] font-dm-sans-500 text-sm">
                No products found
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-4 w-full">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-start gap-[24px] border-b border-[#D1D5DC] pb-3 w-full"
                >
                  <div className="flex items-center w-[97px] h-[65px] px-[2px]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-[60px] h-[60px] object-cover rounded"
                    />
                  </div>
                  <div className="flex items-center w-[137px] h-[65px] px-[2px]">
                    <p className="text-[#717182] font-medium text-xs leading-[14px] font-clash-grotesk">
                      {product.name}
                    </p>
                  </div>
                  <div className="flex items-center w-[104px] h-[65px] px-[2px]">
                    <div className="flex items-center gap-1">
                      <img src={product.brandIcon} alt="" className="w-4 h-4" />
                      <p className="text-[#717182] font-medium text-xs leading-[14px] font-clash-grotesk">
                        {product.brand}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center w-[104px] h-[65px] px-[2px]">
                    <p className="text-[#717182] font-medium text-xs leading-[14px] font-clash-grotesk">
                      {product.category}
                    </p>
                  </div>
                  <div className="flex items-center w-[74px] h-[65px] px-[2px]">
                    <p className="text-[#717182] font-medium text-xs leading-[14px] font-clash-grotesk">
                      ₦{product.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center w-[74px] h-[65px] px-[2px]">
                    <p className="text-[#717182] font-medium text-xs leading-[14px] font-clash-grotesk">
                      {product.stock}
                    </p>
                  </div>
                  <div className="flex items-center w-[98px] h-[65px] px-[2px]">
                    <div
                      className={`flex justify-center items-center px-[8px] h-[24px] shrink-0 rounded-[4px] ${getStatusStyle(product.status)}`}
                    >
                      <p className="font-medium text-xs leading-[14px] tracking-[-0.5px] font-dm-sans-500">
                        {product.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center w-[98px] h-[65px] px-[2px]">
                    <div className="flex items-center w-[72.021px] h-[32px] gap-[8px] shrink-0">
                      <button
                        onClick={() => navigate(`/products/edit/${product.id}`)}
                        className="flex flex-col items-start w-[32px] h-[32px] pt-[8px] px-[8px] rounded-[12px] shrink-0 cursor-pointer"
                      >
                        <img src="/write.svg" alt="Edit" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowDelete(true);
                        }}
                        className="flex flex-col items-start w-[32px] h-[32px] pt-[8px] px-[8px] rounded-[12px] shrink-0 cursor-pointer"
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

      {/* Delete Modal */}
      {showDelete && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
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
