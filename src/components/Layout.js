import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

<<<<<<< HEAD
const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main className="flex-grow container mx-auto px-4 py-8">
      {children}
    </main>
    <Footer />
  </div>
);

export default Layout;
=======
export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
>>>>>>> f3b23cba806bbf113229b18fcd4de879a78cecc7
