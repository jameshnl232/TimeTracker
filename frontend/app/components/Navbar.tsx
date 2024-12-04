"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Play, Pause } from "lucide-react";

export default function Navbar() {
  const [isWorking, setIsWorking] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isWorking) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isWorking && time !== 0) {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWorking, time]);

  const toggleWork = () => {
    setIsWorking(!isWorking);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <nav className="flex flex-wrap items-center justify-between bg-white px-4 py-3 shadow sm:px-6">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
          TimeTracker
        </h1>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <Button
          variant={isWorking ? "destructive" : "default"}
          size="sm"
          onClick={toggleWork}
        >
          {isWorking ? (
            <Pause className="mr-2 h-4 w-4" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {isWorking ? "Stop" : "Start"}
          </span>
        </Button>
        <span className="text-base font-semibold sm:text-lg">
          {formatTime(time)}
        </span>
        <span className="hidden text-gray-600 sm:inline">John Doe</span>
        <Button variant="outline" size="sm">
          <LogOut className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </nav>
  );
}
