import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

function isUpcoming(dateStr: string, timeStr: string): boolean {
  const now = new Date();
  const appointmentDateTime = new Date(`${dateStr}T${timeStr}`);
  return appointmentDateTime > now;
}

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/");

  const [
    pendingDoctorAppointments,
    pendingHospitalAppointments,
    approvedDoctorAppointments,
    approvedHospitalAppointments,
  ] = await Promise.all([
    prisma.appointment_doctor.findMany({
      where: { userId: session.user.id, status: "pending" },
      include: { doctor: true },
    }),
    prisma.appointmentment_hospital.findMany({
      where: { userId: session.user.id, status: "pending" },
      include: { hospital: true },
    }),
    prisma.appointment_doctor.findMany({
      where: { userId: session.user.id, status: "approved" },
      include: { doctor: true },
    }),
    prisma.appointmentment_hospital.findMany({
      where: { userId: session.user.id, status: "approved" },
      include: { hospital: true },
    }),
  ]);

  const renderCard = (
    title: string,
    appointments: any[],
    type: "doctor" | "hospital",
    isPending: boolean
  ) => (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 shadow-sm p-6 flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      {appointments.length ? (
        <ul className="flex flex-col gap-4">
          {appointments.map((appointment) => {
            const dateStr = new Date(appointment.date)
              .toISOString()
              .split("T")[0];
            const timeStr = appointment.time;
            const upcoming = isUpcoming(dateStr, timeStr);
            const name =
              type === "doctor"
                ? appointment.doctor.name
                : appointment.hospital.name;

            return (
              <li
                key={appointment.id}
                className="border border-gray-300 rounded-xl p-5 bg-white hover:shadow-md hover:bg-gray-100 transition"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(appointment.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Time: {appointment.time}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status:{" "}
                    <span
                      className={`font-medium ${
                        appointment.status === "approved"
                          ? "text-green-600"
                          : "text-orange-500"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </p>
                  {upcoming && (
                    <span className="inline-block w-fit text-xs mt-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      Upcoming
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm text-center py-8">
          No {isPending ? "pending" : "approved"}{" "}
          {type === "doctor" ? "doctor" : "hospital"} appointments.
        </p>
      )}
    </div>
  );
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
                  <BreadcrumbPage>Status</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Pending Section */}
          <section>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Pending Appointments
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderCard("Doctors", pendingDoctorAppointments, "doctor", true)}
              {renderCard(
                "Hospitals / Clinics",
                pendingHospitalAppointments,
                "hospital",
                true
              )}
            </div>
          </section>

          {/* Approved Section */}
          <section>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Approved Appointments
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderCard(
                "Doctors",
                approvedDoctorAppointments,
                "doctor",
                false
              )}
              {renderCard(
                "Hospitals / Clinics",
                approvedHospitalAppointments,
                "hospital",
                false
              )}
            </div>
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
