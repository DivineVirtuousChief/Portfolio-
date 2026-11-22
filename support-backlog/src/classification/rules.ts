import type { Classification, SafeSupportCase } from "../domain/types.js";

const rules: Array<{ category: Classification["category"]; terms: string[]; rationale: string }> = [
  { category: "access-issue", terms: ["cannot log in", "login failed", "permission", "access denied", "locked out"], rationale: "Access or authentication language detected." },
  { category: "incident", terms: ["outage", "unavailable", "service down", "production down", "all users"], rationale: "Service disruption language detected." },
  { category: "defect", terms: ["error", "exception", "crash", "not working", "incorrect result", "bug"], rationale: "Failure or unexpected behavior language detected." },
  { category: "feature-request", terms: ["would like", "please add", "new feature", "enhancement", "could you support"], rationale: "Request for new or expanded capability detected." },
  { category: "documentation-gap", terms: ["documentation", "how do i", "instructions", "unclear steps"], rationale: "Documentation or usage guidance language detected." }
];

export function classifySupportCase(input: SafeSupportCase): Classification {
  const text = `${input.subject} ${input.description}`.toLowerCase();
  const matches = rules.filter(rule => rule.terms.some(term => text.includes(term)));

  if (matches.length === 0) {
    return {
      category: "needs-triage",
      confidence: 0.35,
      rationale: ["No deterministic classification rule matched."],
      requiresHumanTriage: true
    };
  }

  const selected = matches[0];
  const ambiguous = matches.length > 1;
  return {
    category: selected.category,
    confidence: ambiguous ? 0.6 : 0.8,
    rationale: [selected.rationale, ...(ambiguous ? ["Multiple categories matched; human review is required."] : [])],
    requiresHumanTriage: ambiguous || selected.category === "incident"
  };
}
