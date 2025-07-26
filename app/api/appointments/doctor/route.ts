import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cache } from "@/lib/redis";
import {
  queueAppointmentConfirmationToUserWithDoctor,
  queueAppointmentNotificationToDoctor,
} from "@/lib/mail-queue";
import { appointmentRateLimiter, withRateLimit } from "@/lib/rate-limiter";

async function handlePOST(req: Request) {
  const body = await req.json();
  console.log("Request body:", body);
  const { name, email, date, time, reason, doctorId, userId } = body;

  try {
    if (!name || !email || !date || !time || !reason || !doctorId || !userId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Try to get doctor from cache first
    const cacheKey = `doctor:${doctorId}`;
    let doctorData = await cache.get(cacheKey);
    let doctor;
    if (typeof doctorData === "string") {
      doctor = JSON.parse(doctorData);
    } else {
      // If not in cache, fetch from database
      doctor = await prisma.doctor.findUnique({
        where: {
          id: doctorId,
        },
      });

      if (doctor) {
        // Cache doctor data for 1 hour (3600 seconds)
        await cache.set(cacheKey, JSON.stringify(doctor), 3600);
      }
    }

    if (!doctor) {
      return NextResponse.json(
        {
          error: "Doctor not found",
        },
        { status: 404 }
      );
    }

    //check if an appointment already exists
    const existingAppointment = await prisma.appointment_doctor.findMany({
      where: {
        userId: userId,
        doctorId: doctorId,
        date: new Date(date),
      },
    });

    if (existingAppointment.length > 0) {
      return NextResponse.json(
        {
          error: "You already have an appointment request for this day",
        },
        {
          status: 400,
        }
      );
    }

    // Create the appointment request
    const appointment = await prisma.appointment_doctor.create({
      data: {
        date: new Date(date),
        time,
        reason,
        doctorId,
        userId,
      },
    });

    // Queue notification to the doctor (non-blocking)
    await queueAppointmentNotificationToDoctor(
      doctor.email,
      doctor.name,
      name,
      date,
      time,
      reason
    );

    // Queue confirmation to the user (non-blocking)
    await queueAppointmentConfirmationToUserWithDoctor(
      email,
      name,
      doctor.name,
      date,
      time
    );

    // Invalidate related cache entries
    await cache.delPattern(`appointments:doctor:${doctorId}:*`);
    await cache.delPattern(`appointments:user:${userId}:*`);

    return NextResponse.json(
      { message: "Appointment request sent successfully", appointment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Booking Appointment:", error);
    return NextResponse.json(
      {
        error: "Failed to book appointment. Please try again later.",
      },
      { status: 500 }
    );
  }
}

// Export rate-limited handler
export const POST = withRateLimit(appointmentRateLimiter, handlePOST);
