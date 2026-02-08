//skills/skill-definition.md
✅ Enterprise Skill Definition
transaction_execution_skill.v1

Purpose
Deterministically validate and execute a business event using
RBAC × Explicit State Machine, with Default Deny semantics.

1️⃣ Skill Metadata
skill:
  name: transaction_execution
  version: 1.0.0
  domain: RealEstateTransactionSystem
  type: deterministic_executor
  guarantees:
    - deterministic
    - auditable
    - reproducible
    - default_deny

2️⃣ Authoritative Sources (Immutable)
source_of_truth:
  - real-estate-core/.docs/prompts/Architect.md
  - real-estate-core/.docs/prompts/状態遷移表.md
  - real-estate-core/.docs/prompts/合规RBAC执行矩阵.md

system_rules:
  - ERP is source_of_truth_for_facts_only
  - ERP is NOT a decision authority

3️⃣ Enumerations (Closed Sets)
enums:

  Role:
    - ADMIN
    - AGENT
    - OWNER
    - CUSTOMER
    - PENDING_AGENT

  BusinessState:
    - S01
    - S02
    - S03
    - S04
    - S05

  BusinessEvent:
    - APPLICATION_ACCEPTED
    - CONTRACT_CONCLUDED
    - PAYMENT_COMPLETED
    - TRANSACTION_COMPLETED

  DecisionResult:
    - APPROVED
    - DENIED

  ViolationReason:
    - INVALID_ROLE
    - RBAC_VIOLATION
    - INVALID_STATE_TRANSITION

4️⃣ RBAC Policy (Executable Matrix)

Rule:
If a role–event pair is not explicitly defined → DENY

rbac_policy:

  APPLICATION_ACCEPTED:
    CUSTOMER: ALLOW

  CONTRACT_CONCLUDED:
    OWNER: ALLOW
    CUSTOMER: ALLOW

  PAYMENT_COMPLETED:
    OWNER: ALLOW

  TRANSACTION_COMPLETED:
    OWNER: ALLOW
    CUSTOMER: ALLOW

5️⃣ State Machine (Explicit Only)

Rule:
Transitions not listed here are forbidden.

state_machine:

  S01:
    APPLICATION_ACCEPTED: S02

  S02:
    CONTRACT_CONCLUDED: S03

  S03:
    PAYMENT_COMPLETED: S04

  S04:
    TRANSACTION_COMPLETED: S05

6️⃣ Input Contract (Strict)
input:

  entity_id: string (required)

  current_state: BusinessState (required)

  requested_event: BusinessEvent (required)

  actor:
    user_id: string (required)
    role: Role (required)

7️⃣ Execution Rules (MUST FOLLOW ORDER)
execution_flow:

  - step: validate_role
    rule: actor.role MUST exist in Role enum
    on_fail: INVALID_ROLE

  - step: validate_rbac
    rule: rbac_policy[event][role] MUST be ALLOW
    default: DENY
    on_fail: RBAC_VIOLATION

  - step: validate_state_transition
    rule: state_machine[current_state][event] MUST exist
    on_fail: INVALID_STATE_TRANSITION

  - step: produce_result

8️⃣ Output Contract (Closed)
✅ Approved
output_success:
  result: APPROVED
  entity_id: string
  from_state: BusinessState
  to_state: BusinessState
  event: BusinessEvent
  actor_role: Role
  audit: "RBAC + State Transition validated"

❌ Denied
output_failure:
  result: DENIED
  reason: ViolationReason
  actor_role: Role
  event: BusinessEvent

9️⃣ Hard Prohibitions (Non-Negotiable)
forbidden:
  - infer_missing_permissions
  - invent_state_transitions
  - assume_role_equivalence
  - explain_business_meaning
  - suggest_next_actions
  - modify_rules
  - override_source_of_truth

🔒 Determinism Clause (Very Important)
determinism:
  - same_input => same_output
  - no_context_memory
  - no_language_interpretation
  - no_probabilistic_behavior