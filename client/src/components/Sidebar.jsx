import React from "react";
import { FaHome, FaUserCircle } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { isAuth } from "../auth/Helpers"; // Import the isAuth helper function

export default function Sidebar({ sidebarOpen }) {
    // Get user info from local storage
    const user = isAuth();

    return (
        <div className={`${sidebarOpen ? " hidden " : " block "} w-64 bg-gray-800 fixed h-full px-4 py-2`}>
            <div className="my-2 mb-4">
                <h1 className="text-2x text-white font-bold text-center">HRMS Dashboard</h1>
            </div>
            <hr className="mb-5" />
            <ul className="mt-3 text-white font-bold">
                <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
                    <Link to="/" className="px-3">
                        <FaHome className="inline-block w-6 h-6  mr-2 -mt-2"></FaHome>
                        Home
                    </Link>
                </li>
                {user && user.role === 'subscriber' && ( // Show only if user is a subscriber
                    <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
                        <Link to="/user" className="px-3">
                            <FaUserCircle className="inline-block w-6 h-6  mr-2 -mt-2"></FaUserCircle>
                            User Profile
                        </Link>
                    </li>
                )}
                {user && user.role === 'admin' && ( // Show only if user is an admin
                    <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
                        <Link to="/admin" className="px-3">
                            <RiAdminLine className="inline-block w-6 h-6  mr-2 -mt-2"></RiAdminLine>
                            Admin Profile
                        </Link>
                    </li>
                )}
            </ul>
        </div>
    );
}
