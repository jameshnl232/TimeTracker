"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Play, Pause } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { logoutProfile } from "../redux/features/auth/auth.slice";

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export default function Navbar() {
  const [isWorking, setIsWorking] = useState(false);
  const [time, setTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);

  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.auth.token);

  useEffect(
    () => {
      const fetchTimerState = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_ROOT_URL}/api/time`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (response.ok) {
            const data = await response.json();
            setTime(data.workingTime);
            setBreakTime(data.breakTime);
          }
        } catch (error) {
          console.error("Error fetching timer state:", error);
        }
      };
      // Fetch initial timer state when component mounts
      fetchTimerState();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isWorking) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      interval = setInterval(() => {
        setBreakTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    console.log(breakTime)


    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWorking, time, breakTime]);

  const updateTimerOnServer = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ROOT_URL}/api/time/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            workingTime: time,
            breakTime: breakTime,
          }),
        },
      );

      if (!response.ok) {
        console.error("Error updating timer on server");
      }
    } catch (error) {
      console.error("Error updating timer on server:", error);
    }
  };

  const toggleWork = () => {
    updateTimerOnServer();

    setIsWorking(!isWorking);
  };

  const logoutHandler = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ROOT_URL}/api/auth/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
        }),
      },
    );

    if (response.ok) {
      dispatch(logoutProfile());
    }
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
        <span className="hidden text-gray-600 sm:inline">{user?.email}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            logoutHandler();
          }}
        >
          <LogOut className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </nav>
  );
}
