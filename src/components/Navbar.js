import React, { useState } from 'react';
import {
  ChevronDown, LogOut, User, Bell, Users, LayoutDashboard,
  Ticket, BookOpen, MapPin, Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const linkSets = {
  student: [
    { name: 'Dashboard',       page: 'studentDashboard', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
    { name: 'Find Service',    page: 'serviceList',      icon: <Search className="w-4 h-4 mr-2" /> },
    { name: 'My Tickets',      page: 'myTickets',        icon: <Ticket className="w-4 h-4 mr-2" /> }
  ],
  staff: [
    { name: 'Dashboard',       page: 'staffDashboard',   icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
    { name: 'Manage Queue',    page: 'queueManagement',  icon: <Users className="w-4 h-4 mr-2" /> }
  ],
  admin: [
    { name: 'Dashboard',       page: 'adminDashboard',   icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
    { name: 'Manage Users',    page: 'userManagement',   icon: <Users className="w-4 h-4 mr-2" /> },
    { name: 'Manage Services', page: 'serviceManagement',icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { name: 'Manage Offices',  page: 'officeManagement', icon: <MapPin className="w-4 h-4 mr-2" /> }
  ]
};

export default function Navbar() {
  const { user, logout, navigate, page } = useAuth();
  const [open, setOpen] = useState(false);
  if (!user) return null;

  const navLinks = linkSets[user.role];

  /* paste your existing Navbar JSX here
     – replace every `currentPage` with `(page.name ?? page)` */
}
