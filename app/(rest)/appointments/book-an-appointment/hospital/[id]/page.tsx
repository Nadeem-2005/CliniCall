import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import BookingForm from "@/components/Forms/hospital/booking-form";
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const session = await auth();
  if (!session) return redirect("/");

  const { id } = await params;

  const hospital = await prisma.hospital.findUnique({
    where: { id: id },
    select: { name: true, speciality: true },
  });

  if (!hospital) {
    return (
      <div className="text-center p-8 text-red-500 font-semibold">
        Hospital not found.
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/appointments/book-an-appointment">
                  Book an Appointment
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Booking Form</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="p-4 pt-0">
          <div className="bg-muted/50 min-h-[100vh] rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">
              Book an Appointment in {hospital.name}
            </h2>
            <BookingForm
              session={session}
              hospitalId={id}
              hospitalName={hospital.name}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
