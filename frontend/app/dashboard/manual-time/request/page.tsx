"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "@/hooks/use-toast";

import { validateStartHour, validateEndHour } from "@/lib/timeUtils";
import { useAppSelector } from "@/app/redux/store";
import { redirect } from "next/navigation";

const TimeForm = () => {
  const token = useAppSelector((state) => state.auth.token);

  if (!token) {
    redirect("/login");
  }

  const [formData, setFormData] = useState({
    date: "",
    startHour: "",
    endHour: "",
    pause: "",
    comment: "",
  });
  const [errors, setErrors] = useState({
    startHour: "",
    endHour: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "startHour" || name === "endHour") {
      const validationFunction =
        name === "startHour" ? validateStartHour : validateEndHour;
      const errorMessage = validationFunction(value);
      setErrors((prev) => ({ ...prev, [name]: errorMessage }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const startHourError = validateStartHour(formData.startHour);
    const endHourError = validateEndHour(formData.endHour);

    if (startHourError || endHourError) {
      setErrors({
        startHour: startHourError,
        endHour: endHourError,
      });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ROOT_URL}/api/manual-time/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date: formData.date,
            startTime: formData.startHour,
            endTime: formData.endHour,
            pause: formData.pause,
            comment: formData.comment,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        // Success case
        setFormData({
          date: "",
          startHour: "",
          endHour: "",
          pause: "",
          comment: "",
        });
        toast({
          variant: "success",
          description: "Request submitted successfully",
        });
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl p-6">
      <h2 className="mb-6 text-3xl font-bold">Manual Time Request</h2>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="startHour">Start Hour (h.mm)</Label>
          <Input
            type="text"
            id="startHour"
            name="startHour"
            value={formData.startHour}
            onChange={handleChange}
            placeholder="h.mm"
            required
            className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.startHour && (
            <p className="text-sm text-red-500">{errors.startHour}</p>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="endHour">End Hour (h.mm)</Label>
          <Input
            type="text"
            id="endHour"
            name="endHour"
            value={formData.endHour}
            onChange={handleChange}
            placeholder="h.mm"
            required
            className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.endHour && (
            <p className="text-sm text-red-500">{errors.endHour}</p>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="pause">Pause (minutes)</Label>
          <Input
            type="number"
            id="pause"
            name="pause"
            value={formData.pause}
            onChange={handleChange}
            placeholder="Minutes"
            className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="comment">Comment</Label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Comment"
            maxLength={500}
            rows={4}
            className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default TimeForm;
