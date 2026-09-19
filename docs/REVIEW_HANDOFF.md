# Review handoff contract

## Purpose

Define the handoff from deterministic CI evidence to the review stage that compares
the requested change with the implemented revision.

The handoff does not perform the review itself and does not select a particular AI
model or provider. It defines the inspection subject and the material that a review
executor must receive.

## Entry condition

A review may start only when machine-readable CI evidence exists with:

- `stage: ci`
- `verdict: PASS`
- repository and pull request number
- the full current PR `subject_head_sha`
- the successful CI run identity

Before review starts, the current PR head MUST still equal `subject_head_sha`.
If it does not, the handoff is stale and MUST stop.

## Review subject

The review subject is the exact tuple:

`repository + pr_number + full subject_head_sha`

A PR number by itself is not sufficient identity.

## Required review inputs

The review executor receives, at minimum:

1. the exact PR identity and CI evidence;
2. the PR request/body and exact diff for `subject_head_sha`;
3. the repository's applicable product, design, QA, and implementation instructions;
4. any other explicitly named source-of-truth documents required by the repository.

The review compares the natural-language requirements and constraints with the
implemented change. CI success is evidence of machine-checkable correctness; it is
not evidence that the requested product or behavior was implemented.

## Output contract

The review result MUST be bound to the same full `subject_head_sha` and use the
common `sousei.line-evidence/v1` envelope.

Until the permanent stage name is fixed, the existing machine value `semantic`
remains valid for compatibility. Human-facing wording should describe the function
plainly rather than emphasizing the execution technology.

The result is evidence for a later decision. It MUST NOT merge, deploy, or make the
human adoption decision.

## Executor independence

The handoff contract is executor-independent. A capable AI system may perform the
semantic comparison, but the line is not tied to a specific model, provider, or
product.

Deterministic identity checks and evidence transport remain machine processing.
