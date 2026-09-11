'use client';
import { useState } from 'react';

export default function DriverPage() {
  const [driver, setDriver] = useState('');
  const [plate, setPlate] = useState('');
  const [mileage, setMileage] = useState('');
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSend = () => {
    if (!driver || !plate || !mileage || !amount) {
      alert("Veuillez remplir tous les champs (Prénom, Immatriculation, Kilométrage, Montant).");
      return;
    }

    const newExpense = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      driver,
      plate,
      mileage,
      amount: parseFloat(amount),
      tva: (parseFloat(amount) * 0.20).toFixed(2),
    };

    const existingExpenses = JSON.parse(localStorage.getItem('driver_expenses') || '[]');
    localStorage.setItem('driver_expenses', JSON.stringify([newExpense, ...existingExpenses]));

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main style={{ padding: "40px 20px", fontFamily: "sans-serif", maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontSize: "24px", color: "green", marginBottom: "15px" }}>✅ Ticket envoyé avec succès !</h1>
        <p style={{ color: "#666", marginBottom: "25px" }}>Merci {driver}, tes informations ont bien été transmises.</p>
        <button 
          onClick={() => { setSubmitted(false); setMileage(''); setAmount(''); setPlate(''); setDriver(''); }}
          style={{ background: "#000", color: "#fff", padding: "12px 20px", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer", width: "100%" }}
        >
          Saisir un autre ticket
        </button>
      </main>
    );
  }

  return (
    <main style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "500px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "5px" }}>STOCK EXPRESS</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>Interface Chauffeur - Carburant</p>
      
      <div style={{ background: "#f9f9f9", padding: "15px", borderRadius: "8px", border: "1px solid #ddd" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
          👋 Bien le bonjour à toi, qui es-tu ?
        </label>
        <select 
          value={driver} 
          onChange={(e) => setDriver(e.target.value)}
          style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc", background: "#fff", fontSize: "16px" }}
        >
          <option value="">-- Choisir ton prénom --</option>
          <option value="DAVID">DAVID</option>
          <option value="YAMINE">YAMINE</option>
          <option value="RAPHAEL">RAPHAEL</option>
        </select>

        <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>🚗 Plaque d'immatriculation :</label>
        <input 
          type="text" 
          placeholder="Ex: AB-123-CD" 
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box", background: "#fff", fontSize: "16px" }} 
        />

        <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>📊 Nouveau Kilométrage :</label>
        <input 
          type="number" 
          placeholder="Ex: 45200" 
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
          style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box", background: "#fff", fontSize: "16px" }} 
        />

        <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>💶 Montant du plein (€) :</label>
        <input 
          type="number" 
          step="0.01"
          placeholder="0.00" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box", background: "#fff", fontSize: "16px" }} 
        />

        <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>📸 Photo du ticket :</label>
        <input type="file" style={{ marginBottom: "20px", display: "block", width: "100%" }} />

        <button 
          type="button"
          onClick={handleSend}
          style={{ width: "100%", background: "#000", color: "#fff", padding: "14px", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer", fontSize: "16px" }}
        >
          Envoyer le ticket
        </button>
      </div>
    </main>
  );
}