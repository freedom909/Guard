import { v4 as uuid } from 'uuid';
import { AuditLog, AuditReason } from './AuditLog';
import { DecisionResult } from '../../domain/commands/decision/DecisionResult';

export function createAuditLog(input: {
  actorRole: any;
  entityId: string;
  action: string;
  decision: DecisionResult;
  trace: {
    commandId: string;
    correlationId: string;
  };
}): AuditLog {
  return {
    auditId: uuid(),
    occurredAt: new Date(),
    actor: {
      role: input.actorRole,
    },
    target: {
      entityType: 'Transaction',
      entityId: input.entityId,
    },
    action: input.action,
    decision: input.decision.result,
    reason: mapReason(input.decision.result === 'DENIED' ? input.decision.reason : undefined),
    trace: input.trace,
  };
}

export function mapReason(reason?: string): AuditReason | undefined {
  if (!reason) return;

  switch (reason) {
    case 'RBAC_VIOLATION':
      return {
        domain: 'RBAC',
        code: 'AGENT_FORBIDDEN',
        description: '当該ロールはこの操作を実行できません',
      };
    case 'INVALID_STATE_TRANSITION':
      return {
        domain: 'FSM',
        code: 'STATE_TRANSITION_INVALID',
        description: '業務状態遷移が許可されていません',
      };
    default:
      return {
        domain: 'BUSINESS',
        code: 'UNKNOWN',
        description: reason,
      };
  }
}
