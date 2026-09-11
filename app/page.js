'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [expenses, setExpenses] = useState([]);

  const loadExpenses = () => {
    const savedExpenses = JSON.parse(localStorage.getItem('driver_expenses') || '[]');
    setExpenses(savedExpenses);
  };

  useEffect(() => {
    loadExpenses();
    // Écouter les changements en direct si l'admin et le chauffeur sont ouverts
    window.addEventListener('storage', loadExpenses);
    return () => window.removeEventListener('storage', loadExpenses);
  }, []);

  // Calcul des totaux
  const totalExpenses = expenses.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  const totalTVA = expenses.reduce((acc, curr) => acc + (parseFloat(curr.tva) || 0), 0);

  const clearHistory = () => {
    if (confirm("Voulez-vous effacer l'historique des dépenses ?")) {
      localStorage.removeItem('driver_expenses');
      setExpenses([]);
    }
  };

  return (
    <main style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>STOCK EXPRESS</h1>
          <p style={{ color: "#666", margin: 0 }}>Tableau de bord Administrateur - Gestion</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            onClick={loadExpenses}
            style={{ background: "#eee", border: "1px solid #ccc", padding: "8px 12px", borderRadius: "5px", cursor: "pointer", fontSize: "14px" }}
          >
            🔄 Actualiser
          </button>
          <a 
            href="/driver" 
            target="_blank" 
            style={{ background: "#0070f3", color: "#fff", padding: "8px 12px", borderRadius: "5px", textDecoration: "none", fontSize: "14px", fontWeight: "bold", display: "flex", alignItems: "center" }}
          >
            Lien Chauffeur ↗
          </a>
        </div>
      </div>

      {/* Résumé Financier */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "25px" }}>
        <div style={{ background: "#f0f4f8", padding: "15px", borderRadius: "8px", border: "1px solid #d9e2ec" }}>
          <h3 style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#555" }}>📉 Dépenses Carburant du Jour</h3>
          <p style={{ fontSize: "22px", fontWeight: "bold", margin: 0, color: "#d32f2f" }}>{totalExpenses.toFixed(2)} €</p>
        </div>
        <div style={{ background: "#f0f4f8", padding: "15px", borderRadius: "8px", border: "1px solid #d9e2ec" }}>
          <h3 style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#555" }}>🧾 TVA Déductible Estimée</h3>
          <p style={{ fontSize: "22px", fontWeight: "bold", margin: 0, color: "#2e7d32" }}>{totalTVA.toFixed(2)} €</p>
        </div>
      </div>

      {/* Liste des tickets reçus */}
      <div style={{ background: "#fff", padding: "15px", borderRadius: "8px", border: "1px solid #ddd" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h2 style={{ fontSize: "18px", margin: 0 }}>📋 Billets de carburant transmis par les chauffeurs</h2>
          {expenses.length > 0 && (
            <button 
              onClick={clearHistory} 
              style={{ background: "#ff4d4d", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
            >
              Effacer l'historique
            </button>
          )}
        </div>

        {expenses.length === 0 ? (
          <p style={{ color: "#777", fontStyle: "italic" }}>Aucun ticket reçu pour le moment. Envoyez un test depuis l'interface chauffeur puis cliquez sur "Actualiser" !</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #eee", background: "#f9f9f9" }}>
                <th style={{ padding: "10px" }}>Date</th>
                <th style={{ padding: "10px" }}>Chauffeur</th>
                <th style={{ padding: "10px" }}>Immatriculation</th>
                <th style={{ padding: "10px" }}>Kilométrage</th>
                <th style={{ padding: "10px" }}>Montant</th>
                <th style={{ padding: "10px" }}>TVA (20%)</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "10px" }}>{item.date}</td>
                  <td style={{ padding: "10px", fontWeight: "500" }}>{item.driver}</td>
                  <td style={{ padding: "10px" }}><code>{item.plate}</code></td>
                  <td style={{ padding: "10px" }}>{item.mileage} km</td>
                  <td style={{ padding: "10px", fontWeight: "bold" }}>{item.amount} €</td>
                  <td style={{ padding: "10px", color: "#2e7d32" }}>{item.tva} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}