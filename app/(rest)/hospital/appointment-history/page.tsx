import { AppSidebar } from "@/components/app-sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function Page() {
  const session = await auth();
  if (!session) return redirect("/");

  const hospital = await prisma.hospital.findUnique({
    where: { userID: session.user.id },
    select: { id: true },
  });

  if (!hospital) return redirect("/");

  const reviewedAppointments = await prisma.appointmentment_hospital.findMany({
    where: {
      hospitalId: hospital.id,
      status: { in: ["accepted", "rejected"] },
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const now = new Date();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Reviewed Appointments</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            {reviewedAppointments.length > 0 ? (
              reviewedAppointments.map((appointment) => {
                const appointmentDateTime = new Date(
                  `${appointment.date}T${appointment.time}`
                );
                const isUpcoming = appointmentDateTime > now;

                return (
                  <div
                    key={appointment.id}
                    className={`bg-white p-4 mb-4 rounded-lg shadow border-l-4 ${
                      appointment.status === "accepted"
                        ? "border-green-500"
                        : "border-red-500"
                    }`}
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      Appointment with {appointment.user?.name}
                    </h3>
                    <p>
                      <strong>Email:</strong> {appointment.user?.email}
                    </p>
                    <p>
                      <strong>Reason:</strong> {appointment.reason ?? "N/A"}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(appointment.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Time:</strong> {appointment.time}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)}
                    </p>
                    <p>
                      <strong>Upcoming:</strong> {isUpcoming ? "Yes" : "No"}
                    </p>
                  </div>
                );
              })
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-center mt-4">
                  No Reviewed Appointments
                </h2>
                <p className="text-center mt-2">
                  You have not accepted or rejected any appointments yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
