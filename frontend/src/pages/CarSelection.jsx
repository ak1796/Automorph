import React from 'react';
import { useCarContext } from '../context/CarContext';
import CarCard from '../components/CarCard';

const CarSelection = () => {
  const { cars } = useCarContext();

  return (
    <div className="w-[93%] max-w-[1600px] mx-auto py-8 pb-16">
      <div className="text-center mb-10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">
          AUTOMORPH AI VEHICLE CATALOGUE
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-3">
          Select Your Performance Model
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl mx-auto">
          Choose a benchmark model to launch the 3D configurator studio, explore factory engineering specifications, and run supervised ML acceleration inference.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cars.map(car => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
};

export default CarSelection;
