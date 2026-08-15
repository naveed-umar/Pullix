"use client";

import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Box, Code, Database, Globe, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 250, height: 60 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode: Node = {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - 250 / 2,
        y: nodeWithPosition.y - 60 / 2,
      },
    };
    return newNode;
  });

  return { nodes: newNodes, edges };
};

export function ArchitectureGraph({ initialData }: { initialData: any }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [mounted, setMounted] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    if (initialData?.nodes && initialData?.edges) {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        initialData.nodes,
        initialData.edges
      );
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [initialData, setNodes, setEdges]);

  const onNodeClick = useCallback((event: any, node: Node) => {
    setSelectedNode(node.data);
  }, []);

  if (!mounted) return <div className="h-[600px] w-full rounded-xl border border-border/50 bg-muted/20 animate-pulse" />;

  if (!initialData) {
    return (
      <div className="h-full flex flex-col items-center justify-center border border-dashed border-border/50 rounded-xl bg-card/20 p-12 text-center">
        <Layers className="h-12 w-12 text-muted-foreground mb-4 opacity-50 mx-auto animate-pulse" />
        <h3 className="text-lg font-semibold">Generating Architecture...</h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-2 mb-6">
          The architecture engine is automatically running static analysis in the background to build your dependency graph. Please check back in a few seconds!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full w-full">
      <div className="flex-1 min-h-[600px] rounded-xl border border-border/50 bg-background/50 overflow-hidden relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          colorMode="dark"
          proOptions={{ hideAttribution: true }}
        >
          <Controls />
          <MiniMap zoomable pannable nodeColor="#3b82f6" maskColor="rgba(0, 0, 0, 0.4)" />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>

      <div className="w-full lg:w-80 overflow-y-auto space-y-4 shrink-0">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Node Details</CardTitle>
            <CardDescription>Click any node to view its dependencies.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {selectedNode ? (
              <>
                <div>
                  <span className="text-muted-foreground">Path:</span>
                  <p className="font-mono text-xs bg-muted p-2 rounded mt-1 break-all">{selectedNode.fullPath}</p>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">{selectedNode.nodeType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Imports:</span>
                  <span className="font-medium">{selectedNode.imports}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Dependents:</span>
                  <span className="font-medium">{selectedNode.dependents}</span>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Select a node in the graph to view details here.
              </div>
            )}
          </CardContent>
        </Card>

        {initialData.circulars?.length > 0 && (
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Circular Dependencies</CardTitle>
              <CardDescription>Detected by static analysis.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                {initialData.circulars.map((circ: string, i: number) => (
                  <div key={i} className="p-2 bg-destructive/10 text-destructive rounded font-mono">
                    {circ}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
