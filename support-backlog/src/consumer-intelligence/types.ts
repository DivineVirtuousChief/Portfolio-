import type { AcceptanceCriterion, Classification } from "../domain/types.js";

export type EvidenceKind =
  | "original-transcript"
  | "machine-translation"
  | "system-log"
  | "telemetry"
  | "reproduction"
  | "consumer-document"
  | "human-observation";

export interface EvidenceReference {
  id: string;
  kind: EvidenceKind;
  sourceReference: string;
  capturedAt: string;
  language?: string;
  translationOfEvidenceId?: string;
  integrityDigest?: string;
  accessScope: string;
}

export interface ConsumerStatement {
  id: string;
  text: string;
  language: string;
  evidenceId: string;
}

export interface IntelligenceInference {
  id: string;
  statement: string;
  rationale: string;
  confidence?: number;
  supportingEvidenceIds: string[];
  status: "unverified" | "reviewed" | "rejected";
}

export interface ConsumerCaseIntelligence {
  caseId: string;
  tenantId: string;
  sourceCaseReference: string;
  receivedAt: string;
  callerConfirmedLanguage?: string;
  statements: ConsumerStatement[];
  evidence: EvidenceReference[];
  inferences: IntelligenceInference[];
  classification?: Classification;
  unresolvedQuestions: string[];
}

export interface WhyStep {
  sequence: number;
  question: string;
  answer: string;
  evidenceIds: string[];
  status: "unverified" | "supported" | "rejected";
}

export interface FishboneFactor {
  category: "people" | "process" | "technology" | "data" | "environment" | "policy" | "measurement";
  factor: string;
  evidenceIds: string[];
  status: "candidate" | "supported" | "rejected";
}

export interface RcaHypothesis {
  id: string;
  statement: string;
  rationale: string;
  supportingEvidenceIds: string[];
  contradictingEvidenceIds: string[];
  status: "proposed" | "under-investigation" | "validated" | "rejected";
  validatedBy?: string;
  validatedAt?: string;
}

export interface RcaAssessment {
  id: string;
  tenantId: string;
  sourceCaseId: string;
  problemStatement: string;
  whySteps: WhyStep[];
  fishboneFactors: FishboneFactor[];
  hypotheses: RcaHypothesis[];
  evidence: EvidenceReference[];
  validationStatus: "pending" | "partially-supported" | "validated" | "inconclusive";
  createdAt: string;
}

export interface RcaValidationDecision {
  hypothesisId: string;
  reviewerId: string;
  reviewedAt: string;
  decision: "validate" | "reject";
  evidenceIds: string[];
  rationale: string;
}

export interface CorrectiveAction {
  id: string;
  tenantId: string;
  rcaId: string;
  description: string;
  actionType: "corrective" | "preventive";
  ownerRole: string;
  dueAt?: string;
  status: "proposed" | "approved" | "in-progress" | "completed" | "effectiveness-verified";
  completionEvidenceIds: string[];
}

export interface ConsumerBacklogDraft {
  sourceCaseId: string;
  rcaId: string;
  hypothesisId: string;
  title: string;
  problemStatement: string;
  userStory: string;
  acceptanceCriteria: AcceptanceCriterion[];
  sourceReferences: string[];
  evidenceIds: string[];
  rcaValidationStatus: "pending" | "partially-supported" | "validated" | "inconclusive";
  status: "draft";
}
