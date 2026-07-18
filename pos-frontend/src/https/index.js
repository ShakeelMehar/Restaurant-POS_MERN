import { axiosWrapper } from "./axiosWrapper";

// API Endpoints

// Auth Endpoints
export const login = (data) => axiosWrapper.post("/api/user/login", data);
export const getUserData = () => axiosWrapper.get("/api/user");
export const logout = () => axiosWrapper.post("/api/user/logout");

// Staff Endpoints
export const getAllStaff = () => axiosWrapper.get("/api/user/staff");
export const createCashier = (data) => axiosWrapper.post("/api/user/staff", data);
export const deleteStaff = (id) => axiosWrapper.delete(`/api/user/staff/${id}`);
export const resetStaffPassword = (id, password) => axiosWrapper.put(`/api/user/staff/${id}/password`, { password });
export const updateStaff = (id, data) => axiosWrapper.put(`/api/user/staff/${id}`, data);


// Platform (Super Admin) Endpoints
export const getRestaurants = () => axiosWrapper.get("/api/admin/restaurants");
export const getRestaurant = (id) => axiosWrapper.get(`/api/admin/restaurants/${id}`);
export const createRestaurant = (data) => axiosWrapper.post("/api/admin/restaurants", data);
export const setRestaurantStatus = (id, isActive) =>
  axiosWrapper.patch(`/api/admin/restaurants/${id}/status`, { isActive });
export const resetRestaurantAdminPassword = (id, adminId) =>
  axiosWrapper.post(`/api/admin/restaurants/${id}/reset-admin-password`, { adminId });

// Payment Endpoints
export const createOrderRazorpay = (data) =>
  axiosWrapper.post("/api/payment/create-order", data);
export const verifyPaymentRazorpay = (data) =>
  axiosWrapper.post("/api/payment//verify-payment", data);

// Order Endpoints
export const addOrder = (data) => axiosWrapper.post("/api/order/", data);
export const getOrders = () => axiosWrapper.get("/api/order?page=1&limit=1000");
export const updateOrderStatus = ({ orderId, orderStatus }) =>
  axiosWrapper.put(`/api/order/${orderId}`, { orderStatus });
export const updateOrderById = (orderId, orderData) =>
  axiosWrapper.put(`/api/order/${orderId}`, orderData);

// Menu Catalog Endpoints
export const addCategory = (data) => axiosWrapper.post("/api/category/", data);
export const getCategories = () => axiosWrapper.get("/api/category");
export const deleteCategory = (id) => axiosWrapper.delete(`/api/category/${id}`);
export const addProduct = (data) => axiosWrapper.post("/api/product/", data);
export const getProducts = () => axiosWrapper.get("/api/product?page=1&limit=1000");
export const updateProduct = (id, data) => axiosWrapper.put(`/api/product/${id}`, data);
export const deleteProduct = (id) => axiosWrapper.delete(`/api/product/${id}`);

// Settings Endpoints
export const getSettings = () => axiosWrapper.get("/api/settings");
export const updateSettings = (data) => axiosWrapper.put("/api/settings", data);
