"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CheckboxGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  checkedIndices?: Set<number>;
}

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2", className)}
      role="group"
      aria-label="Checkbox group"
      {...props}
    >
      {children}
    </div>
  )
);
CheckboxGroup.displayName = "CheckboxGroup";

interface CheckboxItemProps {
  label: string;
  index: number;
  checked: boolean;
  onToggle: () => void;
  className?: string;
  description?: string;
}

function CheckboxItem({
  label,
  index,
  checked,
  onToggle,
  className,
  description,
}: CheckboxItemProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/50",
        checked && "border-primary/50 bg-primary/5",
        className
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={label}
        onClick={onToggle}
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          checked
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/40 bg-background hover:border-primary/60"
        )}
      >
        {checked && (
          <svg className="size-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M2 6l3 3 5-6" />
          </svg>
        )}
      </button>
      <div className="min-w-0 flex-1">
        <span className={cn("text-sm font-medium", checked && "text-muted-foreground line-through")}>
          {label}
        </span>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

export { CheckboxGroup, CheckboxItem };
