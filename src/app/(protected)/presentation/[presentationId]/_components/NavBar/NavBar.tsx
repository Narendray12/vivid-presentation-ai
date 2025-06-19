"use client";
import { Button } from "@/components/ui/button";
import { useSlideStore } from "@/store/useSlideStore";
import { Home, Play, Share } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";

type props = { presentationId: string };

const NavBar = ({ presentationId }: props) => {
  const { currentTheme } = useSlideStore();
  const [isPresentationMode, setIsPresentationMode] = React.useState(false);
  const params = useParams();

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/share/${presentationId}`
    );
    toast.success("Copied to clipboard", {
      description: "Link copied to clipboard",
    });
  };
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 w-full h-14 flex justify-between items-center py-4 px-7 border-b"
      style={{
        backgroundColor:
          currentTheme.navbarColor || currentTheme.backgroundColor,
        color: currentTheme.accentColor,
      }}
    >
      <Link href={"/dashboard"} passHref>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          style={{
            backgroundColor: currentTheme.backgroundColor,
          }}
        >
          <Home />
          <span className="hidden sm:inline">Return Home</span>
        </Button>
      </Link>
      <Link
        href="/presenation/template-market"
        className="text-lg font-semibold hidden sm:block"
      >
        Presentation Editor{" "}
      </Link>

      <div className="flex items-center gap-4">
        <Button
          style={{
            backgroundColor: currentTheme.backgroundColor,
          }}
          onClick={handleCopy}
          variant="outline"
        >
          <Share className="w-4 h-4" />
        </Button>
        <Button variant={'default'}
        className="flex items-center gap-2"
        onClick={()=>setIsPresentationMode(true)}>
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">Present</span>
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;
