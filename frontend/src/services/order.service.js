import api from "../api/axios.js";

// ── POST create order ─────────────────────────────────────────────
// Called after WhatsApp redirect — saves order to DB
export const createOrder = async (orderData) => {
  const res = await api.post("/orders", orderData);
  return res.data.order;
};
