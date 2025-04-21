// GeminiProxy.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()
// juste après const app = express()
app.use((req, res, next) => {
  console.log(`👉 Requête entrante : ${req.method} ${req.url}`);
  next();
});

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// ✅ Route de test pour lister les modèles disponibles
app.get('/api/models', async (req, res) => {
  try {
    const result = await genAI.listModels()
    res.json(result.models.map((model) => model.name))
  } catch (err) {
    console.error("❌ Erreur lors de la récupération des modèles :", err.message)
    res.status(500).json({ error: err.message })
  }
})

// ✅ Route principale de chat
app.post('/api/chat', async (req, res) => {
  const { message } = req.body

  try {
    const model = genAI.getGenerativeModel({ model: 'models/chat-bison-001' })
    const chat = model.startChat({ history: [] })
    const result = await chat.sendMessage(message)
    const text = result.response.text()

    res.json({ text })
  } catch (err) {
    console.error('Erreur côté serveur :', err.message)
    res.status(500).json({ text: 'Erreur serveur : ' + err.message })
  }
})

app.listen(PORT, () => {
  console.log(`✅ Serveur Gemini en ligne : http://localhost:${PORT}`)
})
