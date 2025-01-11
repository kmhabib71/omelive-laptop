import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

const backendUrl = "http://localhost:5000";
console.log("backendUrl: ", backendUrl);
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authUser, setAuthUser] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/auth/status`, {
          withCredentials: true,
        });
        console.log("respons :", response.data);
        setIsLoggedIn(response.data.isAuthenticated);
        setAuthUser(response.data.user);
      } catch (error) {
        console.log("Error fetching authenticated status: ", error);
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, []);
  const login = (user) => {
    setIsLoggedIn(true);
    setAuthUser(user);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setAuthUser(null);
  };
  return (
    <AuthContext.Provider
      value={{ isLoggedIn, authUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export { AuthContext };
