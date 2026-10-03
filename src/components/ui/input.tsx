import * as React from "react";
import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "h-10 w-full rounded-lg border border-(--border-color) bg-white px-3 py-2 text-sm text-(--text-main) transition-colors placeholder:text-(--text-light) focus:border-(--primary) focus:ring-3 focus:ring-blue-600/15 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
}

export { Input };