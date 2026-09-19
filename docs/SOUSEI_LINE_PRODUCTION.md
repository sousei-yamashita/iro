# Sousei-line production contract

## Purpose

This document defines the production development line used by this repository. The line exists to move product ideas into reviewable, deployable artifacts without making the line itself the product.

## Production line

`Implementation → Pull Request → CI → Requirements Review → Independent Verification → Human ADOPT/REJECT → Merge → Deploy → Production Verification`

Every review and decision is bound to an exact full commit SHA. A pull request number alone is not sufficient identity.

## CI

CI performs deterministic checks against the exact current PR head revision. CI success is necessary evidence for later review, but is not evidence that the requested product or behavior was implemented correctly.

## Requirements Review

Requirements Review runs only after deterministic CI succeeds. It independently compares the exact PR revision with the PR request and applicable repository requirements, design, QA, and implementation material.

The current production executor is GitHub Actions using GitHub Copilot CLI. Its output is review evidence only. It MUST NOT make the human adoption decision, merge, deploy, or mutate the reviewed revision.

## Independent Verification

Independent Verification is a separate review role executed through ChatGPT Work from a GitHub PR-update webhook.

For the target PR it MUST:

- accept only an open, non-draft PR;
- obtain and fix the current full head SHA as the inspection subject;
- independently obtain the current diff and applicable source material;
- not obtain, consult, quote, or inherit the Requirements Review verdict, prior semantic evidence, prior independent verdicts, or Human ADOPT/REJECT decisions as review grounds;
- re-read the PR immediately before reporting and require open + non-draft + exact full-head-SHA identity;
- return `STALE` if that identity changes.

Operational outcomes are `PASS`, `NG`, `STALE`, `EQUIPMENT STOP`, or `UNKNOWN`.

`PASS` means only that this independent-verification stage found sufficient evidence for its reviewed scope. It is not ADOPT, merge approval, release approval, or deployment authorization.

The executor is read-only. It MUST NOT comment on GitHub, change files/commits/branches/PRs, approve/request changes, rerun CI, operate workflows, merge, release, deploy, or make Human ADOPT/REJECT decisions.

## Human ADOPT/REJECT

Human adoption is a distinct authority boundary after review evidence is available. Only the human decision determines whether the reviewed exact revision is adopted. AI review evidence never substitutes for this decision.

If the subject revision changes after review, prior review/adoption evidence does not automatically transfer to the new revision.

## Merge and deploy

Only an explicitly adopted revision may proceed to merge. Merge and deployment are not powers granted to Requirements Review or Independent Verification.

## Production Verification

After a successful production deployment, Production Verification checks the deployed production endpoint and binds the verification to the expected deployed revision. A production-verification PASS means the deployed artifact passed the configured production checks; it does not retroactively alter earlier review evidence.

## Source material

Each product repository should keep the requirements/design/QA/implementation material applicable to that product in the repository or explicitly identify its canonical source. File names are not globally mandatory; review executors must use the material that is actually applicable and available for the reviewed change.

## Equipment status

Jules remains a preserved independent-verification experiment but is not the production result-return path. Gemini CLI GitHub Action remains an experiment and is not required by the production line. The production independent-verification path is GitHub webhook → ChatGPT Work.
