import React, { useState } from 'react'
import axios from 'axios'

const Conseiller = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    setLoading(true)

    const userMessage = { sender: 'user', text: input }
    setMessages(prev => [...prev, userMessage])

    try {
      const response = await axios.post('http://localhost:3001/api/chat', {
        message: input,
      })

      const botMessage = { sender: 'bot', text: response.data.text }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Erreur:', error)
      setMessages(prev => [...prev, { sender: 'bot', text: "Une erreur s'est produite." }])
    } finally {
      setInput('')
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 30, maxWidth: 800, margin: '0 auto' }}>
      <h1>Assistant Conseiller (Gemini)</h1>
      <div style={{
        border: '1px solid #ccc',
        padding: 20,
        borderRadius: 8,
        minHeight: 300,
        marginBottom: 20
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            textAlign: msg.sender === 'user' ? 'right' : 'left',
            marginBottom: 10
          }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: msg.sender === 'user' ? '#4b9ce2' : '#f1f1f1',
              color: msg.sender === 'user' ? '#fff' : '#000',
              padding: '10px 15px',
              borderRadius: 10
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Pose ta question..."
          style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <button onClick={handleSend} disabled={loading} style={{ padding: '10px 20px', borderRadius: 6 }}>
          {loading ? 'Envoi...' : 'Envoyer'}
        </button>
      </div>
    </div>
  )
}

export default Conseiller
