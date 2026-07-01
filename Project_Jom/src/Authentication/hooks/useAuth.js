export function useAuth() {
  const API_BASE_URL =
    import.meta.env.VITE_AUTH_API_URL ||
    "https://9pidtz8z27.execute-api.us-east-1.amazonaws.com/auth";

  const persistSession = (data) => {
    localStorage.setItem("sessionToken", data.sessionToken);
    localStorage.setItem("userId", data.user?.userId || data.user?.id || "");
    localStorage.setItem("isLoggedIn", "true");

    localStorage.setItem("user", JSON.stringify(data.user || {}));

    localStorage.setItem(
      "cachedProfile",
      JSON.stringify({
        displayName:
          data.user?.displayName ||
          data.user?.name ||
          data.profile?.displayName ||
          data.profile?.identity?.name ||
          "Demo Resident",
        ...data.profile,
      })
    );

    localStorage.setItem("profile", JSON.stringify(data.profile || {}));
  };

  const requestAuth = async (path, body) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Authentication failed");
    }

    return data;
  };

  const login = async (credentials) => {
    if (credentials && typeof credentials === "object" && (credentials.email || credentials.password)) {
      const data = await requestAuth("/login", credentials);
      persistSession(data);
      return data;
    }

    const demoResidentId = typeof credentials === "string" ? credentials : credentials?.demoResidentId;
    const data = await requestAuth("/demo-login", { demoResidentId });
    persistSession(data);
    return data;
  };

  const register = async (credentials) => {
    const data = await requestAuth("/register", credentials);
    persistSession(data);
    return data;
  };

  const logout = () => {
    const language = localStorage.getItem("i18nextLng");

    localStorage.clear();

    if (language) {
      localStorage.setItem("i18nextLng", language);
    }

    window.location.href = "/";
  };

  return { login, register, logout };
}