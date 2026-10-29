import React, { useState } from 'react';
import { ParkingFacility, ParkingSlot } from '../../types';
import { useParking } from '../../context/ParkingContext';
import { X, Zap, Accessibility, Check, ShieldAlert, Car, ArrowRight } from 'lucide-react';

interface SlotLayoutModalProps {
  facility: ParkingFacility;
  onClose: () => void;
  onSlotSelected?: (slot: ParkingSlot) => void;
}

export const SlotLayoutModal: React.FC<SlotLayoutModalProps> = ({ facility, onClose, onSlotSelected }) => {
  const { slots, startBookingForSlot, updateSlotStatus, currentUser } = useParking();
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [highlightedSlot, setHighlightedSlot] = useState<ParkingSlot | null>(null);

  // Filter slots for this facility and selected floor
  const facilitySlots = slots.filter((s) => s.facilityId === facility.id);
  const floorSlots = facilitySlots.filter((s) => s.floor === selectedFloor);

  const availableCount = floorSlots.filter((s) => s.status === 'available').length;
  const occupiedCount = floorSlots.filter((s) => s.status === 'occupied').length;
  const reservedCount = floorSlots.filter((s) => s.status === 'reserved').length;

  const handleSelectAndProceed = (slot: ParkingSlot) => {
    if (slot.status !== 'available') return;
    if (onSlotSelected) {
      onSlotSelected(slot);
    } else {
      startBookingForSlot(facility.id, slot);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0d152c] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#141e3a]">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-white text-base sm:text-lg">{facility.name}</h3>
              <span className="text-xs text-slate-400 font-mono">Floor Level Layout</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{facility.address} · ${facility.hourlyRate.toFixed(2)}/hr</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close slot layout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Floor Selection & Status Legend Toolbar */}
        <div className="px-6 py-3 border-b border-slate-800 bg-[#101932] flex flex-wrap items-center justify-between gap-4">
          {/* Floor tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-lg border border-slate-800">
            {Array.from({ length: facility.floorsCount }, (_, i) => i + 1).map((floorNum) => (
              <button
                key={floorNum}
                onClick={() => {
                  setSelectedFloor(floorNum);
                  setHighlightedSlot(null);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  selectedFloor === floorNum
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Level {floorNum}
              </button>
            ))}
          </div>

          {/* Color Status Legend */}
          <div className="flex items-center gap-5 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 shadow-sm shadow-emerald-500/30" />
              <span>Available ({availableCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-rose-500 shadow-sm shadow-rose-500/30" />
              <span>Occupied ({occupiedCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-amber-400 shadow-sm shadow-amber-400/30" />
              <span>Reserved ({reservedCount})</span>
            </div>
          </div>
        </div>

        {/* Interactive Parking Layout Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-[#090f20] border border-slate-800/90 rounded-2xl p-5 shadow-inner">
            {/* Driving lane indicator */}
            <div className="text-center py-1.5 mb-5 border-y border-dashed border-slate-700/70 text-[11px] font-mono tracking-widest text-slate-500 uppercase">
              ↑ ENTRY & DRIVING LANE (ONE WAY) ↓
            </div>

            {/* Slots Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
              {floorSlots.map((slot) => {
                const isSelected = highlightedSlot?.id === slot.id;
                const isAvailable = slot.status === 'available';
                const isOccupied = slot.status === 'occupied';
                const isReserved = slot.status === 'reserved';

                return (
                  <button
                    key={slot.id}
                    onClick={() => setHighlightedSlot(slot)}
                    className={`relative p-3 rounded-xl border-2 flex flex-col items-center justify-between min-h-[92px] transition-all duration-150 text-left ${
                      isSelected
                        ? 'ring-2 ring-white scale-105 z-10'
                        : 'hover:scale-[1.02]'
                    } ${
                      isAvailable
                        ? 'bg-emerald-950/40 border-emerald-500/70 text-emerald-200 hover:bg-emerald-900/50'
                        : isOccupied
                        ? 'bg-rose-950/30 border-rose-500/60 text-rose-300 opacity-80 cursor-not-allowed'
                        : 'bg-amber-950/30 border-amber-500/60 text-amber-300 opacity-90'
                    }`}
                  >
                    {/* Top Icons */}
                    <div className="w-full flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-xs">{slot.slotNumber}</span>
                      <div className="flex items-center gap-1">
                        {slot.hasEVCharging && (
                          <span title="EV Charging Station" className="text-emerald-400">
                            <Zap className="w-3.5 h-3.5 fill-emerald-400/20" />
                          </span>
                        )}
                        {slot.isAccessible && (
                          <span title="Accessible Bay" className="text-cyan-400">
                            <Accessibility className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Center Vehicle Icon */}
                    <div className="my-1.5">
                      {isOccupied ? (
                        <div className="flex flex-col items-center text-rose-400">
                          <Car className="w-6 h-6" />
                          <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">Occupied</span>
                        </div>
                      ) : isReserved ? (
                        <div className="flex flex-col items-center text-amber-400">
                          <Car className="w-6 h-6 opacity-70" />
                          <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">Reserved</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-emerald-400">
                          <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-xs">
                            OPEN
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Bay Size / Type */}
                    <div className="w-full text-center text-[10px] font-mono text-slate-400 uppercase tracking-wide">
                      {slot.allowedTypes[0]}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Exit lane */}
            <div className="text-center py-1.5 mt-5 border-y border-dashed border-slate-700/70 text-[11px] font-mono tracking-widest text-slate-500 uppercase">
              ↑ PEDESTRIAN WALKWAY & ELEVATOR ACCESS ↓
            </div>
          </div>
        </div>

        {/* Selected Slot Drawer / Inspection Panel */}
        {highlightedSlot && (
          <div className="px-6 py-4 border-t border-slate-800 bg-[#131d38] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom duration-150">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-mono font-bold ${
                  highlightedSlot.status === 'available'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : highlightedSlot.status === 'occupied'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {highlightedSlot.slotNumber}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm">
                    Bay {highlightedSlot.slotNumber} · Floor {highlightedSlot.floor}
                  </h4>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                      highlightedSlot.status === 'available'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : highlightedSlot.status === 'occupied'
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {highlightedSlot.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>Types: {highlightedSlot.allowedTypes.join(', ').toUpperCase()}</span>
                  <span aria-hidden="true">·</span>
                  <span>{highlightedSlot.hasEVCharging ? 'EV Charger Available' : 'Standard Bay'}</span>
                  <span aria-hidden="true">·</span>
                  <span>{highlightedSlot.isCovered ? 'Covered' : 'Open Air'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Admin quick toggle */}
              {currentUser.role === 'admin' && (
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    onClick={() => updateSlotStatus(highlightedSlot.id, 'available')}
                    className="px-2.5 py-1.5 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50"
                  >
                    Set Available
                  </button>
                  <button
                    onClick={() => updateSlotStatus(highlightedSlot.id, 'occupied')}
                    className="px-2.5 py-1.5 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/50"
                  >
                    Set Occupied
                  </button>
                </div>
              )}

              {highlightedSlot.status === 'available' ? (
                <button
                  onClick={() => handleSelectAndProceed(highlightedSlot)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <span>Select & Book Bay {highlightedSlot.slotNumber}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="text-xs text-slate-400 italic">
                  Slot is currently {highlightedSlot.status}. Please select a green available bay.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
