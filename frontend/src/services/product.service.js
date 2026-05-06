import api from "../api/axios.js";

// ── GET all products ─────────────────────────────────────
export const fetchProducts = async () => {
  const res = await api.get("/products");
  return res.data.products;
};

// ── GET featured products ────────────────────────────────
export const fetchFeaturedProducts = async () => {
  const res = await api.get("/products", { params: { isFeatured: true } });
  return res.data.products;
};

// ── GET single product ───────────────────────────────────
export const fetchProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data.product ?? res.data.data ?? res.data;
};
