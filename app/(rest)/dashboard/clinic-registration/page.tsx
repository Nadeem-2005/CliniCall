import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
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

const Page = async () => {
  const session = await auth();

  // console.log(session);

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
                  <BreadcrumbLink href="/dashboard">DashBoard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Hospital/Clinic Registration</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl"></div>
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div> */}
        <div className="bg-white border-l-4 border-black text-black p-4 my-6 rounded-md shadow-sm">
          <strong>Note:</strong> Only register here if you are a hospital or
          clinic. If you are a doctor or healthcare professional looking to
          register, please click{" "}
          <Link
            href="/dashboard/clinic-registration"
            className="underline text-black hover:text-gray-800"
          >
            here
          </Link>
          .
        </div>
        <div className="relative z-0 bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-6">
          <form
            className="space-y-4 max-w-xl mx-auto"
            action="/api/hospitals/register"
            method="POST"
            encType="multipart/form-data"
          >
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Hospital/Clinic Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full border rounded-md p-2"
                value={session?.user?.email || ""}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="phone">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full border rounded-md p-2"
                placeholder="e.g., +91 98765 43210"
              />
            </div>

            {/* Address */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="address"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="location"
              >
                Location Link (Google Maps)
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="speciality"
              >
                Speciality
              </label>
              <input
                type="text"
                id="speciality"
                name="speciality"
                required
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full border rounded-md p-2"
                placeholder="Tell us something about your hospital or clinic..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Timing</label>
              <div className="flex gap-4">
                <select
                  id="timing_from"
                  name="timing_from"
                  required
                  className="flex-1 border rounded-md p-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Array.from({ length: 24 }, (_, hour) => {
                    const value = `${hour.toString().padStart(2, "0")}:00`;
                    return (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    );
                  })}
                </select>
                to
                <select
                  id="timing_to"
                  name="timing_to"
                  required
                  className="flex-1 border rounded-md p-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Array.from({ length: 24 }, (_, hour) => {
                    const value = `${hour.toString().padStart(2, "0")}:00`;
                    return (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Days</label>
              <div className="flex gap-4">
                <select
                  id="days_from"
                  name="days_from"
                  required
                  className="flex-1 border rounded-md p-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                to
                <select
                  id="days_to"
                  name="days_to"
                  required
                  className="flex-1 border rounded-md p-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition"
              >
                Register Hospital
              </button>
            </div>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Page;
