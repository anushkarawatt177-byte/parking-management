import React, { useState } from 'react';
import { useParking } from '../../context/ParkingContext';
import { Booking } from '../../types';
import { QRCodeModal } from '../common/QRCodeModal';
import {
  Calendar,
  Clock,
  Car,
  QrCode,
  XCircle,
  CheckCircle,
  DollarSign,
  MapPin,
  ArrowRight,
  ShieldCheck,
  FileText,
  Search,
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { bookings, currentUser, cancelBooking, setActiveTab } = useParking();
  const [selectedQRBooking, setSelectedQRBooking] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  // Compute metrics for current user
  const userBookings = bookings.filter(
    (b) => b.userId === currentUser.id || currentUser.role === 'admin'
  );

  const activeCount = userBookings.filter((b) => b.status === 'active').length;
  const upcomingCount = userBookings.filter((b) => b.status === 'upcoming').length;
  const completedCount = userBookings.filter((b) => b.status === 'completed').length;
  const totalSpending = userBookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((acc, curr) => acc + curr.totalFee, 0);

  // Filter bookings
  const filteredBookings = userBookings.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        b.id.toLowerCase().includes(q) ||
        b.facilityName.toLowerCase().includes(q) ||
        b.vehiclePlate.toLowerCase().includes(q) ||
        b.slotNumber.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleConfirmCancel = (bookingId: string) => {
    cancelBooking(bookingId);
    setCancellingBookingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Personalized Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              DRIVER DASHBOARD
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400 font-mono">ID: {currentUser.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review active parking permits, download entry QR tickets, or cancel upcoming reservations.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('booking')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20 whitespace-nowrap shrink-0"
        >
          <span>Book New Slot</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Bookings */}
        <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Active Now</span>
            <Car className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">
            {activeCount}
          </div>
          <div className="text-[11px] text-slate-400">Vehicle in parked bay</div>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Upcoming</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-cyan-400 tabular-nums">
            {upcomingCount}
          </div>
          <div className="text-[11px] text-slate-400">Scheduled for future dates</div>
        </div>

        {/* Completed Bookings */}
        <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Completed</span>
            <CheckCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white tabular-nums">
            {completedCount}
          </div>
          <div className="text-[11px] text-slate-400">Past parking sessions</div>
        </div>

        {/* Total Spending */}
        <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Total Spending</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-400 tabular-nums">
            ${totalSpending.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400">Across {userBookings.length} total permits</div>
        </div>
      </div>

      {/* Filters and Booking Search Bar */}
      <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Segmented Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#16203D] border border-slate-700/80 rounded-xl text-xs font-semibold w-full md:w-auto">
          {[
            { id: 'all', label: `All (${userBookings.length})` },
            { id: 'active', label: `Active (${activeCount})` },
            { id: 'upcoming', label: `Upcoming (${upcomingCount})` },
            { id: 'completed', label: `Completed (${completedCount})` },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Filter */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search booking ID or plate..."
            className="w-full pl-10 pr-4 py-2 bg-[#16203D] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Bookings List / Table */}
      {filteredBookings.length === 0 ? (
        <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-12 text-center space-y-4 shadow-xl">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No bookings found for this filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You don&rsquo;t have any permits matching the current criteria. Find a spot and reserve your bay.
          </p>
          <button
            onClick={() => setActiveTab('find')}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20"
          >
            Find Available Parking
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const isActive = booking.status === 'active';
            const isUpcoming = booking.status === 'upcoming';
            const isCancelled = booking.status === 'cancelled';

            return (
              <div
                key={booking.id}
                className="bg-[#0e162d] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl hover:border-slate-700 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Left: Info & Location */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-bold text-sm text-emerald-400">
                      {booking.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : isUpcoming
                          ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                          : isCancelled
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          : 'bg-slate-700/50 text-slate-300 border-slate-600'
                      }`}
                    >
                      {booking.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Reserved on {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{booking.facilityName}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      {booking.facilityAddress}
                    </p>
                  </div>

                  {/* Badges / Bay info */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-emerald-400" />
                      <span>
                        Bay: <strong className="text-white font-mono">{booking.slotNumber}</strong> (Floor {booking.floor})
                      </span>
                    </div>

                    <span aria-hidden="true" className="text-slate-600">·</span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Plate:</span>
                      <strong className="text-white font-mono">{booking.vehiclePlate}</strong>
                    </div>

                    <span aria-hidden="true" className="text-slate-600">·</span>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        {booking.date} · {booking.startTime} - {booking.endTime} ({booking.durationHours} hrs)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Price & Interactive Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <div className="text-left lg:text-right">
                    <span className="text-[11px] text-slate-400 block">Total Amount</span>
                    <span className="text-xl font-extrabold font-mono text-emerald-400 tabular-nums">
                      ${booking.totalFee.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">
                      Via {booking.paymentMethod.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* View QR Code Button */}
                    <button
                      onClick={() => setSelectedQRBooking(booking)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>View QR Pass</span>
                    </button>

                    {/* Cancellation option for active or upcoming bookings */}
                    {(isActive || isUpcoming) && (
                      <button
                        onClick={() => setCancellingBookingId(booking.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Code Pass Modal */}
      {selectedQRBooking && (
        <QRCodeModal
          booking={selectedQRBooking}
          onClose={() => setSelectedQRBooking(null)}
        />
      )}

      {/* Cancellation Confirmation Dialog */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0e162d] border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Cancel Parking Permit?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to cancel booking <strong className="font-mono text-white">{cancellingBookingId}</strong>?
              Your reserved bay will immediately become available for other drivers, and a 100% refund will be processed to your payment method.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setCancellingBookingId(null)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
              >
                Keep Permit
              </button>
              <button
                onClick={() => handleConfirmCancel(cancellingBookingId)}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shadow-md shadow-rose-600/30"
              >
                Yes, Cancel & Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
