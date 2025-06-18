'use client';

import { Projects, User } from "@prisma/client";
import React from "react";
import { data } from "@/lib/constants";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import NavMain from "./nav-main";
import { RecentOpen } from "./recent-open";
import NavFooter from "./nav-footer";

const AppSidebar = ({
  recentProjects,
  user,
  ...props
}: { recentProjects: Projects[] } & { user: User } & React.ComponentProps<
    typeof Sidebar
  >) => {
  return (
    <Sidebar
      collapsible="icon"
      className="w-[200px] bg-[#1a1a1a] border-r border-[#2a2a2a]"
      {...props}
    >
      <SidebarHeader className="p-4">
        <SidebarMenuButton
          className="hover:bg-transparent p-0 h-auto"
          size={"lg"}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <span className="text-black text-sm font-bold">V</span>
            </div>
            <span className="text-white text-lg font-semibold">Vivid</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent className="px-4 flex flex-col gap-6">
        <NavMain items={data.navMain} />
        <RecentOpen recentProjects={recentProjects} />
      </SidebarContent>
      
      <SidebarFooter className="p-4 mt-auto"> 
        <NavFooter prismauser={user} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;