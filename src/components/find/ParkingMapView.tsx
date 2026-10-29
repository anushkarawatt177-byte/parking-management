import React from 'react';
import { ParkingFacility } from '../../types';
import { MapPin, Navigation, Zap, Shield, ArrowRight } from 'lucide-react';

interface ParkingMapViewProps {
  facilities: ParkingFacility[];
  selectedFacility: ParkingFacility;
  onSelectFacility: (facility: ParkingFacility) => void;
  onOpenSlotLayout: (facility: ParkingFacility) => void;
}

export const ParkingMapView: React.FC<ParkingMapViewProps> = ({
  facilities,
  selectedFacility,
  onSelectFacility,
  onOpenSlotLayout,
}) => {
  return (
    <div className="relative w-full h-[450px] lg:h-[520px] rounded-2xl overflow-hidden border border-slate-800 bg-[#070e22] shadow-xl">
      {/* SVG Stylized Metro Map Background */}
      <svg
        className="w-full h-full object-cover opacity-60"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#16203D" strokeWidth="0.8" />
          </pattern>
        </defs>

        {/* Base Grid */}
        <rect width="1000" height="600" fill="#070e22" />
        <rect width="1000" height="600" fill="url(#grid)" />

        {/* Coastal Waterfront Curve */}
        <path
          d="M 0,480 Q 300,520 600,430 T 1000,510 L 1000,600 L 0,600 Z"
          fill="#0a1738"
          stroke="#162955"
          strokeWidth="2"
        />

        {/* Major Arterial Avenues */}
        <line x1="0" y1="200" x2="1000" y2="200" stroke="#1c2c54" strokeWidth="12" />
        <line x1="0" y1="200" x2="1000" y2="200" stroke="#00f0a0" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.4" />

        <line x1="0" y1="360" x2="1000" y2="360" stroke="#1c2c54" strokeWidth="10" />
        <line x1="380" y1="0" x2="380" y2="600" stroke="#1c2c54" strokeWidth="14" />
        <line x1="380" y1="0" x2="380" y2="600" stroke="#00f0a0" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.4" />

        <line x1="720" y1="0" x2="720" y2="600" stroke="#1c2c54" strokeWidth="10" />

        {/* Diagonal Highway Expressway */}
        <line x1="100" y1="0" x2="900" y2="600" stroke="#223766" strokeWidth="16" />
        <line x1="100" y1="0" x2="900" y2="600" stroke="#38bdf8" strokeWidth="2" strokeDasharray="10 8" opacity="0.5" />

        {/* District Zones */}
        <text x="395" y="185" fill="#475569" fontSize="12" fontFamily="monospace" fontWeight="bold">COMMERCIAL PLAZA DISTRICT</text>
        <text x="735" y="185" fill="#475569" fontSize="12" fontFamily="monospace" fontWeight="bold">TECH CITY INNOVATION ZONE</text>
        <text x="120" y="345" fill="#475569" fontSize="12" fontFamily="monospace" fontWeight="bold">METRO GRAND TRANSIT CORRIDOR</text>
        <text x="640" y="550" fill="#334155" fontSize="12" fontFamily="monospace" fontWeight="bold">HARBOR PROMENADE</text>
      </svg>

      {/* Floating Map Controls & Title */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B132B]/90 border border-slate-700/80 backdrop-blur-md text-xs font-semibold text-slate-200">
        <Navigation className="w-3.5 h-3.5 text-emerald-400" />
        <span>Live Interactive Parking Map</span>
        <span className="text-[11px] text-slate-400 font-mono">({facilities.length} Locations Active)</span>
      </div>

      {/* Map Markers for Facilities */}
      {facilities.map((fac, idx) => {
        // Deterministic placement on the 1000x600 coordinate grid
        const positions = [
          { top: '32%', left: '38%' },
          { top: '30%', left: '72%' },
          { top: '60%', left: '22%' },
          { top: '78%', left: '68%' },
        ];
        const pos = positions[idx % positions.length];
        const isSelected = selectedFacility.id === fac.id;
        const availablePct = Math.round((fac.availableSpaces / fac.totalSpaces) * 100);

        return (
          <div
            key={fac.id}
            style={{ top: pos.top, left: pos.left }}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
          >
            <button
              onClick={() => onSelectFacility(fac)}
              className={`group relative flex flex-col items-center transition-transform duration-200 ${
                isSelected ? 'scale-110 z-30' : 'hover:scale-105'
              }`}
            >
              {/* Floating Price Tag */}
              <div
                className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold tracking-tight shadow-md border whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-emerald-400 text-slate-950 border-emerald-300 ring-2 ring-emerald-400/50'
                    : 'bg-[#1C2541] text-slate-200 border-slate-700 group-hover:border-slate-500'
                }`}
              >
                ${fac.hourlyRate.toFixed(2)}/hr · {fac.availableSpaces} open
              </div>

              {/* Pin Icon */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-xl border-2 transition-all mt-1 ${
                  isSelected
                    ? 'bg-emerald-500 border-white text-slate-950'
                    : fac.availableSpaces > 5
                    ? 'bg-[#16203D] border-emerald-400 text-emerald-400 group-hover:bg-emerald-950'
                    : 'bg-[#16203D] border-rose-500 text-rose-400'
                }`}
              >
                <MapPin className="w-5 h-5 fill-current" />
              </div>

              {/* Ping Ring for Selected */}
              {isSelected && (
                <div className="absolute inset-0 top-6 w-9 h-9 mx-auto rounded-full bg-emerald-400/40 animate-ping pointer-events-none" />
              )}
            </button>
          </div>
        );
      })}

      {/* Selected Facility Overlay Bottom Card */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="max-w-xl mx-auto p-4 rounded-xl bg-[#0e172e]/95 border border-slate-700/90 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-white text-sm">{selectedFacility.name}</h4>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                {selectedFacility.distanceKm} km away
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1">{selectedFacility.address}</p>
            <div className="flex items-center gap-3 text-xs text-slate-300 pt-1">
              <span className="font-semibold text-emerald-400">
                {selectedFacility.availableSpaces} of {selectedFacility.totalSpaces} bays open
              </span>
              <span aria-hidden="true">·</span>
              <span>${selectedFacility.hourlyRate.toFixed(2)}/hr</span>
              {selectedFacility.hasEVCharging && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Zap className="w-3 h-3" /> EV
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={() => onOpenSlotLayout(selectedFacility)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
            >
              <span>View Bay Grid</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
