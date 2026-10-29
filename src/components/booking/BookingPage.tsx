import React, { useState, useEffect } from 'react';
import { useParking } from '../../context/ParkingContext';
import { VehicleType, Booking } from '../../types';
import { SlotLayoutModal } from '../slots/SlotLayoutModal';
import { QRCodeModal } from '../common/QRCodeModal';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  Car,
  CreditCard,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ArrowRight,
  Info,
} from 'lucide-react';

export const BookingPage: React.FC = () => {
  const {
    facilities,
    slots,
    selectedFacilityId,
    setSelectedFacilityId,
    selectedSlot,
    setSelectedSlot,
    createBooking,
    currentUser,
    setActiveTab,
  } = useParking();

  // Selected Facility
  const currentFacility = facilities.find((f) => f.id === selectedFacilityId) || facilities[0];

  // Available slots for this facility
  const facilitySlots = slots.filter((s) => s.facilityId === currentFacility.id);
  const availableFacilitySlots = facilitySlots.filter((s) => s.status === 'available');

  // Booking Form State
  const [slotId, setSlotId] = useState<string>(
    selectedSlot?.id || (availableFacilitySlots[0]?.id ?? '')
  );

  const [vehicleType, setVehicleType] = useState<VehicleType>(
    currentUser.vehicles[0]?.type || 'sedan'
  );

  const [vehiclePlate, setVehiclePlate] = useState<string>(
    currentUser.vehicles[0]?.plate || 'CA 7XYZ89'
  );

  // Defaults: Today and Next 2 Hours
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState<string>(today);
  const [startTime, setStartTime] = useState<string>('14:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'upi' | 'apple_pay' | 'cash_at_gate'>('upi');

  // UI States
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Keep slot in sync when facility changes or preselected slot changes
  useEffect(() => {
    if (selectedSlot && selectedSlot.facilityId === currentFacility.id) {
      setSlotId(selectedSlot.id);
    } else if (availableFacilitySlots.length > 0) {
      setSlotId(availableFacilitySlots[0].id);
    }
  }, [currentFacility.id, selectedSlot]);

  // Calculate duration and fee
  const calculateFee = () => {
    const [sH, sM] = startTime.split(':').map(Number);
    const [eH, eM] = endTime.split(':').map(Number);
    const startM = sH * 60 + sM;
    const endM = eH * 60 + eM;
    if (endM <= startM) return { durationHours: 0, totalFee: 0, valid: false };

    const hours = Math.max(1, Math.round(((endM - startM) / 60) * 10) / 10);
    const fee = Number((hours * currentFacility.hourlyRate).toFixed(2));
    return { durationHours: hours, totalFee: fee, valid: true };
  };

  const { durationHours, totalFee, valid: timeValid } = calculateFee();
  const activeSlot = facilitySlots.find((s) => s.id === slotId);

  const handleFacilityChange = (newFacId: string) => {
    setSelectedFacilityId(newFacId);
    setSelectedSlot(null);
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!slotId) {
      setErrorMsg('Please select an available parking slot.');
      return;
    }

    if (!vehiclePlate.trim()) {
      setErrorMsg('Please enter a vehicle registration number.');
      return;
    }

    if (!timeValid) {
      setErrorMsg('Departure time must be later than arrival time.');
      return;
    }

    // Call reservation
    const result = createBooking({
      facilityId: currentFacility.id,
      slotId,
      vehicleType,
      vehiclePlate: vehiclePlate.trim(),
      date,
      startTime,
      endTime,
      paymentMethod,
    });

    if (result.success && result.booking) {
      setConfirmedBooking(result.booking);
      // Confetti effect
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10B981', '#00F0A0', '#38BDF8', '#FFFFFF'],
        });
      } catch (e) {
        // Fallback silently if canvas-confetti unsupported
      }
    } else {
      setErrorMsg(result.error || 'Failed to complete booking. Please try another slot.');
    }
  };

  // If already confirmed in this session, show Confirmation Screen
  if (confirmedBooking) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-in zoom-in-95 duration-200">
        <div className="bg-[#0e162d] border border-emerald-500/50 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono font-semibold text-emerald-400 tracking-widest uppercase">
              RESERVATION SUCCESSFUL
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Your Slot Is Reserved!</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Present your digital QR parking pass at the entry boom barrier camera to gain automated access.
            </p>
          </div>

          {/* Ticket Card Details */}
          <div className="bg-[#141e3a] border border-slate-700/80 rounded-2xl p-5 text-left max-w-lg mx-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Booking Reference</div>
                <div className="text-base font-bold font-mono text-emerald-400">{confirmedBooking.id}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Assigned Bay</div>
                <div className="text-lg font-extrabold font-mono text-white">
                  {confirmedBooking.slotNumber} <span className="text-xs font-normal text-slate-400">(Floor {confirmedBooking.floor})</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Facility</span>
                <strong className="text-white font-medium">{confirmedBooking.facilityName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Vehicle Plate</span>
                <strong className="text-white font-mono">{confirmedBooking.vehiclePlate} ({confirmedBooking.vehicleType.toUpperCase()})</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Date & Schedule</span>
                <strong className="text-white">
                  {confirmedBooking.date} · {confirmedBooking.startTime} - {confirmedBooking.endTime}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Total Paid</span>
                <strong className="text-emerald-400 font-mono text-sm">${confirmedBooking.totalFee.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowQRModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <QrCode className="w-4 h-4" />
              <span>View & Scan QR Pass</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs text-slate-200 bg-[#16203D] hover:bg-[#1f2d54] border border-slate-700 transition-colors"
            >
              <span>Go to My Bookings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setConfirmedBooking(null);
                setSelectedSlot(null);
              }}
              className="w-full sm:w-auto px-4 py-3 rounded-xl font-medium text-xs text-slate-400 hover:text-white transition-colors"
            >
              Book Another Slot
            </button>
          </div>
        </div>

        {/* QR Code Modal */}
        {showQRModal && (
          <QRCodeModal
            booking={confirmedBooking}
            onClose={() => setShowQRModal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Reserve a Parking Spot
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Select location, choose your exact parking bay, and secure seamless automated gate entry.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form (2 Cols) */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-[#0e162d] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6"
          >
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Step 1: Parking Facility */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                1. Select Parking Location
              </label>
              <select
                value={currentFacility.id}
                onChange={(e) => handleFacilityChange(e.target.value)}
                className="w-full px-4 py-3 bg-[#16203D] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-400"
              >
                {facilities.map((fac) => (
                  <option key={fac.id} value={fac.id}>
                    {fac.name} — ${fac.hourlyRate.toFixed(2)}/hr ({fac.availableSpaces} bays open)
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
                <span>{currentFacility.address}</span>
                <span className="font-mono text-emerald-400 font-semibold">{currentFacility.availableSpaces} open spots</span>
              </div>
            </div>

            {/* Step 2: Slot Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  2. Choose Parking Bay / Slot
                </label>
                <button
                  type="button"
                  onClick={() => setIsSlotModalOpen(true)}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline"
                >
                  Open Visual Floor Map &rarr;
                </button>
              </div>

              {availableFacilitySlots.length === 0 ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                  This facility currently has no available bays. Please select another parking garage.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {facilitySlots.slice(0, 8).map((slot) => {
                    const isSelected = slot.id === slotId;
                    const isAvail = slot.status === 'available';
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={!isAvail}
                        onClick={() => setSlotId(slot.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md'
                            : isAvail
                            ? 'bg-[#16203D] text-slate-200 border-slate-700 hover:border-slate-500'
                            : 'bg-slate-900/60 text-slate-500 border-slate-800 cursor-not-allowed opacity-50'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span>{slot.slotNumber}</span>
                          {slot.hasEVCharging && <Zap className="w-3 h-3" />}
                        </div>
                        <div className="text-[10px] mt-1 uppercase font-semibold">
                          {isAvail ? `Level ${slot.floor}` : slot.status}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {activeSlot && (
                <p className="text-[11px] text-slate-400 pt-1">
                  Selected: <strong className="text-white font-mono">Bay {activeSlot.slotNumber}</strong> (Floor {activeSlot.floor}) ·
                  {activeSlot.hasEVCharging ? ' EV Fast Charging Equipped ·' : ''}
                  {activeSlot.isCovered ? ' Covered' : ' Open'}
                </p>
              )}
            </div>

            {/* Step 3: Vehicle Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  3. Vehicle Type
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                  className="w-full px-3.5 py-2.5 bg-[#16203D] border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="sedan">Sedan / Standard Hatchback</option>
                  <option value="suv">SUV / Minivan / Pickup</option>
                  <option value="ev">Electric Vehicle (EV)</option>
                  <option value="motorcycle">Two-Wheeler / Motorcycle</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Registration Number / Plate
                </label>
                <input
                  type="text"
                  required
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                  placeholder="e.g. CA 7XYZ89"
                  className="w-full px-3.5 py-2.5 bg-[#16203D] border border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Step 4: Schedule */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                4. Schedule (Date & Timing)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Date</span>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#16203D] border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Arrival Time</span>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#16203D] border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Departure Time</span>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#16203D] border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>

            {/* Step 5: Payment Gateway Simulation */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                5. Payment Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'upi', label: 'UPI / QR Pay' },
                  { id: 'credit_card', label: 'Credit Card' },
                  { id: 'apple_pay', label: 'Apple / Google Pay' },
                  { id: 'cash_at_gate', label: 'Pay at Barrier' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaymentMethod(item.id as typeof paymentMethod)}
                    className={`py-2 px-2.5 rounded-xl border text-center text-xs font-semibold transition-colors ${
                      paymentMethod === item.id
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60'
                        : 'bg-[#16203D] text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={availableFacilitySlots.length === 0}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/25 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm & Generate QR Access Pass (${totalFee.toFixed(2)})
            </button>
          </form>
        </div>

        {/* Dynamic Booking Summary Sidebar (1 Col) */}
        <div className="space-y-6">
          <div className="bg-[#0e162d] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
              Booking Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Facility:</span>
                <span className="text-white font-semibold text-right max-w-[170px] truncate">{currentFacility.name}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Selected Slot:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {activeSlot ? `Bay ${activeSlot.slotNumber} (Floor ${activeSlot.floor})` : 'Not Selected'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Vehicle Plate:</span>
                <span className="text-white font-mono">{vehiclePlate || '—'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Date:</span>
                <span className="text-white">{date}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Time Interval:</span>
                <span className="text-white">{startTime} - {endTime}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Calculated Duration:</span>
                <span className="text-white font-mono">{durationHours} hours</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Base Rate:</span>
                <span className="text-white font-mono">${currentFacility.hourlyRate.toFixed(2)} / hr</span>
              </div>
            </div>

            {/* Total Fee Callout */}
            <div className="p-4 rounded-xl bg-[#16203D] border border-slate-700/80 space-y-1">
              <div className="text-[11px] text-slate-400">Estimated Total Amount:</div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold font-mono text-emerald-400">
                  ${totalFee.toFixed(2)}
                </span>
                <span className="text-[11px] text-emerald-300/80 font-mono">Taxes & Gate Surcharge Included</span>
              </div>
            </div>

            {/* Collision & Security Guarantee */}
            <div className="space-y-2 text-[11px] text-slate-400 pt-1">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero Overbooking Collision Guarantee with ultrasonic bay sensor locks.</span>
              </div>
              <div className="flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Free cancellation up to 30 minutes before arrival time.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Slot Layout Modal for floor-level choosing */}
      {isSlotModalOpen && (
        <SlotLayoutModal
          facility={currentFacility}
          onClose={() => setIsSlotModalOpen(false)}
          onSlotSelected={(slot) => {
            setSlotId(slot.id);
            setSelectedSlot(slot);
          }}
        />
      )}
    </div>
  );
};
