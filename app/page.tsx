"use client";
import React, { useState, useEffect } from 'react';
const getLocalDateStr = (d: Date) => { const yyyy = d.getFullYear(); const mm = String(d.getMonth() + 1).padStart(2, '0'); const dd = String(d.getDate()).padStart(2, '0'); return `${yyyy}-${mm}-${dd}`; };
const calcVisitsInMonth = (y: number, m: number, daysInMonth: number, joursTournee: string[]) => { if (!joursTournee || joursTournee.length === 0) return daysInMonth; let count = 0; const dMap: {[key:string]: number} = { 'Dimanche': 0, 'Lundi': 1, 'Mardi': 2, 'Mercredi': 3, 'Jeudi': 4, 'Vendredi': 5, 'Samedi': 6 }; for(let i = 1; i <= daysInMonth; i++) { if (joursTournee.some(j => dMap[j] === new Date(y, m, i).getDay())) count++; } return count || 1; };
type Client = { id: number; nom: string; telephone: string; adresse: string; montantMensuel: number; joursTournee: string[]; };
type Salarie = { id: number; nom: string; poste: string; salaireMensuel: number; primeEmbauche: number; planningFile?: string; vehiculeImmat?: string; telephone?: string; contactUrgence?: string; adresse?: string; permisRecto?: string; permisVerso?: string; vitaleRecto?: string; vitaleVerso?: string; };
type Vehicule = { id: number; modele: string; immatriculation: string; kilometrage: number; assurance: number; };
type Location = { id: number; modele: string; immatriculation: string; agence: string; coutMensuel: number; carburant: number; dateDebut?: string; duree?: 'longue'|'courte'; };
type Carburant = { id: number; date: string; vehiculeId: string; montant: number; photo?: string; };
type DepenseDivers = { id: number; date: string; motif: string; description: string; montant: number; };
type FraisVehicule = { id: number; date: string; vehiculeImmat: string; description: string; montant: number; };
type LivraisonHC = { id: number; date: string; description: string; montant: number; };
type ChargeFixe = { id: number; date: string; nom: string; montant: number; document?: string; };
type TvaEntry = { id: number; date: string; fournisseur: string; montantTva: number; document?: string; };
type CalendarEvent = { id: number; titre: string; jourEntier: boolean; dateDebut: string; heureDebut: string; dateFin: string; heureFin: string; trajet: string; recurrence: string; calendrier: string; alertes: string; couleur?: 'violet'|'jaune'|'bleu'|'vert'; };
const JOURS_SEMAINE = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']; const ALERT_OPTIONS = ["Aucune", "À l'heure de l'évènement", "5 min avant", "10 min avant", "15 min avant", "30 min avant", "1h avant", "1 jour avant", "1 semaine avant"]; const HOURS = Array.from({length: 24}, (_, i) => String(i).padStart(2, '0')); const MINUTES = Array.from({length: 60}, (_, i) => String(i).padStart(2, '0'));
export default function Home() {
  const [clients, setClients] = useState<Client[]>([]); const [salaries, setSalaries] = useState<Salarie[]>([]); const [vehicules, setVehicules] = useState<Vehicule[]>([]); const [locations, setLocations] = useState<Location[]>([]); const [carburants, setCarburants] = useState<Carburant[]>([]); const [depensesDiverses, setDepensesDiverses] = useState<DepenseDivers[]>([]); const [fraisVehicules, setFraisVehicules] = useState<FraisVehicule[]>([]); const [events, setEvents] = useState<CalendarEvent[]>([]); const [livraisonsHC, setLivraisonsHC] = useState<LivraisonHC[]>([]); const [chargesFixes, setChargesFixes] = useState<ChargeFixe[]>([]); const [tvaList, setTvaList] = useState<TvaEntry[]>([]); const [mounted, setMounted] = useState(false); const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => { setMounted(true); const load = (k: string, s: any) => { const v = localStorage.getItem(k); if (v) s(JSON.parse(v)); }; load('se_clients', setClients); load('se_salaries', setSalaries); load('se_vehicules', setVehicules); load('se_locations', setLocations); load('se_carburants', setCarburants); load('se_depenses_diverses', setDepensesDiverses); load('se_frais_vehicules', setFraisVehicules); load('se_events', setEvents); load('se_livraisons_hc', setLivraisonsHC); load('se_charges_fixes', setChargesFixes); load('se_tva_list', setTvaList); const timer = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(timer); }, []);
  useEffect(() => { if (!mounted) return; localStorage.setItem('se_clients', JSON.stringify(clients)); localStorage.setItem('se_salaries', JSON.stringify(salaries)); localStorage.setItem('se_vehicules', JSON.stringify(vehicules)); localStorage.setItem('se_locations', JSON.stringify(locations)); localStorage.setItem('se_carburants', JSON.stringify(carburants)); localStorage.setItem('se_depenses_diverses', JSON.stringify(depensesDiverses)); localStorage.setItem('se_frais_vehicules', JSON.stringify(fraisVehicules)); localStorage.setItem('se_events', JSON.stringify(events)); localStorage.setItem('se_livraisons_hc', JSON.stringify(livraisonsHC)); localStorage.setItem('se_charges_fixes', JSON.stringify(chargesFixes)); localStorage.setItem('se_tva_list', JSON.stringify(tvaList)); }, [clients, salaries, vehicules, locations, carburants, depensesDiverses, fraisVehicules, events, livraisonsHC, chargesFixes, tvaList, mounted]);
  const [clientName, setClientName] = useState(''); const [clientPhone, setClientPhone] = useState(''); const [clientAddress, setClientAddress] = useState(''); const [clientAmount, setClientAmount] = useState(''); const [clientJours, setClientJours] = useState<string[]>(JOURS_SEMAINE); const [salarieName, setSalarieName] = useState(''); const [salariePoste, setSalariePoste] = useState(''); const [salarieAmount, setSalarieAmount] = useState(''); const [salariePrime, setSalariePrime] = useState(''); const [salarieVehicule, setSalarieVehicule] = useState(''); const [salariePhone, setSalariePhone] = useState(''); const [salarieUrgence, setSalarieUrgence] = useState(''); const [salarieAdresse, setSalarieAdresse] = useState(''); const [salariePlanning, setSalariePlanning] = useState<File|null>(null); const [salariePermisRecto, setSalariePermisRecto] = useState<File|null>(null); const [salariePermisVerso, setSalariePermisVerso] = useState<File|null>(null); const [salarieVitaleRecto, setSalarieVitaleRecto] = useState<File|null>(null); const [salarieVitaleVerso, setSalarieVitaleVerso] = useState<File|null>(null); const [vehiculeModele, setVehiculeModele] = useState(''); const [vehiculeImmat, setVehiculeImmat] = useState(''); const [vehiculeKm, setVehiculeKm] = useState(''); const [vehiculeAssurance, setVehiculeAssurance] = useState(''); const [locDate, setLocDate] = useState(getLocalDateStr(new Date())); const [locModele, setLocModele] = useState(''); const [locImmat, setLocImmat] = useState(''); const [locAgence, setLocAgence] = useState(''); const [locCout, setLocCout] = useState(''); const [locDuree, setLocDuree] = useState<'longue'|'courte'>('longue'); const [carbDate, setCarbDate] = useState(getLocalDateStr(new Date())); const [carbVehicule, setCarbVehicule] = useState(''); const [carbMontant, setCarbMontant] = useState(''); const [ddDate, setDdDate] = useState(getLocalDateStr(new Date())); const [ddMotif, setDdMotif] = useState(''); const [ddMotifCustom, setDdMotifCustom] = useState(''); const [ddDesc, setDdDesc] = useState(''); const [ddMontant, setDdMontant] = useState(''); const [fvDate, setFvDate] = useState(getLocalDateStr(new Date())); const [fvVehicule, setFvVehicule] = useState(''); const [fvDesc, setFvDesc] = useState(''); const [fvMontant, setFvMontant] = useState(''); const [hcDate, setHcDate] = useState(getLocalDateStr(new Date())); const [hcDesc, setHcDesc] = useState(''); const [hcMontant, setHcMontant] = useState(''); const [cfDate, setCfDate] = useState(getLocalDateStr(new Date())); const [cfNom, setCfNom] = useState(''); const [cfMontant, setCfMontant] = useState(''); const [cfDoc, setCfDoc] = useState<File|null>(null); const [tvaDate, setTvaDate] = useState(getLocalDateStr(new Date())); const [tvaFournisseur, setTvaFournisseur] = useState(''); const [tvaMontant, setTvaMontant] = useState(''); const [tvaDoc, setTvaDoc] = useState<File|null>(null); const [isScanningTva, setIsScanningTva] = useState(false); const [livreurSalarieId, setLivreurSalarieId] = useState(''); const [livreurUseRental, setLivreurUseRental] = useState(false); const [livreurRentalImmat, setLivreurRentalImmat] = useState(''); const [livreurKm, setLivreurKm] = useState(''); const [livreurMontant, setLivreurMontant] = useState(''); const [livreurPhoto, setLivreurPhoto] = useState<File|null>(null); const [livreurSuccess, setLivreurSuccess] = useState(false); const [activeTab, setActiveTab] = useState('bilan'); const [editingClientId, setEditingClientId] = useState<number|null>(null); const [editClientData, setEditClientData] = useState<Partial<Client>>({}); const [editingVehiculeId, setEditingVehiculeId] = useState<number|null>(null); const [editVehiculeData, setEditVehiculeData] = useState<Partial<Vehicule>>({}); const [editingSalarieId, setEditingSalarieId] = useState<number|null>(null); const [editSalarieData, setEditSalarieData] = useState<Partial<Salarie>>({}); const [viewDocModal, setViewDocModal] = useState<string|null>(null); const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate()); const [isEventModalOpen, setIsEventModalOpen] = useState(false); const [isAlertMenuOpen, setIsAlertMenuOpen] = useState(false); const [editingEventId, setEditingEventId] = useState<number|null>(null); const [selectedHistoryDate, setSelectedHistoryDate] = useState<string|null>(null); const [evTitre, setEvTitre] = useState(''); const [evJourEntier, setEvJourEntier] = useState(false); const [evDateDebut, setEvDateDebut] = useState(getLocalDateStr(new Date())); const [evHeureDebut, setEvHeureDebut] = useState('14:00'); const [evDateFin, setEvDateFin] = useState(getLocalDateStr(new Date())); const [evHeureFin, setEvHeureFin] = useState('15:00'); const [evTrajet, setEvTrajet] = useState('Aucun'); const [evRecurrence, setEvRecurrence] = useState('Jamais'); const [evCalendrier, setEvCalendrier] = useState('Bureau'); const [evAlert, setEvAlert] = useState('Aucune'); const [evCouleur, setEvCouleur] = useState<'violet'|'jaune'|'bleu'|'vert'>('violet');
  if (!mounted) return <div className="min-h-screen bg-slate-100 flex items-center justify-center font-bold text-slate-400">Chargement...</div>;
  const parseMontant = (val: string) => parseFloat(val.toString().replace(',', '.')) || 0;
  const toggleJour = (jour: string, list: string[], setList: (l: string[]) => void) => { list.includes(jour) ? setList(list.filter(j => j !== jour)) : setList([...list, jour]); };
  const deleteItem = (id: number, setter: any, list: any[]) => { if(window.confirm(`Supprimer ?`)) setter(list.filter((i: any) => i.id !== id)); };
  const allPlates = [...vehicules.map(v => ({ id: v.immatriculation, label: `${v.immatriculation} (${v.modele})` })), ...locations.map(l => ({ id: l.immatriculation, label: `${l.immatriculation} (${l.modele} - Loc)` }))];
  const handleAddClient = (e: React.FormEvent) => { e.preventDefault(); if (!clientName || !clientAmount) return; setClients([...clients, { id: Date.now(), nom: clientName, telephone: clientPhone, adresse: clientAddress, montantMensuel: parseMontant(clientAmount), joursTournee: clientJours }]); setClientName(''); setClientPhone(''); setClientAddress(''); setClientAmount(''); setClientJours(JOURS_SEMAINE); setActiveTab('contrats'); };
  const handleAddSalarie = (e: React.FormEvent) => { e.preventDefault(); if (!salarieName || !salarieAmount) return; setSalaries([...salaries, { id: Date.now(), nom: salarieName, poste: salariePoste, salaireMensuel: parseMontant(salarieAmount), primeEmbauche: parseMontant(salariePrime), planningFile: salariePlanning ? salariePlanning.name : undefined, vehiculeImmat: salarieVehicule || undefined, telephone: salariePhone, contactUrgence: salarieUrgence, adresse: salarieAdresse, permisRecto: salariePermisRecto ? salariePermisRecto.name : undefined, permisVerso: salariePermisVerso ? salariePermisVerso.name : undefined, vitaleRecto: salarieVitaleRecto ? salarieVitaleRecto.name : undefined, vitaleVerso: salarieVitaleVerso ? salarieVitaleVerso.name : undefined }]); if (salariePlanning) { const nouveauxEvents: CalendarEvent[] = []; const PERIODES_ECOLE = [ { debut: new Date('2026-04-07'), fin: new Date('2026-04-24') }, { debut: new Date('2026-05-18'), fin: new Date('2026-05-22') }, { debut: new Date('2026-06-08'), fin: new Date('2026-06-26') }, { debut: new Date('2026-07-06'), fin: new Date('2026-07-24') }, { debut: new Date('2026-08-10'), fin: new Date('2026-08-14') }, { debut: new Date('2026-09-07'), fin: new Date('2026-09-22') } ]; let loopDate = new Date('2026-04-07'); const endDate = new Date('2026-09-22'); while (loopDate <= endDate) { if (loopDate.getDay() !== 0 && loopDate.getDay() !== 6) { let isEcole = false; for (let p of PERIODES_ECOLE) { if (loopDate >= p.debut && loopDate <= p.fin) { isEcole = true; break; } } nouveauxEvents.push({ id: Date.now() + Math.floor(Math.random()*1000000), titre: isEcole ? `🎓 École - ${salarieName}` : `🏢 Entreprise - ${salarieName}`, jourEntier: true, dateDebut: getLocalDateStr(loopDate), heureDebut: '08:00', dateFin: getLocalDateStr(loopDate), heureFin: '17:00', trajet: 'Aucun', recurrence: 'Jamais', calendrier: 'Bureau', alertes: 'Aucune', couleur: isEcole ? 'bleu' : 'jaune' }); } loopDate.setDate(loopDate.getDate() + 1); } setEvents(prev => [...prev, ...nouveauxEvents]); } setSalarieName(''); setSalariePoste(''); setSalarieAmount(''); setSalariePrime(''); setSalarieVehicule(''); setSalariePhone(''); setSalarieUrgence(''); setSalarieAdresse(''); setSalariePlanning(null); setSalariePermisRecto(null); setSalariePermisVerso(null); setSalarieVitaleRecto(null); setSalarieVitaleVerso(null); };
  const handleDeleteSalarie = (id: number) => { const s = salaries.find(x => x.id === id); if (!s) return; if (window.confirm(`Supprimer ${s.nom} ?`)) { setSalaries(salaries.filter(x => x.id !== id)); setEvents(events.filter(e => !e.titre.includes(`- ${s.nom}`))); } };
  const handleAddVehicule = (e: React.FormEvent) => { e.preventDefault(); setVehicules([...vehicules, { id: Date.now(), modele: vehiculeModele, immatriculation: vehiculeImmat.toUpperCase(), kilometrage: parseInt(vehiculeKm) || 0, assurance: parseMontant(vehiculeAssurance) }]); setVehiculeModele(''); setVehiculeImmat(''); setVehiculeKm(''); setVehiculeAssurance(''); };
  const handleAddLocation = (e: React.FormEvent) => { e.preventDefault(); setLocations([...locations, { id: Date.now(), modele: locModele, immatriculation: locImmat.toUpperCase(), agence: locAgence, coutMensuel: parseMontant(locCout), carburant: 0, dateDebut: locDate, duree: locDuree }]); setLocDate(getLocalDateStr(new Date())); setLocModele(''); setLocImmat(''); setLocAgence(''); setLocCout(''); setLocDuree('longue'); };
  const handleAddCarburant = (e: React.FormEvent) => { e.preventDefault(); if (!carbVehicule || !carbMontant) return; setCarburants([{ id: Date.now(), date: carbDate, vehiculeId: carbVehicule.toUpperCase(), montant: parseMontant(carbMontant) }, ...carburants]); setCarbVehicule(''); setCarbMontant(''); };
  const handleAddDepenseDivers = (e: React.FormEvent) => { e.preventDefault(); const finalMotif = ddMotif === 'Autre' ? ddMotifCustom : ddMotif; if (!finalMotif || !ddDesc || !ddMontant) return; setDepensesDiverses([{ id: Date.now(), date: ddDate, motif: finalMotif, description: ddDesc, montant: parseMontant(ddMontant) }, ...depensesDiverses]); setDdMotif(''); setDdMotifCustom(''); setDdDesc(''); setDdMontant(''); };
  const handleAddFraisVehicule = (e: React.FormEvent) => { e.preventDefault(); if (!fvVehicule || !fvMontant) return; setFraisVehicules([{ id: Date.now(), date: fvDate, vehiculeImmat: fvVehicule.toUpperCase(), description: fvDesc, montant: parseMontant(fvMontant) }, ...fraisVehicules]); setFvVehicule(''); setFvDesc(''); setFvMontant(''); };
  const handleAddLivraisonHC = (e: React.FormEvent) => { e.preventDefault(); if (!hcDesc || !hcMontant) return; setLivraisonsHC([{ id: Date.now(), date: hcDate, description: hcDesc, montant: parseMontant(hcMontant) }, ...livraisonsHC]); setHcDesc(''); setHcMontant(''); };
  const handleAddChargeFixe = (e: React.FormEvent) => { e.preventDefault(); if (!cfNom || !cfMontant) return; setChargesFixes([{ id: Date.now(), date: cfDate, nom: cfNom, montant: parseMontant(cfMontant), document: cfDoc ? cfDoc.name : undefined }, ...chargesFixes]); setCfNom(''); setCfMontant(''); setCfDoc(null); };
  const handleAddLivreurFuel = (e: React.FormEvent) => { e.preventDefault(); const s = salaries.find(x => x.id.toString() === livreurSalarieId); if (!s || !livreurMontant || !livreurKm) return; const finalImmat = (livreurUseRental || !s.vehiculeImmat) ? livreurRentalImmat : s.vehiculeImmat; if (!finalImmat) return alert("Veuillez sélectionner un véhicule."); const km = parseInt(livreurKm); setCarburants([{ id: Date.now(), date: getLocalDateStr(new Date()), vehiculeId: finalImmat, montant: parseMontant(livreurMontant), photo: livreurPhoto ? livreurPhoto.name : undefined }, ...carburants]); if (!livreurUseRental) { setVehicules(vehicules.map(v => v.immatriculation === finalImmat ? { ...v, kilometrage: Math.max(v.kilometrage, km) } : v)); } setLivreurSuccess(true); setLivreurKm(''); setLivreurMontant(''); setLivreurPhoto(null); setLivreurRentalImmat(''); setLivreurUseRental(false); setLivreurSalarieId(''); setTimeout(() => setLivreurSuccess(false), 3000); };
  const handleTvaScan = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; setTvaDoc(file); setIsScanningTva(true); setTimeout(() => { setTvaMontant((Math.random() * 80 + 5).toFixed(2)); setIsScanningTva(false); }, 2000); };
  const handleAddTva = (e: React.FormEvent) => { e.preventDefault(); if (!tvaFournisseur || !tvaMontant) return; setTvaList([{ id: Date.now(), date: tvaDate, fournisseur: tvaFournisseur, montantTva: parseMontant(tvaMontant), document: tvaDoc ? tvaDoc.name : undefined }, ...tvaList]); setTvaFournisseur(''); setTvaMontant(''); setTvaDoc(null); };
  const saveEditedClient = () => { setClients(clients.map(c => c.id === editingClientId ? { ...c, ...editClientData } as Client : c)); setEditingClientId(null); setEditClientData({}); };
  const saveEditedVehicule = () => { const oldVehicule = vehicules.find(v => v.id === editingVehiculeId); const newImmat = editVehiculeData.immatriculation?.toUpperCase(); if (oldVehicule && newImmat && oldVehicule.immatriculation !== newImmat) { setCarburants(carburants.map(c => c.vehiculeId === oldVehicule.immatriculation ? { ...c, vehiculeId: newImmat } : c)); setFraisVehicules(fraisVehicules.map(f => f.vehiculeImmat === oldVehicule.immatriculation ? { ...f, vehiculeImmat: newImmat } : f)); } setVehicules(vehicules.map(v => v.id === editingVehiculeId ? { ...v, ...editVehiculeData, immatriculation: newImmat || v.immatriculation } as Vehicule : v)); setEditingVehiculeId(null); setEditVehiculeData({}); };
  const saveEditedSalarie = () => { setSalaries(salaries.map(s => s.id === editingSalarieId ? { ...s, ...editSalarieData, vehiculeImmat: editSalarieData.vehiculeImmat || undefined } as Salarie : s)); setEditingSalarieId(null); setEditSalarieData({}); };
  const clearAllEvents = () => { if(window.confirm("Effacer TOUS les évènements ?")) setEvents([]); };
  const openNewEventModal = (dStr: string) => { setEditingEventId(null); setEvTitre(''); setEvJourEntier(false); setEvDateDebut(dStr); setEvHeureDebut('08:00'); setEvDateFin(dStr); setEvHeureFin('09:00'); setEvTrajet('Aucun'); setEvRecurrence('Jamais'); setEvCalendrier('Bureau'); setEvAlert('Aucune'); setEvCouleur('violet'); setIsEventModalOpen(true); };
  const openEditEventModal = (ev: CalendarEvent) => { setEditingEventId(ev.id); setEvTitre(ev.titre); setEvJourEntier(ev.jourEntier); setEvDateDebut(ev.dateDebut); setEvHeureDebut(ev.heureDebut); setEvDateFin(ev.dateFin); setEvHeureFin(ev.heureFin); setEvTrajet(ev.trajet); setEvRecurrence(ev.recurrence); setEvCalendrier(ev.calendrier); setEvAlert(ev.alertes); setEvCouleur(ev.couleur || 'violet'); setIsEventModalOpen(true); };
  const handleSaveEvent = () => { const t = evTitre.trim() !== '' ? evTitre : 'Nouvel évènement'; if (editingEventId) setEvents(events.map(e => e.id === editingEventId ? { ...e, titre: t, jourEntier: evJourEntier, dateDebut: evDateDebut, heureDebut: evHeureDebut, dateFin: evDateFin, heureFin: evHeureFin, trajet: evTrajet, recurrence: evRecurrence, calendrier: evCalendrier, alertes: evAlert, couleur: evCouleur } : e)); else setEvents([...events, { id: Date.now(), titre: t, jourEntier: evJourEntier, dateDebut: evDateDebut, heureDebut: evHeureDebut, dateFin: evDateFin, heureFin: evHeureFin, trajet: evTrajet, recurrence: evRecurrence, calendrier: evCalendrier, alertes: evAlert, couleur: evCouleur }]); setIsEventModalOpen(false); setEditingEventId(null); };
  const handleDeleteEvent = () => { if(window.confirm(`Supprimer cet évènement ?`)) { setEvents(events.filter(e => e.id !== editingEventId)); setIsEventModalOpen(false); setEditingEventId(null); } };

  const formatPrix = (prix: number) => prix.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  const totalSalaires = salaries.reduce((acc, s) => acc + (s.salaireMensuel - s.primeEmbauche), 0);
  const totalChargesFixes = chargesFixes.reduce((acc, c) => acc + c.montant, 0); 
  const totalTvaRecuperable = tvaList.reduce((acc, t) => acc + t.montantTva, 0);

  const annee = currentTime.getFullYear(); const mois = currentTime.getMonth(); const today = currentTime.getDate(); const joursDansLeMois = new Date(annee, mois + 1, 0).getDate();
  const monthName = currentTime.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }); const currentDayStr = currentTime.toLocaleDateString('fr-FR', { weekday: 'long' }); const jourActuel = currentDayStr.charAt(0).toUpperCase() + currentDayStr.slice(1);

  const getBilanForDate = (dateObj: Date) => {
    const a = dateObj.getFullYear(); const m = dateObj.getMonth(); const jDansMois = new Date(a, m + 1, 0).getDate();
    const jActuel = dateObj.toLocaleDateString('fr-FR', { weekday: 'long' }).charAt(0).toUpperCase() + dateObj.toLocaleDateString('fr-FR', { weekday: 'long' }).slice(1);
    const dStr = getLocalDateStr(dateObj);
    const cls = clients.filter(c => (c.joursTournee || JOURS_SEMAINE).includes(jActuel));
    const detailsContrats = cls.map(c => ({ label: `Contrat: ${c.nom}`, montant: c.montantMensuel / calcVisitsInMonth(a, m, jDansMois, c.joursTournee || JOURS_SEMAINE) }));
    const hcList = livraisonsHC.filter(l => l.date === dStr);
    const detailsHC = hcList.map(l => ({ label: `Hors Contrat: ${l.description}`, montant: l.montant }));
    const gain = detailsContrats.reduce((acc, curr) => acc + curr.montant, 0) + detailsHC.reduce((acc, curr) => acc + curr.montant, 0);
    const sal = totalSalaires / jDansMois; const loc = locations.reduce((acc, l) => acc + l.coutMensuel, 0) / jDansMois; const ass = vehicules.reduce((acc, v) => acc + (v.assurance || 0), 0) / jDansMois; const cFixes = totalChargesFixes / jDansMois;
    const listGas = carburants.filter(c => c.date === dStr); const listDepDiv = depensesDiverses.filter(d => d.date === dStr); const listFVeh = fraisVehicules.filter(f => f.date === dStr);
    const gas = listGas.reduce((acc, c) => acc + c.montant, 0); const depDiv = listDepDiv.reduce((acc, d) => acc + d.montant, 0); const fVeh = listFVeh.reduce((acc, f) => acc + f.montant, 0);
    const depense = sal + loc + ass + cFixes + gas + depDiv + fVeh;
    const detailsDJ = [ { label: 'Salaires (Part journalière)', montant: sal }, { label: 'Locations (Part journalière)', montant: loc }, { label: 'Assurances (Part journalière)', montant: ass }, { label: 'Charges Fixes (Part journalière)', montant: cFixes }, ...listGas.map(c => ({ label: `Gasoil (${c.vehiculeId})`, montant: c.montant })), ...listFVeh.map(f => ({ label: `Entretien (${f.vehiculeImmat} - ${f.description})`, montant: f.montant })), ...listDepDiv.map(d => ({ label: `Dépense Div. (${d.motif}) - ${d.description}`, montant: d.montant })) ].filter(item => item.montant > 0);
    return { dateStr: dStr, dateAffichage: dateObj.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' }), gain, depense, benefice: gain - depense, detailsGJ: [...detailsContrats, ...detailsHC], detailsDJ };
  };

  const historiqueBilan = Array.from({length: 14}, (_, i) => { const d = new Date(currentTime); d.setDate(d.getDate() - i); return getBilanForDate(d); });
  const bilanAujourdhui = getBilanForDate(currentTime);
  const revenusMoisGlobal = clients.reduce((acc, c) => acc + c.montantMensuel, 0) + livraisonsHC.filter(l => l.date.startsWith(`${annee}-${String(mois + 1).padStart(2, '0')}`)).reduce((acc, l) => acc + l.montant, 0);

  const AnalogClock = ({ time }: { time: Date }) => {
    const seconds = time.getSeconds(); const minutes = time.getMinutes(); const hours = time.getHours();
    const secondDeg = seconds * 6; const minuteDeg = minutes * 6 + seconds * 0.1; const hourDeg = (hours % 12) * 30 + minutes * 0.5;
    return (
      <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-sm"><circle cx="50" cy="50" r="48" fill="white" stroke="#e2e8f0" strokeWidth="2" />
        {[...Array(12)].map((_, i) => <line key={i} x1="50" y1="6" x2="50" y2="12" transform={`rotate(${i * 30} 50 50)`} stroke={i % 3 === 0 ? "#475569" : "#cbd5e1"} strokeWidth={i % 3 === 0 ? "3" : "2"} strokeLinecap="round" />)}
        <line x1="50" y1="50" x2="50" y2="28" transform={`rotate(${hourDeg} 50 50)`} stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="50" y1="50" x2="50" y2="16" transform={`rotate(${minuteDeg} 50 50)`} stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
        <line x1="50" y1="50" x2="50" y2="12" transform={`rotate(${secondDeg} 50 50)`} stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" /><circle cx="50" cy="50" r="3" fill="#ef4444" />
      </svg>
    );
  };

  const renderCalendarWidget = () => {
    const firstDay = new Date(annee, mois, 1).getDay(); const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    const daysArray = []; for (let i = 0; i < startOffset; i++) daysArray.push(null);
    for (let i = 1; i <= joursDansLeMois; i++) daysArray.push(i);
    const joursLettres = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    const selectedDateStr = `${annee}-${String(mois + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    const eventsSelectedDay = events.filter(e => e.dateDebut === selectedDateStr);
    const displayDate = new Date(annee, mois, selectedDay);
    return (
      <div className="bg-[#f2f2f7] p-5 rounded-[2rem] shadow-sm flex flex-col md:flex-row gap-6 w-full md:w-fit mt-4">
        <div className="flex flex-col justify-center bg-white p-4 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-2 px-1"><p className="font-bold text-slate-800 capitalize">{monthName}</p><button onClick={clearAllEvents} className="text-red-400 hover:text-red-600 transition-colors" title="Vider tout le calendrier">🗑️</button></div>
          <div className="grid grid-cols-7 gap-x-2 text-[10px] font-bold mb-2 text-center">{joursLettres.map((j, idx) => <span key={idx} className={idx === 5 ? 'text-blue-500' : idx === 6 ? 'text-red-500' : 'text-slate-800'}>{j}</span>)}</div>
          <div className="grid grid-cols-7 gap-x-2 gap-y-1 text-xs text-center font-medium">
            {daysArray.map((day, idx) => {
              if (!day) return <div key={idx} className="w-7 h-7"></div>;
              const loopDateStr = `${annee}-${String(mois + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`; const dayEvents = events.filter(e => e.dateDebut === loopDateStr); const hasEvent = dayEvents.length > 0; const isSelected = day === selectedDay; const isToday = day === today;
              let textColor = 'text-slate-800'; let bgColor = '';
              if (isSelected) { bgColor = isToday ? 'bg-red-500' : 'bg-slate-800'; textColor = 'text-white'; } else if (isToday) { textColor = 'text-red-500 font-bold'; } else if ((idx % 7) === 5) { textColor = 'text-blue-500'; } else if ((idx % 7) === 6) { textColor = 'text-red-500'; }
              return (
                <div key={idx} className="flex flex-col items-center justify-start h-10 cursor-pointer" onClick={() => { setSelectedDay(day); if (hasEvent && isSelected) openEditEventModal(dayEvents[0]); }}>
                  <span className={`w-7 h-7 flex items-center justify-center rounded-full ${bgColor} ${textColor}`}>{day}</span>
                  {hasEvent && (<div className="flex gap-0.5 mt-0.5">{dayEvents.slice(0, 3).map((ev, i) => { let dotColor = "bg-purple-500"; if (ev.couleur === 'jaune') dotColor = "bg-yellow-500"; if (ev.couleur === 'bleu') dotColor = "bg-blue-500"; if (ev.couleur === 'vert') dotColor = "bg-green-500"; return <div key={i} className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div>; })}</div>)}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col py-1 min-w-[220px]">
          <div className="flex justify-between items-start gap-4 mb-4"><div><h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{selectedDay} {displayDate.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '')}</h2></div><button onClick={() => openNewEventModal(selectedDateStr)} className="text-slate-500 bg-white hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center font-light text-xl transition-colors pb-0.5 shadow-sm ml-auto">+</button></div>
          <div className="bg-white/60 p-3 rounded-2xl flex-grow flex flex-col justify-start">
            {eventsSelectedDay.length === 0 ? ( <div className="my-auto text-center"><p className="text-sm text-slate-800 font-medium">Aucun événement</p></div> ) : (
              <div className="flex flex-col gap-2 max-h-32 overflow-y-auto pr-1">
                {eventsSelectedDay.map(ev => {
                  let badgeColors = "bg-purple-100/50 border-purple-500 text-purple-900"; if (ev.couleur === 'jaune') badgeColors = "bg-yellow-100/50 border-yellow-500 text-yellow-900"; if (ev.couleur === 'bleu') badgeColors = "bg-blue-100/50 border-blue-500 text-blue-900"; if (ev.couleur === 'vert') badgeColors = "bg-green-100/50 border-green-500 text-green-900";
                  return (<div key={ev.id} onClick={() => openEditEventModal(ev)} className={`border-l-4 pl-2 pr-2 py-1.5 rounded cursor-pointer ${badgeColors}`}><p className="text-sm font-bold truncate">{ev.titre}</p><p className="text-[10px] font-medium opacity-80">{ev.jourEntier ? 'Jour entier' : `${ev.heureDebut} à ${ev.heureFin}`}</p></div>);
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const TABS = [
    { id: 'saisie-livreur', label: '📱 DRIVER', activeClass: 'bg-sky-50 text-sky-700 border-sky-500 shadow-md scale-105' },
    { id: 'bilan', label: '📊 Bilan Jour', activeClass: 'bg-emerald-50 text-emerald-700 border-emerald-500 shadow-md scale-105' },
    { id: 'historique', label: '🕰️ Historique', activeClass: 'bg-emerald-50 text-emerald-700 border-emerald-500 shadow-md scale-105' },
    { id: 'contrats', label: '📝 Contrats', activeClass: 'bg-indigo-50 text-indigo-700 border-indigo-500 shadow-md scale-105' },
    { id: 'nouveau-client', label: '➕ Nouveau Client', activeClass: 'bg-indigo-50 text-indigo-700 border-indigo-500 shadow-md scale-105' },
    { id: 'hors-contrat', label: '📦 Hors Contrat', activeClass: 'bg-emerald-50 text-emerald-700 border-emerald-500 shadow-md scale-105' },
    { id: 'charges-fixes', label: '🏦 Charges Fixes', activeClass: 'bg-slate-100 text-slate-800 border-slate-600 shadow-md scale-105' },
    { id: 'tva', label: '🧾 Gestion TVA', activeClass: 'bg-blue-50 text-blue-700 border-blue-500 shadow-md scale-105' },
    { id: 'salaries', label: '👥 Équipe', activeClass: 'bg-orange-50 text-orange-700 border-orange-500 shadow-md scale-105' },
    { id: 'vehicules', label: '🚚 Véhicules & Loc.', activeClass: 'bg-blue-50 text-blue-700 border-blue-500 shadow-md scale-105' },
    { id: 'depenses-div', label: '💸 Dépenses Div.', activeClass: 'bg-red-50 text-red-700 border-red-500 shadow-md scale-105' }
  ];

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans pb-20 relative">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-slate-200 pb-6">
          <div><h1 className="text-4xl font-black text-slate-800 tracking-tight">STOCK EXPRESS</h1><p className="text-slate-500 font-medium mt-1">Plateforme de gestion intégrée</p></div>
          <div className="flex flex-wrap gap-6">
            <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-slate-200"><p className="text-xs font-bold text-slate-400 uppercase">Salaires (Mois)</p><p className="text-xl font-black text-orange-600">{formatPrix(totalSalaires)} €</p></div>
            <div className="bg-slate-800 px-5 py-3 rounded-xl shadow-sm"><p className="text-xs font-bold text-slate-300 uppercase">Revenus (Contrats + HC)</p><p className="text-xl font-black text-emerald-400">+{formatPrix(revenusMoisGlobal)} €</p></div>
          </div>
        </header>

        <div className="flex flex-col xl:flex-row gap-6 items-start">
          <div className="w-full xl:w-72 flex-shrink-0 flex flex-col gap-2 overflow-x-auto no-scrollbar pb-2 xl:pb-0 p-1">
            {TABS.map(t => ( <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-3 xl:px-5 xl:py-4 text-sm font-bold transition-all duration-200 transform rounded-xl whitespace-nowrap text-left border-2 outline-none ${activeTab === t.id ? t.activeClass : 'border-transparent text-slate-500 hover:bg-white hover:shadow-sm hover:text-slate-800 hover:scale-105'}`}>{t.label}</button> ))}
          </div>

          <div className="flex-1 w-full min-w-0 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 md:p-8">
            
            {activeTab === 'saisie-livreur' && (() => {
              const activeSalarie = salaries.find(s => s.id.toString() === livreurSalarieId);
              return (
                <div className="max-w-md mx-auto bg-white p-6 rounded-3xl shadow-xl border border-slate-200 my-10">
                  <div className="text-center mb-6"><div className="w-16 h-16 bg-sky-100 text-sky-500 rounded-full flex items-center justify-center mx-auto mb-2 text-3xl">⛽</div><h2 className="text-2xl font-black text-slate-800">DRIVER - Carburant</h2><p className="text-sm text-slate-500 mt-1">Interface pour smartphone</p></div>
                  {livreurSuccess && <div className="bg-emerald-100 text-emerald-700 p-4 rounded-xl mb-6 text-center font-bold shadow-sm">✅ Ticket enregistré avec succès !</div>}
                  <form onSubmit={handleAddLivreurFuel} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2"><label className="text-xs font-bold text-slate-500 uppercase ml-1">👤 Je suis :</label><select value={livreurSalarieId} onChange={e => { setLivreurSalarieId(e.target.value); setLivreurUseRental(false); setLivreurRentalImmat(''); }} className="border-2 border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-sky-500 bg-slate-50 font-bold text-slate-700" required><option value="">-- Choisir mon nom --</option>{salaries.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}</select></div>
                    {activeSalarie && (
                      <div className="flex flex-col gap-3 bg-slate-50 p-4 rounded-xl border-2 border-slate-200">
                        <label className="text-xs font-bold text-slate-500 uppercase">🚚 Véhicule utilisé</label>
                        {!livreurUseRental && activeSalarie.vehiculeImmat ? (<div className="font-black text-slate-800 text-lg border-2 border-transparent p-2 bg-white rounded-lg">{activeSalarie.vehiculeImmat} <span className="text-xs text-emerald-500 ml-2 bg-emerald-100 px-2 py-1 rounded font-bold">Attribué</span></div>) : (<select value={livreurRentalImmat} onChange={e=>setLivreurRentalImmat(e.target.value)} className="border-2 border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-sky-500 bg-white font-bold text-slate-700" required={livreurUseRental || !activeSalarie.vehiculeImmat}><option value="">-- Véhicule de location --</option>{locations.map(l => <option key={l.immatriculation} value={l.immatriculation}>{l.immatriculation} ({l.modele})</option>)}</select>)}
                        {locations.length > 0 && activeSalarie.vehiculeImmat && (<label className="flex items-center gap-2 mt-2 cursor-pointer border-t border-slate-200 pt-3"><input type="checkbox" checked={livreurUseRental} onChange={e => setLivreurUseRental(e.target.checked)} className="w-5 h-5 text-sky-500 rounded focus:ring-sky-500" /><span className="text-sm font-bold text-slate-600">J'utilise une location aujourd'hui</span></label>)}
                      </div>
                    )}
                    <div className="flex flex-col gap-2"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Nouveau Kilométrage</label><input type="number" value={livreurKm} onChange={e=>setLivreurKm(e.target.value)} className="border-2 border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-sky-500 bg-slate-50 font-bold text-slate-700" placeholder="Ex: 45200" required /></div>
                    <div className="flex flex-col gap-2"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Montant du plein (€)</label><input type="number" step="0.01" value={livreurMontant} onChange={e=>setLivreurMontant(e.target.value)} className="border-2 border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-sky-500 bg-slate-50 font-black text-2xl text-sky-600" placeholder="0.00" required /></div>
                    <div className="flex flex-col gap-2 mt-2"><label className="text-xs font-bold text-slate-500 uppercase ml-1">📸 Photo du ticket</label><input id="livreurPhotoInput" type="file" accept="image/*" capture="environment" onChange={e=>setLivreurPhoto(e.target.files?.[0]||null)} className="border-2 border-dashed border-sky-300 p-6 rounded-xl text-sm bg-sky-50 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-sky-500 file:text-white hover:file:bg-sky-600 text-slate-500 text-center" required /></div>
                    <button type="submit" className="bg-sky-500 text-white font-black py-4 rounded-xl hover:bg-sky-600 mt-4 shadow-lg shadow-sky-200 text-lg uppercase tracking-wide">Envoyer le ticket</button>
                  </form>
                </div>
              );
            })()}

            {activeTab === 'bilan' && (
              <div className="flex flex-col gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center flex-wrap gap-4"><p className="text-sm text-slate-500">Calcul en temps réel pour la tournée de : <strong className="text-slate-800 uppercase">{jourActuel}</strong>.</p><p className="text-xs text-slate-400 bg-white px-3 py-1 rounded border border-slate-200">🔄 Mise à jour auto à 00:01</p></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-200"><h3 className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-4">Gain du Jour (GJ)</h3><p className="text-4xl font-black text-slate-800">+{formatPrix(bilanAujourdhui.gain)} €</p><div className="mt-4 pt-4 border-t border-slate-100"><p className="text-xs font-bold text-slate-500 mb-2">Détails des gains d'aujourd'hui :</p><div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-2">{bilanAujourdhui.detailsGJ.length === 0 ? <span className="text-xs text-slate-400 italic">Aucun gain.</span> : null}{bilanAujourdhui.detailsGJ.map((item, idx) => (<div key={idx} className="flex justify-between text-xs text-slate-600"><span>• {item.label}</span><span className="font-bold text-emerald-600">+{formatPrix(item.montant)} €</span></div>))}</div></div></div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-200"><h3 className="text-rose-600 font-bold uppercase tracking-widest text-sm mb-4">Dépense du Jour (DJ)</h3><p className="text-4xl font-black text-slate-800">-{formatPrix(bilanAujourdhui.depense)} €</p><div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2 max-h-40 overflow-y-auto pr-2">{bilanAujourdhui.detailsDJ.length === 0 ? <span className="text-xs text-slate-400 italic">Aucune dépense.</span> : null}{bilanAujourdhui.detailsDJ.map((item, idx) => (<div key={idx} className="flex justify-between text-xs text-slate-600"><span>{item.label}</span><span className="font-bold text-rose-500">-{formatPrix(item.montant)} €</span></div>))}</div></div>
                  <div className={`p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-center ${bilanAujourdhui.benefice >= 0 ? 'bg-slate-800 border-b-4 border-emerald-400' : 'bg-red-50 border-b-4 border-red-500'}`}><h3 className={`font-bold uppercase tracking-widest text-sm mb-4 ${bilanAujourdhui.benefice >= 0 ? 'text-slate-400' : 'text-red-700'}`}>Bénéfice du Jour (BJ)</h3><p className={`text-5xl font-black ${bilanAujourdhui.benefice >= 0 ? 'text-white' : 'text-red-600'}`}>{bilanAujourdhui.benefice > 0 ? '+' : ''}{formatPrix(bilanAujourdhui.benefice)} €</p><div className="mt-6 pt-4 border-t border-slate-600/30"><p className={`text-xs font-medium flex justify-between ${bilanAujourdhui.benefice >= 0 ? 'text-emerald-400' : 'text-red-700'}`}>Calcul: GJ - DJ</p></div></div>
                </div>
              </div>
            )}

            {activeTab === 'historique' && (
              <div className="flex flex-col gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center"><div><h2 className="text-xl font-bold text-slate-800">Historique des 14 derniers jours</h2><p className="text-sm text-slate-500">Cliquez sur une date pour voir le détail des gains et dépenses de ce jour.</p></div></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {historiqueBilan.map((h, i) => (
                    <div key={i} onClick={() => setSelectedHistoryDate(h.dateStr)} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer relative group"><h3 className="font-bold text-slate-700 capitalize border-b border-slate-100 pb-2 mb-3 pr-6">{h.dateAffichage} {i === 0 ? " (Auj.)" : ""}</h3><div className="flex justify-between text-sm mb-1"><span className="text-slate-500">Gain (GJ)</span><span className="font-bold text-emerald-600">+{formatPrix(h.gain)} €</span></div><div className="flex justify-between text-sm mb-3"><span className="text-slate-500">Dépense (DJ)</span><span className="font-bold text-rose-600">-{formatPrix(h.depense)} €</span></div><div className={`p-3 rounded-lg flex justify-between items-center ${h.benefice >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}><span className={`font-bold ${h.benefice >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>BJ</span><span className={`text-lg font-black ${h.benefice >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{h.benefice > 0 ? '+' : ''}{formatPrix(h.benefice)} €</span></div></div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tva' && (
              <div className="flex flex-col lg:flex-row gap-8">
                <form onSubmit={handleAddTva} className="bg-slate-800 text-white p-6 rounded-xl border border-slate-700 flex flex-col gap-4 h-fit lg:w-1/3 shadow-md relative overflow-hidden">
                  {isScanningTva && (<div className="absolute inset-0 bg-slate-900/90 z-10 flex flex-col items-center justify-center backdrop-blur-sm"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div><p className="font-bold text-blue-400">Analyse IA en cours...</p></div>)}
                  <h3 className="font-bold text-xl text-blue-400 flex items-center gap-2">🧾 Gestion de la TVA</h3><p className="text-xs text-slate-400 mb-2">Scannez une facture pour extraire la TVA automatiquement.</p>
                  <div className="flex flex-col gap-1"><label className="text-xs font-bold text-slate-400 uppercase">Scanner une facture</label><input id="tvaDocInput" type="file" accept=".pdf,image/*" onChange={handleTvaScan} className="border border-slate-600 p-2 rounded-lg text-sm bg-slate-700 cursor-pointer text-white" /></div>
                  <input type="date" value={tvaDate} onChange={(e) => setTvaDate(e.target.value)} className="border border-slate-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-700" required />
                  <input type="text" value={tvaFournisseur} onChange={(e) => setTvaFournisseur(e.target.value)} className="border border-slate-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-700" placeholder="Fournisseur (ex: Total...)" required />
                  <div className="relative"><label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Montant TVA détecté / saisi</label><input type="number" step="0.01" value={tvaMontant} onChange={(e) => setTvaMontant(e.target.value)} className="border border-slate-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 w-full font-bold bg-slate-700 text-green-400" placeholder="0.00 €" required /></div>
                  <button type="submit" className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 mt-2 transition-colors">Enregistrer la TVA</button>
                </form>
                <div className="lg:w-2/3">
                  <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-xl border border-blue-200 shadow-sm"><div><h3 className="font-bold text-slate-800 text-lg">TVA Récupérable / Déductible</h3><p className="text-xs text-slate-500">Cumul des factures scannées</p></div><div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-xl text-center"><p className="text-2xl font-black">{formatPrix(totalTvaRecuperable)} €</p></div></div>
                  <div className="flex flex-col gap-3">
                    {tvaList.length === 0 && <p className="text-sm text-slate-500 bg-slate-50 p-6 text-center rounded-xl">Aucune facture scannée.</p>}
                    {tvaList.map((t) => (
                      <div key={t.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow"><div className="flex items-center gap-4"><div className="bg-slate-100 p-2 rounded-lg text-center leading-tight"><p className="text-xs text-slate-400 uppercase font-bold">Date</p><p className="font-bold text-slate-700">{new Date(t.date).toLocaleDateString('fr-FR')}</p></div><div><span className="font-bold text-slate-800 block text-lg">{t.fournisseur}</span>{t.document ? (<button onClick={() => setViewDocModal(t.document || null)} className="text-xs text-blue-500 flex items-center gap-1 mt-1 hover:underline">👁️ {t.document}</button>) : (<span className="text-xs text-slate-400 italic mt-1">Saisie manuelle</span>)}</div></div><div className="flex items-center gap-4"><div className="text-right"><p className="text-xs text-slate-400 uppercase font-bold">TVA</p><p className="text-xl font-black text-blue-600">+{formatPrix(t.montantTva)} €</p></div><button onClick={() => deleteItem(t.id, setTvaList, tvaList)} className="text-xs text-red-400 hover:text-red-600 bg-red-50 p-2 rounded-lg transition-colors">🗑️</button></div></div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contrats' && (
              <div className="flex flex-col gap-4">
                {clients.length === 0 && <p className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl">Aucun contrat.</p>}
                {clients.map((client) => {
                  const joursClient = client.joursTournee || JOURS_SEMAINE;
                  return editingClientId === client.id ? (
                    <div key={client.id} className="bg-indigo-50 p-5 rounded-xl border-2 border-indigo-400"><div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4"><input type="text" value={editClientData.nom || ''} onChange={(e) => setEditClientData({...editClientData, nom: e.target.value})} className="border border-indigo-200 p-2 rounded-lg" placeholder="Nom" /><input type="text" value={editClientData.telephone || ''} onChange={(e) => setEditClientData({...editClientData, telephone: e.target.value})} className="border border-indigo-200 p-2 rounded-lg" placeholder="Téléphone" /><input type="text" value={editClientData.adresse || ''} onChange={(e) => setEditClientData({...editClientData, adresse: e.target.value})} className="border border-indigo-200 p-2 rounded-lg md:col-span-2" placeholder="Adresse" /><input type="number" step="0.01" value={editClientData.montantMensuel || ''} onChange={(e) => setEditClientData({...editClientData, montantMensuel: parseFloat(e.target.value) || 0})} className="border border-indigo-200 p-2 rounded-lg font-bold" placeholder="Montant €" /></div><p className="text-xs font-bold text-indigo-800 mb-2">Jours de livraison :</p><div className="flex gap-2 flex-wrap mb-4">{JOURS_SEMAINE.map(j => (<button type="button" key={j} onClick={() => toggleJour(j, editClientData.joursTournee || JOURS_SEMAINE, (newList) => setEditClientData({...editClientData, joursTournee: newList}))} className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${(editClientData.joursTournee || JOURS_SEMAINE).includes(j) ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-300 border border-indigo-200'}`}>{j.substring(0, 3)}</button>))}</div><div className="flex justify-end gap-3 pt-3 border-t border-indigo-200"><button onClick={() => setEditingClientId(null)} className="px-4 py-2 bg-slate-200 font-bold rounded-lg hover:bg-slate-300">Annuler</button><button onClick={saveEditedClient} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">Sauvegarder</button></div></div>
                  ) : (
                    <div key={client.id} className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm"><div><h3 className="text-lg font-bold text-slate-800">{client.nom}</h3><p className="text-sm text-slate-500 mb-2">📞 {client.telephone} • 📍 {client.adresse}</p><div className="flex gap-1">{JOURS_SEMAINE.map(j => (<span key={j} className={`text-[10px] px-2 py-0.5 rounded font-bold ${joursClient.includes(j) ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-300'}`}>{j.substring(0, 2)}</span>))}</div></div><div className="flex items-center gap-4 mt-4 md:mt-0"><p className="text-2xl font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg">{formatPrix(client.montantMensuel)} €</p><button onClick={() => {setEditingClientId(client.id); setEditClientData(client)}} title="Modifier">✏️</button><button onClick={() => deleteItem(client.id, setClients, clients)} title="Supprimer">❌</button></div></div>
                  );
                })}
              </div>
            )}

            {activeTab === 'nouveau-client' && (
              <form onSubmit={handleAddClient} className="max-w-xl mx-auto flex flex-col gap-4">
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Nom de l'entreprise" required /><input type="text" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Téléphone" required /><input type="text" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} className="border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Adresse complète" required /><input type="number" step="0.01" value={clientAmount} onChange={(e) => setClientAmount(e.target.value)} className="border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 font-bold" placeholder="Montant mensuel (€)" required />
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-2"><p className="text-sm font-bold text-slate-700 mb-3">Jours de livraison prévus :</p><div className="flex gap-2 flex-wrap">{JOURS_SEMAINE.map(j => (<button type="button" key={j} onClick={() => toggleJour(j, clientJours, setClientJours)} className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${clientJours.includes(j) ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-400 border border-slate-200'}`}>{j.substring(0, 3)}</button>))}</div></div>
                <button type="submit" className="bg-indigo-600 text-white text-lg font-bold py-3 rounded-xl hover:bg-indigo-700 mt-2 shadow-md">Enregistrer le contrat</button>
              </form>
            )}

            {activeTab === 'hors-contrat' && (
              <div className="flex flex-col lg:flex-row gap-8">
                <form onSubmit={handleAddLivraisonHC} className="bg-white p-6 rounded-xl border border-emerald-200 flex flex-col gap-4 h-fit lg:w-1/3 shadow-sm">
                  <h3 className="font-bold text-emerald-800">Saisir une livraison Hors Contrat</h3>
                  <input type="date" value={hcDate} onChange={(e) => setHcDate(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500" required />
                  <input type="text" value={hcDesc} onChange={(e) => setHcDesc(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Description de la course..." required />
                  <div className="relative"><input type="number" step="0.01" value={hcMontant} onChange={(e) => setHcMontant(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 w-full font-bold" placeholder="Montant facturé en €" required /></div>
                  <button type="submit" className="bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 mt-2">Valider la livraison</button>
                </form>
                <div className="lg:w-2/3">
                  <h3 className="font-bold text-slate-800 mb-4">Historique des livraisons Hors Contrat</h3>
                  <div className="flex flex-col gap-3">
                    {livraisonsHC.length === 0 && <p className="text-sm text-slate-500">Aucune livraison hors contrat enregistrée.</p>}
                    {livraisonsHC.map((l) => (
                      <div key={l.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm"><div className="flex items-center gap-4"><div className="bg-slate-100 p-2 rounded-lg text-center leading-tight"><p className="text-xs text-slate-400 uppercase font-bold">Date</p><p className="font-bold text-slate-700">{new Date(l.date).toLocaleDateString('fr-FR')}</p></div><div><span className="font-bold text-slate-800 block">{l.description}</span><span className="text-xs text-slate-500">Hors Contrat</span></div></div><div className="flex items-center gap-4"><p className="text-xl font-black text-emerald-600">+{formatPrix(l.montant)} €</p><button onClick={() => deleteItem(l.id, setLivraisonsHC, livraisonsHC)} className="text-xs text-red-400 hover:underline">Supprimer</button></div></div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'charges-fixes' && (
              <div className="flex flex-col lg:flex-row gap-8">
                <form onSubmit={handleAddChargeFixe} className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col gap-4 h-fit lg:w-1/3 shadow-sm">
                  <h3 className="font-bold text-slate-800">Ajouter une charge fixe</h3><p className="text-xs text-slate-500 mb-2">Loyer, abonnements logiciels, forfaits, etc. Le montant sera lissé sur le mois.</p>
                  <input type="date" value={cfDate} onChange={(e) => setCfDate(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-slate-500" required />
                  <input type="text" value={cfNom} onChange={(e) => setCfNom(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-slate-500" placeholder="Nom de la charge (ex: Loyer)..." required />
                  <div className="relative"><input type="number" step="0.01" value={cfMontant} onChange={(e) => setCfMontant(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-slate-500 w-full font-bold" placeholder="Montant Mensuel en €" required /></div>
                  <div className="flex flex-col gap-1 mt-2"><label className="text-xs font-bold text-slate-500 uppercase">Joindre un justificatif (Optionnel)</label><input id="cfDocInput" type="file" accept=".pdf,image/*" onChange={(e) => setCfDoc(e.target.files?.[0] || null)} className="border p-2 rounded-lg text-sm bg-white cursor-pointer" /></div>
                  <button type="submit" className="bg-slate-800 text-white font-bold py-3 rounded-lg hover:bg-slate-900 mt-2">Enregistrer la charge</button>
                </form>
                <div className="lg:w-2/3">
                  <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-800">Liste de vos Charges Fixes</h3><div className="bg-slate-800 text-white px-3 py-1 rounded-lg text-sm font-bold">Total : {formatPrix(totalChargesFixes)} € / mois</div></div>
                  <div className="flex flex-col gap-3">
                    {chargesFixes.length === 0 && <p className="text-sm text-slate-500">Aucune charge fixe enregistrée.</p>}
                    {chargesFixes.map((c) => (
                      <div key={c.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm"><div className="flex items-center gap-4"><div className="bg-slate-100 p-2 rounded-lg text-center leading-tight"><p className="text-xs text-slate-400 uppercase font-bold">Ajouté le</p><p className="font-bold text-slate-700">{new Date(c.date).toLocaleDateString('fr-FR')}</p></div><div><span className="font-bold text-slate-800 block">{c.nom}</span>{c.document ? (<button onClick={() => setViewDocModal(c.document || null)} className="text-xs text-blue-500 flex items-center gap-1 mt-1 hover:underline">👁️ {c.document}</button>) : (<span className="text-xs text-slate-400 italic mt-1">Aucun justificatif</span>)}</div></div><div className="flex items-center gap-4"><p className="text-xl font-black text-slate-800">{formatPrix(c.montant)} €</p><button onClick={() => deleteItem(c.id, setChargesFixes, chargesFixes)} className="text-xs text-red-400 hover:underline">Supprimer</button></div></div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'salaries' && (
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                  {salaries.length === 0 && <p className="text-sm text-slate-500">Aucun salarié enregistré.</p>}
                  {salaries.map((s) => {
                    return editingSalarieId === s.id ? (
                      <div key={s.id} className="bg-orange-50 p-5 rounded-xl border-2 border-orange-400">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                          <input type="text" value={editSalarieData.nom || ''} onChange={(e) => setEditSalarieData({...editSalarieData, nom: e.target.value})} className="border p-2 rounded-lg" placeholder="Nom complet" />
                          <input type="text" value={editSalarieData.poste || ''} onChange={(e) => setEditSalarieData({...editSalarieData, poste: e.target.value})} className="border p-2 rounded-lg" placeholder="Poste" />
                          <input type="number" step="0.01" value={editSalarieData.salaireMensuel || ''} onChange={(e) => setEditSalarieData({...editSalarieData, salaireMensuel: parseFloat(e.target.value) || 0})} className="border p-2 rounded-lg font-bold" placeholder="Salaire (€)" />
                          <input type="number" step="0.01" value={editSalarieData.primeEmbauche || ''} onChange={(e) => setEditSalarieData({...editSalarieData, primeEmbauche: parseFloat(e.target.value) || 0})} className="border p-2 rounded-lg" placeholder="Prime déduite (€)" />
                          <input type="text" value={editSalarieData.telephone || ''} onChange={(e) => setEditSalarieData({...editSalarieData, telephone: e.target.value})} className="border p-2 rounded-lg" placeholder="Téléphone" />
                          <input type="text" value={editSalarieData.contactUrgence || ''} onChange={(e) => setEditSalarieData({...editSalarieData, contactUrgence: e.target.value})} className="border p-2 rounded-lg" placeholder="Contact d'urgence" />
                          <input type="text" value={editSalarieData.adresse || ''} onChange={(e) => setEditSalarieData({...editSalarieData, adresse: e.target.value})} className="border p-2 rounded-lg col-span-1 md:col-span-2" placeholder="Adresse complète" />
                          <select value={editSalarieData.vehiculeImmat || ''} onChange={(e) => setEditSalarieData({...editSalarieData, vehiculeImmat: e.target.value})} className="border p-2 rounded-lg col-span-1 md:col-span-4 text-sm"><option value="">-- Aucun véhicule fixe --</option>{vehicules.map(v => <option key={v.immatriculation} value={v.immatriculation}>{v.immatriculation} ({v.modele})</option>)}</select>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 pt-2 border-t border-orange-200">
                           <div><span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Permis Recto</span><input type="file" onChange={e=>setEditSalarieData({...editSalarieData, permisRecto: e.target.files?.[0]?.name})} className="text-[10px] w-full" /></div>
                           <div><span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Permis Verso</span><input type="file" onChange={e=>setEditSalarieData({...editSalarieData, permisVerso: e.target.files?.[0]?.name})} className="text-[10px] w-full" /></div>
                           <div><span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Vitale Recto</span><input type="file" onChange={e=>setEditSalarieData({...editSalarieData, vitaleRecto: e.target.files?.[0]?.name})} className="text-[10px] w-full" /></div>
                           <div><span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Vitale Verso</span><input type="file" onChange={e=>setEditSalarieData({...editSalarieData, vitaleVerso: e.target.files?.[0]?.name})} className="text-[10px] w-full" /></div>
                        </div>
                        <div className="flex justify-end gap-3 pt-3 mt-3 border-t border-orange-200"><button onClick={() => setEditingSalarieId(null)} className="px-4 py-2 bg-slate-200 font-bold rounded-lg hover:bg-slate-300">Annuler</button><button onClick={saveEditedSalarie} className="px-4 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700">Sauvegarder</button></div>
                      </div>
                    ) : (
                      <div key={s.id} className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between shadow-sm">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">{s.nom}</h3>
                          <p className="text-sm text-orange-600 font-semibold mb-1">👔 {s.poste}</p>
                          {s.adresse && <p className="text-xs text-slate-500 mt-1">🏠 {s.adresse}</p>}
                          {s.vehiculeImmat && <p className="text-xs text-emerald-600 font-bold bg-emerald-50 w-fit px-2 py-1 rounded mt-1">🚚 {s.vehiculeImmat}</p>}
                          {s.telephone && <p className="text-xs text-slate-500 mt-2">📞 {s.telephone}</p>}
                          {s.contactUrgence && <p className="text-xs text-red-500 font-bold mt-1">🚨 Urgence : {s.contactUrgence}</p>}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {s.permisRecto && <button onClick={() => setViewDocModal(s.permisRecto || null)} className="text-[10px] bg-sky-100 text-sky-700 px-2 py-1 rounded font-bold hover:bg-sky-200 transition-colors">👁️ Permis (R)</button>}
                            {s.permisVerso && <button onClick={() => setViewDocModal(s.permisVerso || null)} className="text-[10px] bg-sky-100 text-sky-700 px-2 py-1 rounded font-bold hover:bg-sky-200 transition-colors">👁️ Permis (V)</button>}
                            {s.vitaleRecto && <button onClick={() => setViewDocModal(s.vitaleRecto || null)} className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold hover:bg-emerald-200 transition-colors">👁️ Vitale (R)</button>}
                            {s.vitaleVerso && <button onClick={() => setViewDocModal(s.vitaleVerso || null)} className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold hover:bg-emerald-200 transition-colors">👁️ Vitale (V)</button>}
                            {s.planningFile && <button onClick={() => setViewDocModal(s.planningFile || null)} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold hover:bg-slate-200 transition-colors">👁️ Planning</button>}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 md:mt-0">
                          <div className="text-right hidden sm:block border-r border-slate-200 pr-4"><p className="text-sm text-slate-500">Base : {formatPrix(s.salaireMensuel)} €</p>{s.primeEmbauche > 0 && <p className="text-sm text-rose-500 font-medium">- Prime : {formatPrix(s.primeEmbauche)} €</p>}</div>
                          <div className="bg-orange-50 border border-orange-100 px-4 py-2 rounded-lg text-right"><p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-1">À payer</p><p className="text-xl font-black text-slate-800">{formatPrix(s.salaireMensuel - s.primeEmbauche)} €</p></div>
                          <div className="flex gap-2"><button onClick={() => {setEditingSalarieId(s.id); setEditSalarieData(s)}} title="Modifier le salarié">✏️</button><button onClick={() => handleDeleteSalarie(s.id)} title="Supprimer le salarié">❌</button></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <form onSubmit={handleAddSalarie} className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col gap-4">
                  <h3 className="font-bold text-slate-800 text-lg">Ajouter un membre de l'équipe</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center"><input type="text" value={salarieName} onChange={(e) => setSalarieName(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="Nom complet" required /><input type="text" value={salariePoste} onChange={(e) => setSalariePoste(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="Poste" required /><input type="number" step="0.01" value={salarieAmount} onChange={(e) => setSalarieAmount(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-500 font-bold" placeholder="Salaire (€)" required /><input type="number" step="0.01" value={salariePrime} onChange={(e) => setSalariePrime(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="Prime déduite (€)" /></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2"><input type="text" value={salariePhone} onChange={(e) => setSalariePhone(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="Numéro de téléphone" /><input type="text" value={salarieUrgence} onChange={(e) => setSalarieUrgence(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-red-500 bg-red-50 placeholder-red-300" placeholder="Contact d'urgence (Nom + Tel)" /><input type="text" value={salarieAdresse} onChange={(e) => setSalarieAdresse(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-500 lg:col-span-1" placeholder="Adresse complète" /></div>

                  <div className="mt-2 border-t border-slate-200 pt-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">📁 Documents (Photos ou Scans)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl flex flex-col gap-2 shadow-sm"><label className="text-xs font-bold text-sky-800 uppercase">🪪 Permis (Recto)</label><input id="permisRectoInput" type="file" accept=".pdf,image/*" onChange={(e) => setSalariePermisRecto(e.target.files?.[0] || null)} className="text-xs cursor-pointer text-slate-600" /></div>
                      <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl flex flex-col gap-2 shadow-sm"><label className="text-xs font-bold text-sky-800 uppercase">🪪 Permis (Verso)</label><input id="permisVersoInput" type="file" accept=".pdf,image/*" onChange={(e) => setSalariePermisVerso(e.target.files?.[0] || null)} className="text-xs cursor-pointer text-slate-600" /></div>
                      <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex flex-col gap-2 shadow-sm"><label className="text-xs font-bold text-emerald-800 uppercase">🏥 Vitale (Recto)</label><input id="vitaleRectoInput" type="file" accept=".pdf,image/*" onChange={(e) => setSalarieVitaleRecto(e.target.files?.[0] || null)} className="text-xs cursor-pointer text-slate-600" /></div>
                      <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex flex-col gap-2 shadow-sm"><label className="text-xs font-bold text-emerald-800 uppercase">🏥 Vitale (Verso)</label><input id="vitaleVersoInput" type="file" accept=".pdf,image/*" onChange={(e) => setSalarieVitaleVerso(e.target.files?.[0] || null)} className="text-xs cursor-pointer text-slate-600" /></div>
                    </div>
                  </div>

                  <div className="mt-2 border-t border-slate-200 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1"><label className="text-xs font-bold text-slate-500 uppercase">📄 Planning (Optionnel)</label><input id="planningInput" type="file" accept=".pdf,image/*" onChange={(e) => setSalariePlanning(e.target.files?.[0] || null)} className="border border-slate-300 p-2 rounded-lg text-sm bg-white cursor-pointer" /></div>
                    <div className="flex flex-col gap-1"><label className="text-xs font-bold text-slate-500 uppercase">🚚 Attribuer un véhicule</label><select value={salarieVehicule} onChange={(e)=>setSalarieVehicule(e.target.value)} className="border border-slate-300 p-2 rounded-lg text-sm bg-white cursor-pointer focus:ring-2 focus:ring-orange-500 h-full"><option value="">-- Aucun véhicule --</option>{vehicules.map(v => <option key={v.immatriculation} value={v.immatriculation}>{v.immatriculation} ({v.modele})</option>)}</select></div>
                    <div className="border-2 border-orange-200 p-2 rounded-lg bg-orange-100 flex justify-between items-center shadow-inner"><span className="text-xs font-bold text-orange-800 uppercase px-2">À payer</span><span className="font-black text-orange-900 text-lg px-2">{formatPrix(parseMontant(salarieAmount) - parseMontant(salariePrime))} €</span></div>
                  </div>
                  
                  <button type="submit" className="bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 mt-2">+ Enregistrer le salarié</button>
                </form>
              </div>
            )}

            {/* VEHICULES ET LOCATIONS MERGE */}
            {activeTab === 'vehicules' && (
              <div className="flex flex-col gap-10">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-4">Véhicules de l'entreprise</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {vehicules.length === 0 && <p className="text-sm text-slate-500 col-span-full">Aucun véhicule enregistré.</p>}
                    {vehicules.map((v) => {
                      const totalCarburantVehicule = carburants.filter(c => c.vehiculeId === v.immatriculation).reduce((acc, c) => acc + c.montant, 0);
                      const totalFraisVehicule = fraisVehicules.filter(f => f.vehiculeImmat === v.immatriculation).reduce((acc, f) => acc + f.montant, 0);
                      return editingVehiculeId === v.id ? (
                        <div key={v.id} className="bg-blue-50 p-5 rounded-xl border-2 border-blue-400 flex flex-col gap-3"><input type="text" value={editVehiculeData.modele || ''} onChange={(e) => setEditVehiculeData({...editVehiculeData, modele: e.target.value})} className="border p-2 rounded-lg" placeholder="Modèle" /><input type="text" value={editVehiculeData.immatriculation || ''} onChange={(e) => setEditVehiculeData({...editVehiculeData, immatriculation: e.target.value.toUpperCase()})} className="border p-2 rounded-lg uppercase" placeholder="Immatriculation" /><div className="flex gap-2"><input type="number" value={editVehiculeData.kilometrage || ''} onChange={(e) => setEditVehiculeData({...editVehiculeData, kilometrage: parseInt(e.target.value) || 0})} className="border p-2 rounded-lg w-1/2" placeholder="Km" /><input type="number" step="0.01" value={editVehiculeData.assurance || ''} onChange={(e) => setEditVehiculeData({...editVehiculeData, assurance: parseFloat(e.target.value) || 0})} className="border p-2 rounded-lg w-1/2" placeholder="Assurance/mois (€)" /></div><div className="flex justify-end gap-3 mt-2"><button onClick={() => setEditingVehiculeId(null)} className="px-4 py-2 bg-slate-200 font-bold rounded-lg hover:bg-slate-300">Annuler</button><button onClick={saveEditedVehicule} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Sauvegarder</button></div></div>
                      ) : (
                        <div key={v.id} className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm relative group"><div className="absolute top-4 right-4 flex gap-2"><button onClick={() => {setEditingVehiculeId(v.id); setEditVehiculeData(v)}} title="Modifier la fiche">✏️</button><button onClick={() => deleteItem(v.id, setVehicules, vehicules)} title="Supprimer">❌</button></div><h3 className="text-xl font-bold text-slate-800">{v.modele}</h3><div className="bg-blue-100 border-2 border-blue-600 text-blue-900 font-black tracking-widest text-center py-2 rounded-lg mt-3 mb-4 w-3/4">{v.immatriculation}</div><div className="grid grid-cols-2 gap-y-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100"><p>🛣️ Kilométrage</p> <p className="text-right font-bold">{v.kilometrage.toLocaleString('fr-FR')} km</p><p>🛡️ Assurance / mois</p> <p className="text-right font-bold text-blue-700">{formatPrix(v.assurance || 0)} €</p><p>⛽ Carburant (Cumul)</p> <p className="text-right font-bold text-rose-600">{formatPrix(totalCarburantVehicule)} €</p><p>🔧 Frais divers (Cumul)</p> <p className="text-right font-bold text-red-600">{formatPrix(totalFraisVehicule)} €</p></div></div>
                      );
                    })}
                  </div>
                  <form onSubmit={handleAddVehicule} className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col gap-4 shadow-sm mt-6"><h3 className="font-bold text-blue-900">Ajouter un véhicule possédé</h3><div className="grid grid-cols-1 md:grid-cols-4 gap-4"><input type="text" value={vehiculeModele} onChange={(e) => setVehiculeModele(e.target.value)} className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Modèle" required /><input type="text" value={vehiculeImmat} onChange={(e) => setVehiculeImmat(e.target.value)} className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase" placeholder="Plaque" required /><input type="number" value={vehiculeKm} onChange={(e) => setVehiculeKm(e.target.value)} className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Kilométrage" required /><input type="number" step="0.01" value={vehiculeAssurance} onChange={(e) => setVehiculeAssurance(e.target.value)} className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Assurance (€/mois)" required /></div><button type="submit" className="bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700">+ Ajouter à la flotte</button></form>
                </div>
                
                <hr className="border-slate-200" />
                
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-4">Véhicules en Location</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {locations.length === 0 && <p className="text-sm text-slate-500 col-span-full">Aucune location en cours.</p>}
                    {locations.map((l) => {
                      const totalCarburantLoc = carburants.filter(c => c.vehiculeId === l.immatriculation).reduce((acc, c) => acc + c.montant, 0);
                      return (
                        <div key={l.id} className="bg-white p-5 rounded-xl border border-purple-200 shadow-sm relative group">
                          <div className="absolute top-4 right-4 flex gap-2"><button onClick={() => deleteItem(l.id, setLocations, locations)} title="Supprimer">❌</button></div>
                          <h3 className="text-xl font-bold text-slate-800">{l.modele} {l.duree === 'courte' ? <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded align-middle ml-2">Courte durée</span> : <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded align-middle ml-2">Longue durée (LLD/LOA)</span>}</h3>
                          <div className="bg-purple-100 border-2 border-purple-600 text-purple-900 font-black tracking-widest text-center py-2 rounded-lg mt-3 mb-4 w-3/4">{l.immatriculation}</div>
                          <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100"><p>🏢 Agence</p> <p className="text-right font-bold">{l.agence}</p><p>🏷️ Coût de location / mois</p> <p className="text-right font-bold text-purple-700">{formatPrix(l.coutMensuel)} €</p><p>⛽ Carburant (Cumul)</p> <p className="text-right font-bold text-rose-600">{formatPrix(totalCarburantLoc)} €</p></div>
                        </div>
                      )
                    })}
                  </div>
                  <form onSubmit={handleAddLocation} className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col gap-4 mt-6 shadow-sm"><h3 className="font-bold text-purple-900">Ajouter un véhicule en location</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4"><input type="date" value={locDate} onChange={(e) => setLocDate(e.target.value)} className="border p-2.5 rounded-lg focus:ring-2 focus:ring-purple-500" required /><select value={locDuree} onChange={(e) => setLocDuree(e.target.value as 'longue'|'courte')} className="border p-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white" required><option value="longue">Longue durée (LLD/LOA)</option><option value="courte">Courte durée</option></select><input type="text" value={locModele} onChange={(e) => setLocModele(e.target.value)} className="border p-2.5 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Modèle" required /><input type="text" value={locImmat} onChange={(e) => setLocImmat(e.target.value)} className="border p-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 uppercase" placeholder="Plaque" required /><input type="text" value={locAgence} onChange={(e) => setLocAgence(e.target.value)} className="border p-2.5 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Agence" required /><input type="number" step="0.01" value={locCout} onChange={(e) => setLocCout(e.target.value)} className="border p-2.5 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Loyer Mensuel (€)" required /></div><button type="submit" className="bg-purple-600 text-white font-bold py-2.5 rounded-lg hover:bg-purple-700">+ Ajouter la location</button></form>
                </div>

                <hr className="border-slate-200" />
                
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-4">Saisie des Dépenses (Toute la flotte)</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-rose-50 p-5 rounded-xl border border-rose-200">
                      <form onSubmit={handleAddCarburant} className="flex flex-col gap-3 mb-6"><h3 className="font-bold text-rose-900 mb-2">⛽ Saisir un plein manuel</h3><div className="flex gap-2"><input type="date" value={carbDate} onChange={(e) => setCarbDate(e.target.value)} className="border p-2.5 rounded-lg w-1/3" required /><select value={carbVehicule} onChange={(e) => setCarbVehicule(e.target.value)} className="border p-2.5 rounded-lg w-2/3 uppercase" required><option value="">-- Choisir Plaque --</option>{allPlates.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}</select></div><input type="number" step="0.01" value={carbMontant} onChange={(e) => setCarbMontant(e.target.value)} className="border p-2.5 rounded-lg font-bold" placeholder="Montant du plein (€)" required /><button type="submit" className="bg-rose-600 text-white font-bold py-2.5 rounded-lg hover:bg-rose-700">Enregistrer le plein</button></form>
                      <h4 className="text-sm font-bold text-slate-700 mb-2">Historique récent (Carburant)</h4>
                      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">{carburants.length === 0 && <p className="text-xs text-slate-500 italic">Aucun plein.</p>}{carburants.map((c) => (<div key={c.id} className="bg-white p-3 rounded-lg border border-slate-100 flex justify-between items-center text-sm shadow-sm"><div><span className="font-bold text-slate-700 mr-2">{c.vehiculeId}</span><span className="text-xs text-slate-400">{new Date(c.date).toLocaleDateString('fr-FR')}</span>{c.photo && <button onClick={() => setViewDocModal(c.photo || null)} className="ml-2 text-xs text-sky-500 hover:underline">👁️ Photo</button>}</div><div className="flex items-center gap-3"><span className="font-black text-rose-600">-{formatPrix(c.montant)} €</span><button onClick={() => deleteItem(c.id, setCarburants, carburants)} className="text-[10px] text-red-400">❌</button></div></div>))}</div>
                    </div>
                    <div className="bg-slate-100 p-5 rounded-xl border border-slate-300">
                      <form onSubmit={handleAddFraisVehicule} className="flex flex-col gap-3 mb-6"><h3 className="font-bold text-slate-800 mb-2">🔧 Saisir un frais d'entretien</h3><div className="flex gap-2"><input type="date" value={fvDate} onChange={(e) => setFvDate(e.target.value)} className="border p-2.5 rounded-lg w-1/3" required /><select value={fvVehicule} onChange={(e) => setFvVehicule(e.target.value)} className="border p-2.5 rounded-lg w-2/3 uppercase" required><option value="">-- Choisir Plaque --</option>{allPlates.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}</select></div><input type="text" value={fvDesc} onChange={(e) => setFvDesc(e.target.value)} className="border p-2.5 rounded-lg" placeholder="Description (Pneus, Vidange...)" required /><input type="number" step="0.01" value={fvMontant} onChange={(e) => setFvMontant(e.target.value)} className="border p-2.5 rounded-lg font-bold" placeholder="Facture Garage (€)" required /><button type="submit" className="bg-slate-800 text-white font-bold py-2.5 rounded-lg hover:bg-slate-700">Enregistrer le frais</button></form>
                      <h4 className="text-sm font-bold text-slate-700 mb-2">Historique récent (Entretien)</h4>
                      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">{fraisVehicules.length === 0 && <p className="text-xs text-slate-500 italic">Aucun frais.</p>}{fraisVehicules.map((f) => (<div key={f.id} className="bg-white p-3 rounded-lg border border-slate-100 flex justify-between items-center text-sm shadow-sm"><div><span className="font-bold text-slate-700 block">{f.vehiculeImmat}</span><span className="text-xs text-slate-500">{f.description} ({new Date(f.date).toLocaleDateString('fr-FR')})</span></div><div className="flex items-center gap-3"><span className="font-black text-red-600">-{formatPrix(f.montant)} €</span><button onClick={() => deleteItem(f.id, setFraisVehicules, fraisVehicules)} className="text-[10px] text-red-400">❌</button></div></div>))}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DEPENSES DIV */}
            {activeTab === 'depenses-div' && (
              <div className="flex flex-col lg:flex-row gap-8">
                <form onSubmit={handleAddDepenseDivers} className="bg-white p-6 rounded-xl border border-red-200 flex flex-col gap-4 h-fit lg:w-1/3 shadow-sm">
                  <h3 className="font-bold text-slate-800">Ajouter une dépense</h3>
                  <input type="date" value={ddDate} onChange={(e) => setDdDate(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-red-500" required />
                  <select value={ddMotif} onChange={(e) => setDdMotif(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-red-500 bg-white" required><option value="">-- Choisir un motif --</option><option value="Péage/Parking">Péage / Parking</option><option value="Repas">Repas / Alimentation</option><option value="Matériel">Matériel / Fournitures</option><option value="Autre">Autre (à préciser)</option></select>
                  {ddMotif === 'Autre' && <input type="text" value={ddMotifCustom} onChange={(e) => setDdMotifCustom(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-red-500 bg-red-50" placeholder="Précisez le motif..." required />}
                  <input type="text" value={ddDesc} onChange={(e) => setDdDesc(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-red-500" placeholder="Description courte..." required />
                  <div className="relative"><input type="number" step="0.01" value={ddMontant} onChange={(e) => setDdMontant(e.target.value)} className="border p-3 rounded-lg focus:ring-2 focus:ring-red-500 w-full font-bold" placeholder="Montant en €" required /></div>
                  <button type="submit" className="bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 mt-2">Enregistrer la dépense</button>
                </form>
                <div className="lg:w-2/3">
                  <h3 className="font-bold text-slate-800 mb-4">Historique des dépenses diverses</h3>
                  <div className="flex flex-col gap-3">{depensesDiverses.length === 0 && <p className="text-sm text-slate-500">Aucune dépense enregistrée.</p>}{depensesDiverses.map((d) => (<div key={d.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm"><div className="flex items-center gap-4"><div className="bg-slate-100 p-2 rounded-lg text-center leading-tight"><p className="text-xs text-slate-400 uppercase font-bold">Date</p><p className="font-bold text-slate-700">{new Date(d.date).toLocaleDateString('fr-FR')}</p></div><div><span className="font-bold text-slate-800 block">{d.motif ? `${d.motif}` : 'Dépense'}</span><span className="text-xs text-slate-500">{d.description}</span></div></div><div className="flex items-center gap-4"><p className="text-xl font-black text-rose-600">-{formatPrix(d.montant)} €</p><button onClick={() => deleteItem(d.id, setDepensesDiverses, depensesDiverses)} className="text-xs text-red-400 hover:underline">Supprimer</button></div></div>))}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {viewDocModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full text-center shadow-2xl animate-slide-up">
            <div className="text-6xl mb-4">📄</div><h3 className="font-black text-slate-800 text-2xl mb-2">Aperçu du document</h3><p className="text-slate-600 font-mono bg-slate-100 p-3 rounded-lg mb-6 break-words border border-slate-200">{viewDocModal}</p>
            <p className="text-xs text-slate-400 mb-8 italic">Le véritable affichage de l'image (scan/photo) nécessitera la liaison avec votre future base de données Cloud (Supabase).</p>
            <button onClick={() => setViewDocModal(null)} className="w-full bg-slate-800 text-white font-bold px-6 py-4 rounded-xl hover:bg-slate-900 transition-colors shadow-lg shadow-slate-300">Fermer</button>
          </div>
        </div>
      )}

      {selectedHistoryDate && (() => {
        const hData = historiqueBilan.find(h => h.dateStr === selectedHistoryDate); if (!hData) return null;
        return (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-[#f2f2f7] w-full sm:w-[500px] h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-slide-up relative">
              <div className="flex justify-between items-center p-5 bg-white border-b border-gray-200"><h3 className="font-bold text-slate-800 text-xl capitalize">Détails du {hData.dateAffichage}</h3><button onClick={() => setSelectedHistoryDate(null)} className="text-slate-400 hover:text-slate-600 text-2xl font-bold px-2">✕</button></div>
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-100"><h4 className="font-black text-emerald-600 mb-4 border-b border-emerald-50 pb-2 text-lg">Gain Total : +{formatPrix(hData.gain)} €</h4><div className="flex flex-col gap-3">{hData.detailsGJ.length === 0 && <p className="text-sm text-slate-400 italic">Aucun revenu pour cette date.</p>}{hData.detailsGJ.map((item, idx) => (<div key={idx} className="flex justify-between text-sm text-slate-700"><span className="font-medium">{item.label}</span><span className="font-bold text-emerald-600">+{formatPrix(item.montant)} €</span></div>))}</div></div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100"><h4 className="font-black text-rose-600 mb-4 border-b border-rose-50 pb-2 text-lg">Dépense Totale : -{formatPrix(hData.depense)} €</h4><div className="flex flex-col gap-3">{hData.detailsDJ.length === 0 && <p className="text-sm text-slate-400 italic">Aucune dépense pour cette date.</p>}{hData.detailsDJ.map((item, idx) => (<div key={idx} className="flex justify-between text-sm text-slate-700"><span className="font-medium">{item.label}</span><span className="font-bold text-rose-500">-{formatPrix(item.montant)} €</span></div>))}</div></div>
                <div className={`p-6 rounded-2xl shadow-md flex justify-between items-center ${hData.benefice >= 0 ? 'bg-slate-800 border-b-4 border-emerald-400' : 'bg-red-50 border-b-4 border-red-500'}`}><span className={`font-bold uppercase tracking-widest text-sm ${hData.benefice >= 0 ? 'text-slate-400' : 'text-red-700'}`}>Bénéfice du Jour</span><span className={`text-3xl font-black ${hData.benefice >= 0 ? 'text-white' : 'text-red-600'}`}>{hData.benefice > 0 ? '+' : ''}{formatPrix(hData.benefice)} €</span></div>
              </div>
            </div>
          </div>
        );
      })()}

      {isEventModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#f2f2f7] w-full sm:w-[450px] h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-slide-up relative">
            {isAlertMenuOpen && ( <div className="absolute inset-0 bg-black/20 z-[60] flex items-end sm:items-center justify-center"><div className="bg-white w-full sm:w-[90%] rounded-2xl overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[80vh]"><div className="bg-gray-100 p-4 font-bold text-center border-b border-gray-200 flex justify-between items-center"><span className="text-transparent w-10"></span><span>Alerte</span><button onClick={() => setIsAlertMenuOpen(false)} className="text-blue-500 text-sm font-normal w-10 text-right">OK</button></div><div className="overflow-y-auto">{ALERT_OPTIONS.map((option, i) => (<button key={i} onClick={() => { setEvAlert(option); setIsAlertMenuOpen(false); }} className="w-full text-left p-4 border-b border-gray-100 flex items-center gap-3 hover:bg-gray-50 text-black text-lg"><span className="w-5 text-blue-500 font-bold">{evAlert === option ? '✓' : ''}</span><span>{option}</span></button>))}</div></div></div> )}
            <div className="flex justify-between items-center p-4 bg-[#f2f2f7] border-b border-gray-200"><button onClick={() => setIsEventModalOpen(false)} className="text-slate-400 text-xl font-bold px-2">✕</button><h3 className="font-bold text-black text-lg">{editingEventId ? 'Modifier' : 'Nouveau'}</h3><button onClick={handleSaveEvent} className="text-blue-500 font-bold text-xl px-2">✓</button></div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm"><input type="text" value={evTitre} onChange={e => setEvTitre(e.target.value)} placeholder="Titre" className="w-full p-4 outline-none text-lg text-black font-medium placeholder:text-gray-400" /></div>
              <div className="bg-white rounded-xl overflow-hidden flex flex-col shadow-sm">
                <div className="flex justify-between items-center p-4 border-b border-gray-100"><span className="text-lg text-black">Jour entier</span><div onClick={() => setEvJourEntier(!evJourEntier)} className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors ${evJourEntier ? 'bg-green-500' : 'bg-gray-200'}`}><div className={`w-6 h-6 bg-white rounded-full absolute top-0.5 transition-all shadow ${evJourEntier ? 'right-0.5' : 'left-0.5'}`}></div></div></div>
                <div className="flex justify-between items-center p-4 border-b border-gray-100"><span className="text-lg text-black">Début</span><div className="flex gap-2 items-center"><input type="date" value={evDateDebut} onChange={e => setEvDateDebut(e.target.value)} className="bg-gray-100/80 text-black p-2 rounded-lg text-sm outline-none cursor-pointer" />{!evJourEntier && (<div className="flex items-center bg-gray-100/80 rounded-lg px-2 py-1.5 cursor-pointer hover:bg-gray-200 transition-colors"><select value={evHeureDebut.split(':')[0]} onChange={e => setEvHeureDebut(`${e.target.value}:${evHeureDebut.split(':')[1]}`)} className="bg-transparent text-black outline-none appearance-none cursor-pointer text-center font-medium text-sm">{HOURS.map(h => <option key={h} value={h}>{h}</option>)}</select><span className="text-black font-bold mx-0.5">:</span><select value={evHeureDebut.split(':')[1]} onChange={e => setEvHeureDebut(`${evHeureDebut.split(':')[0]}:${e.target.value}`)} className="bg-transparent text-black outline-none appearance-none cursor-pointer text-center font-medium text-sm">{MINUTES.map(m => <option key={m} value={m}>{m}</option>)}</select></div>)}</div></div>
                <div className="flex justify-between items-center p-4 border-b border-gray-100"><span className="text-lg text-black">Fin</span><div className="flex gap-2 items-center"><input type="date" value={evDateFin} onChange={e => setEvDateFin(e.target.value)} className="bg-gray-100/80 text-black p-2 rounded-lg text-sm outline-none cursor-pointer" />{!evJourEntier && (<div className="flex items-center bg-gray-100/80 rounded-lg px-2 py-1.5 cursor-pointer hover:bg-gray-200 transition-colors"><select value={evHeureFin.split(':')[0]} onChange={e => setEvHeureFin(`${e.target.value}:${evHeureFin.split(':')[1]}`)} className="bg-transparent text-black outline-none appearance-none cursor-pointer text-center font-medium text-sm">{HOURS.map(h => <option key={h} value={h}>{h}</option>)}</select><span className="text-black font-bold mx-0.5">:</span><select value={evHeureFin.split(':')[1]} onChange={e => setEvHeureFin(`${evHeureFin.split(':')[0]}:${e.target.value}`)} className="bg-transparent text-black outline-none appearance-none cursor-pointer text-center font-medium text-sm">{MINUTES.map(m => <option key={m} value={m}>{m}</option>)}</select></div>)}</div></div>
                <div className="flex justify-between items-center p-4 text-gray-500"><span className="text-lg text-black">Temps de trajet</span><select value={evTrajet} onChange={e => setEvTrajet(e.target.value)} className="outline-none bg-transparent text-right appearance-none cursor-pointer text-base"><option>Aucun</option><option>5 min</option><option>15 min</option><option>30 min</option></select></div>
              </div>
              <div className="bg-white rounded-xl overflow-hidden p-4 flex justify-between items-center shadow-sm"><span className="text-lg text-black">Récurrence</span><select value={evRecurrence} onChange={e => setEvRecurrence(e.target.value)} className="outline-none bg-transparent text-right text-gray-500 appearance-none cursor-pointer text-base"><option>Jamais</option><option>Tous les jours</option><option>Toutes les semaines</option></select></div>
              <div className="bg-white rounded-xl overflow-hidden flex flex-col shadow-sm"><div className="flex justify-between items-center p-4 border-b border-gray-100"><span className="text-lg text-black">Couleur</span><div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${evCouleur === 'jaune' ? 'bg-yellow-500' : evCouleur === 'bleu' ? 'bg-blue-500' : evCouleur === 'vert' ? 'bg-green-500' : 'bg-purple-500'}`}></div><select value={evCouleur} onChange={e => setEvCouleur(e.target.value as any)} className="outline-none bg-transparent text-right text-gray-500 appearance-none cursor-pointer text-base"><option value="violet">Défaut (Violet)</option><option value="jaune">Entreprise (Jaune)</option><option value="bleu">École (Bleu)</option><option value="vert">Personnel (Vert)</option></select></div></div><div className="flex justify-between items-center p-4"><span className="text-lg text-black">Invitations</span><span className="text-gray-500 text-base">Aucun {'>'}</span></div></div>
              <div onClick={() => setIsAlertMenuOpen(true)} className="bg-white rounded-xl overflow-hidden p-4 flex justify-between items-center cursor-pointer active:bg-gray-50 shadow-sm"><span className="text-lg text-black">Alerte</span><span className="text-gray-500 text-base">{evAlert} {'>'}</span></div>
              {editingEventId && (<div className="pb-8"><button onClick={handleDeleteEvent} className="w-full bg-white rounded-xl text-red-500 text-lg font-bold p-4 hover:bg-gray-50 transition-colors shadow-sm">Supprimer l'évènement</button></div>)}
            </div>
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `@keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } } .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }`}} />
    </main>
  );
}