import usePromptStore from "@/store/usePromptStore";
import React from "react";
import { motion } from "framer-motion";
import { containerVariants, itemVariants, timeAgo } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useCreativeAIStore from "@/store/useCreativeAIStore";
import { toast } from "sonner";
type props = {};

const RecentPrompts = (props: props) => {
  const { prompts, setPage } = usePromptStore();
  const { addMultipleOutlines, setCurrentAiPrompt } = useCreativeAIStore();
  const handleEdit = (id: string) => {
    const prompt = prompts.find((prompt) => prompt?.id === id);
    if (prompt) {
      setPage("creative-ai");
      addMultipleOutlines(prompt?.outlines);
      setCurrentAiPrompt(prompt?.title);
    }
    else{
        toast.error("Prompt not found",{
            description:'prompt not found'
        })
    }
  };
  return (
    <motion.div variants={containerVariants} className="space-y-4 mt-20">
      <motion.h2
        variants={itemVariants}
        className="text-2xl font-semibold text-center"
      >
        Your recent Prompts
      </motion.h2>
      <motion.div
        variants={containerVariants}
        className="grid gap-6 md:grid-cols-3"
      >
        {prompts.map((prompt, i) => (
          <motion.div variants={itemVariants} key={i}>
            <Card className="p-4 flex items-center justify-between hover:bg-accent/50 transition-colors duration-300">
              <div className="max-w-[70%]">
                <h3 className="font-semibold text-xl line-clamp-1">
                  {prompt?.title}
                </h3>
                <p className="font-semibold text-sm text-muted-foreground">
                  {timeAgo(prompt?.createdAt)}
                </p>
              </div>
              <Button
                variant="default"
                size="sm"
                className="rounded-xl bg-primary-20 dark:hover:bg-gray-700 hover:bg-gray-200 text-primary"
                onClick={() => handleEdit(prompt?.id)}
              >
                Edit
              </Button>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default RecentPrompts;
