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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function Page() {
  const session = await auth();
  //   console.log("session", session); // for debuggin purposes

  const hospitalId = await prisma.hospital.findUnique({
    where: {
      userID: session?.user.id,
    },
    select: {
      id: true,
    },
  });

  const pendingAppointments = await prisma.appointmentment_hospital.findMany({
    where: {
      hospitalId: hospitalId?.id,
      status: "pending",
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

  //   console.log("pendingAppointments", pendingAppointments);
  return !session ? (
    redirect("/")
  ) : (
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
                  <BreadcrumbPage>Review Appointments</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            {pendingAppointments.length > 0 ? (
              pendingAppointments.map((appointment) => {
                return (
                  <form
                    key={appointment.id}
                    method="POST"
                    action="/api/hospital/appointment-review"
                    className="bg-white p-4 mb-4 rounded-lg shadow"
                  >
                    <input
                      type="hidden"
                      name="appointmentId"
                      value={appointment.id}
                    />

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
                    <div className="mt-4 flex gap-4">
                      <Button
                        name="action"
                        value="accept"
                        variant="default"
                        type="submit"
                      >
                        Accept
                      </Button>
                      <Button
                        name="action"
                        value="reject"
                        variant="destructive"
                        type="submit"
                      >
                        Reject
                      </Button>
                    </div>
                  </form>
                );
              })
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-center mt-4">
                  No Pending Appointments
                </h2>
                <p className="text-center mt-2">
                  You have no pending appointments to review at the moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
