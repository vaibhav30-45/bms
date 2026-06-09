import api from "./axiosInstance";

export const registerUser = (data) => {
  const cleanedData = {
    ...data,
    phoneNumber: data.phoneNumber
      ? data.phoneNumber.replace("+91", "").trim()
      : data.phoneNumber,
  };

  return api.post("/api/users/register", cleanedData);
};

export const loginUser = (data) => api.post("/api/auth/login", data);
