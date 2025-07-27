import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChevronDown, LogOut, User, LayoutDashboard, Ticket, Users, BookOpen, MapPin, Search, Bell } from 'lucide-react';



const Navbar = () => {
  const navigate = useNavigate();       
  const { user, logout, currentPage } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // New state for modal
 
   if (!user) return null;
 
   const commonDropdownLinks = [
     { name: 'My Profile', page: '/profile', icon: <User className="w-4 h-4 mr-2" /> },
   ];
 
   const studentOrVisitorLinks = [
     { name: 'Dashboard', page: user.role === 'student' ? '/student' : '/visitor', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
     { name: 'Find Service', page: '/services', icon: <Search className="w-4 h-4 mr-2" /> },
     { name: 'My Tickets', page: '/my-tickets', icon: <Ticket className="w-4 h-4 mr-2" /> },
   ];
 
   const staffLinks = [
     { name: 'Dashboard', page: '/staff', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
     { name: 'Manage Queue', page: '/queueManagement', icon: <Users className="w-4 h-4 mr-2" /> },
   ];
 
   const adminLinks = [
     { name: 'Dashboard', page: '/admin', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
     { name: 'Manage Users', page: '/userManagement', icon: <Users className="w-4 h-4 mr-2" /> },
     { name: 'Manage Services', page: '/serviceManagement', icon: <BookOpen className="w-4 h-4 mr-2" /> },
     { name: 'Manage Offices', page: '/officeManagement', icon: <MapPin className="w-4 h-4 mr-2" /> },
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
  logout(); // clear auth data
  setShowLogoutModal(false); // close modal
  navigate('/login'); // ✅ navigate to login page
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

 export default Navbar;