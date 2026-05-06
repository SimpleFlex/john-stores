import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext.jsx";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/api.service.js";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

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

  // Fetch notifications
  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  useEffect(() => {
    loadNotifications();
    // Poll every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  const handleMarkRead = async (id, link) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      if (link) {
        setNotifOpen(false);
        navigate(link);
      }
    } catch (err) {
      console.error("Failed to mark read:", err);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case "order":
        return "🛒";
      case "payment":
        return "💰";
      case "stock":
        return "📦";
      default:
        return "🔔";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0">
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
        className={`fixed left-0 top-0 h-full z-40 transition-transform duration-300 md:hidden ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
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
        {/* Top Nav */}
        <div className="sticky top-0 z-10 flex items-center justify-between h-[68px] px-4 md:px-6 bg-white border-b border-[rgba(107,107,107,0.15)] shrink-0">
          <p className="hidden md:block text-[#2D2D2D] font-medium text-[18px] leading-[18px] tracking-[-0.2px] font-clash-grotesk">
            {getPageTitle()}
          </p>

          <div className="flex items-center gap-2 md:hidden">
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

            {/* Notification Bell */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-5 h-5 cursor-pointer"
              >
                <img
                  src="/noti.svg"
                  alt="Notifications"
                  className="w-full h-full"
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E3494E] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notifOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-[16px] shadow-xl border border-[rgba(107,107,107,0.15)] z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(107,107,107,0.10)]">
                    <p className="text-[#2D2D2D] font-medium text-sm font-clash-grotesk">
                      Notifications
                    </p>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[#E3494E] text-xs font-dm-sans-500 cursor-pointer hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <button
                          key={notif._id}
                          onClick={() => handleMarkRead(notif._id, notif.link)}
                          className={`flex items-start gap-3 w-full px-4 py-3 text-left hover:bg-[#FAFAFA] transition-colors cursor-pointer border-b border-[rgba(107,107,107,0.05)] ${!notif.isRead ? "bg-[#F0FDF4]" : ""}`}
                        >
                          <span className="text-lg mt-0.5 shrink-0">
                            {getNotifIcon(notif.type)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p
                                className={`text-sm font-medium truncate ${!notif.isRead ? "text-[#032817] font-dm-sans-700" : "text-[#2D2D2D] font-dm-sans-500"}`}
                              >
                                {notif.title}
                              </p>
                              {!notif.isRead && (
                                <span className="w-2 h-2 rounded-full bg-[#E3494E] shrink-0" />
                              )}
                            </div>
                            <p className="text-[#717182] text-xs font-dm-sans mt-0.5 line-clamp-2">
                              {notif.message}
                            </p>
                            <p className="text-[#9CA3AF] text-[10px] font-dm-sans mt-1">
                              {getTimeAgo(notif.createdAt)}
                            </p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 gap-2">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#D1D5DC"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                          <path d="M13.73 21a2 2 0 01-3.46 0" />
                        </svg>
                        <p className="text-[#9CA3AF] font-dm-sans text-sm">
                          No notifications yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer md:hidden"
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

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
