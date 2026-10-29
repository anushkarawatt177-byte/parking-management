import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ParkingFacility, ParkingSlot, Booking, User, FilterState, SlotStatus, VehicleType } from '../types';
import { INITIAL_FACILITIES, generateInitialSlots, INITIAL_BOOKINGS, INITIAL_USERS } from '../data/mockData';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface ParkingContextType {
  facilities: ParkingFacility[];
  slots: ParkingSlot[];
  bookings: Booking[];
  currentUser: User;
  isLoggedIn: boolean;
  simulationActive: boolean;
  activeTab: 'home' | 'find' | 'booking' | 'dashboard' | 'admin' | 'about';
  selectedFacilityId: string;
  selectedSlot: ParkingSlot | null;
  filterState: FilterState;
  toasts: ToastMessage[];
  // Actions
  setActiveTab: (tab: 'home' | 'find' | 'booking' | 'dashboard' | 'admin' | 'about') => void;
  setSelectedFacilityId: (id: string) => void;
  setSelectedSlot: (slot: ParkingSlot | null) => void;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  setSimulationActive: (active: boolean) => void;
  createBooking: (details: {
    facilityId: string;
    slotId: string;
    vehicleType: VehicleType;
    vehiclePlate: string;
    date: string;
    startTime: string;
    endTime: string;
    paymentMethod: 'credit_card' | 'upi' | 'apple_pay' | 'cash_at_gate';
  }) => { success: boolean; booking?: Booking; error?: string };
  cancelBooking: (bookingId: string) => void;
  updateSlotStatus: (slotId: string, status: SlotStatus) => void;
  addFacility: (facility: Omit<ParkingFacility, 'id' | 'availableSpaces'>) => void;
  updateFacility: (facilityId: string, updates: Partial<ParkingFacility>) => void;
  deleteFacility: (facilityId: string) => void;
  loginAs: (role: 'driver' | 'admin') => void;
  logout: () => void;
  dismissToast: (id: string) => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  startBookingForSlot: (facilityId: string, slot: ParkingSlot) => void;
  resetToDefaults: () => void;
}

const defaultFilterState: FilterState = {
  searchQuery: '',
  vehicleType: 'all',
  maxPrice: 15,
  onlyAvailable: false,
  coveredOnly: false,
  evOnly: false,
  sortBy: 'distance',
};

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const ParkingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const [facilities, setFacilities] = useState<ParkingFacility[]>(() => {
    const saved = localStorage.getItem('smartparking_facilities');
    return saved ? JSON.parse(saved) : INITIAL_FACILITIES;
  });

  const [slots, setSlots] = useState<ParkingSlot[]>(() => {
    const saved = localStorage.getItem('smartparking_slots');
    return saved ? JSON.parse(saved) : generateInitialSlots();
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('smartparking_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('smartparking_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'home' | 'find' | 'booking' | 'dashboard' | 'admin' | 'about'>('home');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(facilities[0]?.id || 'fac-1');
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [filterState, setFilterState] = useState<FilterState>(defaultFilterState);
  const [simulationActive, setSimulationActive] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('smartparking_facilities', JSON.stringify(facilities));
  }, [facilities]);

  useEffect(() => {
    localStorage.setItem('smartparking_slots', JSON.stringify(slots));
  }, [slots]);

  useEffect(() => {
    localStorage.setItem('smartparking_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('smartparking_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Toast helper
  const showToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Recalculate facility available count whenever slots update
  const syncFacilityAvailability = (updatedSlots: ParkingSlot[]) => {
    setFacilities((prevFacilities) =>
      prevFacilities.map((fac) => {
        const facSlots = updatedSlots.filter((s) => s.facilityId === fac.id);
        const available = facSlots.filter((s) => s.status === 'available').length;
        return {
          ...fac,
          totalSpaces: facSlots.length > 0 ? facSlots.length : fac.totalSpaces,
          availableSpaces: facSlots.length > 0 ? available : fac.availableSpaces,
        };
      })
    );
  };

  // Live simulation effect for real-time bay occupancy demonstration
  useEffect(() => {
    if (!simulationActive) return;

    const interval = setInterval(() => {
      setSlots((prevSlots) => {
        if (prevSlots.length === 0) return prevSlots;
        // pick a random slot
        const randomIndex = Math.floor(Math.random() * prevSlots.length);
        const slot = prevSlots[randomIndex];

        // Toggle state realistically
        let nextStatus: SlotStatus = 'available';
        if (slot.status === 'available') {
          nextStatus = 'occupied';
        } else if (slot.status === 'occupied') {
          nextStatus = Math.random() > 0.3 ? 'available' : 'reserved';
        } else {
          nextStatus = 'available';
        }

        const newSlots = [...prevSlots];
        newSlots[randomIndex] = { ...slot, status: nextStatus };
        syncFacilityAvailability(newSlots);
        return newSlots;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [simulationActive]);

  // Create booking with collision detection
  const createBooking = (details: {
    facilityId: string;
    slotId: string;
    vehicleType: VehicleType;
    vehiclePlate: string;
    date: string;
    startTime: string;
    endTime: string;
    paymentMethod: 'credit_card' | 'upi' | 'apple_pay' | 'cash_at_gate';
  }) => {
    const facility = facilities.find((f) => f.id === details.facilityId);
    if (!facility) {
      showToast('error', 'Booking Failed', 'Selected parking facility was not found.');
      return { success: false, error: 'Facility not found' };
    }

    const slot = slots.find((s) => s.id === details.slotId);
    if (!slot) {
      showToast('error', 'Booking Failed', 'Selected parking slot does not exist.');
      return { success: false, error: 'Slot not found' };
    }

    // Overlapping booking collision check
    const isOverlapping = bookings.some((b) => {
      if (b.slotId !== details.slotId || b.date !== details.date || b.status === 'cancelled') {
        return false;
      }
      // Check time overlap: (StartA < EndB) and (EndA > StartB)
      return details.startTime < b.endTime && details.endTime > b.startTime;
    });

    if (isOverlapping) {
      showToast(
        'error',
        'Slot Collision Detected',
        `Slot ${slot.slotNumber} is already reserved during ${details.startTime} - ${details.endTime} on ${details.date}. Please pick another slot or timing.`
      );
      return {
        success: false,
        error: `Slot ${slot.slotNumber} is already booked for this timeframe.`,
      };
    }

    // Calculate hours duration
    const [startH, startM] = details.startTime.split(':').map(Number);
    const [endH, endM] = details.endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const durationHours = Math.max(1, Math.round(((endMinutes - startMinutes) / 60) * 10) / 10);
    const totalFee = Number((durationHours * facility.hourlyRate).toFixed(2));

    const bookingId = `SPK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: Booking = {
      id: bookingId,
      facilityId: facility.id,
      facilityName: facility.name,
      facilityAddress: facility.address,
      slotId: slot.id,
      slotNumber: slot.slotNumber,
      floor: slot.floor,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userPhone: currentUser.phone,
      vehicleType: details.vehicleType,
      vehiclePlate: details.vehiclePlate.toUpperCase(),
      date: details.date,
      startTime: details.startTime,
      endTime: details.endTime,
      durationHours,
      totalFee,
      status: 'active',
      createdAt: new Date().toISOString(),
      paymentMethod: details.paymentMethod,
      qrCodeData: `SMARTPARK://VERIFY/${bookingId}/${facility.id}-${slot.slotNumber}/${details.vehiclePlate.toUpperCase()}`,
    };

    // Update slot to reserved
    const updatedSlots = slots.map((s) =>
      s.id === slot.id ? { ...s, status: 'reserved' as SlotStatus, currentBookingId: bookingId } : s
    );
    setSlots(updatedSlots);
    syncFacilityAvailability(updatedSlots);

    setBookings((prev) => [newBooking, ...prev]);

    showToast(
      'success',
      'Booking Confirmed!',
      `Bay ${slot.slotNumber} reserved at ${facility.name}. Booking ID: ${bookingId}`
    );

    return { success: true, booking: newBooking };
  };

  // Cancel booking
  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    // Free the slot
    const updatedSlots = slots.map((s) =>
      s.id === booking.slotId ? { ...s, status: 'available' as SlotStatus, currentBookingId: undefined } : s
    );
    setSlots(updatedSlots);
    syncFacilityAvailability(updatedSlots);

    // Update booking status
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );

    showToast('info', 'Booking Cancelled', `Reservation ${bookingId} has been cancelled and refunded.`);
  };

  // Update slot status (Admin / manual)
  const updateSlotStatus = (slotId: string, status: SlotStatus) => {
    const updatedSlots = slots.map((s) => (s.id === slotId ? { ...s, status } : s));
    setSlots(updatedSlots);
    syncFacilityAvailability(updatedSlots);
    showToast('info', 'Slot Updated', `Slot status updated to ${status}.`);
  };

  // Add facility (Admin)
  const addFacility = (newFacData: Omit<ParkingFacility, 'id' | 'availableSpaces'>) => {
    const newId = `fac-${facilities.length + 1}`;
    const newFacility: ParkingFacility = {
      ...newFacData,
      id: newId,
      availableSpaces: newFacData.totalSpaces,
    };

    // Generate slots for this new facility
    const newSlotsForFac: ParkingSlot[] = [];
    const slotsPerFloor = Math.ceil(newFacility.totalSpaces / newFacility.floorsCount);
    let sIdx = 1;
    for (let f = 1; f <= newFacility.floorsCount; f++) {
      const prefix = ['A', 'B', 'C', 'D'][f - 1] || `F${f}`;
      for (let s = 1; s <= slotsPerFloor; s++) {
        if (sIdx > newFacility.totalSpaces) break;
        newSlotsForFac.push({
          id: `${newId}-slot-${sIdx}`,
          facilityId: newId,
          slotNumber: `${prefix}-${s < 10 ? '0' + s : s}`,
          floor: f,
          status: 'available',
          allowedTypes: ['sedan', 'suv', 'ev'],
          hasEVCharging: newFacility.hasEVCharging && s % 4 === 0,
          isCovered: newFacility.isCovered,
          isAccessible: s === 1,
        });
        sIdx++;
      }
    }

    setFacilities((prev) => [...prev, newFacility]);
    setSlots((prev) => [...prev, ...newSlotsForFac]);
    showToast('success', 'Facility Added', `${newFacility.name} added to the system.`);
  };

  const updateFacility = (facilityId: string, updates: Partial<ParkingFacility>) => {
    setFacilities((prev) =>
      prev.map((f) => (f.id === facilityId ? { ...f, ...updates } : f))
    );
    showToast('success', 'Facility Updated', 'Parking facility details saved successfully.');
  };

  const deleteFacility = (facilityId: string) => {
    setFacilities((prev) => prev.filter((f) => f.id !== facilityId));
    setSlots((prev) => prev.filter((s) => s.facilityId !== facilityId));
    showToast('info', 'Facility Removed', 'Facility and associated bays were removed.');
  };

  // Switch demo login
  const loginAs = (role: 'driver' | 'admin') => {
    const targetUser = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(targetUser);
    setIsLoggedIn(true);
    showToast('success', 'Logged In', `Switched session to ${targetUser.name} (${role.toUpperCase()})`);
  };

  const logout = () => {
    setIsLoggedIn(false);
    showToast('info', 'Logged Out', 'Demo session ended.');
  };

  const startBookingForSlot = (facilityId: string, slot: ParkingSlot) => {
    setSelectedFacilityId(facilityId);
    setSelectedSlot(slot);
    setActiveTab('booking');
  };

  const resetToDefaults = () => {
    localStorage.removeItem('smartparking_facilities');
    localStorage.removeItem('smartparking_slots');
    localStorage.removeItem('smartparking_bookings');
    localStorage.removeItem('smartparking_user');
    setFacilities(INITIAL_FACILITIES);
    setSlots(generateInitialSlots());
    setBookings(INITIAL_BOOKINGS);
    setCurrentUser(INITIAL_USERS[0]);
    showToast('info', 'Reset Complete', 'Demo database restored to default state.');
  };

  return (
    <ParkingContext.Provider
      value={{
        facilities,
        slots,
        bookings,
        currentUser,
        isLoggedIn,
        simulationActive,
        activeTab,
        selectedFacilityId,
        selectedSlot,
        filterState,
        toasts,
        setActiveTab,
        setSelectedFacilityId,
        setSelectedSlot,
        setFilterState,
        setSimulationActive,
        createBooking,
        cancelBooking,
        updateSlotStatus,
        addFacility,
        updateFacility,
        deleteFacility,
        loginAs,
        logout,
        dismissToast,
        showToast,
        startBookingForSlot,
        resetToDefaults,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = (): ParkingContextType => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};
