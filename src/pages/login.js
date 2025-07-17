import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Send as form-data (multipart/form-data) for compatibility
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      const response = await fetch("https://aitechnotech.in/ryze/admin/login", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.status === "1" && data.results?.access_token) {
        localStorage.setItem("access_token", data.results.access_token);
        navigate("/user");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
    setLoading(false);
  };

  // Logout function to clear token
  // const handleLogout = () => {
  //   localStorage.removeItem("access_token");
  //   navigate("/login");
  // };

  return (
    <div id="wrapper">
      <div id="page" className="">
        <div className="wrap-login-page">
          <div className="flex-grow flex flex-column justify-center gap30">
            <div className="login-box">
              <div style={{ textAlign: "center" }}>
                <img alt="" src="assets/images/logo/logo.png" style={{ width: "100px" }} />
              </div>
              <div className="text-center">
                <h3>Login to account</h3>
                <div className="body-text">Enter your email &amp; password to login</div>
              </div>
              {error && (
                <div className="alert alert-danger text-center" style={{ marginBottom: 12 }}>{error}</div>
              )}
              <form className="form-login flex flex-column gap24" onSubmit={handleSubmit}>
                <fieldset className="email">
                  <div className="body-title mb-10">
                    Email address <span className="tf-color-1">*</span>
                  </div>
                  <input
                    className="form-control"
                    type="email"
                    placeholder="Enter your email address"
                    name="email"
                    tabIndex={0}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-required="true"
                    required
                    disabled={loading}
                  />
                </fieldset>
                <fieldset className="password">
                  <div className="body-title mb-10">
                    Password <span className="tf-color-1">*</span>
                  </div>
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    tabIndex={0}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-required="true"
                    required
                    disabled={loading}
                  />
                </fieldset>
                <button className="btn-primary btn w-full" style={{ height: "50px" }} type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;