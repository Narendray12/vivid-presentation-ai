"use client";
import { getProjectById } from "@/actions/projects";
import { themes } from "@/lib/constants";
import { useSlideStore } from "@/store/useSlideStore";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { redirect, useParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";
const Page = () => {
  const { setSlides, setProjects, currentTheme, setCurrentTheme } =
    useSlideStore();
  const params = useParams();
  const { setTheme } = useTheme();
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getProjectById(params.presentationId as string);
        if (res.status !== 200 || !res.data) {
          toast.error("Error", {
            description: "Error loading project",
          });
          redirect("/dashboard");
        }
        const findTheme = themes.find(
          (theme) => theme.name === res.data.themeName
        );
        setCurrentTheme(findTheme || themes[0]);
        setTheme(findTheme?.type === "dark" ? "dark" : "light");
        setProjects([res.data]);
        setSlides(JSON.parse(JSON.stringify(res.data.slides)));
      } catch (error) {
        toast.error("Error", {
          description: "An unexpected error occurred",
        });
      } finally {
        setIsLoading(false);
      }
    })();
  },[]);

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-primary"></Loader2>
        </div>
    )
  }
  return 
};

export default Page;
