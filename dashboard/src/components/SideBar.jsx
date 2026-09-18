import React from "react";
import {
  LayoutDashboard,
  ListOrdered,
  Package,
  Users,
  User,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleComponent, toggleNavbar } from "../store/slices/extraSlice";
import { logout } from "../store/slices/authSlice";

const SideBar = () => {
  const dispatch = useDispatch();
  const { openedComponent, isNavbarOpened } = useSelector((state) => state.extra);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Products", icon: Package },
    { name: "Orders", icon: ListOrdered },
    { name: "Users", icon: Users },
    { name: "Profile", icon: User },
  ];

  return (
    <aside
      className={`bg-gray-900 text-white min-h-screen flex flex-col transition-all duration-300 z-40 ${
        isNavbarOpened ? "w-64" : "w-20 sm:w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-lg shrink-0">
            E
          </div>
          <span className={`font-bold text-lg tracking-wide ${!isNavbarOpened && "hidden sm:inline"}`}>
            AdminPanel
          </span>
        </div>
        <button
          onClick={() => dispatch(toggleNavbar())}
          className="p-1 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white sm:hidden"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = openedComponent === item.name;
          return (
            <button
              key={item.name}
              onClick={() => dispatch(toggleComponent(item.name))}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className={!isNavbarOpened ? "hidden sm:inline" : "inline"}>
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="p-3 border-t border-gray-800">
        <button
          onClick={() => dispatch(logout())}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className={!isNavbarOpened ? "hidden sm:inline" : "inline"}>
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
