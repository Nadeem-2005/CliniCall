import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const data = await req.formData();

  const name = data.get("name") as string;
  const email = data.get("email") as string;
  const phone = data.get("phone") as string;
  const address = data.get("address") as string;
  const speciality = data.get("speciality") as string;
  const location = data.get("location") as string;
  const description = data.get("description") as string;
  const timing_from = data.get("timing_from") as string;
  const timing_to = data.get("timing_to") as string;
  const days_from = data.get("days_from") as string;
  const days_to = data.get("days_to") as string;

  try {
    await prisma.hospital.create({
      data: {
        userID: session.user.id,
        name,
        email,
        phone,
        address,
        location,
        speciality,
        description,
        timing_from,
        timing_to,
        days_from,
        days_to,
      },
    });

    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (err) {
    console.error("Error registering hospital:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}