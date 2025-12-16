# 🚗 Distracted Driver Detection

AI-powered web application for detecting distracted driving behaviors from images or videos using a **FastAPI backend** and **React + Vite frontend**.

---

## 📌 Project Structure

```
Distracted Driver Detection/
├── backend/
│   ├── app.py
│   ├── test.py
│            
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Detection.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│
├── .gitignore
├── README.md
├── requirements.txt
```

---

## ⚙️ Tech Stack

### Frontend

* React + TypeScript
* Vite
* Tailwind CSS

### Backend

* FastAPI
* Uvicorn
* Python 3.10+

---

## 🚀 How to Run (Local Development)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/USERNAME/distracted-driver-detection.git
cd distracted-driver-detection
```

---

### 2️⃣ Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
uvicorn app:app --reload
```

Backend will run at:

```
http://127.0.0.1:8000
```

Swagger docs:

```
http://127.0.0.1:8000/docs
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

## 🔁 API Endpoint

### POST `/predict`

* Accepts: Image / Video (multipart/form-data)
* Returns: Prediction result (JSON)

Example response:

```json
{
  "filename": "example.jpg",
  "prediction": 3,
  "note": "dummy feature used"
}
```

---

## 👥 Collaboration Notes

* `node_modules/` and `venv/` are ignored
* Run `npm install` after cloning frontend
* Run `pip install -r requirements.txt` after cloning backend

---

## 📜 License

This project is for **educational and research purposes**.
