"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface BookingFormProps {
  session: any;
  doctorId: string;
  doctorName: string;
}

export default function BookingForm({
  session,
  doctorId,
  doctorName,
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: session?.user.name || "",
    email: session?.user.email || "",
    date: "",
    time: "",
    reason: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/appointments/doctor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        doctorId,
        userId: session?.user.id,
      }),
    });

    if (response.ok) {
      alert("Appointment request sent successfully!");
    } else {
      const errorData = await response.json();
      alert(errorData.error || "Failed to send appointment request.");
    }
  };

  return (
    <form className="space-y-6 max-w-xl" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="name">Your Full Name</Label>
        <Input id="name" name="name" value={formData.name} readOnly />
      </div>
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" name="email" value={formData.email} readOnly />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Preferred Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            required
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="time">Preferred Time</Label>
          <input
            id="time"
            name="time"
            type="time"
            required
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="reason">Reason for Appointment</Label>
        <Textarea
          id="reason"
          name="reason"
          required
          onChange={handleInputChange}
          placeholder="Describe your symptoms or concerns..."
        />
      </div>
      <Button type="submit" className="w-full md:w-auto">
        Submit Appointment Request
      </Button>
    </form>
  );
}
