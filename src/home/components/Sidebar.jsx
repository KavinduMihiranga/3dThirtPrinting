import React from 'react'
import logo from "../../assets/TshirtPrintingImg.jpg"
import {User,NotebookText,Shirt, Megaphone, Palette, Users, Contact, LogIn, LogOut  } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';


const NavItem = ({ icon, text, active, onclick }) => {

    const baseClasses = "flex items-center p-2 rounded-lg transition-colors duration-200 cursor-pointer";

    const activeClasses = active ? "bg-green-700 font-semibold" : "";

    const hoverClasses = "hover:bg-green-700";

    return (

        <a href="#" className={`${baseClasses} ${activeClasses} ${hoverClasses}`} onClick={onclick}>
            <span className="mr-3">{icon}</span> {/* Container for the icon with right margin */}
            <span>{text}</span> {/* Text label for the navigation item */}
        </a>
    );
};


export default function Sidebar({activation, userName, userEmail}) {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("adminToken");
  const user = JSON.parse(localStorage.getItem("adminUser")|| '{}');

  const handleAdminButtonClick = () => {
        console.log("Admin button clicked");
        navigate("/adminDashboard");
    };
    const handleCustomerButtonClick = () => {
        console.log("Customer button clicked");
        navigate("/customerDashboard");
    };

    const handleOrderButtonClick = () => {
        console.log("Product button clicked");
        navigate("/orderDashboard");
    }

    const handleProductButtonClick = () => {
        console.log("Announcement button clicked");
        navigate("/productDashboard");
    }

    const handleAnnouncementButtonClick = () => {
        console.log("Announcement button clicked");
        navigate("/announcements");
    }

    const handleDesignOrderButtonClick = () => {
        console.log("Design order button clicked");
        navigate("/design-inquiry");
    }

    const handleContactUsButtonClick = () => {
        console.log("Contact Us button clicked");
        navigate("/contactUsManagement");
    }

    const handleLoginClick = () => {
        console.log("Login button clicked");
        navigate("/login");
    }
    const handleLogoutClick = () => {
        console.log("Logout button clicked");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/login");

        alert("Logged out successfully!");
    }
  // Get user initials for avatar
    const getUserInitials = () => {
        if (user?.name) {
            return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
        } else if (user?.username) {
            return user.username.charAt(0).toUpperCase();
        }
        return 'A';
    }
  return (
    <div className="w-64 bg-green-800 text-white flex flex-col">
        <div className="flex justify-center mb-6 mt-4">
            <img
                src={logo}
                alt="Company Logo"
                className="w-28 h-28 object-cover rounded-full border-2 border-white shadow-md" // Added more styling for the logo
            />
        </div>

          {/* User Info Section */}
            {isLoggedIn && user && (
                <div className="px-4 mb-6 text-center">
                    <div className="flex justify-center mb-3">
                        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-white">
                            {getUserInitials()}
                        </div>
                    </div>
                    <h3 className="font-semibold text-lg truncate">
                        {user.name || user.username || 'Admin User'}
                    </h3>
                    <p className="text-green-200 text-sm truncate">
                        {user.email || 'admin@example.com'}
                    </p>
                    <p className="text-green-300 text-xs mt-1 capitalize">
                        {user.role || 'Administrator'}
                    </p>
                </div>
            )}
            
        <h2 className="text-2xl font-bold text-center mb-8 tracking-wide">Admin Panel</h2>

         {/* Login/Logout Section */}
            <div className="p-2 border-t border-green-700">
                {isLoggedIn ? (
                    <button
                        onClick={handleLogoutClick}
                        className="flex items-center w-full p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
                    >
                        <LogOut size={18} className="mr-3" />
                        <span>Logout</span>
                    </button>
                ) : (
                    <button
                        onClick={handleLoginClick}
                        className="flex items-center w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                    >
                        <LogIn size={18} className="mr-3" />
                        <span>Login</span>
                    </button>
                )}
            </div>

      <nav className='space-y-4 mb-6'>
      <NavItem icon={<User size={18}/>} text="Admin" active={activation} onclick={handleAdminButtonClick}/>
      <NavItem icon={<Users size={18}/>} text="Customer" active={activation} onclick={handleCustomerButtonClick}/>
      <NavItem icon={<NotebookText  size={18}/>} text="Order" active={activation} onclick={handleOrderButtonClick}/>
      <NavItem icon={<Shirt size={18}/>} text="Product" active={activation} onclick={handleProductButtonClick}/>
      <NavItem icon={<Megaphone  size={18}/>} text="Announcement" active={activation} onclick={handleAnnouncementButtonClick}/>
      <NavItem icon={<Palette  size={18}/>} text="DesignOrder" active={activation} onclick={handleDesignOrderButtonClick}/>
      <NavItem icon={<Contact  size={18}/>} text="Contact Us" active={activation} onclick={handleContactUsButtonClick}/>
      </nav>

      
    </div>
  )
}
