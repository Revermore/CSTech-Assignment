import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminSignupForm = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://cs-tech-assignment.vercel.app/admin/", form);
      toast.success("Admin registered successfully. You can login now.");
      navigate("/");
    } catch (err) {
      toast.error("Signup failed: " + err.response?.data?.message);
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
          <h2 className="fw-bold text-primary">Signup</h2>
          <p className="text-muted">Create your admin account</p>
        </div>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            required
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="form-control form-control-lg mb-3"
            style={{ borderRadius: "10px" }}
          />
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="form-control form-control-lg mb-3"
            style={{ borderRadius: "10px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="form-control form-control-lg mb-4"
            style={{ borderRadius: "10px" }}
          />
          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 mb-3"
            // no need for mouseEnter stuff for theme consistency
          >
            Sign Up
          </button>
          <div className="text-center mt-3">
            <p className="text-muted mb-0">
              Already have an account?{" "}
              <Link to="/" className="text-decoration-none">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSignupForm;
