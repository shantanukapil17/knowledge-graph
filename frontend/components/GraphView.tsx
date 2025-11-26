"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef } from "react";

const ForceGraph2D = dynamic(
  () => import("react-force-graph-2d"),
  { ssr: false }
);

type Node = {
  id: number;
  type: string;
  label: string;
};

type Edge = {
  id: number;
  source: number;
  target: number;
  relation: string;
};

type Props = {
  nodes: Node[];
  edges: Edge[];
  highlightPaperId: number | null;
  onNodeClick?: (id: number) => void;
};

export default function GraphView({
  nodes,
  edges,
  highlightPaperId,
  onNodeClick,
}: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fgRef = useRef<any>(null);

  const graphData = useMemo(
    () => ({
      nodes: nodes.map((n) => ({
        id: n.id,
        name: n.label,
        type: n.type,
      })),
      links: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        relation: e.relation,
      })),
    }),
    [nodes, edges]
  );

  useEffect(() => {
    if (!fgRef.current) return;
    if (!graphData.nodes.length) return;
    const id = setTimeout(() => {
      fgRef.current.zoomToFit(400, 80); 
    }, 400);
    return () => clearTimeout(id);
  }, [graphData]);

  const colorForType = (type: string) => {
    switch (type) {
      case "paper":
        return "#3b82f6"; 
      case "concept":
        return "#10b981"; 
      case "method":
        return "#a855f7"; 
      case "dataset":
        return "#22c55e"; 
      default:
        return "#e5e7eb";
    }
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeRelSize={6}             
        linkWidth={1}              
        linkColor={() => "rgba(148, 163, 184, 0.5)"} 
        linkDirectionalArrowLength={3}
        linkDirectionalArrowRelPos={0.9}
        cooldownTicks={80}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        nodeLabel={(node: any) => `${node.type}: ${node.name}`}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        linkLabel={(link: any) => link.relation}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.name as string;
          const isPaper = node.type === "paper";
          const isHighlighted = highlightPaperId === node.id;

          const baseRadius = isPaper ? 8 : 5;
          const radius = isHighlighted ? baseRadius + 2 : baseRadius;

          const fill = colorForType(node.type);
          const borderColor = isHighlighted ? "#f97316" : "#020617";

          ctx.beginPath();
          ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = fill;
          ctx.fill();
          ctx.lineWidth = isHighlighted ? 2 : 1;
          ctx.strokeStyle = borderColor;
          ctx.stroke();

          const showLabel =
            isPaper || isHighlighted || globalScale > 2.5;

          if (!showLabel) return;

          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px system-ui, -apple-system, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillStyle = "#e5e7eb";
          ctx.fillText(label, node.x!, node.y! + radius + 2);
        }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onNodeClick={(node: any) => onNodeClick?.(node.id)}
      />
    </div>
  );
}
