import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext.jsx";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleMenuItemClick = (path) => {
    navigate(path);
  };

  // ── Use real admin data from AuthContext ─────────────────────────
  const userData = {
    name: admin?.name || "Admin",
    email: admin?.email || "",
    avatar: "/api/placeholder/40/40",
  };

  const pageTitle = {
    "/": "Dashboard",
    "/orders": "Orders Management",
    "/products": "Products Management",
    "/categories": "Categories Management",
    "/analytics": "Analytics",
    "/easy-media": "Early Access Email List",
    "/settings": "Settings",
  };

  // Handle nested routes like /products/new, /products/edit/:id
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/products/edit")) return "Products Management";
    if (path.startsWith("/products/new")) return "Products Management";
    return pageTitle[path] || "Dashboard";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        activePath={location.pathname}
        onMenuItemClick={handleMenuItemClick}
        userData={userData}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? "ml-20" : "ml-65"
        } h-screen overflow-hidden`}
      >
        {/* Sticky Top Nav */}
        <div className="sticky top-0 z-10 flex items-center justify-between h-[68px] px-6 bg-white border-b border-[rgba(107,107,107,0.15)] shrink-0">
          <p className="text-[#2D2D2D] font-medium text-[18px] leading-[18px] tracking-[-0.2px] font-clash-grotesk">
            {getPageTitle()}
          </p>
          <div className="flex items-center gap-3">
            {/* Admin badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[#FAFAFA] border border-[rgba(107,107,107,0.15)]">
              <div className="w-6 h-6 rounded-full bg-[#032817] flex items-center justify-center">
                <p className="text-white text-[10px] font-clash-grotesk font-medium">
                  {admin?.name?.charAt(0)?.toUpperCase() || "A"}
                </p>
              </div>
              <p className="text-[#2D2D2D] font-dm-sans-500 text-xs font-medium">
                {admin?.name || "Admin"}
              </p>
            </div>
            <img src="/noti.svg" alt="Notifications" />
          </div>
        </div>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
