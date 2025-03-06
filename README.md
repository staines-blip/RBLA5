RBLA4
├─ backend
│  ├─ .env
│  ├─ conection string.txt
│  ├─ controllers
│  │  ├─ admin
│  │  │  └─ adminAuthController.js
│  │  └─ superadmin
│  │     ├─ AdminController.js
│  │     ├─ customersController.js
│  │     ├─ superadmincontroller.js
│  │     ├─ unitController.js
│  │     └─ workercontroller.js
│  ├─ index.js
│  ├─ middleware
│  │  └─ superadminmiddleware.js
│  ├─ models
│  │  ├─ admin.js
│  │  ├─ customer.js
│  │  ├─ Order.js
│  │  ├─ Payment.js
│  │  ├─ Product.js
│  │  ├─ superadmin.js
│  │  ├─ Unit.js
│  │  ├─ User.js
│  │  ├─ ViewReviews.js
│  │  ├─ ViewSales.js
│  │  └─ Worker.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ routes
│  │  ├─ admin
│  │  │  └─ adminAuthRoutes.js
│  │  ├─ productRoutes.js
│  │  ├─ superadmin
│  │  │  ├─ admins.js
│  │  │  ├─ customerRoutes.js
│  │  │  └─ index.js
│  │  ├─ superadminauthroutes.js
│  │  ├─ unitRoutes.js
│  │  └─ workerRoutes.js
│  ├─ scripts
│  │  └─ createsuperadmin.js
│  ├─ server.js
│  └─ utils
│     ├─ appError.js
│     └─ catchAsync.js
├─ frontend
│  ├─ .env
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.ico
│  │  ├─ index.html
│  │  ├─ logo192.png
│  │  ├─ logo512.png
│  │  ├─ manifest.json
│  │  └─ robots.txt
│  ├─ routes
│  │  └─ superadminroutes.js
│  └─ src
│     ├─ App.css
│     ├─ App.js
│     ├─ App.test.js
│     ├─ CartContext.js
│     ├─ components
│     │  ├─ AddProduct
│     │  │  ├─ AddProduct.css
│     │  │  └─ AddProduct.jsx
│     │  ├─ AdminDashboard.jsx
│     │  ├─ Assets
│     │  ├─ Chatbot
│     │  │  ├─ Chatbot.css
│     │  │  └─ Chatbot.jsx
│     │  ├─ DarkMode
│     │  │  ├─ DarkMode.css
│     │  │  ├─ DarkMode.jsx
│     │  │  ├─ Moon.svg
│     │  │  └─ Sun.svg
│     │  ├─ Footer
│     │  │  ├─ Footer.css
│     │  │  └─ Footer.jsx
│     │  ├─ Header
│     │  │  ├─ Header.css
│     │  │  └─ Header.jsx
│     │  ├─ Hero
│     │  │  ├─ Hero.css
│     │  │  └─ Hero.jsx
│     │  ├─ ListProduct
│     │  │  ├─ ListProduct.css
│     │  │  └─ ListProduct.jsx
│     │  ├─ Navbar
│     │  │  ├─ Navbar.css
│     │  │  └─ Navbar.jsx
│     │  ├─ Popular
│     │  │  ├─ Item.css
│     │  │  ├─ Item.jsx
│     │  │  ├─ Popular.css
│     │  │  └─ Popular.jsx
│     │  ├─ Sidebar
│     │  │  ├─ Sidebar.css
│     │  │  └─ Sidebar.jsx
│     │  ├─ superadmin
│     │  │  ├─ superadminlogin.css
│     │  │  └─ superadminlogin.jsx
│     │  ├─ ThemeToggle.css
│     │  └─ ThemeToggle.jsx
│     ├─ Context
│     │  ├─ CartContext.js
│     │  ├─ ThemeContext.js
│     │  └─ WishlistContext.js
│     ├─ index.css
│     ├─ index.js
│     ├─ logo.svg
│     ├─ pages
│     │  ├─ AboutPage.css
│     │  ├─ AboutPage.jsx
│     │  ├─ admin
│     │  │  ├─ admindashboard.css
│     │  │  ├─ admindashboard.jsx
│     │  │  ├─ adminlogin.css
│     │  │  └─ adminlogin.jsx
│     │  ├─ Admin.css
│     │  ├─ Admin.jsx
│     │  ├─ AdminPanel.css
│     │  ├─ AdminPanel.jsx
│     │  ├─ Bags.css
│     │  ├─ Bags.jsx
│     │  ├─ Bamboo.css
│     │  ├─ Bamboo.jsx
│     │  ├─ Bedsheets.css
│     │  ├─ Bedsheets.jsx
│     │  ├─ Blockprinting.jsx
│     │  ├─ Cart.css
│     │  ├─ Cart.jsx
│     │  ├─ Checkout.css
│     │  ├─ Checkout.jsx
│     │  ├─ ContactUs.css
│     │  ├─ ContactUs.jsx
│     │  ├─ Cupcoaster.css
│     │  ├─ Cupcoaster.jsx
│     │  ├─ CustomDesignPage.css
│     │  ├─ CustomDesignPage.jsx
│     │  ├─ custproduct.css
│     │  ├─ custproduct.jsx
│     │  ├─ Gallery.css
│     │  ├─ Gallery.jsx
│     │  ├─ Home.jsx
│     │  ├─ Location.jsx
│     │  ├─ LoginSignup.css
│     │  ├─ LoginSignup.jsx
│     │  ├─ Marquee.css
│     │  ├─ Marquee.js
│     │  ├─ MyOrders.css
│     │  ├─ MyOrders.jsx
│     │  ├─ Napkins.css
│     │  ├─ Napkins.jsx
│     │  ├─ Paperfiles.css
│     │  ├─ Paperfiles.jsx
│     │  ├─ PaymentPage.css
│     │  ├─ PaymentPage.jsx
│     │  ├─ PlaceOrder.css
│     │  ├─ PlaceOrder.jsx
│     │  ├─ ProductDetails.css
│     │  ├─ ProductDetails.js
│     │  ├─ ProductPage.css
│     │  ├─ ProductPage.jsx
│     │  ├─ ReturnsOrders.css
│     │  ├─ ReturnsOrders.jsx
│     │  ├─ ShopCategory.jsx
│     │  ├─ siragugal.css
│     │  ├─ siragugal.jsx
│     │  ├─ superadmin
│     │  │  ├─ adminregistration.css
│     │  │  ├─ adminregistration.jsx
│     │  │  ├─ customermanager.css
│     │  │  ├─ customermanager.jsx
│     │  │  ├─ superadmindashboard.css
│     │  │  ├─ superadmindashboard.jsx
│     │  │  ├─ superadminlogin.jsx
│     │  │  ├─ Units.css
│     │  │  ├─ Units.jsx
│     │  │  ├─ workers.css
│     │  │  └─ workers.jsx
│     │  ├─ Towels.css
│     │  ├─ Towels.jsx
│     │  ├─ UpdateLocation.css
│     │  ├─ UploadDesignAndCheckout.css
│     │  ├─ UploadDesignAndCheckout.jsx
│     │  ├─ UserAccount.css
│     │  ├─ UserLogin.css
│     │  ├─ UserLogin.jsx
│     │  ├─ UserProfile.css
│     │  ├─ UserProfile.jsx
│     │  ├─ Vaagai.css
│     │  ├─ vaagai.jsx
│     │  ├─ varnam.css
│     │  ├─ varnam.jsx
│     │  ├─ Wishlist.css
│     │  └─ Wishlist.jsx
│     ├─ PaintApp.js
│     ├─ reportWebVitals.js
│     ├─ services
│     │  ├─ adminapi.js
│     │  ├─ adminAuthService.js
│     │  ├─ customersApi.js
│     │  ├─ unitsApi.js
│     │  └─ workersapi.js
│     ├─ setupTests.js
│     └─ WishlistContext.js
├─ Overall Project Progress .txt
├─ package-lock.json
├─ package.json
├─ Project Integration Explanation
└─ Project Tree Final (Refer for Understanding)
