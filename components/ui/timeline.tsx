import { cn } from "@/lib/utils";

export interface TimelineItem {
  title: string;
  content: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("relative space-y-8 border-l border-border pl-4", className)}>
      {items.map((item, index) => (
        <div key={index} className="relative pl-4">
          <div className="absolute -left-[9px] top-1 size-4 rounded-full border-2 border-primary bg-background" />
          <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
          <div className="mt-2 text-sm text-muted-foreground">{item.content}</div>
        </div>
      ))}
    </div>
  );
}

