import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './pages/landing'
import SignUp from './pages/signUp'
import Login from './pages/login'
import Dashboard from './pages/dashboard'
import NewSkillPage from './pages/new'
import SkillsPage from './pages/skills'
import NavigationBar from './components/navigation';
import MessagesPage from './pages/messages'
import ProfilePage from './pages/profile'
import ProtectedRoute from './components/ProtectedRoute';
import EditSkillPage from './pages/EditSkills'
import './App.css'


function App() {
  return (
    <Router>
      <NavigationBar />
      <div className="page-container">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/new" element={<NewSkillPage />} />
        <Route path="/edit-skill/:skillId" element={<EditSkillPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
      </div>
      
    </Router>
  )

}

export default App
