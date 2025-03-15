import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Globe, MessageCircle, Users } from "lucide-react";
import "./landing.css";

export default function LandingPage() {
  return (
    <div className="landing-container">
      {/* Navigation */}
      <header className="header">
        <div className="nav-container">
          <Link to="/" className="brand">
            <Users className="icon" />
            <span>E-Barter Trade</span>
          </Link>
          <div className="nav-links">
            <Link to="/login" className="btn-ghost">Login</Link>
            <Link to="/signUp" className="btn">Sign Up</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Exchange Skills, Build Community</h1>
            <p>Connect with people in your area to share knowledge and learn new skills.</p>
            <div className="hero-buttons">
              <Link to="/signup" className="btn primary-btn">
                Get Started <ArrowRight className="icon-small" />
              </Link>
              <Link to="/skills" className="btn outline-btn">Explore Skills</Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="info-card">
              <BookOpen className="icon-large" />
              <p>Learn Photography</p>
            </div>
            <div className="info-card">
              <Globe className="icon-large" />
              <p>Teach Languages</p>
            </div>
            <div className="info-card">
              <MessageCircle className="icon-large" />
              <p>Connect Locally</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>How It Works</h2>
        <p>Our platform makes it easy to exchange skills with people in your community.</p>
        <div className="features-grid">
          <div className="feature-card">
            <Users className="icon-medium" />
            <h3>Create Profile</h3>
            <p>Sign up and list the skills you can teach others.</p>
          </div>
          <div className="feature-card">
            <Globe className="icon-medium" />
            <h3>Find Skills</h3>
            <p>Browse skills offered by people in your area.</p>
          </div>
          <div className="feature-card">
            <MessageCircle className="icon-medium" />
            <h3>Connect & Exchange</h3>
            <p>Message users and arrange to exchange skills.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="brand">
              <Users className="icon" />
              <span>E-Barter Trade</span>
            </Link>
            <p>Exchange skills, build community. © 2025 E-Barter Trade.</p>
          </div>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
