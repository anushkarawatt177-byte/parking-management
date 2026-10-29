import React from 'react';
import { useParking } from '../../context/ParkingContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useParking();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-200 ${
            toast.type === 'success'
              ? 'bg-[#0f291e]/95 border-emerald-500/30 text-emerald-100'
              : toast.type === 'error'
              ? 'bg-[#2a1315]/95 border-rose-500/30 text-rose-100'
              : 'bg-[#1C2541]/95 border-slate-700 text-slate-100'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-cyan-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {toast.title}
            </h4>
            <p className="text-sm mt-0.5 leading-snug text-slate-200 break-words">{toast.message}</p>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="shrink-0 text-slate-400 hover:text-white transition-colors p-1"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
