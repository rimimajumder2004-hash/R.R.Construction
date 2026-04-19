import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api/services";

const AuthContext = createContext(null);

// ─── Fix ESLint error 2: export the hook from this const, not as a named export
// at the bottom so Fast Refresh sees only one component export from this file
const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ─── Fix ESLint error 1: initialise loading based on whether a session
  //     *might* exist — avoids synchronous setState inside the effect body.
  //     We can't read the httpOnly cookie from JS, so we always start as true
  //     and let getMe() resolve it either way.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ask the server if the cookie it holds is still valid
    authAPI
      .getMe()
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null)) // cookie missing, expired, or invalid
      .finally(() => setLoading(false));
    // No localStorage involved — the httpOnly cookie is sent automatically
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    // Server sets the httpOnly cookie — we just store the user object in state
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    await authAPI.logout(); // server clears the cookie
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isAdmin: user?.role === "admin" }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export { useAuth };
