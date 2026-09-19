# Sousei-line — change identity foundation

This repository is the first live specimen for the Sousei-line identity model.

## Principle

A pull request number is not a change identity. The primary identity of an inspected
change is the **full Git commit SHA of the PR head**.

Every downstream decision or certificate MUST name the exact full SHA it inspected.
A later PR update creates a different inspection subject and invalidates earlier
results for the purpose of adopting the new head.

## Minimum chain

1. **PR candidate** — `repository + pr_number + full head_sha`
2. **CI evidence** — workflow/run/attempt/conclusion tied to that same `head_sha`
3. **Semantic inspection** — verdict tied to the same `head_sha`
4. **Independent check** — verdict tied to the same `head_sha`
5. **Human adoption** — explicit ADOPT/REJECT for that same `head_sha`
6. **Merged revision** — record `merge_commit_sha`; do not assume it equals `head_sha`
7. **Deployment** — record the revision actually deployed and deployment/run identity
8. **Production verification** — verify the deployed production revision; do not infer
   it merely from a successful merge or deploy job

## Certificate envelope

Machine-readable evidence should use this common envelope where applicable:

```json
{
  "schema": "sousei.line-evidence/v1",
  "repository": "owner/repository",
  "pr_number": 0,
  "subject_head_sha": "40-character full SHA",
  "stage": "ci | semantic | independent | adoption | deploy | production",
  "verdict": "PASS | NG | ADOPT | REJECT | SUCCESS | FAILURE",
  "evidence": {},
  "issued_at": "RFC3339 timestamp"
}
```

Stage-specific evidence belongs in `evidence`; the subject identity fields remain
stable across the pre-merge inspection chain.

## Merge boundary

The merge boundary is an explicit identity transition:

`adopted PR head_sha -> merge_commit_sha -> deployed revision -> production revision`

These values may be related, but they MUST NOT be treated as equal without evidence.

## Current experiment

The next PR in this repository is used to prove the first segment:

`PR head_sha -> CI run bound to the exact head_sha`

Later changes will extend the chain through adoption, deployment, and production
verification without changing the product behavior of 色 v1.
