import React, { useState } from 'react';
import { useCarContext } from '../context/CarContext';
import { X, UserCheck, RefreshCw, AlertCircle } from 'lucide-react';

const AuthModal = ({ onClose }) => {
  const { loginUser, registerUser } = useCarContext();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      let result;
      if (isLogin) {
        result = await loginUser(email, password);
      } else {
        if (!name) {
          setIsLoading(false);
          setErrorMsg('Please enter your full name.');
          return;
        }
        result = await registerUser(name, email, password);
      }

      if (result && result.success) {
        onClose();
      } else {
        setErrorMsg(result?.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0a0c10]/85 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
      <div className="bg-[#12151c] border border-white/12 rounded-2xl w-full max-w-md p-8 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-slate-100">
            {isLogin ? 'Sign In to AutoMorph' : 'Create Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Save custom vehicle builds to My Garage and access ML engineering benchmarks.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="text-xs text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Alexander Richter"
                required={!isLogin}
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
              minLength={6}
              className="w-full bg-[#151922] border border-white/10 rounded-md px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-white/30 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-200 text-slate-950 text-xs font-semibold py-3 rounded-md transition shadow-sm mt-2 disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
            <span>{isLoading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}</span>
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-400">
          {isLogin ? "Don't have an account? " : 'Already registered? '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg(null);
            }}
            className="text-white font-semibold underline hover:text-slate-200 transition"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
