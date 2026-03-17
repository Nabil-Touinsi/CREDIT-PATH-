# CreditPath AI

Application web de simulation de crédit enrichie par une analyse intelligente du profil financier et un assistant conversationnel contextualisé. Le projet combine un **frontend React/Vite**, un **backend FastAPI**, une **base SQLite** et un **chatbot branché sur Groq / LLaMA** pour fournir des décisions simulées, des explications pédagogiques et des recommandations personnalisées.

---

## Sommaire

- [Vue d’ensemble](#vue-densemble)
- [Objectifs du projet](#objectifs-du-projet)
- [Fonctionnalités principales](#fonctionnalités-principales)
- [Architecture technique](#architecture-technique)
- [Parcours utilisateur](#parcours-utilisateur)
- [Structure du dépôt](#structure-du-dépôt)
- [Stack technique](#stack-technique)
- [Installation et exécution locale](#installation-et-exécution-locale)
- [Variables d’environnement](#variables-denvironnement)
- [API backend](#api-backend)
- [Expérience utilisateur](#expérience-utilisateur)
- [Exports et reporting](#exports-et-reporting)
- [Pistes d’amélioration](#pistes-damélioration)
- [Auteur](#auteur)

---

## Vue d’ensemble

**CreditPath AI** a pour objectif de rendre une simulation de crédit plus **lisible, pédagogique et interactive**. L’utilisateur saisit son profil financier, lance une simulation, obtient une **décision IA simulée**, consulte des **indicateurs détaillés** dans un dashboard et peut ensuite dialoguer avec un **chatbot contextuel** qui explique le résultat obtenu.

Le projet répond à un double enjeu :

1. **Technique** : intégrer une logique de scoring crédit, une API moderne et une interface riche.
2. **UX / métier** : rendre une décision financière plus facile à comprendre pour un utilisateur non expert.

---

## Objectifs du projet

- Proposer une **simulation de crédit** rapide à partir d’un jeu de données utilisateur.
- Afficher une **décision simulée** accompagnée d’un **score de confiance**.
- Générer un **dashboard détaillé** avec indicateurs, comparaisons et projection de remboursement.
- Mémoriser les simulations dans un **historique utilisateur**.
- Offrir un **assistant conversationnel** connecté au contexte de la simulation en cours.
- Produire un rendu moderne, cohérent et exploitable dans un cadre de **PFE / démonstration académique**.

---

## Fonctionnalités principales

### 1) Authentification utilisateur
- Inscription
- Connexion
- Gestion de session côté frontend

### 2) Simulation de crédit
- Saisie du revenu mensuel
- Saisie des dettes en cours
- Saisie de l’épargne disponible
- Saisie de l’ancienneté professionnelle
- Saisie du montant demandé
- Saisie de la durée du prêt

### 3) Résultat de simulation
- Décision simulée : **ACCORDÉ** ou **REFUSÉ**
- Score de confiance IA
- Bloc de lecture rapide du résultat

### 4) Chatbot financier contextuel
- Réponses non génériques
- Utilisation du **résultat courant de simulation**
- Explication des points forts / points faibles du dossier
- Aide à l’amélioration du profil

### 5) Dashboard analytique
- Lecture rapide du dossier
- Cartes de synthèse
- Graphiques financiers
- Comparateur de taux
- Projection de remboursement
- Plan d’action recommandé

### 6) Historique utilisateur
- Consultation des simulations passées
- Suivi dans le temps

### 7) Export PDF
- Génération d’un document récapitulatif
- Export des informations principales de la simulation

---

## Architecture technique

Le projet suit une architecture en deux blocs :

### Frontend
Application **React + Vite** chargée de :
- l’authentification,
- la saisie des données utilisateur,
- l’affichage des résultats,
- le rendu des visualisations,
- l’interaction avec le chatbot.

### Backend
Application **FastAPI** chargée de :
- recevoir les données métier,
- exécuter la prédiction,
- structurer la réponse JSON,
- gérer les utilisateurs et l’historique,
- appeler l’API Groq pour le chatbot.

### Persistance
- **SQLite** pour stocker les données applicatives et l’historique
- **Modèle sérialisé** `credit_model.pkl` pour le scoring crédit

---

## Parcours utilisateur

1. L’utilisateur crée un compte ou se connecte.
2. Il renseigne les informations financières demandées.
3. Il lance la simulation.
4. L’application retourne une décision et un score.
5. Le chatbot peut expliquer ce résultat en langage naturel.
6. Le dashboard fournit une lecture détaillée du dossier.
7. L’utilisateur peut télécharger un PDF et consulter son historique.

---

## Structure du dépôt

```text
CREDIT-PATH-/
├── backend/
│   ├── app/
│   ├── data/
│   ├── ml_engine/
│   ├── credit.db
│   ├── credit_model.pkl
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── .gitignore
```

---

## Stack technique

### Frontend
- React
- Vite
- React Router DOM
- Recharts
- jsPDF
- jsPDF AutoTable
- Tailwind CSS

### Backend
- FastAPI
- Uvicorn
- SQLAlchemy
- Pydantic
- Passlib / Argon2
- Pandas
- Scikit-learn / Joblib
- Python Dotenv
- Groq API

### IA / Données
- Modèle de scoring crédit sérialisé (`credit_model.pkl`)
- Chatbot propulsé par **Groq / LLaMA**

---

## Installation et exécution locale

### 1. Cloner le dépôt
```bash
git clone https://github.com/Nabil-Touinsi/CREDIT-PATH-.git
cd CREDIT-PATH-
```

### 2. Lancer le backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### 3. Lancer le frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Accéder à l’application
- Frontend : `http://localhost:5173`
- Backend : `http://127.0.0.1:8000`
- Documentation API : `http://127.0.0.1:8000/docs`

---

## Variables d’environnement

Créer un fichier `backend/.env` avec une configuration de type :

```env
GROQ_API_KEY=your_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

> Ne jamais versionner les secrets. Le fichier `.env` doit rester local et être ignoré par Git.

---

## API backend

Routes principales utilisées dans le projet :

- `POST /register` → création d’un utilisateur
- `POST /login` → authentification
- `POST /predict` → simulation de crédit
- `GET /history/{user_id}` → historique des simulations
- `POST /chat` → interaction avec l’assistant conversationnel

---

## Expérience utilisateur

Le projet a été pensé pour une démonstration claire et professionnelle :

- interface sombre moderne,
- parcours guidé,
- explications intégrées dans les pages,
- dashboard plus pédagogique,
- branding unifié avec logo personnalisé,
- chatbot relié au résultat de la simulation.

Le positionnement du produit n’est pas uniquement technique : il vise aussi une **médiation intelligente de la décision financière**.

---

## Exports et reporting

Le dashboard permet de générer un **PDF récapitulatif** contenant :
- les données du profil,
- la décision simulée,
- le score de confiance,
- un extrait de l’échéancier.

Cela permet d’utiliser l’application aussi bien pour une démonstration académique que pour une présentation orale de projet.

---

## Pistes d’amélioration

- Déploiement cloud du frontend et du backend
- Authentification plus robuste avec JWT
- Version mobile responsive enrichie
- Simulation multi-profils / scénarios comparatifs
- Historique filtrable et exportable
- Interprétabilité plus avancée du modèle de scoring
- Tableau de bord administrateur
- Tests unitaires et tests d’intégration

---

## Auteur

**Nabil Touinsi**
**Mohamed Ouail BRIMESSE**
**Yanis SKALLI FETTACHI**
**Celia LAMARI**
**Zaid HASSAOUI**
**Kenza BELALOUI**

Projet académique / PFE orienté :
- développement web,
- intelligence artificielle,
- expérience utilisateur,
- pédagogie de la donnée.

---
**
