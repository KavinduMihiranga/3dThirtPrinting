import React from 'react'
import logo from "../../assets/TshirtPrintingImg.jpg"
import {User,NotebookText,Shirt, Megaphone  } from 'lucide-react';

const NavItem = ({ icon, text, active }) => {

    const baseClasses = "flex items-center p-2 rounded-lg transition-colors duration-200 cursor-pointer";

    const activeClasses = active ? "bg-green-700 font-semibold" : "";

    const hoverClasses = "hover:bg-green-700";

    return (

        <a href="#" className={`${baseClasses} ${activeClasses} ${hoverClasses}`}>
            <span className="mr-3">{icon}</span> {/* Container for the icon with right margin */}
            <span>{text}</span> {/* Text label for the navigation item */}
        </a>
    );
};


export default function Sidebar({activation}) {


  return (
    <div className="bg-green-900 text-white w-64 min-h-screen p-4">
        <div className="flex justify-center mb-6 mt-4">
            <img
                src={logo}
                alt="Company Logo"
                className="w-28 h-28 object-cover rounded-full border-2 border-white shadow-md" // Added more styling for the logo
            />
        </div>
        <h2 className="text-2xl font-bold text-center mb-8 tracking-wide">Admin Panel</h2>

      <nav className='space-y-4 mb-6'>
      <NavItem icon={<User size={18}/>} text="Users" active={activation} />
      <NavItem icon={<NotebookText  size={18}/>} text="Order" active={activation}/>
      <NavItem icon={<Shirt size={18}/>} text="Product" active={activation}/>
      <NavItem icon={<Megaphone  size={18}/>} text="Announcement" active={activation}/>
      </nav>
    </div>
  )
}
