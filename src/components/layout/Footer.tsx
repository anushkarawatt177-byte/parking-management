import React from 'react';
import { useParking } from '../../context/ParkingContext';
import { ShieldCheck, GraduationCap, MapPin, Mail, Phone, RotateCcw } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, resetToDefaults } = useParking();

  return (
    <footer className="w-full bg-[#070d1e] border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm">
                P
              </div>
              <span className="text-white font-bold tracking-tight text-base">
                Smart<span className="text-emerald-400">Parking</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Smart Parking. Faster Decisions. Better Mobility. An intelligent parking management system providing real-time bay occupancy, instant booking, and contactless QR access.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>College Project & Faculty Review Prototype</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('find')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Find Parking & Live Bay Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('booking')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Reserve a Parking Slot
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  User Dashboard & QR Passes
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('admin')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Admin Management Console
                </button>
              </li>
            </ul>
          </div>

          {/* Faculty / Academic Review Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Academic Blueprint</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p>Project: <strong>Smart Parking Management System</strong></p>
              <p>Tech Stack: React 19, TypeScript, Tailwind CSS, Spring Boot 3 & MySQL Architecture</p>
              <button
                onClick={() => setActiveTab('about')}
                className="text-cyan-400 hover:text-cyan-300 underline font-medium block pt-1"
              >
                View Spring Boot & MySQL DDL &rarr;
              </button>
            </div>
          </div>

          {/* Contact & Demo Controls */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Contact & Demo Tools</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Department of Computer Science & Engineering</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>smartparking.project@university.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>+1 (800) 555-PARK (7275)</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={resetToDefaults}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-colors"
                title="Reset mock data to initial college demo seed"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Demo Database</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Smart Parking Management System. Developed for Academic Evaluation & Real-World Urban Mobility.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('about')} className="hover:text-slate-300 transition-colors">
              Documentation
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={() => setActiveTab('about')} className="hover:text-slate-300 transition-colors">
              Spring Boot Architecture
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
