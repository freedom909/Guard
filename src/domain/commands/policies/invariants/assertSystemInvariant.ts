

import { DecisionResult } from "../../decision/DecisionResult";
import { reportDeadRule } from "./reportDeadRule";

export function assertSystemInvariant(params: {
  event: string;
  from: string;
  to: string;
  roleDecisions: Array<{
    role: string;
    result: DecisionResult;
  }>;
}) {
  const { event, from, to, roleDecisions } = params;

  const allRolesDenied =
    roleDecisions.length > 0 &&
    roleDecisions.every(d => d.result.result === 'DENIED'); // 'DecisionResult' は型のみを参照しますが、ここで値として使用されています。

  if (allRolesDenied) {
    reportDeadRule(event, from, to);

    // 强烈建议：在非 prod 直接抛异常
    if (process.env.NODE_ENV !== "production") {
      throw new Error(
        `[INVARIANT VIOLATION] All roles denied for ${event} (${from} -> ${to})`
      );
    }
  }
}
