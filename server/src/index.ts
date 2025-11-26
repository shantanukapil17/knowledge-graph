import express from "express";
import cors from "cors";
import ingestRouter from "./routes/ingest";
import graphRouter from "./routes/graph";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
  })
);

app.use(express.json());

app.use("/ingest", ingestRouter);
app.use("/graph", graphRouter);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
