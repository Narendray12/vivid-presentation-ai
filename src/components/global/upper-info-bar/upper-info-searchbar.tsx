import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

const SearchBar = () => {
  return (
    <div className="relative flex items-center">
      <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search projects..."
        className="pl-8 w-[200px] lg:w-[300px]"
      />
    </div>
  );
};

export default SearchBar;