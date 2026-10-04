import React from 'react';
import { useCarContext } from '../context/CarContext';
import CustomizerViewer from '../components/CustomizerViewer';
import OptionPicker from '../components/OptionPicker';
import { Sliders } from 'lucide-react';

const Customizer = () => {
  const { cars, selectedCar, selectCar } = useCarContext();

  if (!selectedCar) return null;

  return (
    <div className="w-[93%] max-w-[1600px] mx-auto py-6 pb-16">
      {/* Top Header & Model Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-[#12151c] p-4 px-6 rounded-xl border border-white/10">
        <div className="flex items-center gap-3">
          <Sliders className="w-5 h-5 text-sky-400" />
          <div>
            <h2 className="text-lg font-bold text-slate-100">{selectedCar.name} Configurator</h2>
            <span className="text-xs text-slate-400">Base MSRP: ${selectedCar.basePrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Quick Model Selector Pills */}
        <div className="flex gap-2 flex-wrap">
          {cars.map(car => (
            <button
              key={car.id}
              onClick={() => selectCar(car)}
              className={`text-xs px-3.5 py-1.5 rounded-md font-medium transition ${
                selectedCar.id === car.id
                  ? 'bg-white text-slate-950 font-semibold shadow-sm'
                  : 'bg-[#151922] text-slate-400 hover:text-slate-200 border border-white/10'
              }`}
            >
              {car.name.split(' ')[0]} {car.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Configurator Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <CustomizerViewer />
        </div>
        <div className="lg:col-span-5">
          <OptionPicker />
        </div>
      </div>
    </div>
  );
};

export default Customizer;
