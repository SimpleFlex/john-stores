import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SwiftLogistics from "./pages/SwiftLogistics";
import EasyMedia from "./pages/EasyMedia";
import JohnStores from "./pages/JohnStores";
import Test from "./pages/Testimonials";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import SwiftProduct from "./components/SwiftProduct";
import Cart from "./pages/Cart";
import { ToastContainer } from "react-toastify";
import CartForm from "./pages/CartForm";
import CartFormJohn from "./pages/CartFormJohn";
import CartFormSwift from "./pages/CartFormSwift";
import ScrollToTop from "./components/ScrollToTop";
import About from "./components/About";
import Faqs from "./components/Faqs";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/swift-logistics" element={<SwiftLogistics />} />
        <Route path="/easy-media" element={<EasyMedia />} />
        <Route path="/john-stores" element={<JohnStores />} />
        <Route path="/testimonials" element={<Test />} />
        <Route path="/faqs" element={<Faqs />} />

        {/* FIX: Added missing routes for search navigation */}
        <Route
          path="/john-stores/product/:productId"
          element={<SwiftProduct />}
        />
        <Route
          path="/swift-logistics/product/:productId"
          element={<SwiftProduct />}
        />

        <Route path="/cart" element={<Cart />} />
        <Route path="/cart-form" element={<CartForm />} />
        <Route path="/checkout/john-stores" element={<CartFormJohn />} />
        <Route path="/checkout/swift" element={<CartFormSwift />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
