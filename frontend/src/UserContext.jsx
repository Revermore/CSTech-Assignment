import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // stores user object (name, role, id, etc.)
  const [token, setToken] = useState(null); // stores JWT token
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    try {
      if (savedUser && savedToken) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && typeof parsedUser === "object") {
          setUser(parsedUser);
          setToken(savedToken);
        }
      }
    } catch (err) {
      console.error("⚠️ Invalid JSON in localStorage[user]:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  const isAdmin = user?.role === "admin";
  const isAgent = user?.role === "agent";

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        token,
        login,
        logout,
        isAdmin,
        isAgent,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
