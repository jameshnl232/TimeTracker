"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  {
    name: "Vacations",
    icon: Calendar,
    href: "/vacations",
    tabs: [
      { name: "Request Vacation", href: "/vacations/request" },
      { name: "List View", href: "/vacations" },
    ],
  },
  {
    name: "Absences",
    icon: UserCheck,
    href: "/absences",
    tabs: [
      { name: "New absence entry", href: "/absences/request" },
      { name: "List View", href: "/absences" },
    ],
  },
  {
    name: "Manual Time Tracking",
    icon: Clock,
    href: "/manual-time",
    tabs: [
      { name: "Enter working time", href: "/manual-time/request" },
      { name: "List View", href: "/manual-time" },
    ],
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`bg-gray-800 text-white transition-all duration-300 ease-in-out ${isCollapsed ? "w-16" : "w-64"}`}
    >
      <div className="flex justify-end p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-6 w-6" />
          ) : (
            <ChevronLeft className="h-6 w-6" />
          )}
        </Button>
      </div>

      <nav className="mt-5 px-2">
        <Link
          href="/dashboard"
          className="flex items-center mb-5 text-3xl  "
        >
          <span className="w-full ">{
            isCollapsed ? "" : "Dashboard"
              }
          </span>
        </Link>
        {sidebarItems.map((item) => (
          <div key={item.name}>
            <div className="group mt-1 flex items-center rounded-md px-2 py-2 text-base font-medium leading-6 transition duration-150 ease-in-out">
              <item.icon className="mr-4 h-6 w-6" />
              {!isCollapsed && <span>{item.name}</span>}
            </div>
            {!isCollapsed &&
              item.tabs.map((tab) => (
                <Link
                  key={tab.name}
                  href={`/dashboard${tab.href}`}
                  className="group mt-1 flex items-center rounded-md py-2 pl-8 text-sm font-medium leading-6 transition duration-150 ease-in-out hover:bg-gray-700"
                >
                  {!isCollapsed && <span>{tab.name}</span>}
                </Link>
              ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
