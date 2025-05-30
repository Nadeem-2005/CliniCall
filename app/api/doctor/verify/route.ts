import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { sendApprovalMailToDoctor, sendRejectionMailToDoctor } from "@/lib/mail";
import Pusher from "pusher";

export async function POST(req: Request) {
  const session = await auth();

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID || "",
    key: process.env.PUSHER_KEY || "",
    secret: process.env.PUSHER_SECRET || "",
    cluster: process.env.PUSHER_CLUSTER || "",
  });

  if (!session) return NextResponse.redirect(new URL("/", req.url));

  const data = await req.formData();
  const userId = data.get("userId") as string;
  const action = data.get("action") as string;

  if (!userId || !action) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    if (action === "delete") {
      // First delete the doctor
      await prisma.doctor.delete({
        where: { userId },
      });

      // Then optionally delete the user (if needed)
      // await prisma.user.delete({
      //   where: { id: userId },
      // });

      // Optionally notify the user (if frontend handles deletion info)
      await pusher.trigger(`user-${userId}`, "doctor-deleted", {
        message: "Your doctor application has been removed.",
      });

      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    const newStatus = action === "accept" ? "approved" : "rejected";

    const updatedDoctor = await prisma.doctor.update({
      where: { userId },
      data: { status: newStatus },
      select: { name: true, email: true },
    });

    if (newStatus === "approved") {
      await prisma.user.update({
        where: { id: userId },
        data: { role: "doctor" },
      });

      await sendApprovalMailToDoctor(updatedDoctor.email, updatedDoctor.name);

      await pusher.trigger(`user-${userId}`, "doctor-approved", {
        message: "Your application has been approved!",
      });
    } else if (newStatus === "rejected") {
      await sendRejectionMailToDoctor(updatedDoctor.email, updatedDoctor.name);

      await pusher.trigger(`user-${userId}`, "doctor-rejected", {
        message: "Your application has been rejected.",
      });
    }

    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}