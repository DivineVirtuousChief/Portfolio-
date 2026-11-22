import { describe, expect, it } from "vitest";
import { assertValidSecurityContext, type SecurityContext } from "../src/security-context.js";

const validContext: SecurityContext = {
  tenantId: "tenant-a",
  subjectId: "user-123",
  roles: ["reader"],
  scopes: ["knowledge:read"],
  authorizationVersion: "policy-v3",
  requestId: "req-001",
  issuedAt: 1_000,
  expiresAt: 10_000,
  authenticationMethod: "oidc"
};

describe("SecurityContext", () => {
  it("accepts a structurally valid, unexpired context", () => {
    expect(() => assertValidSecurityContext(validContext, 5_000)).not.toThrow();
  });

  it("fails closed when context is missing", () => {
    expect(() => assertValidSecurityContext(undefined, 5_000)).toThrow("SecurityContext is required");
  });

  it("rejects an expired context", () => {
    expect(() => assertValidSecurityContext(validContext, 10_000)).toThrow("expired");
  });

  it("rejects missing tenant identity", () => {
    expect(() => assertValidSecurityContext({ ...validContext, tenantId: " " }, 5_000)).toThrow("tenantId");
  });

  it("rejects malformed authorization scopes", () => {
    expect(() => assertValidSecurityContext({ ...validContext, scopes: [""] }, 5_000)).toThrow("scopes");
  });
});
