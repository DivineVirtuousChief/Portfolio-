export type SupportCategory =
  | "question"
  | "incident"
  | "defect"
  | "feature-request"
  | "access-issue"
  | "documentation-gap"
  | "needs-triage";

export interface SupportCase {
  id: string;
  tenantId: string;
  source: "email" | "chat" | "web-form" | "phone-summary" | "api";
  sourceReference: string;
  submittedAt: string;
  productArea?: string;
  subject: string;
  description: string;
}

export interface SafeSupportCase extends Omit<SupportCase, "subject" | "description"> {
  subject: string;
  description: string;
  redactions: number;
}

export interface Classification {
  category: SupportCategory;
  confidence: number;
  rationale: string[];
  requiresHumanTriage: boolean;
}

export interface OpenApiOperationContext {
  operationId: string;
  method: string;
  path: string;
  summary?: string;
  responseCodes?: string[];
}

export interface AcceptanceCriterion {
  id: string;
  given: string;
  when: string;
  then: string;
}

export interface BacklogDraft {
  kind: "bug" | "user-story" | "support-task";
  title: string;
  problemStatement: string;
  userStory?: string;
  customerImpact: string;
  acceptanceCriteria: AcceptanceCriterion[];
  assumptions: string[];
  unresolvedQuestions: string[];
  sourceReferences: string[];
  classification: Classification;
  openApiContext?: OpenApiOperationContext;
  status: "draft";
}

export interface ApprovalContext {
  approverId: string;
  tenantId: string;
  scopes: string[];
  approvedAt: string;
}

export interface TrackerPublication {
  provider: "github" | "jira";
  externalId: string;
  url: string;
  publishedAt: string;
}

export interface IssueTrackerAdapter {
  readonly provider: "github" | "jira";
  createIssue(draft: BacklogDraft, approval: ApprovalContext): Promise<TrackerPublication>;
}
