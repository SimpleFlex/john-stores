import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext.jsx";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuItemClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const userData = {
    name: admin?.name || "Admin",
    email: admin?.email || "",
    avatar: admin?.avatar || "",
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

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/products/edit")) return "Products Management";
    if (path.startsWith("/products/new")) return "Products Management";
    return pageTitle[path] || "Dashboard";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar — always visible, fixed position from Sidebar component itself */}
      <div className="hidden lg:block shrink-0">
        <Sidebar
          activePath={location.pathname}
          onMenuItemClick={handleMenuItemClick}
          userData={userData}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile slide-over sidebar */}
      <div
        className={`fixed left-0 top-0 h-full z-40 transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          activePath={location.pathname}
          onMenuItemClick={handleMenuItemClick}
          userData={userData}
          collapsed={false}
          onToggleCollapse={() => {}}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Sticky Top Nav */}
        <div className="sticky top-0 z-10 flex items-center justify-between h-[68px] px-4 lg:px-6 bg-white border-b border-[rgba(107,107,107,0.15)] shrink-0">
          {/* Desktop page title */}
          <p className="hidden lg:block text-[#2D2D2D] font-medium text-[18px] leading-[18px] tracking-[-0.2px] font-clash-grotesk">
            {getPageTitle()}
          </p>

          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <img
              src="/john-ent.svg"
              alt="John's Enterprise"
              className="w-7 h-7"
            />
            <p className="text-[#121212] font-semibold text-[12px] leading-4 tracking-[0.36px] font-clash-grotesk">
              John's Enterprise
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Admin badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[#FAFAFA] border border-[rgba(107,107,107,0.15)]">
              <div className="w-6 h-6 rounded-full bg-[#032817] flex items-center justify-center">
                <p className="text-white text-[10px] font-clash-grotesk font-medium">
                  {admin?.name?.charAt(0)?.toUpperCase() || "A"}
                </p>
              </div>
              <p className="text-[#2D2D2D] font-dm-sans-500 text-xs font-medium">
                {admin?.name || "Admin"}
              </p>
            </div>
            <img
              src="/noti.svg"
              alt="Notifications"
              className="w-5 h-5 cursor-pointer"
            />
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer lg:hidden"
            >
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
                <path
                  d="M2 2h18M2 9h18M2 16h18"
                  stroke="#2D2D2D"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
