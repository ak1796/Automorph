import React, { useState } from 'react';
import { useCarContext } from '../context/CarContext';
import { CUSTOMIZATION_OPTIONS } from '../data/carsData';
import {
  Check,
  BookmarkPlus,
  ArrowRight,
  Info,
  RefreshCw,
  CheckCircle2,
  RotateCcw,
  Palette,
  Disc,
  Flag,
  Sparkles,
  Layers,
  Shield,
  Gauge,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TABS = [
  { id: 'paint', label: 'Exterior Paint', icon: Palette },
  { id: 'wheels', label: 'Wheels & Rims', icon: Disc },
  { id: 'spoiler', label: 'Rear Spoiler', icon: Flag },
  { id: 'aero', label: 'Aero Splitter & Skirts', icon: Sparkles },
  { id: 'hood_diffuser', label: 'Carbon Hood & Diffuser', icon: Layers },
  { id: 'turbo', label: 'Turbocharger System', icon: Zap },
  { id: 'brakes_livery', label: 'Brakes & Livery', icon: Shield },
  { id: 'stance', label: 'Suspension / Stance', icon: Gauge },
];

const OptionPicker = () => {
  const {
    selectedCar,
    customizations,
    updateCustomization,
    resetCustomizations,
    calculateTotalPrice,
    saveCurrentBuild
  } = useCarContext();

  const [activeTab, setActiveTab] = useState('paint');
  const [isSaving, setIsSaving] = useState(false);
  const [saveNotification, setSaveNotification] = useState(null);
  const navigate = useNavigate();

  if (!selectedCar) return null;

  const handleSaveBuild = async () => {
    setIsSaving(true);
    setSaveNotification(null);
    try {
      const result = await saveCurrentBuild();
      if (result?.success) {
        setSaveNotification({
          type: 'success',
          text: result.fallback
            ? '✓ Build saved to My Garage (Local Mode)'
            : '✓ Build saved to MongoDB & My Garage!'
        });
      } else {
        setSaveNotification({ type: 'error', text: 'Error saving build to database.' });
      }
    } catch (e) {
      setSaveNotification({ type: 'error', text: 'Connection error while saving build.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveNotification(null), 3500);
    }
  };

  const totalPrice = calculateTotalPrice();
  const partsCostTotal = totalPrice - selectedCar.basePrice;

  return (
    <div className="bg-[#12151c] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col gap-5 shadow-2xl">
      {/* Studio Header & Reset Action */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
            Automotive Configurator Studio
          </span>
          <h3 className="text-base font-bold text-slate-100 mt-0.5">Component Selection</h3>
        </div>
        <button
          onClick={resetCustomizations}
          title="Reset to Factory OEM Specification"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-[#151922] border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-lg transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset OEM</span>
        </button>
      </div>

      {/* Category Navigation Scrollable Tabs */}
      <div className="flex border-b border-white/10 gap-2 pb-3 overflow-x-auto scrollbar-none">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'bg-[#151922] text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Exterior Paint Finishes */}
      {activeTab === 'paint' && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Active Finish:</span>
            <span className="font-semibold text-slate-100">
              {customizations?.paint?.name} ({customizations?.paint?.price === 0 ? 'Standard' : `+$${customizations?.paint?.price}`})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {CUSTOMIZATION_OPTIONS.paints.map(paint => {
              const isSelected = customizations?.paint?.id === paint.id;
              return (
                <div
                  key={paint.id}
                  onClick={() => updateCustomization('paint', paint)}
                  className={`bg-[#151922] p-3 rounded-xl cursor-pointer flex flex-col items-center text-center gap-2 transition-all ${
                    isSelected
                      ? 'border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.15)] bg-white/5'
                      : 'border border-white/10 hover:border-white/30'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full border border-white/30 shadow-md relative flex items-center justify-center transition-transform hover:scale-105"
                    style={{ backgroundColor: paint.hex }}
                  >
                    {isSelected && <Check className="w-5 h-5 text-white drop-shadow-md" />}
                  </div>
                  <div className="flex flex-col min-w-0 w-full">
                    <span className="text-xs font-semibold text-slate-100 truncate">
                      {paint.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {paint.finish}
                    </span>
                    <span className="text-[11px] font-bold text-sky-400 mt-1 font-mono">
                      {paint.price === 0 ? 'Standard' : `+$${paint.price}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Wheels & Rim Finishes */}
      {activeTab === 'wheels' && (
        <div className="flex flex-col gap-3">
          <div className="text-xs text-slate-400">
            Selected Wheels: <strong className="text-slate-100">{customizations?.wheels?.name}</strong>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CUSTOMIZATION_OPTIONS.wheels.map(wheel => {
              const isSelected = customizations?.wheels?.id === wheel.id;
              return (
                <div
                  key={wheel.id}
                  onClick={() => updateCustomization('wheels', wheel)}
                  className={`bg-[#151922] p-3.5 rounded-xl cursor-pointer flex justify-between items-center transition-all ${
                    isSelected
                      ? 'border-2 border-white bg-white/5 shadow-md'
                      : 'border border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: wheel.color }}
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-100">{wheel.name}</h4>
                      <span className="text-[11px] text-slate-400">Finish: {wheel.finish}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-bold font-mono ${isSelected ? 'text-white' : 'text-sky-400'}`}>
                    {wheel.price === 0 ? 'Standard' : `+$${wheel.price}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Spoilers & Rear Wings */}
      {activeTab === 'spoiler' && (
        <div className="flex flex-col gap-3">
          <div className="text-xs text-slate-400">
            Aerodynamic Profile: <strong className="text-slate-100">{customizations?.spoiler?.name}</strong>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CUSTOMIZATION_OPTIONS.spoilers.map(spoiler => {
              const isSelected = customizations?.spoiler?.id === spoiler.id;
              return (
                <div
                  key={spoiler.id}
                  onClick={() => updateCustomization('spoiler', spoiler)}
                  className={`bg-[#151922] p-4 rounded-xl cursor-pointer flex flex-col justify-between gap-2 transition-all ${
                    isSelected
                      ? 'border-2 border-white bg-white/5 shadow-md'
                      : 'border border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-slate-100">{spoiler.name}</h4>
                    <span className={`text-xs font-bold font-mono ${isSelected ? 'text-white' : 'text-sky-400'}`}>
                      {spoiler.price === 0 ? 'Standard' : `+$${spoiler.price}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{spoiler.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Front Splitters & Side Skirts Aero */}
      {activeTab === 'aero' && (
        <div className="flex flex-col gap-5">
          {/* Front Splitters */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Front Splitter Options</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {CUSTOMIZATION_OPTIONS.frontSplitters.map(splitter => {
                const isSelected = customizations?.frontSplitter?.id === splitter.id;
                return (
                  <div
                    key={splitter.id}
                    onClick={() => updateCustomization('frontSplitter', splitter)}
                    className={`bg-[#151922] p-3 rounded-xl cursor-pointer flex flex-col justify-between gap-1 transition-all ${
                      isSelected
                        ? 'border-2 border-white bg-white/5'
                        : 'border border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className="text-xs font-semibold text-slate-100">{splitter.name}</span>
                    <span className="text-[11px] font-bold text-sky-400 font-mono">
                      {splitter.price === 0 ? 'Standard' : `+$${splitter.price}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side Skirts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Side Skirt Extensions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {CUSTOMIZATION_OPTIONS.sideSkirts.map(skirt => {
                const isSelected = customizations?.sideSkirts?.id === skirt.id;
                return (
                  <div
                    key={skirt.id}
                    onClick={() => updateCustomization('sideSkirts', skirt)}
                    className={`bg-[#151922] p-3 rounded-xl cursor-pointer flex flex-col justify-between gap-1 transition-all ${
                      isSelected
                        ? 'border-2 border-white bg-white/5'
                        : 'border border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className="text-xs font-semibold text-slate-100">{skirt.name}</span>
                    <span className="text-[11px] font-bold text-sky-400 font-mono">
                      {skirt.price === 0 ? 'Standard' : `+$${skirt.price}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Carbon Hood Styles & Rear Diffuser */}
      {activeTab === 'hood_diffuser' && (
        <div className="flex flex-col gap-5">
          {/* Hood Styles */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Bonnet / Carbon-Fibre Hood Style</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CUSTOMIZATION_OPTIONS.hoods.map(hood => {
                const isSelected = customizations?.hood?.id === hood.id;
                return (
                  <div
                    key={hood.id}
                    onClick={() => updateCustomization('hood', hood)}
                    className={`bg-[#151922] p-4 rounded-xl cursor-pointer flex flex-col justify-between gap-2 transition-all ${
                      isSelected
                        ? 'border-2 border-white bg-white/5 shadow-md'
                        : 'border border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h5 className="text-xs font-bold text-slate-100">{hood.name}</h5>
                      <span className={`text-xs font-bold font-mono ${isSelected ? 'text-white' : 'text-sky-400'}`}>
                        {hood.price === 0 ? 'Standard' : `+$${hood.price}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="bg-white/10 px-2 py-0.5 rounded text-slate-300 font-medium">
                        {hood.finish || 'Carbon'}
                      </span>
                      {hood.weightDeltaLbs && (
                        <span className="text-emerald-400 font-mono font-semibold">
                          {hood.weightDeltaLbs} lbs Weight Reduction
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rear Diffusers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Rear Diffusers & Venturi Fins</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {CUSTOMIZATION_OPTIONS.rearDiffusers.map(diffuser => {
                const isSelected = customizations?.rearDiffuser?.id === diffuser.id;
                return (
                  <div
                    key={diffuser.id}
                    onClick={() => updateCustomization('rearDiffuser', diffuser)}
                    className={`bg-[#151922] p-3 rounded-xl cursor-pointer flex flex-col justify-between gap-1 transition-all ${
                      isSelected
                        ? 'border-2 border-white bg-white/5'
                        : 'border border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className="text-xs font-semibold text-slate-100">{diffuser.name}</span>
                    <span className="text-[11px] font-bold text-sky-400 font-mono">
                      {diffuser.price === 0 ? 'Standard' : `+$${diffuser.price}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Turbocharger System Upgrade */}
      {activeTab === 'turbo' && (
        <div className="flex flex-col gap-3">
          <div className="text-xs text-slate-400">
            Forced Induction System: <strong className="text-slate-100">{customizations?.turbocharger?.name || 'OEM Turbo'}</strong>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CUSTOMIZATION_OPTIONS.turbochargers?.map(turbo => {
              const isSelected = customizations?.turbocharger?.id === turbo.id;
              return (
                <div
                  key={turbo.id}
                  onClick={() => updateCustomization('turbocharger', turbo)}
                  className={`bg-[#151922] p-4 rounded-xl cursor-pointer flex flex-col justify-between gap-2.5 transition-all ${
                    isSelected
                      ? 'border-2 border-white bg-white/5 shadow-md'
                      : 'border border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h5 className="text-xs font-bold text-slate-100">{turbo.name}</h5>
                    <span className={`text-xs font-bold font-mono ${isSelected ? 'text-white' : 'text-sky-400'}`}>
                      {turbo.price === 0 ? 'Standard' : `+$${turbo.price.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-[11px] font-mono">
                    <span className="text-emerald-400 font-bold">
                      {turbo.hpGain === 0 ? 'Stock HP Output' : `+${turbo.hpGain} HP Power Gain`}
                    </span>
                    <span className="text-slate-400">
                      Boost Pressure: {turbo.boostPsi} PSI ({turbo.lag})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 6: Brake Calipers & Racing Liveries */}
      {activeTab === 'brakes_livery' && (
        <div className="flex flex-col gap-5">
          {/* Calipers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Performance Brake Calipers</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CUSTOMIZATION_OPTIONS.calipers.map(caliper => {
                const isSelected = customizations?.caliper?.id === caliper.id;
                return (
                  <div
                    key={caliper.id}
                    onClick={() => updateCustomization('caliper', caliper)}
                    className={`bg-[#151922] p-3 rounded-xl cursor-pointer flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'border-2 border-white bg-white/5'
                        : 'border border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full border border-white/30 shrink-0"
                      style={{ backgroundColor: caliper.hex }}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold text-slate-100 block truncate">{caliper.name}</span>
                      <span className="text-[11px] font-bold text-sky-400 font-mono">
                        {caliper.price === 0 ? 'Included' : `+$${caliper.price}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Liveries */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Racing Decals & Liveries</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CUSTOMIZATION_OPTIONS.liveries.map(livery => {
                const isSelected = customizations?.livery?.id === livery.id;
                return (
                  <div
                    key={livery.id}
                    onClick={() => updateCustomization('livery', livery)}
                    className={`bg-[#151922] p-3.5 rounded-xl cursor-pointer flex justify-between items-center transition-all ${
                      isSelected
                        ? 'border-2 border-white bg-white/5'
                        : 'border border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className="text-xs font-semibold text-slate-100">{livery.name}</span>
                    <span className="text-[11px] font-bold text-sky-400 font-mono">
                      {livery.price === 0 ? 'Standard' : `+$${livery.price}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Suspension & Ride Height */}
      {activeTab === 'stance' && (
        <div className="flex flex-col gap-4">
          <div className="text-xs text-slate-400">
            Ride Height Calibration: <strong className="text-slate-100">{customizations?.suspension?.name}</strong>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CUSTOMIZATION_OPTIONS.suspension.map(susp => {
              const isSelected = customizations?.suspension?.id === susp.id;
              return (
                <div
                  key={susp.id}
                  onClick={() => updateCustomization('suspension', susp)}
                  className={`bg-[#151922] p-4 rounded-xl cursor-pointer flex flex-col justify-between gap-2 transition-all ${
                    isSelected
                      ? 'border-2 border-white bg-white/5 shadow-md'
                      : 'border border-white/10 hover:border-white/30'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-100">{susp.name}</span>
                  <span className="text-[11px] font-bold text-sky-400 font-mono">
                    {susp.price === 0 ? 'Standard Stance' : `+$${susp.price}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Summary Breakdown */}
      <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Base Vehicle MSRP ({selectedCar.name.split(' ')[0]})</span>
          <span className="font-mono">${selectedCar.basePrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span>Total Selected Modifications</span>
          <span className="font-mono text-amber-400">+${partsCostTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-base font-extrabold text-slate-100 mt-1 pt-2 border-t border-dashed border-white/15">
          <span>Total Estimated Build Valuation</span>
          <span className="font-mono text-emerald-400">${totalPrice.toLocaleString()}</span>
        </div>
        <span className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
          <Info className="w-3 h-3 text-slate-400" />
          Components and modifications update live in the 3D viewport and sync directly with My Garage & Dashboard.
        </span>
      </div>

      {/* Notification Toast */}
      {saveNotification && (
        <div
          className={`p-3 rounded-xl text-xs text-center font-medium flex items-center justify-center gap-2 ${
            saveNotification.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500 text-emerald-300'
              : 'bg-red-500/15 border border-red-500 text-red-300'
          }`}
        >
          {saveNotification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{saveNotification.text}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSaveBuild}
          disabled={isSaving}
          className="flex-1 flex items-center justify-center gap-2 border border-white/15 hover:border-white/40 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold py-3 rounded-xl transition disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin text-sky-400" /> : <BookmarkPlus className="w-4 h-4" />}
          <span>{isSaving ? 'Saving Build...' : 'Save to Garage'}</span>
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex-[1.2] flex items-center justify-center gap-2 bg-white hover:bg-slate-200 text-slate-950 text-xs font-bold py-3 rounded-xl transition shadow-md"
        >
          <span>ML Telemetry Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default OptionPicker;
