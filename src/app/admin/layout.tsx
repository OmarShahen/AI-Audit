"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Menu } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isShowMenu, setIsShowMenu] = useState(false);

  const handleIsShowMenu = () => {
    setIsShowMenu(!isShowMenu);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <AdminSidebar isShow={isShowMenu} setIsShow={handleIsShowMenu} />
      <main className="md:ml-56 lg:ml-72 min-h-screen">
        {/* Mobile Menu Button */}
        <div className="block md:hidden fixed top-4 right-4 z-50">
          <button
            onClick={handleIsShowMenu}
            className="p-3 bg-white hover:bg-gray-100 rounded-lg shadow-lg transition-colors border border-gray-200"
          >
            <Menu className="text-gray-600" size={22} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
