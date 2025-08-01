import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import UserDashboard from './pages/Student/Student-Visitor/UserDashboard';
import StaffDashboard from './pages/Staff/StaffDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';

import ProfilePage from './pages/ProfilePage';
import ServiceListPage from './pages/Student/Student-Visitor/ServiceListPage';
import MyTicketsPage from './pages/Student/Student-Visitor/MyTicketsPage';
import CampusMapPage from './pages/Student/Student-Visitor/CampusMapPage';
import RequestServicePage from './pages/Student/Student-Visitor/RequestServicePage';

import QueueManagementPage from './pages/Staff/QueueManagementPage';

import OfficeManagementPage from './pages/Admin/OfficeManagementPage'
import ServiceManagementPage from './pages/Admin/ServiceManagementPage'
import UserManagementPage from './pages/Admin/UserManagementPage'

import NowServingDisplayPage from './pages/NowServingDisplayPage';

import { AuthProvider } from './contexts/AuthContext';

;

// Layout component with navbar and footer
const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main className="flex-grow container mx-auto px-4 py-8">
      {children}
    </main>
    <Footer />
  </div>
);

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Role-based Dashboards */}
          <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
          <Route path="/staff" element={<Layout><StaffDashboard /></Layout>} />
          <Route path="/student" element={<Layout><UserDashboard /></Layout>} />
          <Route path="/visitor" element={<Layout><UserDashboard /></Layout>} />
          <Route path="/Dashboard" element={<Layout><UserDashboard /></Layout>} />

          {/* Shared Routes of student and visitor (with layout) */}
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/services" element={<Layout><ServiceListPage /></Layout>} />
          <Route path="/my-tickets" element={<Layout><MyTicketsPage /></Layout>} />
          <Route path="/map" element={<Layout><CampusMapPage /></Layout>} />
          <Route path="/request-service" element={<Layout><RequestServicePage /></Layout>} />

          {/* Route of Staff (with layout) */}
            <Route path="/queueManagement" element={<Layout><QueueManagementPage /></Layout>} />

          {/* Routes of Admin (with layout) */}
           <Route path="/servicemanagement" element={<Layout><ServiceManagementPage /></Layout>} />
           <Route path="/officeManagement" element={<Layout><OfficeManagementPage /></Layout>} />
           <Route path="/UserManagement" element={<Layout><UserManagementPage /></Layout>} />

           <Route path="/now-serving/:office" element={<NowServingDisplayPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;