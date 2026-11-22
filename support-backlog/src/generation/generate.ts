import type {
  BacklogDraft,
  Classification,
  OpenApiOperationContext,
  SafeSupportCase
} from "../domain/types.js";

function titleFor(category: Classification["category"], subject: string): string {
  const prefix = category === "defect" ? "Bug" :
    category === "feature-request" ? "Feature request" :
    category === "incident" ? "Incident" :
    category === "access-issue" ? "Access issue" :
    category === "documentation-gap" ? "Documentation" : "Support follow-up";
  return `${prefix}: ${subject.trim().slice(0, 100)}`;
}

export function generateBacklogDraft(
  input: SafeSupportCase,
  classification: Classification,
  operation?: OpenApiOperationContext
): BacklogDraft {
  const kind: BacklogDraft["kind"] =
    classification.category === "defect" || classification.category === "incident"
      ? "bug"
      : classification.category === "feature-request"
        ? "user-story"
        : "support-task";

  const story = kind === "user-story"
    ? `As a customer using ${input.productArea ?? "the product"}, I want the requested capability, so that the reported need is addressed.`
    : undefined;

  const acceptanceCriteria = kind === "user-story"
    ? [{
        id: "AC-1",
        given: "the customer need described in the source support case is confirmed",
        when: "the proposed capability is implemented",
        then: "the capability satisfies the approved requirements and is covered by an automated test"
      }]
    : kind === "bug"
      ? [{
          id: "AC-1",
          given: "the reported conditions can be reproduced",
          when: "the corrected behavior is exercised",
          then: "the observed failure is resolved without regressing the documented expected behavior"
        }]
      : [];

  return {
    kind,
    title: titleFor(classification.category, input.subject),
    problemStatement: input.description,
    ...(story ? { userStory: story } : {}),
    customerImpact: "Impact requires confirmation by support or product ownership.",
    acceptanceCriteria,
    assumptions: ["Generated content is a draft and has not been independently verified."],
    unresolvedQuestions: [
      "What is the expected behavior?",
      "How many customers or users are affected?",
      "Can the behavior be reproduced in a non-production environment?"
    ],
    sourceReferences: [input.sourceReference],
    classification,
    ...(operation ? { openApiContext: operation } : {}),
    status: "draft"
  };
}
