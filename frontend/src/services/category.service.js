import api from "../api/axios.js";

// ── GET all categories ───────────────────────────────────────────
export const fetchCategories = async () => {
  const res = await api.get("/categories");
  return res.data.categories;
};
