import React, { FC } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonLoadingProps {
  type?: "button" | "submit" | "reset";
  text: string;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

const ButtonLoading: FC<ButtonLoadingProps> = ({
  type,
  text,
  loading,
  onClick,
  className,
}) => {
  return (
    <Button
      className={cn("", className)}
      type={type}
      disabled={loading}
      onClick={onClick}
    >
      {loading && <Loader2 className="animate-spin" />}
      {text}
    </Button>
  );
};

export default ButtonLoading;
