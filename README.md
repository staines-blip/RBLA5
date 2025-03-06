
```
RBLA4
├─ backend
│  ├─ .env
│  ├─ conection string.txt
│  ├─ controllers
│  │  ├─ admin
│  │  │  ├─ adminAuthController.js
│  │  │  ├─ categoryController.js
│  │  │  └─ productController.js
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
│  │  ├─ category.js
│  │  ├─ customer.js
│  │  ├─ Order.js
│  │  ├─ Payment.js
│  │  ├─ product.js
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
│  │  │  ├─ adminAuthRoutes.js
│  │  │  ├─ categoryRoutes.js
│  │  │  └─ productRoutes.js
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
│     │  │  ├─ 1.png
│     │  │  ├─ 2.png
│     │  │  ├─ 3.png
│     │  │  ├─ 4.png
│     │  │  ├─ 5.png
│     │  │  ├─ about1.png
│     │  │  ├─ about2.png
│     │  │  ├─ about3.png
│     │  │  ├─ all_product.js
│     │  │  ├─ at.png
│     │  │  ├─ B1.png
│     │  │  ├─ B2.png
│     │  │  ├─ B3.png
│     │  │  ├─ B4.png
│     │  │  ├─ B5.png
│     │  │  ├─ Ba1.png
│     │  │  ├─ Ba2.png
│     │  │  ├─ Ba3.png
│     │  │  ├─ Ba4.png
│     │  │  ├─ Ba5.png
│     │  │  ├─ bheart.png
│     │  │  ├─ C1.png
│     │  │  ├─ C2.png
│     │  │  ├─ C3.png
│     │  │  ├─ C4.png
│     │  │  ├─ C5.png
│     │  │  ├─ cart.png
│     │  │  ├─ cell.png
│     │  │  ├─ chatbot.png
│     │  │  ├─ close.png
│     │  │  ├─ contactba.png
│     │  │  ├─ data_product.js
│     │  │  ├─ empty-cart.png
│     │  │  ├─ heart.png
│     │  │  ├─ home.png
│     │  │  ├─ in.png
│     │  │  ├─ list.png
│     │  │  ├─ logo.png
│     │  │  ├─ mail.png
│     │  │  ├─ menu-icon.png
│     │  │  ├─ N1.png
│     │  │  ├─ N2.png
│     │  │  ├─ N3.png
│     │  │  ├─ N4.png
│     │  │  ├─ N5.png
│     │  │  ├─ O1.png
│     │  │  ├─ O2.png
│     │  │  ├─ O3.png
│     │  │  ├─ O4.png
│     │  │  ├─ O5.png
│     │  │  ├─ P1.png
│     │  │  ├─ P2.png
│     │  │  ├─ P3.png
│     │  │  ├─ P4.png
│     │  │  ├─ P5.png
│     │  │  ├─ PD1.png
│     │  │  ├─ PD2.png
│     │  │  ├─ PD3.png
│     │  │  ├─ PD4.png
│     │  │  ├─ PD5.png
│     │  │  ├─ PD6.png
│     │  │  ├─ PD7.png
│     │  │  ├─ PD8.png
│     │  │  ├─ phone.png
│     │  │  ├─ rbla.png
│     │  │  ├─ search-icon.png
│     │  │  ├─ search.png
│     │  │  ├─ sirlogo.png
│     │  │  ├─ T1.png
│     │  │  ├─ T2.png
│     │  │  ├─ T3.png
│     │  │  ├─ T4.png
│     │  │  ├─ T5.png
│     │  │  ├─ tt.png
│     │  │  ├─ upload_area.png
│     │  │  ├─ user.png
│     │  │  ├─ v1.png
│     │  │  ├─ v10.png
│     │  │  ├─ v11.png
│     │  │  ├─ v12.png
│     │  │  ├─ v13.png
│     │  │  ├─ v14.png
│     │  │  ├─ v15.png
│     │  │  ├─ v16.png
│     │  │  ├─ v2.png
│     │  │  ├─ v3.png
│     │  │  ├─ v4.png
│     │  │  ├─ v5.png
│     │  │  ├─ v6.png
│     │  │  ├─ v7.png
│     │  │  ├─ v8.png
│     │  │  ├─ v9.png
│     │  │  ├─ vaalogo.png
│     │  │  ├─ varlogo.png
│     │  │  └─ wt.png
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

```