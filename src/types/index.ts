export type VehicleType = 'sedan' | 'suv' | 'ev' | 'motorcycle';

export type SlotStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

export interface ParkingSlot {
  id: string;
  facilityId: string;
  slotNumber: string; // e.g., "A-01", "B-12"
  floor: number;
  status: SlotStatus;
  allowedTypes: VehicleType[];
  hasEVCharging: boolean;
  isCovered: boolean;
  isAccessible: boolean;
  currentBookingId?: string;
}

export interface ParkingFacility {
  id: string;
  name: string;
  tagline: string;
  address: string;
  city: string;
  distanceKm: number;
  hourlyRate: number;
  totalSpaces: number;
  availableSpaces: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  floorsCount: number;
  hasEVCharging: boolean;
  isCovered: boolean;
  hasSecurity: boolean;
  hasValet: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  operatingHours: string;
}

export interface Booking {
  id: string; // e.g. "SPK-2026-9042"
  facilityId: string;
  facilityName: string;
  facilityAddress: string;
  slotId: string;
  slotNumber: string;
  floor: number;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  vehicleType: VehicleType;
  vehiclePlate: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationHours: number;
  totalFee: number;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
  paymentMethod: 'credit_card' | 'upi' | 'apple_pay' | 'cash_at_gate';
  qrCodeData: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'driver' | 'admin';
  vehicles: {
    plate: string;
    model: string;
    type: VehicleType;
  }[];
}

export interface FilterState {
  searchQuery: string;
  vehicleType: VehicleType | 'all';
  maxPrice: number;
  onlyAvailable: boolean;
  coveredOnly: boolean;
  evOnly: boolean;
  sortBy: 'distance' | 'price_asc' | 'price_desc' | 'availability';
}
