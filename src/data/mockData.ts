import { ParkingFacility, ParkingSlot, Booking, User } from '../types';

export const INITIAL_FACILITIES: ParkingFacility[] = [
  {
    id: 'fac-1',
    name: 'Downtown Central Smart Garage',
    tagline: 'Multi-level covered smart facility with automatic number plate recognition',
    address: '450 Commercial Avenue, City Center',
    city: 'Metro City',
    distanceKm: 0.8,
    hourlyRate: 5.0,
    totalSpaces: 48,
    availableSpaces: 26,
    rating: 4.9,
    reviewsCount: 384,
    imageUrl: '/src/assets/images/facility_downtown_plaza_1793302783787.jpg',
    floorsCount: 4,
    hasEVCharging: true,
    isCovered: true,
    hasSecurity: true,
    hasValet: false,
    coordinates: { lat: 37.7749, lng: -122.4194 },
    operatingHours: '24/7 All Days',
  },
  {
    id: 'fac-2',
    name: 'Tech City Innovation Hub Parking',
    tagline: 'Next-gen subterranean EV charging hub with ultrasonic sensor guidance',
    address: '108 Silicon Boulevard, Technology Park',
    city: 'Metro City',
    distanceKm: 2.3,
    hourlyRate: 6.5,
    totalSpaces: 36,
    availableSpaces: 14,
    rating: 4.8,
    reviewsCount: 290,
    imageUrl: '/src/assets/images/facility_tech_hub_1793302784645.jpg',
    floorsCount: 3,
    hasEVCharging: true,
    isCovered: true,
    hasSecurity: true,
    hasValet: true,
    coordinates: { lat: 37.7833, lng: -122.4167 },
    operatingHours: '05:00 AM - 01:00 AM',
  },
  {
    id: 'fac-3',
    name: 'Metro Grand Terminal Canopy Parking',
    tagline: 'Solar-sheltered rapid transit parking plaza with express highway access',
    address: '890 Terminal Parkway, Transit District',
    city: 'Metro City',
    distanceKm: 4.1,
    hourlyRate: 3.5,
    totalSpaces: 40,
    availableSpaces: 22,
    rating: 4.7,
    reviewsCount: 512,
    imageUrl: '/src/assets/images/facility_metro_terminal_1793302784508.jpg',
    floorsCount: 2,
    hasEVCharging: false,
    isCovered: true,
    hasSecurity: true,
    hasValet: false,
    coordinates: { lat: 37.7651, lng: -122.4312 },
    operatingHours: '24/7 All Days',
  },
  {
    id: 'fac-4',
    name: 'Harborview Promenade Bay Parking',
    tagline: 'Scenic coastal open-air and canopy bays with wide spots for SUVs',
    address: '22 Marine Esplanade, Waterfront',
    city: 'Metro City',
    distanceKm: 5.6,
    hourlyRate: 4.0,
    totalSpaces: 30,
    availableSpaces: 19,
    rating: 4.6,
    reviewsCount: 175,
    imageUrl: '/src/assets/images/hero_smart_parking_1793302781822.jpg',
    floorsCount: 2,
    hasEVCharging: true,
    isCovered: false,
    hasSecurity: true,
    hasValet: false,
    coordinates: { lat: 37.7955, lng: -122.3937 },
    operatingHours: '06:00 AM - Midnight',
  },
];

// Helper to generate realistic slot layout
export function generateInitialSlots(): ParkingSlot[] {
  const slots: ParkingSlot[] = [];

  INITIAL_FACILITIES.forEach((fac) => {
    const slotsPerFloor = Math.ceil(fac.totalSpaces / fac.floorsCount);
    let slotIndex = 1;

    for (let f = 1; f <= fac.floorsCount; f++) {
      const floorPrefix = ['A', 'B', 'C', 'D'][f - 1] || `F${f}`;
      for (let s = 1; s <= slotsPerFloor; s++) {
        if (slotIndex > fac.totalSpaces) break;

        const slotNum = `${floorPrefix}-${s < 10 ? '0' + s : s}`;
        // Realistic distribution
        const isEvSlot = fac.hasEVCharging && (s % 4 === 0);
        const isMotorcycle = s === slotsPerFloor;
        const isSuvSpot = s % 3 === 0;

        let status: 'available' | 'occupied' | 'reserved' = 'available';
        const rand = (slotIndex * 13 + f * 7) % 100;
        if (rand < 40) {
          status = 'occupied';
        } else if (rand < 55) {
          status = 'reserved';
        } else {
          status = 'available';
        }

        slots.push({
          id: `${fac.id}-slot-${slotIndex}`,
          facilityId: fac.id,
          slotNumber: slotNum,
          floor: f,
          status,
          allowedTypes: isMotorcycle
            ? ['motorcycle']
            : isSuvSpot
            ? ['suv', 'sedan']
            : isEvSlot
            ? ['ev', 'sedan']
            : ['sedan', 'suv', 'ev'],
          hasEVCharging: isEvSlot,
          isCovered: fac.isCovered,
          isAccessible: s === 1,
        });

        slotIndex++;
      }
    }
  });

  return slots;
}

export const INITIAL_USERS: User[] = [
  {
    id: 'user-driver-1',
    name: 'Alex Morgan',
    email: 'alex.morgan@university.edu',
    phone: '+1 (555) 349-8821',
    role: 'driver',
    vehicles: [
      { plate: 'CA 7XYZ89', model: 'Tesla Model 3 (Electric)', type: 'ev' },
      { plate: 'CA 4MNO12', model: 'Honda Civic Sedan', type: 'sedan' },
    ],
  },
  {
    id: 'user-admin-1',
    name: 'Prof. Sarah Jenkins (Faculty / Admin)',
    email: 'admin.jenkins@metrocitypark.org',
    phone: '+1 (555) 880-9900',
    role: 'admin',
    vehicles: [
      { plate: 'ADM 001', model: 'Audi Q5 SUV', type: 'suv' },
    ],
  },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'SPK-2026-8192',
    facilityId: 'fac-1',
    facilityName: 'Downtown Central Smart Garage',
    facilityAddress: '450 Commercial Avenue, City Center',
    slotId: 'fac-1-slot-4',
    slotNumber: 'A-04',
    floor: 1,
    userId: 'user-driver-1',
    userName: 'Alex Morgan',
    userEmail: 'alex.morgan@university.edu',
    userPhone: '+1 (555) 349-8821',
    vehicleType: 'ev',
    vehiclePlate: 'CA 7XYZ89',
    date: '2026-10-29',
    startTime: '13:00',
    endTime: '16:00',
    durationHours: 3,
    totalFee: 15.0,
    status: 'active',
    createdAt: '2026-10-29T10:15:00Z',
    paymentMethod: 'upi',
    qrCodeData: 'SMARTPARK://VERIFY/SPK-2026-8192/FAC1-A04/AUTH_TOKEN_998',
  },
  {
    id: 'SPK-2026-7840',
    facilityId: 'fac-2',
    facilityName: 'Tech City Innovation Hub Parking',
    facilityAddress: '108 Silicon Boulevard, Technology Park',
    slotId: 'fac-2-slot-8',
    slotNumber: 'A-08',
    floor: 1,
    userId: 'user-driver-1',
    userName: 'Alex Morgan',
    userEmail: 'alex.morgan@university.edu',
    userPhone: '+1 (555) 349-8821',
    vehicleType: 'ev',
    vehiclePlate: 'CA 7XYZ89',
    date: '2026-10-30',
    startTime: '09:00',
    endTime: '12:00',
    durationHours: 3,
    totalFee: 19.5,
    status: 'upcoming',
    createdAt: '2026-10-28T16:30:00Z',
    paymentMethod: 'credit_card',
    qrCodeData: 'SMARTPARK://VERIFY/SPK-2026-7840/FAC2-A08/AUTH_TOKEN_741',
  },
  {
    id: 'SPK-2026-6102',
    facilityId: 'fac-3',
    facilityName: 'Metro Grand Terminal Canopy Parking',
    facilityAddress: '890 Terminal Parkway, Transit District',
    slotId: 'fac-3-slot-12',
    slotNumber: 'B-02',
    floor: 2,
    userId: 'user-driver-1',
    userName: 'Alex Morgan',
    userEmail: 'alex.morgan@university.edu',
    userPhone: '+1 (555) 349-8821',
    vehicleType: 'sedan',
    vehiclePlate: 'CA 4MNO12',
    date: '2026-10-25',
    startTime: '10:00',
    endTime: '14:00',
    durationHours: 4,
    totalFee: 14.0,
    status: 'completed',
    createdAt: '2026-10-24T08:00:00Z',
    paymentMethod: 'apple_pay',
    qrCodeData: 'SMARTPARK://VERIFY/SPK-2026-6102/FAC3-B02/COMPLETED',
  },
];

export const SPRING_BOOT_BACKEND_BLUEPRINT = {
  architecture: 'Spring Boot 3 + Spring Data JPA + MySQL 8 + Spring Security JWT',
  packageStructure: `
src/main/java/com/smartparking/
├── SmartParkingApplication.java
├── config/
│   ├── SecurityConfig.java
│   └── CorsConfig.java
├── controller/
│   ├── AuthController.java           // /api/v1/auth/login, /register
│   ├── FacilityController.java       // /api/v1/facilities (GET, POST, PUT)
│   ├── SlotController.java           // /api/v1/slots/availability, /toggle
│   └── BookingController.java        // /api/v1/bookings (reserve, cancel, qr-verify)
├── dto/
│   ├── BookingRequestDTO.java
│   ├── BookingResponseDTO.java
│   └── SlotAvailabilityDTO.java
├── entity/
│   ├── User.java
│   ├── Facility.java
│   ├── Slot.java
│   └── Reservation.java
├── repository/
│   ├── FacilityRepository.java
│   ├── SlotRepository.java
│   └── ReservationRepository.java
└── service/
    ├── BookingService.java           // Concurrency lock, overlap validation
    ├── SlotTelemetryService.java     // IoT ultrasonic sensor updates
    └── QrPassService.java            // HMAC-SHA256 digital signature
  `,
  mysqlSchema: `
-- ========================================================
-- Smart Parking Management System: Production MySQL Schema
-- ========================================================

CREATE DATABASE IF NOT EXISTS smart_parking_db;
USE smart_parking_db;

-- 1. Users Table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(25),
    role ENUM('ROLE_DRIVER', 'ROLE_ADMIN', 'ROLE_OPERATOR') DEFAULT 'ROLE_DRIVER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Parking Facilities Table
CREATE TABLE parking_facilities (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    tagline VARCHAR(255),
    address VARCHAR(255) NOT NULL,
    city VARCHAR(80) NOT NULL,
    hourly_rate DECIMAL(6,2) NOT NULL,
    total_spaces INT NOT NULL,
    available_spaces INT NOT NULL,
    floors_count INT DEFAULT 1,
    has_ev_charging BOOLEAN DEFAULT FALSE,
    is_covered BOOLEAN DEFAULT TRUE,
    has_security BOOLEAN DEFAULT TRUE,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Parking Slots Table
CREATE TABLE parking_slots (
    id VARCHAR(36) PRIMARY KEY,
    facility_id VARCHAR(36) NOT NULL,
    slot_number VARCHAR(20) NOT NULL,
    floor_number INT NOT NULL,
    status ENUM('AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE') DEFAULT 'AVAILABLE',
    allowed_vehicle_type VARCHAR(50) DEFAULT 'ALL',
    has_ev_charger BOOLEAN DEFAULT FALSE,
    is_covered BOOLEAN DEFAULT TRUE,
    is_accessible BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (facility_id) REFERENCES parking_facilities(id) ON DELETE CASCADE,
    UNIQUE KEY uk_facility_slot (facility_id, slot_number)
) ENGINE=InnoDB;

-- 4. Reservations / Bookings Table
CREATE TABLE reservations (
    id VARCHAR(36) PRIMARY KEY, -- e.g. SPK-2026-9042
    facility_id VARCHAR(36) NOT NULL,
    slot_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    vehicle_type VARCHAR(30) NOT NULL,
    vehicle_plate VARCHAR(20) NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours DECIMAL(4,1) NOT NULL,
    total_amount DECIMAL(8,2) NOT NULL,
    booking_status ENUM('ACTIVE', 'UPCOMING', 'COMPLETED', 'CANCELLED') DEFAULT 'UPCOMING',
    payment_status ENUM('PAID', 'PENDING', 'REFUNDED') DEFAULT 'PAID',
    payment_method VARCHAR(40),
    qr_auth_signature VARCHAR(255) NOT NULL,
    check_in_time TIMESTAMP NULL,
    check_out_time TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (facility_id) REFERENCES parking_facilities(id),
    FOREIGN KEY (slot_id) REFERENCES parking_slots(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_booking_overlap (slot_id, booking_date, start_time, end_time)
) ENGINE=InnoDB;
  `
};
