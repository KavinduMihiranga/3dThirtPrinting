import React, { useState, useEffect } from 'react';
import TshirtImg from "../assets/TshirtPrintingImg.jpg";
import CartIcon from "../components/CartIcon";
import { Link } from 'react-router-dom';

function MenuBar(props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [cartItems] = useState(3);

    // Add scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                            Kavindu T-Shrirt Printing
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

                        {/* Sign Up Button */}
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
                        
                        {/* Mobile Phone & Sign Up */}
                        <div className="pt-4 border-t border-white/20">
                            <div className="flex items-center space-x-2 px-4 py-2 text-white">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                                </svg>
                                <span className="font-medium">(+94) 783 688 031</span>
                            </div>
                            <Link 
                                to="/customer-auth" 
                                className="block mx-4 mt-2 px-6 py-3 bg-white text-green-600 rounded-full font-bold text-center transition-all duration-300 hover:bg-gray-100 hover:scale-105"
                                onClick={() => setIsOpen(false)}
                            >
                                Sign Up
                            </Link>
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