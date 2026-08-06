"use client";

import { useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIRefactorCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  files: string[];
  issueDescription: React.ReactNode;
}

export function AIRefactorCard({ title, description, icon, files, issueDescription }: AIRefactorCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/refactor',
  });

  const handleRefactor = () => {
    setIsOpen(true);
    if (!completion && !isLoading) {
      // Extract string content if issueDescription is ReactNode, but typically it will be simple strings/elements.
      // We can just pass the props to AI directly since we know the context.
      const prompt = `Issue: ${title}\nDescription: ${description}\nFiles involved:\n${files.map(f => `- ${f}`).join('\n')}`;
      complete(prompt);
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon} {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground space-y-2">
          {files.map((file, idx) => (
            <p key={idx} className="font-mono text-xs bg-muted p-1.5 rounded-md border border-border/50">
              {file}
            </p>
          ))}
        </div>
        <div className="text-sm">
          {issueDescription}
        </div>
        
        {!isOpen ? (
          <Button variant="outline" className="w-full" onClick={handleRefactor}>
            View AI Refactor <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <div className="mt-4 rounded-md border border-primary/20 bg-primary/5 p-4 relative overflow-hidden">
            <div className="flex items-center gap-2 font-medium text-primary mb-3">
              <Sparkles className="h-4 w-4" /> AI Refactoring Plan
              {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
            </div>
            <div className="text-sm text-foreground/80 whitespace-pre-wrap font-mono leading-relaxed">
              {completion || (isLoading ? "Analyzing codebase and generating plan..." : "No response generated.")}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
