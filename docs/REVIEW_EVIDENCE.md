# Review evidence contract

## Purpose

Define the executor-independent contract for the review stage that consumes a `sousei.review-request/v1` request and emits machine-readable evidence bound to the exact reviewed revision.

This contract defines the review boundary. It does not select a model, provider, or hosting mechanism.

## Input

The executor MUST consume a valid `sousei.review-request/v1` request.

The reviewed subject is exactly:

- `repository`
- `pr_number`
- full `subject_head_sha`

Before issuing a verdict, the executor MUST re-read the current pull request and confirm that its current head SHA still equals `subject_head_sha`.

If the pull request is no longer open or the head SHA differs, the executor MUST stop as `STALE` and MUST NOT issue PASS or NG for the old revision.

## Review basis

The review MUST compare the requested change with the exact implementation revision using the applicable sources named by the request, including:

- pull request request/body and exact diff
- applicable product requirements
- applicable design requirements
- applicable QA requirements
- applicable implementation instructions

A successful CI result is evidence that deterministic checks passed. It is not evidence by itself that the requested product or behavior was implemented correctly.

## Verdict

The review verdict is:

- `PASS`: no material conformance problem was found in the reviewed scope.
- `NG`: one or more material conformance problems were found.
- `STALE`: the requested revision is no longer the current review subject.

For `NG`, findings MUST identify the concrete mismatch and the source requirement or constraint it conflicts with.

## Output evidence

For PASS or NG, the executor MUST emit one JSON object using schema `sousei.line-evidence/v1` with at least:

```json
{
  "schema": "sousei.line-evidence/v1",
  "repository": "owner/repository",
  "pr_number": 123,
  "subject_head_sha": "<full SHA>",
  "stage": "semantic",
  "verdict": "PASS",
  "evidence": {
    "review_request_schema": "sousei.review-request/v1",
    "findings": []
  },
  "inspector": {
    "process": "requirements-conformance-review",
    "process_version": "1"
  },
  "issued_at": "<timestamp>"
}
```

The `subject_head_sha` MUST equal the request's full `subject_head_sha`.

The evidence MAY record executor/model/provider metadata when useful for provenance, but the contract MUST NOT depend on one particular model or provider.

## Authority boundary

The review result is evidence only.

The review executor MUST NOT:

- merge the pull request
- deploy or publish
- modify the reviewed revision
- make the human adoption decision

Human adoption remains a separate decision after review evidence is available.

## Independence

This review contract is executor-independent. A capable AI executor may perform the semantic comparison.

A later independent-verification stage MUST be structurally separate from this review result and MUST NOT merely inherit its conclusion.
