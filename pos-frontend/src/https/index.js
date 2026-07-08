import { axiosWrapper } from "./axiosWrapper";

// API Endpoints

// Auth Endpoints
export const login = (data) => axiosWrapper.post("/api/user/login", data);
export const register = (data) => axiosWrapper.post("/api/user/register", data);
export const getUserData = () => axiosWrapper.get("/api/user");
export const logout = () => axiosWrapper.post("/api/user/logout");

// Staff Endpoints
export const getAllStaff = () => axiosWrapper.get("/api/user/staff");
export const deleteStaff = (id) => axiosWrapper.delete(`/api/user/staff/${id}`);
export const resetStaffPassword = (id, password) => axiosWrapper.put(`/api/user/staff/${id}/password`, { password });

// Table Endpoints
export const addTable = (data) => axiosWrapper.post("/api/table/", data);
export const getTables = () => axiosWrapper.get("/api/table");
export const updateTable = ({ tableId, ...tableData }) =>
  axiosWrapper.put(`/api/table/${tableId}`, tableData);

// Payment Endpoints
export const createOrderRazorpay = (data) =>
  axiosWrapper.post("/api/payment/create-order", data);
export const verifyPaymentRazorpay = (data) =>
  axiosWrapper.post("/api/payment//verify-payment", data);

// Order Endpoints
export const addOrder = (data) => axiosWrapper.post("/api/order/", data);
export const getOrders = () => axiosWrapper.get("/api/order");
export const updateOrderStatus = ({ orderId, orderStatus }) =>
  axiosWrapper.put(`/api/order/${orderId}`, { orderStatus });
export const updateOrderById = (orderId, orderData) =>
  axiosWrapper.put(`/api/order/${orderId}`, orderData);

// Menu Catalog Endpoints
export const addCategory = (data) => axiosWrapper.post("/api/category/", data);
export const getCategories = () => axiosWrapper.get("/api/category");
export const addProduct = (data) => axiosWrapper.post("/api/product/", data);
export const getProducts = () => axiosWrapper.get("/api/product");

// Settings Endpoints
export const getSettings = () => axiosWrapper.get("/api/settings");
export const updateSettings = (data) => axiosWrapper.put("/api/settings", data);
