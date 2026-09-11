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
      alert("Veuillez remplir tous les champs.");
      return;
    }
    const newExpense = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      driver,
      plate,
      mileage,
      amount: parseFloat(amount),
    };
    const existing = JSON.parse(localStorage.getItem('driver_expenses') || '[]');
    localStorage.setItem('driver_expenses', JSON.stringify([newExpense, ...existing]));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      
Ticket envoye avec succes !
Merci {driver} ({plate}).
   { setSubmitted(false); setMileage(''); setAmount(''); setPlate(''); setDriver(''); }} 
    style={{ background: "#000", color: "#fff", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}
  >
    Nouveau ticket
);
}
return (
STOCK EXPRESS
Interface Chauffeur
Qui es-tu ?

-- Choisir --

DAVID

YAMINE

RAPHAEL
Envoyer
  Plaque d'immatriculation :
  

  Kilometrage :
   setMileage(e.target.value)} 
    style={{ width: "100%", padding: "10px", marginBottom: "15px" }} 
  />

  Montant (€) :
   setAmount(e.target.value)} 
    style={{ width: "100%", padding: "10px", marginBottom: "15px" }} 
  />

  
    Envoyer
);
}