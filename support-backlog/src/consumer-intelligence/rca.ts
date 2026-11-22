import type { RcaAssessment, RcaHypothesis, RcaValidationDecision } from "./types.js";

export function createRcaAssessment(input: Omit<RcaAssessment, "validationStatus">): RcaAssessment {
  const evidenceIds = new Set(input.evidence.map((item) => item.id));
  for (const hypothesis of input.hypotheses) {
    for (const id of [...hypothesis.supportingEvidenceIds, ...hypothesis.contradictingEvidenceIds]) {
      if (!evidenceIds.has(id)) throw new Error(`Unknown evidence reference: ${id}`);
    }
  }
  return { ...input, validationStatus: "pending" };
}

/**
 * Applies a review decision to a hypothesis. This is a domain guard only:
 * reviewer identity and permissions must be authenticated by the calling service.
 */
export function applyRcaValidation(
  assessment: RcaAssessment,
  decision: RcaValidationDecision
): RcaAssessment {
  if (!decision.reviewerId.trim()) throw new Error("Reviewer identity is required.");
  if (!decision.rationale.trim()) throw new Error("Review rationale is required.");
  if (!Number.isFinite(Date.parse(decision.reviewedAt))) throw new Error("Review timestamp is invalid.");

  const hypothesis = assessment.hypotheses.find((item) => item.id === decision.hypothesisId);
  if (!hypothesis) throw new Error("RCA hypothesis not found.");

  const evidenceIds = new Set(assessment.evidence.map((item) => item.id));
  if (decision.evidenceIds.length === 0) throw new Error("Evidence is required for an RCA decision.");
  if (decision.evidenceIds.some((id) => !evidenceIds.has(id))) {
    throw new Error("RCA decision references unknown evidence.");
  }

  const updated: RcaHypothesis = {
    ...hypothesis,
    status: decision.decision === "validate" ? "validated" : "rejected",
    validatedBy: decision.reviewerId,
    validatedAt: decision.reviewedAt
  };
  const hypotheses = assessment.hypotheses.map((item) => item.id === updated.id ? updated : item);
  const active = hypotheses.filter((item) => item.status !== "rejected");
  const validationStatus = active.some((item) => item.status === "validated")
    ? active.every((item) => item.status === "validated") ? "validated" : "partially-supported"
    : hypotheses.every((item) => item.status === "rejected") ? "inconclusive" : "pending";

  return { ...assessment, hypotheses, validationStatus };
}
