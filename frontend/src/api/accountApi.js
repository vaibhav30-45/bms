import api from "./axiosInstance";

export const createSavingsAccount = (data) =>
  api.post("/api/accounts/savings", data);

export const createCurrentAccount = (data) =>
  api.post("/api/accounts/current", data);

export const getAccountById = (id) => api.get(`/api/accounts/${id}`);

export const getMyAccounts = () => api.get("/api/accounts/my-accounts");

// Admin account APIs 
export const adminGetAllAccounts = () => api.get("/api/admin/accounts");
 
export const adminGetAccountById = (accountId) =>
  api.get(`/api/admin/accounts/${accountId}`);
 
export const adminGetAllSavingsAccounts = () =>
  api.get("/api/admin/accounts/savings");
 
export const adminGetAllCurrentAccounts = () =>
  api.get("/api/admin/accounts/current");