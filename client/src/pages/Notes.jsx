import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [editingNote, setEditingNote] = useState(null)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const API = 'https://notesapp-backend-8w7t.onrender.com'

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchNotes()
  }, [])

  async function fetchNotes() {
    try {
      const response = await fetch(`${API}/api/notes`, { headers: { 'Authorization': `Bearer ${token}` } })
      const data = await response.json()
      if (response.ok) setNotes(data)
      else setError(data.message)
    } catch (err) { setError(err.message) }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const url = editingNote ? `${API}/api/notes/${editingNote.id}` : `${API}/api/notes`
    const method = editingNote ? 'PUT' : 'POST'
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, content })
      })
      if (response.ok) {
        setTitle(''); setContent(''); setEditingNote(null); fetchNotes()
      }
    } catch (err) { setError(err.message) }
  }

  async function handleDelete(id) {
    try {
      await fetch(`${API}/api/notes/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
      fetchNotes()
    } catch (err) { setError(err.message) }
  }

  function handleEdit(note) {
    setEditingNote(note); setTitle(note.title); setContent(note.body)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0 }}>📝 My Notes</h2>
          <button onClick={() => { localStorage.removeItem('token'); navigate('/login') }} style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '6px', border: '1px solid #000', background: '#fff' }}>Logout</button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} rows={4} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button onClick={handleSubmit} style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>{editingNote ? 'Update' : 'Add Note'}</button>
            {editingNote && <button onClick={() => { setEditingNote(null); setTitle(''); setContent('') }} style={{ padding: '10px 20px', background: '#fff', border: '1px solid #000', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>}
          </div>
        </div>
        {notes.map(note => (
          <div key={note.id} style={{ background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <h3 style={{ margin: '0 0 8px 0' }}>{note.title}</h3>
            <p style={{ margin: '0 0 16px 0', color: '#444' }}>{note.body}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleEdit(note)} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #000', background: '#fff', cursor: 'pointer' }}>Edit</button>
              <button onClick={() => handleDelete(note.id)} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid red', color: 'red', background: '#fff', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}