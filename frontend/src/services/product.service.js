import api from "../api/axios.js";

// ── GET all products (optional brand filter) ─────────────────────
export const fetchProducts = async (brand = null) => {
  const params = brand ? { brand } : {};
  const res = await api.get("/products", { params });
  return res.data.products;
};

// ── GET single product ───────────────────────────────────────────
export const fetchProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data.product;
};
