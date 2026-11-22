import { describe, expect, it } from "vitest";
import { KnowledgeBase } from "../src/knowledge-base.js";
import { chunkDocument } from "../src/chunker.js";

const document = {
  id: "policy-001",
  title: "AI Use Policy",
  uri: "https://knowledge.example.test/policies/ai-use",
  content: "Approved AI use requires human oversight and documented accountability.\n\nAgents must cite trusted sources and preserve audit evidence.",
  accessScopes: ["employees"]
};

describe("knowledge infrastructure", () => {
  it("chunks content while retaining provenance and access scopes", () => {
    const chunks = chunkDocument(document, { maxCharacters: 120, overlapCharacters: 20 });
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0]?.uri).toBe(document.uri);
    expect(chunks[0]?.accessScopes).toContain("employees");
  });

  it("retrieves relevant chunks with citations for authorized callers", async () => {
    const kb = new KnowledgeBase();
    kb.ingest(document);
    const results = await kb.retrieve({ query: "human oversight accountability", callerScopes: ["employees"] });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.citation.sourceId).toBe("policy-001");
    expect(results[0]?.citation.uri).toBe(document.uri);
  });

  it("excludes restricted chunks from unauthorized callers", async () => {
    const kb = new KnowledgeBase();
    kb.ingest(document);
    const results = await kb.retrieve({ query: "human oversight", callerScopes: ["guests"] });
    expect(results).toHaveLength(0);
  });

  it("returns no results for an empty query", async () => {
    const kb = new KnowledgeBase();
    kb.ingest(document);
    expect(await kb.retrieve({ query: "  ", callerScopes: ["employees"] })).toHaveLength(0);
  });
});
