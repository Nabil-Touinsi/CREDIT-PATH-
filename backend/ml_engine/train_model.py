import pandas as pd
import numpy as np
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# 1. CHARGEMENT DU FICHIER CSV
# On cherche le fichier 'german.csv' (ou l'ancien nom si tu ne l'as pas renommé)
base_dir = os.path.dirname(__file__)
csv_path = os.path.join(base_dir, '../data/german.csv')

# Sécurité si le nom est différent
if not os.path.exists(csv_path):
    csv_path = os.path.join(base_dir, '../data/german_credit_data.csv')

if not os.path.exists(csv_path):
    print(f"❌ ERREUR : Fichier introuvable ici : {csv_path}")
    exit()

print(f"📥 Chargement des données depuis : {csv_path}...")
df = pd.read_csv(csv_path)

print("📋 Colonnes disponibles :", df.columns.tolist())

# 2. NETTOYAGE & ADAPTATION
data = pd.DataFrame()

print("🔄 Adaptation des colonnes...")

# A. Montant et Durée (Vraies données)
# On utilise .get pour éviter le crash si la majuscule change
data['montant_demande'] = df.get('Credit amount', df.get('Credit Amount', 5000))
data['duree_pret'] = df.get('Duration', 24)

# B. Épargne (Vraies données converties)
savings_map = {'little': 500, 'moderate': 2500, 'quite rich': 8000, 'rich': 20000}
# On prend la colonne 'Saving accounts' ou 'Savings' selon le fichier
col_savings = df.get('Saving accounts', df.get('Savings', []))
data['epargne'] = col_savings.map(savings_map).fillna(0)

# C. Ancienneté (Estimée via le Job)
col_job = df.get('Job', 1)
data['anciennete_emploi'] = col_job * 3 + 1 

# D. Revenu Mensuel (Déduit intelligemment)
# Plus le crédit est gros, plus le revenu est supposé gros
np.random.seed(42)
data['revenu_mensuel'] = (data['montant_demande'] / 10) + 1200 + np.random.normal(0, 300, len(df))
data['revenu_mensuel'] = data['revenu_mensuel'].astype(int)

# E. Dette Totale (Déduit intelligemment)
data['dette_totale'] = (data['montant_demande'] * 0.4).astype(int)

# F. LA CIBLE (RISK) - CORRECTION DU BUG
# Si la colonne 'Risk' n'existe pas, on la calcule logiquement
if 'Risk' in df.columns:
    print("✅ Colonne 'Risk' trouvée dans le fichier.")
    data['accord_credit'] = df['Risk'].apply(lambda x: 1 if x in ['good', 'Good'] else 0)
else:
    print("⚠️ Colonne 'Risk' absente. Génération du profil de risque basé sur les règles bancaires...")
    # Règle logique : Si tu as beaucoup d'épargne OU un petit crédit = ACCORDÉ (1), sinon Risqué (0)
    def calculate_risk(row):
        ratio = row['montant_demande'] / (row['revenu_mensuel'] * 12)
        if row['epargne'] > 5000: return 1 # Riche = Bon payeur
        if ratio > 0.40: return 0 # Trop de dettes = Mauvais payeur
        return 1 # Sinon OK
    
    data['accord_credit'] = data.apply(calculate_risk, axis=1)

# Nettoyage final
data = data.fillna(0)

# 3. ENTRAÎNEMENT
print("🧠 Entraînement de l'IA...")
X = data.drop('accord_credit', axis=1)
y = data['accord_credit']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

# 4. RÉSULTATS
acc = accuracy_score(y_test, model.predict(X_test))
print(f"✅ Modèle entraîné avec succès ! Précision : {acc*100:.2f}%")

# 5. SAUVEGARDE
output_path = os.path.join(base_dir, 'credit_model.pkl')
joblib.dump(model, output_path)
print(f"💾 Cerveau sauvegardé ici : {output_path}")