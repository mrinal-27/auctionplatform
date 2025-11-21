import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PostAuction from "./pages/PostAuction";
import Watchlist from "./pages/Watchlist";
import API from "./api";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoadingUser(false);
      return;
    }

    API.get("/auth/me")
      .then(res => {
        const u = res.data.user;
        setUser({
          id: u._id,
          name: u.name,
          email: u.email
        });
      })
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoadingUser(false));
  }, []);

  const handleAuth = (u, token) => {
    localStorage.setItem("token", token);

    setUser({
      id: u._id,
      name: u.name,
      email: u.email
    });

    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/auth");
  };

  if (loadingUser) return <p>Loading...</p>;

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/auth" element={<Auth onAuth={handleAuth} />} />

      <Route path="/dashboard"
        element={<Dashboard user={user} onLogout={handleLogout} />}
      />

      <Route path="/post-auction"
        element={<PostAuction user={user} />}
      />

      <Route path="/watchlist"
        element={<Watchlist user={user} />}
      />
    </Routes>
  );
}

export default App;
