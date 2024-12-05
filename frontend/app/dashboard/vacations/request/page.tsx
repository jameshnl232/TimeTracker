"use client";
import { useAppSelector } from "@/app/redux/store";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";

export default function VacationRequestPage() {
  const token = useAppSelector((state) => state.auth.token);
  const { toast } = useToast();

  if (!token) {
    redirect("/login");
  }

  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    comment: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ROOT_URL}/api/requests/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      },
    );

    if (response.ok) {
      // Success case
      setFormData({
        fromDate: "",
        toDate: "",
        comment: "",
      });
      toast({
        variant: "success",
        description: "Request submitted successfully",
      });
    } else {
      const data = await response.json();
      console.error(data.message);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Vacation Request</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="fromDate" className="mb-2">
            From Date
          </label>
          <input
            type="date"
            id="fromDate"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleChange}
            className="rounded border p-2"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="toDate" className="mb-2">
            To Date
          </label>
          <input
            type="date"
            id="toDate"
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
            className="rounded border p-2"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="comment" className="mb-2">
            Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            maxLength={500}
            rows={4}
            className="resize-none rounded border p-2"
            placeholder="Enter your comment (max 500 words)"
          />
        </div>

        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}
