// src/components/Chatbot.jsx
import React, { useState } from 'react';
import styles from './Chatbot.module.css';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Bonjour, comment puis-je vous aider ?' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Affiche le message de l'utilisateur
    const userMsg = { from: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);

    try {
      // Appel à ton backend Node.js
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      // Affiche la réponse du bot
      const botReply = {
        from: 'bot',
        text: data.text || "Désolé, je n'ai pas compris."
      };
      setMessages(prev => [...prev, botReply]);
    } catch (err) {
      // En cas d'erreur réseau ou serveur
      setMessages(prev => [
        ...prev,
        { from: 'bot', text: 'Erreur de connexion au serveur.' }
      ]);
    }

    setInput('');
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.from === 'bot' ? styles.botMsg : styles.userMsg}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Votre message..."
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Envoyer</button>
      </div>
    </div>
  );
}
