import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [notes, setNotes] = useState([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ title: '', content: '', color: 'yellow' })

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes')
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  const colors = {
    yellow: 'bg-yellow-100 border-yellow-300',
    pink: 'bg-pink-100 border-pink-300',
    blue: 'bg-blue-100 border-blue-300',
    green: 'bg-green-100 border-green-300',
    purple: 'bg-purple-100 border-purple-300',
    orange: 'bg-orange-100 border-orange-300',
  }

  const handleAddNote = () => {
    setFormData({ title: '', content: '', color: 'yellow' })
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleEditNote = (note) => {
    setFormData(note)
    setEditingId(note.id)
    setIsModalOpen(true)
  }

  const handleSaveNote = () => {
    if (editingId) {
      setNotes(notes.map(note => note.id === editingId ? { ...formData, id: editingId } : note))
    } else {
      const newNote = {
        ...formData,
        id: Date.now()
      }
      setNotes([newNote, ...notes])
    }
    setIsModalOpen(false)
    setFormData({ title: '', content: '', color: 'yellow' })
  }

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-2">
              My Notes
            </h1>
            <p className="text-gray-600">Keep your thoughts organized and accessible</p>
          </div>
          <button
            onClick={handleAddNote}
            className="btn-primary shadow-lg"
          >
            + New Note
          </button>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-6 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors text-lg shadow-sm"
          />
        </div>

        {filteredNotes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No notes yet</h2>
            <p className="text-gray-500 mb-6">Create your first note to get started!</p>
            <button
              onClick={handleAddNote}
              className="btn-primary"
            >
              Create First Note
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                className={`${colors[note.color] || colors.yellow} note-card border-2 cursor-pointer hover:border-current group`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800 flex-1 break-words">
                    {note.title || 'Untitled'}
                  </h3>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="ml-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-gray-700 mb-4 line-clamp-4 break-words whitespace-pre-wrap">
                  {note.content}
                </p>
                <button
                  onClick={() => handleEditNote(note)}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
                >
                  Edit →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-pink-500 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                {editingId ? 'Edit Note' : 'Add New Note'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-200 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter note title..."
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your note here..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                  rows="8"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Color
                </label>
                <div className="flex gap-3 flex-wrap">
                  {Object.keys(colors).map(color => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full border-4 transition-transform ${
                        formData.color === color
                          ? `${colors[color]} border-current scale-110`
                          : 'border-gray-300'
                      } ${colors[color]}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveNote}
                  className="btn-primary flex-1"
                >
                  {editingId ? 'Update Note' : 'Add Note'}
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
