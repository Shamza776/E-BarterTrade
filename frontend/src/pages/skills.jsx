import React, { useState, useEffect } from "react";
import axios from "axios";
import { Filter, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./skills.css";

export default function SkillsPage() {
  const [users, setUsers] = useState([]); // Store registered users
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all"); // ✅ Filter by category
  const [locationQuery, setLocationQuery] = useState(""); // ✅ User-input location
  const navigate = useNavigate();

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

  // ✅ Apply filters
  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "all" || user.category === selectedCategory) &&
      (locationQuery === "" || user.location?.toLowerCase().includes(locationQuery.toLowerCase()))
    );
  });

  return (
    <div className="skills-container">
      <header className="skills-header">
        <h1>Skill Exchange Community</h1>
        <p>Find registered users for skill exchange.</p>
      </header>

      <div className="skills-layout">
        {/* Sidebar Filters */}
        <aside className="filters-card">
          {/* Search Bar */}
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

          {/* Category Filter */}
          <h3>Category</h3>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="technology">Technology</option>
            <option value="arts">Arts & Media</option>
            <option value="languages">Languages</option>
            <option value="music">Music</option>
            <option value="fitness">Health & Fitness</option>
            <option value="cooking">Cooking</option>
            <option value="business">Business</option>
            <option value="crafts">Arts & Crafts</option>
            <option value="home">Home & Garden</option>
          </select>

          {/* Location Filter */}
          <h3>Location</h3>
          <input
            type="text"
            placeholder="Enter location..."
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
          />

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

// ✅ Updated UserCard Component
function UserCard({ user, navigate }) {
  return (
    <div className="skill-card">
      <h3>{user.name}</h3>
      <p><strong>Category:</strong> {user.category || "Not provided"}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Location:</strong> {user.location || "Not provided"}</p>
      <button className="message-btn" onClick={() => navigate(`/messages/${user._id}`)}>
        Message
      </button>
    </div>
  );
}
