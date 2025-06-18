'use client'
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Projects } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSlideStore } from "@/store/useSlideStore";
import { FileText } from "lucide-react";

type Props = {
  recentProjects: Projects[];
};

export const RecentOpen = ({ recentProjects }: Props) => {
  const Router = useRouter();
  const { setSlides } = useSlideStore();
  
  const handleClick = (projectID: string, slides: JsonValue) => {
    if (!projectID && !slides) {
      toast.error("Project not found", {
        description: "Please try again",
      });
      return;
    }
    setSlides(JSON.parse(JSON.stringify(slides)));
    Router.push(`/presentation/${projectID}`);
  };

  return recentProjects.length > 0 ? (
    <SidebarGroup>
      <SidebarGroupLabel>Recently Opened</SidebarGroupLabel>
      <SidebarMenu>
        {recentProjects.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
            >
              <Button
                onClick={() => handleClick(item.id, item.slides)}
                variant="ghost"
                className="w-full justify-start h-auto p-2"
              >
                <FileText className="h-4 w-4" />
                <span className="truncate">{item.title}</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  ) : null;
};