declare module 'dagre' {
  namespace graphlib {
    class Graph {
      constructor(options?: any);
      setGraph(label: any): Graph;
      graph(): any;
      setDefaultEdgeLabel(callback: any): Graph;
      setNode(name: string, label: any): Graph;
      setEdge(source: string, target: string, label?: any, name?: string): Graph;
      node(name: string): any;
      nodes(): string[];
      edges(): any[];
    }
  }
  function layout(graph: graphlib.Graph): void;
  export default {
    graphlib,
    layout,
  };
}
