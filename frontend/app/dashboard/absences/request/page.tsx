"use client";
import { useAppSelector } from "@/app/redux/store";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AbsenceRequestPage() {
  const token = useAppSelector((state) => state.auth.token);
  const { toast } = useToast();

  if (!token) {
    redirect("/login");
  }

  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    substitute: "",
    comment: "",
  });

  const [type, setType] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ROOT_URL}/api/absences/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, type }),
      },
    );

    if (response.ok) {
      // Success case
      setFormData({
        fromDate: "",
        toDate: "",
        substitute: "",
        comment: "",
      });
      setType("Other");
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
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    if (e.target.name === "type") {
      setType(e.target.value);
    } else {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Absense Request</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="type" className="mb-2">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={handleChange}
            className="rounded border p-2"
            required
          >
            <option value="Other">Other</option>
            <option value="Sick">Sick</option>
            <option value="Child sick">Child sick</option>
            <option value="Homeoffice">Homeoffice</option>
          </select>

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
          <label htmlFor="substitute" className="mb-2">
            Substitute
          </label>
          <input
            type="text"
            id="substitute"
            name="substitute"
            value={formData.substitute}
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

        <Button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Submit Request
        </Button>
      </form>
    </div>
  );
}
