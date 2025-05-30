import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { sendApprovalMailToHospital, sendRejectionMailToHospital } from "@/lib/mail";
import Pusher from "pusher";


const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || "",
    key: process.env.PUSHER_KEY || "",
    secret: process.env.PUSHER_SECRET || "",
    cluster: process.env.PUSHER_CLUSTER || "",
})

export async function POST(req: Request) {
  const session = await auth();

  if (!session) return NextResponse.redirect(new URL("/", req.url));

  const data = await req.formData();
  const userID = data.get("userID") as string;
  const action = data.get("action") as string;

  if (!userID || !action) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    if (action === "delete") {
      // Delete hospital
      await prisma.hospital.delete({
        where: { userID },
      });

      // Optionally delete the user (commented out)
      // await prisma.user.delete({
      //   where: { id: userId },
      // });

      // Notify user via Pusher
      await pusher.trigger(`user-${userID}`, "hospital-deleted", {
        message: "Your hospital application has been removed.",
      });

      return NextResponse.redirect(new URL("/dashboard", req.url));
    }


    const newStatus = action === "accept" ? "approved" : "rejected";


    const updatedhospital = await prisma.hospital.update({
      where: { userID },
      data: { status: newStatus },
      select: { name: true, email: true } // needed for email
    });

    if (newStatus === "approved") {
      await prisma.user.update({
        where: { id: userID },
        data: { role: "hospital" },
      });
      // sending approval email to the hospital
      await sendApprovalMailToHospital(updatedhospital.email, updatedhospital.name);

      await pusher.trigger(`user-${userID}`, "hospital-approved", {
        message: "Your application has been approved!",
      });

    }
    else{
      await sendRejectionMailToHospital(updatedhospital.email, updatedhospital.name);

      await pusher.trigger(`user-${userID}`, "hospital-rejected", {
        message: "Your application has been rejected.",
      });
    }

    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}