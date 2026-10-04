import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarContext } from '../context/CarContext';
import {
  Sliders,
  Cpu,
  ArrowRight,
  Gauge,
  Activity,
  Zap,
  Shield,
  Layers,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Car
} from 'lucide-react';

const Home = () => {
  const { cars, selectCar } = useCarContext();
  const navigate = useNavigate();
  const [filterRegion, setFilterRegion] = useState('ALL');

  const filteredCars = cars.filter(car => {
    if (filterRegion === 'ALL') return true;
    if (filterRegion === 'EUROPE') return car.specs.origin === 2;
    if (filterRegion === 'ASIA') return car.specs.origin === 3;
    if (filterRegion === 'USA') return car.specs.origin === 1;
    return true;
  });

  const handleSelectAndCustomize = (car) => {
    selectCar(car);
    navigate('/customize');
  };

  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-20 text-slate-100 bg-[#0a0c10] overflow-hidden">
      {/* 1. CINATIC FULL-SCREEN HERO SECTION */}
      <section className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden border-b border-white/10">
        {/* Hero Background Backdrop with Cinematic Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/nissan_gtr.jpg"
            alt="Cinematic AutoMorph Studio"
            className="w-full h-full object-cover opacity-30 scale-105 filter brightness-75 contrast-125 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-[#0a0c10]/70 to-[#0a0c10]/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 w-[92%] max-w-[1500px] mx-auto py-20 flex flex-col items-center text-center gap-8">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/15 px-4 py-2 rounded-full backdrop-blur-md shadow-2xl">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-sky-400">
              NEXT-GEN AUTOMOTIVE 3D STUDIO & ML TELEMETRY
            </span>
          </div>

          {/* Main Cinematic Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.95] text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 max-w-5xl drop-shadow-2xl">
            ENGINEER YOUR DRIVE
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl font-light leading-relaxed">
            Experience ultra-realistic 3D vehicle customization backed by trained supervised machine learning telemetry. Configure aerodynamic aero kits, forged wheels, titanium exhausts, and stage powertrain tunes.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full sm:w-auto">
            <button
              onClick={() => {
                const fleetEl = document.getElementById('fleet-section');
                if (fleetEl) fleetEl.scrollIntoView({ behavior: 'smooth' });
                else navigate('/cars');
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white hover:bg-slate-200 text-slate-950 px-8 py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-105"
            >
              <span>Explore Cars</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/customize')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold text-sm tracking-wide transition-all hover:scale-105"
            >
              <Sliders className="w-4 h-4 text-sky-400" />
              <span>Customize Your Build</span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 border border-white/10 hover:border-white/30 bg-black/40 text-slate-300 hover:text-white px-6 py-4 rounded-xl font-medium text-sm transition-all"
            >
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>ML Telemetry</span>
            </button>
          </div>

          {/* Stats Bar Ticker */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mt-12 pt-10 border-t border-white/10 w-full max-w-4xl text-center">
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">8</span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 mt-0.5">Iconic Benchmark Cars</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-black text-sky-400 font-mono">11</span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 mt-0.5">Customization Modules</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">0.7321</span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 mt-0.5">ML R² Prediction Accuracy</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">100%</span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 mt-0.5">Supervised ML Inference</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CAR FLEET SHOWCASE */}
      <section id="fleet-section" className="w-[92%] max-w-[1500px] mx-auto scroll-mt-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Car className="w-4 h-4 text-sky-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400">
                PERFORMANCE LINEUP CATALOG
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              The AutoMorph Fleet
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Select any benchmark model to launch the interactive 3D Customizer Studio or inspect factory mechanical specifications.
            </p>
          </div>

          {/* Region Filter Buttons */}
          <div className="flex items-center gap-2 bg-[#12151c] border border-white/10 p-1.5 rounded-xl flex-wrap">
            {[
              { id: 'ALL', label: 'All Supercars' },
              { id: 'EUROPE', label: 'European Exotics' },
              { id: 'ASIA', label: 'Asian Track' },
              { id: 'USA', label: 'American Muscle' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterRegion(tab.id)}
                className={`text-xs px-3.5 py-2 rounded-lg font-semibold transition ${
                  filterRegion === tab.id
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Car Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCars.map(car => (
            <div
              key={car.id}
              className="bg-[#12151c] border border-white/10 hover:border-white/30 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col group shadow-xl"
            >
              <div className="relative w-full h-56 bg-[#0a0c10] overflow-hidden">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12151c] via-transparent to-transparent opacity-80" />
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold text-emerald-400 border border-emerald-500/30">
                  ${car.basePrice.toLocaleString()}
                </div>
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-300 uppercase tracking-wider border border-white/10">
                  {car.manufacturer}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1 gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-sky-400 transition">{car.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{car.tagline}</p>
                </div>

                {/* Performance Specs Grid */}
                <div className="grid grid-cols-3 gap-2 mt-auto text-center font-mono">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-sans">Power</span>
                    <span className="text-xs font-bold text-sky-400 mt-0.5">{car.specs.horsepower} HP</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-sans">0-60 mph</span>
                    <span className="text-xs font-bold text-amber-400 mt-0.5">{car.specs.stockAcceleration060}s</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-sans">Top Speed</span>
                    <span className="text-xs font-bold text-slate-200 mt-0.5">{car.specs.topSpeedMph} mph</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelectAndCustomize(car)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-slate-200 text-slate-950 text-xs font-bold py-2.5 rounded-xl transition shadow-md"
                  >
                    <span>Configure 3D</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      selectCar(car);
                      navigate('/cars');
                    }}
                    className="px-3 border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-slate-300 text-xs rounded-xl transition"
                    title="View Full Technical Data"
                  >
                    Specs
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. INTERACTIVE 3D CUSTOMIZER STUDIO SHOWCASE */}
      <section className="w-[92%] max-w-[1500px] mx-auto">
        <div className="bg-[#12151c] border border-white/10 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 px-3.5 py-1.5 rounded-full w-fit">
                <Sliders className="w-4 h-4 text-sky-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400">
                  REAL-TIME 3D CONFIGURATOR STUDIO
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
                Modular 3D Tuning & Aerodynamics
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                Inspect components dynamically rendered on high-fidelity GLB car models with physical lighting shaders, ambient occlusion, reflections, and 360° orbital camera control.
              </p>

              {/* Feature Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-100 block">Carbon-Fibre Aerodynamics</strong>
                    <span className="text-slate-400 text-[11px]">Ducktail, GT3 wing, and swan-neck spoilers with dynamic angle-of-attack.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-100 block">Forced Induction & Exhaust</strong>
                    <span className="text-slate-400 text-[11px]">Garrett twin-turbochargers, titanium cat-backs, and carbon tips.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-100 block">Carbon-Fibre Hoods & Body Kits</strong>
                    <span className="text-slate-400 text-[11px]">Heat extractor bonnets, track splitters, and ground-effect side skirts.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-100 block">Suspension & Caliper Stance</strong>
                    <span className="text-slate-400 text-[11px]">Inverted track coilovers, ride height drop, and Brembo caliper colors.</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => navigate('/customize')}
                  className="flex items-center gap-2 bg-white hover:bg-slate-200 text-slate-950 font-bold px-6 py-3.5 rounded-xl text-xs tracking-wide transition shadow-md"
                >
                  <span>Launch 3D Configurator</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Showcase Image Banner */}
            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl group">
              <img
                src="/images/corvette_c8.jpg"
                alt="3D Studio Customizer Preview"
                className="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400">Featured Build</span>
                  <h4 className="text-xl font-bold text-white">Corvette C8 Z06 Track Package</h4>
                  <p className="text-xs text-slate-300">Garrett Twin Turbo System + Full Carbon Aero</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-black/80 px-3 py-1 rounded-md border border-emerald-500/30">
                  +140 HP Power Gain
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SUPERVISED ML TELEMETRY DASHBOARD SHOWCASE */}
      <section className="w-[92%] max-w-[1500px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#12151c] border border-white/10 rounded-3xl p-8 sm:p-12">
          {/* Left Visual Data Banner */}
          <div className="lg:col-span-6 bg-[#0a0c10] border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Supervised Model Benchmark</h4>
              </div>
              <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono px-2.5 py-1 rounded font-bold">
                R² = 0.7321
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-slate-400">Trained Model:</span>
                <span className="text-sky-400 font-bold">Gradient Boosting Regressor</span>
              </div>
              <div className="flex justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-slate-400">Mean Absolute Error (MAE):</span>
                <span className="text-amber-400 font-bold">1.0477 seconds</span>
              </div>
              <div className="flex justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-slate-400">Root Mean Squared Error (RMSE):</span>
                <span className="text-indigo-400 font-bold">1.4062 seconds</span>
              </div>
              <div className="flex justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-slate-400">Inference Architecture:</span>
                <span className="text-slate-200">React &rarr; Express /api/predict &rarr; Flask ML</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center justify-center gap-2 border border-white/15 hover:border-white/40 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold py-3 rounded-xl transition"
            >
              <span>View Full Model Evaluation Charts</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Text */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full w-fit">
              <Activity className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                SCIENTIFIC ML INTEGRATION
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
              Empirical ML Telemetry Engine
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              AutoMorph AI pairs custom vehicle modifications with actual trained machine learning inference pipelines. The application separates stock mechanical predictions from aftermarket aero/cosmetic calculations to preserve strict engineering integrity.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 bg-white hover:bg-slate-200 text-slate-950 font-bold px-6 py-3.5 rounded-xl text-xs tracking-wide transition shadow-md"
              >
                <span>Launch Telemetry Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER CALL TO ACTION BANNER */}
      <section className="w-[92%] max-w-[1500px] mx-auto text-center">
        <div className="bg-gradient-to-r from-sky-950/40 via-slate-900 to-indigo-950/40 border border-white/15 rounded-3xl p-10 sm:p-16 flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 px-4 py-1.5 rounded-full">
            START YOUR CUSTOM BUILD
          </span>

          <h2 className="text-3xl sm:text-6xl font-black text-white uppercase tracking-tight max-w-3xl leading-tight">
            Ready to Build Your Dream Supercar?
          </h2>

          <p className="text-xs sm:text-base text-slate-300 max-w-2xl font-light">
            Select from 8 benchmark performance icons, apply custom aerodynamic and powertrain modifications, and save your builds directly to My Garage.
          </p>

          <button
            onClick={() => navigate('/customize')}
            className="flex items-center gap-3 bg-white hover:bg-slate-200 text-slate-950 px-8 py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:scale-105 mt-2"
          >
            <span>Launch 3D Configurator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
