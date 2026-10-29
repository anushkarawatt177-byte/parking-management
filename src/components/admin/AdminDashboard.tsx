import React, { useState } from 'react';
import { useParking } from '../../context/ParkingContext';
import { ParkingFacility, ParkingSlot, SlotStatus, User } from '../../types';
import { INITIAL_USERS } from '../../data/mockData';
import {
  Layers,
  DollarSign,
  Car,
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Activity,
  UserCheck,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    facilities,
    slots,
    bookings,
    addFacility,
    updateFacility,
    deleteFacility,
    updateSlotStatus,
    simulationActive,
    setSimulationActive,
    showToast,
  } = useParking();

  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'facilities' | 'slots' | 'bookings' | 'users'>('analytics');
  const [selectedFacilityForSlots, setSelectedFacilityForSlots] = useState<string>(facilities[0]?.id || 'fac-1');
  const [slotStatusFilter, setSlotStatusFilter] = useState<string>('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [isAddFacilityModalOpen, setIsAddFacilityModalOpen] = useState(false);

  // New Facility Form State
  const [newFacName, setNewFacName] = useState('');
  const [newFacTagline, setNewFacTagline] = useState('');
  const [newFacAddress, setNewFacAddress] = useState('');
  const [newFacRate, setNewFacRate] = useState<number>(4.5);
  const [newFacTotalSpaces, setNewFacTotalSpaces] = useState<number>(32);
  const [newFacFloors, setNewFacFloors] = useState<number>(3);
  const [newFacHasEV, setNewFacHasEV] = useState<boolean>(true);
  const [newFacIsCovered, setNewFacIsCovered] = useState<boolean>(true);

  // Compute Aggregate Stats
  const totalSpaces = slots.length;
  const occupiedSpaces = slots.filter((s) => s.status === 'occupied').length;
  const reservedSpaces = slots.filter((s) => s.status === 'reserved').length;
  const availableSpaces = slots.filter((s) => s.status === 'available').length;
  const activeBookingsCount = bookings.filter((b) => b.status === 'active' || b.status === 'upcoming').length;
  const totalRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((acc, curr) => acc + curr.totalFee, 0);

  const overallOccupancyPct = totalSpaces > 0 ? Math.round(((occupiedSpaces + reservedSpaces) / totalSpaces) * 100) : 0;

  // Selected facility for bay management
  const currentFac = facilities.find((f) => f.id === selectedFacilityForSlots) || facilities[0];
  const currentFacSlots = slots.filter((s) => s.facilityId === selectedFacilityForSlots);
  const filteredCurrentSlots = currentFacSlots.filter((s) => {
    if (slotStatusFilter === 'all') return true;
    return s.status === slotStatusFilter;
  });

  // Handle Add Facility
  const handleCreateFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacName.trim() || !newFacAddress.trim()) {
      showToast('error', 'Validation Error', 'Facility name and address are required.');
      return;
    }

    addFacility({
      name: newFacName.trim(),
      tagline: newFacTagline.trim() || 'Modern commercial automated parking plaza',
      address: newFacAddress.trim(),
      city: 'Metro City',
      distanceKm: Number((1.5 + Math.random() * 5).toFixed(1)),
      hourlyRate: Number(newFacRate),
      totalSpaces: Number(newFacTotalSpaces),
      rating: 4.8,
      reviewsCount: 12,
      imageUrl: '/src/assets/images/facility_downtown_plaza_1793302783787.jpg',
      floorsCount: Number(newFacFloors),
      hasEVCharging: newFacHasEV,
      isCovered: newFacIsCovered,
      hasSecurity: true,
      hasValet: false,
      coordinates: { lat: 37.77, lng: -122.42 },
      operatingHours: '24/7 All Days',
    });

    setIsAddFacilityModalOpen(false);
    setNewFacName('');
    setNewFacTagline('');
    setNewFacAddress('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Admin Header with Live Sensor Pill and Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              CENTRAL FACILITY OPERATIONS CONSOLE
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400 font-mono">SPRING BOOT DISPATCHER READY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Admin Management Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time bay sensor telemetry, occupancy analytics, dynamic rate management, and reservations dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSimulationActive(!simulationActive)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              simulationActive
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Simulation: {simulationActive ? 'Sensor Flow Active' : 'Idle'}</span>
          </button>

          <button
            onClick={() => setIsAddFacilityModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Facility</span>
          </button>
        </div>
      </div>

      {/* 5 Top Key Performance Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Spaces */}
        <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Total Bays</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
            {totalSpaces}
          </div>
          <div className="text-[11px] text-slate-400">Across {facilities.length} locations</div>
        </div>

        {/* Available Spaces */}
        <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Available</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">
            {availableSpaces}
          </div>
          <div className="text-[11px] text-slate-400">Ready for instant check-in</div>
        </div>

        {/* Occupied Spaces */}
        <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Occupied</span>
            <Car className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-400 tabular-nums">
            {occupiedSpaces}
          </div>
          <div className="text-[11px] text-slate-400">Sensor detected cars</div>
        </div>

        {/* Active Reservations */}
        <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Reserved</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 tabular-nums">
            {reservedSpaces}
          </div>
          <div className="text-[11px] text-slate-400">{activeBookingsCount} active bookings</div>
        </div>

        {/* Total Revenue */}
        <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">
            ${totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400">Net parking receipts</div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#0e162d] border border-slate-800 rounded-xl overflow-x-auto text-xs font-semibold">
        {[
          { id: 'analytics', label: 'Occupancy Analytics & Charts' },
          { id: 'facilities', label: `Facilities Management (${facilities.length})` },
          { id: 'slots', label: `Bay Status Manager (${currentFacSlots.length})` },
          { id: 'bookings', label: `Reservations Ledger (${bookings.length})` },
          { id: 'users', label: 'Registered Drivers & Roles' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as typeof activeAdminTab)}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeAdminTab === tab.id
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Visual Occupancy Charts & Peak Telemetry */}
      {activeAdminTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visual Facility Occupancy Breakdown */}
          <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base">Facility Occupancy Levels</h3>
                <p className="text-xs text-slate-400">Live bay saturation by parking complex</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                System Average: {overallOccupancyPct}%
              </span>
            </div>

            <div className="space-y-4">
              {facilities.map((fac) => {
                const facSlots = slots.filter((s) => s.facilityId === fac.id);
                const occ = facSlots.filter((s) => s.status === 'occupied').length;
                const res = facSlots.filter((s) => s.status === 'reserved').length;
                const pct = facSlots.length > 0 ? Math.round(((occ + res) / facSlots.length) * 100) : 0;

                return (
                  <div key={fac.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{fac.name}</span>
                      <span className="font-mono text-slate-400">
                        <strong className="text-white">{pct}%</strong> ({fac.availableSpaces} open / {fac.totalSpaces})
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-800/80 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${(occ / (fac.totalSpaces || 1)) * 100}%` }}
                        className="h-full bg-rose-500 transition-all duration-300"
                        title={`Occupied: ${occ}`}
                      />
                      <div
                        style={{ width: `${(res / (fac.totalSpaces || 1)) * 100}%` }}
                        className="h-full bg-amber-400 transition-all duration-300"
                        title={`Reserved: ${res}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-rose-500" />
                <span>Occupied Bays</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-amber-400" />
                <span>Reserved Passes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-slate-800" />
                <span>Available Spots</span>
              </div>
            </div>
          </div>

          {/* Peak Hourly Arrival Distribution Chart */}
          <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base">Peak Traffic Distribution</h3>
                <p className="text-xs text-slate-400">Hourly vehicle arrival influx histogram</p>
              </div>
              <span className="text-xs font-mono text-slate-400">24-Hour Cycle</span>
            </div>

            {/* Bar Histogram */}
            <div className="h-56 flex items-end justify-between gap-1.5 sm:gap-2 pt-6">
              {[
                { hour: '06h', val: 20 },
                { hour: '08h', val: 78 },
                { hour: '10h', val: 92 },
                { hour: '12h', val: 65 },
                { hour: '14h', val: 84 },
                { hour: '16h', val: 95 },
                { hour: '18h', val: 70 },
                { hour: '20h', val: 40 },
                { hour: '22h', val: 18 },
              ].map((bar) => (
                <div key={bar.hour} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-mono text-slate-400">{bar.val}%</span>
                  <div
                    style={{ height: `${bar.val}%` }}
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      bar.val > 80 ? 'bg-emerald-400' : 'bg-emerald-600/70'
                    }`}
                  />
                  <span className="text-[10px] font-mono text-slate-500">{bar.hour}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed text-center pt-2">
              Busiest arrival surge windows: <strong>09:30 AM – 11:00 AM</strong> and <strong>04:00 PM – 05:30 PM</strong>.
              Automated smart redirection dynamically prioritizes open bays at Metro Grand Terminal.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Facilities Management */}
      {activeAdminTab === 'facilities' && (
        <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base">Registered Parking Complexes</h3>
              <p className="text-xs text-slate-400">Configure capacities, base hourly pricing, and operational settings</p>
            </div>
            <button
              onClick={() => setIsAddFacilityModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Complex</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#16203D] text-slate-300 uppercase font-mono tracking-wider">
                <tr>
                  <th className="p-3">Facility Name</th>
                  <th className="p-3">Hourly Rate</th>
                  <th className="p-3">Total Bays</th>
                  <th className="p-3">Available</th>
                  <th className="p-3">Floors</th>
                  <th className="p-3">EV Stations</th>
                  <th className="p-3">Type</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {facilities.map((fac) => (
                  <tr key={fac.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-white text-sm">{fac.name}</div>
                      <div className="text-slate-400 text-[11px] truncate max-w-xs">{fac.address}</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-400">
                      ${fac.hourlyRate.toFixed(2)}/hr
                    </td>
                    <td className="p-3 font-mono text-slate-200">{fac.totalSpaces}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">{fac.availableSpaces}</td>
                    <td className="p-3 font-mono text-slate-300">{fac.floorsCount}</td>
                    <td className="p-3">
                      {fac.hasEVCharging ? (
                        <span className="text-emerald-400 font-semibold">Yes</span>
                      ) : (
                        <span className="text-slate-500">No</span>
                      )}
                    </td>
                    <td className="p-3 text-slate-300">{fac.isCovered ? 'Covered Deck' : 'Surface'}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            const newRate = prompt('Enter new hourly rate ($):', fac.hourlyRate.toString());
                            if (newRate && !isNaN(Number(newRate))) {
                              updateFacility(fac.id, { hourlyRate: Number(newRate) });
                            }
                          }}
                          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                          title="Edit Rate"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {facilities.length > 1 && (
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${fac.name}?`)) {
                                deleteFacility(fac.id);
                              }
                            }}
                            className="p-1.5 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                            title="Delete Facility"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Bay Status Manager */}
      {activeAdminTab === 'slots' && (
        <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base">Individual Bay Status Override</h3>
              <p className="text-xs text-slate-400">Direct ultrasonic sensor override for maintenance or manual reservation</p>
            </div>

            {/* Select Facility and Status Filter */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedFacilityForSlots}
                onChange={(e) => setSelectedFacilityForSlots(e.target.value)}
                className="px-3 py-1.5 bg-[#16203D] border border-slate-700 rounded-lg text-xs text-white"
              >
                {facilities.map((fac) => (
                  <option key={fac.id} value={fac.id}>{fac.name}</option>
                ))}
              </select>

              <select
                value={slotStatusFilter}
                onChange={(e) => setSlotStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-[#16203D] border border-slate-700 rounded-lg text-xs text-white"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {/* Slots Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredCurrentSlots.map((slot) => {
              return (
                <div
                  key={slot.id}
                  className="p-3.5 rounded-xl border border-slate-800 bg-[#141e3a] flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-sm text-white">Bay {slot.slotNumber}</span>
                      <div className="text-[11px] text-slate-400">Level {slot.floor} · {slot.allowedTypes[0]}</div>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        slot.status === 'available'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : slot.status === 'occupied'
                          ? 'bg-rose-500/20 text-rose-400'
                          : slot.status === 'reserved'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {slot.status}
                    </span>
                  </div>

                  {/* Override controls */}
                  <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-800 text-[10px] font-medium">
                    <button
                      onClick={() => updateSlotStatus(slot.id, 'available')}
                      className={`py-1 rounded text-center transition-colors ${
                        slot.status === 'available'
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-emerald-950'
                      }`}
                    >
                      Free
                    </button>
                    <button
                      onClick={() => updateSlotStatus(slot.id, 'occupied')}
                      className={`py-1 rounded text-center transition-colors ${
                        slot.status === 'occupied'
                          ? 'bg-rose-500 text-white font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-rose-950'
                      }`}
                    >
                      Occupied
                    </button>
                    <button
                      onClick={() => updateSlotStatus(slot.id, 'maintenance')}
                      className={`py-1 rounded text-center transition-colors ${
                        slot.status === 'maintenance'
                          ? 'bg-slate-400 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Block
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Reservations Ledger */}
      {activeAdminTab === 'bookings' && (
        <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base">Active & Historical Reservations</h3>
              <p className="text-xs text-slate-400">Total bookings ledger with digital verification tokens</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                placeholder="Search permit ID or plate..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#16203D] border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#16203D] text-slate-300 uppercase font-mono tracking-wider">
                <tr>
                  <th className="p-3">Permit ID</th>
                  <th className="p-3">User & Contact</th>
                  <th className="p-3">Location & Bay</th>
                  <th className="p-3">Plate & Type</th>
                  <th className="p-3">Schedule</th>
                  <th className="p-3">Fee</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {bookings
                  .filter((b) => {
                    if (!bookingSearch.trim()) return true;
                    const q = bookingSearch.toLowerCase();
                    return (
                      b.id.toLowerCase().includes(q) ||
                      b.userName.toLowerCase().includes(q) ||
                      b.vehiclePlate.toLowerCase().includes(q)
                    );
                  })
                  .map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-emerald-400">{booking.id}</td>
                      <td className="p-3">
                        <div className="font-semibold text-white">{booking.userName}</div>
                        <div className="text-[11px] text-slate-400">{booking.userPhone}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-slate-200">{booking.facilityName}</div>
                        <div className="text-[11px] font-mono text-emerald-400 font-bold">
                          Bay {booking.slotNumber} (Floor {booking.floor})
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-mono font-bold text-white">{booking.vehiclePlate}</span>
                        <div className="text-[11px] text-slate-400 uppercase">{booking.vehicleType}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-slate-200">{booking.date}</div>
                        <div className="text-[11px] text-slate-400">{booking.startTime} - {booking.endTime}</div>
                      </td>
                      <td className="p-3 font-mono font-bold text-white">${booking.totalFee.toFixed(2)}</td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                            booking.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : booking.status === 'upcoming'
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : booking.status === 'cancelled'
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Registered Users */}
      {activeAdminTab === 'users' && (
        <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base">User Directory & Roles</h3>
              <p className="text-xs text-slate-400">Authenticated drivers, fleet managers, and system administrators</p>
            </div>
            <span className="text-xs font-mono text-emerald-400">
              {INITIAL_USERS.length + 1} Registered Accounts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_USERS.map((usr) => (
              <div key={usr.id} className="p-4 rounded-xl border border-slate-800 bg-[#141e3a] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400">
                      {usr.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{usr.name}</div>
                      <div className="text-[11px] text-slate-400">{usr.email}</div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                      usr.role === 'admin'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}
                  >
                    {usr.role}
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-1 pt-2 border-t border-slate-800">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Registered Vehicles:</div>
                  {usr.vehicles.map((v, i) => (
                    <div key={i} className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-emerald-400">{v.plate}</span>
                      <span className="text-slate-400">{v.model}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add New Facility */}
      {isAddFacilityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0e162d] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Add New Parking Complex</h3>
              <button
                onClick={() => setIsAddFacilityModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFacility} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold uppercase">Facility Name</label>
                <input
                  type="text"
                  required
                  value={newFacName}
                  onChange={(e) => setNewFacName(e.target.value)}
                  placeholder="e.g. University North Parking Tower"
                  className="w-full px-3 py-2 bg-[#16203D] border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold uppercase">Street Address</label>
                <input
                  type="text"
                  required
                  value={newFacAddress}
                  onChange={(e) => setNewFacAddress(e.target.value)}
                  placeholder="e.g. 1200 Campus Road"
                  className="w-full px-3 py-2 bg-[#16203D] border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold uppercase">Hourly Rate ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={newFacRate}
                    onChange={(e) => setNewFacRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#16203D] border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold uppercase">Total Bays</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    required
                    value={newFacTotalSpaces}
                    onChange={(e) => setNewFacTotalSpaces(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#16203D] border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold uppercase">Floors</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    required
                    value={newFacFloors}
                    onChange={(e) => setNewFacFloors(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#16203D] border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={newFacHasEV}
                    onChange={(e) => setNewFacHasEV(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 bg-slate-800 rounded"
                  />
                  <span>EV Charging Bays</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={newFacIsCovered}
                    onChange={(e) => setNewFacIsCovered(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 bg-slate-800 rounded"
                  />
                  <span>Covered Multi-Level</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddFacilityModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300"
                >
                  Save Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
