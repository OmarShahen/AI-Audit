"use client";

import clsx from "clsx";
import {
  ArrowLeft,
  Building2,
  ChartNoAxesCombined,
  FileText,
  Handshake,
  LogOut,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminSidebar({
  isShow,
  setIsShow,
}: {
  isShow: boolean;
  setIsShow: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin-login');
    router.refresh();
  };

  const sidebarLinks = [
    {
      header: "Main",
      tabs: [
        {
          name: "Dashboard",
          icon: <ChartNoAxesCombined size={20} />,
          url: "/admin/dashboard",
        },
      ],
    },
    {
      header: "Companies",
      tabs: [
        {
          name: "Partners",
          icon: <Handshake size={20} />,
          url: "/admin/partners",
        },
        {
          name: "Clients",
          icon: <Users size={20} />,
          url: "/admin/clients",
        },
      ],
    },
    {
      header: "Reports",
      tabs: [
        // {
        //   name: "Forms",
        //   icon: <FileText size={20} />,
        //   url: "/admin/forms",
        // },
        {
          name: "Submissions",
          icon: <Building2 size={20} />,
          url: "/admin/submissions",
        },
      ],
    },
  ];

  return (
    <aside
      className={clsx(
        isShow ? "block" : "hidden md:block",
        "z-[9998] bg-gradient-to-b from-gray-50 to-white min-h-screen border-r border-gray-200 shadow-sm fixed left-0 top-0 h-screen md:w-56 lg:w-72 flex flex-col"
      )}
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-white">
        <div
          onClick={setIsShow}
          className="block md:hidden mb-4 cursor-pointer hover:bg-gray-100 w-fit p-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="text-gray-600" size={20} />
        </div>
        <Link href="/admin/dashboard" className="block">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 rounded-lg p-2 shadow-lg">
              <ChartNoAxesCombined className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin</h1>
              <p className="text-xs text-gray-500">Control Panel</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div
        className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar"
        style={{ maxHeight: "calc(100vh - 150px)" }}
      >
        {sidebarLinks.map((sidebar, index) => {
          return (
            <div key={index} className="mb-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                {sidebar.header}
              </p>
              <ul className="space-y-1">
                {sidebar.tabs.map((tab) => {
                  const isActive = pathname === tab.url;
                  return (
                    <li key={tab.name}>
                      <Link
                        href={tab.url}
                        className={clsx(
                          "flex items-center gap-3 px-3 py-3 rounded-lg font-medium text-sm transition-all duration-200 relative group",
                          isActive
                            ? "bg-indigo-50 text-indigo-700 shadow-sm"
                            : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                        )}
                      >
                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" />
                        )}

                        {/* Icon */}
                        <div
                          className={clsx(
                            "transition-colors",
                            isActive
                              ? "text-indigo-600"
                              : "text-gray-400 group-hover:text-indigo-600"
                          )}
                        >
                          {tab.icon}
                        </div>

                        {/* Label */}
                        <span className="flex-1">{tab.name}</span>

                        {/* Active dot */}
                        {isActive && (
                          <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="border-t border-gray-200 px-4 py-4 bg-white">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-3 rounded-lg font-medium text-sm transition-all duration-200 w-full text-gray-700 hover:bg-red-50 hover:text-red-600 group"
        >
          <div className="transition-colors text-gray-400 group-hover:text-red-600">
            <LogOut size={20} />
          </div>
          <span className="flex-1 text-left">Logout</span>
        </button>
      </div>
    </aside>
  );
}
