import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, LogOut } from "lucide-react";
import "./profile.css"; // Ensure this CSS file exists

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false); // New state for logout popup
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    axios.get(`http://localhost:5000/api/auth/profile/${userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("Error fetching user:", err);
        setError("Failed to load user data. Please try again.");
      });
  }, [userId, navigate]);

  // Show Confirmation Popup
  const confirmLogout = () => {
    setShowPopup(true);
  };

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    navigate("/login");
  };

  if (error) return <p className="error-text">{error}</p>;
  if (!user) return <p>Loading user data...</p>;

  return (
    <div className="profile-container">
      <div className="profile-box">
        <div className="profile-header">
          <Users className="icon" />
          <h1>{user.name}</h1>
        </div>
        <p className="email"><strong>Email:</strong> {user.email}</p>
        <p className="location">
          <MapPin className="icon-small" /> {user.location || "Not provided"}
        </p>

        {/* Logout Button */}
        <button onClick={confirmLogout} className="logout-btn">
          <LogOut className="icon" /> Logout
        </button>
      </div>

      {/* Logout Confirmation Popup */}
      {showPopup && (
        <div className="logout-popup">
          <div className="logout-popup-content">
            <p>Are you sure you want to logout?</p>
            <button className="logout-confirm-btn" onClick={handleLogout}>Yes, Logout</button>
            <button className="logout-cancel-btn" onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
