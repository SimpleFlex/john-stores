import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Categories from "./pages/Category";
import Analytics from "./pages/Analytics";
import EasyMedia from "./pages/EasyMedia";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import EditProduct from "./components/EditProduct";
import Settings from "./pages/Settings";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ── Public ────────────────────────────── */}
        <Route path="/login" element={<Login />} />

        {/* ── Protected ─────────────────────────── */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="easy-media" element={<EasyMedia />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
