---
on:
  workflow_dispatch:
permissions:
  contents: read
  actions: read
  pull-requests: read
engine: copilot
features:
  group-concurrency-queue: false
max-ai-credits: 10
safe-outputs:
  report-failure-as-issue: false
  report-failed-jobs: false
  threat-detection: false
---

# Requirements Review

Review the pull request revision that produced the successful CI run.

Before issuing a verdict:
- resolve exactly one pull request associated with the triggering CI run
- bind the review subject to repository + pull request number + the full CI head SHA
- re-fetch the pull request and require that it is still open and its current full head SHA equals the CI head SHA; otherwise return STALE
- inspect the pull request request/body and the exact base-to-head diff
- inspect applicable repository requirements and instructions, including PRODUCT.md, DESIGN.md, QA.md, and AGENTS.md when present
- confirm the successful CI run belongs to the same full head SHA
- never treat CI success alone as requirements conformance

Compare the requested change and applicable natural-language requirements with the exact implementation revision.

Verdict must be exactly one of:
PASS / NG / STALE / EQUIPMENT STOP / UNKNOWN

For NG, identify every material mismatch and the source requirement or constraint it conflicts with.
If required evidence is missing or unverifiable, do not round it to PASS.

Return one machine-readable JSON object compatible with `sousei.line-evidence/v1` and `docs/REVIEW_EVIDENCE.md`. Bind it to the exact repository, PR number, and full head SHA; use stage `semantic`; include findings and executor/engine/model when available.

This result is review evidence only. Do not merge, deploy, publish, approve, modify repository state, or make the human ADOPT/REJECT decision.
