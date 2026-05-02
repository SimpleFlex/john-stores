// components/Sidebar.jsx - Fully clickable with active states
import React from "react";

const Sidebar = ({
  activePath,
  onMenuItemClick,
  userData,
  collapsed,
  onToggleCollapse,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "/dashboard.svg", path: "/" },
    { id: "orders", label: "Orders", icon: "/orders.svg", path: "/orders" },
    {
      id: "products",
      label: "Products",
      icon: "/products.svg",
      path: "/products",
    },
    {
      id: "categories",
      label: "Categories",
      icon: "/category.svg",
      path: "/categories",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: "/analytics.svg",
      path: "/analytics",
    },
    {
      id: "easyMedia",
      label: "Easy Media",
      icon: "/easy-media.svg",
      path: "/easy-media",
    },
  ];

  const otherMenuItems = [
    {
      id: "settings",
      label: "Settings",
      icon: "/settings.svg",
      path: "/settings",
    },
  ];

  const isActive = (path) => {
    if (path === "/") return activePath === "/";
    return activePath === path || activePath.startsWith(path + "/");
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-[#FCFCFC] border-r border-[rgba(0,0,0,0.08)] transition-all duration-300 z-20 flex flex-col ${collapsed ? "w-20" : "w-65"}`}
    >
      {/* Brand Logo Section */}
      <div className="flex items-center justify-between px-4 pt-4 pb-4 border-b border-[rgba(0,0,0,0.06)] shrink-0">
        <div className="flex items-center gap-2.5">
          <img
            src="/john-ent.svg"
            alt="John's Enterprise"
            className="w-8 h-8"
          />
          {!collapsed && (
            <p className="text-[#121212] font-semibold text-[14px] leading-4 tracking-[0.36px] font-clash-grotesk">
              John's <br /> Enterprise
            </p>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
        >
          <img
            src="/top.svg"
            alt="Toggle"
            className={`transform transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-3 pt-3 pb-2 shrink-0">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-[rgba(0,0,0,0.10)] bg-[#FAFAFA] shadow-sm ${collapsed ? "justify-center" : ""}`}
        >
          <img src="/search.svg" alt="Search" className="w-4 h-4" />
          {!collapsed && (
            <input
              type="text"
              placeholder="Search orders, products,..."
              className="bg-transparent outline-none text-[#6B6B6B] text-sm font-dm-sans-500 w-full placeholder:text-[#6B6B6B]"
            />
          )}
        </div>
      </div>

      {/* Navigation Menu - No scroll */}
      <div className="flex-1 px-3 flex flex-col justify-between overflow-hidden">
        <div>
          {/* Main Menu Items */}
          <div className="flex flex-col gap-1 mb-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onMenuItemClick(item.path)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer w-full ${
                  isActive(item.path)
                    ? "bg-[#E3494E] text-white shadow-md"
                    : "text-[#6B6B6B] hover:bg-gray-100"
                }`}
                title={collapsed ? item.label : ""}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className={`w-5 h-5 shrink-0 ${isActive(item.path) ? "brightness-0 invert" : "brightness-0"}`}
                />
                {!collapsed && (
                  <span
                    className={`font-semibold text-sm font-dm-sans-700 ${isActive(item.path) ? "text-white" : "text-[#6B6B6B]"}`}
                  >
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Others Section */}
          <div>
            {!collapsed && (
              <div className="text-[#6B6B6B] font-semibold text-xs uppercase tracking-wider mb-2 px-3 font-dm-sans-700">
                Others
              </div>
            )}
            <div className="flex flex-col gap-1">
              {otherMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onMenuItemClick(item.path)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer w-full ${
                    isActive(item.path)
                      ? "bg-[#E3494E] text-white shadow-md"
                      : "text-[#6B6B6B] hover:bg-gray-100"
                  }`}
                  title={collapsed ? item.label : ""}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className={`w-5 h-5 shrink-0 ${isActive(item.path) ? "brightness-0 invert" : "brightness-0"}`}
                  />
                  {!collapsed && (
                    <span
                      className={`font-semibold text-sm font-dm-sans-700 ${isActive(item.path) ? "text-white" : "text-[#6B6B6B]"}`}
                    >
                      {item.label}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Profile Section - pushed to bottom */}
        <div className="border-t border-[rgba(0,0,0,0.06)] pt-3 pb-3">
          <div
            className={`flex items-center gap-2 p-2 rounded-lg bg-[#FAFAFA] ${collapsed ? "justify-center" : ""}`}
          >
            <img
              src={userData.avatar}
              alt="User"
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-[#2D2D2D] font-semibold text-sm font-dm-sans-700 truncate">
                  {userData.name}
                </p>
                <p className="text-[#6B6B6B] font-normal text-xs font-dm-sans-700 truncate">
                  {userData.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
