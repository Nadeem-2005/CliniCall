import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { error } from "console";

export async function POST(req: Request) {
  const session = await auth();

  if(!session){
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
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
  const timing = data.get("timing") as string;
  const days = data.get("days") as string;

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
            timing ,
            days,
        }
    })

    // return NextResponse.redirect(new URL("/dashboard", req.url));
    return NextResponse.json({message: "Doctor created successfully"}, {status: 201});
  } catch (error) {
    console.error("Error creating doctor:", error);
    return NextResponse.json({error: "Internal Server Error"}, {status: 500});
  }
}