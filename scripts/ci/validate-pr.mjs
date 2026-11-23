const body = process.env.PR_BODY ?? "";
const requiredSections = [
  "## Summary",
  "## Scope",
  "## Validation",
  "## Evidence and provenance",
  "## Risk and limitations",
  "## Governance",
];
const missing = requiredSections.filter(section =>
  !body.toLowerCase().includes(section.toLowerCase())
);
if (missing.length > 0) {
  console.error("Pull request description is missing required sections:");
  for (const section of missing) console.error("- " + section);
  process.exit(1);
}
console.log("Pull request description contains all required governance sections.");
