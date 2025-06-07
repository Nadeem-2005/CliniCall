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

  const history_Doc = await prisma.appointment_doctor.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      doctor: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  const history_Hosp = await prisma.appointmentment_hospital.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      hospital: true,
    },
    orderBy: {
      date: "desc",
    },
  });

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
                  <BreadcrumbPage>History</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Doctor Appointment History */}
          <h1 className="text-2xl">History of Doctor appointments</h1>
          <div className="bg-muted/50 flex-1 rounded-xl md:min-h-min p-4">
            {history_Doc.length > 0 ? (
              <>
                <div className="hidden md:block">
                  <table className="w-full text-left border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2 border">Doctor</th>
                        <th className="p-2 border">Date</th>
                        <th className="p-2 border">Time</th>
                        <th className="p-2 border">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history_Doc.map((appointment) => (
                        <tr key={appointment.id} className="border-t">
                          <td className="p-2 border">
                            {appointment.doctor.name}
                          </td>
                          <td className="p-2 border">
                            {appointment.date.toLocaleDateString()}
                          </td>
                          <td className="p-2 border">{appointment.time}</td>
                          <td className="p-2 border">{appointment.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden space-y-4">
                  {history_Doc.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border rounded-lg p-4 shadow-sm bg-white"
                    >
                      <div>
                        <strong>Doctor:</strong> {appointment.doctor.name}
                      </div>
                      <div>
                        <strong>Date:</strong>{" "}
                        {appointment.date.toLocaleDateString()}
                      </div>
                      <div>
                        <strong>Time:</strong> {appointment.time}
                      </div>
                      <div>
                        <strong>Status:</strong> {appointment.status}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>No appointments found.</p>
            )}
          </div>

          {/* Hospital Appointment History */}
          <h1 className="text-2xl">History of Hospital appointments</h1>
          <div className="bg-muted/50 flex-1 rounded-xl md:min-h-min p-4">
            {history_Hosp.length > 0 ? (
              <>
                <div className="hidden md:block">
                  <table className="w-full text-left border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2 border">Hospital</th>
                        <th className="p-2 border">Date</th>
                        <th className="p-2 border">Time</th>
                        <th className="p-2 border">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history_Hosp.map((appointment) => (
                        <tr key={appointment.id} className="border-t">
                          <td className="p-2 border">
                            {appointment.hospital.name}
                          </td>
                          <td className="p-2 border">
                            {appointment.date.toLocaleDateString()}
                          </td>
                          <td className="p-2 border">{appointment.time}</td>
                          <td className="p-2 border">{appointment.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden space-y-4">
                  {history_Hosp.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border rounded-lg p-4 shadow-sm bg-white"
                    >
                      <div>
                        <strong>Hospital:</strong> {appointment.hospital.name}
                      </div>
                      <div>
                        <strong>Date:</strong>{" "}
                        {appointment.date.toLocaleDateString()}
                      </div>
                      <div>
                        <strong>Time:</strong> {appointment.time}
                      </div>
                      <div>
                        <strong>Status:</strong> {appointment.status}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>No appointments found.</p>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
