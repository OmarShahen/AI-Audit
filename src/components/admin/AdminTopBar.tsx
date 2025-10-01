"use client";

import { Menu, Bell, Settings, User } from "lucide-react";

export default function AdminTopBar({
  handleIsShowMenu,
}: {
  handleIsShowMenu: () => void;
}) {
  return (
    <div className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm flex items-center justify-between sticky top-0 z-10">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleIsShowMenu}
          className="block md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="text-gray-600" size={22} />
        </button>
        <div className="hidden md:block">
          <h1 className="font-bold text-xl text-gray-900">
            Admin Panel
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your partners, clients, and forms
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group">
          <Bell className="text-gray-600 group-hover:text-indigo-600 transition-colors" size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Settings */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
          <Settings className="text-gray-600 group-hover:text-indigo-600 transition-colors" size={20} />
        </button>

        {/* User Profile */}
        <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <User className="text-white" size={16} />
          </div>
          <span className="hidden lg:block text-sm font-medium text-gray-700">Admin</span>
        </button>
      </div>
    </div>
  );
}
