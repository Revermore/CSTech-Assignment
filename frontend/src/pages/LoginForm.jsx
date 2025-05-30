import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../UserContext.jsx";

const LoginForm = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const url =
        role === "admin"
          ? "http://localhost:5000/admin/login"
          : "http://localhost:5000/agent/login";
      const data = role === "admin" ? { email, password } : { name, password };

      const res = await axios.post(url, data);
      login({ ...res.data.result, role }, res.data.token);
      toast.success(`Logged in successfully as ${role}!`);
      if (role == "admin") {
        navigate("/dashboard");
      } else {
        navigate("/agent-dashboard");
      }
    } catch (err) {
      toast.error("❌ Login failed: " + err.response?.data?.message);
    }
  };

  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        className="card shadow-lg border-0 p-4"
        style={{ minWidth: "320px", maxWidth: "420px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Welcome!</h2>
          <p className="text-muted">Please login to your account</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="d-flex justify-content-center gap-4 mb-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="role"
                id="adminRadio"
                value="admin"
                checked={role === "admin"}
                onChange={() => setRole("admin")}
              />
              <label
                className="form-check-label fw-medium"
                htmlFor="adminRadio"
              >
                Admin
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="role"
                id="agentRadio"
                value="agent"
                checked={role === "agent"}
                onChange={() => setRole("agent")}
              />
              <label
                className="form-check-label fw-medium"
                htmlFor="agentRadio"
              >
                Agent
              </label>
            </div>
          </div>

          <div className="mb-3">
            {role === "admin" ? (
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="Email address"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            ) : (
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Agent name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            )}
          </div>

          <div className="mb-4">
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-100 mb-3">
            Login
          </button>

          <div className="text-center mt-3">
            <p className="text-muted mb-0">
              Don't have an account?{" "}
              <Link to="/signup" className="text-decoration-none">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
