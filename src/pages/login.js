import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add login logic here
    // For now, just log the values
    // console.log("Email:", email);
    // console.log("Password:", password);
    // Redirect to user page
    navigate("/user");
  };

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
                  />
                </fieldset>
                <button className="btn-primary btn w-full" style={{ height: "50px" }} type="submit">
                  Login
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