export interface RedactionResult {
  value: string;
  count: number;
}

/**
 * Conservative pre-processing redaction for common secrets and direct identifiers.
 * This is a baseline safeguard, not a complete DLP or PHI detector.
 */
export function redactSensitiveText(input: string): RedactionResult {
  const patterns: RegExp[] = [
    /\bBearer\s+[A-Za-z0-9._~+\/-]+=*/gi,
    /\b(?:api[_-]?key|access[_-]?token|client[_-]?secret|password)\s*[:=]\s*[^\s,;]+/gi,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    /\b(?:\+?1[ .-]?)?\(?\d{3}\)?[ .-]\d{3}[ .-]\d{4}\b/g
  ];

  let value = input;
  let count = 0;
  for (const pattern of patterns) {
    value = value.replace(pattern, () => {
      count += 1;
      return "[REDACTED]";
    });
  }
  return { value, count };
}
