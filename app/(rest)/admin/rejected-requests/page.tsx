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
  // console.log("session", session); // for debuggin purposes

  const doctot_list = await prisma.doctor.findMany({
    where: {
      status: "rejected",
    },
    select: {
      userId: true,
      name: true,
      email: true,
      qualification: true,
      specialization: true,
      nmcRegNo: true,
    },
  });

  const hospital_list = await prisma.hospital.findMany({
    where: {
      status: "rejected",
    },
    select: {
      userID: true,
      name: true,
      email: true,
      address: true,
      speciality: true,
    },
  });

  // console.log("doctot_list", doctot_list); // for debugging purposes
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
                  <BreadcrumbPage>Rejected Requests</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <h1 className="text-2xl font-semibold">Rejected Requests</h1>
          <Separator />
          <h2 className="text-2xl">Doctors</h2>
          <div className="bg-muted/50 rounded-xl p-4">
            <>
              {doctot_list.length === 0 ? (
                <div className="text-center text-gray-500">
                  No doctor requests to review.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="hidden md:grid grid-cols-6 gap-4 font-semibold px-4">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Qualification</div>
                    <div>Specialization</div>
                    <div>NMC Reg No</div>
                    <div className="text-center">Actions</div>
                  </div>
                  {doctot_list.map((doctor) => (
                    <form
                      key={doctor.userId}
                      action="/api/doctor/verify"
                      method="POST"
                      className="border rounded-lg bg-white shadow-sm p-4 md:grid md:grid-cols-6 md:items-center md:gap-4 md:px-4"
                    >
                      <input
                        type="hidden"
                        name="userId"
                        value={doctor.userId}
                      />

                      <div className="text-sm md:text-base font-medium">
                        <span className="md:hidden font-semibold">Name: </span>
                        {doctor.name}
                      </div>

                      <div
                        className="text-sm md:text-base truncate max-w-[180px]"
                        title={doctor.email}
                      >
                        <span className="md:hidden font-semibold">Email: </span>
                        {doctor.email}
                      </div>
                      <div className="text-sm md:text-base">
                        <span className="md:hidden font-semibold">
                          Qualification:{" "}
                        </span>
                        {doctor.qualification}
                      </div>

                      <div className="text-sm md:text-base">
                        <span className="md:hidden font-semibold">
                          Specialization:{" "}
                        </span>
                        {doctor.specialization}
                      </div>

                      <div className="text-sm md:text-base">
                        <span className="md:hidden font-semibold">
                          NMC Reg No:{" "}
                        </span>
                        {doctor.nmcRegNo}
                      </div>

                      <div className="flex gap-2 justify-end md:justify-center">
                        <button
                          type="submit"
                          name="action"
                          value="accept"
                          className="bg-green-600 text-white text-sm px-3 py-1 rounded-md hover:bg-green-700 transition"
                        >
                          Accept
                        </button>
                        <button
                          type="submit"
                          name="action"
                          value="delete"
                          className="bg-red-600 text-white text-sm px-3 py-1 rounded-md hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </form>
                  ))}
                </div>
              )}
            </>
          </div>
          <h2 className="text-2xl">Hospital/Clinics</h2>
          <div className="bg-muted/50 rounded-xl p-4">
            <>
              {" "}
              {hospital_list.length === 0 ? (
                <div className="text-center text-gray-500">
                  No hospital requests to review.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="hidden md:grid grid-cols-6 gap-4 font-semibold px-4">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Address</div>
                    <div>Speciality</div>
                    <div className="text-center col-span-2">Actions</div>
                  </div>
                  {hospital_list.map((hospital) => (
                    <form
                      key={hospital.userID}
                      action="/api/hospitals/verify"
                      method="POST"
                      className="border rounded-lg bg-white shadow-sm p-4 md:grid md:grid-cols-6 md:items-center md:gap-4 md:px-4"
                    >
                      <input
                        type="hidden"
                        name="userID"
                        value={hospital.userID}
                      />

                      <div className="text-sm md:text-base font-medium">
                        <span className="md:hidden font-semibold">Name: </span>
                        {hospital.name}
                      </div>

                      <div
                        className="text-sm md:text-base truncate max-w-[180px]"
                        title={hospital.email}
                      >
                        <span className="md:hidden font-semibold">Email: </span>
                        {hospital.email}
                      </div>

                      <div className="text-sm md:text-base">
                        <span className="md:hidden font-semibold">
                          Address:{" "}
                        </span>
                        {hospital.address}
                      </div>

                      <div className="text-sm md:text-base">
                        <span className="md:hidden font-semibold">
                          Speciality:{" "}
                        </span>
                        {hospital.speciality}
                      </div>

                      <div className="flex gap-2 justify-end md:justify-center col-span-2">
                        <button
                          type="submit"
                          name="action"
                          value="accept"
                          className="bg-green-600 text-white text-sm px-3 py-1 rounded-md hover:bg-green-700 transition"
                        >
                          Accept
                        </button>
                        <button
                          type="submit"
                          name="action"
                          value="delete"
                          className="bg-red-600 text-white text-sm px-3 py-1 rounded-md hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </form>
                  ))}
                </div>
              )}
            </>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
