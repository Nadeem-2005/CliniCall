import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cache } from "@/lib/redis";
import {
  queueAppointmentNotificationToHospital,
  queueAppointmentConfirmationToUserWithHospital,
} from "@/lib/mail-queue";
import { appointmentRateLimiter, withRateLimit } from "@/lib/rate-limiter";

async function handlePOST(req: Request) {
  // console.log("Received request to book an appointment");
  const body = await req.json();
  // console.log("Request body:", body);
  const { name, email, date, time, reason, hospitalId, userId } = body;

  try {
    // Validate required fields
    if (
      !name ||
      !email ||
      !date ||
      !time ||
      !reason ||
      !hospitalId ||
      !userId
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Try to get hospital from cache first
    const cacheKey = `hospital:${hospitalId}`;
    let hospital: { id: string; name: string; email: string } | null =
      await cache.get(cacheKey);
    if (hospital && typeof hospital === "string") {
      hospital = JSON.parse(hospital);
    }

    if (!hospital) {
      // If not in cache, fetch from database
      hospital = await prisma.hospital.findUnique({
        where: { id: hospitalId },
        select: { id: true, name: true, email: true },
      });

      if (hospital) {
        // Cache hospital data for 1 hour with tags for efficient invalidation
        await cache.setWithTags(cacheKey, hospital, 3600, [`hospital:${hospitalId}`]);
      }
    }

    if (!hospital) {
      return NextResponse.json(
        { error: "Hospital not found" },
        { status: 404 }
      );
    }

    //check appointment request wether it already exists
    const existingAppointment = await prisma.appointmentment_hospital.findMany({
      where: {
        userId: userId,
        hospitalId: hospitalId,
        date: new Date(date),
      },
    });

    if (existingAppointment.length > 0) {
      return NextResponse.json(
        { error: "You already have an appointment request for this date" },
        { status: 400 }
      );
    }

    // Create the appointment request
    const appointment = await prisma.appointmentment_hospital.create({
      data: {
        date: new Date(date),
        time,
        reason,
        hospitalId,
        userId,
      },
    });

    // Queue notification to the hospital (non-blocking)
    await queueAppointmentNotificationToHospital(
      hospital.email,
      name,
      hospital.name,
      date,
      time,
      reason
    );

    // Queue confirmation to the user (non-blocking)
    await queueAppointmentConfirmationToUserWithHospital(
      email,
      name,
      hospital.name,
      date,
      time
    );

    // Invalidate related cache entries using tags (much more efficient)
    await cache.invalidateByTags([
      `hospital_appointments:${hospitalId}`,
      `user_appointments:${userId}`
    ]);

    return NextResponse.json(
      { message: "Appointment request sent successfully", appointment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Processing appointment request:", error);
    return NextResponse.json(
      { error: "Failed to process appointment request" },
      { status: 500 }
    );
  }
}

// Export rate-limited handler
export const POST = withRateLimit(appointmentRateLimiter, handlePOST);
