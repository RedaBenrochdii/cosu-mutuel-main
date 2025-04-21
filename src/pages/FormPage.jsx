import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as XLSX from 'xlsx';
import styles from '../styles/FormPage.module.css';

const INITIAL_FORM_STATE = {
  DateConsultation: '',
  Matricule_Employe: '',
  Nom_Employe: '',
  Prenom_Employe: '',
  Nom_Malade: '',
  Prenom_Malade: '',
  Type_Malade: '',
  Montant: '',
  Montant_Rembourse: '',
  Code_Assurance: ''
};

export default function FormPage() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formList, setFormList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('formList')) || [];
    } catch {
      return [];
    }
  });
  const [employesData, setEmployesData] = useState([]);

  // Persist formList
  useEffect(() => {
    localStorage.setItem('formList', JSON.stringify(formList));
  }, [formList]);

  // Map for quick lookup
  const matriculeMap = useMemo(
    () => new Map(employesData.map(emp => [String(emp.Matricule_Employe), emp])),
    [employesData]
  );

  // File upload: read as ArrayBuffer for better performance
  const handleFileUpload = useCallback(e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      const wb = XLSX.read(target.result, { type: 'array' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      setEmployesData(
        jsonData.map(emp => ({
          ...emp,
          Matricule_Employe: String(emp.Matricule_Employe)
        }))
      );
    };
    reader.readAsArrayBuffer(file);
  }, []);

  // Unified change handler
  const handleChange = useCallback(
    e => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    },
    []
  );

  // Auto-fill when Matricule changes
  useEffect(() => {
    const { Matricule_Employe } = formData;
    if (!Matricule_Employe) return;
    const emp = matriculeMap.get(Matricule_Employe);
    if (emp) {
      const formattedDate = emp.DateConsultation
        ? new Date(emp.DateConsultation).toISOString().substr(0, 10)
        : '';
      setFormData(prev => ({
        ...prev,
        Nom_Employe: emp.Nom_Employe || '',
        Prenom_Employe: emp.Prenom_Employe || '',
        DateConsultation: formattedDate,
        Nom_Malade: emp.Nom_Malade || '',
        Prenom_Malade: emp.Prenom_Malade || '',
        Type_Malade: emp.Type_Malade || '',
        Montant: emp.Montant || '',
        Montant_Rembourse: emp.Montant_Rembourse || '',
        Code_Assurance: emp.Code_Assurance || ''
      }));
    }
  }, [formData.Matricule_Employe, matriculeMap]);

  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      setFormList(prev => [...prev, formData]);
      setFormData(INITIAL_FORM_STATE);
    },
    [formData]
  );

  const exportToExcel = useCallback(() => {
    if (!formList.length) return;
    const ws = XLSX.utils.json_to_sheet(formList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Formulaires');
    XLSX.writeFile(wb, 'formulaires.xlsx');
  }, [formList]);

  const deleteRow = useCallback(
    idx => {
      if (window.confirm('Supprimer cette ligne ?')) {
        setFormList(prev => prev.filter((_, i) => i !== idx));
      }
    },
    []
  );

  const deleteAll = useCallback(() => {
    if (formList.length && window.confirm('Tout supprimer ?')) {
      setFormList([]);
    }
  }, [formList.length]);

  const sendEmail = useCallback(() => {
    if (!formList.length) return;
    const body = formList
      .map(item =>
        `Date: ${item.DateConsultation}\nMatricule: ${item.Matricule_Employe}\nNom: ${item.Nom_Employe} ${item.Prenom_Employe}\n---\n`
      )
      .join('');
    window.location.href =
      `mailto:benrouchdireda@gmail.com?subject=${encodeURIComponent(
        'Formulaires Mutuelle'
      )}&body=${encodeURIComponent(body)}`;
  }, [formList]);

  return (
    <div className={styles.container}>
      <h1>Formulaire de Consommation Mutuelle</h1>

      <div className={styles.uploadWrapper}>
        <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {Object.entries(INITIAL_FORM_STATE).map(([key]) => (
          <input
            key={key}
            name={key}
            value={formData[key]}
            onChange={handleChange}
            type={key === 'DateConsultation' ? 'date' : key.includes('Montant') ? 'number' : 'text'}
            placeholder={key.replace(/_/g, ' ')}
            required={['Matricule_Employe', 'Nom_Employe', 'Prenom_Employe', 'DateConsultation'].includes(
              key
            )}
          />
        ))}
        <button type="submit" className={styles.submitBtn}>
          Ajouter
        </button>
      </form>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {[...Object.keys(INITIAL_FORM_STATE), 'Actions'].map(col => (
                <th key={col}>{col.replace(/_/g, ' ')}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {formList.map((item, idx) => (
              <tr key={idx}>
                {Object.values(item).map((val, i) => (
                  <td key={i}>{val}</td>
                ))}
                <td>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => deleteRow(idx)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.actions}>
        <button onClick={exportToExcel} disabled={!formList.length} className={styles.exportButton}>
          Exporter vers Excel
        </button>
        <button onClick={deleteAll} disabled={!formList.length} className={styles.deleteAllBtn}>
          Supprimer tout
        </button>
        <button onClick={sendEmail} disabled={!formList.length} className={styles.sendEmailBtn}>
          Envoyer Email
        </button>
      </div>
    </div>
  );
}
