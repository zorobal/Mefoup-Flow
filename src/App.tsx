/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  INITIAL_SAAS_CLIENTS,
  INITIAL_EXPLOITATIONS,
  INITIAL_SITES_AGRICOLES,
  INITIAL_PARCELLES,
  INITIAL_CAMPAGNES,
  INITIAL_CULTURES,
  INITIAL_INTERVENTIONS,
  INITIAL_RECOLTES,
  INITIAL_INCIDENTS_AGRICOLES,
  INITIAL_SITES_ELEVAGE,
  INITIAL_BATIMENTS,
  INITIAL_TROUPEAUX,
  INITIAL_ANIMAUX,
  INITIAL_REPRO_GESTATIONS,
  INITIAL_CARNETS_SANITAIRES,
  INITIAL_FEED_LOGS,
  INITIAL_PROD_ELEVAGES,
  INITIAL_MAGASINS,
  INITIAL_ARTICLES,
  INITIAL_MOUVEMENTS_STOCK,
  INITIAL_EQUIPEMENTS,
  INITIAL_MAINTENANCES,
  INITIAL_FUEL_LOGS,
  INITIAL_FOURNISSEURS,
  INITIAL_DEMANDES_ACHAT,
  INITIAL_BONS_COMMANDE,
  INITIAL_CLIENTS_ACHETEURS,
  INITIAL_DEVIS,
  INITIAL_COMMANDES_CLIENTS,
  INITIAL_FACTURES_CLIENTS,
  INITIAL_ENCAISSEMENTS,
  INITIAL_PIECES_COMPTABLES,
  INITIAL_BUDGETS,
  INITIAL_EMPLOYES,
  INITIAL_PRESENCES,
  INITIAL_BULLETINS,
  INITIAL_DOCUMENTS,
  INITIAL_ALERTE_REGLES,
  INITIAL_NOTIFICATIONS,
  INITIAL_SAAS_LOGS,
  INITIAL_CHAMPS,
  INITIAL_UTILISATEURS,
  INITIAL_COMPTEURS_UTILISATION,
  INITIAL_UTILISATIONS_EQUIPEMENT,
  INITIAL_PLANS_MAINTENANCE,
  INITIAL_PANNES_EQUIPEMENT,
  INITIAL_ASSURANCES_EQUIPEMENT,
  INITIAL_INDICATEURS_KPI,
  INITIAL_RAPPORTS_PROGRAMMES,
  INITIAL_ALERTES_BI
} from './mockData';

import {
  SaaSClient,
  Exploitation,
  SiteAgricole,
  Champ,
  Utilisateur,
  Parcelle,
  Campagne,
  Culture,
  Intervention,
  Recolte,
  IncidentAgricole,
  SiteElevage,
  Batiment,
  Troupeau,
  Animal,
  ReproductionGestation,
  CarnetSanitaire,
  FeedLog,
  ProductionElevage,
  Magasin,
  Article,
  MouvementStock,
  Equipement,
  MaintenanceOrder,
  FuelLog,
  Fournisseur,
  DemandeAchat,
  BonDeCommande,
  ClientAcheteur,
  DevisClient,
  CommandeClient,
  FactureClient,
  EncaissementClient,
  PieceComptable,
  Budget,
  Employe,
  PresencePointage,
  BulletinPaie,
  FichierDocument,
  AlerteRegle,
  NotificationAlerte,
  SaaSLog,
  AuditLog,
  PrevisionMeteo,
  Role,
  CustomLabels,
  SystemSettings,
  TenantDatabase,
  Pays,
  VilleAdmin,
  CompteurUtilisation,
  UtilisationEquipement,
  PlanDeMaintenance,
  PanneEquipement,
  AssuranceEquipement,
  IndicateurKPI,
  TableauDeBord,
  RapportProgramme,
  AlerteBI,
  RequetePersonnalisee
} from './types';

// Importing SaaS modules
import Dashboard from './components/Dashboard';
import AgricultureModule from './components/AgricultureModule';
import ElevageModule from './components/ElevageModule';
import StocksModule from './components/StocksModule';
import CommercialModule from './components/CommercialModule';
import AccountingModule from './components/AccountingModule';
import HRModule from './components/HRModule';
import GEDModule from './components/GEDModule';
import SaaSAdmin from './components/SaaSAdmin';
import SettingsModule from './components/SettingsModule';
import EquipementModule from './components/EquipementModule';
import BIModule from './components/BIModule';

import {
  Building2,
  Sprout,
  Egg,
  Package,
  ShoppingBag,
  Book,
  Users,
  FolderOpen,
  Sliders,
  Bell,
  CheckCircle,
  AlertOctagon,
  LogOut,
  Moon,
  Sun,
  ShieldAlert,
  Terminal,
  Activity,
  Award,
  Laptop,
  Lock,
  Unlock,
  Key,
  Database,
  ArrowRight,
  Settings,
  Wrench,
  LineChart
} from 'lucide-react';

export default function App() {
  // Helper to determine active tenant ID on start before hook evaluations
  const getStartupActiveTenantId = (): string => {
    const saved = localStorage.getItem('activeTenant');
    if (saved) {
      try {
        return JSON.parse(saved).id;
      } catch (e) {}
    }
    return 'client-1';
  };

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [authRole, setAuthRole] = useState<'provider' | 'superadmin' | 'demo' | null>(() => {
    return (localStorage.getItem('authRole') as any) || null;
  });
  const [authError, setAuthError] = useState<string>('');
  const [suspendedClientMessage, setSuspendedClientMessage] = useState<string | null>(null);

  // Signon Input Fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // SaaS Clients Backoffice State
  const [saasClients, setSaasClients] = useState<SaaSClient[]>(() => {
    const saved = localStorage.getItem('saasClients');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SAAS_CLIENTS;
  });
  const [activeTenant, setActiveTenant] = useState<SaaSClient>(() => {
    const saved = localStorage.getItem('activeTenant');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SAAS_CLIENTS[0];
  });
  const [saasLogs, setSaasLogs] = useState<SaaSLog[]>(() => {
    const saved = localStorage.getItem('saasLogs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SAAS_LOGS;
  });

  // -------------------------------------------------------------
  // isolated tenant-database & settings configuration architecture
  // -------------------------------------------------------------
  const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
    customLabels: {
      prodVegetale: 'Production Végétale',
      prodAnimale: 'Production Animale',
      cultures: 'Cultures',
      animaux: 'Animaux',
      parcelles: 'Parcelles',
      postes: 'Postes / Fonctions',
      produitsServices: 'Produits & Services',
      villes: 'Villes de déploiement',
      quartiersVillages: 'Quartiers / Villages / Secteurs'
    },
    roles: [
      {
        id: 'role-superadmin',
        name: 'Super Administrateur',
        modules: ['dashboard', 'agriculture', 'elevage', 'stocks', 'commercial', 'compta', 'rh', 'ged', 'settings', 'parc-materiel', 'bi-reporting'],
        canModify: true,
        canDelete: true,
        canImport: true,
        canExport: true
      },
      {
        id: 'role-veto',
        name: 'Médecin Vétérinaire / Éleveur',
        modules: ['dashboard', 'elevage', 'stocks', 'ged'],
        canModify: true,
        canDelete: false,
        canImport: false,
        canExport: true
      },
      {
        id: 'role-comptable',
        name: 'Comptable Agréé',
        modules: ['dashboard', 'commercial', 'compta', 'rh', 'ged'],
        canModify: true,
        canDelete: false,
        canImport: true,
        canExport: true
      },
      {
        id: 'role-ouvrier',
        name: 'Ouvrier Agricole',
        modules: ['dashboard', 'agriculture', 'stocks'],
        canModify: false,
        canDelete: false,
        canImport: false,
        canExport: false
      }
    ],
    activeRoleId: 'role-superadmin'
  };

  function getInitialDatabase(tenantId: string): TenantDatabase {
    if (tenantId === 'client-1' || tenantId === 'client-demo') {
      return {
        exploitations: INITIAL_EXPLOITATIONS,
        sitesAgricoles: INITIAL_SITES_AGRICOLES,
        champs: INITIAL_CHAMPS,
        parcelles: INITIAL_PARCELLES,
        utilisateurs: INITIAL_UTILISATEURS,
        campagnes: INITIAL_CAMPAGNES,
        cultures: INITIAL_CULTURES,
        interventions: INITIAL_INTERVENTIONS,
        recoltes: INITIAL_RECOLTES,
        incidents: INITIAL_INCIDENTS_AGRICOLES,
        sitesElevage: INITIAL_SITES_ELEVAGE,
        batiments: INITIAL_BATIMENTS,
        troupeaux: INITIAL_TROUPEAUX,
        animaux: INITIAL_ANIMAUX,
        reproGestations: INITIAL_REPRO_GESTATIONS,
        carnetsSanitaires: INITIAL_CARNETS_SANITAIRES,
        feedLogs: INITIAL_FEED_LOGS,
        prodElevages: INITIAL_PROD_ELEVAGES,
        magasins: INITIAL_MAGASINS,
        articles: INITIAL_ARTICLES,
        mouvementsStock: INITIAL_MOUVEMENTS_STOCK,
        equipements: INITIAL_EQUIPEMENTS,
        maintenances: INITIAL_MAINTENANCES,
        fuelLogs: INITIAL_FUEL_LOGS,
        fournisseurs: INITIAL_FOURNISSEURS,
        demandesAchat: INITIAL_DEMANDES_ACHAT,
        bonsCommande: INITIAL_BONS_COMMANDE,
        clientsAcheteurs: INITIAL_CLIENTS_ACHETEURS,
        devis: INITIAL_DEVIS,
        commandesClients: INITIAL_COMMANDES_CLIENTS,
        factures: INITIAL_FACTURES_CLIENTS,
        encaissements: INITIAL_ENCAISSEMENTS,
        piecesComptables: INITIAL_PIECES_COMPTABLES,
        budgets: INITIAL_BUDGETS,
        employes: INITIAL_EMPLOYES,
        presences: INITIAL_PRESENCES,
        bulletins: INITIAL_BULLETINS,
        documents: INITIAL_DOCUMENTS,
        regles: INITIAL_ALERTE_REGLES,
        notifications: INITIAL_NOTIFICATIONS,
        compteursUtilisation: INITIAL_COMPTEURS_UTILISATION,
        utilisationsEquipement: INITIAL_UTILISATIONS_EQUIPEMENT,
        plansMaintenance: INITIAL_PLANS_MAINTENANCE,
        pannesEquipement: INITIAL_PANNES_EQUIPEMENT,
        assurancesEquipement: INITIAL_ASSURANCES_EQUIPEMENT,
        indicateursKPI: INITIAL_INDICATEURS_KPI,
        tableauxDeBord: [],
        rapportsProgrammes: INITIAL_RAPPORTS_PROGRAMMES,
        alertesBI: INITIAL_ALERTES_BI,
        requetesPerso: [],
        auditLogs: [
          { id: 'aud-1', dateHeure: '2026-06-18 08:00', operateur: 'System Worker', role: 'Comptable', action: 'OHADA_BAL', description: 'Re-calcul global de la balance du grand livre (SYSCOHADA révisé)' },
          { id: 'aud-2', dateHeure: '2026-06-18 09:15', operateur: 'Dr. Amadou Diallo', role: 'Vétérinaire', action: 'VET_DIAG', description: 'Ajout diagnostic mastite sur Bovin COW-00921' },
          { id: 'aud-3', dateHeure: '2026-06-18 10:45', operateur: 'Tchanga Michel', role: 'Super Admin', action: 'STOCK_OUT', description: 'Sortie d’intrants de 30 sacs d’engrais NPK pour parcelle Nord-01' }
        ],
        systemSettings: DEFAULT_SYSTEM_SETTINGS
      };
    } else {
      return {
        exploitations: [],
        sitesAgricoles: [],
        champs: [],
        parcelles: [],
        utilisateurs: [],
        campagnes: [],
        cultures: [],
        interventions: [],
        recoltes: [],
        incidents: [],
        sitesElevage: [],
        batiments: [],
        troupeaux: [],
        animaux: [],
        reproGestations: [],
        carnetsSanitaires: [],
        feedLogs: [],
        prodElevages: [],
        magasins: [],
        articles: [],
        mouvementsStock: [],
        equipements: [],
        maintenances: [],
        fuelLogs: [],
        fournisseurs: [],
        demandesAchat: [],
        bonsCommande: [],
        clientsAcheteurs: [],
        devis: [],
        commandesClients: [],
        factures: [],
        encaissements: [],
        piecesComptables: [],
        budgets: [],
        employes: [],
        presences: [],
        bulletins: [],
        documents: [],
        regles: INITIAL_ALERTE_REGLES,
        notifications: [],
        auditLogs: [
          { id: 'aud-ini', dateHeure: new Date().toISOString().replace('T', ' ').substring(0, 16), operateur: 'Système', role: 'SuperAdmin', action: 'PROVISION_DB', description: 'Base de données isolée initialisée avec succès pour la nouvelle instance.' }
        ],
        systemSettings: DEFAULT_SYSTEM_SETTINGS
      };
    }
  }

  const [databases, setDatabases] = useState<Record<string, TenantDatabase>>(() => {
    const saved = localStorage.getItem('tenantDatabases');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Repair each tenant's roles to ensure Super Administrateur has all modules
        Object.keys(parsed).forEach(tenantId => {
          const db = parsed[tenantId];
          if (db && db.systemSettings && db.systemSettings.roles) {
            const adminRole = db.systemSettings.roles.find((r: any) => r.id === 'role-superadmin');
            if (adminRole) {
              const expectedModules = ['dashboard', 'agriculture', 'elevage', 'stocks', 'commercial', 'compta', 'rh', 'ged', 'settings', 'parc-materiel', 'bi-reporting'];
              expectedModules.forEach(mod => {
                if (!adminRole.modules.includes(mod)) {
                  adminRole.modules.push(mod);
                }
              });
            }
          }
        });
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return {
      'client-1': getInitialDatabase('client-1'),
      'client-demo': getInitialDatabase('client-demo'),
    };
  });

  const getInitialDb = (): TenantDatabase => {
    const initialActiveTenantId = getStartupActiveTenantId();
    const savedDbStr = localStorage.getItem('tenantDatabases');
    if (savedDbStr) {
      try {
        const parsed = JSON.parse(savedDbStr);
        if (parsed[initialActiveTenantId]) {
          const db = parsed[initialActiveTenantId];
          // Auto-repair role-superadmin and other roles if systemSettings are present but outdated
          if (db.systemSettings && db.systemSettings.roles) {
            const adminRole = db.systemSettings.roles.find((r: any) => r.id === 'role-superadmin');
            if (adminRole) {
              const expectedModules = ['dashboard', 'agriculture', 'elevage', 'stocks', 'commercial', 'compta', 'rh', 'ged', 'settings', 'parc-materiel', 'bi-reporting'];
              expectedModules.forEach(mod => {
                if (!adminRole.modules.includes(mod)) {
                  adminRole.modules.push(mod);
                }
              });
            }
          }
          return db;
        }
      } catch (e) {}
    }
    return getInitialDatabase(initialActiveTenantId);
  };

  const initialDb = getInitialDb();

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(initialDb.systemSettings || DEFAULT_SYSTEM_SETTINGS);

  // General App Modes: "client-erp" vs "saas-admin"
  const [appMode, setAppMode] = useState<'client-erp' | 'saas-admin'>(() => {
    return (localStorage.getItem('appMode') as any) || 'client-erp';
  });

  // Currently active ERP internal tab
  const [erpTab, setErpTab] = useState<'dashboard' | 'agriculture' | 'elevage' | 'stocks' | 'commercial' | 'compta' | 'rh' | 'ged' | 'settings' | 'parc-materiel' | 'bi-reporting'>(() => {
    return (localStorage.getItem('erpTab') as any) || 'dashboard';
  });

  // Multi-tenant ERP states
  const [exploitations, setExploitations] = useState<Exploitation[]>(initialDb.exploitations);
  const [sitesAgricoles, setSitesAgricoles] = useState<SiteAgricole[]>(initialDb.sitesAgricoles);
  const [champs, setChamps] = useState<Champ[]>(initialDb.champs || []);
  const [parcelles, setParcelles] = useState<Parcelle[]>(initialDb.parcelles);
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>(initialDb.utilisateurs || []);
  const [campagnes, setCampagnes] = useState<Campagne[]>(initialDb.campagnes);
  const [cultures, setCultures] = useState<Culture[]>(initialDb.cultures);
  const [interventions, setInterventions] = useState<Intervention[]>(initialDb.interventions);
  const [recoltes, setRecoltes] = useState<Recolte[]>(initialDb.recoltes);
  const [incidents, setIncidents] = useState<IncidentAgricole[]>(initialDb.incidents);

  const [sitesElevage, setSitesElevage] = useState<SiteElevage[]>(initialDb.sitesElevage);
  const [batiments, setBatiments] = useState<Batiment[]>(initialDb.batiments);
  const [troupeaux, setTroupeaux] = useState<Troupeau[]>(initialDb.troupeaux);
  const [animaux, setAnimaux] = useState<Animal[]>(initialDb.animaux);
  const [reproGestations, setReproGestations] = useState<ReproductionGestation[]>(initialDb.reproGestations);
  const [carnetsSanitaires, setCarnetsSanitaires] = useState<CarnetSanitaire[]>(initialDb.carnetsSanitaires);
  const [feedLogs, setFeedLogs] = useState<FeedLog[]>(initialDb.feedLogs);
  const [prodElevages, setProdElevages] = useState<ProductionElevage[]>(initialDb.prodElevages);

  const [magasins, setMagasins] = useState<Magasin[]>(initialDb.magasins);
  const [articles, setArticles] = useState<Article[]>(initialDb.articles);
  const [mouvementsStock, setMouvementsStock] = useState<MouvementStock[]>(initialDb.mouvementsStock);
  const [equipements, setEquipements] = useState<Equipement[]>(initialDb.equipements);
  const [maintenances, setMaintenances] = useState<MaintenanceOrder[]>(initialDb.maintenances);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(initialDb.fuelLogs);

  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>(initialDb.fournisseurs);
  const [demandesAchat, setDemandesAchat] = useState<DemandeAchat[]>(initialDb.demandesAchat);
  const [bonsCommande, setBonsCommande] = useState<BonDeCommande[]>(initialDb.bonsCommande);
  const [clientsAcheteurs, setClientsAcheteurs] = useState<ClientAcheteur[]>(initialDb.clientsAcheteurs);
  const [devis, setDevis] = useState<DevisClient[]>(initialDb.devis);
  const [commandesClients, setCommandesClients] = useState<CommandeClient[]>(initialDb.commandesClients);
  const [factures, setFactures] = useState<FactureClient[]>(initialDb.factures);
  const [encaissements, setEncaissements] = useState<EncaissementClient[]>(initialDb.encaissements);

  const [piecesComptables, setPiecesComptables] = useState<PieceComptable[]>(initialDb.piecesComptables);
  const [budgets, setBudgets] = useState<Budget[]>(initialDb.budgets);

  // Custom Admin Agricultural Constants (Requested Features)
  const [typesCulture, setTypesCulture] = useState<string[]>(['Maïs Grain', 'Cacao', 'Tomate de Table', 'Haricots', 'Banane Plantain']);
  const [typesOperation, setTypesOperation] = useState<string[]>(['Labour', 'Semis', 'Fertilisation', 'Irrigation', 'Traitement phytosanitaire', 'Récolte']);
  const [responsablesTerrain, setResponsablesTerrain] = useState<{name: string, type: 'Employé' | 'Prestataire Externe', info: string}[]>([
    { name: 'Jean-Pierre Ondoa', type: 'Employé', info: 'Chef de Champ CDI' },
    { name: 'Dr. Amadou Diallo', type: 'Employé', info: 'Vétérinaire Senior' },
    { name: 'ETS Soproicam', type: 'Prestataire Externe', info: 'Charrue & Labour' },
    { name: 'Agro-Services Cam', type: 'Prestataire Externe', info: 'Pulvérisation & Entretien' }
  ]);
  const [substances, setSubstances] = useState<{name: string, type: string, description: string}[]>([
    { name: 'Engrais NPK 20-10-10', type: 'Fertilisant', description: 'Favorise la croissance' },
    { name: 'Urée 46%', type: 'Fertilisant', description: 'Apport en azote' },
    { name: 'Callidim Phytosanitaire', type: 'Fongicide', description: 'Contrôle des parasites' },
    { name: 'Compost Organique', type: 'Amendement', description: 'Restructuration de sol' }
  ]);

  // Geographic management: 1 Country has many Cities, 1 City belongs to one and only one Country
  const [paysList, setPaysList] = useState<Pays[]>([
    { id: 'pays-1', nom: 'Cameroun', codeISO: 'CMR', indicatifTelephonique: '+237' },
    { id: 'pays-2', nom: 'Côte d\'Ivoire', codeISO: 'CIV', indicatifTelephonique: '+225' },
    { id: 'pays-3', nom: 'Sénégal', codeISO: 'SEN', indicatifTelephonique: '+221' }
  ]);

  const [villesList, setVillesList] = useState<VilleAdmin[]>([
    { id: 'ville-1', nom: 'Yaoundé', paysId: 'pays-1', codeRegion: 'Centre' },
    { id: 'ville-2', nom: 'Douala', paysId: 'pays-1', codeRegion: 'Littoral' },
    { id: 'ville-3', nom: 'Obala', paysId: 'pays-1', codeRegion: 'Centre' },
    { id: 'ville-4', nom: 'Abidjan', paysId: 'pays-2', codeRegion: 'Lagunes' },
    { id: 'ville-5', nom: 'Bouaké', paysId: 'pays-2', codeRegion: 'Vallée du Bandama' },
    { id: 'ville-6', nom: 'Dakar', paysId: 'pays-3', codeRegion: 'Dakar' }
  ]);

  const [employes, setEmployes] = useState<Employe[]>(initialDb.employes);
  const [presences, setPresences] = useState<PresencePointage[]>(initialDb.presences);
  const [bulletins, setBulletins] = useState<BulletinPaie[]>(initialDb.bulletins);

  const [documents, setDocuments] = useState<FichierDocument[]>(initialDb.documents);
  const [regles, setRegles] = useState<AlerteRegle[]>(initialDb.regles);
  const [notifications, setNotifications] = useState<NotificationAlerte[]>(initialDb.notifications);

  // Integrated Internal Audit Trails with Operator identification
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialDb.auditLogs);

  // --- FLEET & MAINTENANCE GMAO COMPILER STATE VARIABLES ---
  const [compteursUtilisation, setCompteursUtilisation] = useState<CompteurUtilisation[]>(initialDb.compteursUtilisation || []);
  const [utilisationsEquipement, setUtilisationsEquipement] = useState<UtilisationEquipement[]>(initialDb.utilisationsEquipement || []);
  const [plansMaintenance, setPlansMaintenance] = useState<PlanDeMaintenance[]>(initialDb.plansMaintenance || []);
  const [pannesEquipement, setPannesEquipement] = useState<PanneEquipement[]>(initialDb.pannesEquipement || []);
  const [assurancesEquipement, setAssurancesEquipement] = useState<AssuranceEquipement[]>(initialDb.assurancesEquipement || []);

  // --- BI & DECISIONAL SYSTEMS STATE VARIABLES ---
  const [indicateursKPI, setIndicateursKPI] = useState<IndicateurKPI[]>(initialDb.indicateursKPI || []);
  const [tableauxDeBord, setTableauxDeBord] = useState<TableauDeBord[]>(initialDb.tableauxDeBord || []);
  const [rapportsProgrammes, setRapportsProgrammes] = useState<RapportProgramme[]>(initialDb.rapportsProgrammes || []);
  const [alertesBI, setAlertesBI] = useState<AlerteBI[]>(initialDb.alertesBI || []);
  const [requetesPerso, setRequetesPerso] = useState<RequetePersonnalisee[]>(initialDb.requetesPerso || []);

  const [currentUser, setCurrentUser] = useState<Utilisateur | null>(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  React.useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // Live auto-repair for superadmin settings, ensuring newly loaded browser states automatically gain newly added modules
  React.useEffect(() => {
    const adminRole = systemSettings?.roles?.find(r => r.id === 'role-superadmin');
    if (adminRole) {
      const expectedModules = ['dashboard', 'agriculture', 'elevage', 'stocks', 'commercial', 'compta', 'rh', 'ged', 'settings', 'parc-materiel', 'bi-reporting'];
      const missing = expectedModules.filter(mod => !adminRole.modules.includes(mod));
      if (missing.length > 0) {
        setSystemSettings(prev => {
          const updatedRoles = prev.roles.map(r => {
            if (r.id === 'role-superadmin') {
              return {
                ...r,
                modules: Array.from(new Set([...r.modules, ...missing]))
              };
            }
            return r;
          });
          return {
            ...prev,
            roles: updatedRoles
          };
        });
      }
    }
  }, [systemSettings]);

  // Real-time weather parameters
  const [currentWeather, setCurrentWeather] = useState<PrevisionMeteo>({
    date: '2026-06-18',
    temperatureCelcius: 28,
    conditionsCiel: 'Orages isolés',
    risquesPluiePourcent: 65,
    humiditeRecense: 82,
    directionVent: 'Sud-Ouest 14 Km/h'
  });

  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  // UTILITY AUDIT LOGGER
  const logAudit = (action: string, description: string, overrideOperateur?: string, overrideRole?: string) => {
    const activeRoleObj = systemSettings.roles.find(r => r.id === systemSettings.activeRoleId) || systemSettings.roles[0];
    const defaultOperateur = authRole === 'demo' ? 'Visiteur Démo' : (activeTenant?.responsablePrenom ? `${activeTenant.responsablePrenom} ${activeTenant.responsableNom}` : 'Administrateur');
    const operateur = overrideOperateur || defaultOperateur;
    const role = overrideRole || activeRoleObj.name;

    const newLog: AuditLog = {
      id: 'aud-' + Math.floor(Math.random() * 10000),
      dateHeure: new Date().toISOString().replace('T', ' ').substring(0, 16),
      operateur,
      role,
      action,
      description
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Redirect erpTab if the active simulated role loses visibility of the currently open tab
  React.useEffect(() => {
    const activeRoleObj = systemSettings.roles.find(r => r.id === systemSettings.activeRoleId) || systemSettings.roles[0];
    if (activeRoleObj && !activeRoleObj.modules.includes(erpTab as string)) {
      const firstAllowed = activeRoleObj.modules[0] as any;
      if (firstAllowed) {
        setErpTab(firstAllowed);
      }
    }
  }, [systemSettings.activeRoleId]);

  // --- LOCAL PERSISTENCE BACKUP ENGINES ---
  React.useEffect(() => {
    localStorage.setItem('saasClients', JSON.stringify(saasClients));
  }, [saasClients]);

  React.useEffect(() => {
    localStorage.setItem('saasLogs', JSON.stringify(saasLogs));
  }, [saasLogs]);

  React.useEffect(() => {
    localStorage.setItem('isLoggedIn', String(isLoggedIn));
  }, [isLoggedIn]);

  React.useEffect(() => {
    if (authRole) {
      localStorage.setItem('authRole', authRole);
    } else {
      localStorage.removeItem('authRole');
    }
  }, [authRole]);

  React.useEffect(() => {
    localStorage.setItem('appMode', appMode);
  }, [appMode]);

  React.useEffect(() => {
    if (activeTenant) {
      localStorage.setItem('activeTenant', JSON.stringify(activeTenant));
    }
  }, [activeTenant]);

  React.useEffect(() => {
    localStorage.setItem('erpTab', erpTab);
  }, [erpTab]);

  React.useEffect(() => {
    // Sync active tenant states back into databases map dynamically, then persist databases to localStorage
    if (!activeTenant || !activeTenant.id) return;
    setDatabases(prev => {
      const updated = {
        ...prev,
        [activeTenant.id]: {
          exploitations,
          sitesAgricoles,
          champs,
          parcelles,
          utilisateurs,
          campagnes,
          cultures,
          interventions,
          recoltes,
          incidents,
          sitesElevage,
          batiments,
          troupeaux,
          animaux,
          reproGestations,
          carnetsSanitaires,
          feedLogs,
          prodElevages,
          magasins,
          articles,
          mouvementsStock,
          equipements,
          maintenances,
          fuelLogs,
          fournisseurs,
          demandesAchat,
          bonsCommande,
          clientsAcheteurs,
          devis,
          commandesClients,
          factures,
          encaissements,
          piecesComptables,
          budgets,
          employes,
          presences,
          bulletins,
          documents,
          regles,
          notifications,
          auditLogs,
          systemSettings,
          compteursUtilisation,
          utilisationsEquipement,
          plansMaintenance,
          pannesEquipement,
          assurancesEquipement,
          indicateursKPI,
          tableauxDeBord,
          rapportsProgrammes,
          alertesBI,
          requetesPerso
        }
      };
      localStorage.setItem('tenantDatabases', JSON.stringify(updated));
      return updated;
    });
  }, [
    activeTenant?.id,
    exploitations,
    sitesAgricoles,
    champs,
    parcelles,
    utilisateurs,
    campagnes,
    cultures,
    interventions,
    recoltes,
    incidents,
    sitesElevage,
    batiments,
    troupeaux,
    animaux,
    reproGestations,
    carnetsSanitaires,
    feedLogs,
    prodElevages,
    magasins,
    articles,
    mouvementsStock,
    equipements,
    maintenances,
    fuelLogs,
    fournisseurs,
    demandesAchat,
    bonsCommande,
    clientsAcheteurs,
    devis,
    commandesClients,
    factures,
    encaissements,
    piecesComptables,
    budgets,
    employes,
    presences,
    bulletins,
    documents,
    regles,
    notifications,
    auditLogs,
    systemSettings,
    compteursUtilisation,
    utilisationsEquipement,
    plansMaintenance,
    pannesEquipement,
    assurancesEquipement,
    indicateursKPI,
    tableauxDeBord,
    rapportsProgrammes,
    alertesBI,
    requetesPerso
  ]);

  // HANDLERS FOR NEW SEED DATA FROM INDIVIDUAL COMPONENTS //

  // SaaS administrator actions
  const handleProvisionTenant = (newClient: SaaSClient) => {
    setSaasClients(prev => [...prev, newClient]);
    const log: SaaSLog = {
      id: 'l-' + Math.floor(Math.random() * 10000),
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      utilisateur: 'SaaS Admin',
      ip: '192.168.1.100',
      action: `Provisionnement de la licence client : ${newClient.raisonSociale}`,
      module: 'SaaS Engine',
      statut: 'Succès'
    };
    setSaasLogs(prev => [log, ...prev]);
  };

  const handleUpdateTenantStatus = (clientId: string, status: SaaSClient['statut']) => {
    setSaasClients(prev => prev.map(c => c.id === clientId ? { ...c, statut: status } : c));
    
    // If the currently active customer's status became suspended, keep activeTenant in sync to lock views
    if (activeTenant.id === clientId) {
      setActiveTenant(prev => ({ ...prev, statut: status }));
    }
  };

  // Restores all payload entities from a selected json file
  const handleRestoreBackup = (backupObj: any) => {
    const payload = backupObj.payload || backupObj;
    
    if (payload.exploitations) setExploitations(payload.exploitations);
    if (payload.parcelles) setParcelles(payload.parcelles);
    if (payload.animaux) setAnimaux(payload.animaux);
    if (payload.employes) setEmployes(payload.employes);
    if (payload.factures) setFactures(payload.factures);
    if (payload.pieces) setPiecesComptables(payload.pieces);
    if (payload.articles) setArticles(payload.articles);

    logAudit('DB_RESTORE', `Restauration de la base de données client opérée par l’Éditeur SaaS.`);
  };

  // User management handlers
  const handleUpdateCurrentUser = (updated: Utilisateur) => {
    setCurrentUser(updated);
  };

  const handleAddUtilisateur = (user: Utilisateur) => {
    setUtilisateurs(prev => [...prev, user]);
  };

  const handleUpdateUtilisateur = (user: Utilisateur) => {
    setUtilisateurs(prev => prev.map(u => u.id === user.id ? user : u));
    if (currentUser && currentUser.id === user.id) {
      setCurrentUser(user);
    }
  };

  const handleDeleteUtilisateur = (id: string) => {
    setUtilisateurs(prev => prev.filter(u => u.id !== id));
  };

  // Agriculture actions
  const handleAddChamp = (newChamp: Champ) => {
    setChamps(prev => [...prev, newChamp]);
    logAudit('AGRI_CHAMP', `Nouveau champ enregistré : ${newChamp.nom} (${newChamp.ville})`);
  };

  const handleUpdateChamp = (updated: Champ) => {
    setChamps(prev => prev.map(c => c.id === updated.id ? updated : c));
    logAudit('AGRI_CHAMP', `Champ modifié : ${updated.nom} (${updated.ville})`);
  };

  const handleDeleteChamp = (id: string) => {
    const champ = champs.find(c => c.id === id);
    setChamps(prev => prev.filter(c => c.id !== id));
    logAudit('AGRI_CHAMP', `Champ supprimé : ${champ?.nom || id}`);
  };

  const handleAddParcelle = (newParc: Parcelle) => {
    setParcelles(prev => [...prev, newParc]);
    logAudit('AGRI_PARCELLE', `Nouvelle parcelle cadastrée : ${newParc.nom} (${newParc.surface} HA)`);
  };

  const handleUpdateParcelle = (updated: Parcelle) => {
    setParcelles(prev => prev.map(p => p.id === updated.id ? updated : p));
    logAudit('AGRI_PARCELLE_SURF', `Mise à jour / Décrémentation de la surface restante de la parcelle ${updated.nom} (${updated.surface} HA)`);
  };

  const handleAddTypeCulture = (tc: string) => {
    setTypesCulture(prev => [...prev, tc]);
    logAudit('ADMIN_AGRI', `Création d'un nouveau Type de Culture : ${tc}`);
  };

  const handleAddTypeOperation = (to: string) => {
    setTypesOperation(prev => [...prev, to]);
    logAudit('ADMIN_AGRI', `Création d'un nouveau Type d'Opération : ${to}`);
  };

  const handleAddResponsableTerrain = (resp: {name: string, type: 'Employé' | 'Prestataire Externe', info: string}) => {
    setResponsablesTerrain(prev => [...prev, resp]);
    logAudit('ADMIN_AGRI', `Création d'un nouveau Responsable Terrain : ${resp.name} (${resp.type})`);
  };

  const handleAddSubstance = (subs: {name: string, type: string, description: string}) => {
    setSubstances(prev => [...prev, subs]);
    logAudit('ADMIN_AGRI', `Création d'une nouvelle Substance Intrant : ${subs.name} (${subs.type})`);
  };

  const handleAddCampagneObj = (camp: Campagne) => {
    setCampagnes(prev => [...prev, camp]);
    logAudit('ADMIN_AGRI', `Ouverture d'une nouvelle Campagne Agricole : ${camp.nom} (${camp.annee})`);
  };

  const handleAddPays = (p: Pays) => {
    setPaysList(prev => [...prev, p]);
    logAudit('ADMIN_GEO', `Ajout d'un pays géographique : ${p.nom} (Code ISO: ${p.codeISO})`);
  };

  const handleAddVille = (v: VilleAdmin) => {
    setVillesList(prev => [...prev, v]);
    const targetPays = paysList.find(p => p.id === v.paysId);
    logAudit('ADMIN_GEO', `Ajout d'une ville géographique : ${v.nom} rattachée au pays : ${targetPays?.nom || v.paysId}`);
  };

  const handleAddCulture = (newCult: Culture) => {
    setCultures(prev => [...prev, newCult]);
    logAudit('AGRI_CULTURE', `Lancement d'une nouvelle culture de ${newCult.nom} sur la parcelle`);
  };

  const handleUpdateCulture = (updatedCult: Culture) => {
    setCultures(prev => prev.map(c => c.id === updatedCult.id ? updatedCult : c));
    logAudit('AGRI_CULTURE', `Mise à jour de la culture de ${updatedCult.nom} (Statut: ${updatedCult.statut})`);
  };

  const handleAddIncident = (newInc: IncidentAgricole) => {
    setIncidents(prev => [...prev, newInc]);
    logAudit('AGRI_INCIDENT', `Nouvel incident/aléa enregistré : ${newInc.type} (${newInc.perteEstimeeFCFA.toLocaleString()} FCFA)`);
  };

  const handleAddIntervention = (newInt: Intervention) => {
    setInterventions(prev => [...prev, newInt]);
    logAudit('AGRI_INT', `Nouvelle intervention culturale enregistrée (${newInt.type})`);
  };

  const handleAddRecolte = (newRec: Recolte) => {
    setRecoltes(prev => [...prev, newRec]);
    logAudit('AGRI_RECOLT', `Pesée générale de récolte enregistrée : ${newRec.quantite} ${newRec.unite}`);
  };

  // Livestock/elevage actions
  const handleAddAnimaux = (newAni: Animal) => {
    setAnimaux(prev => [...prev, newAni]);
    logAudit('VETO_ANI', `Inoculation / Naissance de bête codeUnique : ${newAni.codeUnique}`);
  };

  const handleAddSanitaire = (newCS: CarnetSanitaire) => {
    setCarnetsSanitaires(prev => [...prev, newCS]);
    logAudit('VETO_SAN', `Saisie d'une fiche d'intervention vétérinaire : ${newCS.diagnostic}`);
  };

  const handleAddFeed = (newFeed: FeedLog) => {
    setFeedLogs(prev => [...prev, newFeed]);
    logAudit('FEED_LOG', `Distribution alimentaire au troupeau : ${newFeed.aliment} (${newFeed.quantiteKg} Kg)`);
  };

  const handleAddProductionElevage = (newProd: ProductionElevage) => {
    setProdElevages(prev => [...prev, newProd]);
    logAudit('ELEV_PROD', `Collecte journalière de production enregistrée : ${newProd.quantite} ${newProd.unite} de ${newProd.type}`);
  };

  // Stocks / Warehousing actions
  const handleAddMouvementStock = (newMvt: MouvementStock) => {
    setMouvementsStock(prev => [...prev, newMvt]);
    logAudit('STK_MVT', `Mouvement de stock enregistré: ${newMvt.type} de ${newMvt.quantite} unités`);
  };

  const handleAddMaintenance = (newMaint: MaintenanceOrder) => {
    setMaintenances(prev => [...prev, newMaint]);
    logAudit('TRACK_MAINT', `Planification d'un ordre de maintenance mécanique : ${newMaint.description}`);
  };

  const handleAddFuelLog = (newFuel: FuelLog) => {
    setFuelLogs(prev => [...prev, newFuel]);
    logAudit('CARBURANT', `Consommation fuel enregistrée pour l'engin : ${newFuel.quantiteLitre} Litres`);
  };

  // Sales & Purchases
  const handleAddDemandeAchat = (newDA: DemandeAchat) => {
    setDemandesAchat(prev => [...prev, newDA]);
    logAudit('ACHAT_DA', `Émission d'une demande d'intrants d'achat : ${newDA.designationArticle} (${newDA.quantite} ${newDA.unite})`);
  };

  const handleAddBonCommande = (newBC: BonDeCommande) => {
    setBonsCommande(prev => [...prev, newBC]);
    logAudit('ACHAT_BC2', `Nouveau bon de commande fournisseur validé : ${newBC.code} (${newBC.total} FCFA)`);
  };

  const handleAddClientAcheteur = (newCli: ClientAcheteur) => {
    setClientsAcheteurs(prev => [...prev, newCli]);
    logAudit('CLI_ADD', `Inscription portefeuille client : ${newCli.raisonSociale}`);
  };

  const handleAddDevis = (newDev: DevisClient) => {
    setDevis(prev => [...prev, newDev]);
    logAudit('VEN_DEV', `Établissement devis de négociation client: ${newDev.code}`);
  };

  const handleAddCommandeClient = (newCC: CommandeClient) => {
    setCommandesClients(prev => [...prev, newCC]);
  };

  const handleConvertDevisToCommande = (devisId: string) => {
    const target = devis.find(d => d.id === devisId);
    if (!target) return;
    
    // Switch devis status
    setDevis(prev => prev.map(d => d.id === devisId ? { ...d, statut: 'Accepté' } : d));

    // Register active order
    const newCmd: CommandeClient = {
      id: 'cmd-' + Math.floor(Math.random() * 10000),
      idClient: target.idClient,
      code: 'CMD-CONV-' + Math.floor(100+Math.random()*900),
      date: new Date().toISOString().split('T')[0],
      produit: target.produit,
      quantite: target.quantite,
      prixUnitaire: target.prixUnitaire,
      total: target.total,
      statut: 'En préparation',
      commercialId: 'emp-5'
    };
    setCommandesClients(prev => [...prev, newCmd]);

    // Create Standard Invoice
    const newFac: FactureClient = {
      id: 'fac-' + Math.floor(Math.random() * 10000),
      idClient: target.idClient,
      type: 'Standard',
      code: 'FAC-AUTO-' + Math.floor(100+Math.random()*900),
      date: new Date().toISOString().split('T')[0],
      dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      produit: target.produit,
      quantite: target.quantite,
      total: target.total,
      statut: 'Non payée'
    };
    setFactures(prev => [...prev, newFac]);

    logAudit('DEV_CONVERT', `Conversion automatique Devis ${target.code} ➔ Commande & Facture d’un montant de ${target.total} FCFA`);
  };

  const handleAddFacture = (newFac: FactureClient) => {
    setFactures(prev => [...prev, newFac]);
  };

  const handleAddEncaissementClient = (newEnc: EncaissementClient) => {
    setEncaissements(prev => [...prev, newEnc]);

    // Mark corresponding invoice as partially or fully paid
    setFactures(prev => prev.map(f => f.id === newEnc.idFacture ? { ...f, statut: 'Payée' } : f));

    // Create compensating accounting double-entry in general ledger
    const targetFac = factures.find(f => f.id === newEnc.idFacture);
    if (targetFac) {
      const newPC: PieceComptable = {
        id: 'pc-' + Math.floor(Math.random() * 10000),
        date: newEnc.date,
        codeJournal: 'BQ',
        refePiece: `ENC-${targetFac.code}`,
        libelle: `Encaissement reçu pour ${targetFac.code}`,
        debitCompte: `5211 (Banque ${newEnc.modePaiement})`,
        creditCompte: '4111 (Clients nationaux)',
        montant: newEnc.montant,
        valide: true,
        centreCoutAnalytique: 'Trésorerie Centrale'
      };
      setPiecesComptables(prev => [...prev, newPC]);
    }

    logAudit('CASH_REC', `Saisie de règlement financier de ${newEnc.montant} FCFA réf: ${newEnc.reference}`);
  };

  // Accounting double entry
  const handleAddPieceComptable = (newPiece: PieceComptable) => {
    setPiecesComptables(prev => [...prev, newPiece]);
    logAudit('OHADA_GJNL', `Écriture comptable passée: Débit ${newPiece.debitCompte} / Crédit ${newPiece.creditCompte} [${newPiece.montant.toLocaleString()} FCFA]`);
  };

  const handleAddBudget = (newBud: Budget) => {
    setBudgets(prev => [...prev, newBud]);
    logAudit('BUD_NEW', `Saisie enveloppe prévisionnelle pour département : ${newBud.departement}`);
  };

  const handleUpdateBudgetEngaged = (budgetId: string, amount: number) => {
    setBudgets(prev => prev.map(b => b.id === budgetId ? { ...b, montantEngage: b.montantEngage + amount } : b));
  };

  // HR & Administration
  const handleAddEmploye = (newEmp: Employe) => {
    setEmployes(prev => [...prev, newEmp]);
    logAudit('HR_RECRUT', `Recrutement du collaborateur : ${newEmp.prenom} ${newEmp.nom} comme ${newEmp.poste}`);
  };

  const handleAddPresence = (newPres: PresencePointage) => {
    setPresences(prev => [...prev, newPres]);
  };

  const handleAddBulletin = (newBP: BulletinPaie) => {
    setBulletins(prev => [...prev, newBP]);

    // Register salary payout as accounting debit in analytical ledger
    const targetEmp = employes.find(e => e.id === newBP.idEmploye);
    if (targetEmp) {
      const newPC: PieceComptable = {
        id: 'pc-' + Math.floor(Math.random() * 10000),
        date: new Date().toISOString().split('T')[0],
        codeJournal: 'OD',
        refePiece: `SAL-06-26`,
        libelle: `Règlement salaire net de ${targetEmp.prenom} ${targetEmp.nom}`,
        debitCompte: '6611 (Charges de Personnel)',
        creditCompte: '5211 (Banques)',
        montant: newBP.netAPayer,
        valide: true,
        centreCoutAnalytique: `Frais RH ${targetEmp.department}`
      };
      setPiecesComptables(prev => [...prev, newPC]);
    }

    logAudit('PAIE_VAL', `Mise en paiement du bulletin de ${getEmployeeFullInfo(newBP.idEmploye)} (Net payé: ${newBP.netAPayer.toLocaleString()} FCFA)`);
  };

  // GED Archivage
  const handleAddDocumentObj = (newDoc: FichierDocument) => {
    setDocuments(prev => [...prev, newDoc]);
    logAudit('GED_UPLOAD', `Archivage immuable du fichier : ${newDoc.nom} (Indexed: ${newDoc.indexationTags.join(', ')})`);
  };

  const getEmployeeFullInfo = (empId: string) => {
    const e = employes.find(x => x.id === empId);
    return e ? `${e.prenom} ${e.nom}` : 'Inconnu';
  };

  const unreadNotifications = notifications.filter(n => n.statut === 'Non lue').length;
  const simulatedRole = systemSettings.roles.find(r => r.id === systemSettings.activeRoleId) || systemSettings.roles[0];

  // switchActiveTenant - isolates databases per tenant ID
  const switchActiveTenant = (newTenant: SaaSClient) => {
    // 1. Save current active tenant's states to the databases dictionary
    setDatabases(prev => ({
      ...prev,
      [activeTenant.id]: {
        exploitations,
        sitesAgricoles,
        champs,
        parcelles,
        utilisateurs,
        campagnes,
        cultures,
        interventions,
        recoltes,
        incidents,
        sitesElevage,
        batiments,
        troupeaux,
        animaux,
        reproGestations,
        carnetsSanitaires,
        feedLogs,
        prodElevages,
        magasins,
        articles,
        mouvementsStock,
        equipements,
        maintenances,
        fuelLogs,
        fournisseurs,
        demandesAchat,
        bonsCommande,
        clientsAcheteurs,
        devis,
        commandesClients,
        factures,
        encaissements,
        piecesComptables,
        budgets,
        employes,
        presences,
        bulletins,
        documents,
        regles,
        notifications,
        auditLogs,
        systemSettings
      }
    }));

    // 2. Load next tenant database partition or create a clean empty one
    const nextDb = databases[newTenant.id] || getInitialDatabase(newTenant.id);

    // 3. Load other states
    setExploitations(nextDb.exploitations);
    setSitesAgricoles(nextDb.sitesAgricoles);
    setChamps(nextDb.champs || []);
    setParcelles(nextDb.parcelles);
    setUtilisateurs(nextDb.utilisateurs || []);
    setCampagnes(nextDb.campagnes);
    setCultures(nextDb.cultures);
    setInterventions(nextDb.interventions);
    setRecoltes(nextDb.recoltes);
    setIncidents(nextDb.incidents);
    setSitesElevage(nextDb.sitesElevage);
    setBatiments(nextDb.batiments);
    setTroupeaux(nextDb.troupeaux);
    setAnimaux(nextDb.animaux);
    setReproGestations(nextDb.reproGestations);
    setCarnetsSanitaires(nextDb.carnetsSanitaires);
    setFeedLogs(nextDb.feedLogs);
    setProdElevages(nextDb.prodElevages);
    setMagasins(nextDb.magasins);
    setArticles(nextDb.articles);
    setMouvementsStock(nextDb.mouvementsStock);
    setEquipements(nextDb.equipements);
    setMaintenances(nextDb.maintenances);
    setFuelLogs(nextDb.fuelLogs);
    setFournisseurs(nextDb.fournisseurs);
    setDemandesAchat(nextDb.demandesAchat);
    setBonsCommande(nextDb.bonsCommande);
    setClientsAcheteurs(nextDb.clientsAcheteurs);
    setDevis(nextDb.devis);
    setCommandesClients(nextDb.commandesClients);
    setFactures(nextDb.factures);
    setEncaissements(nextDb.encaissements);
    setPiecesComptables(nextDb.piecesComptables);
    setBudgets(nextDb.budgets);
    setEmployes(nextDb.employes);
    setPresences(nextDb.presences);
    setBulletins(nextDb.bulletins);
    setDocuments(nextDb.documents);
    setRegles(nextDb.regles);
    setNotifications(nextDb.notifications);
    setAuditLogs(nextDb.auditLogs);
    setSystemSettings(nextDb.systemSettings);

    setCompteursUtilisation(nextDb.compteursUtilisation || []);
    setUtilisationsEquipement(nextDb.utilisationsEquipement || []);
    setPlansMaintenance(nextDb.plansMaintenance || []);
    setPannesEquipement(nextDb.pannesEquipement || []);
    setAssurancesEquipement(nextDb.assurancesEquipement || []);
    setIndicateursKPI(nextDb.indicateursKPI || []);
    setTableauxDeBord(nextDb.tableauxDeBord || []);
    setRapportsProgrammes(nextDb.rapportsProgrammes || []);
    setAlertesBI(nextDb.alertesBI || []);
    setRequetesPerso(nextDb.requetesPerso || []);

    // 4. Update the activeTenant state
    setActiveTenant(newTenant);
  };

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setSuspendedClientMessage(null);

    const emailClean = loginEmail.trim().toLowerCase();
    const passClean = loginPassword.trim();

    // 1. Check for SaaS Editor/Supplier credentials
    if (emailClean === 'provider@mefoup.com' && passClean === 'mefoup2026') {
      setIsLoggedIn(true);
      setAuthRole('provider');
      setAppMode('saas-admin');
      setCurrentUser({
        id: 'usr-provider',
        nom: 'Éditeur Mefoup',
        email: 'provider@mefoup.com',
        password: 'mefoup2026',
        roleId: 'role-superadmin',
        statut: 'Actif'
      });
      return;
    }

    // 2. Check for specific tenant-level registered system users (Utilisateurs) across all database partitions
    let foundUser: Utilisateur | null = null;
    let foundTenant: SaaSClient | null = null;

    for (const client of saasClients) {
      const db = databases[client.id] || getInitialDatabase(client.id);
      const userList = db.utilisateurs || [];
      const userMatch = userList.find(
        u => u.email.toLowerCase() === emailClean && u.password === passClean && u.statut === 'Actif'
      );
      if (userMatch) {
        foundUser = userMatch;
        foundTenant = client;
        break;
      }
    }

    if (foundUser && foundTenant) {
      if (foundTenant.statut === 'Suspendu' || foundTenant.statut === 'Résilié') {
        setSuspendedClientMessage(`🚫 Accès Suspendu — L’abonnement de l’instance "${foundTenant.raisonSociale}" est inactif. Veuillez régulariser votre formule auprès de l’éditeur.`);
        return;
      }
      setIsLoggedIn(true);
      setAuthRole('superadmin');
      switchActiveTenant(foundTenant);
      
      // Force initial role mapping based on logged-in user profile!
      setSystemSettings(prev => ({
        ...prev,
        activeRoleId: foundUser!.roleId
      }));
      setAppMode('client-erp');
      setCurrentUser(foundUser);
      return;
    }

    // 3. Fallback check for active or virtual SaaS client super-administrators directly
    const matchedClient = saasClients.find(
      c => c.superAdminLogin?.toLowerCase() === emailClean && c.superAdminPassword === passClean
    );

    if (matchedClient) {
      if (matchedClient.statut === 'Suspendu' || matchedClient.statut === 'Résilié') {
        setSuspendedClientMessage(`🚫 Accès Suspendu — L’abonnement de l’instance "${matchedClient.raisonSociale}" est inactif. Veuillez régulariser votre formule auprès de l’éditeur.`);
        return;
      }
      setIsLoggedIn(true);
      setAuthRole('superadmin');
      switchActiveTenant(matchedClient);
      setAppMode('client-erp');
      
      const adminVirtuel: Utilisateur = {
        id: 'usr-admin-virtuel',
        nom: `${matchedClient.responsablePrenom} ${matchedClient.responsableNom}`,
        email: matchedClient.superAdminLogin || '',
        password: matchedClient.superAdminPassword || '',
        roleId: 'role-superadmin',
        statut: 'Actif'
      };
      setCurrentUser(adminVirtuel);
      return;
    }

    setAuthError("Email ou mot de passe incorrect. Pour tester le logiciel, cliquez sur le bouton 'Version démonstration' à gauche.");
  };

  // Enters the evaluation/simulation trial mode with prefabricated structures
  const enterDemoMode = () => {
    setIsLoggedIn(true);
    setAuthRole('demo');
    // Prefabricate a dedicated Demo account
    const demoClient: SaaSClient = {
      id: 'client-demo',
      idLicence: 'LIC-2026-DEMO-EXEMPLE',
      raisonSociale: 'FERME PILOTE DE DÉMONSTRATION',
      sigle: 'EVAL-DEMO',
      numContribuable: 'DEMO-CONTRIB-01',
      regCommerce: 'RC/YAU/DEMO',
      secteur: 'Multi-activités (Maraîcher, Porcherie & Élevage avicole)',
      responsableNom: 'Visiteur',
      responsablePrenom: 'Évaluation',
      responsableEmail: 'demo@mefoup-flow.cm',
      responsableTel: '+237 000 000 000',
      pays: 'Cameroun',
      region: 'Centre',
      ville: 'Obala',
      statut: 'Démonstration',
      plan: 'Starter',
      dateCreation: new Date().toISOString().split('T')[0],
      dateExpiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      surfaceExploitee: 25,
      maxUtilisateurs: 5
    };
    switchActiveTenant(demoClient);
    setAppMode('client-erp');
    setCurrentUser({
      id: 'usr-1', // maps to first demo user 'Michel Tchanga'
      nom: 'Michel Tchanga',
      email: 'admin@mefoup.com',
      password: 'mefoup2026',
      roleId: 'role-superadmin',
      statut: 'Actif'
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthRole(null);
    setCurrentUser(null);
    setLoginPassword('');
    setAuthError('');
    setSuspendedClientMessage(null);
    setSystemSettings(prev => ({
      ...prev,
      activeRoleId: 'role-superadmin'
    }));
  };

  // If not logged in, render the gorgeous interactive Landing/Auth portal
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-between font-sans">
        {/* Header decoration */}
        <header className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-emerald-400 block font-black">Plateforme SaaS Agricole</span>
              <h1 className="text-lg font-black text-white tracking-wider">MEFOUP-FLOW</h1>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-500">v2.1 • SYSCOHADA RÉVISÉ</span>
        </header>

        {/* Portal Cards Content */}
        <main className="max-w-5xl mx-auto p-6 md:p-12 w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* LEFT COLUMN: VISITEUR & DEMONSTRATION ACCUEIL */}
          <div className="bg-slate-800/55 rounded-2xl border border-slate-700/80 p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-md font-bold uppercase tracking-wide">
                VISITEUR / FUTURE CLIENT
              </span>
              <h2 className="text-2xl font-black text-white leading-tight">
                Découvrez comment se comporte l'ERP MEFOUP-FLOW
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Accédez instantanément à la version de démonstration pré-configurée. Visualisez l'état des cultures locales, la gestion des stocks d'intrants (fertilisants, vaccins), le suivi du troupeau bovin et la comptabilité analytique aux normes SYSCOHADA.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Données d'exemples de fermes pré-chargées.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Explorez librement tous les modules de finance & RH.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Zéro configuration ou carte bancaire requise.</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-slate-750">
              <button
                onClick={enterDemoMode}
                className="w-full bg-emerald-600 text-white font-extrabold text-xs py-3.5 px-6 rounded-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-sm animate-pulse-subtle"
              >
                Lancer la Version de Démonstration (Gratuit)
                <ArrowRight className="h-4 w-4 text-white" />
              </button>
              <span className="text-[10px] text-slate-500 block text-center mt-2">
                Idéal avant souscription de contrat
              </span>
            </div>

            {/* Direct list of registered SaaS client directories for quick audit and validation */}
            <div className="mt-4 pt-4 border-t border-slate-700/60 text-xs space-y-2">
              <span className="font-extrabold text-slate-300 block text-[10.5px] uppercase tracking-wider">🏢 Comptes Clients SaaS Actifs ({saasClients.length}) :</span>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {saasClients.map(c => (
                  <div key={c.id} className="p-2.5 bg-slate-905 bg-slate-900/60 border border-slate-700/50 rounded-lg flex items-center justify-between gap-1.5 hover:border-indigo-500/50 transition">
                    <div className="truncate flex-1">
                      <span className="font-bold text-slate-100 block text-[11px] truncate">{c.raisonSociale}</span>
                      <span className="text-[10px] text-slate-400 block truncate font-mono">Em: {c.superAdminLogin}</span>
                      <span className="text-[9.5px] text-slate-500 block font-mono">Mdp: {c.superAdminPassword}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginEmail(c.superAdminLogin || '');
                        setLoginPassword(c.superAdminPassword || '');
                        setIsLoggedIn(true);
                        setAuthRole('superadmin');
                        switchActiveTenant(c);
                        setAppMode('client-erp');
                      }}
                      className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] rounded-md transition shrink-0 uppercase tracking-tight"
                    >
                      1-Clic
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PRIVÉ & CONNECT AUTH */}
          <div className="bg-white rounded-2xl p-6 md:p-8 flex flex-col justify-between border shadow-xl">
            <div>
              <span className="text-[9px] bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md font-bold uppercase tracking-wide">
                ESPACE SÉCURISÉ CLIENT & ÉDITEUR
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-3 leading-tight">
                Connexion Super-Administrateur / Éditeur
              </h2>
              <p className="text-xs text-slate-500 mt-1.5">
                Saissisez vos identifiants fournis pour accéder à votre environnement ou à la console d’administration.
              </p>

              {/* Status and Error handling */}
              {authError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg text-xs mt-4 leading-relaxed font-medium">
                  {authError}
                </div>
              )}

              {suspendedClientMessage && (
                <div className="bg-rose-900/10 border-2 border-rose-600/40 text-rose-950 p-4 rounded-xl text-xs mt-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-rose-800">
                    <ShieldAlert className="h-4 w-4 text-rose-700" />
                    <span>SOUSCRIPTION NON ACTIVE</span>
                  </div>
                  <p>{suspendedClientMessage}</p>
                </div>
              )}

              {/* Credentials hints specifically for review */}
              <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1 text-[10.5px] text-slate-600">
                <span className="font-bold text-indigo-900 block">💡 Comptes de tests configurés :</span>
                <div>
                  • Client Payé: <code className="font-mono bg-white px-1 py-0.2 rounded border">admin@kissineagro.cm</code> (Mot de passe: <code className="font-mono bg-white px-1 py-0.2 rounded border">superadmin123</code>)
                </div>
                <div>
                  • Éditeur / Fournisseur: <code className="font-mono bg-white px-1 py-0.2 rounded border">provider@mefoup.com</code> (Mot de passe: <code className="font-mono bg-white px-1 py-0.2 rounded border">mefoup2026</code>)
                </div>
                <div className="flex justify-between items-center pt-1.5 border-t border-indigo-100 mt-1.5">
                  <span className="text-[9.5px] text-slate-400">Besoin d'un nouveau départ ?</span>
                  <button 
                    type="button" 
                    onClick={() => {
                      if (window.confirm("Réinitialiser l'application aux paramètres d'usine ? Toutes les modifications locales seront effacées.")) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }} 
                    className="text-[9.5px] text-rose-600 hover:underline font-extrabold transition cursor-pointer"
                  >
                    Réinitialiser l'application
                  </button>
                </div>
              </div>

              {/* Form elements */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5 mt-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse Email / Login *</label>
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="nom@entreprise.com ou admin@coop.cm"
                    className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mot de Passe Securisé *</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Saisir le mot de passe SuperAdministrateur"
                    className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-extrabold text-xs py-3.5 rounded-xl hover:bg-slate-900 transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Lock className="h-4 w-4" /> Accéder à mon Espace Privé
                </button>
              </form>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-6 text-center">
              <span className="text-[10px] text-slate-400">
                MEFOUP-FLOW utilise un système de chiffrement multicouche de bout en bout conforme OHADA et RGPD.
              </span>
            </div>
          </div>
        </main>

        {/* Footer info brand */}
        <footer className="p-4 border-t border-slate-800 text-center font-mono text-[10px] text-zinc-500">
          © 2026 MEFOUP-FLOW SaaS Agricole • Conçu pour l'Afrique Agro-Industrielle d'aujourd'hui.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* PUBLIC DEMO ATTESTATION OR SPECIAL ADVISORY BANNERS */}
      {authRole === 'demo' && (
        <div className="bg-amber-600 text-white text-center py-2 px-6 text-xs font-bold font-sans flex items-center justify-center gap-2 shrink-0 animate-pulse">
          <Award className="h-4 w-4 animate-bounce" />
          <span>
            🔴 MODE DÉMONSTRATION ÉVALUATION : Vous testez l'ERP Agricole avec une simulation de base modèle. Pour enregistrer vos plans de cultures réels, souscrivez au plan Super-Administrateur.
          </span>
        </div>
      )}

      {/* GLOBAL SAAS TOP NAVIGATION BAR */}
      <header className="bg-slate-900 text-white px-6 py-3 shrink-0 flex items-center justify-between border-b border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-emerald-650 to-indigo-750 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-400 font-extrabold block">
              {authRole === 'provider' ? 'Portail Éditeur SaaS' : 'SaaS Customer Portal'}
            </span>
            <h1 className="text-base font-black tracking-widest">MEFOUP-FLOW</h1>
          </div>
        </div>

        {/* Global Multi-Tenant switcher */}
        <div className="flex items-center gap-2">
          {appMode === 'client-erp' ? (
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-xs">
              <span className="text-slate-400">Entreprise / Instance active : </span>
              <span className="font-extrabold text-emerald-450">{activeTenant.raisonSociale}</span>
              <span className="text-[10px] bg-indigo-700 text-white font-bold px-1.5 py-0.5 rounded ml-1.5 uppercase tracking-wide">
                {activeTenant.plan} Plan
              </span>
            </div>
          ) : (
            <div className="bg-rose-900/30 border border-rose-500/30 text-rose-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <Laptop className="h-4 w-4" /> Tour de Contrôle Backoffice SaaS
            </div>
          )}

          {/* Switch app mode button - STRICTLY EXCLUSIVE TO PROVIDER ROLE FOR ISOLATION */}
          {authRole === 'provider' && (
            <button
              onClick={() => {
                const targetMode = appMode === 'client-erp' ? 'saas-admin' : 'client-erp';
                setAppMode(targetMode);
                if (targetMode === 'saas-admin') {
                  logAudit('SAAS_SWITCH', 'Administrateur technique retourné au Backoffice SaaS Éditeur', 'SaaS Support', 'Éditeur');
                }
              }}
              className={`cursor-pointer text-xs font-black px-4 py-2 rounded-lg border transition ${
                appMode === 'client-erp'
                  ? 'bg-indigo-600 border-indigo-700 hover:bg-indigo-700 text-white'
                  : 'bg-emerald-600 border-emerald-700 hover:bg-emerald-700 text-white'
              }`}
            >
              {appMode === 'client-erp' ? '⚙️ Entrer Backoffice SaaS' : '⚡ Entrer Console Client ERP'}
            </button>
          )}

          {/* LOGOUT SECURE ACTION */}
          <button
            onClick={handleLogout}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 py-2 px-3.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Quitter
          </button>

          {/* Notification icon */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationCenter(!showNotificationCenter)}
              className="bg-slate-800 hover:bg-slate-700 p-2 rounded-full text-slate-300 hover:text-white transition relative"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Simulated Notification center tray */}
            {showNotificationCenter && (
              <div className="absolute right-0 mt-2 z-50 bg-white border rounded-2xl shadow-2xl w-80 text-xs text-slate-700 overflow-hidden">
                <div className="bg-slate-900 text-white p-3 font-semibold flex justify-between items-center">
                  <span>Centre des alertes prioritaires</span>
                  <button onClick={() => setNotifications([])} className="text-[10px] text-slate-300 underline font-normal">marquer tout lu</button>
                </div>
                <div className="divide-y max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="p-3 bg-red-50/40 hover:bg-slate-50 transition space-y-1.5">
                      <div className="flex justify-between font-bold items-center text-[10px]">
                        <span className="text-red-700">{n.priorite}</span>
                        <span className="text-slate-400">{n.date}</span>
                      </div>
                      <h4 className="font-bold text-slate-900">{n.titre}</h4>
                      <p className="text-[11px] text-slate-500 italic">"{n.description}"</p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="p-6 text-center text-slate-400 italic">Aucune alerte en attente de traitement.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* THREE PANELS COLLABORATION LAYOUT */}
      <div className="grow flex overflow-hidden">
        {/* SIDE BAR BUTTONS FOR ERP - Renders only in Client ERP Workspace mode */}
        {appMode === 'client-erp' && (
          <aside className="w-56 bg-slate-800 text-slate-300 shrink-0 flex flex-col justify-between border-r border-slate-700 p-3 space-y-2">
            <div className="space-y-1">
              {simulatedRole.modules.includes('dashboard') && (
                <>
                  <span className="block text-[10px] text-slate-500 font-extrabold px-3 py-1 uppercase tracking-wider">
                    Cockpit Général
                  </span>
                  <button
                    onClick={() => setErpTab('dashboard')}
                    className={`w-full text-left p-2 rounded-lg transition text-xs font-bold flex items-center gap-2.5 ${
                      erpTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Award className="h-4 w-4" /> Cockpit Éxecutif / Météo
                  </button>
                </>
              )}

              {simulatedRole.modules.includes('bi-reporting') && (
                <button
                  onClick={() => setErpTab('bi-reporting')}
                  className={`w-full text-left p-2 rounded-lg transition text-xs font-bold flex items-center gap-2.5 ${
                    erpTab === 'bi-reporting' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <LineChart className="h-4 w-4" /> BI & Rapports
                </button>
              )}

              {(simulatedRole.modules.includes('agriculture') || simulatedRole.modules.includes('elevage') || simulatedRole.modules.includes('stocks') || simulatedRole.modules.includes('parc-materiel')) && (
                <span className="block text-[10px] text-slate-500 font-extrabold px-3 py-1 uppercase tracking-wider pt-2">
                  Opérations Foncier
                </span>
              )}

              {simulatedRole.modules.includes('agriculture') && (
                <button
                  onClick={() => setErpTab('agriculture')}
                  className={`w-full text-left p-2 rounded-lg transition text-xs font-bold flex items-center gap-2.5 ${
                    erpTab === 'agriculture' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Sprout className="h-4 w-4" /> {systemSettings.customLabels.prodVegetale || 'Production Végétale'}
                </button>
              )}

              {simulatedRole.modules.includes('elevage') && (
                <button
                  onClick={() => setErpTab('elevage')}
                  className={`w-full text-left p-2 rounded-lg transition text-xs font-bold flex items-center gap-2.5 ${
                    erpTab === 'elevage' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Egg className="h-4 w-4" /> {systemSettings.customLabels.prodAnimale || 'Production Animale'}
                </button>
              )}

              {simulatedRole.modules.includes('stocks') && (
                <button
                  onClick={() => setErpTab('stocks')}
                  className={`w-full text-left p-2 rounded-lg transition text-xs font-bold flex items-center gap-2.5 ${
                    erpTab === 'stocks' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Package className="h-4 w-4" /> Stocks & Magasins
                </button>
              )}

              {simulatedRole.modules.includes('parc-materiel') && (
                <button
                  onClick={() => setErpTab('parc-materiel')}
                  className={`w-full text-left p-2 rounded-lg transition text-xs font-bold flex items-center gap-2.5 ${
                    erpTab === 'parc-materiel' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Wrench className="h-4 w-4" /> Parc & Maintenance
                </button>
              )}

              {(simulatedRole.modules.includes('commercial') || simulatedRole.modules.includes('compta')) && (
                <span className="block text-[10px] text-slate-500 font-extrabold px-3 py-1 uppercase tracking-wider pt-2">
                  Finance & Comptabilité
                </span>
              )}

              {simulatedRole.modules.includes('commercial') && (
                <button
                  onClick={() => setErpTab('commercial')}
                  className={`w-full text-left p-2 rounded-lg transition text-xs font-bold flex items-center gap-2.5 ${
                    erpTab === 'commercial' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" /> Facturations & Ventes
                </button>
              )}

              {simulatedRole.modules.includes('compta') && (
                <button
                  onClick={() => setErpTab('compta')}
                  className={`w-full text-left p-2 rounded-lg transition text-xs font-bold flex items-center gap-2.5 ${
                    erpTab === 'compta' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Book className="h-4 w-4" /> Compta SYSCOHADA
                </button>
              )}

              {(simulatedRole.modules.includes('rh') || simulatedRole.modules.includes('ged') || simulatedRole.modules.includes('settings')) && (
                <span className="block text-[10px] text-slate-500 font-extrabold px-3 py-1 uppercase tracking-wider pt-2">
                  Administration & Sécurité
                </span>
              )}

              {simulatedRole.modules.includes('rh') && (
                <button
                  onClick={() => setErpTab('rh')}
                  className={`w-full text-left p-2 rounded-lg transition text-xs font-bold flex items-center gap-2.5 ${
                    erpTab === 'rh' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Users className="h-4 w-4" /> Ressources Humaines
                </button>
              )}

              {simulatedRole.modules.includes('ged') && (
                <button
                  onClick={() => setErpTab('ged')}
                  className={`w-full text-left p-2 rounded-lg transition text-xs font-bold flex items-center gap-2.5 ${
                    erpTab === 'ged' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <FolderOpen className="h-4 w-4" /> Archivage GED
                </button>
              )}

              {simulatedRole.modules.includes('settings') && (
                <button
                  onClick={() => setErpTab('settings')}
                  className={`w-full text-left p-2 transition text-xs font-bold flex items-center gap-2.5 rounded-lg ${
                    erpTab === 'settings' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-700 hover:text-white text-zinc-300'
                  }`}
                >
                  <Settings className="h-4 w-4 shrink-0 text-slate-400" /> Paramètres Système
                </button>
              )}
            </div>

            {/* Quick stats in sidebar */}
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 text-[10.5px] space-y-1.5 text-slate-400">
              <div className="flex justify-between">
                <span>Région d'Obala :</span>
                <span className="font-bold text-slate-200">Centre CM</span>
              </div>
              <div className="flex justify-between">
                <span>Devise comptable :</span>
                <span className="font-bold text-slate-200">XAF (FCFA)</span>
              </div>
              <div className="flex justify-between">
                <span>Dernière révision:</span>
                <span className="font-bold text-slate-200">18-Juin-2026</span>
              </div>
            </div>
          </aside>
        )}

        {/* CONTAINER WORKPLACE SCREEN */}
        <main className="grow overflow-y-auto bg-slate-50">
          {appMode === 'saas-admin' ? (
            <SaaSAdmin
              clients={saasClients}
              logs={saasLogs}
              onAddClient={handleProvisionTenant}
              onUpdateClientStatus={handleUpdateTenantStatus}
              allData={{
                exploitations,
                parcelles,
                animaux,
                employes,
                factures,
                pieces: piecesComptables,
                articles
              }}
              onRestoreBackup={handleRestoreBackup}
              onSelectClient={switchActiveTenant}
            />
          ) : (
            <>
              {erpTab === 'dashboard' && (
                <Dashboard
                  exploitations={exploitations}
                  parcelles={parcelles}
                  cultures={cultures}
                  troupeaux={troupeaux}
                  animaux={animaux}
                  articles={articles}
                  piecesComptables={piecesComptables}
                  auditLogs={auditLogs}
                  meteo={currentWeather}
                  mouvementsStock={mouvementsStock}
                />
              )}

              {erpTab === 'agriculture' && (
                <AgricultureModule
                  exploitations={exploitations}
                  sites={sitesAgricoles}
                  champs={champs}
                  parcelles={parcelles}
                  campagnes={campagnes}
                  cultures={cultures}
                  interventions={interventions}
                  recoltes={recoltes}
                  incidents={incidents}
                  sitesElevage={sitesElevage}
                  batiments={batiments}
                  onAddExploitation={(newExp) => setExploitations(prev => [...prev, newExp])}
                  onAddParcelle={handleAddParcelle}
                  onAddCulture={handleAddCulture}
                  onUpdateCulture={handleUpdateCulture}
                  onAddIncident={handleAddIncident}
                  onAddIntervention={handleAddIntervention}
                  onAddRecolte={handleAddRecolte}
                  onAddChamp={handleAddChamp}
                  onUpdateChamp={handleUpdateChamp}
                  onDeleteChamp={handleDeleteChamp}
                  onUpdateParcelle={handleUpdateParcelle}
                  typesCulture={typesCulture}
                  typesOperation={typesOperation}
                  responsablesTerrain={responsablesTerrain}
                  substances={substances}
                  customLabels={systemSettings.customLabels}
                />
              )}

              {erpTab === 'elevage' && (
                <ElevageModule
                  sitesElevage={sitesElevage}
                  batiments={batiments}
                  troupeaux={troupeaux}
                  animaux={animaux}
                  reproductions={reproGestations}
                  contactsSanitaires={carnetsSanitaires}
                  feedLogs={feedLogs}
                  productionElevages={prodElevages}
                  onAddAnimal={handleAddAnimaux}
                  onAddReproduction={(newRep) => setReproGestations(prev => [...prev, newRep])}
                  onAddSanitaire={handleAddSanitaire}
                  onAddFeedLog={handleAddFeed}
                  onAddProduction={handleAddProductionElevage}
                />
              )}

              {erpTab === 'stocks' && (
                <StocksModule
                  magasins={magasins}
                  articles={articles}
                  mouvements={mouvementsStock}
                  equipements={equipements}
                  maintenances={maintenances}
                  fuelLogs={fuelLogs}
                  recoltes={recoltes}
                  cultures={cultures}
                  prodElevages={prodElevages}
                  onAddMouvement={handleAddMouvementStock}
                  onAddMaintenance={handleAddMaintenance}
                  onAddFuelLog={handleAddFuelLog}
                  customLabels={systemSettings.customLabels}
                />
              )}

              {erpTab === 'commercial' && (
                <CommercialModule
                  fournisseurs={fournisseurs}
                  demandesAchat={demandesAchat}
                  bonsCommande={bonsCommande}
                  clientsAcheteurs={clientsAcheteurs}
                  devis={devis}
                  commandesClients={commandesClients}
                  factures={factures}
                  encaissements={encaissements}
                  onAddDemandeAchat={handleAddDemandeAchat}
                  onAddBonCommande={handleAddBonCommande}
                  onAddClientAcheteur={handleAddClientAcheteur}
                  onAddDevis={handleAddDevis}
                  onAddCommandeClient={handleAddCommandeClient}
                  onAddFacture={handleAddFacture}
                  onAddEncaissement={handleAddEncaissementClient}
                  onConvertDevisToCommande={handleConvertDevisToCommande}
                  customLabels={systemSettings.customLabels}
                />
              )}

              {erpTab === 'compta' && (
                <AccountingModule
                  pieces={piecesComptables}
                  budgets={budgets}
                  equipements={equipements}
                  onAddPiece={handleAddPieceComptable}
                  onAddBudget={handleAddBudget}
                  onUpdateBudgetEngaged={handleUpdateBudgetEngaged}
                />
              )}

              {erpTab === 'rh' && (
                <HRModule
                  employes={employes}
                  presences={presences}
                  bulletins={bulletins}
                  onAddEmploye={handleAddEmploye}
                  onAddPresence={handleAddPresence}
                  onAddBulletin={handleAddBulletin}
                  customLabels={systemSettings.customLabels}
                />
              )}

              {erpTab === 'ged' && (
                <GEDModule
                  documents={documents}
                  onAddDocument={handleAddDocumentObj}
                />
              )}

              {erpTab === 'settings' && (
                <SettingsModule
                  settings={systemSettings}
                  onUpdateSettings={setSystemSettings}
                  onLogAudit={logAudit}
                  currentUser={currentUser}
                  onUpdateCurrentUser={handleUpdateCurrentUser}
                  utilisateurs={utilisateurs}
                  onAddUtilisateur={handleAddUtilisateur}
                  onUpdateUtilisateur={handleUpdateUtilisateur}
                  onDeleteUtilisateur={handleDeleteUtilisateur}
                  auditLogs={auditLogs}
                  typesCulture={typesCulture}
                  onAddTypeCulture={handleAddTypeCulture}
                  campagnes={campagnes}
                  onAddCampagne={handleAddCampagneObj}
                  typesOperation={typesOperation}
                  onAddTypeOperation={handleAddTypeOperation}
                  responsablesTerrain={responsablesTerrain}
                  onAddResponsableTerrain={handleAddResponsableTerrain}
                  substances={substances}
                  onAddSubstance={handleAddSubstance}
                  employes={employes}
                  fournisseurs={fournisseurs}
                  paysList={paysList}
                  villesList={villesList}
                  onAddPays={handleAddPays}
                  onAddVille={handleAddVille}
                />
              )}

              {erpTab === 'parc-materiel' && (
                <EquipementModule
                  equipements={equipements}
                  setEquipements={setEquipements}
                  maintenances={maintenances}
                  setMaintenances={setMaintenances}
                  fuelLogs={fuelLogs}
                  setFuelLogs={setFuelLogs}
                  compteursUtilisation={compteursUtilisation}
                  setCompteursUtilisation={setCompteursUtilisation}
                  utilisationsEquipement={utilisationsEquipement}
                  setUtilisationsEquipement={setUtilisationsEquipement}
                  plansMaintenance={plansMaintenance}
                  setPlansMaintenance={setPlansMaintenance}
                  pannesEquipement={pannesEquipement}
                  setPannesEquipement={setPannesEquipement}
                  assurancesEquipement={assurancesEquipement}
                  setAssurancesEquipement={setAssurancesEquipement}
                  employes={employes}
                  interventions={interventions}
                  onAddMouvement={handleAddMouvementStock}
                  articles={articles}
                  fournisseurs={fournisseurs}
                />
              )}

              {erpTab === 'bi-reporting' && (
                <BIModule
                  exploitations={exploitations}
                  parcelles={parcelles}
                  cultures={cultures}
                  troupeaux={troupeaux}
                  animaux={animaux}
                  articles={articles}
                  piecesComptables={piecesComptables}
                  mouvementsStock={mouvementsStock}
                  factures={factures}
                  budgets={budgets}
                  employes={employes}
                  equipements={equipements}
                  maintenances={maintenances}
                  pannesEquipement={pannesEquipement}
                  indicateursKPI={indicateursKPI}
                  setIndicateursKPI={setIndicateursKPI}
                  tableauxDeBord={tableauxDeBord}
                  setTableauxDeBord={setTableauxDeBord}
                  rapportsProgrammes={rapportsProgrammes}
                  setRapportsProgrammes={setRapportsProgrammes}
                  alertesBI={alertesBI}
                  setAlertesBI={setAlertesBI}
                  requetesPerso={requetesPerso}
                  setRequetesPerso={setRequetesPerso}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* FOOTER BAR */}
      <footer className="bg-white border-t p-2 px-6 shrink-0 text-[10px] text-slate-400 font-mono flex flex-wrap justify-between items-center">
        <span>© 2026 MEFOUP-FLOW SaaS Agricole. Tous droits réservés.</span>
        <span className="flex items-center gap-1">
          <Terminal className="h-3.5 w-3.5" /> SECURE TRACEABILITY MODE • SYSTEM ACTIVE
        </span>
      </footer>
    </div>
  );
}
