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
import Design from "./DesignPage/dashboard/DesignDashboard.jsx";
import ProductDetail from "./product/components/ProductDetail.jsx";
import AdminHomePage from "./home/dashboard/AdminHomePage.jsx";
import PaymentGateway from "./paymentGateway/PaymentGateway.jsx";
import PaymentSuccess from "./paymentGateway/PaymentSuccess.jsx";
import AnnouncementDashboard from "./announcement/dashboard/Dashboard.jsx"
import AddAnnouncement from "./announcement/components/AddAnnouncement.jsx";
import EditAnnouncement from "./announcement/components/EditAnnouncement.jsx";
import DesignInquiryDashboard from "./designOrder/dashboard/Dashboard.jsx";
import DesignOrderDetails from "./designOrder/components/DesignOrderDetails.jsx";
import ProtectedRoute from './components/ProtectedRoute';
import CustomerAuthRoute from "./login/CustomerLogin.jsx";
import CustomerRegister from "./register/CustomerRegister.jsx";
import ContactUsManagement from "./contactUs/dashboard/ContactUsManagement.jsx";
import ContactUsDetails from "./contactUs/components/ContactDetails.jsx";
import CustomerForgotPassword from "./login/CustomerForgotPassword.jsx";
import CustomerResetPassword from "./login/CustomerResetPassword.jsx";

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
    "/addOrder",
    "/payment",
    "/payment-success",
    "/announcementDashboard",
    "/addAnnouncement",
    "/editAnnouncements",
    "/announcements",
    "/design-inquiry",
    "/designOrderDetails",
    "/contactUsManagement",
    "/contactUsDetails",
    "/customer-forgot-password",
    "/customer-reset-password",
  ];
  
  const shouldHideMenuBar = noMenuBarPaths.some(excludedPath => 
    location.pathname.startsWith(excludedPath)
  );
  return (
    <>
      {!shouldHideMenuBar && <MenuBar />}

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
        
        {/* Payment Routes */}
        <Route path="/payment" element={<PaymentGateway />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/Reset-password" element={<ResetPassword />} />
        <Route path="/customer-forgot-password" element={<CustomerForgotPassword />} />
        <Route path="/customer-reset-password" element={<CustomerResetPassword />} />

        {/* Protected Admin Routes */}
        <Route 
          path="/adminDashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/adminHomePage" 
          element={
            <ProtectedRoute>
              <AdminHomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/addAdmin" 
          element={
            <ProtectedRoute>
              <AddAdmin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/addAdmin/:id" 
          element={
            <ProtectedRoute>
              <AddAdmin />
            </ProtectedRoute>
          } 
        />

        {/* Protected Customer Routes */}
        <Route 
          path="/customerDashboard" 
          element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/addCustomer" 
          element={
            <ProtectedRoute>
              <AddCustomer />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/addCustomer/:id" 
          element={
            <ProtectedRoute>
              <AddCustomer />
            </ProtectedRoute>
          } 
        />

        {/* Protected Product Routes */}
        <Route 
          path="/productDashboard" 
          element={
            <ProtectedRoute>
              <ProductDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/addProduct" 
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/addProduct/:id" 
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          } 
        />

        {/* Protected Order Routes */}
        <Route 
          path="/orderDashboard" 
          element={
            <ProtectedRoute>
              <OrderDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/addOrder" 
          element={
            <ProtectedRoute>
              <AddOrder />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/addOrder/:id" 
          element={
            <ProtectedRoute>
              <AddOrder />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Announcement Routes */}
        <Route 
          path="/announcements" 
          element={
            <ProtectedRoute>
              <AnnouncementDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/addAnnouncement" 
          element={
            <ProtectedRoute>
              <AddAnnouncement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/editAnnouncements/:id" 
          element={
            <ProtectedRoute>
              <EditAnnouncement />
            </ProtectedRoute>
          } 
        />

        {/* Protected Design Inquiry Routes */}
        <Route 
          path="/design-inquiry" 
          element={
            <ProtectedRoute>
              <DesignInquiryDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/designOrderDetails/:id" 
          element={
            <ProtectedRoute>
              <DesignOrderDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
        path="/customer-auth"
        element={
          <ProtectedRoute>
            <CustomerAuthRoute />
          </ProtectedRoute>
        }
        />
        <Route 
        path="/customer-register"
        element={
          <ProtectedRoute>
            <CustomerRegister />
          </ProtectedRoute>
        }
        />

        {/* Protected Contact Us Routes */}
        <Route 
          path="/contactUsManagement" 
          element={
            <ProtectedRoute>
              <ContactUsManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/contactUsDetails/:id" 
          element={
            <ProtectedRoute>
              <ContactUsDetails />
            </ProtectedRoute>
          } 
        />
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