import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";  
import { sendAppointmentNotificationToHospital, sendAppointmentConfirmationToUserWithHospital } from "@/lib/mail";

export async function POST(req:Request){
    // console.log("Received request to book an appointment");
    const body = await req.json();
    // console.log("Request body:", body);
    const { name, email, date, time, reason, hospitalId, userId } = body;

    try {
        // Validate required fields
        if (!name || !email || !date || !time || !reason || !hospitalId || !userId) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Check if the hospital exists
        const hospital = await prisma.hospital.findUnique({
            where: { id: hospitalId },
        });

        if (!hospital) {
            return NextResponse.json(
                { error: "Hospital not found" },
                { status: 404 }
            );
        }

        //check appointment request wether it already exists
        const existingAppointment = await prisma.appointmentment_hospital.findMany({
            where:{
                userId: userId,
                hospitalId: hospitalId,
                date: new Date(date),
            }
        })

        if( existingAppointment.length > 0 ) {
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

        // Send notification to the hospital
        await sendAppointmentNotificationToHospital(
            hospital.email,
            name,
            hospital.name,
            date,
            time,
            reason
        );

        // Send confirmation to the user
        await sendAppointmentConfirmationToUserWithHospital(
            email,
            name,
            hospital.name,
            date,
            time
        );

        return NextResponse.json({ message: "Appointment request sent successfully", appointment }, { status: 200 });
        
        
    } catch (error) {
        console.error("Error Processing appointment request:", error);
        return NextResponse.json(
            { error: "Failed to process appointment request" },
            { status: 500 }
        );
    }

}