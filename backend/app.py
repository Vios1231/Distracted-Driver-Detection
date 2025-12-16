from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pickle
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# load model
with open("svm_model.pkl", "rb") as f:
    model = pickle.load(f)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # ❗ dummy feature (SESUIKAN DIMENSI)
    dummy_feature = np.zeros((1, model.n_features_in_))

    pred = model.predict(dummy_feature)[0]

    return {
        "filename": file.filename,
        "prediction": str(pred),
        "note": "dummy feature used"
    }
