import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, LayoutDashboard, MessageCircle, User, BookOpen } from "lucide-react";
import "./navigation.css"; // Import the CSS file

export default function NavigationBar() {
  const location = useLocation(); // Get current route path

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
          <Link to="/" className="nav-link">
            <Home className="icon" />
            Home
          </Link>
        </li>
        <li className={`nav-item ${location.pathname === "/dashboard" ? "active" : ""}`}>
          <Link to="/dashboard" className="nav-link">
            <LayoutDashboard className="icon" />
            Dashboard
          </Link>
        </li>
        <li className={`nav-item ${location.pathname === "/skills" ? "active" : ""}`}>
          <Link to="/skills" className="nav-link">
            <BookOpen className="icon" />
            Skills
          </Link>
        </li>
        <li className={`nav-item ${location.pathname === "/messages" ? "active" : ""}`}>
          <Link to="/messages" className="nav-link">
            <MessageCircle className="icon" />
            Messages
          </Link>
        </li>
        <li className={`nav-item ${location.pathname === "/profile" ? "active" : ""}`}>
          <Link to="/profile" className="nav-link">
            <User className="icon" />
            Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
}
