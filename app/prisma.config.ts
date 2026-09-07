"use client";

import React, { useState } from 'react';

// --- 1. TYPES DE DONNÉES ---
type Client = { id: number; nom: string; telephone: string; adresse: string; montantMensuel: number; };
type Salarie = { id: number; nom: string; poste: string; salaireMensuel: number; primeEmbauche: number; };
type Vehicule = { id: number; modele: string; immatriculation: string; kilometrage: number; };
type Location = { id: number; modele: string; immatriculation: string; agence: string; coutMensuel: number; };
type Carburant = { id: number; date: string; vehiculeId: string; montant: number; };

export default function Home() {
  // --- 2. DONNÉES PRINCIPALES ---
  const [clients, setClients] = useState<Client[]>([]);
  const [salaries, setSalaries] = useState<Salarie[]>([]);
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [carburants, setCarburants] = useState<Carburant[]>([]);

  // --- 3. VARIABLES DES FORMULAIRES ---
  // Clients
  const [clientName, setClientName] = useState(''); const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState(''); const [clientAmount, setClientAmount] = useState('');
  
  // Salariés
  const [salarieName, setSalarieName] = useState(''); const [salariePoste, setSalariePoste] = useState('');
  const [salarieAmount, setSalarieAmount] = useState(''); const [salariePrime, setSalariePrime] = useState('');

  // Véhicules
  const [vehiculeModele, setVehiculeModele] = useState(''); const [vehiculeImmat, setVehiculeImmat] = useState('');
  const [vehiculeKm, setVehiculeKm] = useState('');

  // Locations
  const [locModele, setLocModele] = useState(''); const [locImmat, setLocImmat] = useState('');
  const [locAgence, setLocAgence] = useState(''); const [locCout, setLocCout] = useState('');

  // Carburant
  const [carbDate, setCarbDate] = useState(new Date().toISOString().split('T')[0]);
  const [carbVehicule, setCarbVehicule] = useState(''); const [carbMontant, setCarbMontant] = useState('');

  // Navigation et Édition
  const [activeTab, setActiveTab] = useState('contrats');
  const [editingClientId, setEditingClientId] = useState<number | null>(null);
  const [editClientData, setEditClientData] = useState<Partial<Client>>({});

  // --- 4. FONCTIONS D'AJOUT ---
  const parseMontant = (val: string) => parseFloat(val.toString().replace(',', '.')) || 0;

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientAmount) return;
    setClients([...clients, { id: Date.now(), nom: clientName, telephone: clientPhone, adresse: clientAddress, montantMensuel: parseMontant(clientAmount) }]);
    setClientName(''); setClientPhone(''); setClientAddress(''); setClientAmount('');
    setActiveTab('contrats');
  };

  const handleAddSalarie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!salarieName || !salarieAmount) return;
    setSalaries([...salaries, { id: Date.now(), nom: salarieName, poste: salariePoste, salaireMensuel: parseMontant(salarieAmount), primeEmbauche: parseMontant(salariePrime) }]);
    setSalarieName(''); setSalariePoste(''); setSalarieAmount(''); setSalariePrime('');
  };

  const handleAddVehicule = (e: React.FormEvent) => {
    e.preventDefault();
    setVehicules([...vehicules, { id: Date.now(), modele: vehiculeModele, immatriculation: vehiculeImmat.toUpperCase(), kilometrage: parseInt(vehiculeKm) || 0 }]);
    setVehiculeModele(''); setVehiculeImmat(''); setVehiculeKm('');
  };

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    setLocations([...locations, { id: Date.now(), modele: locModele, immatriculation: locImmat.toUpperCase(), agence: locAgence, coutMensuel: parseMontant(locCout) }]);
    setLocModele(''); setLocImmat(''); setLocAgence(''); setLocCout('');
  };

  const handleAddCarburant = (e: React.FormEvent) => {
    e.preventDefault();
    setCarburants([{ id: Date.now(), date: carbDate, vehiculeId: carbVehicule.toUpperCase(), montant: parseMontant(carbMontant) }, ...carburants]);
    setCarbVehicule(''); setCarbMontant('');
  };

  // --- 5. FONCTIONS DE SUPPRESSION & ÉDITION ---
  const deleteItem = (id: number, setter: any, list: any[], nomItem: string) => {
    if(window.confirm(`Supprimer ce ${nomItem} ?`)) setter(list.filter((i: any) => i.id !== id));
  };

  const saveEditedClient = () => {
    setClients(clients.map(c => c.id === editingClientId ? { ...c, ...editClientData } as Client : c));
    setEditingClientId(null); setEditClientData({});
  };

  // --- 6. CALCULS EN-TÊTE ---
  const formatPrix = (prix: number) => prix.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  const totalMensuelGaranti = clients.reduce((acc, c) => acc + c.montantMensuel, 0);
  const totalSalaires = salaries.reduce((acc, s) => acc + s.salaireMensuel, 0);
  const totalFraisVehicules = locations.reduce((acc, l) => acc + l.coutMensuel, 0) + carburants.reduce((acc, c) => acc + c.montant, 0);

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans pb-20">
      <div className="max-w-6xl mx-auto">
        
        {/* EN-TÊTE */}
        <header className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">STOCK EXPRESS</h1>
            <p className="text-slate-500 font-medium mt-1">Plateforme de gestion intégrée</p>
          </div>
          
          <div className="flex flex-wrap gap-6">
            <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase">Salaires (Base)</p>
              <p className="text-xl font-black text-orange-600">{formatPrix(totalSalaires)} €</p>
            </div>
            <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase">Frais Mobilité</p>
              <p className="text-xl font-black text-rose-600">{formatPrix(totalFraisVehicules)} €</p>
            </div>
            <div className="bg-slate-800 px-5 py-3 rounded-xl shadow-sm">
              <p className="text-xs font-bold text-slate-300 uppercase">Revenus Garanti</p>
              <p className="text-xl font-black text-emerald-400">+{formatPrix(totalMensuelGaranti)} €</p>
            </div>
          </div>
        </header>

        {/* WIDGET PRINCIPAL */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          
          {/* NAVIGATION DES ONGLETS */}
          <div className="flex flex-wrap bg-slate-50 border-b border-slate-200">
            <button onClick={() => setActiveTab('contrats')} className={`px-6 py-4 text-sm font-bold transition flex-grow ${activeTab === 'contrats' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-500 hover:bg-slate-100'}`}>📝 Contrats</button>
            <button onClick={() => setActiveTab('nouveau-client')} className={`px-6 py-4 text-sm font-bold transition flex-grow ${activeTab === 'nouveau-client' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-500 hover:bg-slate-100'}`}>➕ Nouveau Client</button>
            <button onClick={() => setActiveTab('salaries')} className={`px-6 py-4 text-sm font-bold transition flex-grow ${activeTab === 'salaries' ? 'text-orange-600 border-b-2 border-orange-600 bg-white' : 'text-slate-500 hover:bg-slate-100'}`}>👥 Équipe</button>
            <button onClick={() => setActiveTab('vehicules')} className={`px-6 py-4 text-sm font-bold transition flex-grow ${activeTab === 'vehicules' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-500 hover:bg-slate-100'}`}>🚚 Véhicules</button>
            <button onClick={() => setActiveTab('locations')} className={`px-6 py-4 text-sm font-bold transition flex-grow ${activeTab === 'locations' ? 'text-purple-600 border-b-2 border-purple-600 bg-white' : 'text-slate-500 hover:bg-slate-100'}`}>🏷️ Locations</button>
            <button onClick={() => setActiveTab('carburants')} className={`px-6 py-4 text-sm font-bold transition flex-grow ${activeTab === 'carburants' ? 'text-rose-600 border-b-2 border-rose-600 bg-white' : 'text-slate-500 hover:bg-slate-100'}`}>⛽ Carburant</button>
          </div>

          <div className="p-6 md:p-8">
            
            {/* ---------------- ONGLET 1 : CONTRATS ---------------- */}
            {activeTab === 'contrats' && (
              <div className="flex flex-col gap-4">
                {clients.length === 0 && <p className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl">Aucun contrat.</p>}
                {clients.map((client) => (
                  editingClientId === client.id ? (
                    // MODE ÉDITION
                    <div key={client.id} className="bg-indigo-50 p-5 rounded-xl border-2 border-indigo-400">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <input type="text" value={editClientData.nom || ''} onChange={(e) => setEditClientData({...editClientData, nom: e.target.value})} className="border border-indigo-200 p-2 rounded-lg" placeholder="Nom" />
                        <input type="text" value={editClientData.telephone || ''} onChange={(e) => setEditClientData({...editClientData, telephone: e.target.value})} className="border border-indigo-200 p-2 rounded-lg" placeholder="Téléphone" />
                        <input type="text" value={editClientData.adresse || ''} onChange={(e) => setEditClientData({...editClientData, adresse: e.target.value})} className="border border-indigo-200 p-2 rounded-lg md:col-span-2" placeholder="Adresse" />
                        <input type="number" step="0.01" value={editClientData.montantMensuel || ''} onChange={(e) => setEditClientData({...editClientData, montantMensuel: parseFloat(e.target.value) || 0})} className="border border-indigo-200 p-2 rounded-lg font-bold" placeholder="Montant €" />
                      </div>
                      <div className="flex justify-end gap-3 mt-3">
                        <button onClick={() => setEditingClientId(null)} className="px-4 py-2 bg-slate-200 font-bold rounded-lg hover:bg-slate-300">Annuler</button>
                        <button onClick={saveEditedClient} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">Sauvegarder</button>
                      </div>
                    </div>
                  ) : (
                    // MODE LECTURE
                    <div key={client.id} className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{client.nom}</h3>
                        <p className="text-sm text-slate-500">📞 {client.telephone} • 📍 {client.adresse}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-3 md:mt-0">
                        <p className="text-2xl font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg">{formatPrix(client.montantMensuel)} €</p>
                        <button onClick={() => {setEditingClientId(client.id); setEditClientData(client)}} title="Modifier">✏️</button>
                        <button onClick={() => deleteItem(client.id, setClients, clients, 'client')} title="Supprimer">❌</button>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}

            {/* ---------------- ONGLET 2 : NOUVEAU CLIENT ---------------- */}
            {activeTab === 'nouveau-client' && (
              <form onSubmit={handleAddClient} className="max-w-xl mx-auto flex flex-col gap-4">
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Nom de l'entreprise" required />
                <input type="text" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Téléphone" required />
                <input type="text" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} className="border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Adresse complète" required />
                <input type="number" step="0.01" value={clientAmount} onChange={(e) => setClientAmount(e.target.value)} className="border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 font-bold" placeholder="Montant du contrat mensuel (€)" required />
                <button type="submit" className="bg-indigo-600 text-white text-lg font-bold py-3 rounded-xl hover:bg-indigo-700 mt-2">Enregistrer le client</button>
              </form>
            )}

            {/* ---------------- ONGLET 3 : SALARIÉS ---------------- */}
            {activeTab === 'salaries' && (
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                  {salaries.length === 0 && <p className="text-sm text-slate-500">Aucun salarié enregistré.</p>}
                  {salaries.map((s) => (
                    <div key={s.id} className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between shadow-sm">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{s.nom}</h3>
                        <p className="text-sm text-orange-600 font-semibold">👔 {s.poste}</p>
                        {s.primeEmbauche > 0 && <p className="text-xs text-emerald-600 mt-1">✨ Prime embauche : {formatPrix(s.primeEmbauche)} €</p>}
                      </div>
                      <div className="flex items-center gap-4 mt-3 md:mt-0">
                        <p className="text-xl font-black text-slate-700 bg-slate-50 px-4 py-2 rounded-lg">{formatPrix(s.salaireMensuel)} €</p>
                        <button onClick={() => deleteItem(s.id, setSalaries, salaries, 'salarié')}>❌</button>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddSalarie} className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col gap-4">
                  <h3 className="font-bold text-slate-800">Ajouter un membre</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input type="text" value={salarieName} onChange={(e) => setSalarieName(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="Nom complet" required />
                    <input type="text" value={salariePoste} onChange={(e) => setSalariePoste(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="Poste" required />
                    <input type="number" step="0.01" value={salarieAmount} onChange={(e) => setSalarieAmount(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="Salaire (€)" required />
                    <input type="number" step="0.01" value={salariePrime} onChange={(e) => setSalariePrime(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="Prime Embauche (€)" />
                  </div>
                  <button type="submit" className="bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700">+ Enregistrer</button>
                </form>
              </div>
            )}

            {/* ---------------- ONGLET 4 : VÉHICULES PROPRES ---------------- */}
            {activeTab === 'vehicules' && (
              <div className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vehicules.length === 0 && <p className="text-sm text-slate-500 col-span-full">Aucun véhicule enregistré.</p>}
                  {vehicules.map((v) => (
                    <div key={v.id} className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm relative">
                      <button onClick={() => deleteItem(v.id, setVehicules, vehicules, 'véhicule')} className="absolute top-4 right-4">❌</button>
                      <h3 className="text-lg font-bold text-slate-800">{v.modele}</h3>
                      <div className="bg-blue-100 border-2 border-blue-600 text-blue-900 font-black tracking-widest text-center py-2 rounded-lg mt-3 mb-2">{v.immatriculation}</div>
                      <p className="text-sm text-slate-500 text-center">🛣️ {v.kilometrage.toLocaleString('fr-FR')} km</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddVehicule} className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col gap-4">
                  <h3 className="font-bold text-slate-800">Ajouter un véhicule (Flotte propre)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" value={vehiculeModele} onChange={(e) => setVehiculeModele(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Modèle (ex: Renault Master)" required />
                    <input type="text" value={vehiculeImmat} onChange={(e) => setVehiculeImmat(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase" placeholder="Immatriculation (ex: AB-123-CD)" required />
                    <input type="number" value={vehiculeKm} onChange={(e) => setVehiculeKm(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Kilométrage actuel" required />
                  </div>
                  <button type="submit" className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">+ Ajouter à la flotte</button>
                </form>
              </div>
            )}

            {/* ---------------- ONGLET 5 : LOCATIONS DE VÉHICULES ---------------- */}
            {activeTab === 'locations' && (
              <div className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {locations.length === 0 && <p className="text-sm text-slate-500 col-span-full">Aucune location en cours.</p>}
                  {locations.map((l) => (
                    <div key={l.id} className="bg-white p-5 rounded-xl border border-purple-200 shadow-sm flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{l.modele}</h3>
                        <p className="text-sm text-slate-500 mb-1">🏢 Agence : {l.agence}</p>
                        <span className="bg-purple-100 text-purple-900 font-bold px-2 py-1 rounded text-xs">{l.immatriculation}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-purple-700">{formatPrix(l.coutMensuel)} €</p>
                        <p className="text-xs text-slate-400">/ mois</p>
                        <button onClick={() => deleteItem(l.id, setLocations, locations, 'location')} className="mt-2 text-xs text-red-500 hover:underline">Supprimer</button>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddLocation} className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col gap-4">
                  <h3 className="font-bold text-slate-800">Ajouter un véhicule en location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input type="text" value={locModele} onChange={(e) => setLocModele(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Modèle" required />
                    <input type="text" value={locImmat} onChange={(e) => setLocImmat(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-500 uppercase" placeholder="Plaque" required />
                    <input type="text" value={locAgence} onChange={(e) => setLocAgence(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Agence (ex: Hertz)" required />
                    <input type="number" step="0.01" value={locCout} onChange={(e) => setLocCout(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Coût Mensuel (€)" required />
                  </div>
                  <button type="submit" className="bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700">+ Ajouter la location</button>
                </form>
              </div>
            )}

            {/* ---------------- ONGLET 6 : CARBURANT JOURNALIER ---------------- */}
            {activeTab === 'carburants' && (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Formulaire Carburant */}
                <form onSubmit={handleAddCarburant} className="bg-white p-6 rounded-xl border border-rose-200 flex flex-col gap-4 h-fit lg:w-1/3 shadow-sm">
                  <h3 className="font-bold text-slate-800">Saisir un plein</h3>
                  <input type="date" value={carbDate} onChange={(e) => setCarbDate(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-rose-500" required />
                  <input type="text" value={carbVehicule} onChange={(e) => setCarbVehicule(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-rose-500 uppercase" placeholder="Immatriculation" required />
                  <div className="relative">
                    <input type="number" step="0.01" value={carbMontant} onChange={(e) => setCarbMontant(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-rose-500 w-full font-bold" placeholder="Montant en €" required />
                  </div>
                  <button type="submit" className="bg-rose-600 text-white font-bold py-3 rounded-lg hover:bg-rose-700 mt-2">Enregistrer le plein</button>
                </form>

                {/* Liste des pleins */}
                <div className="lg:w-2/3">
                  <h3 className="font-bold text-slate-800 mb-4">Historique Carburant</h3>
                  {carburants.length === 0 && <p className="text-sm text-slate-500">Aucun plein enregistré.</p>}
                  <div className="flex flex-col gap-3">
                    {carburants.map((c) => (
                      <div key={c.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="bg-slate-100 p-2 rounded-lg text-center leading-tight">
                            <p className="text-xs text-slate-400 uppercase font-bold">Date</p>
                            <p className="font-bold text-slate-700">{new Date(c.date).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <span className="font-black text-slate-800 tracking-wider">{c.vehiculeId}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-xl font-black text-rose-600">-{formatPrix(c.montant)} €</p>
                          <button onClick={() => deleteItem(c.id, setCarburants, carburants, 'plein')} className="text-xs text-red-400 hover:underline">Supprimer</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </main>
  );
}