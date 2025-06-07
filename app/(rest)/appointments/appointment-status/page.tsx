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

  const pendingDoctorAppointments = await prisma.appointment_doctor.findMany({
    where: {
      userId: session?.user.id,
      status: "pending",
    },
    include: {
      doctor: true,
    },
  });

  const pendingHospitalAppointments =
    await prisma.appointmentment_hospital.findMany({
      where: {
        userId: session?.user.id,
        status: "pending",
      },
      include: {
        hospital: true,
      },
    });

  const approvedDoctorAppointments = await prisma.appointment_doctor.findMany({
    where: {
      userId: session?.user.id,
      status: "approved",
    },
    include: {
      doctor: true,
    },
  });

  const approvedHospitalAppointments =
    await prisma.appointmentment_hospital.findMany({
      where: {
        userId: session?.user.id,
        status: "approved",
      },
      include: {
        hospital: true,
      },
    });

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
                  <BreadcrumbPage>Status</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-8 p-4 pt-0">
          {/* Pending Appointments */}
          <section>
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">
              Pending Appointments
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Doctors */}
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6 bg-muted/50">
                <h2 className="text-lg font-medium mb-3 text-gray-700">
                  Doctors
                </h2>
                {pendingDoctorAppointments.length > 0 ? (
                  <ul className="space-y-4">
                    {pendingDoctorAppointments.map((appointment) => {
                      return (
                        <li
                          key={appointment.id}
                          className="p-4 border border-gray-300 rounded-lg bg-white shadow-sm"
                        >
                          <h3 className="text-lg font-semibold text-gray-800">
                            {appointment.doctor.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Date:{" "}
                            {new Date(appointment.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Time: {appointment.time}
                          </p>
                          <p className="text-sm text-gray-600">
                            Status: {appointment.status}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="h-32 flex items-center justify-center text-sm text-gray-500">
                    No pending doctor appointments.
                  </div>
                )}
              </div>

              {/* Clinics */}
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6 bg-muted/50">
                <h2 className="text-lg font-medium mb-3 text-gray-700">
                  Hospitals / Clinics
                </h2>
                {pendingHospitalAppointments.length > 0 ? (
                  <ul className="space-y-4">
                    {pendingHospitalAppointments.map((appointment) => {
                      return (
                        <li
                          key={appointment.id}
                          className="p-4 border border-gray-300 rounded-lg bg-white shadow-sm"
                        >
                          <h3 className="text-lg font-semibold text-gray-800">
                            {appointment.hospital.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Date:{" "}
                            {new Date(appointment.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Time: {appointment.time}
                          </p>
                          <p className="text-sm text-gray-600">
                            Status: {appointment.status}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="h-32 flex items-center justify-center text-sm text-gray-500">
                    No pending hospital appointments.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Approved Appointments */}
          <section>
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">
              Approved Appointments
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Doctors */}
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6 bg-muted/50">
                <h2 className="text-lg font-medium mb-3 text-gray-700">
                  Doctors
                </h2>
                {approvedDoctorAppointments.length > 0 ? (
                  <ul className="space-y-4">
                    {approvedDoctorAppointments.map((appointment) => {
                      return (
                        <li
                          key={appointment.id}
                          className="p-4 border border-gray-300 rounded-lg bg-white shadow-sm"
                        >
                          <h3 className="text-lg font-semibold text-gray-800">
                            {appointment.doctor.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Date:{" "}
                            {new Date(appointment.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Time: {appointment.time}
                          </p>
                          <p className="text-sm text-gray-600">
                            Status: {appointment.status}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="h-32 flex items-center justify-center text-sm text-gray-500">
                    No approved doctor appointments.
                  </div>
                )}
              </div>

              {/* Clinics */}
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6 bg-muted/50">
                <h2 className="text-lg font-medium mb-3 text-gray-700">
                  Hospitals / Clinics
                </h2>
                {approvedHospitalAppointments.length > 0 ? (
                  <ul className="space-y-4">
                    {approvedHospitalAppointments.map((appointment) => {
                      return (
                        <li
                          key={appointment.id}
                          className="p-4 border border-gray-300 rounded-lg bg-white shadow-sm"
                        >
                          <h3 className="text-lg font-semibold text-gray-800">
                            {appointment.hospital.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Date:{" "}
                            {new Date(appointment.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Time: {appointment.time}
                          </p>
                          <p className="text-sm text-gray-600">
                            Status: {appointment.status}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="h-32 flex items-center justify-center text-sm text-gray-500">
                    No approved hospital appointments.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
