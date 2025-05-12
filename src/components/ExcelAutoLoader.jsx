import React, { useState } from 'react';
import { ipcRenderer } from 'electron';

const ExcelAutoLoader = ({ onDataLoaded }) => {
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    try {
      const data = await ipcRenderer.invoke('open-excel-file');
      if (data) {
        onDataLoaded(data);  // Mettre à jour l'état dans votre parent component (FormPage.jsx)
      } else {
        alert('Aucun fichier sélectionné');
      }
    } catch (error) {
      console.error('Erreur lors de l\'importation du fichier Excel:', error);
      alert('Une erreur est survenue.');
    }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={handleImport} disabled={loading}>
        {loading ? 'Chargement...' : 'Importer un fichier Excel'}
      </button>
    </div>
  );
};

export default ExcelAutoLoader;
