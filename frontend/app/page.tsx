"use client";

import { useEffect, useState, useMemo } from "react";
import GraphView from "../components/GraphView";

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

type GraphResponse = {
  nodes: Node[];
  edges: Edge[];
};

export default function Home() {
  const [data, setData] = useState<GraphResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaperId, setSelectedPaperId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:3000/graph/full");
        if (!res.ok) throw new Error("Failed to fetch graph");
        const json = (await res.json()) as GraphResponse;
        setData(json);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const paperNodes = useMemo(
    () => data?.nodes.filter((n) => n.type === "paper") ?? [],
    [data]
  );

  const selectedPaper = useMemo(
    () => paperNodes.find((p) => p.id === selectedPaperId) ?? null,
    [paperNodes, selectedPaperId]
  );

  return (
    <main className="app-root">
      <div className="sidebar">
        <h1>Gaussian Splatting Graph</h1>

        {loading && <p>Loading graph…</p>}
        {error && <p className="error">Error: {error}</p>}

        {!loading && !error && (
          <>
            <h2>Papers ({paperNodes.length})</h2>

            <ul className="paper-list">
              {paperNodes.map((p) => (
                <li
                  key={p.id}
                  className={
                    selectedPaperId === p.id
                      ? "paper-item selected"
                      : "paper-item"
                  }
                  onClick={() => setSelectedPaperId(p.id)}
                >
                  {p.label}
                </li>
              ))}
            </ul>

            {selectedPaper && (
              <div className="paper-details">
                <h3>Selected Paper</h3>
                <p>{selectedPaper.label}</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="graph-panel">
        {data && (
          <GraphView
            nodes={data.nodes}
            edges={data.edges}
            highlightPaperId={selectedPaperId}
            onNodeClick={(id) => setSelectedPaperId(id)}
          />
        )}
      </div>
    </main>
  );
}
