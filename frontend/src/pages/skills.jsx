import React, { useState, useEffect } from "react";
import axios from "axios";
import { Filter, Search } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import "./skills.css";

export default function SkillsPage() {
  const [users, setUsers] = useState([]); // Store registered users
  const [searchQuery, setSearchQuery] = useState("");
  const [distance, setDistance] = useState(5);
  const navigate = useNavigate(); // ✅ Define navigate function

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="skills-container">
      <header className="skills-header">
        <h1>Skill Exchange Community</h1>
        <p>Find registered users for skill exchange.</p>
      </header>

      <div className="skills-layout">
        {/* Sidebar Filters */}
        <aside className="filters-card">
          <h3>Search Users</h3>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="icon-btn">
              <Search className="icon-small" />
            </button>
          </div>

          <h3>Distance</h3>
          <input
            type="range"
            min="1"
            max="50"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
          <span>{distance} miles</span>

          <button className="apply-btn">
            <Filter className="icon-small" /> Apply Filters
          </button>
        </aside>

        {/* Users Grid */}
        <main className="skills-grid">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserCard key={user._id} user={user} navigate={navigate} />
            ))
          ) : (
            <p>No users found.</p>
          )}
        </main>
      </div>

      {/* Load More Button */}
      <div className="load-more">
        <button className="outline-btn">Load More</button>
      </div>
    </div>
  );
}

// ✅ Fixed UserCard Component (Pass navigate & user)
function UserCard({ user, navigate }) {
  return (
    <div className="skill-card">
      <h3>{user.name}</h3>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Location:</strong> {user.location || "Not provided"}</p>
      <button className="message-btn" onClick={() => navigate(`/messages/${user._id}`)}>
        Message
      </button>
    </div>
  );
}
