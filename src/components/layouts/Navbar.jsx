import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/student', label: 'Students' },
  { to: '/faculty', label: 'Faculty' },
  { to: '/admin', label: 'Admin' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Dummy logout handler (replace with your auth logic)
  const handleLogout = () => {
    // Example: localStorage.removeItem('user');
    // Example: signOut(auth);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-blue-400 rounded-full p-2 shadow-md hover:scale-110 transition-transform duration-300">
            {/* New logo: Graduation cap */}
            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L1 9l11 6 9-4.91V17a1 1 0 01-2 0v-3.09l-7 3.91-9-5 1.18-.68L12 15l8.82-4.91A1 1 0 0021 9V8.09L12 3z" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-blue-700 font-mono">FYP Finder</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                location.pathname === to
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-blue-50'
              }`}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="ml-4 px-5 py-2 bg-red-500 text-white font-bold rounded-full shadow hover:bg-red-600 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4" />
            </svg>
            Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => setOpen(!open)}
          aria-label="Open menu"
        >
          <svg className="w-8 h-8 text-blue-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-blue-50 text-blue-900 transition-all duration-500 overflow-hidden ${
          open ? 'max-h-screen py-4' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col gap-2 px-6">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`py-3 px-4 rounded-lg font-semibold text-lg transition ${
                location.pathname === to
                  ? 'bg-blue-200 text-blue-900'
                  : 'hover:bg-blue-100'
              }`}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={() => { setOpen(false); handleLogout(); }}
            className="mt-3 block bg-red-500 text-white px-6 py-3 rounded-full font-bold text-center shadow hover:bg-red-600 transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
