import React,{useState} from 'react';
import TshirtImg from "../assets/TshirtPrintingImg.jpg";// Adjust the path to your logo image
import CartIcon from "../components/CartIcon";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom


function MenuBar(props) {
    const [isOpen, setIsOpen] = useState(false);
 const [cartItems, setCartItems] = useState(3);
    return (
        <nav className="text-green-150 bg-gradient-to-r from-green-100 to-blue-120 p-1">
      <div className="flex items-center p-1 justify-between">
        <img src={TshirtImg} alt="" className="w-32 h-20 object-cover rounded-lg"/>
        
        {/* Toggle Button for Mobile */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        {/* Menu Items */}
        <ul className={`md:flex space-x-6 ${isOpen ? "block" : "hidden"} md:block`}>
          <li className="hover:text-gray-500 text-lg relative font-bold tracking-widest text-center text-transparent bg-gradient-to-r from-blue-950 bg-clip-text to-green-400"><Link to="/">Home</Link></li>
          <li className="hover:text-gray-500 text-lg relative font-bold tracking-widest text-center text-transparent bg-gradient-to-r from-blue-950 bg-clip-text to-green-400"><Link to="/productPage">Product</Link></li>
          <li className="hover:text-gray-500 text-lg relative font-bold tracking-widest text-center text-transparent bg-gradient-to-r from-blue-950 bg-clip-text to-green-400"><Link to="/cartPage">Order</Link></li>
          <li className="hover:text-gray-500 text-lg relative font-bold tracking-widest text-center text-transparent bg-gradient-to-r from-blue-950 bg-clip-text to-green-400"><Link to="/aboutUs">AboutUs</Link></li>
          <li className="hover:text-gray-500 text-lg relative font-bold tracking-widest text-center text-transparent bg-gradient-to-r from-blue-950 bg-clip-text to-green-400"><Link to="/contactUs">ContactUs</Link></li>
          <li className="text-lg relative font-bold tracking-widest text-center text-transparent bg-gradient-to-r from-blue-950 bg-clip-text to-green-400"><a href="#">(+94783688031)</a></li>

           <li className="flex items-center">
                        <Link 
                            to="/customer-auth" 
                            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
                        >
                            Sign Up
                        </Link>
                    </li>

         <CartIcon itemCount={"5"} />
        </ul>
      </div>
       
    </nav>

    );
}

export default MenuBar;