import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { sendApprovalMail } from "@/lib/mail";

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

      await sendApprovalMail(updatedhospital.email, updatedhospital.name);
    }

    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}