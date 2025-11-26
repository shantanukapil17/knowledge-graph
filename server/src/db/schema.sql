CREATE TABLE nodes (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    label TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE edges (
    id SERIAL PRIMARY KEY,
    source INT REFERENCES nodes(id),
    target INT REFERENCES nodes(id),
    relation TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for graph performance
CREATE INDEX idx_nodes_type ON nodes(type);
CREATE INDEX idx_edges_relation ON edges(relation);
CREATE INDEX idx_edges_source ON edges(source);
CREATE INDEX idx_edges_target ON edges(target);
