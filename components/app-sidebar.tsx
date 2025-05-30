"use client";
import "@/app/globals.css";
import { useSession } from "next-auth/react";

import * as React from "react";
import {
  FilePlus2,
  BookOpen,
  ChartNoAxesColumnIncreasing,
  BadgeX,
  Stethoscope,
  Activity,
  ShieldCheck,
  Hospital,
  History,
  CalendarCheck,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { JoinUs } from "@/components/nav-join-us";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { NavAdmin } from "@/components/nav-admin";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  teams: [
    {
      name: "CliniCall",
      logo: Activity,
      plan: "Your Health, Our Priority",
    },
  ],
  navMain: [
    {
      title: "Book an Appointment",
      url: "/appointments/book-an-appointment",
      icon: CalendarCheck,
      isActive: true,
    },
    {
      title: "Appointment Status",
      url: "/appointments/appointment-status",
      icon: ChartNoAxesColumnIncreasing,
    },
    {
      title: "History",
      url: "/appointments/History",
      icon: History,
    },
  ],
  joinUS: [
    {
      name: "Get verified as a Doctor",
      url: "/dashboard/doctor-verification",
      icon: Stethoscope,
    },
    {
      name: "Hospital/Clinic Registration",
      url: "/dashboard/clinic-registration",
      icon: Hospital,
    },
  ],
  adminFunctionalities: [
    {
      name: "Review Requests",
      url: "/admin/review-requests",
      icon: FilePlus2,
    },
    {
      name: "Accepted Requests",
      url: "/admin/accepted-requests",
      icon: ShieldCheck,
    },
    {
      name: "Rejected Requests",
      url: "/admin/rejected-requests",
      icon: BadgeX,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  // console.log("session from side bar", session); // for debugging purposes
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        {/* <h1 className="dancing-script text-4xl">CliniCall</h1> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <>
          {session?.user?.role == "user" ? (
            <JoinUs joinUs={data.joinUS} />
          ) : null}
        </>
        <>
          {session?.user?.role === "admin" ? (
            <NavAdmin adminFunctionalities={data.adminFunctionalities} />
          ) : null}
        </>
      </SidebarContent>
      <SidebarFooter>
        {/*explicitly passing user details*/}
        <NavUser
          user={{
            name: session?.user?.name ?? "Unknown",
            email: session?.user?.email ?? "No Email",
            image: session?.user?.image ?? "/default-avatar.png",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
