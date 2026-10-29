import React, { useState, useMemo } from 'react';
import { useParking } from '../../context/ParkingContext';
import { ParkingFacility, ParkingSlot, VehicleType, FilterState } from '../../types';
import { ParkingMapView } from './ParkingMapView';
import { SlotLayoutModal } from '../slots/SlotLayoutModal';
import {
  Search,
  Filter,
  MapPin,
  Car,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  SlidersHorizontal,
  Clock,
  Sparkles,
} from 'lucide-react';

export const FindParkingPage: React.FC = () => {
  const {
    facilities,
    filterState,
    setFilterState,
    setSelectedFacilityId,
    startBookingForSlot,
    setActiveTab,
  } = useParking();

  const [activeModalFacility, setActiveModalFacility] = useState<ParkingFacility | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<ParkingFacility>(facilities[0]);
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'both' | 'cards' | 'map'>('both');

  // Filter facilities based on user inputs
  const filteredFacilities = useMemo(() => {
    return facilities.filter((fac) => {
      // Query filter
      if (filterState.searchQuery.trim()) {
        const q = filterState.searchQuery.toLowerCase();
        const matches =
          fac.name.toLowerCase().includes(q) ||
          fac.address.toLowerCase().includes(q) ||
          fac.city.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Max price
      if (fac.hourlyRate > filterState.maxPrice) return false;

      // Only available
      if (filterState.onlyAvailable && fac.availableSpaces <= 0) return false;

      // Covered only
      if (filterState.coveredOnly && !fac.isCovered) return false;

      // EV Only
      if (filterState.evOnly && !fac.hasEVCharging) return false;

      return true;
    }).sort((a, b) => {
      if (filterState.sortBy === 'distance') return a.distanceKm - b.distanceKm;
      if (filterState.sortBy === 'price_asc') return a.hourlyRate - b.hourlyRate;
      if (filterState.sortBy === 'price_desc') return b.hourlyRate - a.hourlyRate;
      if (filterState.sortBy === 'availability') return b.availableSpaces - a.availableSpaces;
      return 0;
    });
  }, [facilities, filterState]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header and Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Find Available Parking
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time bay sensor status, live pricing, and instant slot reservations across {facilities.length} active hubs.
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#16203D] border border-slate-700 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setViewMode('both')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'both' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            Map & List View
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'cards' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            Cards Only
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'map' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            Interactive Map
          </button>
        </div>
      </div>

      {/* Filter Bar Controls */}
      <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Location Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterState.searchQuery}
              onChange={(e) => setFilterState((prev) => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Search by facility name or avenue..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#16203D] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            />
          </div>

          {/* Vehicle Type Selector */}
          <div>
            <select
              value={filterState.vehicleType}
              onChange={(e) =>
                setFilterState((prev) => ({ ...prev, vehicleType: e.target.value as VehicleType | 'all' }))
              }
              className="w-full px-3.5 py-2.5 bg-[#16203D] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400"
            >
              <option value="all">All Vehicle Types</option>
              <option value="sedan">Sedan / Compact Cars</option>
              <option value="suv">SUV / Minivan</option>
              <option value="ev">Electric Vehicle (EV)</option>
              <option value="motorcycle">Two-Wheeler / Bike</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={filterState.sortBy}
              onChange={(e) =>
                setFilterState((prev) => ({
                  ...prev,
                  sortBy: e.target.value as FilterState['sortBy'],
                }))
              }
              className="w-full px-3.5 py-2.5 bg-[#16203D] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400"
            >
              <option value="distance">Sort by: Nearest Distance</option>
              <option value="price_asc">Sort by: Price (Low to High)</option>
              <option value="price_desc">Sort by: Price (High to Low)</option>
              <option value="availability">Sort by: Most Available Bays</option>
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="flex flex-col justify-center px-1">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span>Max Hourly Rate:</span>
              <span className="font-mono font-bold text-emerald-400 tabular-nums">
                ${filterState.maxPrice.toFixed(2)}/hr
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="15"
              step="0.5"
              value={filterState.maxPrice}
              onChange={(e) =>
                setFilterState((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
              }
              className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
            />
          </div>
        </div>

        {/* Feature Checkbox Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
          <div className="flex flex-wrap items-center gap-5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filterState.onlyAvailable}
                onChange={(e) =>
                  setFilterState((prev) => ({ ...prev, onlyAvailable: e.target.checked }))
                }
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-800 border-slate-600"
              />
              <span>Available Bays Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filterState.evOnly}
                onChange={(e) =>
                  setFilterState((prev) => ({ ...prev, evOnly: e.target.checked }))
                }
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-800 border-slate-600"
              />
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-emerald-400" /> EV Charger On-Site
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filterState.coveredOnly}
                onChange={(e) =>
                  setFilterState((prev) => ({ ...prev, coveredOnly: e.target.checked }))
                }
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-800 border-slate-600"
              />
              <span>Covered Multi-Level Parking</span>
            </label>
          </div>

          <div className="text-slate-400 text-xs font-mono">
            Showing <strong className="text-white">{filteredFacilities.length}</strong> of {facilities.length} locations
          </div>
        </div>
      </div>

      {/* Main Content Area: Map + Facilities List */}
      <div className="space-y-8">
        {/* Interactive Map (Rendered when 'both' or 'map' is active) */}
        {(viewMode === 'both' || viewMode === 'map') && (
          <div>
            <ParkingMapView
              facilities={filteredFacilities}
              selectedFacility={selectedFacility}
              onSelectFacility={(fac) => setSelectedFacility(fac)}
              onOpenSlotLayout={(fac) => setActiveModalFacility(fac)}
            />
          </div>
        )}

        {/* Facilities Card Grid (Rendered when 'both' or 'cards' is active) */}
        {(viewMode === 'both' || viewMode === 'cards') && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Parking Locations ({filteredFacilities.length})
              </h2>
              <span className="text-xs text-slate-400">Click &ldquo;View Bay Grid&rdquo; to pick individual slots</span>
            </div>

            {filteredFacilities.length === 0 ? (
              <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                <Car className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white">No parking facilities match your filters</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adjusting the maximum price slider, unchecking the EV filter, or clearing your search keywords.
                </p>
                <button
                  onClick={() =>
                    setFilterState({
                      searchQuery: '',
                      vehicleType: 'all',
                      maxPrice: 15,
                      onlyAvailable: false,
                      coveredOnly: false,
                      evOnly: false,
                      sortBy: 'distance',
                    })
                  }
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors mt-2"
                >
                  Reset Search Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredFacilities.map((fac) => {
                  const occupancyPct = Math.round(
                    ((fac.totalSpaces - fac.availableSpaces) / fac.totalSpaces) * 100
                  );
                  const isAvailable = fac.availableSpaces > 0;

                  return (
                    <div
                      key={fac.id}
                      className="group bg-[#0e162d] border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-200 flex flex-col justify-between shadow-lg"
                    >
                      {/* Image slot */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                        <img
                          src={fac.imageUrl}
                          alt={fac.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Gradient Scrim */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0e162d] via-transparent to-black/40" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#0B132B]/90 text-white border border-slate-700/80 backdrop-blur-md">
                            {fac.distanceKm} km away
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold backdrop-blur-md border ${
                              isAvailable
                                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                                : 'bg-rose-950/90 text-rose-300 border-rose-500/40'
                            }`}
                          >
                            {isAvailable ? `${fac.availableSpaces} BAYS OPEN` : 'FULL'}
                          </span>
                        </div>

                        {/* Price Overlay */}
                        <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-[#0B132B]/90 border border-slate-700 backdrop-blur-md">
                          <span className="text-base font-extrabold text-emerald-400 font-mono tabular-nums">
                            ${fac.hourlyRate.toFixed(2)}
                          </span>
                          <span className="text-[11px] text-slate-400 font-normal"> / hr</span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                              {fac.name}
                            </h3>
                            <span className="text-xs text-amber-400 font-mono font-bold">
                              ★ {fac.rating} <span className="text-slate-500 text-[11px]">({fac.reviewsCount})</span>
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1">{fac.address}</p>
                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            {fac.tagline}
                          </p>
                        </div>

                        {/* Occupancy bar */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-mono">
                              Occupancy: <strong className="text-white">{occupancyPct}%</strong>
                            </span>
                            <span className="font-mono text-emerald-400 font-semibold">
                              {fac.availableSpaces} of {fac.totalSpaces} Available
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${occupancyPct}%` }}
                              className={`h-full transition-all duration-500 rounded-full ${
                                occupancyPct > 85 ? 'bg-rose-500' : occupancyPct > 60 ? 'bg-amber-400' : 'bg-emerald-400'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Amenities Tags */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-slate-400" /> {fac.floorsCount} Floors
                          </span>
                          {fac.hasEVCharging && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="flex items-center gap-1 text-emerald-400">
                                <Zap className="w-3.5 h-3.5" /> EV Charging
                              </span>
                            </>
                          )}
                          <span aria-hidden="true">·</span>
                          <span>{fac.isCovered ? 'Covered Deck' : 'Open Air Plaza'}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-500 font-mono">{fac.operatingHours}</span>
                        </div>

                        {/* Action buttons */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button
                            onClick={() => {
                              setSelectedFacility(fac);
                              setActiveModalFacility(fac);
                            }}
                            className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-200 bg-[#16203D] hover:bg-[#1f2d54] border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Layers className="w-3.5 h-3.5 text-emerald-400" />
                            <span>View Bay Grid</span>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedFacilityId(fac.id);
                              setActiveTab('booking');
                            }}
                            className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                          >
                            <span>Book Now</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal for Slot Layout Grid */}
      {activeModalFacility && (
        <SlotLayoutModal
          facility={activeModalFacility}
          onClose={() => setActiveModalFacility(null)}
          onSlotSelected={(slot) => {
            startBookingForSlot(activeModalFacility.id, slot);
          }}
        />
      )}
    </div>
  );
};
