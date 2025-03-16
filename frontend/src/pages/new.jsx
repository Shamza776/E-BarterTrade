import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import "./new.css";

export default function NewSkillPage() {
  const navigate = useNavigate();
  const [skill, setSkill] = useState({
    title: "",
    category: "",
    description: "",
    availability: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const userId = localStorage.getItem("userId");

  const handleChange = (e) => {
    setSkill({ ...skill, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post("https://e-bartertrade.onrender.com/api/skills/new", {
        ...skill,
        userId, // Attach the logged-in user's ID
      });

      navigate("/dashboard"); // Redirect to dashboard after success
    } catch (err) {
      console.error("Error adding skill:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="new-skill-container">
      <div className="header">
        <Link to="/dashboard" className="back-button">
          <ArrowLeft className="icon" />
        </Link>
        <h1>Add New Skill</h1>
        <p>Share a skill you can teach others in your community.</p>
      </div>

      <form onSubmit={handleSubmit} className="skill-form">
        <div className="form-group">
          <label htmlFor="title">Skill Title</label>
          <input id="title" name="title" value={skill.title} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={skill.category} onChange={handleChange} required>
            <option value="">Select a category</option>
            <option value="technology">Technology</option>
            <option value="arts">Arts & Media</option>
            <option value="languages">Languages</option>
            <option value="music">Music</option>
            <option value="fitness">Health & Fitness</option>
            <option value="cooking">Cooking</option>
            <option value="business">Business</option>
            <option value="crafts">Arts & Crafts</option>
            <option value="home">Home & Garden</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={skill.description} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="availability">Availability</label>
          <select id="availability" name="availability" value={skill.availability} onChange={handleChange} required>
            <option value="">When are you available?</option>
            <option value="weekdays">Weekdays</option>
            <option value="weekends">Weekends</option>
            <option value="evenings">Evenings</option>
            <option value="mornings">Mornings</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input id="location" name="location" value={skill.location} onChange={handleChange} required />
        </div>

        <div className="button-group">
          <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Skill"}
          </button>
        </div>
      </form>
    </div>
  );
}
