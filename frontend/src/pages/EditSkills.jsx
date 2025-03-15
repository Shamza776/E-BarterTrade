import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import "./new.css";

export default function EditSkillPage() {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const [skill, setSkill] = useState({
    title: "",
    category: "",
    description: "",
    availability: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/skills/${skillId}`)
      .then((res) => setSkill(res.data))
      .catch((err) => console.error("Error fetching skill:", err));
  }, [skillId]);

  const handleChange = (e) => {
    setSkill({ ...skill, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.put(`http://localhost:5000/api/skills/${skillId}`, skill);
      alert("Skill updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating skill:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="new-skill-container">
      <div className="header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft className="icon" />
        </button>
        <h1>Edit Skill</h1>
        <p>Modify your skill details below.</p>
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
            <option value="">Select availability</option>
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
            {isLoading ? "Updating..." : "Update Skill"}
          </button>
        </div>
      </form>
    </div>
  );
}
