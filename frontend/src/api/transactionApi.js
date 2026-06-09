import api from "./axiosInstance";

//  Deposit Slot
export const assignDepositSlot = (data) =>
  api.post("/deposit-slot/assign", data);

export const assignWithdrawSlot = (data) =>
  api.post("/deposit-slot/assign", data);

// ── Transfer ──
export const transfer = (data) =>
  api.post("/api/v1/transactions/transfer", data);

export const verifyAccount = (accountNumber) =>
  api.get("/api/v1/transactions/verify-account", { params: { accountNumber } });

export const getStatement = (data) =>
  api.post("/api/v1/transactions/statement", data);
