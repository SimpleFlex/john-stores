import api from "../api/axios.js";

// ════════════════════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════════════════════

export const getDashboardStats = async (filter = "Last 30 Days") => {
  const res = await api.get("/dashboard", { params: { filter } });
  return res.data.data;
};

// ════════════════════════════════════════════════════════════
// PRODUCTS
// ════════════════════════════════════════════════════════════

export const fetchProducts = async (params = {}) => {
  const res = await api.get("/products", { params });
  return res.data;
};

export const fetchProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data.product;
};

export const createProduct = async (formData) => {
  const res = await api.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.product;
};

export const updateProduct = async (id, formData) => {
  const res = await api.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.product;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

// ════════════════════════════════════════════════════════════
// CATEGORIES
// ════════════════════════════════════════════════════════════

export const fetchCategories = async () => {
  const res = await api.get("/categories");
  return res.data.categories;
};

export const createCategory = async (data) => {
  const res = await api.post("/categories", data);
  return res.data.category;
};

export const updateCategory = async (id, data) => {
  const res = await api.put(`/categories/${id}`, data);
  return res.data.category;
};

export const deleteCategory = async (id) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};

// ════════════════════════════════════════════════════════════
// ORDERS
// ════════════════════════════════════════════════════════════

export const fetchOrders = async (params = {}) => {
  const res = await api.get("/orders", { params });
  return res.data;
};

export const fetchOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data.order;
};

export const markOrderPaid = async (id) => {
  const res = await api.put(`/orders/${id}/payment`, {
    paymentStatus: "Paid",
  });
  return res.data.order;
};

export const completeOrder = async (id) => {
  const res = await api.put(`/orders/${id}/complete`);
  return res.data.order;
};

export const updateOrderStatus = async (id, orderStatus) => {
  const res = await api.put(`/orders/${id}/status`, { orderStatus });
  return res.data.order;
};

export const updatePaymentStatus = async (id, paymentStatus) => {
  const res = await api.put(`/orders/${id}/payment`, { paymentStatus });
  return res.data.order;
};

export const deleteOrder = async (id) => {
  const res = await api.delete(`/orders/${id}`);
  return res.data;
};

// ════════════════════════════════════════════════════════════
// ANALYTICS
// ════════════════════════════════════════════════════════════

export const getAnalyticsSummary = async (range = "7days") => {
  const res = await api.get("/analytics/summary", { params: { range } });
  return res.data.data;
};

export const getRevenueChart = async (range = "7days") => {
  const res = await api.get("/analytics/revenue", { params: { range } });
  return res.data.data;
};

export const getCategoryDistribution = async () => {
  const res = await api.get("/analytics/categories");
  return res.data.data;
};

export const getBrandPerformance = async (range = "7days") => {
  const res = await api.get("/analytics/brands", { params: { range } });
  return res.data.data;
};

// ════════════════════════════════════════════════════════════
// EASY MEDIA
// ════════════════════════════════════════════════════════════

export const fetchEmails = async () => {
  const res = await api.get("/easymedia");
  return res.data;
};

export const deleteEmail = async (id) => {
  const res = await api.delete(`/easymedia/${id}`);
  return res.data;
};

// ════════════════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════════════════

export const updateProfile = async (formData) => {
  const res = await api.put("/auth/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updatePassword = async (currentPassword, newPassword) => {
  const res = await api.put("/auth/update-password", {
    currentPassword,
    newPassword,
  });
  return res.data;
};

export const updateEmail = async (newEmail, currentPassword) => {
  const res = await api.put("/auth/update-email", {
    newEmail,
    currentPassword,
  });
  return res.data;
};

export const fetchAllAdmins = async () => {
  const res = await api.get("/auth/admins");
  return res.data.admins;
};

// ════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ════════════════════════════════════════════════════════════

export const fetchNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data;
};

export const markNotificationRead = async (id) => {
  const res = await api.put(`/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsRead = async () => {
  const res = await api.put("/notifications/read-all");
  return res.data;
};
