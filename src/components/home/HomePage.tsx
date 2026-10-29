import React, { useState } from 'react';
import { useParking } from '../../context/ParkingContext';
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle,
  MapPin,
  Car,
  QrCode,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    facilities,
    slots,
    bookings,
    setActiveTab,
    setFilterState,
    setSelectedFacilityId,
  } = useParking();

  // Search form state
  const [searchLocation, setSearchLocation] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const [searchDate, setSearchDate] = useState(today);
  const [searchArrival, setSearchArrival] = useState('13:00');
  const [searchDeparture, setSearchDeparture] = useState('16:00');

  // Compute live stats
  const totalLocations = facilities.length;
  const availableSlotsCount = slots.filter((s) => s.status === 'available').length;
  const registeredUsersCount = 1240 + bookings.length;
  const successfulBookingsCount = 8920 + bookings.length;

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchLocation.trim()) {
      setFilterState((prev) => ({ ...prev, searchQuery: searchLocation.trim() }));
    }
    setActiveTab('find');
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-16 animate-in fade-in duration-200">
      {/* 1. Hero Section with Background Visual & 3-Zone Balance */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-24 border-b border-slate-800">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Proposition & Hero CTAs (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Generation Urban Mobility Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] text-balance">
                Find Your Perfect <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  Parking Spot.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
                Smart Parking. Faster Decisions. Better Mobility. Cut congestion and fuel waste with real-time ultrasonic slot telemetry, instant bay booking, and contactless barrier QR access.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('find')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-xl shadow-emerald-500/25 active:scale-[0.98]"
                >
                  <span>Find Parking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('booking')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-[#1C2541] hover:bg-[#27355c] border border-slate-700 transition-all shadow-lg active:scale-[0.98]"
                >
                  <Car className="w-4 h-4 text-emerald-400" />
                  <span>Book a Slot</span>
                </button>
              </div>

              {/* Trust markers */}
              <div className="flex items-center gap-6 pt-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Guaranteed Reserved Bay</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>EV Ready Infrastructure</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Impact Visual Asset (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl group bg-[#0e172e]">
                <img
                  src="/src/assets/images/hero_smart_parking_1793302781822.jpg"
                  alt="Smart Parking Terminal Facility"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-transparent to-black/30" />

                {/* Floating Real-Time Guidance Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#0B132B]/90 border border-slate-700/80 backdrop-blur-md">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-emerald-400 font-bold uppercase">TERMINAL GUIDANCE</span>
                    <span className="text-[11px] text-slate-400">Live Ultrasonic Feed</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-white font-bold text-sm">Downtown Central Garage</div>
                      <div className="text-[11px] text-slate-400">450 Commercial Avenue</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-mono font-extrabold text-emerald-400">
                        {facilities[0]?.availableSpaces || 26} BAYS
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono">AVAILABLE NOW</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Hero Search Form Strip */}
          <div className="mt-12 bg-[#0e162d] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl">
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              {/* Destination */}
              <div className="space-y-1.5 lg:col-span-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Parking Destination or Area
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="e.g. Downtown Central or Tech Park..."
                    className="w-full pl-10 pr-3 py-2.5 bg-[#16203D] border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="w-full pl-9 pr-2 py-2.5 bg-[#16203D] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Arrival & Departure Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Arrival & Departure
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    value={searchArrival}
                    onChange={(e) => setSearchArrival(e.target.value)}
                    className="w-full px-2 py-2.5 bg-[#16203D] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                  <input
                    type="time"
                    value={searchDeparture}
                    onChange={(e) => setSearchDeparture(e.target.value)}
                    className="w-full px-2 py-2.5 bg-[#16203D] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Search Submit */}
              <div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 h-[42px]"
                >
                  <Search className="w-4 h-4" />
                  <span>Check Availability</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Live Quantitative Proof & Telemetry KPI Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {/* Total Parking Locations */}
          <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold uppercase tracking-wider">Parking Hubs</span>
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tabular-nums">
              {totalLocations}
            </div>
            <p className="text-xs text-slate-400">Integrated multi-level & surface facilities</p>
          </div>

          {/* Available Slots */}
          <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold uppercase tracking-wider">Available Bays</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 tabular-nums">
              {availableSlotsCount}
            </div>
            <p className="text-xs text-slate-400">Live ultrasonic sensor verified open spots</p>
          </div>

          {/* Registered Users */}
          <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold uppercase tracking-wider">Drivers Registered</span>
              <Car className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-400 tabular-nums">
              {registeredUsersCount.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400">Active university & commercial drivers</p>
          </div>

          {/* Successful Bookings */}
          <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold uppercase tracking-wider">Successful Bookings</span>
              <QrCode className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-400 tabular-nums">
              {successfulBookingsCount.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400">Zero collision check-ins completed</p>
          </div>
        </div>
      </section>

      {/* 3. How the System Works in Three Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            FRICTIONLESS 3-STEP WORKFLOW
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How Smart Parking Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Eliminate circling the block and wasted fuel. Seamless navigation from search to boom barrier entry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 relative">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-lg text-emerald-400">
              01
            </div>
            <h3 className="text-lg font-bold text-white">Search & Compare Bays</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Browse real-time parking availability across interactive city map markers, compare hourly rates, and inspect live bay sensor occupancy.
            </p>
            <div className="text-xs text-emerald-400 flex items-center gap-1 font-semibold pt-2">
              <span>Filter by EV & Covered Decks</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 relative">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-lg text-cyan-400">
              02
            </div>
            <h3 className="text-lg font-bold text-white">Reserve Your Specific Slot</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Open the multi-floor visual parking grid to handpick your preferred bay (e.g. Bay A-04 near the elevator or EV fast charger) and reserve it.
            </p>
            <div className="text-xs text-cyan-400 flex items-center gap-1 font-semibold pt-2">
              <span>Automated Collision Lock</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 relative">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-lg text-amber-400">
              03
            </div>
            <h3 className="text-lg font-bold text-white">Contactless QR Gate Access</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Receive an encrypted digital QR pass on your mobile. Scan at the entry boom barrier camera for immediate, ticketless boom barrier elevation.
            </p>
            <div className="text-xs text-amber-400 flex items-center gap-1 font-semibold pt-2">
              <span>Instant Barrier Opening</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Smart Parking Hubs Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              PRIME LOCATIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Featured Parking Complexes
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('find')}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>Explore All {facilities.length} Locations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {facilities.slice(0, 3).map((fac) => (
            <div
              key={fac.id}
              className="bg-[#0e162d] border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                <img
                  src={fac.imageUrl}
                  alt={fac.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e162d] via-transparent to-black/30" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#0B132B]/90 text-white border border-slate-700 backdrop-blur-md">
                  {fac.distanceKm} km away
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-[#0B132B]/90 border border-slate-700 font-mono font-bold text-emerald-400 text-sm">
                  ${fac.hourlyRate.toFixed(2)}/hr
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                      {fac.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{fac.address}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="font-mono text-emerald-400 font-bold">
                    {fac.availableSpaces} Available Bays
                  </span>
                  <button
                    onClick={() => {
                      setSelectedFacilityId(fac.id);
                      setActiveTab('find');
                    }}
                    className="text-xs font-semibold text-slate-200 hover:text-white underline flex items-center gap-1"
                  >
                    <span>View Bays</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. College Project Academic Presentation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#141e3a] via-[#0e162d] to-[#141e3a] border border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <span>PROJECT SUBMISSION & FACULTY REVIEW READY</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Prepared for Java Spring Boot + MySQL Integration
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Inspect full REST API Controller contracts, JPA entity relationships, and production MySQL 8 DDL schemas architected for this project.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('about')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20 whitespace-nowrap shrink-0"
          >
            <span>View Architecture & DDL</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
