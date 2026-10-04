import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCarContext } from '../context/CarContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Cell, ComposedChart, Line
} from 'recharts';
import {
  Cpu, Zap, Activity, Info, RefreshCw, CheckCircle2, AlertCircle, BarChart3, Gauge, SlidersHorizontal, Scale, ArrowRight
} from 'lucide-react';

// Trained ML Evaluation Results (from ml/evaluation_results.json)
const ML_EVALUATION_DATA = [
  { model: 'Gradient Boosting', r2_score: 0.7321, mae_seconds: 1.0477, rmse_seconds: 1.4062, isBest: true },
  { model: 'Ridge Regression', r2_score: 0.7172, mae_seconds: 1.1124, rmse_seconds: 1.4448, isBest: false },
  { model: 'Linear Regression', r2_score: 0.7168, mae_seconds: 1.1107, rmse_seconds: 1.4456, isBest: false },
  { model: 'Random Forest', r2_score: 0.6727, mae_seconds: 1.1192, rmse_seconds: 1.5542, isBest: false },
  { model: 'Decision Tree', r2_score: 0.6033, mae_seconds: 1.2942, rmse_seconds: 1.7112, isBest: false },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';

const Dashboard = () => {
  const { selectedCar, cars, selectCar, customizations } = useCarContext();

  // Modification pricing & selected options breakdown across all categories
  const modPartsCost = Object.values(customizations || {}).reduce((acc, curr) => {
    return acc + (curr?.price || 0);
  }, 0);

  const totalBuildPrice = (selectedCar?.basePrice || 0) + modPartsCost;

  // Form input states
  const [hpInput, setHpInput] = useState(selectedCar ? selectedCar.specs.horsepower : 503);
  const [weightInput, setWeightInput] = useState(selectedCar ? selectedCar.specs.weightLbs : 3890);
  const [dispInput, setDispInput] = useState(selectedCar ? selectedCar.specs.displacementCi : 183);
  const [cylInput, setCylInput] = useState(selectedCar ? selectedCar.specs.cylinders : 6);
  const [yearInput, setYearInput] = useState(82);
  const [originInput, setOriginInput] = useState(selectedCar ? selectedCar.specs.origin : 2);

  // ML API execution states
  const [predictedAccel, setPredictedAccel] = useState(selectedCar ? selectedCar.specs.stockAcceleration060 : 3.8);
  const [predictionUnit, setPredictionUnit] = useState('seconds');
  const [predictionSource, setPredictionSource] = useState('acceleration_model.joblib');
  const [engineeredSpecs, setEngineeredSpecs] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [apiStatus, setApiStatus] = useState({
    state: 'idle',
    message: 'ML Pipeline Ready (React → Express /api/predict → Flask /predict)'
  });
  const [validationError, setValidationError] = useState('');
  const [evaluationData, setEvaluationData] = useState(ML_EVALUATION_DATA);

  // Sync inputs when selected car changes
  useEffect(() => {
    if (selectedCar) {
      setHpInput(selectedCar.specs.horsepower);
      setWeightInput(selectedCar.specs.weightLbs);
      setDispInput(selectedCar.specs.displacementCi);
      setCylInput(selectedCar.specs.cylinders);
      setOriginInput(selectedCar.specs.origin || 2);
      setValidationError('');
    }
  }, [selectedCar]);

  // Load metrics from backend /api/ml/metrics on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/ml/metrics`)
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success' && json.data?.model_evaluations) {
          const formatted = json.data.model_evaluations.map(m => ({
            model: m.model,
            r2_score: m.r2_score,
            mae_seconds: m.mae_seconds,
            rmse_seconds: m.rmse_seconds,
            isBest: m.model === json.data.best_model
          }));
          setEvaluationData(formatted);
        }
      })
      .catch(() => {
        // Fall back to embedded ML_EVALUATION_DATA from evaluation_results.json
      });
  }, []);

  // Load selected car specs into form
  const handleAutoFillSpecs = () => {
    if (selectedCar) {
      setHpInput(selectedCar.specs.horsepower);
      setWeightInput(selectedCar.specs.weightLbs);
      setDispInput(selectedCar.specs.displacementCi);
      setCylInput(selectedCar.specs.cylinders);
      setOriginInput(selectedCar.specs.origin || 2);
      setYearInput(82);
      setValidationError('');
      setApiStatus({
        state: 'idle',
        message: `Auto-filled ${selectedCar.name} baseline factory specifications.`
      });
    }
  };

  // Client-side input validation and execution via Node -> Flask -> Joblib Model
  const handleExecutePredict = async () => {
    setValidationError('');

    // 1. Client-Side Input Validation
    const numHp = Number(hpInput);
    const numWeight = Number(weightInput);
    const numDisp = Number(dispInput);
    const numCyl = Number(cylInput);
    const numYear = Number(yearInput);
    const numOrigin = Number(originInput);

    if (
      hpInput === '' || weightInput === '' || dispInput === '' || cylInput === '' ||
      isNaN(numHp) || isNaN(numWeight) || isNaN(numDisp) || isNaN(numCyl)
    ) {
      const msg = 'Validation Error: Please fill in all specifications (HP, weight, displacement, cylinders) with valid numbers.';
      setValidationError(msg);
      setApiStatus({ state: 'error', message: msg });
      return;
    }

    if (numHp <= 0 || numWeight <= 0 || numDisp <= 0 || numCyl <= 0) {
      const msg = 'Validation Error: Horsepower, curb weight, displacement, and cylinders must be positive numbers greater than zero.';
      setValidationError(msg);
      setApiStatus({ state: 'error', message: msg });
      return;
    }

    if (numHp > 3000 || numWeight > 20000 || numDisp > 1200 || numCyl > 16) {
      const msg = 'Validation Error: Entered values exceed realistic physical vehicle boundaries.';
      setValidationError(msg);
      setApiStatus({ state: 'error', message: msg });
      return;
    }

    setIsPredicting(true);
    setApiStatus({
      state: 'loading',
      message: 'Routing inference: React → Express (/api/predict) → Flask ML (/predict)...'
    });

    const payload = {
      cylinders: numCyl,
      displacement: numDisp,
      horsepower: numHp,
      weight: numWeight,
      model_year: numYear || 82,
      origin: numOrigin || 2
    };

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || data.status !== 'success') {
        const errorMsg = data.message || `ML Prediction service returned HTTP ${response.status}`;
        setApiStatus({
          state: 'error',
          message: errorMsg
        });
        return;
      }

      // Successful prediction from actual trained model
      if (data.prediction && data.prediction['0_to_60_mph_sec'] !== undefined) {
        setPredictedAccel(data.prediction['0_to_60_mph_sec']);
        setPredictionUnit(data.prediction.unit || 'seconds');
        setPredictionSource(data.source || 'Flask ML API (Gradient Boosting Joblib Model)');
        setEngineeredSpecs(data.input_specs || null);
        setApiStatus({
          state: 'success',
          message: 'Inference successful (HTTP 200 via Node.js Express → Flask ML Service)'
        });
      } else {
        setApiStatus({
          state: 'error',
          message: 'Malformed response structure received from prediction service.'
        });
      }
    } catch (err) {
      setApiStatus({
        state: 'error',
        message: `Network Connection Error: Unable to reach backend API at ${API_BASE_URL}. Ensure Node server is running.`
      });
    } finally {
      setIsPredicting(false);
    }
  };

  // Vehicle Comparison Analytics Datasets
  const hpTorqueComparison = cars.map(car => ({
    name: car.name.split(' ')[0] + ' ' + (car.name.split(' ')[1] || ''),
    Manufacturer: car.manufacturer,
    'Horsepower (HP)': car.specs.horsepower,
    'Peak Torque (Nm)': car.specs.torqueNm,
    isSelected: selectedCar?.id === car.id
  }));

  const powerToWeightData = cars.map(car => ({
    name: car.name.split(' ')[0] + ' ' + (car.name.split(' ')[1] || ''),
    'HP per 1000 lbs': parseFloat(((car.specs.horsepower / car.specs.weightLbs) * 1000).toFixed(1)),
    'Weight (lbs)': car.specs.weightLbs,
    isSelected: selectedCar?.id === car.id
  }));

  if (!selectedCar) return null;

  const stockPtw = ((selectedCar.specs.horsepower / selectedCar.specs.weightLbs) * 1000).toFixed(1);

  return (
    <div className="w-[93%] max-w-[1600px] mx-auto py-6 pb-16">
      {/* Header & Vehicle Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-5 h-5 text-sky-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400">
              SUPERVISED ML TELEMETRY & ANALYTICS
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100">{selectedCar.name} Telemetry & Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Explore mechanical specifications, compare performance metrics, and execute live supervised ML predictions.
          </p>
        </div>

        {/* Quick Car Selection Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Active Model:</span>
          {cars.map(car => (
            <button
              key={car.id}
              onClick={() => selectCar(car)}
              className={`text-xs px-3.5 py-1.5 rounded-md font-medium transition ${
                selectedCar.id === car.id
                  ? 'bg-white text-slate-950 font-semibold shadow-sm'
                  : 'bg-[#12151c] text-slate-400 hover:text-slate-200 border border-white/10'
              }`}
            >
              {car.name.split(' ')[0]} {car.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 Key Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#12151c] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Engine Output</span>
            <div className="text-2xl font-extrabold text-sky-400 mt-1">{selectedCar.specs.horsepower} <span className="text-sm font-normal text-slate-400">HP</span></div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">{selectedCar.specs.torqueNm} Nm Torque</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-sky-400" />
          </div>
        </div>

        <div className="bg-[#12151c] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Power-To-Weight</span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">
              {((selectedCar.specs.horsepower / selectedCar.specs.weightLbs) * 1000).toFixed(1)} <span className="text-xs font-normal text-slate-400">HP/k-lbs</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">{selectedCar.specs.weightLbs} lbs Curb Weight</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Scale className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="bg-[#12151c] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Stock 0-60 Benchmark</span>
            <div className="text-2xl font-extrabold text-amber-400 mt-1">
              {selectedCar.specs.stockAcceleration060} <span className="text-sm font-normal text-slate-400">sec</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">{selectedCar.specs.drivetrain}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Gauge className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        <div className="bg-[#12151c] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Best ML Model R² Score</span>
            <div className="text-2xl font-extrabold text-indigo-400 mt-1">
              0.7321 <span className="text-xs font-normal text-slate-400">R²</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Gradient Boosting Regressor</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Active 3D Studio Configuration & Customizer Integration Banner */}
      <div className="bg-[#12151c] border border-white/10 rounded-2xl p-6 sm:p-7 mb-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400">
                  Active 3D Studio Configuration
                </span>
                <span className="text-[9px] bg-white/10 text-slate-300 px-2 py-0.5 rounded font-medium">
                  Synced Across Pages
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-100 mt-0.5">
                {selectedCar.name} Custom Build
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Components, aero attachments, liveries, and stance mounted in the 3D Configurator studio.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="bg-[#151922] border border-white/10 px-4 py-2 rounded-xl text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Modification Cost</span>
              <span className="text-base font-extrabold text-amber-400">+${modPartsCost.toLocaleString()}</span>
            </div>
            <div className="bg-[#151922] border border-white/10 px-4 py-2 rounded-xl text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Estimated Build</span>
              <span className="text-base font-extrabold text-slate-100">${totalBuildPrice.toLocaleString()}</span>
            </div>
            <Link
              to="/customize"
              className="flex items-center gap-2 bg-white hover:bg-slate-200 text-slate-950 font-semibold px-4 py-2.5 rounded-lg text-xs transition shadow-sm"
            >
              <span>Edit in 3D Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Selected Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Paint */}
          <div className="bg-[#151922] border border-white/10 p-4 rounded-xl flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full border border-white/30 shrink-0 shadow-inner"
              style={{ backgroundColor: customizations?.paint?.hex || '#154734' }}
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Exterior Paint</span>
              <h4 className="text-xs font-semibold text-slate-200 truncate">{customizations?.paint?.name || 'Standard'}</h4>
              <span className="text-[11px] text-slate-400 font-mono">
                {customizations?.paint?.price === 0 ? 'Standard ($0)' : `+$${customizations?.paint?.price?.toLocaleString()}`}
              </span>
            </div>
          </div>

          {/* Wheels */}
          <div className="bg-[#151922] border border-white/10 p-4 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm shrink-0">
              🛞
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Wheels & Rims</span>
              <h4 className="text-xs font-semibold text-slate-200 truncate">{customizations?.wheels?.name || 'Factory Alloys'}</h4>
              <span className="text-[11px] text-slate-400 font-mono">
                {customizations?.wheels?.price === 0 ? 'Standard ($0)' : `+$${customizations?.wheels?.price?.toLocaleString()}`}
              </span>
            </div>
          </div>

          {/* Spoiler */}
          <div className="bg-[#151922] border border-white/10 p-4 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm shrink-0">
              🏎️
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Aerodynamic Spoiler</span>
              <h4 className="text-xs font-semibold text-slate-200 truncate">{customizations?.spoiler?.name || 'Factory Lip'}</h4>
              <span className="text-[11px] text-slate-400 font-mono">
                {customizations?.spoiler?.price === 0 ? 'Standard ($0)' : `+$${customizations?.spoiler?.price?.toLocaleString()}`}
              </span>
            </div>
          </div>

          {/* Aero Splitter & Kit */}
          <div className="bg-[#151922] border border-white/10 p-4 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm shrink-0">
              ⚡
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Splitter & Aero Kit</span>
              <h4 className="text-xs font-semibold text-slate-200 truncate">
                {customizations?.frontSplitter?.name !== 'OEM Factory Bumper Lower Lip'
                  ? customizations?.frontSplitter?.name
                  : customizations?.bodyKit?.name || 'Standard Aero'}
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">
                {(customizations?.frontSplitter?.price || 0) + (customizations?.bodyKit?.price || 0) === 0
                  ? 'Standard ($0)'
                  : `+$${((customizations?.frontSplitter?.price || 0) + (customizations?.bodyKit?.price || 0)).toLocaleString()}`}
              </span>
            </div>
          </div>
        </div>

        {/* Extended Modification Badges */}
        <div className="flex gap-2 flex-wrap mt-4 pt-4 border-t border-white/5 text-[11px]">
          {customizations?.caliper && (
            <span className="bg-[#151922] border border-white/10 px-3 py-1 rounded-lg text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: customizations.caliper.hex }} />
              Caliper: {customizations.caliper.name}
            </span>
          )}
          {customizations?.hood && customizations.hood.id !== 'hood_stock' && (
            <span className="bg-[#151922] border border-white/10 px-3 py-1 rounded-lg text-slate-300">
              Bonnet: {customizations.hood.name}
            </span>
          )}
          {customizations?.rearDiffuser && customizations.rearDiffuser.id !== 'diffuser_stock' && (
            <span className="bg-[#151922] border border-white/10 px-3 py-1 rounded-lg text-slate-300">
              Diffuser: {customizations.rearDiffuser.name}
            </span>
          )}
          {customizations?.livery && customizations.livery.id !== 'livery_none' && (
            <span className="bg-[#151922] border border-white/10 px-3 py-1 rounded-lg text-slate-300">
              Livery: {customizations.livery.name}
            </span>
          )}
          {customizations?.suspension && customizations.suspension.id !== 'susp_stock' && (
            <span className="bg-[#151922] border border-white/10 px-3 py-1 rounded-lg text-amber-300">
              Stance: {customizations.suspension.name}
            </span>
          )}
        </div>
      </div>

      {/* Stock Factory vs. Customized Engineering Benchmark Comparison */}
      <div className="bg-[#12151c] border border-white/10 rounded-2xl p-6 sm:p-7 mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 mb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-slate-100">Stock Factory vs. Customized Engineering Comparison</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical breakdown of mechanical specifications versus aftermarket cosmetic & aerodynamic modifications.
            </p>
          </div>
          <span className="text-[11px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium px-3 py-1 rounded-md">
            Scientific Rigor Mode
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Engineering Parameter</th>
                <th className="p-3.5">Stock Factory Baseline</th>
                <th className="p-3.5">Customized Build</th>
                <th className="p-3.5">Calculated Delta</th>
                <th className="p-3.5">Engineering / ML Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* Horsepower */}
              <tr className="hover:bg-white/5 transition">
                <td className="p-3.5 font-semibold text-slate-200 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-sky-400" />
                  <span>Peak Horsepower (HP)</span>
                </td>
                <td className="p-3.5 font-mono text-slate-300">{selectedCar.specs.horsepower} HP</td>
                <td className="p-3.5 font-mono text-sky-400 font-bold">
                  {selectedCar.specs.horsepower + (customizations?.powertrain?.hpGain || 0) + (customizations?.turbocharger?.hpGain || 0) + (customizations?.exhaust?.hpGain || 0)} HP
                </td>
                <td className="p-3.5 font-mono">
                  {(customizations?.powertrain?.hpGain || 0) + (customizations?.turbocharger?.hpGain || 0) + (customizations?.exhaust?.hpGain || 0) > 0 ? (
                    <span className="text-emerald-400 font-bold">
                      +{(customizations?.powertrain?.hpGain || 0) + (customizations?.turbocharger?.hpGain || 0) + (customizations?.exhaust?.hpGain || 0)} HP
                    </span>
                  ) : (
                    <span className="text-slate-400">0 HP (±0%)</span>
                  )}
                </td>
                <td className="p-3.5 text-slate-400 text-[11px]">
                  {(customizations?.powertrain?.hpGain || 0) + (customizations?.turbocharger?.hpGain || 0) + (customizations?.exhaust?.hpGain || 0) > 0
                    ? 'Includes Garrett turbocharger boost, calibrated ECU map flash, and high-flow exhaust hardware power gains.'
                    : 'Cosmetic paint, wheels, and aero attachments do not alter internal combustion output without ECU or turbo tuning.'}
                </td>
              </tr>

              {/* Curb Weight */}
              <tr className="hover:bg-white/5 transition">
                <td className="p-3.5 font-semibold text-slate-200 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  <span>Curb Weight (lbs)</span>
                </td>
                <td className="p-3.5 font-mono text-slate-300">{selectedCar.specs.weightLbs} lbs</td>
                <td className="p-3.5 font-mono text-emerald-400 font-bold">
                  {selectedCar.specs.weightLbs + (customizations?.exhaust?.weightDeltaLbs || 0) + (customizations?.suspension?.weightDeltaLbs || 0) + (customizations?.hood?.weightDeltaLbs || 0)} lbs
                </td>
                <td className="p-3.5 font-mono">
                  {(customizations?.exhaust?.weightDeltaLbs || 0) + (customizations?.suspension?.weightDeltaLbs || 0) + (customizations?.hood?.weightDeltaLbs || 0) !== 0 ? (
                    <span className="text-emerald-400 font-bold">
                      {(customizations?.exhaust?.weightDeltaLbs || 0) + (customizations?.suspension?.weightDeltaLbs || 0) + (customizations?.hood?.weightDeltaLbs || 0)} lbs
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-medium">
                      OEM Factory Weight
                    </span>
                  )}
                </td>
                <td className="p-3.5 text-slate-400 text-[11px]">
                  {(customizations?.exhaust?.weightDeltaLbs || 0) + (customizations?.suspension?.weightDeltaLbs || 0) + (customizations?.hood?.weightDeltaLbs || 0) !== 0
                    ? 'Reflects carbon-fibre bonnet weight savings, titanium exhaust, and lightweight coilover suspension.'
                    : 'Lightweight alloy wheels reduce unsprung mass; overall curb weight matches OEM factory specs.'}
                </td>
              </tr>

              {/* Power-to-Weight Ratio */}
              <tr className="hover:bg-white/5 transition">
                <td className="p-3.5 font-semibold text-slate-200 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-amber-400" />
                  <span>Power-to-Weight Efficiency</span>
                </td>
                <td className="p-3.5 font-mono text-slate-300">{stockPtw} HP/k-lbs</td>
                <td className="p-3.5 font-mono text-amber-400 font-bold">
                  {((
                    (selectedCar.specs.horsepower + (customizations?.powertrain?.hpGain || 0) + (customizations?.turbocharger?.hpGain || 0) + (customizations?.exhaust?.hpGain || 0)) /
                    (selectedCar.specs.weightLbs + (customizations?.exhaust?.weightDeltaLbs || 0) + (customizations?.suspension?.weightDeltaLbs || 0) + (customizations?.hood?.weightDeltaLbs || 0))
                  ) * 1000).toFixed(1)} HP/k-lbs
                </td>
                <td className="p-3.5 font-mono">
                  {(
                    ((
                      (selectedCar.specs.horsepower + (customizations?.powertrain?.hpGain || 0) + (customizations?.turbocharger?.hpGain || 0) + (customizations?.exhaust?.hpGain || 0)) /
                      (selectedCar.specs.weightLbs + (customizations?.exhaust?.weightDeltaLbs || 0) + (customizations?.suspension?.weightDeltaLbs || 0) + (customizations?.hood?.weightDeltaLbs || 0))
                    ) * 1000) - parseFloat(stockPtw)
                  ) !== 0 ? (
                    <span className="text-emerald-400 font-bold">
                      +{(
                        ((
                          (selectedCar.specs.horsepower + (customizations?.powertrain?.hpGain || 0) + (customizations?.turbocharger?.hpGain || 0) + (customizations?.exhaust?.hpGain || 0)) /
                          (selectedCar.specs.weightLbs + (customizations?.exhaust?.weightDeltaLbs || 0) + (customizations?.suspension?.weightDeltaLbs || 0) + (customizations?.hood?.weightDeltaLbs || 0))
                        ) * 1000) - parseFloat(stockPtw)
                      ).toFixed(1)} HP/k-lbs
                    </span>
                  ) : (
                    <span className="text-slate-400">0.0 (Unchanged)</span>
                  )}
                </td>
                <td className="p-3.5 text-slate-400 text-[11px]">
                  Direct mechanical calculation based on peak output over curb mass.
                </td>
              </tr>

              {/* 0-60 MPH Acceleration */}
              <tr className="hover:bg-white/5 transition">
                <td className="p-3.5 font-semibold text-slate-200 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  <span>0-60 MPH Sprint Time</span>
                </td>
                <td className="p-3.5 font-mono text-slate-300">{selectedCar.specs.stockAcceleration060} sec (Factory)</td>
                <td className="p-3.5 font-mono text-indigo-400 font-bold">
                  {predictedAccel !== null ? `${predictedAccel} sec` : `${selectedCar.specs.stockAcceleration060} sec`}
                </td>
                <td className="p-3.5">
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono">
                    ML Stock Model
                  </span>
                </td>
                <td className="p-3.5 text-slate-400 text-[11px]">
                  Derived from supervised Gradient Boosting model on historical mechanical features. Aerodynamic downforce gains are <strong>not modeled</strong> by the trained dataset.
                </td>
              </tr>

              {/* Vehicle Valuation */}
              <tr className="hover:bg-white/5 transition">
                <td className="p-3.5 font-semibold text-slate-200 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-sky-400" />
                  <span>Total Vehicle & Parts Valuation</span>
                </td>
                <td className="p-3.5 font-mono text-slate-300">${selectedCar.basePrice.toLocaleString()}</td>
                <td className="p-3.5 font-mono text-emerald-400 font-bold">${totalBuildPrice.toLocaleString()}</td>
                <td className="p-3.5 font-mono text-amber-400 font-bold">+${modPartsCost.toLocaleString()}</td>
                <td className="p-3.5 text-slate-400 text-[11px]">
                  Sum of factory base MSRP plus retail prices of all 11 selected modification categories.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Grid: Live ML Predictor + Vehicle Mechanical Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Left: Interactive ML Prediction Panel */}
        <div className="lg:col-span-7 bg-[#12151c] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-slate-100">Supervised ML Acceleration Inference</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Trigger live model predictions via Express Proxy (<code>POST /api/predict</code> &rarr; Flask <code>port 5001</code>).
              </p>
            </div>

            <button
              onClick={handleAutoFillSpecs}
              className="text-xs font-medium text-sky-400 hover:text-sky-300 border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 rounded-md transition"
            >
              Auto-Fill {selectedCar.name.split(' ')[0]} Specs
            </button>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-[#151922] p-5 rounded-xl border border-white/5">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Horsepower (HP)</label>
              <input
                type="number"
                value={hpInput}
                onChange={e => setHpInput(Number(e.target.value))}
                className="w-full bg-[#0a0c10] border border-white/10 rounded-md px-3 py-2 text-xs font-medium text-slate-100 outline-none focus:border-sky-500 transition"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Curb Weight (lbs)</label>
              <input
                type="number"
                value={weightInput}
                onChange={e => setWeightInput(Number(e.target.value))}
                className="w-full bg-[#0a0c10] border border-white/10 rounded-md px-3 py-2 text-xs font-medium text-slate-100 outline-none focus:border-sky-500 transition"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Displacement (cu in)</label>
              <input
                type="number"
                value={dispInput}
                onChange={e => setDispInput(Number(e.target.value))}
                className="w-full bg-[#0a0c10] border border-white/10 rounded-md px-3 py-2 text-xs font-medium text-slate-100 outline-none focus:border-sky-500 transition"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Cylinders</label>
              <input
                type="number"
                value={cylInput}
                onChange={e => setCylInput(Number(e.target.value))}
                className="w-full bg-[#0a0c10] border border-white/10 rounded-md px-3 py-2 text-xs font-medium text-slate-100 outline-none focus:border-sky-500 transition"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Model Year Index</label>
              <input
                type="number"
                value={yearInput}
                onChange={e => setYearInput(Number(e.target.value))}
                className="w-full bg-[#0a0c10] border border-white/10 rounded-md px-3 py-2 text-xs font-medium text-slate-100 outline-none focus:border-sky-500 transition"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Origin Region</label>
              <select
                value={originInput}
                onChange={e => setOriginInput(Number(e.target.value))}
                className="w-full bg-[#0a0c10] border border-white/10 rounded-md px-3 py-2 text-xs font-medium text-slate-100 outline-none focus:border-sky-500 transition"
              >
                <option value={1}>1: USA</option>
                <option value={2}>2: Europe</option>
                <option value={3}>3: Asia</option>
              </select>
            </div>
          </div>

          {validationError && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <button
            onClick={handleExecutePredict}
            disabled={isPredicting}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-200 text-slate-950 font-semibold py-3 rounded-md text-xs transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPredicting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
            <span>{isPredicting ? 'Executing Supervised Model Inference...' : 'Execute ML Model Inference'}</span>
          </button>

          {/* Inference Output Display */}
          <div className="bg-[#151922] border border-white/10 p-6 rounded-xl text-center relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                PREDICTED 0-60 MPH SPRINT ACCELERATION
              </span>
              <span className="text-[9px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded font-mono">
                {predictionSource}
              </span>
            </div>

            <div className="text-4xl sm:text-5xl font-extrabold text-slate-100 mt-2">
              {predictedAccel !== null ? predictedAccel : '--'} <span className="text-lg font-normal text-slate-400">{predictionUnit}</span>
            </div>

            {/* API Status Badge */}
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs">
              {apiStatus.state === 'loading' && <RefreshCw className="w-4 h-4 text-sky-400 animate-spin" />}
              {apiStatus.state === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {apiStatus.state === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
              <span className={
                apiStatus.state === 'success' ? 'text-emerald-400 font-medium' :
                apiStatus.state === 'error' ? 'text-rose-400 font-medium' :
                apiStatus.state === 'loading' ? 'text-sky-400' :
                'text-slate-400'
              }>
                {apiStatus.message}
              </span>
            </div>

            {apiStatus.state === 'error' && (
              <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-left text-xs text-rose-300">
                <span className="font-bold block mb-1">Inference Service Notice:</span>
                <span>{apiStatus.message}</span>
              </div>
            )}

            {engineeredSpecs && (
              <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-2 text-[11px] text-slate-400">
                <div>
                  <span className="block text-slate-500 text-[10px]">Power/Weight</span>
                  <span className="font-semibold text-slate-200">{engineeredSpecs.power_to_weight_ratio} HP/lb</span>
                </div>
                <div>
                  <span className="block text-slate-500 text-[10px]">Weight/HP</span>
                  <span className="font-semibold text-slate-200">
                    {(engineeredSpecs.weight_lbs / engineeredSpecs.horsepower).toFixed(2)} lbs/HP
                  </span>
                </div>
                <div>
                  <span className="block text-slate-500 text-[10px]">Disp / Cyl</span>
                  <span className="font-semibold text-slate-200">
                    {(engineeredSpecs.displacement_ci / engineeredSpecs.cylinders).toFixed(1)} cu in
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 flex items-start gap-2 bg-white/5 border border-white/10 p-3 rounded-lg">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <span>
              <strong>Model Scope & Ground Truth:</strong> Predictions are generated by the pre-trained supervised machine learning pipeline (<code>acceleration_model.joblib</code>). Requests are routed from React &rarr; Express Backend &rarr; Flask ML API. Predictions reflect physical acceleration based strictly on mechanical specifications (curb weight, horsepower, displacement, cylinders). Aesthetic visual modifications (paint, spoilers, body kits) do not fabricate unverified modification gains.
            </span>
          </div>
        </div>

        {/* Right: Selected Vehicle Specifications Table */}
        <div className="lg:col-span-5 bg-[#12151c] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h3 className="text-base font-bold text-slate-100">Factory Mechanical Specifications</h3>
              <span className="text-xs font-medium text-sky-400">{selectedCar.manufacturer}</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-[#151922] border border-white/10 rounded-xl p-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">Peak Horsepower</span>
                <span className="text-xl font-bold text-sky-400">{selectedCar.specs.horsepower} HP</span>
              </div>
              <div className="bg-[#151922] border border-white/10 rounded-xl p-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">Peak Torque</span>
                <span className="text-xl font-bold text-slate-100">{selectedCar.specs.torqueNm} Nm</span>
              </div>
              <div className="bg-[#151922] border border-white/10 rounded-xl p-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">Engine Displacement</span>
                <span className="text-xl font-bold text-slate-100">{selectedCar.specs.displacementCi} cu in</span>
              </div>
              <div className="bg-[#151922] border border-white/10 rounded-xl p-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">Curb Weight</span>
                <span className="text-xl font-bold text-slate-100">{selectedCar.specs.weightLbs} lbs</span>
              </div>
              <div className="bg-[#151922] border border-white/10 rounded-xl p-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">Drivetrain Layout</span>
                <span className="text-sm font-semibold text-slate-200">{selectedCar.specs.drivetrain}</span>
              </div>
              <div className="bg-[#151922] border border-white/10 rounded-xl p-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">Top Speed</span>
                <span className="text-sm font-semibold text-slate-200">{selectedCar.specs.topSpeedMph} MPH</span>
              </div>
            </div>

            <div className="mt-4 bg-[#151922] border border-white/10 rounded-xl p-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">Transmission</span>
              <span className="text-xs font-medium text-slate-200">{selectedCar.specs.transmission}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-xs text-slate-400 italic">
              "{selectedCar.description}"
            </p>
          </div>
        </div>
      </div>

      {/* ML Trained Models Evaluation Comparison Section */}
      <div className="bg-[#12151c] border border-white/10 rounded-2xl p-6 sm:p-8 mb-10">
        <div className="mb-6 border-b border-white/10 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-slate-100">Trained ML Model Evaluation & Benchmarks</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative metrics across regression models evaluated during Phase 1 training (Dataset: <code>auto-mpg.csv</code>, 398 samples).
            </p>
          </div>

          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-md">
            Best Model: Gradient Boosting (R² = 0.7321)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Chart */}
          <div className="lg:col-span-7 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={evaluationData} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="model"
                  stroke="#94a3b8"
                  style={{ fontSize: '0.75rem' }}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#94a3b8" style={{ fontSize: '0.75rem' }} domain={[0, 1.0]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#151922', borderColor: 'rgba(255,255,255,0.1)', color: '#f8fafc', fontSize: '0.75rem', borderRadius: '0.5rem' }}
                />
                <Legend wrapperStyle={{ fontSize: '0.75rem', paddingTop: '10px' }} />
                <Bar dataKey="r2_score" name="R² Score (Accuracy)" fill="#818cf8" radius={[4, 4, 0, 0]}>
                  {evaluationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isBest ? '#38bdf8' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Metrics Table */}
          <div className="lg:col-span-5 bg-[#151922] border border-white/10 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/10 text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Model</th>
                  <th className="p-3">R² Score</th>
                  <th className="p-3">MAE (sec)</th>
                  <th className="p-3">RMSE (sec)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {evaluationData.map((m, idx) => (
                  <tr key={idx} className={m.isBest ? 'bg-sky-500/10 font-semibold text-slate-100' : 'text-slate-300'}>
                    <td className="p-3 flex items-center gap-1.5">
                      {m.model}
                      {m.isBest && <span className="text-[9px] bg-sky-400 text-slate-950 font-extrabold px-1.5 py-0.5 rounded">BEST</span>}
                    </td>
                    <td className="p-3 font-mono">{m.r2_score}</td>
                    <td className="p-3 font-mono">±{m.mae_seconds}s</td>
                    <td className="p-3 font-mono">{m.rmse_seconds}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cross-Vehicle Comparative Graphical Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Chart 1: HP & Torque Comparison */}
        <div className="bg-[#12151c] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-slate-100 mb-1">Engine Power & Torque Comparison</h3>
          <p className="text-xs text-slate-400 mb-4">Horsepower (HP) vs Peak Torque (Nm) across benchmark models.</p>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hpTorqueComparison} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '0.75rem' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '0.75rem' }} />
                <Tooltip contentStyle={{ backgroundColor: '#151922', borderColor: 'rgba(255,255,255,0.1)', color: '#f8fafc', fontSize: '0.75rem', borderRadius: '0.5rem' }} />
                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                <Bar dataKey="Horsepower (HP)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Peak Torque (Nm)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Power-To-Weight Ratio */}
        <div className="bg-[#12151c] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-slate-100 mb-1">Power-To-Weight Efficiency Index</h3>
          <p className="text-xs text-slate-400 mb-4">Horsepower output per 1,000 lbs of curb weight.</p>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={powerToWeightData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '0.75rem' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '0.75rem' }} />
                <Tooltip contentStyle={{ backgroundColor: '#151922', borderColor: 'rgba(255,255,255,0.1)', color: '#f8fafc', fontSize: '0.75rem', borderRadius: '0.5rem' }} />
                <Bar dataKey="HP per 1000 lbs" fill="#10b981" radius={[4, 4, 0, 0]}>
                  {powerToWeightData.map((entry, index) => (
                    <Cell key={`ptw-${index}`} fill={entry.isSelected ? '#34d399' : '#059669'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Full Vehicle Specification Matrix Table */}
      <div className="bg-[#12151c] border border-white/10 rounded-2xl p-6 sm:p-8">
        <h3 className="text-base font-bold text-slate-100 mb-4">Full Benchmark Lineup Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Model Name</th>
                <th className="p-3.5">Horsepower</th>
                <th className="p-3.5">Torque</th>
                <th className="p-3.5">Displacement</th>
                <th className="p-3.5">Weight</th>
                <th className="p-3.5">Power/Weight</th>
                <th className="p-3.5">0-60 MPH</th>
                <th className="p-3.5">Base MSRP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {cars.map(car => {
                const isCurrent = selectedCar.id === car.id;
                const ptw = ((car.specs.horsepower / car.specs.weightLbs) * 1000).toFixed(1);
                return (
                  <tr
                    key={car.id}
                    onClick={() => selectCar(car)}
                    className={`cursor-pointer transition ${
                      isCurrent ? 'bg-sky-500/10 text-slate-100 font-semibold' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <td className="p-3.5 flex items-center gap-2">
                      <span className="font-bold">{car.name}</span>
                      {isCurrent && (
                        <span className="text-[9px] bg-sky-400 text-slate-950 font-extrabold px-1.5 py-0.5 rounded">SELECTED</span>
                      )}
                    </td>
                    <td className="p-3.5 text-sky-400 font-bold">{car.specs.horsepower} HP</td>
                    <td className="p-3.5">{car.specs.torqueNm} Nm</td>
                    <td className="p-3.5">{car.specs.displacementCi} cu in</td>
                    <td className="p-3.5">{car.specs.weightLbs} lbs</td>
                    <td className="p-3.5 text-emerald-400 font-mono">{ptw} HP/k-lbs</td>
                    <td className="p-3.5 text-amber-400 font-bold">{car.specs.stockAcceleration060}s</td>
                    <td className="p-3.5 font-bold">${car.basePrice.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
