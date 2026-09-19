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
3. **Requirements Review** — semantic verdict tied to the same `head_sha`
4. **Independent Verification** — independent verdict tied to the same `head_sha`
5. **Human adoption** — explicit ADOPT/REJECT for that same `head_sha`
6. **Merged revision** — record `merge_commit_sha`; do not assume it equals `head_sha`
7. **Deployment** — record the deployment event/run and the revision reported by that event
8. **Production verification** — verify the production endpoint and record the expected
   deployed revision separately from what was actually proven about the served bytes

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

`adopted PR head_sha -> merge_commit_sha -> deployment-reported revision -> production response`

These values are related evidence, but MUST NOT be treated as equal without a mechanism
that proves the transition. In particular, a successful deployment event does not by
itself prove that subsequently fetched production bytes came from its reported SHA.

## Current production state

The production line currently has working paths for:

`PR -> CI -> Requirements Review -> Independent Verification -> Human ADOPT/REJECT -> Merge -> Deploy -> Production Verification`

The first three machine review stages bind their work to an exact PR head SHA.
Independent Verification is provided by the read-only ChatGPT Work webhook path.

Human ADOPT/REJECT remains an explicit human authority boundary. Enforcement of adoption
at branch protection / merge / deploy boundaries is not claimed by this document unless
separately implemented and evidenced.

Production Verification currently records the revision reported by the successful
GitHub Pages deployment event and probes the configured production URL for expected
application markers. It does **not** prove that the returned production bytes were built
from that SHA. Strong deployed-revision-to-served-artifact identity remains a future
hardening item.
