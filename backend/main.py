from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os
import pandas as pd

app = FastAPI(title="Heart Disease Prediction API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Since it's a local project, we'll allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "ml-model", "heart_model.pkl")

try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Input Data Schema
class PatientData(BaseModel):
    age: int
    sex: int
    cp: int
    trestbps: int
    chol: int
    fbs: int
    restecg: int
    thalachh: int
    exang: int
    oldpeak: float
    slope: int
    ca: int
    thal: int

@app.get("/")
def read_root():
    return {"message": "Welcome to the Heart Disease Prediction API"}

@app.post("/predict")
def predict_heart_disease(data: PatientData):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded. Please train the model first.")

    # Convert incoming data to a format standard for sklearn prediction
    # We will pass a dataframe to ensure feature names match if required by the model
    input_df = pd.DataFrame([data.dict()])
    
    try:
        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0][1] # Probability of class 1
        
        return {
            "prediction": int(prediction),
            "probability": float(probability),
            "message": "High Risk of Heart Disease" if prediction == 1 else "Low Risk of Heart Disease"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
