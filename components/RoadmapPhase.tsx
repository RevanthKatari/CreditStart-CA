"use client";

import { Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckboxGroup, CheckboxItem } from "@/components/ui/checkbox-group";
import type { RoadmapTask } from "@/lib/types";

type Props = {
  month: 1 | 2 | 3;
  tasks: RoadmapTask[];
  checked: Set<string>;
  onToggle: (id: string) => void;
  completed: boolean;
};

const PHASES: Record<1 | 2 | 3, { title: string; subtitle: string }> = {
  1: { title: "Month 1", subtitle: "The Foundation" },
  2: { title: "Month 2", subtitle: "The System" },
  3: { title: "Month 3", subtitle: "The Discipline" },
};

export default function RoadmapPhase({ month, tasks, checked, onToggle, completed }: Props) {
  const { title, subtitle } = PHASES[month];

  return (
    <Card
      className={`transition-all ${
        completed ? "border-primary/30 bg-primary/5" : ""
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {completed && (
          <Badge variant="default" className="gap-1 bg-primary">
            <Check className="size-3" />
            Completed
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <CheckboxGroup className="gap-3">
          {tasks.map((task) => (
            <CheckboxItem
              key={task.id}
              label={`${task.core ? "[Core]" : "[Optional]"} ${task.label}`}
              index={tasks.findIndex((t) => t.id === task.id)}
              checked={checked.has(task.id)}
              onToggle={() => onToggle(task.id)}
              description={task.description}
            />
          ))}
        </CheckboxGroup>
      </CardContent>
    </Card>
  );
}
