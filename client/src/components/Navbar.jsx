import React from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { isAuth, signout } from "../auth/Helpers";
import { useNavigate } from "react-router-dom";

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        signout(() => {
            navigate('/');
            // window.location.reload(); // Reload the component after logout
        });
    };

    return (
        <div className="bg-gray-800 px-4 py-3 flex justify-between">
            <div className="flex items-center text-xl">
                <FaBars
                    className="text-white me-4 cursor-pointer"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                />
                <span className="text-white font-semibold">{isAuth().name}</span>
            </div>
            <div className="flex items-center gap-x-5">
                <div className="relative">
                    <button className="text-white group">
                        <FaUserCircle className="w-6 h-6 mt-1" />
                        <div className="z-10 hidden absolute bg-white rounded-lg shadow w-32 group-focus:block top-full right-0">
                            <ul className="py-2 text-sm text-gray-950">
                                {isAuth() && (
                                    <li onClick={handleLogout}>Log Out</li>
                                )}
                            </ul>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
