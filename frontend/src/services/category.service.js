import api from "../api/axios.js";

// ── GET all categories ───────────────────────────────────────────
export const fetchCategories = async () => {
  const res = await api.get("/categories");
  // ── Debug: log the raw response so you can confirm the key name
  console.log("[category.service] fetchCategories raw res.data:", res.data);
  // ── Safety: support both { categories: [...] } and { data: [...] } shapes
  return res.data.categories ?? res.data.data ?? res.data;
};
