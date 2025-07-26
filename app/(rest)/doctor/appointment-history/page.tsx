import { AppSidebar } from "@/components/app-sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { cache } from "@/lib/redis";

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

interface PageProps {
  searchParams: { page?: string; limit?: string };
}

export default async function Page({ searchParams }: PageProps) {
  const session = await auth();
  if (!session) return redirect("/");

  // Get pagination parameters
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const skip = (page - 1) * limit;

  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!doctor) return redirect("/");

  // Try to get appointments from cache first
  const cacheKey = `appointments:doctor:${doctor.id}:history:${page}:${limit}`;
  let cachedData = await cache.get(cacheKey);

  let reviewedAppointments, totalCount;

  if (cachedData) {
    ({ reviewedAppointments, totalCount } = cachedData);
  } else {
    // Fetch from database with pagination
    const [appointments, count] = await Promise.all([
      prisma.appointment_doctor.findMany({
        where: {
          doctorId: doctor.id,
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
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.appointment_doctor.count({
        where: {
          doctorId: doctor.id,
          status: { in: ["accepted", "rejected"] },
        },
      }),
    ]);

    reviewedAppointments = appointments;
    totalCount = count;

    // Cache the results for 5 minutes
    await cache.set(cacheKey, { reviewedAppointments, totalCount }, 300);
  }

  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

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
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-4">
            {/* Pagination Info */}
            <div className="mb-4 text-sm text-gray-600">
              Showing {reviewedAppointments.length} of {totalCount} appointments
              (Page {page} of {totalPages})
            </div>
            
            {reviewedAppointments.length > 0 ? (
              <>
                {reviewedAppointments.map((appointment) => {
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
                })}
                
                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                  <div className="flex gap-2">
                    {hasPrevPage && (
                      <a
                        href={`?page=${page - 1}&limit=${limit}`}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Previous
                      </a>
                    )}
                    {hasNextPage && (
                      <a
                        href={`?page=${page + 1}&limit=${limit}`}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Next
                      </a>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <a
                          key={pageNum}
                          href={`?page=${pageNum}&limit=${limit}`}
                          className={`px-3 py-1 rounded ${
                            pageNum === page
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {pageNum}
                        </a>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="px-2">...</span>
                        <a
                          href={`?page=${totalPages}&limit=${limit}`}
                          className={`px-3 py-1 rounded ${
                            totalPages === page
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {totalPages}
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </>
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
