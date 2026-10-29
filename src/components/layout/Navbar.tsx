import React, { useState } from 'react';
import { useParking } from '../../context/ParkingContext';
import { Menu, X, Shield, User as UserIcon, Play, Pause, ChevronDown, Check } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    loginAs,
    simulationActive,
    setSimulationActive,
    showToast,
  } = useParking();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'find', label: 'Find Parking' },
    { id: 'booking', label: 'Book Slot' },
    { id: 'dashboard', label: 'My Bookings' },
    { id: 'admin', label: 'Admin Console' },
    { id: 'about', label: 'About & Blueprint' },
  ] as const;

  const handleTabClick = (tabId: typeof navItems[number]['id']) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B132B]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single clean element) */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-extrabold text-base shadow-sm">
            P
          </div>
          <span className="tracking-tight text-base sm:text-lg">
            Smart<span className="text-emerald-400">Parking</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links (Clean typography, whitespace-nowrap) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                  isActive
                    ? 'text-emerald-400 border-emerald-400 font-semibold'
                    : 'text-slate-300 hover:text-white border-transparent'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action Area (Simulation + Role Profile) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Live Bay Simulation Mode Toggle */}
          <button
            onClick={() => {
              const next = !simulationActive;
              setSimulationActive(next);
              showToast(
                'info',
                next ? 'Live Bay Telemetry Active' : 'Simulation Paused',
                next
                  ? 'Simulating random vehicle entries and departures across facilities.'
                  : 'Sensor simulation stopped.'
              );
            }}
            title="Toggle live vehicle arrival/departure telemetry for presentation"
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border whitespace-nowrap shrink-0 ${
              simulationActive
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            {simulationActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{simulationActive ? 'Live Telemetry' : 'Demo Sensor'}</span>
          </button>

          {/* User Profile / Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1C2541] hover:bg-[#233152] border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap shrink-0"
              aria-label="User profile and demo roles"
            >
              {currentUser.role === 'admin' ? (
                <Shield className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span className="hidden md:inline max-w-[110px] truncate">{currentUser.name.split(' ')[0]}</span>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                ({currentUser.role})
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#141d38] border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-left animate-in fade-in duration-150">
                <div className="px-3 py-2 border-b border-slate-700/80 mb-1">
                  <div className="text-xs font-semibold text-white">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                  <div className="text-[10px] text-emerald-400 mt-1 uppercase tracking-wider font-mono">
                    Role: {currentUser.role.toUpperCase()}
                  </div>
                </div>

                <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                  Switch Demo Persona:
                </div>

                <button
                  onClick={() => {
                    loginAs('driver');
                    setProfileDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                    currentUser.role === 'driver'
                      ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-emerald-400" />
                    <div className="text-left">
                      <div>Driver (Alex Morgan)</div>
                      <div className="text-[10px] text-slate-400">Bookings, QR Pass & Vehicles</div>
                    </div>
                  </div>
                  {currentUser.role === 'driver' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>

                <button
                  onClick={() => {
                    loginAs('admin');
                    setActiveTab('admin');
                    setProfileDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors mt-1 ${
                    currentUser.role === 'admin'
                      ? 'bg-amber-500/20 text-amber-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <div className="text-left">
                      <div>System Admin (Prof. Jenkins)</div>
                      <div className="text-[10px] text-slate-400">Manage Bays, Rates & Telemetry</div>
                    </div>
                  </div>
                  {currentUser.role === 'admin' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e162d] border-b border-slate-800 px-4 pt-2 pb-4 space-y-1 animate-in fade-in duration-150">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-emerald-500/15 text-emerald-400 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between px-3 text-xs text-slate-400">
            <span>Real-time Simulation</span>
            <button
              onClick={() => setSimulationActive(!simulationActive)}
              className={`px-3 py-1 rounded text-xs font-semibold ${
                simulationActive ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {simulationActive ? 'Running' : 'Paused'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
