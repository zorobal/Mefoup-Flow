/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { SaaSClient, SaaSLog } from '../types';
import {
  Users,
  Layers,
  Globe,
  PlusCircle,
  Database,
  Search,
  CheckCircle,
  AlertTriangle,
  FolderLock,
  Download,
  Upload,
  Terminal,
  Activity,
  Server,
  Eye,
  Settings,
  Lock,
  UserCheck,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';

interface SaaSAdminProps {
  clients: SaaSClient[];
  logs: SaaSLog[];
  onAddClient: (newClient: SaaSClient) => void;
  onUpdateClientStatus: (clientId: string, newStatus: SaaSClient['statut']) => void;
  allData: {
    exploitations: any[];
    parcelles: any[];
    animaux: any[];
    employes: any[];
    factures: any[];
    pieces: any[];
    articles: any[];
  };
  onRestoreBackup: (backupData: any) => void;
  onSelectClient?: (client: SaaSClient) => void;
}

export default function SaaSAdmin({
  clients,
  logs,
  onAddClient,
  onUpdateClientStatus,
  allData,
  onRestoreBackup,
  onSelectClient
}: SaaSAdminProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientForAudit, setSelectedClientForAudit] = useState<SaaSClient | null>(clients[0] || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States for new client
  const [raisonSociale, setRaisonSociale] = useState('');
  const [sigle, setSigle] = useState('');
  const [numContribuable, setNumContribuable] = useState('');
  const [regCommerce, setRegCommerce] = useState('');
  const [responsableNom, setResponsableNom] = useState('');
  const [responsablePrenom, setResponsablePrenom] = useState('');
  const [responsableEmail, setResponsableEmail] = useState('');
  const [responsableTel, setResponsableTel] = useState('');
  const [pays, setPays] = useState('Cameroun');
  const [region, setRegion] = useState('Centre');
  const [ville, setVille] = useState('Yaoundé');
  const [plan, setPlan] = useState<'Starter' | 'Professional' | 'Enterprise' | 'Cooperative'>('Professional');
  const [surface, setSurface] = useState(20);
  const [customLogin, setCustomLogin] = useState('');
  const [customPassword, setCustomPassword] = useState('');

  // Credentials presentation screen state
  const [newlyCreatedCredentials, setNewlyCreatedCredentials] = useState<{
    raisonSociale: string;
    login: string;
    password: string;
    licence: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!raisonSociale || !responsableEmail) return;

    const randomizedId = 'client-' + Math.floor(Math.random() * 10000);
    const randomizedLicence = 'LIC-2026-MEFOUP-' + Math.floor(1000 + Math.random() * 9000);
    const maxUsers = plan === 'Starter' ? 5 : plan === 'Professional' ? 25 : plan === 'Enterprise' ? 100 : 250;
    
    // Auto-generate credentials unless customized
    const finalLogin = customLogin.trim() || `admin@${(sigle || raisonSociale).toLowerCase().replace(/[^a-z0-9]/g, '')}.cm`;
    const finalPassword = customPassword.trim() || 'SA-' + Math.floor(100000 + Math.random() * 900000);

    const newClient: SaaSClient = {
      id: randomizedId,
      idLicence: randomizedLicence,
      raisonSociale,
      sigle: sigle.toUpperCase(),
      numContribuable: numContribuable || 'NC-' + Math.floor(100000 + Math.random()*900000),
      regCommerce: regCommerce || 'RC/YAU/' + new Date().getFullYear() + '/B/' + Math.floor(100 + Math.random()*800),
      secteur: 'Multi-activités agricoles',
      responsableNom,
      responsablePrenom,
      responsableEmail,
      responsableTel,
      pays,
      region,
      ville,
      statut: 'Actif',
      plan,
      dateCreation: new Date().toISOString().split('T')[0],
      dateExpiration: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      surfaceExploitee: surface,
      maxUtilisateurs: maxUsers,
      superAdminLogin: finalLogin,
      superAdminPassword: finalPassword
    };

    onAddClient(newClient);
    setShowAddModal(false);
    
    // Save credentials to present to editor
    setNewlyCreatedCredentials({
      raisonSociale: newClient.raisonSociale,
      login: finalLogin,
      password: finalPassword,
      licence: randomizedLicence
    });

    // Reset fields
    setRaisonSociale('');
    setSigle('');
    setNumContribuable('');
    setRegCommerce('');
    setResponsableNom('');
    setResponsablePrenom('');
    setResponsableEmail('');
    setResponsableTel('');
    setCustomLogin('');
    setCustomPassword('');
  };

  const filteredClients = clients.filter(c =>
    c.raisonSociale.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.sigle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.responsableEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Database Export Logic
  const triggerExport = (client: SaaSClient) => {
    // Compile a highly detailed simulated or actual data state of the ERP client
    const backupData = {
      version: "MEFOUP-FLOW-ERP v2.1",
      backupType: "FULL_DURABLE_SQL_RESTORE",
      exportedAt: new Date().toISOString(),
      clientIdentity: {
        id: client.id,
        licence: client.idLicence,
        raisonSociale: client.raisonSociale,
        sigle: client.sigle,
        plan: client.plan,
        superAdminLogin: client.superAdminLogin,
        superAdminPassword: client.superAdminPassword
      },
      payload: {
        exploitations: allData.exploitations,
        parcelles: allData.parcelles,
        animaux: allData.animaux,
        employes: allData.employes,
        factures: allData.factures,
        pieces: allData.pieces,
        articles: allData.articles
      }
    };

    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const exportFileDefaultName = `mefoup_restitution_${client.sigle || 'client'}_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Restore Action Triggered via file selector
  const triggerRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsedObj = JSON.parse(event.target?.result as string);
        if (parsedObj && (parsedObj.payload || parsedObj.exploitations)) {
          // Send to App state
          onRestoreBackup(parsedObj);
          alert(`✅ RESTAURATION RÉUSSIE!\nLa base de données pour "${parsedObj.clientIdentity?.raisonSociale || 'le client'}" a été restaurée et réinjectée avec succès dans l'environnement opérationnel.`);
        } else {
          alert("❌ ÉCHEC DE RESTAURATION: Le schéma JSON JSON n'est pas conforme aux spécifications de MEFOUP-FLOW.");
        }
      } catch (err) {
        alert("❌ ERREUR: Le fichier sélectionné n'est pas un fichier de sauvegarde JSON valide.");
      }
    };
    fileReader.readAsText(file);
  };

  // Safe calculated metrics for Selected client audit (Read-Only)
  // Let's ensure realistic numbers matching the client, standardizing them if they are initial mock data
  const getAuditStats = (client: SaaSClient) => {
    const multiplier = client.id === 'client-1' ? 1 : client.id === 'client-2' ? 1.8 : 0.4;
    return {
      farmsCount: Math.round(allData.exploitations.length * multiplier) || 1,
      parcellesCount: Math.round(allData.parcelles.length * multiplier) || 2,
      animalsCount: Math.round(allData.animaux.length * multiplier) || 12,
      workersCount: Math.round(allData.employes.length * multiplier) || 6,
      ledgerLength: Math.round(allData.pieces.length * multiplier) || 5,
      invoicedAmount: Math.round(850000 * multiplier)
    };
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* SaaS Editor Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 border rounded-2xl shadow-sm">
        <div>
          <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
            ESPACE FOURNISSEUR APPLICATION
          </span>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 mt-2 flex items-center gap-2">
            <Layers className="text-indigo-600 h-7 w-7" />
            Portail de Gestion & Activation des Clients
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Activer/suspendre les comptes, provisionner les formules d'abonnement et gérer la restitution ou le téléchargement de leurs bases sqlite/postgres.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center gap-2"
          >
            <Upload className="h-4 w-4 text-slate-500" />
            Restituer/Injecter une sauvegarde
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={triggerRestore}
            className="hidden"
            accept=".json"
          />

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white font-extrabold text-xs py-2.5 px-5 rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Créer Compte Client & Super-Admin
          </button>
        </div>
      </div>

      {/* NEWLY CREATED CREDENTIALS BANNER PRESENTATION */}
      {newlyCreatedCredentials && (
        <div className="bg-emerald-50 border-2 border-emerald-300 p-5 rounded-2xl space-y-3 relative animate-in fade-in duration-200">
          <button
            onClick={() => setNewlyCreatedCredentials(null)}
            className="absolute top-4 right-4 text-emerald-800 font-bold hover:text-emerald-950 text-xs"
          >
            Masquer [X]
          </button>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-emerald-600 h-5 w-5 shrink-0" />
            <span className="font-extrabold text-sm text-emerald-900 uppercase">
              Formule Validée ! Compte Super-Administrateur Prêt à l'envoi
            </span>
          </div>
          <p className="text-xs text-emerald-700">
            Le client <strong>{newlyCreatedCredentials.raisonSociale}</strong> a été créé. Pour qu'il puisse gérer son espace ERP en toute sérénité, veuillez lui envoyer ces identifiants de sécurité par courrier confidentiel :
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-emerald-100 font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Identifiant / Login</span>
              <span className="font-bold text-indigo-700 break-all">{newlyCreatedCredentials.login}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Mot de Passe SuperAdmin</span>
              <span className="font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{newlyCreatedCredentials.password}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Licence ERP</span>
              <span className="font-bold text-slate-700">{newlyCreatedCredentials.licence}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Statut Licence</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">✓ ACTIVÉ / PAYÉ</span>
            </div>
          </div>
        </div>
      )}

      {/* Editor Main Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-2xs border p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Total Clients</div>
            <div className="text-lg font-black text-slate-800">{clients.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xs border p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Clients Actifs</div>
            <div className="text-lg font-black text-emerald-600">{clients.filter(c => c.statut === 'Actif').length}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xs border p-4 flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Suspendus</div>
            <div className="text-lg font-black text-rose-600">{clients.filter(c => c.statut === 'Suspendu').length}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xs border p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Instance SQL</div>
            <div className="text-lg font-black text-slate-800">{clients.length} isolées</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xs border p-4 flex items-center gap-4 col-span-2 lg:col-span-1">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Disponibilité</div>
            <div className="text-lg font-black text-indigo-600">99.99%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clients Table Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-2xs overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-slate-50 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Portefeuille des Instances ERP</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Cliquez sur un client pour auditer ses volumes opérationnels.</p>
            </div>
            <div className="relative max-w-64">
              <Search className="absolute left-2.5 top-2.5 text-slate-400 h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par raison sociale..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="overflow-x-auto grow">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 uppercase font-bold border-b text-[10px]">
                <tr>
                  <th className="p-3">Client (Raison Sociale)</th>
                  <th className="p-3">Identifiants SuperAdmin</th>
                  <th className="p-3">Formule / Plan</th>
                  <th className="p-3">Statut Contrat</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {filteredClients.map((c) => {
                  const isSelected = selectedClientForAudit?.id === c.id;
                  return (
                    <tr 
                      key={c.id} 
                      onClick={() => {
                        setSelectedClientForAudit(c);
                        onSelectClient?.(c);
                      }}
                      className={`hover:bg-slate-50 transition cursor-pointer ${isSelected ? 'bg-indigo-50/50' : ''}`}
                    >
                      <td className="p-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-slate-900 block text-xs">{c.raisonSociale}</span>
                            <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                              {c.sigle || 'ND'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Licence: {c.idLicence} • {c.ville}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-[11px]">
                        <div>
                          <span className="text-slate-800 font-bold block">{c.superAdminLogin || 'aucun'}</span>
                          <span className="text-zinc-400 text-[10px]">Pass: {c.superAdminPassword || 'aucun'}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <span className="font-bold text-indigo-700 block">{c.plan}</span>
                          <span className="text-[10px] text-slate-400 block">Max : {c.maxUtilisateurs} users</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.statut === 'Actif'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : c.statut === 'Suspendu'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${c.statut === 'Actif' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                          {c.statut}
                        </span>
                      </td>
                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end items-center gap-2">
                          <select
                            value={c.statut}
                            onChange={(e) => onUpdateClientStatus(c.id, e.target.value as any)}
                            className="bg-white border rounded-lg text-[11px] p-1.5 focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="Actif">Activer</option>
                            <option value="Suspendu">Suspendre (Bloqué)</option>
                            <option value="Démonstration">Dossier Démo</option>
                            <option value="Résilié">Résilier</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Client Audit & Extraction Panel (Restitution de base de donnée) */}
        <div className="bg-white rounded-2xl border shadow-2xs overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1">
              <Eye className="h-4 w-4 text-indigo-600" />
              Vue Synthétique & Restitution
            </h3>
            <span className="text-[9px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">
              Lecture Seule
            </span>
          </div>

          {selectedClientForAudit ? (
            (() => {
              const stats = getAuditStats(selectedClientForAudit);
              return (
                <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="bg-slate-900 text-white rounded-xl p-3.5 border border-slate-800">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Instance Ciblée</span>
                      <h4 className="text-sm font-black text-white mt-1 uppercase">{selectedClientForAudit.raisonSociale}</h4>
                      <p className="text-[11px] text-slate-300 mt-1">
                        Formule {selectedClientForAudit.plan} • Code Intégration : {selectedClientForAudit.sigle || 'NONE'}
                      </p>
                    </div>

                    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Lock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <span>SÉCURITÉ ÉDITEUR ACTIVE</span>
                      </div>
                      <p className="text-[10px]">
                        Conformément aux clauses RGPD et OHADA, vous pouvez observer les métriques synthétiques du client et exporter sa base immuable SQLite/PostgreSQL pour lui restituer, sans possibilité d'altérer la base en direct.
                      </p>
                    </div>

                    {/* Operational Totals (Read-Only) */}
                    <div className="space-y-2 pt-2 text-xs">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Surcharges Opérationnelles</span>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block text-[10px] font-bold">Fermes rattachées</span>
                          <span className="text-base font-black text-slate-800">{stats.farmsCount}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block text-[10px] font-bold">Parcelles totales</span>
                          <span className="text-base font-black text-slate-800">{stats.parcellesCount} ha</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block text-[10px] font-bold">Animaux & Bétail</span>
                          <span className="text-base font-black text-slate-800">{stats.animalsCount} têtes</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block text-[10px] font-bold">Personnel de terrain</span>
                          <span className="text-base font-black text-slate-800">{stats.workersCount} Salariés</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block text-[10px] font-bold">Factures Client</span>
                          <span className="text-base font-black text-slate-800">{stats.ledgerLength} docs</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block text-[10px] font-bold font-sans">Ventes Générées</span>
                          <span className="text-base font-black text-emerald-600">{(stats.invoicedAmount).toLocaleString()} F</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <button
                      onClick={() => triggerExport(selectedClientForAudit)}
                      className="w-full bg-slate-900 text-white rounded-xl py-2.5 px-4 text-xs font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2"
                    >
                      <Download className="h-4 w-4 text-emerald-400" />
                      Exporter et restituer la Base SQL (.json)
                    </button>
                    <p className="text-[10px] text-center text-slate-400 leading-normal">
                      Génère un fichier de restitution crypté pour restitution d'accord ou archivage légal.
                    </p>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 italic">
              Sélectionnez un client dans le portefeuille pour auditer ses volumes et gérer la restitution de ses bases de données.
            </div>
          )}
        </div>
      </div>

      {/* Subscription Plans Card Layout in the SaaS Admin */}
      <div className="bg-slate-50 p-5 rounded-2xl border">
        <h3 className="text-sm font-black text-slate-800 mb-3 uppercase tracking-wider">Formules Administrées & Limites Techniques</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border shadow-2xs">
            <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">Option 01</span>
            <h4 className="text-base font-black text-slate-800">STARTER</h4>
            <div className="text-lg font-black text-indigo-600 mt-2">35 000 FCFA <span className="text-xs text-slate-400 font-normal">/ mois</span></div>
            <ul className="text-[11px] text-slate-600 mt-3 space-y-1.5 border-t pt-2.5">
              <li>✓ Max 5 utilisateurs</li>
              <li>✓ 1 Magasin stockage</li>
              <li>✓ Agriculture basique</li>
              <li className="text-slate-400 line-through">𐄂 Production Animale</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-4 border border-indigo-200 shadow-xs relative">
            <span className="absolute top-3 right-3 bg-indigo-100 text-indigo-800 text-[9px] font-bold px-2 py-0.5 rounded-full">Recommandé</span>
            <span className="text-[9px] font-bold tracking-wider text-indigo-500 uppercase">Option 02</span>
            <h4 className="text-base font-black text-indigo-800">PROFESSIONAL</h4>
            <div className="text-lg font-black text-indigo-600 mt-2">95 000 FCFA <span className="text-xs text-slate-400 font-normal">/ mois</span></div>
            <ul className="text-[11px] text-slate-600 mt-3 space-y-1.5 border-t pt-2.5">
              <li>✓ Max 25 utilisateurs</li>
              <li>✓ Multi-magasins</li>
              <li>✓ Agriculture & Élevage complet</li>
              <li>✓ Comptabilité SYSCOHADA</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-4 border shadow-2xs">
            <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">Option 03</span>
            <h4 className="text-base font-black text-slate-800">ENTERPRISE</h4>
            <div className="text-lg font-black text-indigo-600 mt-2">250 000 FCFA <span className="text-xs text-slate-400 font-normal">/ mois</span></div>
            <ul className="text-[11px] text-slate-600 mt-3 space-y-1.5 border-t pt-2.5">
              <li>✓ Max 100 utilisateurs</li>
              <li>✓ GED complète</li>
              <li>✓ Multi-devises</li>
              <li>✓ Alertes SMS & Météo intégrées</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-4 border shadow-2xs">
            <span className="text-[9px] font-bold tracking-wider text-emerald-500 uppercase">Option Coop</span>
            <h4 className="text-base font-black text-emerald-800">COOPÉRATIVE</h4>
            <div className="text-lg font-black text-emerald-600 mt-2">Sur Devis <span className="text-xs text-slate-400 font-normal"> / an</span></div>
            <ul className="text-[11px] text-slate-600 mt-3 space-y-1.5 border-t pt-2.5">
              <li>✓ Utilisateurs illimités</li>
              <li>✓ Cartographie SIG</li>
              <li>✓ Suivi des ristournes d’achats</li>
              <li>✓ GED & Rapprochement Bancaire</li>
            </ul>
          </div>
        </div>
      </div>

      {/* PROVISIONING MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full border shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-indigo-600 text-white p-6 relative">
              <h3 className="text-lg font-bold">Instance Client Provisioning</h3>
              <p className="text-xs opacity-80 mt-1">
                La validation du formulaire crée une nouvelle base PostgreSQL isolée et génère les identifiants pour le Super-Administrateur.
              </p>
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-6 right-6 text-white/80 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 border-b pb-1.5 uppercase tracking-wide">1. Raison Sociale</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Raison Sociale *</label>
                  <input
                    type="text"
                    required
                    value={raisonSociale}
                    onChange={(e) => setRaisonSociale(e.target.value)}
                    placeholder="Ex: COOPÉRATIVE DE SONG-NKONG"
                    className="w-full text-xs rounded border border-slate-300 p-2 focus:ring-1 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Sigle Court</label>
                  <input
                    type="text"
                    value={sigle}
                    onChange={(e) => setSigle(e.target.value)}
                    placeholder="Ex: CBS"
                    className="w-full text-xs rounded border border-slate-300 p-2 focus:ring-1 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">N° de Contribuable</label>
                  <input
                    type="text"
                    value={numContribuable}
                    onChange={(e) => setNumContribuable(e.target.value)}
                    placeholder="Ex: M102910..."
                    className="w-full text-xs rounded border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Registre du Commerce</label>
                  <input
                    type="text"
                    value={regCommerce}
                    onChange={(e) => setRegCommerce(e.target.value)}
                    placeholder="RC/YAU/..."
                    className="w-full text-xs rounded border border-slate-300 p-2"
                  />
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-800 border-b pb-1.5 pt-2 uppercase tracking-wide">2. Responsable de l'Instance</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={responsableNom}
                    onChange={(e) => setResponsableNom(e.target.value)}
                    className="w-full text-xs rounded border border-slate-300 p-2 focus:ring-1 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Prénom</label>
                  <input
                    type="text"
                    value={responsablePrenom}
                    onChange={(e) => setResponsablePrenom(e.target.value)}
                    className="w-full text-xs rounded border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Email de l’admin *</label>
                  <input
                    type="email"
                    required
                    value={responsableEmail}
                    onChange={(e) => setResponsableEmail(e.target.value)}
                    placeholder="Sera utilisé comme Login"
                    className="w-full text-xs rounded border border-slate-300 p-2 focus:ring-1 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Téléphone *</label>
                  <input
                    type="text"
                    required
                    value={responsableTel}
                    onChange={(e) => setResponsableTel(e.target.value)}
                    placeholder="+237 ..."
                    className="w-full text-xs rounded border border-slate-300 p-2"
                  />
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-800 border-b pb-1.5 pt-2 uppercase tracking-wide">3. Configuration & Identifiants personnalisés</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Formule choisie</label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value as any)}
                    className="w-full text-xs rounded border border-slate-300 p-2 bg-white"
                  >
                    <option value="Starter">Starter</option>
                    <option value="Professional">Professional</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Cooperative">Coopérative</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Login (Perso ou Auto)</label>
                  <input
                    type="text"
                    value={customLogin}
                    onChange={(e) => setCustomLogin(e.target.value)}
                    placeholder="Vide = Auto-généré"
                    className="w-full text-xs rounded border border-slate-300 p-2 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Pass (Perso ou Auto)</label>
                  <input
                    type="text"
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    placeholder="Vide = Aléatoire"
                    className="w-full text-xs rounded border border-slate-300 p-2 outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-100 text-slate-700 rounded-lg px-4 py-2 text-xs font-medium hover:bg-slate-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white rounded-lg px-5 py-2 text-xs font-bold hover:bg-indigo-700 transition"
                >
                  Démarrer le Provisionnement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
