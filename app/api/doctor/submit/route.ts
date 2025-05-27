import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { error } from "console";

export async function POST(req: Request) {
  const session = await auth();

  if(!session){
    return NextResponse.redirect(new URL("/" , req.url));
  }

  const data = await req.formData();
  //as long as the value of keys are same as schema of the table, the order doesnt matter
  const name = data.get("name") as string;
  const email = data.get("email") as string;
  const qualification = data.get("qualification") as string;
  const specialization = data.get("specialization") as string;
  const nmcRegNo = data.get("nmc") as string;
  const about = data.get("about") as string;
  const address = data.get("address") as string;
  const location = data.get("location") as string;
  const timing_from = data.get("timing_from") as string;
  const timing_to = data.get("timing_to") as string;
  const days_from = data.get("days_from") as string;
  const days_to = data.get("days_to") as string;

  try {
    const existingDoc = await prisma.doctor.findUnique({
        where : {
            userId: session.user.id
        }
    });

    if(existingDoc){
      return NextResponse.json({error: "Doctor already exists"}, {status: 400});
    }

    await prisma.doctor.create({
        data: {
            userId: session.user.id,
            name,
            email,
            qualification,
            specialization,
            nmcRegNo,
            about,
            address,
            location,
            timing_from ,
            timing_to,
            days_from,
            days_to,
        }
    })

    // return NextResponse.redirect(new URL("/dashboard", req.url));
    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (error) {
    console.error("Error creating doctor:", error);
    return NextResponse.json({error: "Internal Server Error"}, {status: 500});
  }
}