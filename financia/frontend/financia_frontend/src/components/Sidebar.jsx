// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaWallet, FaChartBar, FaSyncAlt, FaRegFileAlt } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 shadow-xl">
      <h2 className="text-2xl font-extrabold mb-8 text-center tracking-wide">Financia</h2>
      <nav className="space-y-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center p-3 rounded transition-colors duration-200 hover:bg-gray-700 ${
              isActive ? 'bg-gray-700' : ''
            }`
          }
        >
          <FaTachometerAlt className="mr-3 text-xl" />
          <span className="font-semibold">Dashboard</span>
        </NavLink>
        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `flex items-center p-3 rounded transition-colors duration-200 hover:bg-gray-700 ${
              isActive ? 'bg-gray-700' : ''
            }`
          }
        >
          <FaWallet className="mr-3 text-xl" />
          <span className="font-semibold">Transactions</span>
        </NavLink>
        <NavLink
          to="/budgets"
          className={({ isActive }) =>
            `flex items-center p-3 rounded transition-colors duration-200 hover:bg-gray-700 ${
              isActive ? 'bg-gray-700' : ''
            }`
          }
        >
          <FaChartBar className="mr-3 text-xl" />
          <span className="font-semibold">Budgets</span>
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `flex items-center p-3 rounded transition-colors duration-200 hover:bg-gray-700 ${
              isActive ? 'bg-gray-700' : ''
            }`
          }
        >
          <FaRegFileAlt className="mr-3 text-xl" />
          <span className="font-semibold">Reports</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
