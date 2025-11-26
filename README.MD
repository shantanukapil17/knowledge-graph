## 1. Prerequisites

Install:

- Node.js (>= 18)
- npm
- Python 3 (>= 3.8)
- PostgreSQL running locally
- OpenAI API key

2. PostgreSQL Setup

Open Postgres:
```psql -d postgres```

```CREATE DATABASE graph;```
```\c graph;```

Create tables:


4. Backend Setup (server)
4.1 Install Node deps

cd server
npm install

4.2 Install Python deps
pip3 install pymupdf

4.3 Environment variables

Create server/.env:
DATABASE_URL=postgres://YOUR_USERNAME@localhost:5432/graph
OPENAI_API_KEY=your_openai_api_key_here

4.4 Run the backend
cd server
npm run dev

Backend runs on:
http://localhost:3000

5. Add Papers & Ingest

Place PDFs in:
knowledge-graph/papers/
papers/3d_gaussian_splatting_original.pdf

curl -X POST http://localhost:3000/ingest \
  -H "Content-Type: application/json" \
  -d '{"filePath": "papers/3d_gaussian_splatting_original.pdf"}'

6. Frontend Setup (frontend)
6.1 Install deps

cd frontend
npm install

6.2 Run frontend
npm run dev

Frontend runs on (usually):
http://localhost:3001

7. Quick Verify

Backend: open http://localhost:3000/graph/full → see JSON with nodes and edges

Frontend: open http://localhost:3001 → see interactive graph of papers + concepts

That’s it — this is all you need to set up and run the project.