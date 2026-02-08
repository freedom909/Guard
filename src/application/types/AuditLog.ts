// src/application/types/AuditLog.ts
export interface AuditLog {
  auditId: string;
  occurredAt: Date;
  actor: { role: string };
  target: { entityType: string; entityId: string };
  action: string;
  decision: string;
  reason?: { domain: string; code: string; description: string };
  trace: { commandId: string; correlationId: string };
}
