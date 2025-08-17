import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import "./auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });

      // 🔍 normalize token field
      const token = res.data.token || res.data.jwtToken || res.data.accessToken;
      if (!token) {
        throw new Error("No token returned from server");
      }

      // Store token
      localStorage.setItem("token", token);

      // Store user info
      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: res.data.user?.userId,
          fullName: res.data.user?.fullName,
          email: res.data.user?.email,
          role: res.data.user?.role,
          token,
        })
      );

      navigate("/hotels");
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || err.message || "Login failed.");
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card card" onSubmit={submit}>
        <h2><center>Sign in</center></h2>
        <input
          className="a-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="a-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="a-btn" type="submit">
          Login
        </button>
        <div className="muted">
          New here? <Link to="/register">Create account</Link>
        </div>
      </form>
    </div>
  );
}
