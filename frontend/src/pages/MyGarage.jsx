import React from 'react';
import { useCarContext } from '../context/CarContext';
import { useNavigate } from 'react-router-dom';
import { Archive, Trash2, Sliders, Calendar, RefreshCw, AlertCircle } from 'lucide-react';

const MyGarage = () => {
  const { savedGarage, isGarageLoading, garageError, deleteGarageBuild, selectCar, setCustomizations, cars } = useCarContext();
  const navigate = useNavigate();

  const handleEditBuild = (build) => {
    const targetCar = cars.find(c => c.id === build.carId || c.carId === build.carId);
    if (targetCar) {
      selectCar(targetCar);
      if (build.customizations) {
        setCustomizations(build.customizations);
      }
      navigate('/customize');
    }
  };

  return (
    <div className="w-[93%] max-w-[1600px] mx-auto py-8 pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Archive className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              PERSONAL SPECIFICATION ARCHIVE
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100">My Garage</h1>
          <p className="text-xs text-slate-400 mt-1">
            Saved custom vehicle builds, selected component configurations, and estimated total pricing tallies (Express + MongoDB).
          </p>
        </div>

        <button
          onClick={() => navigate('/customize')}
          className="flex items-center gap-2 bg-white hover:bg-slate-200 text-slate-950 text-xs font-semibold px-4 py-2.5 rounded-md transition shadow-sm"
        >
          <Sliders className="w-4 h-4" />
          <span>Build New Vehicle</span>
        </button>
      </div>

      {garageError && (
        <div className="mb-6 bg-amber-500/10 border border-amber-500/20 text-amber-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{garageError}</span>
        </div>
      )}

      {isGarageLoading ? (
        <div className="bg-[#12151c] border border-white/10 rounded-2xl p-16 text-center flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
          <span className="text-xs font-medium text-slate-300">Loading saved builds from Express & MongoDB...</span>
        </div>
      ) : savedGarage.length === 0 ? (
        <div className="bg-[#12151c] border border-white/10 rounded-2xl p-16 text-center flex flex-col items-center gap-4">
          <Archive className="w-12 h-12 text-slate-600" />
          <h3 className="text-lg font-bold text-slate-100">Your Garage is Currently Empty</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Customize a BMW M3, Toyota Supra, or Porsche 911 and save your custom build to persist it in MongoDB.
          </p>
          <button
            onClick={() => navigate('/cars')}
            className="bg-white hover:bg-slate-200 text-slate-950 text-xs font-semibold px-5 py-2.5 rounded-md transition mt-2"
          >
            Browse Models
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedGarage.map(build => {
            const buildId = build._id || build.id;
            return (
              <div key={buildId} className="bg-[#12151c] border border-white/10 hover:border-white/30 rounded-2xl overflow-hidden transition flex flex-col">
                <div className="relative w-full h-48 bg-[#0a0c10]">
                  <img src={build.carImage} alt={build.carName} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-[#0a0c10]/85 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] text-slate-400 flex items-center gap-1.5 border border-white/10">
                    <Calendar className="w-3 h-3" />
                    <span>{build.savedAt}</span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1 gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">{build.carName}</h3>
                    <div className="text-base font-extrabold text-sky-400 mt-1">
                      ${build.totalPrice?.toLocaleString()} <span className="text-xs font-normal text-slate-500">Estimated MSRP</span>
                    </div>
                  </div>

                  <div className="bg-[#151922] p-3.5 rounded-xl border border-white/5 flex flex-col gap-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Paint Finish:</span>
                      <span className="text-slate-100 font-medium truncate max-w-[140px]">{build.customizations?.paint?.name || 'Standard'}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Wheels:</span>
                      <span className="text-slate-100 font-medium truncate max-w-[140px]">{build.customizations?.wheels?.name || 'Factory Alloys'}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Spoiler:</span>
                      <span className="text-slate-100 font-medium truncate max-w-[140px]">{build.customizations?.spoiler?.name || 'Factory Lip'}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Aero Package:</span>
                      <span className="text-slate-100 font-medium truncate max-w-[140px]">
                        {build.customizations?.bodyKit?.name || build.customizations?.frontSplitter?.name || 'Standard Aero'}
                      </span>
                    </div>
                    {build.customizations?.caliper && (
                      <div className="flex justify-between text-slate-400">
                        <span>Brakes:</span>
                        <span className="text-slate-100 font-medium truncate max-w-[140px]">{build.customizations?.caliper?.name}</span>
                      </div>
                    )}
                    {build.customizations?.suspension && build.customizations.suspension.id !== 'susp_stock' && (
                      <div className="flex justify-between text-slate-400">
                        <span>Stance:</span>
                        <span className="text-amber-400 font-medium truncate max-w-[140px]">{build.customizations?.suspension?.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => handleEditBuild(build)}
                      className="flex-1 flex items-center justify-center gap-2 border border-white/10 hover:border-white/30 text-slate-200 text-xs font-medium py-2 rounded-md transition"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Re-configure</span>
                    </button>
                    <button
                      onClick={() => deleteGarageBuild(buildId)}
                      className="border border-red-500/30 hover:border-red-500/60 text-red-400 hover:text-red-300 p-2 rounded-md transition"
                      title="Remove from Garage"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyGarage;
