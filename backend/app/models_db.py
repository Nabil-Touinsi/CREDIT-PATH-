from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from .database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    nom = Column(String)
    prenom = Column(String)

class LoanPrediction(Base):
    __tablename__ = "loan_history"
    id = Column(Integer, primary_key=True, index=True)
    
    # --- LE LIEN AVEC L'UTILISATEUR ---
    user_id = Column(Integer, ForeignKey("users.id")) 
    # ----------------------------------

    revenu_mensuel = Column(Float)
    dette_totale = Column(Float)
    montant_demande = Column(Float)
    duree_pret = Column(Integer)
    decision = Column(String)
    score_confiance = Column(Float)
    date_simulation = Column(DateTime, default=datetime.datetime.utcnow)