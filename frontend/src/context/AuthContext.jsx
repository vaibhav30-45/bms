import { createContext, useContext, useState } from "react";

export const AuthContext = createContext(null); // named export added

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("bms-token");
    const role = localStorage.getItem("bms-role");
    const userId = localStorage.getItem("bms-userId");
    const firstName = localStorage.getItem("bms-firstName");
    return token ? { token, role, userId, firstName } : null;
  });

  const login = (data) => {
    localStorage.setItem("bms-token", data.token);
    localStorage.setItem("bms-role", data.role);
    localStorage.setItem("bms-userId", String(data.userId));
    localStorage.setItem("bms-firstName", data.firstName);
    setAuth({
      token: data.token,
      role: data.role,
      userId: data.userId,
      firstName: data.firstName,
    });
  };

  const logout = () => {
    ["bms-token", "bms-role", "bms-userId", "bms-firstName"].forEach((k) =>
      localStorage.removeItem(k),
    );
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
