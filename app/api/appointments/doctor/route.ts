import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendAppointmentConfirmationToUserWithDoctor, sendAppointmentNotificationToDoctor } from "@/lib/mail";

export async function POST(req: Request) {
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

    const doctor = await prisma.doctor.findUnique({
      where: {
        id: doctorId,
      },
    });

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

        // Send notification to the hospital
        await sendAppointmentNotificationToDoctor(
            doctor.email,
            name,
            doctor.name,
            date,
            time,
            reason
        );

        // Send confirmation to the user
        await sendAppointmentConfirmationToUserWithDoctor(
            email,
            name,
            doctor.name,
            date,
            time,
        );

        return NextResponse.json({ message: "Appointment request sent successfully", appointment }, { status: 200 });
        
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
