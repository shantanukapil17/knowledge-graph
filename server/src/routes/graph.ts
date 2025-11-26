import { Router } from "express";
import { pool } from "../db/client";

const router = Router();

router.get("/full", async (_req, res) => {
  const nodesResult = await pool.query("SELECT id, type, label FROM nodes");
  const edgesResult = await pool.query(
    "SELECT id, source, target, relation FROM edges"
  );

  res.json({
    nodes: nodesResult.rows,
    edges: edgesResult.rows,
  });
});

export default router;
