import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#0a0c10] py-8 text-xs text-slate-400">
      <div className="w-[93%] max-w-[1600px] mx-auto flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <span className="font-semibold text-slate-200 tracking-wider">
            AUTOMORPH AI CONFIGURATOR & ENGINEERING TELEMETRY
          </span>
          <span className="text-slate-500">
            Supervised Machine Learning Performance Simulator
          </span>
        </div>
        <p className="text-slate-500 leading-relaxed max-w-5xl">
          Disclaimer: Parts prices represent estimated retail component MSRPs. Baseline acceleration predictions are generated using supervised machine learning models (Gradient Boosting, R² = 0.7321) trained on genuine automotive specification datasets. Customization choices represent aesthetic and pricing options and do not fabricate non-empirical performance gains.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
