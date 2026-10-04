import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarContext } from '../context/CarContext';
import { ChevronRight } from 'lucide-react';

const CarCard = ({ car }) => {
  const { selectCar } = useCarContext();
  const navigate = useNavigate();

  const handleSelect = () => {
    selectCar(car);
    navigate('/customize');
  };

  return (
    <div className="bg-[#151922] border border-white/10 hover:border-white/30 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="relative w-full h-52 bg-[#0f1117] overflow-hidden">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-[#0a0c10]/85 backdrop-blur-sm px-3 py-1 rounded text-xs font-semibold text-slate-200 border border-white/10">
          From ${car.basePrice.toLocaleString()}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            {car.manufacturer}
          </span>
          <h3 className="text-xl font-semibold text-slate-100 mt-0.5">{car.name}</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{car.tagline}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-auto">
          <div className="bg-white/5 border border-white/10 rounded-md p-2.5 flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">Power</span>
            <span className="text-sm font-bold text-slate-100 mt-0.5">{car.specs.horsepower} HP</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-md p-2.5 flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">0-60 MPH</span>
            <span className="text-sm font-bold text-slate-100 mt-0.5">{car.specs.stockAcceleration060}s</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-md p-2.5 flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">Weight</span>
            <span className="text-sm font-bold text-slate-100 mt-0.5">{car.specs.weightLbs} lbs</span>
          </div>
        </div>

        <button
          onClick={handleSelect}
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-200 text-slate-950 text-xs font-semibold py-2.5 rounded-md transition shadow-sm mt-1"
        >
          <span>Configure & Customize</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CarCard;
