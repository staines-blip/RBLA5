import React, { useState, lazy, Suspense } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chatbot from './components/Chatbot/Chatbot';
import { WishlistProvider } from "./Context/WishlistContext";
import { CartProvider } from "./Context/CartContext";

// Set default Axios base URL
axios.defaults.baseURL = 'http://localhost:5000';

// Lazy load components
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));

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
        element={<Suspense fallback={<LoadingFallback />}><Component /></Suspense>} 
      />
    ));
  };

  return (
    <WishlistProvider>
      <CartProvider>
        <BrowserRouter>
          
          <div className="App">
            <Routes>
              {/* Home route */}
              <Route path="/" element={
                <Suspense fallback={<LoadingFallback />}><Home /></Suspense>
              } />
              
              {/* Generate routes from component groups */}
              {createRoutes(UserPages, '')}
              {createRoutes(ProductPages, '')}
              {createRoutes(AdminPages, '')}
              {createRoutes(CheckoutPages, '')}
              {createRoutes(InfoPages, '')}
              
              {/* Special paths and custom routes */}
              <Route path="/superadmin/login" element={
                <Suspense fallback={<LoadingFallback />}><SuperAdminPages.Login /></Suspense>
              } />
              <Route path="/superadmin/dashboard" element={
                <Suspense fallback={<LoadingFallback />}><SuperAdminPages.Dashboard /></Suspense>
              } />
              <Route path="/superadmin/workers" element={
                <Suspense fallback={<LoadingFallback />}><SuperAdminPages.Workers /></Suspense>
              } />
              <Route path="/superadmin/customers" element={
                <Suspense fallback={<LoadingFallback />}><SuperAdminPages.CustomerManager /></Suspense>
              } />
              <Route path="/superadmin/admins" element={<div>Admins Page</div>} />
              <Route path="/superadmin/products" element={<div>Products Page</div>} />
              <Route path="/superadmin/units" element={<div>Units Page</div>} />
              
              {/* Admin Panel with props */}
              <Route path="/adminpanel" element={
                <Suspense fallback={<LoadingFallback />}>
                  <AdminPages.AdminPanel addUnit={addUnit} />
                </Suspense>
              } />
            </Routes>
          </div>
          
          <Chatbot />
        </BrowserRouter>
      </CartProvider>
    </WishlistProvider>
  );
};

export default App;