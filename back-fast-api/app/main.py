from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import os
import numpy as np
from pydantic import BaseModel
import pandas as pd


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Obtenir le chemin du répertoire courant
current_directory = os.getcwd()

# Chemin complet vers ton modèle
model_path = os.path.join(current_directory, "decision_tree.pkl")

# Charger le modèle
model = joblib.load(model_path)

# Vérifier si le fichier existe
if os.path.exists(model_path):
    print(f"Le modèle est bien trouvé à : {model_path}")
else:
    print(f"Le modèle n'a pas été trouvé à : {model_path}")

@app.get("/")
async def read_root():
    return {"message": "Bienvenue sur FastAPI avec Docker !"}

@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

class WeatherFeatures(BaseModel):
    holiday: str
    temp: float
    rain_1h: float
    snow_1h: float
    clouds_all: int
    weather_main: str
    weather_description: str
    day: str
    month: int
    year: int
    hour: int


@app.post("/predict")
async def predict(features: WeatherFeatures):
    # Créer un DataFrame avec les colonnes attendues par le modèle
    input_data = pd.DataFrame([{
        "holiday": features.holiday,
        "temp": features.temp,
        "rain_1h": features.rain_1h,
        "snow_1h": features.snow_1h,
        "clouds_all": features.clouds_all,
        "weather_main": features.weather_main,
        "weather_description": features.weather_description,
        "day": features.day,
        "month": features.month,
        "year": features.year,
        "hour": features.hour
    }])

    # Effectuer la prédiction
    prediction = model.predict(input_data)

    return {"prediction": prediction.tolist()[0]}


