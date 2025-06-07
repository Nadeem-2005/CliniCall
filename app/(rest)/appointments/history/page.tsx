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

  const history_Doc = await prisma.appointment_doctor.findMany({
    where: {
      userId: session?.user.id,
    },
  });

  const history_Hosp = await prisma.appointmentment_hospital.findMany({
    where: {
      userId: session?.user.id,
    },
  });

  //   console.log("history_Doc", history_Doc);
  //   console.log("history_Hosp", history_Hosp);
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
                  <BreadcrumbLink href="/Dashboard">Dashboard</BreadcrumbLink>
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
          <h1 className="text-2xl">History of Doctor appointments</h1>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min"></div>
          <h1 className="text-2xl">History of Hospital appointments</h1>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min"></div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
