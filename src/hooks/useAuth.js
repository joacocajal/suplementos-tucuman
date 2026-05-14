import { useState, useEffect } from "react";

const SESSION_KEY = "admin_session";

export function useAuth() {
  const [session, setSession] = useState(() => {
    return sessionStorage.getItem(SESSION_KEY) === "true" ? true : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  async function signIn(email, password) {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    if (password === adminPassword) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setSession(true);
      return { error: null };
    }
    return { error: new Error("Credenciales incorrectas") };
  }

  async function signOut() {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  }

  return { session, loading, signIn, signOut };
}
