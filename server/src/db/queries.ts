import { pool } from "./client";

export interface NodeRow {
  id: number;
  type: string;
  label: string;
  metadata: any;
  created_at: string;
}

export interface EdgeRow {
  id: number;
  source: number;
  target: number;
  relation: string;
  metadata: any;
  created_at: string;
}


export async function dbInsertNode(
  type: string,
  label: string,
  metadata: any
): Promise<NodeRow> {
  const result = await pool.query<NodeRow>(
    `
    INSERT INTO nodes (type, label, metadata)
    VALUES ($1, $2, $3)
    RETURNING id, type, label, metadata, created_at
    `,
    [type, label, metadata]
  );

  return result.rows[0];
}


export async function dbInsertEdge(
  sourceId: number,
  targetId: number,
  relation: string,
  metadata: any
): Promise<EdgeRow> {
  const result = await pool.query<EdgeRow>(
    `
    INSERT INTO edges (source, target, relation, metadata)
    VALUES ($1, $2, $3, $4)
    RETURNING id, source, target, relation, metadata, created_at
    `,
    [sourceId, targetId, relation, metadata]
  );

  return result.rows[0];
}


export async function getFullGraph() {
  const nodesResult = await pool.query<NodeRow>(
    `SELECT id, type, label, metadata, created_at FROM nodes`
  );
  const edgesResult = await pool.query<EdgeRow>(
    `SELECT id, source, target, relation, metadata, created_at FROM edges`
  );

  return {
    nodes: nodesResult.rows,
    edges: edgesResult.rows,
  };
}
