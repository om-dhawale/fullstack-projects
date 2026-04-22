import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Notes from './pages/Notes'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Root Path: Decide if you want users to see Home or go straight to Register */}
        <Route path="/" element={<Home />} />

        {/* 2. Auth Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* 3. Notes Page */}
        <Route path="/notes" element={<Notes />} />

        {/* 4. Catch-all: If a user types a weird URL, send them home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}