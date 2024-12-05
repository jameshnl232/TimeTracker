"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, Hourglass, TrendingUp } from "lucide-react";
import { useAppSelector } from "../redux/store";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { formatDuration } from "@/lib/timeUtils";

export default function Dashboard() {
  // Dummy data for demonstration
  const [timeData, setTimeData] = useState({
    remainingTime: "8h 00m",
    workedTime: "0h 00m",
    breakTime: "0h 00m",
    overtimeBalance: "0h 00m",
  });

  const token = useAppSelector((state) => state.auth.token);

  if (!token) {
    redirect("/login");
  }

  useEffect(() => {
    const fetchTimeData = async () => {
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
          const workedSeconds = data.workingTime || 0;
          const breakSeconds = data.breakTime || 0;

          // Assuming 8-hour workday
          const remainingSeconds = Math.max(28800 - workedSeconds, 0);
          const overtimeSeconds = Math.max(workedSeconds - 28800, 0);

          setTimeData({
            remainingTime: formatDuration(remainingSeconds),
            workedTime: formatDuration(workedSeconds),
            breakTime: formatDuration(breakSeconds),
            overtimeBalance: formatDuration(overtimeSeconds),
          });
        }
      } catch (error) {
        console.error("Error fetching time data:", error);
      }
    };

    fetchTimeData();

    // Refresh data every hour
    const interval = setInterval(fetchTimeData, 3600000);

    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold sm:text-2xl">Dashboard Overview</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Remaining Working Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeData.remainingTime}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Worked</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeData.workedTime}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Break Time</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeData.breakTime}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overtime Balance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeData.overtimeBalance}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
