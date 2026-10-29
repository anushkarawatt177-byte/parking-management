/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ParkingProvider, useParking } from './context/ParkingContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/home/HomePage';
import { FindParkingPage } from './components/find/FindParkingPage';
import { BookingPage } from './components/booking/BookingPage';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AboutPage } from './components/about/AboutPage';
import { ToastContainer } from './components/common/ToastContainer';

const MainContent: React.FC = () => {
  const { activeTab } = useParking();

  return (
    <main className="flex-1 w-full">
      {activeTab === 'home' && <HomePage />}
      {activeTab === 'find' && <FindParkingPage />}
      {activeTab === 'booking' && <BookingPage />}
      {activeTab === 'dashboard' && <UserDashboard />}
      {activeTab === 'admin' && <AdminDashboard />}
      {activeTab === 'about' && <AboutPage />}
    </main>
  );
};

export default function App() {
  return (
    <ParkingProvider>
      <div className="min-h-screen flex flex-col bg-[#0B132B] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
        <Navbar />
        <MainContent />
        <Footer />
        <ToastContainer />
      </div>
    </ParkingProvider>
  );
}
