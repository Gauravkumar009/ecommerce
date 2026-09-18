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
import avatarDefault from "../assets/avatar.jpg";

const SideBar = () => {
  const dispatch = useDispatch();
  const { openedComponent, isNavbarOpened } = useSelector((state) => state.extra);
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Orders", icon: ListOrdered },
    { name: "Products", icon: Package },
    { name: "Users", icon: Users },
    { name: "Profile", icon: User },
  ];

  return (
    <aside
      className={`bg-[#10192c] text-white min-h-screen flex flex-col transition-all duration-300 z-40 border-r border-slate-800 ${
        isNavbarOpened ? "w-64" : "w-20 sm:w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-7 border-b border-slate-700/70">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-white text-lg shrink-0 shadow-lg shadow-blue-950/30">
            E
          </div>
          <div className={!isNavbarOpened ? "hidden sm:block" : "block"}>
            <p className="font-bold text-base leading-tight tracking-wide">E-Commerce</p>
            <p className="text-xs text-slate-400 mt-0.5">Admin Control</p>
          </div>
        </div>
        <button
          onClick={() => dispatch(toggleNavbar())}
          className="p-1 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white sm:hidden"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = openedComponent === item.name;
          return (
            <button
              key={item.name}
              onClick={() => dispatch(toggleComponent(item.name))}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-[#2d68e8] text-white shadow-lg shadow-blue-950/30"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
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
      <div className="p-4 border-t border-slate-700/70">
        <div className={`mb-3 flex items-center gap-3 rounded-lg bg-slate-800/60 px-3 py-2.5 ${!isNavbarOpened ? "hidden sm:flex" : "flex"}`}>
          <img
            src={user?.avatar?.url || avatarDefault}
            alt="Admin"
            className="h-8 w-8 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold">{user?.name || "Admin"}</p>
            <p className="truncate text-[11px] text-slate-400">{user?.email || "admin@example.com"}</p>
          </div>
        </div>
        <button
          onClick={() => dispatch(logout())}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
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
