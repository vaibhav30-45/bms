import api from "./axiosInstance";

export const createAddress = (data) => api.post("/api/addresses", data);

export const getAddresses = () => api.get("/api/addresses");

export const getAddressById = (id) => api.get(`/api/addresses/${id}`);

export const updateAddress = (id, data) =>
  api.put(`/api/addresses/${id}`, data);
