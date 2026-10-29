import React, { useState } from 'react';
import { Booking } from '../../types';
import { useParking } from '../../context/ParkingContext';
import { X, QrCode, Download, Printer, CheckCircle, ShieldCheck, MapPin, Calendar, Clock, Car } from 'lucide-react';

interface QRCodeModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ booking, onClose }) => {
  const { showToast } = useParking();
  const [checkedIn, setCheckedIn] = useState(false);

  if (!booking) return null;

  const handleDownload = () => {
    showToast('success', 'Pass Downloaded', `Digital pass for ${booking.id} saved to your device.`);
  };

  const handlePrint = () => {
    showToast('info', 'Printing Ticket', `Preparing thermal ticket print preview for ${booking.id}...`);
  };

  const handleSimulateGateScan = () => {
    setCheckedIn(true);
    showToast(
      'success',
      'Gate Opened!',
      `Smart barrier opened at ${booking.facilityName}. Welcome, ${booking.vehiclePlate}!`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0e162d] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#16203d]">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white tracking-wide">Digital Parking Pass</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pass Content */}
        <div className="p-6 text-center space-y-5">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>VERIFIED ACCESS PASS · {booking.status.toUpperCase()}</span>
          </div>

          {/* QR Code Graphic Box */}
          <div className="relative mx-auto w-48 h-48 bg-white p-3 rounded-2xl shadow-inner flex flex-col items-center justify-center">
            {/* Real SVG QR code representation */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
              {/* Corner position markers */}
              <rect x="5" y="5" width="26" height="26" rx="4" fill="#0B132B" />
              <rect x="9" y="9" width="18" height="18" fill="white" />
              <rect x="13" y="13" width="10" height="10" fill="#0B132B" />

              <rect x="69" y="5" width="26" height="26" rx="4" fill="#0B132B" />
              <rect x="73" y="9" width="18" height="18" fill="white" />
              <rect x="77" y="13" width="10" height="10" fill="#0B132B" />

              <rect x="5" y="69" width="26" height="26" rx="4" fill="#0B132B" />
              <rect x="9" y="73" width="18" height="18" fill="white" />
              <rect x="13" y="77" width="10" height="10" fill="#0B132B" />

              {/* Data blocks */}
              <rect x="36" y="8" width="6" height="6" />
              <rect x="46" y="8" width="6" height="6" />
              <rect x="56" y="8" width="6" height="6" />

              <rect x="8" y="36" width="6" height="6" />
              <rect x="8" y="46" width="6" height="6" />
              <rect x="8" y="56" width="6" height="6" />

              <rect x="36" y="36" width="26" height="26" rx="3" fill="#10B981" />
              <rect x="42" y="42" width="14" height="14" fill="#0B132B" />

              <rect x="68" y="36" width="6" height="6" />
              <rect x="78" y="42" width="6" height="6" />
              <rect x="88" y="36" width="6" height="6" />
              <rect x="68" y="52" width="6" height="6" />
              <rect x="84" y="58" width="6" height="6" />

              <rect x="36" y="68" width="6" height="6" />
              <rect x="46" y="76" width="6" height="6" />
              <rect x="56" y="68" width="6" height="6" />
              <rect x="42" y="86" width="6" height="6" />
              <rect x="58" y="86" width="6" height="6" />

              <rect x="68" y="68" width="6" height="6" />
              <rect x="78" y="74" width="6" height="6" />
              <rect x="86" y="84" width="8" height="8" />
            </svg>
            <div className="absolute inset-x-2 bottom-1 text-[10px] text-slate-500 font-mono tracking-wider font-semibold">
              SCAN AT BOOM BARRIER
            </div>
          </div>

          {/* Booking Summary Card */}
          <div className="bg-[#16203d]/70 rounded-xl p-4 text-left border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Pass ID</span>
              <span className="text-xs font-mono font-bold text-emerald-400">{booking.id}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">{booking.facilityName}</span>
                  <div className="text-slate-400 text-[11px]">{booking.facilityAddress}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Slot / Bay</div>
                    <div className="font-bold text-white text-sm">
                      {booking.slotNumber} <span className="text-xs font-normal text-slate-400">(Floor {booking.floor})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Timing</div>
                    <div className="font-semibold text-white">
                      {booking.startTime} - {booking.endTime}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-700/60 text-slate-300">
                <span className="text-[11px] text-slate-400">Vehicle: <strong className="text-white font-mono">{booking.vehiclePlate}</strong></span>
                <span className="text-[11px] text-slate-400">Fee Paid: <strong className="text-emerald-400 font-bold">${booking.totalFee.toFixed(2)}</strong></span>
              </div>
            </div>
          </div>

          {/* Gate Scan Simulator */}
          {checkedIn ? (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Gate Barrier Activated · Vehicle Check-in Authenticated</span>
            </div>
          ) : (
            <button
              onClick={handleSimulateGateScan}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
            >
              Simulate Boom Barrier Scanner Entry
            </button>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save Pass</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
