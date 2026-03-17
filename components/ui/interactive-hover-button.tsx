import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        // Extra left padding so the expanding dot never feels like it's on the text.
        "group relative cursor-pointer overflow-hidden rounded-full border bg-background pl-10 pr-6 py-3 text-center font-semibold",
        className,
      )}
      {...props}
    >
      <span className="relative z-10 inline-block whitespace-pre translate-x-0.5 transition-all duration-300 group-hover:translate-x-10 group-hover:opacity-0">
        {text}
      </span>
      <div className="absolute inset-0 z-10 flex translate-x-10 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <span className="whitespace-pre">{text}</span>
        <ArrowRight className="size-4 shrink-0" />
      </div>
      <div className="pointer-events-none absolute left-[20%] top-[45%] z-0 h-2 w-2 rounded-lg bg-primary transition-all duration-300 group-hover:left-0 group-hover:top-0 group-hover:h-full group-hover:w-full group-hover:scale-[1.6]" />
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
