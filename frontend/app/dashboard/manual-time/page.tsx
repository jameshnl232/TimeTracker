"use client";

import React, { cache, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppSelector } from "@/app/redux/store";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { redirect } from "next/navigation";
import { User } from "@/app/redux/features/auth/auth.slice";
import { toast } from "@/hooks/use-toast";
import { calculateHoursWorked } from "@/lib/timeUtils";

interface ManualTime {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  pause: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  comment?: string;
  approvedBy?: string;
  user: User;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function VacationsPage() {
  const [requests, setRequests] = useState<ManualTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const is_admin = user?.role === "admin";

  if (!token) {
    redirect("/login");
  }

  useEffect(() => {
    const fetchRequests = async () => {
      if (!token) return;

      try {
        const url = is_admin
          ? "/api/manual-time/all"
          : "/api/manual-time/my-requests";

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_ROOT_URL}${url}`,
          {
            headers: {
              method: "GET",
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }
        const data = await response.json();

        setRequests(data);
      } catch (err) {
        setError("Failed to load requests. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [token, is_admin]);

  if (isLoading) {
    return (
      <div className="container mx-auto mt-8 px-4">
        <h1 className="mb-6 text-4xl font-bold">Manual Time</h1>
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="mb-4">
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 h-4 w-3/4" />
              <Skeleton className="mb-2 h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto mt-8 px-4">
        <h1 className="mb-6 text-4xl font-bold">Manual Time</h1>
        <Card>
          <CardContent className="flex items-center justify-center pt-5">
            <p className="text-center text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const actionRequestHandler = async (id: string, status: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ROOT_URL}/api/manual-time/approve/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status,
        }),
      },
    );

    if (response.ok) {
      if (status === "APPROVED") {
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request._id === id ? { ...request, status: "APPROVED" } : request,
          ),
        );
        toast({
          variant: "success",
          description: "Request approved successfully",
        });
      } else if (status === "REJECTED") {
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request._id === id ? { ...request, status: "REJECTED" } : request,
          ),
        );
        toast({
          variant: "success",
          description: "Request rejected successfully",
        });
      }
    } else {
      toast({
        variant: "destructive",
        description: "Failed to approve request",
      });
    }
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="mb-6 text-4xl font-bold">Manual Time</h1>
      {requests && requests.length === 0 ? (
        <p className="text-center">No manual time requests found.</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {is_admin && <TableHead>User</TableHead>}

                <TableHead>Date</TableHead>
                <TableHead>Start Hour</TableHead>
                <TableHead>End Hour</TableHead>
                <TableHead>Pause</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Working time</TableHead>
                {is_admin && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request._id}>
                  {is_admin && <TableCell>{request.user.email}</TableCell>}
                  <TableCell>{formatDate(request.date)}</TableCell>
                  <TableCell>{request.startTime}</TableCell>
                  <TableCell>{request.endTime}</TableCell>
                    <TableCell>{request.pause} mins</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>
                    {calculateHoursWorked(
                      request.startTime,
                      request.endTime,
                      request.pause,
                    )}{" "}
                    hours
                  </TableCell>
                  {is_admin && (
                    <TableCell className="space-x-3">
                      <Button
                        onClick={() =>
                          actionRequestHandler(request._id, "APPROVED")
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() =>
                          actionRequestHandler(request._id, "REJECTED")
                        }
                      >
                        Reject
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
