import api from "../api/axios.js";

// ── POST create order ─────────────────────────────────────────────
// Called after WhatsApp redirect — saves order to DB
export const createOrder = async (orderData) => {
  const res = await api.post("/orders", orderData);
  // ── Debug: log the raw response so you can confirm the key name
  console.log("[order.service] createOrder raw res.data:", res.data);
  // ── Safety: support both { order: {...} } and { data: {...} } shapes
  return res.data.order ?? res.data.data ?? res.data;
};
