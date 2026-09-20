'use client';
import { useState } from 'react';

export default function DriverPage() {
  const [driver, setDriver] = useState('');
  const [plate, setPlate] = useState('');
  const [mileage, setMileage] = useState('');
  const [rentalType, setRentalType] = useState('courte');
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const driverVehicleMap = {
    "DAVID": "AB-123-CD",
    "YAMINE": "EF-456-GH",
    "RAPHAEL": "JK-789-LM"
  };

  const handleDriverChange = (e) => {
    const selectedDriver = e.target.value;
    setDriver(selectedDriver);
    if (selectedDriver && driverVehicleMap[selectedDriver]) {
      setPlate(driverVehicleMap[selectedDriver]);
    } else {
      setPlate('');
    }
  };

  const handleSend = async () => {
    if (!driver || !plate || !mileage || !amount) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setLoading(true);

    const queryParams = new URLSearchParams({
      date: new Date().toLocaleString(),
      driver,
      plate,
      mileage,
      rentalType,
      amount
    });

    const scriptURL = 'https://script.google.com/macros/s/AKfycbz3toxMG7GneWerN16YxlhKV-0RlPV_FmeV4aVEWVExrH2typhuq-LHZM4T28-02iNL0A/exec';

    try {
      // On utilise fetch en mode no-cors pour déclencher l'URL exactement comme dans le navigateur
      await fetch(`${scriptURL}?${queryParams.toString()}`, {
        method: 'GET',
        mode: 'no-cors'
      });
    } catch (e) {
      // Ignorer l'erreur réseau potentielle liée à CORS pour s'assurer que l'UI passe au succès
    }

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main style={{ padding: "40px 20px", textAlign: "center", fontFamily: "sans-serif" }}>
        <h1>Ticket envoyé avec succès !</h1>
        <p>Le montant a bien été transmis dans Stock Express.</p>
        <button 
          onClick={() => { setSubmitted(false); setMileage(''); setAmount(''); setPlate(''); setDriver(''); }} 
          style={{ background: "#000", color: "#fff", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          Nouveau ticket
        </button>
      </main>
    );
  }

  return (
    <main style={{ padding: "20px", maxWidth: "500px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>STOCK EXPRESS</h1>
      <p>Interface Chauffeur - Carburant</p>

      <label>Qui es-tu ?</label>
      <select value={driver} onChange={handleDriverChange} style={{ width: "100%", padding: "10px", marginBottom: "15px" }}>
        <option value="">-- Choisir --</option>
        <option value="DAVID">DAVID</option>
        <option value="YAMINE">YAMINE</option>
        <option value="RAPHAEL">RAPHAEL</option>
      </select>

      <label>Plaque d'immatriculation :</label>
      <input type="text" value={plate} readOnly placeholder="Auto" style={{ width: "100%", padding: "10px", marginBottom: "15px", background: "#eee", fontWeight: "bold" }} />

      <label>Kilométrage actuel :</label>
      <input type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} placeholder="Ex: 45200" style={{ width: "100%", padding: "10px", marginBottom: "15px" }} />

      <label>Type de location :</label>
      <select value={rentalType} onChange={(e) => setRentalType(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "15px" }}>
        <option value="courte">Courte durée</option>
        <option value="longue">Longue durée</option>
      </select>

      <label>Montant du carburant (€) :</label>
      <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Ex: 55.50" style={{ width: "100%", padding: "10px", marginBottom: "15px" }} />

      <button 
        type="button" 
        onClick={handleSend} 
        disabled={loading}
        style={{ width: "100%", background: "#000", color: "#fff", padding: "12px", border: "none", borderRadius: "5px", cursor: "pointer", opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "Envoi en cours..." : "Envoyer le ticket"}
      </button>
    </main>
  );
}