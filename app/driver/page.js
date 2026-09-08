'use client';
import { useState } from 'react';

export default function DriverPage() {
  const [driver, setDriver] = useState('');
  const [mileage, setMileage] = useState('');
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!driver || !mileage || !amount) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main style={{ padding: "40px 20px", fontFamily: "sans-serif", maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontSize: "24px", color: "green", marginBottom: "15px" }}>✅ Ticket envoyé avec succès !</h1>
        <p style={{ color: "#666", marginBottom: "25px" }}>Merci, vos informations ont bien été transmises.</p>
        <button 
          onClick={() => { setSubmitted(false); setMileage(''); setAmount(''); }}
          style={{ background: "#000", color: "#fff", padding: "12px 20px", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" }}
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
      
      <form onSubmit={handleSubmit} style={{ background: "#f9f9f9", padding: "15px", borderRadius: "8px", border: "1px solid #ddd" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
          👤 Je suis :
        </label>
        <select 
          value={driver} 
          onChange={(e) => setDriver(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
        >
          <option value="">-- Choisir mon nom --</option>
          <option value="Chauffeur 1">Chauffeur 1</option>
          <option value="Chauffeur 2">Chauffeur 2</option>
        </select>

        <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
          Nouveau Kilométrage :
        </label>
        <input 
          type="number" 
          placeholder="Ex: 45200" 
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box" }} 
        />

        <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
          Montant du plein (€) :
        </label>
        <input 
          type="number" 
          step="0.01"
          placeholder="0.00" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box" }} 
        />

        <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
          📸 Photo du ticket :
        </label>
        <input type="file" style={{ marginBottom: "20px", display: "block" }} />

        <button 
          type="submit"
          style={{ width: "100%", background: "#000", color: "#fff", padding: "12px", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" }}
        >
          Envoyer le ticket
        </button>
      </form>
    </main>
  );
}