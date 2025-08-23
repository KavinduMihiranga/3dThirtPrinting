import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MenuBar from "./components/MenuBar";
import ProductPage from "./pages/productPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import AdminDashboard from "./admin/dashboard/Dashboard.jsx";
import CustomerDashboard from "./customer/dashboard/Dashboard.jsx";
import Login from "./login/login.jsx";
import ForgotPassword from "./login/ForgotPassword.jsx";
import ResetPassword from "./login/ResetPassword.jsx";
import AddCustomer from "./customer/components/AddCustomer.jsx";
import AddAdmin from "./admin/components/AddAdmin.jsx";
import AddOrder from "./orders/components/AddOrder.jsx";
import OrderDashboard from "./home/dashboard/OrderDashboard.jsx";
import ProductDashboard from "./home/dashboard/ProductDashboard.jsx";
import AddProduct from "./product/components/AddProduct.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Design from "./DesignPage/dashboard/dashboard.jsx";
import ProductDetail from "./product/components/ProductDetail.jsx";
import AdminHomePage from "./home/dashboard/AdminHomePage.jsx";
// import AnnouncementPage from './pages/AnnouncementPage';
// import AddAnnouncement from './components/announcements/AddAnnouncement';
// import EditAnnouncement from './components/announcements/EditAnnouncement';

const AppContent = () => {
  const location = useLocation();

  const noMenuBarPaths = [
    "/addAdmin",
    "/adminHomePage", 
    "/adminDashboard", 
    "/customerDashboard", 
    "/login",
    "/orderDashboard", 
    "/productDashboard", 
    "/addProduct", 
    "/addCustomer", 
    "/addOrder"
  ];

  return (
    <>
      {!noMenuBarPaths.includes(location.pathname) && <MenuBar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/productPage" element={<ProductPage />} />
        <Route path="/cartPage" element={<CartPage />} />
        <Route path="/checkoutPage" element={<CheckoutPage />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/design" element={<Design />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/Reset-password" element={<ResetPassword />} />

        {/* Admin Routes */}
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/adminHomePage" element={<AdminHomePage />} />
        <Route path="/addAdmin" element={<AddAdmin />} />
        <Route path="/addAdmin/:id" element={<AddAdmin />} />

        {/* Customer Routes */}
        <Route path="/customerDashboard" element={<CustomerDashboard />} />
        <Route path="/addCustomer" element={<AddCustomer />} />
        <Route path="/addCustomer/:id" element={<AddCustomer />} />

        {/* Product Routes */}
        <Route path="/productDashboard" element={<ProductDashboard />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/addProduct/:id" element={<AddProduct />} />

        {/* Order Routes */}
        <Route path="/orderDashboard" element={<OrderDashboard />} />
        <Route path="/addOrder" element={<AddOrder />} />
        <Route path="/addOrder/:id" element={<AddOrder />} />

        {/* <Route path="/announcements" element={<AnnouncementPage />} />
        <Route path="/addAnnouncement" element={<AddAnnouncement />} />
        <Route path="/editAnnouncement/:id" element={<EditAnnouncement />} /> */}
        
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}