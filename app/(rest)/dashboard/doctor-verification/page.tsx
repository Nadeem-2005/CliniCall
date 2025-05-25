import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";

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
                  <BreadcrumbPage>Get verified as a doctor </BreadcrumbPage>
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
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-6">
          <form className="space-y-4 max-w-xl mx-auto">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Full Name
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
                // placeholder={session?.user?.email || "Enter your email"}
                value={session?.user?.email || ""} // Pre-fill with user's email if available
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="qualification"
              >
                Qualification
              </label>
              <input
                type="text"
                id="qualification"
                name="qualification"
                required
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="nmc">
                NMC Registered Number
              </label>
              <input
                type="text"
                id="nmc"
                name="nmc"
                required
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="specialization"
              >
                Specialization
              </label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                required
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="about">
                About You
              </label>
              <textarea
                id="about"
                name="about"
                rows={5}
                className="w-full border rounded-md p-2"
                placeholder="Write something about yourself..."
              />
            </div>

            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Submit
            </button>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Page;
