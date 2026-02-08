// src/domain/commands/decision/DecisionResult.ts

export type DecisionResult =
  | { result: 'APPROVED' }
  | { result: 'DENIED'; reason: 'RBAC_VIOLATION' | 'INVALID_STATE' };

export type ViolationReason =
  | 'RBAC_VIOLATION'
  | 'INVALID_STATE'