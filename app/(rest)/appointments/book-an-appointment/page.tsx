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
import { MapPin, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Page() {
  const session = await auth();
  if (!session) return redirect("/");

  const docList = await prisma.doctor.findMany({
    where: {
      status: "approved",
    },
  });

  const hospitalList = await prisma.hospital.findMany({
    where: {
      status: "approved",
    },
  });

  // console.log("Doctor List:", docList);
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
                  <BreadcrumbLink href="/dashboard"></BreadcrumbLink>
                  Dashboard
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Book an Appointment</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <h2 className="text-2xl">Doctors</h2>
          <div className="bg-muted/50 min-h-[50vh] md:min-h-min flex-1 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {docList.map((doc) => (
              <div
                key={doc.id}
                className="relative bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4 border border-gray-100 hover:shadow-xl transition-shadow duration-300 max-w-sm h-fit"
              >
                <div className="absolute top-4 right-4">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>

                <div className="flex flex-col items-center gap-3 pt-2">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {doc.name}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium mt-1">
                      {doc.qualification}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                    <span className="line-clamp-2">
                      {doc.address || doc.location || "Address not available"}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Time:</span>
                      <span>
                        {doc.timing_from} - {doc.timing_to}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Days:</span>
                      <span>
                        {doc.days_from} - {doc.days_to}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/appointments/book-an-appointment/doctor/${doc.id}`}
                  className="mt-auto"
                >
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors">
                    Book Appointment
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <h2 className="text-2xl mt-8">Hospitals/Clinics</h2>
          <div className="bg-muted/50 min-h-[50vh] md:min-h-min flex-1 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hospitalList.map((hospital) => (
              <div
                key={hospital.id}
                className="relative bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4 border border-gray-100 hover:shadow-xl transition-shadow duration-300 max-w-sm h-fit"
              >
                <div className="absolute top-4 right-4">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>

                <div className="flex flex-col items-center gap-3 pt-2">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {hospital.name}
                    </h3>
                    <p className="text-sm text-green-600 font-medium mt-1">
                      {hospital.speciality}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                    <span className="line-clamp-2">
                      {hospital.address ||
                        hospital.location ||
                        "Address not available"}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Time:</span>
                      <span>
                        {hospital.timing_from} - {hospital.timing_to}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Days:</span>
                      <span>
                        {hospital.days_from} - {hospital.days_to}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/appointments/book-an-appointment/hospital/${hospital.id}`}
                  className="mt-auto"
                >
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition-colors">
                    Book Appointment
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
