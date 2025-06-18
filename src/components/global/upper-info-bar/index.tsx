import React from "react";
import { User } from "@prisma/client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import SearchBar from "./upper-info-searchbar";
import ThemeSwiter from "../mode-toggle";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import NewProjectButton from "./new-project-button";

type Props = {
  user: User;
};

const UpperInfoBar = ({ user }: Props) => {
  return (
    <header className="sticky top-0 z-[10] flex shrink-0 flex-wrap items-center gap-2  bg-background p-4 justify-between">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className="w-full max-w-[95%] flex items-center gap-4 flex-wrap">
        <SearchBar />
      </div>
      <ThemeSwiter />
      <div className="flex flex-wrap gap-4 items-center justify-end">
        <Button className="bg-primary-80 rounded-lg hover:bg-primary-80 text-primary font-semibold cursor-not-allowed">
          <Upload />
          Import
        </Button>
        <NewProjectButton user={user} />
      </div>
    </header>
  );
};

export default UpperInfoBar;
