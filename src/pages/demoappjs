// Main App Component: src/App.js
import React, { useState, useContext, createContext, useEffect } from 'react';
import { ChevronDown, LogOut, User, Briefcase, LayoutDashboard, Ticket, Users, BookOpen, MapPin, PlusCircle, Edit3, Trash2, Search, Bell } from 'lucide-react';
import Logo from './components/logo'; 



// Auth Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [pageNavigationProps, setPageNavigationProps] = useState({});

  const login = (credentials) => {
    const { email, password, role, name, address, contact } = credentials;

    if (role === 'visitor') {
      if (name && address && contact) { 
        const mockUser = { role: 'visitor', name, address, contact };
        setUser(mockUser);
        setPageNavigationProps({});
        setCurrentPage('visitorDashboard');
        return true;
      }
      return false;
    } else {
      // Mock login logic for other roles
      if (email && password) {
        const mockUser = { email, role };
        setUser(mockUser);
        setPageNavigationProps({});
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
    }
  };

  const register = (userData) => {
     // Mock registration logic
     console.log('Registering user:', userData);
     // DO NOT navigate here directly. Let the calling component handle navigation.
     // setPageNavigationProps({});
     // setCurrentPage('login');
   };

  const logout = () => {
    setUser(null);
    setPageNavigationProps({});
    setCurrentPage('login');
  };

  const navigate = (page, props = {}) => {
    setPageNavigationProps(props);
    setCurrentPage(page);
  };

  // Effect to handle initial page load if user is already set
 useEffect(() => {
    if (user && currentPage === 'login') {
      switch (user.role) {
        case 'student': setCurrentPage('studentDashboard'); break;
        case 'visitor': setCurrentPage('visitorDashboard'); break;
        case 'staff': setCurrentPage('staffDashboard'); break;
        case 'admin': setCurrentPage('adminDashboard'); break;
        default: setCurrentPage('login');
      }
    } else if (!user && currentPage !== 'login' && currentPage !== 'register') {
      setCurrentPage('login');
    }
  }, [user, currentPage]);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, currentPage, navigate, pageNavigationProps }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Common Components
 const Navbar = () => {
   const { user, logout, navigate, currentPage } = useAuth();
   const [dropdownOpen, setDropdownOpen] = useState(false);
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const [showLogoutModal, setShowLogoutModal] = useState(false); // New state for modal
 
   if (!user) return null;
 
   const commonDropdownLinks = [
     { name: 'My Profile', page: 'profile', icon: <User className="w-4 h-4 mr-2" /> },
   ];
 
   const studentOrVisitorLinks = [
     { name: 'Dashboard', page: user.role === 'student' ? 'studentDashboard' : 'visitorDashboard', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
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
   let homePage = 'login';
 
   if (user.role === 'student' || user.role === 'visitor') {
     navLinks = studentOrVisitorLinks;
     homePage = user.role === 'student' ? 'studentDashboard' : 'visitorDashboard';
   } else if (user.role === 'staff') {
     navLinks = staffLinks;
     homePage = 'staffDashboard';
   } else if (user.role === 'admin') {
     navLinks = adminLinks;
     homePage = 'adminDashboard';
   }
 
   const handleLogoutClick = () => {
     setShowLogoutModal(true); // Open the modal
     setDropdownOpen(false); // Close dropdown if open
     setMobileMenuOpen(false); // Close mobile menu if open
   };
 
   const confirmLogout = () => {
     logout(); // Perform the actual logout
     setShowLogoutModal(false); // Close the modal
   };
 
   const cancelLogout = () => {
     setShowLogoutModal(false); // Close the modal
   };
 
   return (
     <nav className="bg-blue-600 text-white shadow-lg">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex items-center justify-between h-16">
           <div className="flex items-center">
             <button onClick={() => navigate(homePage)} className="font-bold text-xl hover:text-blue-200 transition duration-150">
               PathWise
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
                     id="user-menu-button" aria-expanded={dropdownOpen} aria-haspopup="true"
                   >
                     <span className="sr-only">Open user menu</span>
                     <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500">
                       <span className="text-sm font-medium leading-none text-white">{user.email ? user.email.substring(0, 1).toUpperCase() : user.name ? user.name.substring(0, 1).toUpperCase() : 'U'}</span>
                     </span>
                     <ChevronDown className="ml-1 h-5 w-5 text-blue-300" />
                   </button>
                 </div>
                 {dropdownOpen && (
                   <div
                     className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                     role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button"
                   >
                     {commonDropdownLinks.map(link => (
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
                       onClick={handleLogoutClick} // Call handleLogoutClick here
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
           <div className="-mr-2 flex md:hidden">
             <button
               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
               type="button"
               className="bg-blue-700 inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white"
               aria-controls="mobile-menu" aria-expanded={mobileMenuOpen}
             >
               <span className="sr-only">Open main menu</span>
               {mobileMenuOpen ? <Users className="block h-6 w-6" /> : <User className="block h-6 w-6" /> /* Icon can be <Menu /> and <X /> from lucide if preferred */}
             </button>
           </div>
         </div>
       </div>
       {mobileMenuOpen && (
         <div className="md:hidden" id="mobile-menu">
           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {navLinks.map((link) => (
               <button
                 key={link.name}
                 onClick={() => { navigate(link.page); setMobileMenuOpen(false); }}
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
                 <span className="text-md font-medium leading-none text-white">{user.email ? user.email.substring(0, 1).toUpperCase() : user.name ? user.name.substring(0, 1).toUpperCase() : 'U'}</span>
               </span>
               <div className="ml-3">
                 <div className="text-base font-medium leading-none text-white">{user.email || user.name}</div>
                 <div className="text-sm font-medium leading-none text-blue-300 capitalize">{user.role}</div>
               </div>
               <button className="ml-auto bg-blue-700 flex-shrink-0 p-1 rounded-full text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white">
                 <span className="sr-only">View notifications</span>
                 <Bell className="h-6 w-6" aria-hidden="true" />
               </button>
             </div>
             <div className="mt-3 px-2 space-y-1">
               {commonDropdownLinks.map(link => (
                 <button
                   key={link.page}
                   onClick={() => { navigate(link.page); setMobileMenuOpen(false); }}
                   className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:text-white hover:bg-blue-500"
                   role="menuitem"
                 >
                   {link.icon} {link.name}
                 </button>
               ))}
               <button
                 onClick={handleLogoutClick} // Call handleLogoutClick here
                 className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:text-white hover:bg-blue-500"
               >
                 <LogOut className="w-5 h-5 mr-2" /> Logout
               </button>
             </div>
           </div>
         </div>
       )}
 
       {/* Logout Confirmation Modal */}
       {showLogoutModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
           <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
             <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Logout</h3>
             <p className="text-sm text-gray-700 mb-6">Are you sure you want to log out?</p>
             <div className="flex justify-end space-x-3">
               <button
                 onClick={cancelLogout}
                 className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
               >
                 Cancel
               </button>
               <button
                 onClick={confirmLogout}
                 className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
               >
                 Confirm
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
    &copy; {new Date().getFullYear()} PathWise Queuing, Reservation and Navigation. All rights reserved.
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
  const [role, setRole] = useState('student'); // Default role
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  const credentials = { role };

  if (role === 'visitor') {
    credentials.name = name;
    credentials.address = address;
    credentials.contact = contact;

    if (!name || !address || !contact) {
      setError('Please provide your name, address, and contact information.');
      return;
    }

  } else {
    credentials.email = email;
    credentials.password = password;

    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }
  }

  const success = await login(credentials);

  if (!success) {
    setError('Login failed. Please check your information or role.');
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div className="text-center">
          {/* Use the Logo component */}
          <Logo />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to PathWise</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="role" className="sr-only">Role</label>
              <select id="role" name="role" required value={role} onChange={(e) => setRole(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              >
                <option value="student">Student</option>
                <option value="visitor">Visitor</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {role === 'visitor' && (
              <>
                <div>
                  <label htmlFor="name" className="sr-only">Full Name</label>
                  <input id="name" name="name" type="text" required
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="address" className="sr-only">Address</label>
                  <input id="address" name="address" type="text" required
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="contact" className="sr-only">Email or Contact Number</label>
                  <input id="contact" name="contact" type="text" required
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Email or Contact Number" value={contact} onChange={(e) => setContact(e.target.value)} />
                </div>
              </>
            )}
            {role !== 'visitor' && (
              <>
                <div>
                  <label htmlFor="email-address" className="sr-only">Email address</label>
                  <input id="email-address" name="email" type="email" autoComplete="email" required
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input id="password" name="password" type="password" autoComplete="current-password" required
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between">
            {role !== 'visitor' && (
              <div className="text-sm">
                <button onClick={() => navigate('register')} type="button" className="font-medium text-blue-600 hover:text-blue-500">
                  Don't have an account? Register
                </button>
              </div>
            )}
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
     name: '', email: '', password: '', confirmPassword: '', role: 'student', studentId: '', staffId: '',  course: "",
    office: "", windowNo: "", section: "", department: "",
   });

   const [error, setError] = useState('');
   const [showSuccessModal, setShowSuccessModal] = useState(false);
 
   const handleChange = (e) => {
     setFormData({ ...formData, [e.target.name]: e.target.value });
   };
 
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setShowSuccessModal(false);

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match.");
    return;
  }
  if (!formData.name) {
    setError("Name is required.");
    return;
  }
  if (!formData.email) {
    setError("Email is required.");
    return;
  }
  if (formData.role === 'student' && !formData.studentId) {
    setError("Student ID is required for student registration.");
    return;
  }
  if (formData.role === 'staff' && !formData.staffId) {
    setError("Staff ID is required for staff registration.");
    return;
  }

  const payload = {
    name: formData.name,
    email: formData.email,
    password: formData.password,
    role: formData.role,
    studentId: formData.role === 'student' && formData.studentId.trim() !== '' ? formData.studentId : null,
    staffId: formData.role === 'staff' && formData.staffId.trim() !== '' ? formData.staffId : null,
    course: formData.role === 'student' ? formData.course : null,
    office: formData.role === 'staff' ? formData.office : null,
    windowNo: formData.office === 'Registrar' ? formData.windowNo : null,
    section: formData.office === 'Library' ? formData.section : null,
    department: formData.office === 'Departmental' ? formData.department : null,
  };

  try {
    console.log("Sending:", payload);

    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Registration failed.');
    } else {
      setShowSuccessModal(true);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
        studentId: '',
        staffId: '',
        course: '',
        office: '',
        windowNo: '',
        section: '',
        department: '',
      });
    }
  } catch (err) {
    setError("Something went wrong. Please try again later.");
    console.error(err);
  }
};

 
   const handleCloseSuccessModal = () => {
     setShowSuccessModal(false);
     navigate('login'); // Navigate to login page when modal is closed via the button
   };
 
   return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-teal-500 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Student/Staff Registration</h2>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" id="name" required onChange={handleChange} value={formData.name}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input type="email" name="email" id="email" autoComplete="email" required onChange={handleChange} value={formData.email}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" id="password" required onChange={handleChange} value={formData.password}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input type="password" name="confirmPassword" id="confirmPassword" required onChange={handleChange} value={formData.confirmPassword}
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
            <>
              <div className="sm:col-span-2">
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">Student ID</label>
                <input type="text" name="studentId" id="studentId" required onChange={handleChange} value={formData.studentId}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="course" className="block text-sm font-medium text-gray-700">Course</label>
                <select name="course" value={formData.course} onChange={handleChange} required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                  <option value="">Select Course</option>
                  <option value="BS InfoTech">BS InfoTech</option>
                  <option value="BSEMC">BSEMC</option>
                  <option value="BSIS">BSIS</option>
                  <option value="BSA">BSA</option>
                  <option value="BSCE">BSCE</option>
                  <option value="BTVTED">BTVTED</option>
                  <option value="BSIT">BSIT</option>
                  <option value="BSHM">BSHM</option>
                </select>
              </div>
            </>
          )}

          {formData.role === 'staff' && (
            <>
              <div className="sm:col-span-2">
                <label htmlFor="staffId" className="block text-sm font-medium text-gray-700">Staff ID</label>
                <input type="text" name="staffId" id="staffId" required onChange={handleChange} value={formData.staffId}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="office" className="block text-sm font-medium text-gray-700">Office</label>
                <select name="office" value={formData.office} onChange={handleChange} required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                  <option value="">Select Office</option>
                  <option value="Registrar">Registrar</option>
                  <option value="Library">Library</option>
                  <option value="Departmental">Departmental</option>
                </select>
              </div>

              {formData.office === 'Registrar' && (
                <div className="sm:col-span-2">
                  <label htmlFor="windowNo" className="block text-sm font-medium text-gray-700">Window</label>
                  <select name="windowNo" value={formData.windowNo} onChange={handleChange} required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                    <option value="">Select Window</option>
                    <option value="Window 1">Window 1</option>
                    <option value="Window 2">Window 2</option>
                    <option value="Window 3">Window 3</option>
                  </select>
                </div>
              )}

              {formData.office === 'Library' && (
                <div className="sm:col-span-2">
                  <label htmlFor="section" className="block text-sm font-medium text-gray-700">Section</label>
                  <select name="section" value={formData.section} onChange={handleChange} required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                    <option value="">Select Section</option>
                    <option value="Computer Section">Computer Section</option>
                    <option value="Reference Section">Reference Section</option>
                  </select>
                </div>
              )}

              {formData.office === 'Departmental' && (
                <div className="sm:col-span-2">
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                  <select name="department" value={formData.department} onChange={handleChange} required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                    <option value="">Select Department</option>
                    <option value="CCS">CCS</option>
                    <option value="CEA">CEA</option>
                    <option value="CIT">CIT</option>
                    <option value="CIE">CIE</option>
                    <option value="BSHM">BSHM</option>
                  </select>
                </div>
              )}
            </>
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

    {/* Registration Success Modal */}
    {showSuccessModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
          <h3 className="text-2xl font-bold text-green-600 mb-4">Registration Successful!</h3>
          <p className="text-gray-700 mb-6">Your account has been created successfully.</p>
          <button
            onClick={handleCloseSuccessModal}
            className="px-6 py-3 rounded-md text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    )}
  </div>
);
 }
 
 


// Placeholder Page Components
// Unified/Shared Page Components
const Dashboard = () => {
  const { user, navigate } = useAuth();

  let dashboardTitle = "User Dashboard";
  if (user?.role === 'student') {
    dashboardTitle = "Student Dashboard";
  } else if (user?.role === 'visitor') {
    dashboardTitle = "Visitor Dashboard";
  }
  // For Staff/Admin, they would typically have their own specific dashboard components
  // loaded via 'staffDashboard' or 'adminDashboard' routes.

  const welcomeMessage = `Welcome, ${user?.email || 'User'}! This is your starting point.`;

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{dashboardTitle}</h1>
      <p className="text-gray-600 mb-4">{welcomeMessage}</p>
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
        <button onClick={() => navigate('campus-map')} className="bg-pink-500 hover:bg-pink-600 text-white font-semibold p-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex flex-col items-center justify-center">
          <User size={48} className="mb-2" />
          <span className="text-xl">Campus Map</span>
          <span className="text-sm opacity-80">Navigate your way around campus</span>
        </button>
      </div>
    </div>
  );
};


const ServiceListPage = () => {
    const { navigate } = useAuth();
    // Mock services data
    const services = [
        { id: 1, name: "Request for Academic Records", office: "Registrar", description: "Request your official academic records.", icon: <Briefcase size={24} className="text-teal-500" /> },
        { id: 2, name: "ID Verification", office: "Registrar", description: "Verify your ID for validation.", icon: <User size={24} className="text-sky-500" /> },
        { id: 3, name: "Borrow Books", office: "Library", description: "Borrow books for your studies.", icon: <BookOpen size={24} className="text-indigo-500" /> },
       
    ];

    return (
        <div className="bg-white p-8 rounded-xl shadow-xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Available Services</h1>
            <p className="text-gray-600 mb-6">Choose a service you need assistance with.</p>
            <div className="grid md:grid-cols-2 gap-6">
                {services.map(service => (
                    <div key={service.id} className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-150">
                        <div className="flex items-center mb-3">
                            <div className="p-3 rounded-full bg-gray-200 mr-4">{service.icon}</div>
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
               <button onClick={() => navigate('Dashboard')} className="mt-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150">
                Back to Dashboard
            </button>
        </div>
    );
};

const RequestServicePage = ({ serviceId, serviceName }) => { // Props would be passed via navigate state
  const { navigate } = useAuth();
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (serviceName === "Request for Academic Records" && name === "requestType") {
      setFormData({ requestType: value });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const getFormFields = () => {
    if (serviceName === "Request for Academic Records") {
      return [
        { name: "fullName", label: "Full Name", type: "text", required: true },
        { name: "course", label: "Course", type: "select", options: ["BSIT", "BSInfoTech", "BSIS", "BSEMC", "BTVTED", "BSA", "BSHM"], required: true },
        { name: "yearLevel", label: "Year Level", type: "select", options: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Graduate"], required: true },
        { name: "lastAcademicYear", label: "Academic Year Last Attended", type: "text", required: true },
        { name: "contactNumber", label: "Contact Number", type: "text", required: true },
        { name: "address", label: "Address", type: "text", required: true },
        { name: "numberOfCopies", label: "Number of Copies", type: "number", required: true },
        { name: "purpose", label: "Purpose", type: "textarea", required: true }
      ];
    }

    if (serviceName === "Borrow Books") {
      return [{  name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "course", label: "Course", type: "select", options: ["BSIT", "BSInfoTech", "BSIS", "BSEMC", "BTVTED", "BSA", "BSHM"], required: true },
      { name: "yearLevel", label: "Year Level", type: "select", options: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "6th Year"], required: true },
      { name: "Email", label: "Email", type: "text", required: true },
      { name: "contactNumber", label: "Contact Number", type: "text", required: false },
      { name: "address", label: "Address", type: "text", required: true },
      { name: "bookTitle", label: "Book Title/ISBN", type: "text", required: true }];
    }

    return [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "course", label: "Course", type: "select", options: ["BSIT", "BSInfoTech", "BSIS", "BSEMC", "BTVTED", "BSA", "BSHM"], required: true },
      { name: "yearLevel", label: "Year Level", type: "select", options: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "6th Year"], required: true },
      { name: "Email", label: "Email", type: "text", required: true },
      { name: "contactNumber", label: "Contact Number", type: "text", required: false },
      { name: "address", label: "Address", type: "text", required: true }
    ];
  };

  const formFields = getFormFields();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setMessage(`Your request for "${serviceName}" has been submitted!`);
    setTimeout(() => {
      navigate('myTickets', { ticketNumber: 'XYZ-123', serviceName, office: 'Registrar' });
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
              ) : field.type === 'select' ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  required={field.required}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">-- Select --</option>
                  {field.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input type={field.type} id={field.name} name={field.name} value={formData[field.name] || ""} onChange={handleChange} required={field.required}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              )}
            </div>
          ))}


        {/* Manually controlled select field for requestType */}
        {serviceName === "Request for Academic Records" && (
          <>
            <div>
              <label htmlFor="requestType" className="block text-sm font-medium text-gray-700">Request Type</label>
              <select
                id="requestType"
                name="requestType"
                required
                value={formData.requestType || ""}
                onChange={handleChange}
                className="appearance-none rounded-md w-full px-3 py-2 border border-gray-300 text-gray-900 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">-- Select --</option>
                <option value="Certification">Certification</option>
                <option value="Authentication">Authentication</option>
                <option value="TranscriptA&R">Transcript Application & Releasing</option>
              </select>
            </div>

            {formData.requestType === "Certification" && (
              <div>
                <label htmlFor="certificationType" className="block text-sm font-medium text-gray-700">
                  Type of Certification
                </label>
                <select
                  id="certificationType"
                  name="certificationType"
                  value={formData.certificationType || ""}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">-- Select --</option>
                  <option value="TransferofCredentials">Transfer of Credentials</option>
                  <option value="Graduation">Graduation</option>
                  <option value="EarnedUnits">Earned Units</option>
                  <option value="Enrolment">Enrolment</option>
                  <option value="COG">Certificate of Grades (Indicate Year & Semester)</option>
                </select>
              </div>
            )}

            {formData.certificationType === "Certificate of Grades (Indicate Year & Semester)" && formData.requestType === "Certification" && (
              <div>
                <label htmlFor="gradesSemester" className="block text-sm font-medium text-gray-700">
                  Indicate the year and semester
                </label>
                <input
                  type="text"
                  id="gradesSemester"
                  name="gradesSemester"
                  value={formData.gradesSemester || ""}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            )}

            {formData.requestType === "Authentication" && (
              <div>
                <label htmlFor="authenticationType" className="block text-sm font-medium text-gray-700">
                  Type of Document for Authentication
                </label>
                <select
                  id="authenticationType"
                  name="authenticationType"
                  value={formData.authenticationType || ""}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">-- Select --</option>
                  <option value="TOR">Transcript of Records</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Others">Other Academic Records</option>
                </select>
              </div>
            )}

            {formData.authenticationType === "Other Academic Records" && formData.requestType === "Authentication" && (
              <div>
                <label htmlFor="otherDocument" className="block text-sm font-medium text-gray-700">
                  Please specify the academic document
                </label>
                <input
                  type="text"
                  id="otherDocument"
                  name="otherDocument"
                  value={formData.otherDocument || ""}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            )}
          </>
        )}

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
)};



const MyTicketsPage = ({ newlyCreatedTicket }) => {
  const { navigate } = useAuth();
  const [tickets, setTickets] = useState([
    { id: 'REG-005', service: 'Transcript Request', office: 'Registrar - Quadrangle Bldg.', status: 'Called (Proceed to Counter 2)', position: 0, navDetails: "Quadrangle Building, Ground Floor, Registrar's Office, Counter 2." },
    { id: 'LIB-001', service: 'Borrow Books', office: 'Library - 2nd Floor', status: 'Waiting (Est. 15 mins)', position: 3, navDetails: "Go to Main Library, 2nd Floor, Section A." },
  ]);

  useEffect(() => {
    if (newlyCreatedTicket && !tickets.find(t => t.id === newlyCreatedTicket.id)) {
      setTickets(prevTickets => [newlyCreatedTicket, ...prevTickets]);
    }
    // In a real app, you would fetch tickets for the user from a backend.
    // This effect is just to add a newly submitted mock ticket to the top of the list.
  }, [newlyCreatedTicket, tickets]);


  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Active Tickets</h1>
      {tickets.length === 0 ? (
        <p className="text-gray-600">You have no active tickets. Go to "Find a Service" to create one.</p>
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
                  ticket.status.includes('Submitted') ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800' // Default/Completed
                }`}>
                  {ticket.status}
                </span>
              </div>
              {ticket.position > 0 && <p className="mt-2 text-sm text-gray-600">Your position in queue: <span className="font-bold">{ticket.position}</span></p>}
              {ticket.position === 'N/A' && ticket.status.includes('Submitted') && <p className="mt-2 text-sm text-gray-600">Your request is being processed.</p>}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-md font-semibold text-gray-700 mb-1">Navigation:</h3>
                <p className="text-sm text-gray-600 flex items-start">
                  <MapPin size={18} className="mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                  {ticket.navDetails}
                </p>
                  <button onClick={() => navigate('campus-map')} className="mt-7 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-3 rounded-md transition duration-100">
                   Use Campus Map
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}
        <button onClick={() => navigate('Dashboard')} className="mt-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150">
                Back to Dashboard
            </button>
    </div>
  );
};

const CampusMapPage = () => {
  const { navigate } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // Implement your search logic here using the searchQuery
    console.log('Searching for:', searchQuery);
    // You might want to navigate to a search results page or update the map
    // based on the search query.
  };

  const handleMakeRequest = () => {
    navigate('requestService'); // Or navigate to the specific request service page
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Campus Map</h1>

      <div className="flex items-center mb-4">
        <input
          type="text"
          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
          placeholder="Search for a building or location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150"
        >
          Search
        </button>
      </div>

      {/* Display the image without the link */}
      <img
        src="/asuMap.png"
        alt="school-q-pwa/src/asuMap.png"
        className="w-full rounded-md shadow-md"
        style={{ maxHeight: '390px', height: 'auto' }}
      />
      <p className="text-gray-600 mt-4 text-sm">
        Explore the campus using the map above. Use the search bar to find specific locations.
      </p>
      {/* You could add interactive map elements here using a library like Leaflet or Google Maps API */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => navigate('Dashboard')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150"
        >
          Back to Dashboard
        </button>
        <button
          onClick={handleMakeRequest}
          className="bg-green-500 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150"
        >
          Make a Request
        </button>
      </div>
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
  const {navigate} = useAuth();
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
            <button onClick={() => navigate('Dashboard')} className="mt-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150">
                Back to Dashboard
            </button>
        </div>
    );
};

const ServiceManagementPage = () => {
  const {navigate } = useAuth();
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
            <button onClick={() => navigate('Dashboard')} className="mt-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150">
                Back to Dashboard
            </button>
        </div>
    );
};
const OfficeManagementPage = () => {
  const { navigate } = useAuth();
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
             <button onClick={() => navigate('Dashboard')} className="mt-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150">
                Back to Dashboard
            </button>
        </div>
    );
};

const ProfilePage = () => {
  const { user,navigate } = useAuth();
  return (
    <div className="bg-white p-8 rounded-xl shadow-xl max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Profile</h1>
      <div className="space-y-4">
        <div className="flex items-center justify-center mb-6">
            <span className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-blue-500 ring-4 ring-blue-200">
                <span className="text-4xl font-medium leading-none text-white">{user?.email ? user.email.substring(0,1).toUpperCase() : 'U'}</span>
            </span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address:</label>
          <p className="mt-1 text-md text-gray-800 bg-gray-100 p-3 rounded-md">{user?.email || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Role:</label>
          <p className="mt-1 text-md text-gray-800 bg-gray-100 p-3 rounded-md capitalize">{user?.role || 'N/A'}</p>
        </div>
        {user?.role === 'student' && user?.studentId && ( // Assuming studentId might be stored in user object after login/registration
          <div>
            <label className="block text-sm font-medium text-gray-700">Student ID:</label>
            <p className="mt-1 text-md text-gray-800 bg-gray-100 p-3 rounded-md">{user.studentId}</p>
          </div>
        )}
         {user?.role === 'staff' && user?.staffId && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Staff ID:</label>
            <p className="mt-1 text-md text-gray-800 bg-gray-100 p-3 rounded-md">{user.staffId}</p>
          </div>
        )}
        {/* Add more profile update fields and logic here as needed */}
        <div className="pt-4">
            <button type="button" className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Edit3 size={16} className="mr-2" /> Edit Profile 
            </button>
        </div>
      </div>
      <button onClick={() => navigate('Dashboard')} className="mt-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150">
                Back to Dashboard
            </button>
    </div>
  );
};



// App Content Renderer
const AppContent = () => {
  const { user, currentPage, pageNavigationProps } = useAuth();

  const renderPage = () => {
    switch (currentPage) {
      case 'login': return <LoginPage />;
      case 'register': return <RegisterPage />;
      case 'studentDashboard': return <Dashboard />;
      case 'visitorDashboard': return <Dashboard />; // Visitors use the same Dashboard component
      case 'staffDashboard': return <StaffDashboard />;
      case 'adminDashboard': return <AdminDashboard />;
      case 'serviceList': return <ServiceListPage />;
      case 'requestService': return <RequestServicePage {...pageNavigationProps} />;
      case 'myTickets': return <MyTicketsPage {...pageNavigationProps} />;
      case 'campus-map': return <CampusMapPage />;
      case 'profile': return <ProfilePage />;
      case 'queueManagement': return <QueueManagementPage />;
      case 'userManagement': return <UserManagementPage />;
      case 'serviceManagement': return <ServiceManagementPage />;
      case 'officeManagement': return <OfficeManagementPage />;
      default:
        // If logged in and unknown page, go to user's dashboard, else login
        if (user) {
            if (user.role === 'student') return <Dashboard />;
            if (user.role === 'visitor') return <Dashboard />;
            if (user.role === 'staff') return <StaffDashboard />;
            if (user.role === 'admin') return <AdminDashboard />;
        }
        return <LoginPage />;
    }
  };

  if (currentPage === 'login' || currentPage === 'register') {
    return renderPage();
  }

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;