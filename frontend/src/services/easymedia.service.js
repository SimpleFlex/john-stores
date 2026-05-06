import api from "../api/axios.js";

// ── POST add email to early access list ─────────────────────────
export const addEasyMediaEmail = async (data) => {
  const res = await api.post("/easymedia", data);
  return res.data;
};
