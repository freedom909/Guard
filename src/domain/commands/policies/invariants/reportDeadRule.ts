// src/domain/commands/policies/invariants/reportDeadRule.ts
export function reportDeadRule(event: string, from: string, to: string) {
  console.warn(
    `[DEAD RULE] All roles denied for ${event} (${from} -> ${to})`
  );
}