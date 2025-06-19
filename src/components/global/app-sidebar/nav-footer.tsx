"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { ChevronsUpDown, LogOut, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
        <div className="flex flex-col gap-y-6 items-start group-data-[collapsible=icon]:hidden">
          {!prismauser.subscription && (
            <div className="flex flex-col items-start p-2 pb-3 gap-4 bg-background-80 rounded-xl">
              <div className=" flex flex-col items-start gap-1">
                <p className="text-base font-bold">
                  Get
                  <span className="text-vivid">Creative AI</span>
                </p>
                <span className="text-sm dark:test-secondary">
                  Unlock all features including AI and more
                </span>
              </div>
              <div className="w-full bg-vivid-gradient p-[1px] rounded-full">
                <Button
                className="w-full border-vivid bg-background-80 hover:bg-background-90 text-primary rounded-full font-bold"
                size="lg"
                //onClick={handleUpgrading}
                variant={'default'}
              >
                {loading ? "Upgrading..." : "Upgrade"}
              </Button>
              </div>
              
            </div>
          )}

          <SignedIn>
            <SidebarMenuButton 
            size={'lg'}
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:test-sidebar-accent-foreground"
            >
              <UserButton />
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">
                    {user.fullName}
                    </span>
                    <span className="truncate ">
                      {user?.emailAddresses[0].emailAddress}
                    </span>
              </div>
            </SidebarMenuButton>
          </SignedIn>
        </div>

      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavFooter;
