import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">BudgetSphere</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:text-yellow-400">Dashboard</Link>
          </li>
          <li>
            <Link to="/register" className="hover:text-yellow-400">Register</Link>
          </li>
          <li>
            <Link to="/login" className="hover:text-yellow-400">Login</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
