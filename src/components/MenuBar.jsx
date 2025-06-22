import React,{useState} from 'react';
import TshirtImg from "../assets/TshirtPrintingImg.jpg";// Adjust the path to your logo image
import CartIcon from "../components/CartIcon";

function MenuBar(props) {
    const [isOpen, setIsOpen] = useState(false);
 const [cartItems, setCartItems] = useState(3);
    return (
        <nav className="bg-gray-400 text-white p-1">
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
          <li className="hover:text-gray-400 text-lg relative font-bold tracking-widest text-center text-transparent bg-gradient-to-r from-blue-950 bg-clip-text to-green-400"><a href="#">Home</a></li>
          <li className="hover:text-gray-400 text-lg relative font-bold tracking-widest text-center text-transparent bg-gradient-to-r from-blue-950 bg-clip-text to-green-400"><a href="#">Order</a></li>
          <li className="hover:text-gray-400 text-lg relative font-bold tracking-widest text-center text-transparent bg-gradient-to-r from-blue-950 bg-clip-text to-green-400"><a href="#">AboutUs</a></li>
          <li className="hover:text-gray-400 text-lg relative font-bold tracking-widest text-center text-transparent bg-gradient-to-r from-blue-950 bg-clip-text to-green-400"><a href="#">ContactUs</a></li>
          <li className="text-lg relative font-bold tracking-widest text-center text-transparent bg-gradient-to-r from-blue-950 bg-clip-text to-green-400"><a href="#">(+94783688031)</a></li>
         <CartIcon itemCount={"5"} />
        </ul>
      </div>
       
    </nav>

    );
}

export default MenuBar;