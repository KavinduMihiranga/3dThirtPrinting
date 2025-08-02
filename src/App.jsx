import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MenuBar from "./components/MenuBar";
import ProductPage from "./pages/productPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import AdminDashboard from "./admin/dashboard/AdminDashboard.jsx";
import UserDashboard from "./user/dashboard/UserDashboard.jsx";
import Login from "./login/login.jsx";
import ForgotPassword from "./login/ForgotPassword.jsx";
import ResetPassword from "./login/ResetPassword.jsx";
import AddUser from "./user/dashboard/AddUser.jsx";
import AddOrder from "./orders/components/AddOrder.jsx";
import OrderDashboard from "./admin/dashboard/OrderDashboard.jsx";
import ProductDashboard from "./admin/dashboard/ProductDashboard.jsx";
import AddProduct from "./product/dashboard/AddProduct.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Design from "./DesignPage/dashboard/dashboard.jsx"


const AppContent = () => {
  const location = useLocation();

  const noMenuBarPaths = ["/adminDashboard", "/userDashboard", "/login"];

  return (
    <>
      {!noMenuBarPaths.includes(location.pathname) && <MenuBar />}

      <Routes>
        <Route path={"/"} element={<Dashboard />} />
        <Route path={"/productPage"} element={<ProductPage />} />
        <Route path={"/cartPage"} element={<CartPage />} />
        <Route path={"/checkoutPage"} element={<CheckoutPage />} />
        <Route path={"/contactUs"} element={<ContactUs />} />
        <Route path={"/adminDashboard"} element={<AdminDashboard />} />
        <Route path={"/userDashboard"} element={<UserDashboard />} />
        <Route path={"/login"} element={<Login />} />
        <Route path={"/forgot-password"} element={<ForgotPassword />} />
        <Route path={"/Reset-password"} element={<ResetPassword />} />
        <Route path={"/addUser"} element={<AddUser />} />
        <Route path={"/addOrder"} element={<AddOrder />} />
        <Route path={"/addUser/:id"} element={<AddUser />} />
        <Route path={"/addOrder/:id"} element={<AddOrder />} />
        <Route path={"/order"} element={<OrderDashboard />} />
        <Route path={"/product"} element={<ProductDashboard />} />
        <Route path={"/addProduct"} element={<AddProduct />} />
        <Route path={"/addProduct/:id"} element={<AddProduct />} />
        <Route path={"/aboutUs"} element={<AboutUs />} />
        <Route path={"/design"} element={<Design />} />
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
