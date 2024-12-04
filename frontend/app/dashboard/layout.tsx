import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../globals.css";

export const metadata: Metadata = {
  title: "TimeTracker Dashboard",
  description: "Simple time tracking application for companies",
};

export default function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
