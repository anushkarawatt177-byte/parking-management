import React, { useState } from 'react';
import { useParking } from '../../context/ParkingContext';
import { X, Lock, Mail, User as UserIcon, Shield, Check, Info } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginAs, showToast } = useParking();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'driver' | 'admin'>('driver');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('error', 'Authentication Error', 'Please fill in both email and password.');
      return;
    }

    loginAs(role);
    onClose();
  };

  const handleQuickDemoLogin = (selectedRole: 'driver' | 'admin') => {
    loginAs(selectedRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#0e162d] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#141e3a]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-white text-base">
              {mode === 'login' ? 'Sign In to SmartParking' : 'Create Demo Account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Notice */}
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-2.5 flex items-center gap-2 text-xs text-emerald-300">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Demo Authentication Mode: Local session active. Ready for Spring Boot JWT.</span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* 1-Click Demo Profiles */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              1-Click Presentation Access:
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('driver')}
                className="p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-left transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Driver Persona</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Alex Morgan (Driver)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="p-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-left transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Persona</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Prof. Sarah Jenkins</div>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800" />
            <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase font-mono">
              Or Custom Sign In
            </span>
            <div className="flex-grow border-t border-slate-800" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {mode === 'register' && (
              <div>
                <label className="text-slate-300 block mb-1 font-semibold uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  className="w-full px-3.5 py-2.5 bg-[#16203D] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            )}

            <div>
              <label className="text-slate-300 block mb-1 font-semibold uppercase">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="driver@example.com"
                className="w-full px-3.5 py-2.5 bg-[#16203D] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold uppercase">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#16203D] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="text-slate-300 block mb-1 font-semibold uppercase">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('driver')}
                  className={`py-2 px-3 rounded-xl border text-center font-semibold transition-colors ${
                    role === 'driver'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                      : 'bg-[#16203D] text-slate-400 border-slate-700'
                  }`}
                >
                  Driver / Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2 px-3 rounded-xl border text-center font-semibold transition-colors ${
                    role === 'admin'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                      : 'bg-[#16203D] text-slate-400 border-slate-700'
                  }`}
                >
                  Administrator
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20 mt-2"
            >
              {mode === 'login' ? 'Sign In to Dashboard' : 'Complete Registration'}
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="text-center text-xs text-slate-400 pt-1">
            {mode === 'login' ? (
              <span>
                Don&rsquo;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  Register here
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  Sign in here
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
