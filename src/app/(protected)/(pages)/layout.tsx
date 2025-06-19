import { getRecentProjects } from "@/actions/projects";
import { onAuthenticateUser } from "@/actions/user";
import AppSidebar from "@/components/global/app-sidebar";
import UpperInfoBar from "@/components/global/upper-info-bar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = async ({children}:Props) => {
  const recentProjects = await getRecentProjects();
  const checkuser = await onAuthenticateUser();
  
  if (!checkuser.user) {
    redirect("/sign-in");
  }
  
  return (
    <SidebarProvider>
      <AppSidebar user={checkuser.user} recentProjects={recentProjects.data || []} />
      <SidebarInset>
        <UpperInfoBar user={checkuser.user} children />
        <div className="p-4">{children}</div>
        
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;