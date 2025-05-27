"use client";
import "@/app/globals.css";
import { useSession } from "next-auth/react";

import * as React from "react";
import {
  FilePlus2,
  BookOpen,
  Bot,
  BadgeX,
  Stethoscope,
  GalleryVerticalEnd,
  ShieldCheck,
  Hospital,
  Settings2,
  SquareTerminal,
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

// This is sample data.
const data = {
  // user: {
  //   name: "shadcn",
  //   email: "m@example.com",
  //   avatar: "/avatars/shadcn.jpg",
  // },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    // {
    //   name: "Acme Corp.",
    //   logo: AudioWaveform,
    //   plan: "Startup",
    // },
    // {
    //   name: "Evil Corp.",
    //   logo: Command,
    //   plan: "Free",
    // },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
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
