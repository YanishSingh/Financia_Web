// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import logo from '../assets/Logo/Financia.png';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // On mount, check if the user is logged in (from localStorage)
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Error parsing user from localStorage:', err);
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/'); // redirect to home page on logout
  };

  const handleLogoClick = () => {
    if (user) {
      // If logged in, clicking the logo should refresh the dashboard.
      navigate('/dashboard');
    } else {
      // If not logged in, redirect to home.
      navigate('/');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Logo and App Name */}
        <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
          <img src={logo} alt="Financia Logo" className="w-10 h-10 mr-2" />
          <span className="text-4xl font-bold text-[#212325]" style={{ fontFamily: 'Moonet, sans-serif' }}>
            Financia
          </span>
        </div>
        {/* Right: Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {!user ? (
            <>
              <ScrollLink
                to="hero"
                smooth={true}
                duration={500}
                className="cursor-pointer text-gray-800 hover:text-[#7F3DFF]"
              >
                Home
              </ScrollLink>
              {/* Add other public links as needed */}
            </>
          ) : (
            <div className="relative">
              <img
                src={user.profileImage || '/default-profile.png'}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded border z-10">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/update-profile'); // Ensure this route exists
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Update Profile
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Mobile Menu Icon (optional) */}
        <div className="md:hidden">
          <button className="text-gray-800 hover:text-[#7F3DFF] focus:outline-none">
            Menu
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
