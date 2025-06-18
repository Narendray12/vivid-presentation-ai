"use client";

import { Button } from "@/components/ui/button";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";

const NavFooter = ({ prismauser }: { prismauser: User }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  
  if (!isLoaded || !isSignedIn) {
    return null;
  }
  
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="group-data-[collapsible=icon]:hidden">
          {!prismauser.subscription && (
            <div className="bg-[#2a2a2a] rounded-lg p-3 space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">
                  Get <span className="text-orange-500">Creative AI</span>
                </p>
                <p className="text-xs text-[#9ca3af] leading-relaxed">
                  Unlock all features including AI and more
                </p>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium text-xs h-8 rounded-full"
                // onClick={handleUpgrading}
              >
                {loading ? "Upgrading..." : "Upgrade"}
              </Button>
            </div>
          )}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavFooter;