## 1. Prerequisites

# Install:

- Node.js 
- npm
- Python 3
- PostgreSQL running locally
- OpenAI API key

# 2. PostgreSQL Setup

# Open Postgres:
```sh
psql -d postgres
```
```sh
CREATE DATABASE graph;
```
```sh
\c graph;
```

# Create tables:

```sh
CREATE TABLE nodes (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  label TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE edges (
  id SERIAL PRIMARY KEY,
  source INTEGER REFERENCES nodes(id),
  target INTEGER REFERENCES nodes(id),
  relation TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

# 4. Backend Setup (server)
# 4.1 Install Node deps

```sh
cd server
npm install
```

# 4.2 Install Python deps
```sh
pip3 install pymupdf
```

# 4.3 Environment variables

Create server/.env:
```sh
DATABASE_URL=postgres://YOUR_USERNAME@localhost:5432/graph
OPENAI_API_KEY=your_openai_api_key_here
```

# 4.4 Run the backend
```sh
cd server
npm run dev
```

Backend runs on:
http://localhost:3000

# 5. Add Papers & Ingest

Place PDFs in:
knowledge-graph/papers/
papers/3d_gaussian_splatting_original.pdf

```sh
curl -X POST http://localhost:3000/ingest \
  -H "Content-Type: application/json" \
  -d '{"filePath": "papers/3d_gaussian_splatting_original.pdf"}'
```

# 6. Frontend Setup:
# 6.1 Install deps

```sh
cd frontend
npm install
```

# 6.2 Run frontend
```sh
npm run dev
```

Frontend runs on: http://localhost:3001

7. Quick Verify

Backend: open http://localhost:3000/graph/full → see JSON with nodes and edges

Frontend: open http://localhost:3001 → see interactive graph of papers + concepts

