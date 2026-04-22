import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [body, setbody] = useState('')
  const [error, setError] = useState('')
  const [editingNote, setEditingNote] = useState(null)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchNotes()
  }, [])

  async function fetchNotes() {
    try {
      const response = await fetch('http://localhost:5000/api/notes', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (response.ok) {
        setNotes(data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: {
          'content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, body: body })
      })
      const data = await response.json()
      if (response.ok) {
        setTitle('')
        setbody('')
        fetchNotes()
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleUpdate(e) {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${editingNote.id}`, {
        method: 'PUT',
        headers: {
          'content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, body: body })
      })
      const data = await response.json()
      if (response.ok) {
        setEditingNote(null)
        setTitle('')
        setbody('')
        fetchNotes()
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        fetchNotes()
      }
    } catch (err) {
      setError(err.message)
    }
  }

  function handleEdit(note) {
    setEditingNote(note)
    setTitle(note.title)
    setbody(note.body)
  }

  function handleCancelEdit() {
    setEditingNote(null)
    setTitle('')
    setbody('')
  }

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifybody: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>My Notes</h2>
        <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>Logout</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={editingNote ? handleUpdate : handleCreate} style={{ marginTop: '24px' }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '8px', boxSizing: 'border-box' }}
        />
        <textarea
          placeholder="body"
          value={body}
          onChange={e => setbody(e.target.value)}
          rows={4}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
        <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
          <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
            {editingNote ? 'Update Note' : 'Add Note'}
          </button>
          {editingNote && (
            <button type="button" onClick={handleCancelEdit} style={{ padding: '8px 16px', cursor: 'pointer' }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr style={{ margin: '24px 0' }} />

      {notes.map(note => (
        <div key={note.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
          <h3 style={{ margin: '0 0 8px 0' }}>{note.title}</h3>
          <p style={{ margin: '0 0 12px 0' }}>{note.body}</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => handleEdit(note)} style={{ padding: '6px 12px', cursor: 'pointer' }}>Edit</button>
            <button onClick={() => handleDelete(note.id)} style={{ padding: '6px 12px', cursor: 'pointer' }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}