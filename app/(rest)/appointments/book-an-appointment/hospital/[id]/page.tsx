import { AppSidebar } from "@/components/app-sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
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

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import prisma from "@/lib/prisma";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const session = await auth();
  if (!session) return redirect("/");

  const id = params.id;

  const hospital = await prisma.hospital.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
      speciality: true,
    },
  });
  // console.log(params);
  console.log("hospital Details:", hospital);

  if (!hospital) {
    return (
      <div className="text-center p-8 text-red-500 font-semibold">
        hospital not found.
      </div>
    );
  }

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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/appointments/book-an-appointment">
                    Book an Appointment
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Booking Form</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-6">
            <h2 className="text-2xl font-bold mb-4">
              Book an Appointment in {hospital.name}
            </h2>
            <form className="space-y-6 max-w-xl">
              <div>
                <Label htmlFor="name">Your Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={session.user.name || ""}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={session.user.email || ""}
                  readOnly
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
                <div>
                  <Label htmlFor="time">Preferred Time</Label>
                  <Input id="time" name="time" type="time" required />
                </div>
              </div>
              <div>
                <Label htmlFor="reason">Reason for Appointment</Label>
                <Textarea
                  id="reason"
                  name="reason"
                  placeholder="Describe your symptoms or concerns..."
                  required
                />
              </div>
              <Button type="submit" className="w-full md:w-auto">
                Submit Appointment Request
              </Button>
            </form>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
