"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileCode2, Sparkles, Loader2, Send } from "lucide-react";
import { useCompletion } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CodeExplainPage() {
  const { completion, input, handleInputChange, handleSubmit, isLoading } = useCompletion({
    api: '/api/explain',
  });

  return (
    <div className="flex flex-col gap-8 h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Code Explain</h1>
        <p className="text-muted-foreground mt-1">Paste your code below to get an AI-generated explanation of its purpose, flow, and dependencies.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Left Panel: Input */}
        <div className="w-full lg:w-1/2 flex-shrink-0 flex flex-col gap-4">
          <Card className="flex-1 bg-card/50 backdrop-blur-sm border-border/50 flex flex-col overflow-hidden">
            <CardHeader className="py-4 border-b border-border/50">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileCode2 className="h-4 w-4" /> Input Code
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col">
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Paste your code snippet here..."
                  className="flex-1 border-0 focus-visible:ring-0 rounded-none resize-none font-mono text-sm p-4"
                />
                <div className="p-4 border-t border-border/50 bg-muted/20">
                  <Button type="submit" disabled={isLoading || !input} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Explain Code
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Explanation */}
        <Card className="flex-1 bg-card/50 backdrop-blur-sm border-border/50 overflow-y-auto">
          <CardHeader className="border-b border-border/50 bg-muted/20 sticky top-0 backdrop-blur-md z-10 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" /> Explanation
            </CardTitle>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              Gemini 2.5 Flash
            </Badge>
          </CardHeader>
          <CardContent className="p-6">
            {!completion && !isLoading ? (
              <div className="text-muted-foreground text-sm italic flex h-full items-center justify-center min-h-[200px]">
                Waiting for input...
              </div>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-sm">
                {completion}
                {isLoading && <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
