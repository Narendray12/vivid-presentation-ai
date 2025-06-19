import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Info,
  AlertCircle,
} from "lucide-react";
import React from "react";

type Props = {
  type: "success" | "warning" | "info" | "question" | "caution";
  children: React.ReactNode;
  className?: string;
};

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
  question: HelpCircle,
  caution: AlertCircle,
};

const CalloutBox = ({ type, children, className }: Props) => {
  const Icon = icons[type];
  const colors = {
    success: {
      bg: "bg-green-100",
      border: "border-green-500",
      text: "text-green-700",
      icon: "text-green-500",
    },
    warning: {
      bg: "bg-yellow-100",
      border: "border-yellow-500",
      text: "text-yellow-700",
      icon: "text-yellow-500",
    },
    info: {
      bg: "bg-blue-100",
      border: "border-blue-500",
      text: "text-blue-700",
      icon: "text-blue-500",
    },
    question: {
      bg: "bg-purple-100",
      border: "border-purple-500",
      text: "text-purple-700",
      icon: "text-purple-500",
    },
    caution: {
      bg: "bg-red-100",
      border: "border-red-500",
      text: "text-red-700",
      icon: "text-red-500",
    },
  };
  return (
    <div
      className={cn(
        "p-4 rounded-lg border-l-4 flex items-start",
        colors[type].bg,
        colors[type].border,
        colors[type].text,
        className
      )}
    >
      <Icon className={`mr-3 h-5 w-5 mt-0.5 ${colors[type].icon}`} />
      <div className="flex-1">{children}</div>
    </div>
  );
};
export default CalloutBox;
