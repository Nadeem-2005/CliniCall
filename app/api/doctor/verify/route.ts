import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { sendApprovalMailToDoctor,sendRejectionMailToDoctor } from "@/lib/mail";
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

  console.log(session);

  const data = await req.formData();
  const userId = data.get("userId") as string;
  const action = data.get("action") as string;

  console.log("Received data:", { userId, action });


  if (!userId || !action) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const newStatus = action === "accept" ? "approved" : "rejected";


    const updatedDoctor = await prisma.doctor.update({
      where: { userId },
      data: { status: newStatus },
      select: { name: true, email: true } // needed for email
    });

    if (newStatus === "approved") {
      await prisma.user.update({
        where: { id: userId },
        data: { role: "doctor" },
      });

      //sending approval email to the doctor
      await sendApprovalMailToDoctor(updatedDoctor.email, updatedDoctor.name);

      //sending realtime push notification to the doctor
      await pusher.trigger(`user-${userId}`, "doctor-approved", {
        message: "Your application has been approved!",
      });
    } else if (newStatus === "rejected") {

      //sending rejection email to the doctor
      await sendRejectionMailToDoctor(updatedDoctor.email, updatedDoctor.name);  
      
      //sending realtime push notification to the doctor
      await pusher.trigger(`user-${userId}`, "doctor-rejected", {
        message: "Your application has been rejected.",
      });
    }

    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}