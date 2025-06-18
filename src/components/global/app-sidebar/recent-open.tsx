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
      <SidebarGroupLabel className="text-xs text-[#9ca3af] font-normal mb-2 px-0">
        Recently Opened
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-0">
        {recentProjects.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              className="h-8 px-3 text-[#9ca3af] hover:text-white hover:bg-[#2a2a2a] rounded-md transition-colors"
            >
              <Button
                onClick={() => handleClick(item.id, item.slides)}
                variant="ghost"
                className="w-full justify-start h-8 p-0 text-xs font-normal hover:bg-transparent"
              >
                <span className="truncate">{item.title}</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  ) : null;
};