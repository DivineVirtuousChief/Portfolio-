import type { AcceptanceCriterion } from "../domain/types.js";
import type { ConsumerBacklogDraft, ConsumerCaseIntelligence, RcaAssessment } from "./types.js";

export function generateConsumerBacklogDraft(
  consumerCase: ConsumerCaseIntelligence,
  rca: RcaAssessment,
  hypothesisId: string,
  criteria: AcceptanceCriterion[]
): ConsumerBacklogDraft {
  if (consumerCase.tenantId !== rca.tenantId || consumerCase.caseId !== rca.sourceCaseId) {
    throw new Error("Consumer case and RCA scope mismatch.");
  }
  const hypothesis = rca.hypotheses.find((item) => item.id === hypothesisId);
  if (!hypothesis) throw new Error("RCA hypothesis not found.");

  const evidenceIds = new Set(consumerCase.evidence.map((item) => item.id));
  if (rca.evidence.some((item) => !evidenceIds.has(item.id))) {
    throw new Error("RCA evidence must be traceable to the source consumer case.");
  }
  if (criteria.length === 0 || criteria.some((item) => !item.given.trim() || !item.when.trim() || !item.then.trim())) {
    throw new Error("Complete Given/When/Then acceptance criteria are required.");
  }

  return {
    sourceCaseId: consumerCase.caseId,
    rcaId: rca.id,
    hypothesisId,
    title: `Investigate: ${hypothesis.statement}`,
    problemStatement: rca.problemStatement,
    userStory: "As an affected consumer, I want the reported service problem resolved so that I can complete the intended task.",
    acceptanceCriteria: criteria,
    sourceReferences: [consumerCase.sourceCaseReference, ...consumerCase.evidence.map((item) => item.sourceReference)],
    evidenceIds: [...new Set([...hypothesis.supportingEvidenceIds, ...hypothesis.contradictingEvidenceIds])],
    rcaValidationStatus: rca.validationStatus,
    status: "draft"
  };
}
