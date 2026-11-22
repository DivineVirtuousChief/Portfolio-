# BGLA Governed ChatOps
A provider-adaptable foundation for secure chat-driven operational visibility.

## Implemented
- Slack request-signature verification over the exact raw request body, with a five-minute replay window and constant-time comparison.
- Strict allowlist parser: `/bgla help`, `/bgla status`, and `/bgla issue <number>`.
- Separate fail-closed authorization requiring a trusted principal, server-side user allowlist, and scope.
- Synthetic tests using Node's built-in test runner.
- Optional GitHub Actions Slack incoming-webhook notification.

## Slack setup
Configure repository Actions secret `SLACK_WEBHOOK_URL` with a Slack incoming webhook URL. The CI notification safely skips if it is absent. Never commit webhook URLs, signing secrets, tokens, or personal data.

A future Slack app adapter must preserve the original raw request body, verify `X-Slack-Request-Timestamp` and `X-Slack-Signature`, resolve identity through trusted adapter logic, then parse and authorize. Signature verification authenticates request origin; it does not authorize a user.

## Command contract
| Command | Effect |
|---|---|
| `/bgla help` | Read-only help |
| `/bgla status` | Read-only status (adapter implementation pending) |
| `/bgla issue <number>` | Read-only issue lookup (GitHub adapter pending) |

No chat command can deploy, merge, change permissions, close issues, or override branch protection, required checks, review, or environment approvals.

## Governance
Chat content is untrusted input. Authentication, authorization, and business approval are distinct. Future write operations require least-privilege credentials, explicit human approval, idempotency, audit events, and independent policy checks. Never send PHI, credentials, or confidential incident details to chat.

## Local checks
```bash
cd chatops
npm run check
```
Node.js 20+ required.

## Delivery status
This is a tested starter library and CI notification workflow, not a deployed Slack bot or production ChatOps service. Hosting, Slack app registration, trusted identity integration, GitHub API adapter, and monitoring remain deployment work.