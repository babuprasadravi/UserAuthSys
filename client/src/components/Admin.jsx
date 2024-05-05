import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import AdminProfile from "../views/AdminProfile";
export default function Admin() {
    const [sidebarOpen, setSidebarOpen] = useState(false);  
    return (
        <div className='flex'>
            <Sidebar sidebarOpen={sidebarOpen}/>
            <div className={`${sidebarOpen ? "" : "ml-64"} w-full`}>
                <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="flex">
                    <div className="flex-1 p-8">
                        <AdminProfile />
                    </div>
                </div>
            </div>  
        </div>
    );
}
