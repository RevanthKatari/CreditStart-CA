"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  showRadialGradient?: boolean;
}

const AuroraBackground = React.forwardRef<HTMLDivElement, AuroraBackgroundProps>(
  ({ className, showRadialGradient = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative flex h-full w-full flex-col items-center justify-center bg-background text-foreground", className)}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="animate-aurora absolute -inset-[10px] opacity-50"
            style={{
              backgroundImage: `
                linear-gradient(to right, #1e3a5f 0%, #2563eb 25%, #0d9488 50%, #1e3a5f 75%, #2563eb 100%),
                linear-gradient(to bottom, #0d9488 0%, transparent 50%, #1e3a5f 100%)
              `,
              backgroundSize: "200% 200%, 100% 100%",
              backgroundPosition: "50% 50%, 50% 50%",
              filter: "blur(80px)",
              mixBlendMode: "normal",
            }}
          />
          {showRadialGradient && (
            <div
              className="absolute inset-0 opacity-90"
              style={{
                background: "radial-gradient(ellipse at 50% 50%, transparent 0%, var(--background) 70%)",
              }}
            />
          )}
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center">
          {children}
        </div>
      </div>
    );
  }
);
AuroraBackground.displayName = "AuroraBackground";

export { AuroraBackground };
