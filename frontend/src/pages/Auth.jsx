import React, { useState } from 'react';
import { useCarContext } from '../context/CarContext';
import { useNavigate } from 'react-router-dom';
import { UserCheck } from 'lucide-react';

const Auth = () => {
  const { loginUser } = useCarContext();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    loginUser(email, name || 'Automotive Enthusiast');
    navigate('/garage');
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4 py-16">
      <div className="bg-[#12151c] border border-white/12 rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            AUTOMORPH AI ACCESS
          </span>
          <h1 className="text-2xl font-bold text-slate-100 mt-1">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access personal garage builds and ML engineering telemetry.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="text-xs text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Alexander Richter"
                required
                className="w-full bg-[#151922] border border-white/10 rounded-md px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-white/30 transition"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-slate-400 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="driver@automorph.ai"
              required
              className="w-full bg-[#151922] border border-white/10 rounded-md px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-white/30 transition"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full bg-[#151922] border border-white/10 rounded-md px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-white/30 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-200 text-slate-950 text-xs font-semibold py-3 rounded-md transition shadow-sm mt-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          {isLogin ? "Don't have an account? " : 'Already registered? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-white font-semibold underline hover:text-slate-200 transition"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
