/**
 * Authenticated, server-created authorization context for knowledge operations.
 *
 * SECURITY: Never construct this from model output or untrusted request-body claims.
 * Populate it only after validating the caller with the configured identity provider
 * and authorization policy service. Do not place bearer tokens or credentials here.
 */
export interface SecurityContext {
  /** Stable tenant boundary. Required for every tenant-scoped operation. */
  readonly tenantId: string;
  /** Authenticated subject/service identity within the identity provider. */
  readonly subjectId: string;
  /** Roles asserted by the trusted identity/policy boundary. */
  readonly roles: readonly string[];
  /** Effective authorization scopes after policy evaluation. */
  readonly scopes: readonly string[];
  /** Identity-provider or policy-decision version used to issue this context. */
  readonly authorizationVersion: string;
  /** Unique request correlation identifier for audit and traceability. */
  readonly requestId: string;
  /** Unix epoch milliseconds when this context was issued. */
  readonly issuedAt: number;
  /** Unix epoch milliseconds after which this context must be rejected. */
  readonly expiresAt: number;
  /** Authentication mechanism recorded by the trusted boundary. */
  readonly authenticationMethod: "oidc" | "saml" | "service" | "workload";
}

/**
 * Validate the structural and temporal invariants of a SecurityContext.
 * This does not authenticate a caller or verify claims; that remains the
 * responsibility of the identity provider and authorization policy service.
 * Invalid context must be rejected before any protected knowledge operation.
 */
export function assertValidSecurityContext(
  context: SecurityContext | null | undefined,
  now: number = Date.now()
): asserts context is SecurityContext {
  if (!context || typeof context !== "object") {
    throw new Error("SecurityContext is required");
  }

  const requiredStrings: Array<keyof SecurityContext> = [
    "tenantId",
    "subjectId",
    "authorizationVersion",
    "requestId"
  ];

  for (const key of requiredStrings) {
    const value = context[key];
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(`SecurityContext.${key} is required`);
    }
  }

  if (!Array.isArray(context.roles) || !context.roles.every((value) => typeof value === "string" && value.trim().length > 0)) {
    throw new Error("SecurityContext.roles must be an array of non-empty strings");
  }

  if (!Array.isArray(context.scopes) || !context.scopes.every((value) => typeof value === "string" && value.trim().length > 0)) {
    throw new Error("SecurityContext.scopes must be an array of non-empty strings");
  }

  if (!Number.isFinite(context.issuedAt) || !Number.isFinite(context.expiresAt)) {
    throw new Error("SecurityContext timestamps must be finite numbers");
  }

  if (context.expiresAt <= context.issuedAt || context.expiresAt <= now || context.issuedAt > now) {
    throw new Error("SecurityContext is expired or has invalid timestamps");
  }

  const methods: readonly string[] = ["oidc", "saml", "service", "workload"];
  if (!methods.includes(context.authenticationMethod)) {
    throw new Error("SecurityContext.authenticationMethod is invalid");
  }
}
