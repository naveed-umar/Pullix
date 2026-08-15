"use client";

import { useState } from "react";
import { MetricCard } from "@/components/shared/metric-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RefactoringMetricProps {
  title: string;
  value: string | number;
  icon: React.ElementType | React.ReactNode;
  details: string[];
}

export function RefactoringMetric({ title, value, icon, details }: RefactoringMetricProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative group">
        <MetricCard title={title} value={value} icon={icon} />
        
        <DialogTrigger 
          render={
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute bottom-2 right-2 text-xs h-7 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur hover:bg-background"
            >
              View Details
            </Button>
          }
        />
      </div>

      <DialogContent className="sm:max-w-md border-border/50 bg-card/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>Details: {title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto space-y-2 py-4">
          {details.map((detail, idx) => (
            <div key={idx} className="p-3 bg-muted/50 rounded-md border border-border/50 text-sm font-mono text-muted-foreground break-all">
              {detail}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
