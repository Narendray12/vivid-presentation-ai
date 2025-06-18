"use client";
import { JsonValue } from "@prisma/client/runtime/library";
import React from "react";
import { motion } from "framer-motion";
import { itemVariants, themes, timeAgo, containerVariants } from "@/lib/constants";
import { useSlideStore } from "@/store/useSlideStore";
import { useRouter } from "next/navigation";
import ThumbnailPreview from "./thumbnail-preview";
import AlertDialogBox from "../alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteProject, recoverProject } from "@/actions/projects";

type props = {
  projectId: string;
  title: string;
  CreatedAt: string;
  isDeleted: boolean;
  slideData: JsonValue;
  themeName: string;
};
const ProjectCard = ({
  projectId,
  title,
  CreatedAt,
  isDeleted,
  slideData,
  themeName,
}: props) => {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { setSlides } = useSlideStore();
  const router = useRouter();
  const handleNavigation = () => {
    setSlides(JSON.parse(JSON.stringify(slideData)));
    router.push("/presentation/" + projectId);
  };
  const theme = themes.find((theme) => theme.name === themeName) || themes[0];
  const handleRecover = async () => {
    setLoading(true);
    if (!projectId) {
      setLoading(false);
      toast("Error", {
        description: "Project not found.",
      });
      return;
    }
    try {
      const res = await recoverProject(projectId);
    } catch (error) {
      setLoading(false);
      toast("Error", {
        description: "Error recovering project.",
      });
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    if (!projectId) {
      setLoading(false);
      toast("Error", {
        description: "Project not found.",
      });
      return;
    }
    try {
      const res = await deleteProject(projectId);
    } catch (error) {
      setLoading(false);
      toast("Error", {
        description: "Error deleting project.",
      });
    }
  };
  return (
    <motion.div
      className={`group w-full flex flex-col gap-y-3 rounded-xl p-3 transition-colors ${
        !isDeleted && "hover:bg-muted/50"
      }`}
      variants={itemVariants}
    >
      <div
        className="realative aspect-[16/10] overflow-hidden rounded-lg cursor-pointer"
        onClick={handleNavigation}
      >
        <ThumbnailPreview
          theme={theme}
          slide={JSON.parse(JSON.stringify(slideData))?.[0]}
        />
      </div>
      <div className="w-full">
        <div className="space-y-1">
          <h3 className="font-semibold text-base text-primary line-clamp-1">
            {title}
          </h3>
          <div className="flex w-full justify-between items-center gap-2">
            <p
              className="text-sm text-muted-forground"
              suppressHydrationWarning
            >
              {timeAgo(CreatedAt)}
            </p>
            {isDeleted ? (
              <AlertDialogBox
                description="this will recover your project and restore your data."
                className="bg-green-500 text-white dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700"
                loading={loading}
                open={open}
                handleOpen={() => setOpen(!open)}
                onclick={handleRecover}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-background-80 dark:hover:bg-background-90"
                  disabled={loading}
                >
                  Recover
                </Button>
              </AlertDialogBox>
            ) : (
              <AlertDialogBox
                description="This will delete your project and send to trash."
                className="bg-red-500 text-white dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700"
                onclick={handleDelete}
                loading={loading}
                open={open}
                handleOpen={() => setOpen(!open)}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-background-80 dark:hover:bg-background-90"
                  disabled={loading}
                >
                  Delete
                </Button>
              </AlertDialogBox>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
