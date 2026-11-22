import type { ApprovalContext, BacklogDraft } from "../domain/types.js";

export function assertPublicationAuthorized(
  draft: BacklogDraft,
  approval: ApprovalContext | undefined,
  expectedTenantId: string
): asserts approval is ApprovalContext {
  if (draft.status !== "draft") throw new Error("Only reviewed drafts may be published.");
  if (!approval) throw new Error("Human approval is required before tracker publication.");
  if (!approval.approverId.trim()) throw new Error("Approver identity is required.");
  if (approval.tenantId !== expectedTenantId) throw new Error("Approval tenant mismatch.");
  if (!approval.scopes.includes("backlog:publish")) throw new Error("Missing backlog:publish scope.");
  if (!Number.isFinite(Date.parse(approval.approvedAt))) throw new Error("A valid approval timestamp is required.");
}
