import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleRegister(e) {
    e.preventDefault()
    try {
      const response = await fetch('https://notesapp-backend-8w7t.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if (response.ok) navigate('/login')
      else setError(data.message)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <h2 style={{ marginBottom: '24px' }}>Create Account</h2>
        {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
        <button onClick={handleRegister} style={{ width: '100%', padding: '12px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Register</button>
        <p style={{ textAlign: 'center', marginTop: '16px' }}>Already have an account? <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Login</span></p>
      </div>
    </div>
  )
}