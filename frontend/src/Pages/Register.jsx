import React, { useState } from "react";
import "../styles/Register.css"; // Ensure the CSS file is present
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading,setLoading]=useState(false);
  const navigate = useNavigate(); // Ensure this is imported


  // Function to upload the image to Cloudinary and return the URL
  async function uploadImageToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chat-app"); // Cloudinary upload preset

    try {
      setLoading(true);
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dq3dngjo1/image/upload", // Your Cloudinary cloud name
        formData
      );
      setLoading(false);
      return res.data.secure_url; // Return the uploaded image URL
    } catch (err) {
      setLoading(false);
      console.error("Error uploading image:", err);
      throw new Error("Image upload failed");
    }
  }

// Handle the registration process
async function handleRegister() {
  if (!name || !email || !password || !pic) {
    setError("All fields are required, including the image!");
    return;
  }

  try {
    // Upload the image to Cloudinary
    const imageUrl = await uploadImageToCloudinary(pic);

    // Prepare the data object
    const data = {
      name,
      email,
      password,
      pic: imageUrl, // Store the Cloudinary URL in the image field
    };

    // Make the API request to register the user
    const res = await axios.post("https://chatapp-f2ec.onrender.com/api/user/register", data);
 

    // Store the complete user information in localStorage
    localStorage.setItem("userInfo", JSON.stringify(res.data));

    // Redirect to the home page after successful registration
    navigate("/Home");
    window.location.reload()
  } catch (err) {
    console.error(err.response?.data?.error || "An error occurred");
    setError(err.response?.data?.error || "An error occurred during registration.");
  }
}


  return (
    <div className="register-container">
  <div className="register-card">
    <h2 className="register-title">Create Account</h2>
    <input
      type="text"
      id="name"
      name="name"
      className="register-input"
      placeholder="Name"
      onChange={(e) => setName(e.target.value)}
      autoComplete="name"
    />
    <br />
    <input
      type="email"
      id="email"
      name="email"
      className="register-input"
      placeholder="Email"
      onChange={(e) => setEmail(e.target.value)}
      autoComplete="email"
    />
    <br />
    <input
      type="password"
      id="password"
      name="password"
      className="register-input"
      placeholder="Password"
      onChange={(e) => setPassword(e.target.value)}
      autoComplete="new-password"
    />
    <br />
    <input
      type="file"
      id="profileImage"
      name="profileImage"
      accept="image/*"
      className="register-input"
      onChange={(e) => setImage(e.target.files[0])}
    />
    {error && <div className="register-error">{error}</div>} {/* Display error message */}
    <button className="register-button" onClick={handleRegister} disabled={loading}>
      {loading ? (
        <FontAwesomeIcon icon={faSpinner} spin size="lg" />
      ) : (
        "Sign Up"
      )}
    </button>
    <p style={{ marginTop: "20px" }} id="navtologin">
      Already have an account? <Link to="/Login">Login</Link>
    </p>
  </div>
</div>

  );
}

export default Register;
