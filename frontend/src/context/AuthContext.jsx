import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../config/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Auth error", err);
      localStorage.removeItem("token");
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password,
    });
    localStorage.setItem("token", res.data.token);
    await checkAuth();
  };

  const register = async (username, email, password, birthdate) => {
    const res = await axios.post(`${API_URL}/api/auth/register`, {
      username,
      email,
      password,
      birthdate,
    });
    localStorage.setItem("token", res.data.token);
    await checkAuth();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  const buyProduct = async (productId) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${API_URL}/api/products/buy/${productId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    await checkAuth();
    return res.data; // Includes ticketNumber
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, checkAuth, buyProduct }}
    >
      {children}
    </AuthContext.Provider>
  );
};
