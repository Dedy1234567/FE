import { createContext, useContext, useEffect, useState } from "react";
import { getMe, logout as logoutService } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await getMe();
        setUser(response.data);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  // Panggil API logout → hapus cookie di server → reset user di context
  const logout = async () => {
    try {
      await logoutService();
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      // tetap lanjut logout meski API gagal
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}