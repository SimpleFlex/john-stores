import { useState, useEffect } from "react";
import AddCategory from "../components/AddCategory";
import DeleteCategory from "../components/DeleteCategory";
import UpdateCategory from "../components/UpdateCategory";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/api.service.js";

// ── Helper — always returns the correct icon ─────────────────────
const getBrandIcon = (brand) => {
  if (!brand) return "/john-stores.svg";
  const lower = brand.toLowerCase();
  if (lower.includes("swift")) return "/swift-log.svg";
  return "/john-stores.svg";
};

const getBrandName = (brand) => {
  if (!brand) return "John's Stores";
  const lower = brand.toLowerCase();
  if (lower.includes("swift")) return "Swift Logistics";
  return "John's Stores";
};

const Category = () => {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showDeleteCategory, setShowDeleteCategory] = useState(false);
  const [showUpdateCategory, setShowUpdateCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (formData) => {
    setIsLoading(true);
    try {
      const newCategory = await createCategory({
        name: formData.categoryName,
        brand: formData.brand,
      });
      setCategories((prev) => [...prev, newCategory]);
      setShowAddCategory(false);
    } catch (error) {
      console.error("Failed to add category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCategory = async (formData) => {
    if (!selectedCategory) return;
    setIsLoading(true);
    try {
      const updated = await updateCategory(selectedCategory._id, {
        name: formData.categoryName,
        brand: formData.brand,
      });
      // ── Update local state immediately so UI reflects change ───
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === selectedCategory._id
            ? { ...cat, name: formData.categoryName, brand: formData.brand }
            : cat,
        ),
      );
      setShowUpdateCategory(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Failed to update category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    setIsLoading(true);
    try {
      await deleteCategory(selectedCategory._id);
      setCategories((prev) =>
        prev.filter((cat) => cat._id !== selectedCategory._id),
      );
      setShowDeleteCategory(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* body */}
      <div className="flex flex-col justify-end items-center w-full pt-[25px] pb-[14px] px-[15px] gap-5 rounded-[25px] border border-[rgba(107,107,107,0.15)] bg-white">
        <div className="flex w-full justify-between items-center px-1">
          <p className="text-[#717182] font-medium text-base leading-[25px] tracking-[-0.2px] capitalize font-dm-sans-500">
            Manage Products Categories <br /> Both Brands Here
          </p>
          <button
            onClick={() => setShowAddCategory(true)}
            className="flex justify-center items-center px-6 h-[45px] gap-2 rounded-[10px] bg-[#032817] cursor-pointer"
          >
            <img src="/addition.svg" alt="" />
            <p className="text-white text-center font-medium text-sm leading-[20px] font-dm-sans-500">
              Add Category
            </p>
          </button>
        </div>

        {/* Table Header */}
        <div className="flex px-[15px] w-full justify-between items-center bg-white">
          <div className="flex w-full justify-between items-start">
            <div className="flex items-center w-[137px] h-[65px] px-[2px]">
              <p className="text-[#717182] font-medium text-[14px] leading-[14px] font-clash-grotesk">
                Category Name
              </p>
            </div>
            <div className="flex items-center w-[134px] h-[65px] px-[2px]">
              <p className="text-[#717182] font-medium text-[14px] leading-[14px] font-clash-grotesk">
                Brand
              </p>
            </div>
            <div className="flex items-center w-[98px] h-[65px] px-[2px]">
              <p className="text-[#717182] font-medium text-[14px] leading-[14px] font-clash-grotesk">
                Actions
              </p>
            </div>
          </div>
        </div>

        {/* Table Rows */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-[#032817] border-t-transparent animate-spin" />
              <p className="text-[#717182] font-dm-sans-500 text-sm">
                Loading categories...
              </p>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex justify-center py-10">
            <p className="text-[#717182] font-dm-sans-500 text-sm">
              No categories found
            </p>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category._id}
              className="flex px-[15px] w-full justify-between items-center bg-white border-b border-[#F3F4F6] pb-2"
            >
              <div className="flex w-full justify-between items-start">
                {/* Category Name */}
                <div className="flex items-center w-[137px] h-[65px] px-[2px]">
                  <p className="text-[#717182] font-medium text-[14px] leading-[14px] font-clash-grotesk">
                    {category.name}
                  </p>
                </div>

                {/* Brand — uses helper so icon is always correct */}
                <div className="flex items-center w-[134px] h-[65px] px-[2px]">
                  <div className="flex gap-1.5 items-center">
                    <img
                      src={getBrandIcon(category.brand)}
                      alt={getBrandName(category.brand)}
                      className="w-4 h-4"
                    />
                    <p className="text-[#717182] font-medium text-[14px] leading-[14px] font-clash-grotesk">
                      {getBrandName(category.brand)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center w-[98px] gap-1 h-[65px] px-[2px]">
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowUpdateCategory(true);
                    }}
                    className="flex flex-col items-start w-[32px] h-[32px] pt-[8px] px-[8px] rounded-[12px] shrink-0 cursor-pointer"
                  >
                    <img src="/write.svg" alt="Edit" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowDeleteCategory(true);
                    }}
                    className="flex flex-col items-start w-[32px] h-[32px] pt-[8px] px-[8px] rounded-[12px] shrink-0 cursor-pointer"
                  >
                    <img src="/delete.svg" alt="Delete" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddCategory && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={() => setShowAddCategory(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <AddCategory
              onClose={() => setShowAddCategory(false)}
              onSubmit={handleAddCategory}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteCategory && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={() => setShowDeleteCategory(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <DeleteCategory
              onClose={() => {
                setShowDeleteCategory(false);
                setSelectedCategory(null);
              }}
              onConfirm={handleDeleteCategory}
              isLoading={isLoading}
              categoryName={selectedCategory?.name}
            />
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateCategory && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={() => setShowUpdateCategory(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <UpdateCategory
              onClose={() => {
                setShowUpdateCategory(false);
                setSelectedCategory(null);
              }}
              onSubmit={handleUpdateCategory}
              initialData={{
                name: selectedCategory?.name,
                brand: selectedCategory?.brand,
              }}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
