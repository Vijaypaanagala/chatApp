import React, { useState } from "react";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function Login() {
  const [email, setemail] = useState("");
  const [password, setpass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function HandleLogin() {
    const payload = {
      email,
      password,
    };
    try {
      console.log("Sending payload:", payload);
      setLoading(true); // Start loading spinner
      const { data: responseData } = await axios.post(
        "http://localhost:3000/api/user/login",
        payload
      );
      setLoading(false); // Stop loading spinner
      localStorage.setItem("userInfo", JSON.stringify(responseData));
      navigate("/");
      window.location.reload();
    } catch (err) {
      setLoading(false); // Stop loading spinner even if there's an error
      console.error("Error details:", err.response?.data?.error || "An error occurred");
      setError(err.response?.data?.error || "An error occurred");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <input
          type="text"
          className="login-input"
          placeholder="Email"
          onChange={(e) => setemail(e.target.value)}
        />
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          onChange={(e) => setpass(e.target.value)}
        />
        {error && <div className="login-error">{error}</div>}
        <button className="login-button" onClick={HandleLogin} disabled={loading}>
          {loading ? (
            <FontAwesomeIcon icon={faSpinner} spin size="lg" />
          ) : (
            "Login"
          )}
        </button>
        <p style={{ marginTop: "20px" }}>
          Don't have an account? <Link to="/signup">SignUp</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
