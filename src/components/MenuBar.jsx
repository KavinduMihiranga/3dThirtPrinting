import React, { useState, useEffect } from 'react';
import TshirtImg from "../assets/TshirtPrintingImg.jpg";
import CartIcon from "../components/CartIcon";
import { Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

function MenuBar(props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [cartItems] = useState(3);
    const [customer, setCustomer] = useState(null);

    // Check if customer is logged in
    useEffect(() => {
        const customerData = localStorage.getItem('customerUser');
        if (customerData) {
            setCustomer(JSON.parse(customerData));
        }
    }, []);

    // Add scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('customerToken');
        localStorage.removeItem('customerUser');
        setCustomer(null);
        window.location.reload(); // Refresh to update UI
    };

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-white/95 backdrop-blur-md shadow-lg text-gray-800' 
                    : 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
            }`}
            style={{ height: '4rem' }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-3">
                            <img 
                                src={TshirtImg} 
                                alt="T-Shirt Printing" 
                                className="w-12 h-12 object-cover rounded-lg shadow-md"
                            />
                            <span className={`text-xl font-bold ${
                                isScrolled 
                                    ? 'text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text'
                                    : 'text-white'
                            }`}>
                                Kavindu T-Shirt Printing
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-1">
                            <Link 
                                to="/" 
                                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/20 hover:scale-105"
                            >
                                Home
                            </Link>
                            <Link 
                                to="/productPage" 
                                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/20 hover:scale-105"
                            >
                                Products
                            </Link>
                            <Link 
                                to="/cartPage" 
                                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/20 hover:scale-105"
                            >
                                Orders
                            </Link>
                            <Link 
                                to="/aboutUs" 
                                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/20 hover:scale-105"
                            >
                                About
                            </Link>
                            <Link 
                                to="/contactUs" 
                                className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/20 hover:scale-105"
                            >
                                Contact
                            </Link>
                        </div>

                        {/* Right Section - Desktop */}
                        <div className="hidden md:flex items-center space-x-4">
                            {/* Phone Number */}
                            <div className={`flex items-center space-x-2 ${
                                isScrolled ? 'text-gray-600' : 'text-white'
                            }`}>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                                </svg>
                                <span className="font-medium">(+94) 783 688 031</span>
                            </div>

                            {/* Customer Info or Sign Up Button */}
                            {customer ? (
                                <div className="flex items-center space-x-3">
                                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                                        isScrolled ? 'bg-green-50 text-gray-800' : 'bg-white/20 text-white'
                                    }`}>
                                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {customer.name && customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                Hi, {customer.name ? customer.name.split(' ')[0] : 'Customer'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                                            isScrolled 
                                                ? 'text-red-600 hover:bg-red-50' 
                                                : 'text-white hover:bg-white/20'
                                        }`}
                                    >
                                        <LogOut size={16} />
                                        <span className="text-sm">Logout</span>
                                    </button>
                                </div>
                            ) : (
                                /* Sign Up Button */
                                <Link 
                                    to="/customer-auth" 
                                    className={`px-6 py-2 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                                        isScrolled
                                            ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600'
                                            : 'bg-white text-green-600 hover:bg-gray-100'
                                    }`}
                                >
                                    Sign Up
                                </Link>
                            )}

                            {/* Cart Icon */}
                            <CartIcon itemCount={cartItems.toString()} />
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className={`md:hidden p-2 rounded-lg transition-all duration-200 ${
                                isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20'
                            }`}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                                <span className={`block h-0.5 w-6 transition-all duration-300 ${
                                    isOpen ? 'rotate-45 translate-y-1.5' : ''
                                } ${isScrolled ? 'bg-gray-800' : 'bg-white'}`}></span>
                                <span className={`block h-0.5 w-6 transition-all duration-300 ${
                                    isOpen ? 'opacity-0' : 'opacity-100'
                                } ${isScrolled ? 'bg-gray-800' : 'bg-white'}`}></span>
                                <span className={`block h-0.5 w-6 transition-all duration-300 ${
                                    isOpen ? '-rotate-45 -translate-y-1.5' : ''
                                } ${isScrolled ? 'bg-gray-800' : 'bg-white'}`}></span>
                            </div>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    <div className={`md:hidden transition-all duration-300 overflow-hidden ${
                        isOpen ? 'max-h-96 py-4' : 'max-h-0'
                    }`}>
                        <div className="flex flex-col space-y-4 px-2">
                            {/* Customer Info in Mobile */}
                            {customer && (
                                <div className="flex items-center space-x-3 p-3 bg-white/20 rounded-lg">
                                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {customer.name && customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">
                                            Welcome, {customer.name || 'Customer'}
                                        </p>
                                        <p className="text-sm text-green-100">{customer.email}</p>
                                    </div>
                                </div>
                            )}
                            
                            <Link 
                                to="/" 
                                className="px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-white/20"
                                onClick={() => setIsOpen(false)}
                            >
                                Home
                            </Link>
                            <Link 
                                to="/productPage" 
                                className="px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-white/20"
                                onClick={() => setIsOpen(false)}
                            >
                                Products
                            </Link>
                            <Link 
                                to="/cartPage" 
                                className="px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-white/20"
                                onClick={() => setIsOpen(false)}
                            >
                                Orders
                            </Link>
                            <Link 
                                to="/aboutUs" 
                                className="px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-white/20"
                                onClick={() => setIsOpen(false)}
                            >
                                About
                            </Link>
                            <Link 
                                to="/contactUs" 
                                className="px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-white/20"
                                onClick={() => setIsOpen(false)}
                            >
                                Contact
                            </Link>
                            
                            {/* Mobile Phone & Auth Buttons */}
                            <div className="pt-4 border-t border-white/20">
                                <div className="flex items-center space-x-2 px-4 py-2 text-white">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                                    </svg>
                                    <span className="font-medium">(+94) 783 688 031</span>
                                </div>
                                
                                {customer ? (
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                        className="block mx-4 mt-2 px-6 py-3 bg-red-600 text-white rounded-full font-bold text-center transition-all duration-300 hover:bg-red-700 hover:scale-105"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <Link 
                                        to="/customer-auth" 
                                        className="block mx-4 mt-2 px-6 py-3 bg-white text-green-600 rounded-full font-bold text-center transition-all duration-300 hover:bg-gray-100 hover:scale-105"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div style={{ height: '4rem' }} />
        </>
    );
}

export default MenuBar;