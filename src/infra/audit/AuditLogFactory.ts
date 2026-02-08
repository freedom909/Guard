
import { TransactionDecisionReasonCode } from '../../domain/commands/policies/TransactionDecisionReasonCode';
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
    reason: mapReason(input.decision.result === 'DENIED' ? input.decision.reason as TransactionDecisionReasonCode : undefined),
    trace: input.trace,
  };
}



export function mapReason(code?: TransactionDecisionReasonCode): AuditReason | undefined {
  if (!code) return undefined;
  const map: Partial<Record<TransactionDecisionReasonCode, AuditReason>> = {
    [TransactionDecisionReasonCode.APPROVED]: { domain: 'BUSINESS', code: 'APPROVED', description: '承認されました' },
    [TransactionDecisionReasonCode.RBAC_VIOLATION]: { domain: 'RBAC', code: 'AGENT_FORBIDDEN', description: '当該ロールはこの操作を実行できません' },
    [TransactionDecisionReasonCode.INVALID_STATE_TRANSITION]: { domain: 'FSM', code: 'INVALID_STATE', description: '状態遷移が無効です' },
    [TransactionDecisionReasonCode.BUSINESS_RULE_VIOLATION]: { domain: 'BUSINESS', code: 'RULE_VIOLATION', description: 'ビジネスルール違反' },
  };
  return map[code];
}

