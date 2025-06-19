import React from "react";
import { User } from "@prisma/client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import SearchBar from "./upper-info-searchbar";
import ThemeSwiter from "../mode-toggle";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import NewProjectButton from "./new-project-button";
import { Separator } from "@/components/ui/separator";

type Props = {
  user: User;
  children: React.ReactNode;
};

const UpperInfoBar = ({ user }: Props) => {
  return (
    <header className="sticky top-0 z-[10] flex shrink-0 flex-wrap items-center gap-2 bg-background p-4 justify-between">
      <SidebarTrigger className="-ml-1" />
      <div className="w-full max-w-[95%] flex items-center justify-end">
        <Separator className="mr-2 h-4" orientation="vertical" />
        <div className="w-full max-w-[95%] flex items-center justify-between gap-4 flex-wrap">
          <SearchBar />
          <ThemeSwiter />
          <div className="flex flex-wrap gap-4 items-center justfify-end">
            <Button className="bg-primary-80 rounded-lg hover:bg-background-80 text-primary font-semibold cursor-not-allowed">
              <Upload />
              Import
            </Button>
          </div>

          <NewProjectButton user={user} />
        </div>
      </div>
    </header>
  );
};

export default UpperInfoBar;
