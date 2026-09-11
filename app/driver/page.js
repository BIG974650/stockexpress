'use client';
import { useState } from 'react';

export default function DriverPage() {
  const [driver, setDriver] = useState('');
  const [plate, setPlate] = useState('');
  const [mileage, setMileage] = useState('');
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);

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

  const handleSend = () => {
    if (!driver || !plate || !mileage || !amount) {
      alert("Veuillez remplir tous les champs obligatoires.");
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
      
Ticket envoye avec succes !
Merci {driver} ({plate}), tes informations ont bien ete transmises.
   { setSubmitted(false); setMileage(''); setAmount(''); setPlate(''); setDriver(''); }}
    style={{ background: "#000", color: "#fff", padding: "12px 20px", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer", width: "100%" }}
  >
    Saisir un autre ticket
);
}
return (
STOCK EXPRESS
Interface Chauffeur - Carburant
Bien le bonjour à toi, qui es-tu ?


-- Choisir ton prénom --

DAVID

YAMINE

RAPHAEL
Envoyer
Plaque d'immatriculation (attitree) :

Nouveau Kilometrage :
setMileage(e.target.value)}
style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box", background: "#fff", fontSize: "16px" }}
/>

Montant du plein (euros) :
setAmount(e.target.value)}
style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box", background: "#fff", fontSize: "16px" }}
/>

Photo du ticket :

Envoyer le ticket

);
}