
// Main App Component: src/App.js
import React, { useState, useContext, createContext } from 'react';
import { ChevronDown, LogOut, User, Briefcase, Settings, LayoutDashboard, Ticket, Users, BookOpen, MapPin, PlusCircle, Edit3, Trash2, Search, Bell } from 'lucide-react';
import { useAuth } from './contexts/AuthContext'

import API from './api';
// Mock Auth Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null, { email: 'student@example.com', role: 'student' }, { email: 'staff@example.com', role: 'staff' }, { email: 'admin@example.com', role: 'admin' }
  const [currentPage, setCurrentPage] = useState(user ? (user.role === 'student' ? 'studentDashboard' : user.role === 'staff' ? 'staffDashboard' : 'adminDashboard') : 'login');

  const login = (email, password, role) => {
    // Mock login logic
    if (email && password) {
      const mockUser = { email, role };
      setUser(mockUser);
      // Navigate to default page based on role
      switch (role) {
        case 'student':
          setCurrentPage('studentDashboard');
          break;
        case 'staff':
          setCurrentPage('staffDashboard');
          break;
        case 'admin':
          setCurrentPage('adminDashboard');
          break;
        default:
          setCurrentPage('login');
      }
      return true;
    }
    return false;
  };

  const register = (userData) => {
    // Mock registration logic
    console.log('Registering user:', userData);
    // For now, just log and redirect to login
    setCurrentPage('login');
  };

  const logout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const navigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, currentPage, navigate }}>
      {children}
    </AuthContext.Provider>
  );
};


// Common Components
const Navbar = () => {
  const { user, logout, navigate, currentPage } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!user) return null;

  const commonLinks = [
    { name: 'My Profile', page: 'profile', icon: <User className="w-4 h-4 mr-2" /> },
  ];

  const studentLinks = [
    { name: 'Dashboard', page: 'studentDashboard', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
    { name: 'Find Service', page: 'serviceList', icon: <Search className="w-4 h-4 mr-2" /> },
    { name: 'My Tickets', page: 'myTickets', icon: <Ticket className="w-4 h-4 mr-2" /> },
  ];

  const staffLinks = [
    { name: 'Dashboard', page: 'staffDashboard', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
    { name: 'Manage Queue', page: 'queueManagement', icon: <Users className="w-4 h-4 mr-2" /> },
  ];

  const adminLinks = [
    { name: 'Dashboard', page: 'adminDashboard', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
    { name: 'Manage Users', page: 'userManagement', icon: <Users className="w-4 h-4 mr-2" /> },
    { name: 'Manage Services', page: 'serviceManagement', icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { name: 'Manage Offices', page: 'officeManagement', icon: <MapPin className="w-4 h-4 mr-2" /> },
  ];

  let navLinks = [];
  if (user.role === 'student') navLinks = studentLinks;
  else if (user.role === 'staff') navLinks = staffLinks;
  else if (user.role === 'admin') navLinks = adminLinks;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => navigate(user.role === 'student' ? 'studentDashboard' : user.role === 'staff' ? 'staffDashboard' : 'adminDashboard')} className="font-bold text-xl hover:text-blue-200 transition duration-150">
              SchoolQ PWA
            </button>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => navigate(link.page)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition duration-150 ${
                      currentPage === link.page ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                    }`}
                  >
                    {link.icon} {link.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button className="p-1 rounded-full text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="max-w-xs bg-blue-700 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    {/* Placeholder for user avatar - could be initials or an image */}
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500">
                      <span className="text-sm font-medium leading-none text-white">{user.email ? user.email.substring(0,1).toUpperCase() : 'U'}</span>
                    </span>
                    <ChevronDown className="ml-1 h-5 w-5 text-blue-300" />
                  </button>
                </div>
                {dropdownOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    {commonLinks.map(link => (
                       <button
                        key={link.page}
                        onClick={() => { navigate(link.page); setDropdownOpen(false); }}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        {link.icon} {link.name}
                      </button>
                    ))}
                    <button
                      onClick={() => { logout(); setDropdownOpen(false); }}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden"> {/* Mobile menu button */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)} // Re-use dropdownOpen for mobile menu for simplicity
              type="button"
              className="bg-blue-700 inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={dropdownOpen}
            >
              <span className="sr-only">Open main menu</span>
              {dropdownOpen ? <Users className="block h-6 w-6" /> : <User className="block h-6 w-6" /> /* Simple icon toggle */}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu, show/hide based on menu state. */}
      {dropdownOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => { navigate(link.page); setDropdownOpen(false); }}
                className={`w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium transition duration-150 ${
                  currentPage === link.page ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                }`}
              >
                {link.icon} {link.name}
              </button>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-blue-700">
            <div className="flex items-center px-5">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-500">
                  <span className="text-md font-medium leading-none text-white">{user.email ? user.email.substring(0,1).toUpperCase() : 'U'}</span>
                </span>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">{user.email}</div>
                <div className="text-sm font-medium leading-none text-blue-300">{user.role}</div>
              </div>
              <button className="ml-auto bg-blue-700 flex-shrink-0 p-1 rounded-full text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-3 px-2 space-y-1">
                {commonLinks.map(link => (
                    <button
                    key={link.page}
                    onClick={() => { navigate(link.page); setDropdownOpen(false); }}
                    className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:text-white hover:bg-blue-500"
                    role="menuitem"
                    >
                    {link.icon} {link.name}
                    </button>
                ))}
              <button
                onClick={() => { logout(); setDropdownOpen(false); }}
                className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:text-white hover:bg-blue-500"
              >
                <LogOut className="w-5 h-5 mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-gray-100 text-center p-4 mt-auto text-sm text-gray-600 border-t">
    &copy; {new Date().getFullYear()} School Queuing System. All rights reserved.
  </footer>
);

const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main className="flex-grow container mx-auto px-4 py-8">
      {children}
    </main>
    <Footer />
  </div>
);

// Auth Pages
const LoginPage = () => {
  const { login, navigate } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role for login attempt
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    // In a real app, you'd call an API. Here we use mock login.
    // The role selected here is just to tell the mock login function what kind of user is trying to log in.
    // The backend would typically determine the role based on credentials.
    if (!login(email, password, role)) {
      setError('Invalid credentials or role mismatch. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <label htmlFor="role" className="sr-only">Role</label>
              <select id="role" name="role" required value={role} onChange={(e) => setRole(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              >
                <option value="student">Student</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button onClick={() => navigate('register')} type="button" className="font-medium text-blue-600 hover:text-blue-500">
                Don't have an account? Register
              </button>
            </div>
          </div>

          <div>
            <button type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RegisterPage = () => {
  const { register, navigate } = useAuth();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'student', studentId: '', staffId: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // Add more validation as needed
    register(formData); // Mock register
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-teal-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
          
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" name="name" id="name" required onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input type="email" name="email" id="email" autoComplete="email" required onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" name="password" id="password" required onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input type="password" name="confirmPassword" id="confirmPassword" required onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Register as</label>
              <select id="role" name="role" value={formData.role} onChange={handleChange} required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                <option value="student">Student</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            {formData.role === 'student' && (
              <div className="sm:col-span-2">
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">Student ID</label>
                <input type="text" name="studentId" id="studentId" onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
              </div>
            )}
            {formData.role === 'staff' && (
              <div className="sm:col-span-2">
                <label htmlFor="staffId" className="block text-sm font-medium text-gray-700">Staff ID</label>
                <input type="text" name="staffId" id="staffId" onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm">
              <button onClick={() => navigate('login')} type="button" className="font-medium text-teal-600 hover:text-teal-500">
                Already have an account? Sign in
              </button>
            </div>
          </div>

          <div>
            <button type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Placeholder Page Components
const StudentDashboard = () => {
  const { user, navigate } = useAuth();
  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Dashboard</h1>
      <p className="text-gray-600 mb-4">Welcome, {user?.email}! This is your starting point.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button onClick={() => navigate('serviceList')} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex flex-col items-center justify-center">
          <Search size={48} className="mb-2" />
          <span className="text-xl">Find a Service</span>
          <span className="text-sm opacity-80">Browse and request school services</span>
        </button>
        <button onClick={() => navigate('myTickets')} className="bg-green-500 hover:bg-green-600 text-white font-semibold p-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex flex-col items-center justify-center">
          <Ticket size={48} className="mb-2" />
          <span className="text-xl">My Tickets</span>
          <span className="text-sm opacity-80">Check your queue status</span>
        </button>
         <button onClick={() => navigate('profile')} className="bg-purple-500 hover:bg-purple-600 text-white font-semibold p-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex flex-col items-center justify-center">
          <User size={48} className="mb-2" />
          <span className="text-xl">My Profile</span>
          <span className="text-sm opacity-80">View and update your details</span>
        </button>
      </div>
    </div>
  );
};

const ServiceListPage = () => {
  const { navigate } = useAuth();
  const [services, setServices] = useState([]);

  // eslint-disable-next-line no-undef
  useEffect(() => {
    API.get('/services')
      .then(res => setServices(res.data))
      .catch(err => console.error('Failed to fetch services', err));
  }, []);

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Available Services</h1>
      <p className="text-gray-600 mb-6">Choose a service you need assistance with.</p>
      <div className="grid md:grid-cols-2 gap-6">
        {services.map(service => (
          <div key={service.id} className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-150">
            <div className="flex items-center mb-3">
              <div className="p-3 rounded-full bg-gray-200 mr-4">
                <BookOpen size={24} className="text-indigo-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-700">{service.name}</h2>
                <p className="text-sm text-gray-500">Office: {service.office}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
            <button
              onClick={() => navigate('requestService', { serviceId: service.id, serviceName: service.name })}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-150"
            >
              Request Service
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


const RequestServicePage = ({ serviceId, serviceName }) => { // Props would be passed via navigate state
    const { navigate } = useAuth();
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState('');

    // Mock form fields based on serviceName (in a real app, this schema would come from backend)
    const getFormFields = () => {
        if (serviceName === "Borrow Books") {
            return [{ name: "bookTitle", label: "Book Title/ISBN", type: "text", required: true }];
        } else if (serviceName === "Transcript Request") {
            return [
                { name: "yearGraduated", label: "Year Graduated (if applicable)", type: "text" },
                { name: "purpose", label: "Purpose of Request", type: "textarea", required: true }
            ];
        }
        return [{ name: "details", label: "Details", type: "textarea", required: true }];
    };
    const formFields = getFormFields();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock submission
        console.log("Service Request Data:", { serviceId, serviceName, ...formData });
        setMessage(`Your request for "${serviceName}" has been submitted! Your ticket number is XYZ-123. Proceed to [Office Location].`);
        // In a real app, you'd get ticket number and navigation from backend
        // Then navigate to a ticket status page or show modal.
        setTimeout(() => {
            navigate('myTickets', { ticketNumber: 'XYZ-123', serviceName: serviceName, office: 'Mock Office Location' });
        }, 2000);
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Request: {serviceName || "Service"}</h1>
            <p className="text-gray-600 mb-6">Please fill out the details below.</p>
            {message && <div className="mb-4 p-3 rounded-md bg-green-100 text-green-700">{message}</div>}
            {!message && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {formFields.map(field => (
                        <div key={field.name}>
                            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.label}</label>
                            {field.type === 'textarea' ? (
                                <textarea id={field.name} name={field.name} rows="3" onChange={handleChange} required={field.required}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            ) : (
                                <input type={field.type} id={field.name} name={field.name} onChange={handleChange} required={field.required}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            )}
                        </div>
                    ))}
                    <div className="flex justify-end space-x-3">
                         <button type="button" onClick={() => navigate('serviceList')}
                            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Cancel
                        </button>
                        <button type="submit"
                            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Submit Request
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

const MyTicketsPage = ({ ticketNumber, serviceName, office }) => { // Props from navigation state
    // Mock ticket data - in real app, fetch this
    const tickets = [
        { id: 'LIB-001', service: 'Borrow Books', office: 'Library - 2nd Floor', status: 'Waiting (Est. 15 mins)', position: 3, navDetails: "Go to Main Library, 2nd Floor, Section A." },
        { id: 'REG-005', service: 'Transcript Request', office: 'Registrar - Admin Bldg.', status: 'Called (Proceed to Counter 2)', position: 0, navDetails: "Admin Building, Ground Floor, Registrar's Office, Counter 2." },
    ];
    if (ticketNumber && serviceName && office && !tickets.find(t => t.id === ticketNumber)) {
        tickets.unshift({id: ticketNumber, service: serviceName, office: office, status: 'Just Submitted (Processing...)', position: 'N/A', navDetails: `Please proceed to ${office}. Ask staff for directions if needed.`})
    }


    return (
        <div className="bg-white p-8 rounded-xl shadow-xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Active Tickets</h1>
            {tickets.length === 0 ? (
                <p className="text-gray-600">You have no active tickets.</p>
            ) : (
                <div className="space-y-6">
                    {tickets.map(ticket => (
                        <div key={ticket.id} className="bg-gray-50 p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold text-blue-600">{ticket.service}</h2>
                                    <p className="text-sm text-gray-500">Ticket #: <span className="font-medium">{ticket.id}</span></p>
                                    <p className="text-sm text-gray-500">Office: <span className="font-medium">{ticket.office}</span></p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                    ticket.status.includes('Waiting') ? 'bg-yellow-100 text-yellow-800' : 
                                    ticket.status.includes('Called') || ticket.status.includes('Serving') ? 'bg-green-100 text-green-800' :
                                    'bg-blue-100 text-blue-800'
                                }`}>
                                    {ticket.status}
                                </span>
                            </div>
                            {ticket.position > 0 && <p className="mt-2 text-sm text-gray-600">Your position in queue: <span className="font-bold">{ticket.position}</span></p>}
                             <div className="mt-4 pt-4 border-t border-gray-200">
                                <h3 className="text-md font-semibold text-gray-700 mb-1">Navigation:</h3>
                                <p className="text-sm text-gray-600 flex items-start">
                                    <MapPin size={18} className="mr-2 mt-0.5 text-blue-500 flex-shrink-0" /> 
                                    {ticket.navDetails}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


const StaffDashboard = () => {
  const { user, navigate } = useAuth();
  // Mock data for staff assigned service and current queue count
  const staffService = "Library Book Checkout";
  const queueCount = 5; 

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Staff Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome, {user?.email}! You are assigned to: <span className="font-semibold text-blue-600">{staffService}</span></p>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-blue-700">Current Queue</h2>
            <p className="text-4xl font-bold text-blue-600 my-2">{queueCount}</p>
            <p className="text-sm text-gray-600">Students waiting for {staffService}.</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-green-700">Service Status</h2>
            <p className="text-2xl font-bold text-green-600 my-2">Online</p>
            <p className="text-sm text-gray-600">You are actively serving students.</p>
            {/* Add buttons to go offline/on break */}
        </div>
      </div>

      <button 
        onClick={() => navigate('queueManagement')} 
        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex items-center justify-center text-lg"
      >
        <Users size={24} className="mr-2" />
        Manage Queue
      </button>
    </div>
  );
};

const QueueManagementPage = () => {
    const { navigate } = useAuth();
    // Mock queue data
    const queue = [
        { ticket: "LIB-003", studentName: "Alice Wonderland", studentId: "S1001", serviceDetails: "Book: 'The Great Gatsby'", timestamp: "10:05 AM" },
        { ticket: "LIB-004", studentName: "Bob The Builder", studentId: "S1002", serviceDetails: "Book: 'Intro to Algorithms'", timestamp: "10:08 AM" },
        { ticket: "LIB-005", studentName: "Charlie Brown", studentId: "S1003", serviceDetails: "Book: 'React for Dummies'", timestamp: "10:12 AM" },
    ];
    const nowServing = { ticket: "LIB-002", studentName: "Eve Harrington", studentId: "S1000", serviceDetails: "Book: 'Physics Vol. 1'", timestamp: "10:02 AM" };

    return (
        <div className="bg-white p-8 rounded-xl shadow-xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Queue Management: Library Book Checkout</h1>
            
            {nowServing && (
                <div className="mb-8 p-6 rounded-lg bg-green-50 border border-green-200 shadow">
                    <h2 className="text-xl font-semibold text-green-700 mb-2">Now Serving: <span className="text-green-600 font-bold">{nowServing.ticket}</span></h2>
                    <p><strong>Student:</strong> {nowServing.studentName} ({nowServing.studentId})</p>
                    <p><strong>Details:</strong> {nowServing.serviceDetails}</p>
                    <p className="text-sm text-gray-500">Called at: {nowServing.timestamp}</p>
                    <div className="mt-4 flex space-x-3">
                        <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition duration-150">
                            <Ticket className="inline mr-1 h-5 w-5" /> Mark as Completed
                        </button>
                         <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition duration-150">
                            No Show
                        </button>
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Waiting Queue ({queue.length})</h2>
            {queue.length === 0 && !nowServing ? (
                <p className="text-gray-600">The queue is currently empty.</p>
            ) : queue.length === 0 && nowServing ? (
                 <p className="text-gray-600">No more students in the waiting queue.</p>
            ) : (
                <div className="space-y-4">
                    {queue.map((item, index) => (
                        <div key={item.ticket} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-semibold text-blue-600">{item.ticket} <span className="text-sm text-gray-500 font-normal">- Submitted at {item.timestamp}</span></p>
                                    <p><strong>Student:</strong> {item.studentName} ({item.studentId})</p>
                                    <p><strong>Details:</strong> {item.serviceDetails}</p>
                                </div>
                                {index === 0 && ( // Only show "Call Next" for the first in queue
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-md transition duration-150">
                                        Call Next
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
             <button onClick={() => navigate('staffDashboard')} className="mt-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150">
                Back to Dashboard
            </button>
        </div>
    );
};


const AdminDashboard = () => {
  const { user, navigate } = useAuth();
  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome, {user?.email}! Manage the application settings and data.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button onClick={() => navigate('userManagement')} className="bg-red-500 hover:bg-red-600 text-white font-semibold p-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex flex-col items-center justify-center">
          <Users size={48} className="mb-2" />
          <span className="text-xl">Manage Users</span>
          <span className="text-sm opacity-80">Students & Staff accounts</span>
        </button>
        <button onClick={() => navigate('serviceManagement')} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold p-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex flex-col items-center justify-center">
          <BookOpen size={48} className="mb-2" />
          <span className="text-xl">Manage Services</span>
          <span className="text-sm opacity-80">Add, edit, or remove services</span>
        </button>
        <button onClick={() => navigate('officeManagement')} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold p-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex flex-col items-center justify-center">
          <MapPin size={48} className="mb-2" />
          <span className="text-xl">Manage Offices</span>
          <span className="text-sm opacity-80">Office locations & details</span>
        </button>
      </div>
    </div>
  );
};

const UserManagementPage = () => {
    // Mock data
    const users = [
        { id: 'S001', name: 'Alice Student', email: 'alice@example.com', role: 'student', status: 'Active' },
        { id: 'T001', name: 'Bob Staff', email: 'bob.staff@example.com', role: 'staff', office: 'Library', status: 'Active' },
        { id: 'S002', name: 'Charlie Student', email: 'charlie@example.com', role: 'student', status: 'Inactive' },
    ];

    return (
        <div className="bg-white p-8 rounded-xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md flex items-center transition duration-150">
                    <PlusCircle size={20} className="mr-2" /> Add New User
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">ID/Email</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Name</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Role</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Status</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-4">
                                    <div className="font-medium">{user.id}</div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                </td>
                                <td className="py-3 px-4">{user.name}</td>
                                <td className="py-3 px-4"><span className={`capitalize px-2 py-1 text-xs rounded-full ${user.role === 'student' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{user.role}</span></td>
                                <td className="py-3 px-4"><span className={`capitalize px-2 py-1 text-xs rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.status}</span></td>
                                <td className="py-3 px-4">
                                    <button className="text-blue-500 hover:text-blue-700 mr-2"><Edit3 size={18} /></button>
                                    <button className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ServiceManagementPage = () => {
    const services = [
        { id: 1, name: "Borrow Books", office: "Library", formFields: 2, isActive: true },
        { id: 2, name: "Transcript Request", office: "Registrar", formFields: 3, isActive: true },
        { id: 3, name: "ID Application", office: "Student Affairs", formFields: 5, isActive: false },
    ];
     return (
        <div className="bg-white p-8 rounded-xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Service Management</h1>
                <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md flex items-center transition duration-150">
                    <PlusCircle size={20} className="mr-2" /> Add New Service
                </button>
            </div>
             <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Service Name</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Assigned Office</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Form Fields</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Status</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {services.map(service => (
                            <tr key={service.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-4">{service.name}</td>
                                <td className="py-3 px-4">{service.office}</td>
                                <td className="py-3 px-4">{service.formFields}</td>
                                <td className="py-3 px-4"><span className={`capitalize px-2 py-1 text-xs rounded-full ${service.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{service.isActive ? 'Active' : 'Inactive'}</span></td>
                                <td className="py-3 px-4">
                                    <button className="text-blue-500 hover:text-blue-700 mr-2"><Edit3 size={18} /></button>
                                    <button className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
const OfficeManagementPage = () => {
    const offices = [
        { id: 1, name: "Main Library", building: "Academic Hall", floor: "2nd", navDetails: "Section A, near the study area." },
        { id: 2, name: "Registrar's Office", building: "Admin Building", floor: "Ground", navDetails: "Window 3 & 4." },
        { id: 3, name: "Student Affairs", building: "Student Center", floor: "1st", navDetails: "Room 101." },
    ];
    return (
        <div className="bg-white p-8 rounded-xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Office Management</h1>
                <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md flex items-center transition duration-150">
                    <PlusCircle size={20} className="mr-2" /> Add New Office
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Office Name</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Location</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Navigation Details</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {offices.map(office => (
                            <tr key={office.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-4">{office.name}</td>
                                <td className="py-3 px-4">{office.building}, {office.floor} Floor</td>
                                <td className="py-3 px-4 truncate max-w-xs">{office.navDetails}</td>
                                <td className="py-3 px-4">
                                    <button className="text-blue-500 hover:text-blue-700 mr-2"><Edit3 size={18} /></button>
                                    <button className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ProfilePage = () => {
    const { user } = useAuth();
    // Mock user data, in real app fetch this
    const userDetails = {
        name: user?.role === 'student' ? "Alice Student" : user?.role === 'staff' ? "Bob Staff" : "Admin User",
        idNumber: user?.role === 'student' ? "S1001" : user?.role === 'staff' ? "T001" : "ADM01",
        department: user?.role === 'student' ? "Computer Science" : user?.role === 'staff' ? "Library Department" : "System Administration",
        contact: "09123456789"
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-lg text-gray-800">{userDetails.name}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg text-gray-800">{user?.email}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-500">{user?.role === 'student' ? 'Student ID' : user?.role === 'staff' ? 'Staff ID' : 'Admin ID'}</label>
                    <p className="text-lg text-gray-800">{userDetails.idNumber}</p>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-500">{user?.role === 'student' ? 'Department/Course' : user?.role === 'staff' ? 'Assigned Department' : 'Role Description'}</label>
                    <p className="text-lg text-gray-800">{userDetails.department}</p>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-500">Contact Number</label>
                    <p className="text-lg text-gray-800">{userDetails.contact}</p>
                </div>
            </div>
            <button className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center transition duration-150">
                <Edit3 size={18} className="mr-2" /> Edit Profile (Not Implemented)
            </button>
        </div>
    );
};


// App Component
function App() {
  const { user, currentPage, navigate } = useAuth(); // Removed 'pageProps' as it's not used in this simplified router

  // Simple Router Logic
  const renderPage = () => {
    if (!user) {
      switch (currentPage) {
        case 'register':
          return <RegisterPage />;
        case 'login':
        default:
          return <LoginPage />;
      }
    }

    // Authenticated Routes
    // Pass props to components if needed, e.g. for RequestServicePage or MyTicketsPage
    // For simplicity, I'm assuming props are passed via navigate state or context if complex
    const pageProps = {}; // Example: if (currentPage === 'requestService') pageProps = { serviceId: someId, serviceName: someName };

    switch (currentPage) {
      // Student
      case 'studentDashboard':
        return <StudentDashboard />;
      case 'serviceList':
        return <ServiceListPage />;
      case 'requestService':
        return <RequestServicePage {...pageProps} />; // You'd pass actual props here
      case 'myTickets':
        return <MyTicketsPage {...pageProps} />; // You'd pass actual props here
      
      // Staff
      case 'staffDashboard':
        return <StaffDashboard />;
      case 'queueManagement':
        return <QueueManagementPage />;

      // Admin
      case 'adminDashboard':
        return <AdminDashboard />;
      case 'userManagement':
        return <UserManagementPage />;
      case 'serviceManagement':
        return <ServiceManagementPage />;
      case 'officeManagement':
        return <OfficeManagementPage />;
      
      // Common
      case 'profile':
        return <ProfilePage />;
      
      default:
        // Fallback to role-specific dashboard if page is unknown but user is logged in
        if (user.role === 'student') return <StudentDashboard />;
        if (user.role === 'staff') return <StaffDashboard />;
        if (user.role === 'admin') return <AdminDashboard />;
        return <LoginPage />; // Should not happen if logic is correct
    }
  };

  if (!user) {
    return renderPage(); // Render login/register without Layout
  }

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
}

export default App;