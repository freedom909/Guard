import { Role } from '../../cores/RbacPolicy';

export type AuditDecision = 'APPROVED' | 'DENIED';

export interface AuditReason {
  domain: 'RBAC' | 'FSM' | 'BUSINESS';
  code: string;
  description: string;
}

export interface AuditActor {
  role: Role;
  userId?: string;
}

export interface AuditTarget {
  entityType: string;
  entityId: string;
}

export interface AuditTrace {
  commandId: string;
  correlationId: string;
}

export interface AuditLog {
  auditId: string;
  occurredAt: Date;
  actor: AuditActor;
  target: AuditTarget;
  action: string;
  decision: AuditDecision;
  reason?: AuditReason;
  trace: AuditTrace;
}
