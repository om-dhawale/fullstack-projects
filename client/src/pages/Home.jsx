import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      background: '#f5f5f5'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📝 NotesApp</h1>
      <p style={{ color: '#666', marginBottom: '40px' }}>Your simple personal notes manager</p>
      <div style={{ display: 'flex', gap: '16px' }}>
        <button
          onClick={() => navigate('/register')}
          style={{
            padding: '12px 32px',
            fontSize: '1rem',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Register
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '12px 32px',
            fontSize: '1rem',
            backgroundColor: '#fff',
            color: '#000',
            border: '1px solid #000',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </div>
    </div>
  )
}