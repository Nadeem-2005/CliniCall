import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import {
  sendAppointmentAcceptedByHospitalToUser,
  sendAppointmentRejectedByHospitalToUser,
} from "@/lib/mail";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const appointmentId = formData.get("appointmentId") as string;
  const action = formData.get("action") as string;

  if (!appointmentId || !["accept", "reject"].includes(action)) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  try {
    const appointment = await prisma.appointmentment_hospital.update({
      where: { id: appointmentId },
      data: {
        status: action === "accept" ? "accepted" : "rejected",
      },
      include: {
        user: true,
        hospital: true,
      },
    });

    const { user, hospital, date, time } = appointment;

    //
    if (action === "accept") {
      await sendAppointmentAcceptedByHospitalToUser(
        user.email ?? "",
        user.name ?? "User",
        hospital.name,
        new Date(date).toLocaleDateString(),
        time
      );
    }

    return NextResponse.redirect(
      new URL("/doctor/review-appointments", req.url)
    );
  } catch (error) {
    console.error("Error reviewing appointment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
