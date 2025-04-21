// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import DailyConsumptionChart from '../components/DailyConsumptionChart';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [dailyData, setDailyData] = useState([]);

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem('formList') || '[]');

    // 1. on réduit pour cumuler Montant par DateConsultation
    const agg = raw.reduce((acc, { DateConsultation, Montant }) => {
      const date = DateConsultation;
      const amount = Number(Montant) || 0;
      const existing = acc.find(item => item.date === date);
      if (existing) {
        existing.total += amount;
      } else {
        acc.push({ date, total: amount });
      }
      return acc;
    }, []);

    // 2. on trie par date croissante
    agg.sort((a, b) => new Date(a.date) - new Date(b.date));

    setDailyData(agg);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tableau de bord – Consommation Mutuelle</h1>

      <section>
        <h2>Consommation journalière</h2>
        <DailyConsumptionChart data={dailyData} />
      </section>
    </div>
  );
}
