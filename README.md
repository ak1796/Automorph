# AutoMorph AI 🚗⚡

**AutoMorph AI** is a MERN-based car customization and engineering simulator powered by supervised Machine Learning. Inspired by high-end automotive configurators (such as Porsche), it allows automotive enthusiasts to select iconic vehicles (BMW M3 Competition, Toyota GR Supra, Porsche 911 Carrera S), customize paint, wheels, spoilers, and body kits, view estimated component pricing, save builds to "My Garage", and analyze supervised ML performance telemetry and interactive engineering charts.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, React Router DOM, Vanilla CSS (Porsche Configurator Aesthetic), Recharts, Lucide Icons
- **Backend (Phase 3):** Node.js, Express.js, MongoDB (Mongoose), JWT Authentication
- **Machine Learning & Data (Phase 1):** Python 3, Pandas, NumPy, Scikit-Learn, Flask, Joblib
- **Tooling & Environment:** npm, Git, `dotenv`

---

## 📁 Project Folder Structure

```
AutoMorph/
├── .gitignore               # Root Git ignore rules
├── README.md                # Comprehensive project documentation
├── backend/                 # Node.js + Express REST API & MongoDB models (Phase 3)
│   ├── .env.example         # Backend environment template
│   └── src/                 # Server entry point, routes, controllers, and models
├── frontend/                # React + Vite Application (Phase 2)
│   ├── .env.example         # Frontend environment template
│   ├── index.html           # HTML5 Entry point
│   ├── package.json         # React dependencies (recharts, react-router-dom, lucide-react)
│   ├── public/
│   │   └── images/          # Studio car photography (BMW M3, Toyota Supra, Porsche 911)
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx           # Glassmorphism header & navigation
│       │   ├── Footer.jsx           # Clean minimal footer & disclaimer
│       │   ├── CarCard.jsx          # Model selection card with specs
│       │   ├── CustomizerViewer.jsx # 2D Studio Car Customizer canvas
│       │   ├── OptionPicker.jsx     # Paint, wheel, spoiler, body kit & price summary
│       │   └── AuthModal.jsx        # Login / Sign up modal dialog
│       ├── context/
│       │   └── CarContext.jsx       # Global React state (Selected car, options, garage, user)
│       ├── data/
│       │   └── carsData.js          # Vehicles catalogue & customization options
│       ├── pages/
│       │   ├── Home.jsx             # Minimal hero section & featured lineup
│       │   ├── CarSelection.jsx     # Model selection catalog page
│       │   ├── Customizer.jsx        # Split-screen studio configurator
│       │   ├── Dashboard.jsx         # Engineering telemetry & Recharts graphs
│       │   ├── MyGarage.jsx          # Personal build archive & localStorage persistence
│       │   └── Auth.jsx              # Standalone authentication page
│       ├── index.css        # Porsche-inspired minimal dark design system
│       └── App.jsx          # Router & Provider wrapper
└── ml/                      # Python ML service & data pipeline (Phase 1)
    ├── .env.example         # ML service environment template
    ├── app.py               # Flask REST API server (serves /predict & /health)
    ├── clean_data.py        # Reproducible data cleaning script
    ├── train.py             # Feature engineering, model evaluation & export pipeline
    ├── test_api.py          # Unit & integration test suite (100% pass)
    ├── requirements.txt     # Python dependencies
    ├── evaluation_results.json # Benchmark metrics JSON
    ├── data/                # Cleaned datasets
    │   ├── auto-mpg.csv
    │   ├── CAR DETAILS FROM CAR DEKHO.csv
    │   └── cars_ds_final.csv
    └── models/              # Exported model binaries
        └── acceleration_model.joblib
```

---

## 💻 How to Start the Project

### 1. Start the React Frontend UI
```bash
cd frontend
npm install
npm run dev
```
*Application runs at `http://localhost:5173`.*

### 2. Start the Node.js / Express Backend
```bash
cd backend
npm install
npm start
```
*Backend runs at `http://localhost:5002`.*

### 3. Run the ML REST API Service
```bash
python ml/app.py
```
*Flask API runs at `http://localhost:5001`.*

### 4. Run ML Model Training & Evaluation
```bash
python ml/train.py
```

### 5. Run ML Test Suite
```bash
python ml/test_api.py
```

---

## 🎨 Implemented Frontend Pages & Features

1. **Home Page (`/`):**
   - Minimalist Porsche-inspired hero section.
   - Featured vehicle lineup cards (BMW M3, Toyota Supra, Porsche 911).
   - Platform capability overview cards.
2. **Car Selection Page (`/cars`):**
   - Interactive model selection grid with technical specifications (Horsepower, 0-60mph acceleration, Weight).
3. **2D Customizer Studio (`/customize`):**
   - 2D car preview canvas with studio lighting effects.
   - Paint finish selection (Isle of Man Green, Renaissance Red, GT Silver, Stealth Black, Chalk White, Miami Blue).
   - Wheels & Rims selector (Forged Double-Spoke, Satin Black, Bronze Forged, Carbon Aero).
   - Spoiler selector (Factory Lip, Carbon Ducktail, GT3 High-Downforce Wing).
   - Body Kit selector (Standard, M Performance Carbon Splitter, Track Aerokit).
   - Live MSRP + Part Price Tally ($Total = Base + Parts$).
   - Save build to "My Garage" with instant persistence.
4. **Engineering Telemetry & ML Dashboard (`/dashboard`):**
   - Full factory specifications breakdown table.
   - **Recharts Graphical Analysis:** Power/Torque comparison bar chart and Power-to-Weight Index chart across all models.
   - **Supervised ML Predictor Box:** Live model inference routed through Express (`POST /api/predict`) to the Flask ML Service running `acceleration_model.joblib` ($R^2 = 0.7321$, MAE = 1.0477s).
5. **My Garage Page (`/garage`):**
   - Personal build archive showing saved configurations, timestamps, part breakdowns, and total estimated prices.
   - Option to re-configure any saved build or remove items.
6. **Authentication Screens (`/auth` & `AuthModal`):**
   - Real user sign-in and sign-up with bcrypt password hashing and JWT token issuance.

---

## 🤖 Supervised ML Benchmark Overview

- **Dataset:** `auto-mpg.csv` (398 rows, 0 nulls post-cleaning).
- **Target:** `acceleration` (0-60 mph sprint time in seconds).
- **Best Model:** **Gradient Boosting Regressor** ($R^2 = 0.7321$, MAE = 1.0477s).

| Model | MAE (sec) | RMSE (sec) | $R^2$ Score | Status |
| :--- | :---: | :---: | :---: | :--- |
| **Gradient Boosting Regressor** | **1.0477s** | **1.4062s** | **0.7321** | 🏆 Best Model |
| Ridge Regression | 1.1124s | 1.4448s | 0.7172 | Baseline |
| Linear Regression | 1.1107s | 1.4456s | 0.7168 | Baseline |
| Random Forest Regressor | 1.1192s | 1.5542s | 0.6727 | Benchmark |
| Decision Tree Regressor | 1.2942s | 1.7112s | 0.6033 | Benchmark |

---

## 🚀 Phase Roadmap Status

- [x] **Phase 0: Environment Audit & Dataset Cleaning**
- [x] **Phase 1: ML Model Training & Flask REST API**
- [x] **Phase 2: High-End Frontend Development (React + Vite + Recharts)**
- [x] **Phase 3: Express Backend & MongoDB API Setup** (User auth, Garage schema, Cars API, JWT)
- [x] **Phase 4: Full-Stack Integration & End-to-End Verification** (React &rarr; Node Proxy &rarr; Flask ML Pipeline)
