// src/pages/Settings.jsx
import React, { useState } from 'react';
import styles from '../styles/Settings.module.css';

const Settings = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = (e) => {
    e.preventDefault();
    if (login === 'admin' && password === '1234') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Identifiants incorrects');
    }
  };

  return (
    <div className={styles.container}>
      {!isAuthenticated ? (
        <form onSubmit={handleAuth} className={styles.authForm}>
          <h2>Connexion requise</h2>
          <input
            type="text"
            placeholder="Identifiant"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button}>Se connecter</button>
        </form>
      ) : (
        <>
          <h1>Paramètres</h1>
          <p>Gérez vos préférences ici.</p>
        </>
      )}
    </div>
  );
};

export default Settings;
