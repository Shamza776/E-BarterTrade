import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash } from "lucide-react";
import "./dashboard.css";

export default function DashboardPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = () => {
    axios.get(`http://localhost:5000/api/skills/${userId}`)
      .then((res) => {
        setSkills(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching skills:", err);
        setLoading(false);
      });
  };

  // ✅ Delete a skill
  const handleDelete = async (skillId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this skill?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/skills/${skillId}`);
      setSkills(skills.filter(skill => skill._id !== skillId)); // Remove skill from state
    } catch (err) {
      console.error("Error deleting skill:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p>Manage your skills and explore new opportunities.</p>

      {loading ? (
        <p>Loading...</p>
      ) : skills.length === 0 ? (
        <div className="no-skills">
          <p>No skills added yet.</p>
          <Link to="/add-skill">
            <button className="add-skill-btn">
              <Plus className="icon" /> Add Skill
            </button>
          </Link>
        </div>
      ) : (
        <div className="skills-list">
          {skills.map((skill) => (
            <div key={skill._id} className="skill-card">
              <h3>{skill.title}</h3>
              <p><strong>Category:</strong> {skill.category}</p>
              <p>{skill.description}</p>
              
              {/* ✅ Edit & Delete Buttons */}
              <div className="skill-actions">
                <button className="edit-btn" onClick={() => navigate(`/edit-skill/${skill._id}`)}>
                  <Edit className="icon" /> Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(skill._id)}>
                  <Trash className="icon" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
