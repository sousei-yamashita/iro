---
on:
  workflow_dispatch:
  roles: [admin, maintainer, write]
permissions: read-all
engine: copilot
max-ai-credits: 10
safe-outputs:
  report-failure-as-issue: false
  report-failed-jobs: false
  threat-detection: false
---

# Sousei requirements-conformance review — cost measurement

This workflow is a one-run equipment and cost measurement only. It does not replace the current Sousei Line, does not make a human adoption decision, and must not merge, deploy, publish, or modify repository state.

Evaluate the current open pull request created specifically for this cost measurement in `sousei-yamashita/iro`.

Before issuing any verdict:
- identify exactly one open cost-measurement pull request whose head branch is `line/review-executor-cost-test`
- re-fetch its current full head SHA
- require that the pull request is open and the reviewed revision is still its current head
- inspect the pull request body and exact base-to-head diff
- inspect applicable repository requirements and instructions, including PRODUCT.md, DESIGN.md, QA.md, AGENTS.md when present
- inspect the CI result for that exact head SHA
- never treat CI success alone as semantic conformance

Perform a requirements-conformance review: compare the requested change and applicable natural-language requirements with the exact implementation revision.

Verdict must be exactly one of:
PASS / NG / STALE / EQUIPMENT STOP / UNKNOWN

For NG, identify each material mismatch and the source requirement or constraint it conflicts with.
If required evidence is missing or unverifiable, do not round it to PASS.

Return one machine-readable JSON object compatible with `sousei.line-evidence/v1` and the repository's `docs/REVIEW_EVIDENCE.md` contract. It must bind the exact repository, PR number, and full head SHA, use stage `semantic`, include findings, and record the executor/engine/model when available.

Do not create comments, reviews, issues, commits, branches, labels, deployments, releases, or any other GitHub write. The result is measurement evidence only.
