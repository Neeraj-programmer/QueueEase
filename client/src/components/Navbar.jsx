import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, LogOut, Menu, X, Ticket, History, UserCircle, Building2, ClipboardList, Users, QrCode } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary-600 tracking-tight">
                QueueEase
              </Link>
            </div>
            {user && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                {user.role === 'admin' ? (
                  <>
                    <Link to="/admin/dashboard" className="border-transparent text-gray-500 hover:border-primary-500 hover:text-primary-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                    </Link>
                    <Link to="/admin/departments" className="border-transparent text-gray-500 hover:border-primary-500 hover:text-primary-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      <Building2 className="w-4 h-4 mr-2" /> Departments
                    </Link>
                    <Link to="/admin/staff" className="border-transparent text-gray-500 hover:border-primary-500 hover:text-primary-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      <Users className="w-4 h-4 mr-2" /> Manage Staff
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" className="border-transparent text-gray-500 hover:border-primary-500 hover:text-primary-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                    </Link>
                    <Link to="/generate-token" className="border-transparent text-gray-500 hover:border-primary-500 hover:text-primary-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      <Ticket className="w-4 h-4 mr-2" /> Get Token
                    </Link>
                    <Link to="/history" className="border-transparent text-gray-500 hover:border-primary-500 hover:text-primary-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      <History className="w-4 h-4 mr-2" /> History
                    </Link>
                  </>
                )}
              </div>
            )}
            {/* Show Visitor links when not logged in */}
            {!user && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <Link to="/visitor-token" className="border-transparent text-gray-500 hover:border-primary-500 hover:text-primary-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  <Ticket className="w-4 h-4 mr-2" /> Visitor Token
                </Link>
                <Link to="/visitor-status/check" className="border-transparent text-gray-500 hover:border-primary-500 hover:text-primary-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  <History className="w-4 h-4 mr-2" /> Check Status
                </Link>
              </div>
            )}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 font-medium">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                {user.role === 'admin' ? (
                  <>
                    <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">Dashboard</Link>
                    <Link to="/admin/departments" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">Departments</Link>
                    <Link to="/admin/staff" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">Manage Staff</Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">Dashboard</Link>
                    <Link to="/generate-token" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">Get Token</Link>
                    <Link to="/history" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">History</Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/visitor-token" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-base font-medium text-primary-600 hover:text-primary-800 hover:bg-primary-50">Visitor Token</Link>
                <Link to="/visitor-status/check" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-base font-medium text-primary-600 hover:text-primary-800 hover:bg-primary-50">Check Status</Link>
                <div className="border-t border-gray-200 my-2"></div>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
