import { describe, expect, it } from "vitest";
import {
  assertPublicationAuthorized,
  classifySupportCase,
  generateBacklogDraft,
  redactSensitiveText,
  type SafeSupportCase
} from "../src/index.js";

const supportCase: SafeSupportCase = {
  id: "case-104",
  tenantId: "tenant-a",
  source: "web-form",
  sourceReference: "support://case-104",
  submittedAt: "2026-11-22T10:00:00Z",
  productArea: "billing portal",
  subject: "Billing page error",
  description: "The billing page is not working and returns an error.",
  redactions: 0
};

describe("support-to-backlog pipeline", () => {
  it("redacts common secrets and direct identifiers", () => {
    const result = redactSensitiveText(
      "Contact jane@example.com; token Bearer abc.def.ghi; password=hunter2; phone 555-123-4567"
    );
    expect(result.count).toBe(4);
    expect(result.value).not.toContain("jane@example.com");
    expect(result.value).not.toContain("abc.def.ghi");
    expect(result.value).not.toContain("hunter2");
    expect(result.value).not.toContain("555-123-4567");
  });

  it("classifies a defect and creates a traceable bug draft", () => {
    const classification = classifySupportCase(supportCase);
    expect(classification.category).toBe("defect");

    const draft = generateBacklogDraft(supportCase, classification, {
      operationId: "getBillingSummary",
      method: "GET",
      path: "/billing/summary",
      responseCodes: ["200", "500"]
    });

    expect(draft.kind).toBe("bug");
    expect(draft.sourceReferences).toContain("support://case-104");
    expect(draft.openApiContext?.operationId).toBe("getBillingSummary");
    expect(draft.status).toBe("draft");
  });

  it("generates a user story with testable acceptance criteria for feature requests", () => {
    const request = {
      ...supportCase,
      subject: "Add export feature",
      description: "Please add a CSV export option."
    };
    const classification = classifySupportCase(request);
    const draft = generateBacklogDraft(request, classification);

    expect(draft.kind).toBe("user-story");
    expect(draft.userStory).toContain("As a customer");
    expect(draft.acceptanceCriteria[0]?.given).toBeTruthy();
    expect(draft.acceptanceCriteria[0]?.when).toBeTruthy();
    expect(draft.acceptanceCriteria[0]?.then).toBeTruthy();
  });

  it("blocks publication without explicit authorized approval", () => {
    const classification = classifySupportCase(supportCase);
    const draft = generateBacklogDraft(supportCase, classification);

    expect(() => assertPublicationAuthorized(draft, undefined, "tenant-a"))
      .toThrow("Human approval is required");

    expect(() => assertPublicationAuthorized(draft, {
      approverId: "reviewer-1",
      tenantId: "tenant-b",
      scopes: ["backlog:publish"],
      approvedAt: "2026-11-22T10:05:00Z"
    }, "tenant-a")).toThrow("Approval tenant mismatch.");
  });

  it("accepts a valid same-tenant approval with publication scope", () => {
    const classification = classifySupportCase(supportCase);
    const draft = generateBacklogDraft(supportCase, classification);

    expect(() => assertPublicationAuthorized(draft, {
      approverId: "reviewer-1",
      tenantId: "tenant-a",
      scopes: ["backlog:publish"],
      approvedAt: "2026-11-22T10:05:00Z"
    }, "tenant-a")).not.toThrow();
  });
});
