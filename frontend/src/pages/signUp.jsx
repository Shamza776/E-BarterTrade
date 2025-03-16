import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Upload, Users } from "lucide-react";
import axios from "axios";
import "./signUp.css";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await axios.post("http://e-bartertrade.onrender.com/api/auth/signup", user);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-header">
          <Link to="/" className="brand">
            <Users className="icon" />
            <span>E-Barter Trade</span>
          </Link>
          <h1>Create an account</h1>
          <p>Enter your details below to create your account</p>
        </div>

        <div className="signup-card">
          <form onSubmit={handleSubmit}>
            {error && <p className="error-text">{error}</p>}

            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                placeholder="John Doe"
                value={user.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={user.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="password-container">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={user.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="picture">Profile Picture (Optional)</label>
              <div className="upload-container">
                <button type="button" className="upload-btn">
                  <Upload className="icon" />
                  Upload
                </button>
                <span className="file-text">No file selected</span>
              </div>
            </div>

            <div className="button-group">
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </button>
              <p>
                Already have an account?{" "}
                <Link to="/login" className="signin-link">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
