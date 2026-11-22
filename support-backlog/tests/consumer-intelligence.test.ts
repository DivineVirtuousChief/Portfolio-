import { describe, expect, it } from "vitest";
import {
  applyRcaValidation,
  createRcaAssessment,
  generateConsumerBacklogDraft,
  type ConsumerCaseIntelligence,
  type EvidenceReference
} from "../src/consumer-intelligence/index.js";

const evidence: EvidenceReference[] = [{
  id: "ev-transcript-1",
  kind: "original-transcript",
  sourceReference: "support://case-104/transcript",
  capturedAt: "2026-11-22T10:00:00Z",
  language: "es",
  accessScope: "consumer-case:read"
}, {
  id: "ev-log-1",
  kind: "system-log",
  sourceReference: "observability://billing/request-778",
  capturedAt: "2026-11-22T10:02:00Z",
  accessScope: "billing-telemetry:read"
}];

const consumerCase: ConsumerCaseIntelligence = {
  caseId: "CI-000104",
  tenantId: "tenant-a",
  sourceCaseReference: "support://case-104",
  receivedAt: "2026-11-22T10:00:00Z",
  callerConfirmedLanguage: "es",
  statements: [{
    id: "statement-1",
    text: "No puedo descargar mi factura. La aplicación muestra un error.",
    language: "es",
    evidenceId: "ev-transcript-1"
  }],
  evidence,
  inferences: [{
    id: "inference-1",
    statement: "Session refresh may be failing.",
    rationale: "A correlated log indicates an expired session.",
    confidence: 0.55,
    supportingEvidenceIds: ["ev-log-1"],
    status: "unverified"
  }],
  unresolvedQuestions: ["Can the failure be reproduced with a refreshed session?"]
};

function assessment() {
  return createRcaAssessment({
    id: "RCA-CI-000104",
    tenantId: "tenant-a",
    sourceCaseId: "CI-000104",
    problemStatement: "Consumers report invoice download failures.",
    createdAt: "2026-11-22T10:10:00Z",
    evidence,
    whySteps: [{
      sequence: 1,
      question: "Why did the download fail?",
      answer: "A session-expiration condition may have interrupted the request.",
      evidenceIds: ["ev-log-1"],
      status: "unverified"
    }],
    fishboneFactors: [{
      category: "technology",
      factor: "Session refresh handling",
      evidenceIds: ["ev-log-1"],
      status: "candidate"
    }],
    hypotheses: [{
      id: "H-1",
      statement: "Session refresh handling may cause invoice download failures.",
      rationale: "The available log is consistent with an expired session.",
      supportingEvidenceIds: ["ev-log-1"],
      contradictingEvidenceIds: [],
      status: "proposed"
    }]
  });
}

describe("consumer intelligence and RCA", () => {
  it("creates an RCA as pending rather than asserting a root cause", () => {
    expect(assessment().validationStatus).toBe("pending");
  });

  it("rejects evidence references not present in the case evidence register", () => {
    expect(() => createRcaAssessment({
      ...assessment(),
      id: "RCA-invalid",
      evidence: [],
      hypotheses: [{
        id: "H-bad",
        statement: "Unsupported cause",
        rationale: "No evidence",
        supportingEvidenceIds: ["missing"],
        contradictingEvidenceIds: [],
        status: "proposed"
      }]
    })).toThrow("Unknown evidence reference");
  });

  it("requires reviewer, rationale, timestamp, and evidence for validation", () => {
    expect(() => applyRcaValidation(assessment(), {
      hypothesisId: "H-1",
      reviewerId: "",
      reviewedAt: "2026-11-22T10:30:00Z",
      decision: "validate",
      evidenceIds: ["ev-log-1"],
      rationale: "Reviewed"
    })).toThrow("Reviewer identity is required.");
    expect(() => applyRcaValidation(assessment(), {
      hypothesisId: "H-1",
      reviewerId: "reviewer-1",
      reviewedAt: "2026-11-22T10:30:00Z",
      decision: "validate",
      evidenceIds: [],
      rationale: "Reviewed"
    })).toThrow("Evidence is required");
  });

  it("preserves pending RCA status in the generated backlog draft", () => {
    const rca = assessment();
    const draft = generateConsumerBacklogDraft(consumerCase, rca, "H-1", [{
      id: "AC-1",
      given: "A consumer has a valid invoice and authenticated access",
      when: "The consumer requests the invoice download",
      then: "The application returns the invoice or a safe actionable error"
    }]);
    expect(draft.status).toBe("draft");
    expect(draft.sourceCaseId).toBe("CI-000104");
    expect(draft.sourceReferences).toContain("support://case-104");
    expect(draft.evidenceIds).toContain("ev-log-1");
    expect(draft.rcaValidationStatus).toBe("pending");
    expect(draft.title).toContain("Investigate");
  });

  it("blocks cross-tenant case-to-RCA linking", () => {
    const rca = { ...assessment(), tenantId: "tenant-b" };
    expect(() => generateConsumerBacklogDraft(consumerCase, rca, "H-1", [{
      id: "AC-1", given: "G", when: "W", then: "T"
    }])).toThrow("scope mismatch");
  });

  it("records validation only as a reviewer decision with supporting evidence", () => {
    const reviewed = applyRcaValidation(assessment(), {
      hypothesisId: "H-1",
      reviewerId: "reviewer-1",
      reviewedAt: "2026-11-22T10:30:00Z",
      decision: "validate",
      evidenceIds: ["ev-log-1"],
      rationale: "Log evidence was reviewed and reproduced in a controlled test."
    });
    expect(reviewed.validationStatus).toBe("validated");
    expect(reviewed.hypotheses[0]?.validatedBy).toBe("reviewer-1");
  });
});
