// src/pages/Login.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (role) => {
    login({ username: 'reda', role })
    navigate('/') // Redirige vers l'accueil après connexion
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>Connexion</h2>
      <button onClick={() => handleLogin('admin')}>Se connecter comme Admin</button>
      <button onClick={() => handleLogin('agent')}>Se connecter comme Agent</button>
      <button onClick={() => handleLogin('adherent')}>Se connecter comme Adhérent</button>
    </div>
  )
}

export default Login
