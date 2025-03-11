import React, { useState, lazy, Suspense } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chatbot from './components/Chatbot/Chatbot';
import { WishlistProvider } from "./Context/WishlistContext";
import { CartProvider } from "./Context/CartContext";
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import './App.css';

// Set default Axios base URL
axios.defaults.baseURL = 'http://localhost:5000';

// Lazy load components
const UserLogin = lazy(() => import('./pages/UserLogin'));
const AdminLogin = lazy(() => import('./pages/admin/adminlogin'));
const AdminDashboard = lazy(() => import('./pages/admin/admindashboard'));

// Lazy load groups of related components
const ProductPages = {
  Towels: lazy(() => import('./pages/Towels')),
  Bags: lazy(() => import('./pages/Bags')),
  Napkins: lazy(() => import('./pages/Napkins')),
  Bedsheets: lazy(() => import('./pages/Bedsheets')),
  Cupcoaster: lazy(() => import('./pages/Cupcoaster')),
  Bamboo: lazy(() => import('./pages/Bamboo')),
  Paperfiles: lazy(() => import('./pages/Paperfiles')),
  CustProduct: lazy(() => import('./pages/custproduct')),
  ProductPage: lazy(() => import('./pages/ProductPage')),
  ProductDetails: lazy(() => import('./pages/ProductDetails')),
};

const UserPages = {
  Cart: lazy(() => import('./pages/Cart')),
  Wishlist: lazy(() => import('./pages/Wishlist')),
  LoginSignup: lazy(() => import('./pages/LoginSignup').then(module => ({ default: module.LoginSignup }))),
  UserProfile: lazy(() => import('./pages/UserProfile')),
  MyOrders: lazy(() => import('./pages/MyOrders')),
  ReturnsOrders: lazy(() => import('./pages/ReturnsOrders')),
  UpdateLocation: lazy(() => import('./pages/Location')),
};

const AdminPages = {
  Admin: lazy(() => import('./pages/Admin')),
  AdminPanel: lazy(() => import('./pages/AdminPanel')),
  ListProduct: lazy(() => import('./components/ListProduct/ListProduct')),
  AddProduct: lazy(() => import('./components/AddProduct/AddProduct')),
  Sidebar: lazy(() => import('./components/Sidebar/Sidebar')),
};

const SuperAdminPages = {
  Login: lazy(() => import('./components/superadmin/superadminlogin')),
  Dashboard: lazy(() => import('./pages/superadmin/superadmindashboard')),
  Workers: lazy(() => import('./pages/superadmin/workers')),
  CustomerManager: lazy(() => import('./pages/superadmin/customermanager')),
  AdminRegistration: lazy(() => import('./pages/superadmin/adminregistration')),
};

const CheckoutPages = {
  CustomDesignPage: lazy(() => import('./pages/CustomDesignPage')),
  UploadDesignAndCheckout: lazy(() => import('./pages/UploadDesignAndCheckout')),
  Checkout: lazy(() => import('./pages/Checkout')),
  PlaceOrder: lazy(() => import('./pages/PlaceOrder')),
  PaymentPage: lazy(() => import('./pages/PaymentPage')),
};

const InfoPages = {
  AboutPage: lazy(() => import('./pages/AboutPage')),
  ContactUs: lazy(() => import('./pages/ContactUs')),
  Gallery: lazy(() => import('./pages/Gallery')),
  Vaagai: lazy(() => import('./pages/vaagai')),
  Varnam: lazy(() => import('./pages/varnam')),
  Siragugal: lazy(() => import('./pages/siragugal')),
};

// Loading component
const LoadingFallback = () => <div className="loading">Loading...</div>;

// Layout component to wrap routes with Header and Footer
const Layout = ({ children }) => (
  <div className="app-container">
    <Header />
    <main className="main-content">
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
    </main>
    <Footer />
  </div>
);

// Standalone component for pages without header/footer
const StandalonePage = ({ children }) => (
  <div className="standalone-page">
    <Suspense fallback={<LoadingFallback />}>
      {children}
    </Suspense>
  </div>
);

const App = () => {
  const [units, setUnits] = useState([]); 

  const addUnit = (newUnit) => {
    setUnits((prevUnits) => [...prevUnits, newUnit]);
  };

  // Function to create routes from a group of components
  const createRoutes = (components, pathPrefix = '') => {
    return Object.entries(components).map(([name, Component]) => (
      <Route 
        key={`${pathPrefix}/${name.toLowerCase()}`}
        path={`${pathPrefix}/${name.toLowerCase()}`} 
        element={<Layout><Component /></Layout>} 
      />
    ));
  };

  return (
    <WishlistProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Home route */}
            <Route path="/" element={<Layout><Home /></Layout>} />
              
            {/* UserLogin route - without Layout */}
            <Route path="/UserLogin" element={<StandalonePage><UserLogin /></StandalonePage>} />
            <Route path="/admin/login" element={<StandalonePage><AdminLogin /></StandalonePage>} />
            <Route path="/superadmin/login" element={<StandalonePage><SuperAdminPages.Login /></StandalonePage>} />

            {/* Admin Dashboard route */}
            <Route path="/admin/dashboard" element={<Layout><AdminDashboard /></Layout>} />

            {/* Generate routes from component groups */}
            {createRoutes(UserPages, '')}
            {createRoutes(ProductPages, '')}
            {createRoutes(AdminPages, '')}
            {createRoutes(CheckoutPages, '')}
            {createRoutes(InfoPages, '')}
              
            {/* Special paths and custom routes */}
            <Route path="/superadmin/dashboard" element={<Layout><SuperAdminPages.Dashboard /></Layout>} />
            <Route path="/superadmin/workers" element={<Layout><SuperAdminPages.Workers /></Layout>} />
            <Route path="/superadmin/customers" element={<Layout><SuperAdminPages.CustomerManager /></Layout>} />
            <Route path="/superadmin/admins" element={<Layout><div>Admins Page</div></Layout>} />
            <Route path="/superadmin/products" element={<Layout><div>Products Page</div></Layout>} />
            <Route path="/superadmin/units" element={<Layout><div>Units Page</div></Layout>} />
            <Route path="/superadmin/adminregistration" element={<Layout><SuperAdminPages.AdminRegistration /></Layout>} />
              
            {/* Admin Panel with props */}
            <Route path="/adminpanel" element={
              <Layout>
                <AdminPages.AdminPanel addUnit={addUnit} />
              </Layout>
            } />
          </Routes>
          <Chatbot />
        </BrowserRouter>
      </CartProvider>
    </WishlistProvider>
  );
};

export default App;