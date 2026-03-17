from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from dotenv import load_dotenv
from groq import Groq
import joblib
import pandas as pd
import os

# Import BDD
from .database import SessionLocal, engine
from . import models_db

# Configuration Sécurité
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# Chargement des variables d'environnement
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

# --- MODÈLES ---
class UserCreate(BaseModel):
    email: str
    password: str
    nom: str
    prenom: str

class UserLogin(BaseModel):
    email: str
    password: str

class CreditRequest(BaseModel):
    user_id: int
    revenu_mensuel: float
    dette_totale: float
    anciennete_emploi: int
    epargne: float
    montant_demande: float
    duree_pret: int

class ChatRequest(BaseModel):
    message: str
    context: dict

models_db.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CreditPath AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

MODEL_PATH = os.path.join(BASE_DIR, "ml_engine", "credit_model.pkl")

try:
    model = joblib.load(MODEL_PATH)
except:
    model = None

# --- AUTHENTIFICATION ---
@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models_db.User).filter(models_db.User.email == user.email).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email déjà utilisé.")

    hashed_pw = pwd_context.hash(user.password)

    new_user = models_db.User(
        email=user.email,
        hashed_password=hashed_pw,
        nom=user.nom,
        prenom=user.prenom
    )

    db.add(new_user)
    db.commit()

    return {"message": "Compte créé."}


@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(models_db.User).filter(models_db.User.email == user.email).first()

    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Identifiants incorrects.")

    return {
        "message": "OK",
        "user_id": db_user.id,
        "nom": db_user.nom
    }

# --- LOGIQUE METIER ---
def generer_conseils(data, decision, score):

    conseils = []

    revenu = data.get("revenu_mensuel", 0)
    dette = data.get("dette_totale", 0)
    epargne = data.get("epargne", 0)
    montant = data.get("montant_demande", 0)

    if revenu > 0:
        ratio = dette / (revenu * 12)
    else:
        ratio = 0

    if ratio > 0.33:
        conseils.append(f"⚠️ **Surendettement :** Ratio de {round(ratio*100)}%.")

    if epargne < (montant * 0.1):
        conseils.append("📉 **Apport faible :** Visez 10%.")

    if decision == "ACCORDÉ":
        conseils.append("💎 **Dossier Solide :** Négociez le taux !")

    if decision == "REFUSÉ" and not conseils:
        conseils.append("🔍 **Profil Risqué :** Allongez la durée.")

    return conseils


def calculer_amortissement(montant, taux_annuel, duree_mois):

    if duree_mois == 0:
        return [], 0, 0

    taux_m = taux_annuel / 12 / 100

    try:
        mens = (montant * taux_m) / (1 - (1 + taux_m) ** -duree_mois)
    except:
        mens = 0

    tableau = []
    restant = montant
    total_interets = 0

    for mois in range(1, duree_mois + 1):

        interet = restant * taux_m
        principal = mens - interet

        restant -= principal
        total_interets += interet

        tableau.append({
            "mois": mois,
            "mensualite": round(mens, 2),
            "interet": round(interet, 2),
            "principal": round(principal, 2),
            "restant": round(max(0, restant), 2)
        })

    return tableau, round(mens, 2), round(total_interets, 2)


# --- IA CREDIT ---
@app.post("/predict")
def predict_credit(request: CreditRequest, db: Session = Depends(get_db)):

    if not model:
        return {"error": "Service indisponible"}

    data_dict = request.dict()
    user_id = data_dict.pop("user_id")

    input_data = pd.DataFrame([data_dict])

    if hasattr(model, "feature_names_in_"):
        input_data = input_data[model.feature_names_in_]

    prediction = model.predict(input_data)[0]
    prob = model.predict_proba(input_data)[0][1]

    decision = "ACCORDÉ" if prediction == 1 else "REFUSÉ"
    score = round(prob * 100, 2)

    taux = round(max(2.5, 6.0 - (score / 20)), 2)

    amortissement, mensualite, cout_total = calculer_amortissement(
        request.montant_demande,
        taux,
        request.duree_pret
    )

    _, _, cout_marche = calculer_amortissement(
        request.montant_demande,
        4.90,
        request.duree_pret
    )

    db_record = models_db.LoanPrediction(
        user_id=user_id,
        revenu_mensuel=request.revenu_mensuel,
        dette_totale=request.dette_totale,
        montant_demande=request.montant_demande,
        duree_pret=request.duree_pret,
        decision=decision,
        score_confiance=score
    )

    db.add(db_record)
    db.commit()

    return {
        "decision": decision,
        "score_confiance": score,
        "plan_action": generer_conseils(request.dict(), decision, score),
        "finance": {
            "taux_obtenu": taux,
            "taux_marche": 4.90,
            "mensualite": mensualite,
            "cout_total": cout_total,
            "economie": round(cout_marche - cout_total, 2),
            "tableau_amortissement": amortissement
        }
    }


# --- HISTORIQUE ---
@app.get("/history/{user_id}")
def get_history(user_id: int, db: Session = Depends(get_db)):

    return db.query(models_db.LoanPrediction)\
        .filter(models_db.LoanPrediction.user_id == user_id)\
        .order_by(models_db.LoanPrediction.id.desc())\
        .limit(10)\
        .all()


# --- CHATBOT IA ---
def generer_reponse_chat(message, context):

    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Clé API Groq manquante.")

    client = Groq(api_key=GROQ_API_KEY)

    decision = context.get("decision", "Inconnue")
    score = context.get("score_confiance", "Non disponible")

    revenu = context.get("revenu_mensuel", 0)
    dette = context.get("dette_totale", 0)
    epargne = context.get("epargne", 0)
    anciennete = context.get("anciennete_emploi", 0)
    montant = context.get("montant_demande", 0)
    duree = context.get("duree_pret", 0)

    taux_obtenu = context.get("taux_obtenu", "Non disponible")
    taux_marche = context.get("taux_marche", "Non disponible")
    mensualite = context.get("mensualite", "Non disponible")
    cout_total = context.get("cout_total", "Non disponible")
    economie = context.get("economie", "Non disponible")
    plan_action = context.get("plan_action", [])

    try:
        taux_endettement = round((float(dette) / float(revenu)) * 100, 2) if float(revenu) > 0 else 0
    except:
        taux_endettement = 0

    system_prompt = f"""
Tu es CreditPath AI, un assistant financier pédagogique, clair et professionnel.

Tu aides l'utilisateur à comprendre le résultat réel de sa simulation de crédit en cours.
Tu dois t'appuyer PRIORITAIREMENT sur les données ci-dessous et éviter les réponses génériques.

Contexte réel de la simulation :
- Décision : {decision}
- Score de confiance : {score}
- Revenu mensuel : {revenu} €
- Dette totale : {dette} €
- Épargne : {epargne} €
- Ancienneté d'emploi : {anciennete} ans
- Montant demandé : {montant} €
- Durée du prêt : {duree} mois
- Taux obtenu : {taux_obtenu}
- Taux du marché : {taux_marche}
- Mensualité estimée : {mensualite}
- Coût total estimé : {cout_total}
- Économie estimée : {economie}
- Taux d'endettement indicatif : {taux_endettement} %
- Plan d'action recommandé : {plan_action}

Règles :
- Réponds en français.
- Sois concret, pédagogique et structuré.
- Explique les causes probables de la décision quand c'est pertinent.
- Si le dossier est refusé, indique les points les plus pénalisants et les améliorations prioritaires.
- Si le dossier est accordé, explique les points forts du dossier et les conseils pour obtenir de meilleures conditions.
- Ne prétends pas à une décision bancaire officielle.
- Ne donne pas de conseil juridique ou réglementaire.
- Quand l'utilisateur pose une question sur "mon résultat", "mon dossier", "pourquoi refusé", "que faire", base-toi sur CE contexte précis.
- Évite les longues listes inutiles et les réponses vagues.
"""

    completion = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ],
        temperature=0.3,
        max_tokens=350
    )

    return completion.choices[0].message.content.strip()


@app.post("/chat")
def chat(request: ChatRequest):

    try:
        response = generer_reponse_chat(request.message, request.context)
        return {"response": response}

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur chatbot : {str(e)}")