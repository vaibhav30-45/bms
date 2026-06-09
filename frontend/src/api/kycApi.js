import api from "./axiosInstance";

export const submitKycInfo = (data) =>
  api.post("/api/v1/kyc/submit/info", data);

export const uploadKycDocument = (file) => {
  const form = new FormData();
  form.append("pdf", file);
  return api.post("/api/v1/kyc/submit/documents", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const uploadKycVideo = (file) => {
  const form = new FormData();
  form.append("video", file);
  return api.post("/api/v1/kyc/submit/video", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getKycStatus = () => api.get("/api/v1/kyc/status");
export const cancelKyc = () => api.delete("/api/v1/kyc/cancel");

// Admin
export const getPendingKyc = () => api.get("/api/v1/kyc/pending");
export const approveKyc = (id) => api.put(`/api/v1/kyc/approve/${id}`);
export const rejectKyc = (id) => api.put(`/api/v1/kyc/reject/${id}`);
