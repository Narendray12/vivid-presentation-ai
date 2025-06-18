"use client";

import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavMain = ({ items }: {
  items: {
    title: string;
    url: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) => {
  const pathname = usePathname();
  
  return (
    <SidebarGroup className="p-0"> 
      <SidebarMenu className="space-y-0">
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              className={`
                h-10 px-3 rounded-md text-[#9ca3af] hover:text-white hover:bg-[#2a2a2a] transition-colors
                ${pathname.includes(item.url) 
                  ? 'text-white bg-[#2a2a2a]' 
                  : ''
                }
              `}
            >
              <Link 
                href={item.url}
                className="flex items-center gap-3"
              >
                <item.icon className="h-4 w-4" />
                <span className="text-sm">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavMain;