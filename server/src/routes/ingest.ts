import { Router } from "express";
import { execSync } from "child_process";
import { processPaper } from "../agents/orchestrator";

const router = Router();

router.post("/", async (req, res) => {

  try {
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({ error: "filePath is required" });
    }

    const text = execSync(`python3 src/extractors/pdfParser.py "${filePath}"`).toString();

    const paperNode = await processPaper(text);

    return res.json({ status: "ok", paperNode });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Ingestion failed" });
  }
});

export default router;
