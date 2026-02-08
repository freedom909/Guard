import { createAuditLog } from './AuditLogFactory';
import { AuditLogRepository } from '../../ports/AuditLogRepository';

export class AuditLogConsumer {
  constructor(private repo: AuditLogRepository) {}

  async consume(event: any) {
    const log = createAuditLog({
      actorRole: event.actorRole,
      entityId: event.entityId,
      action: event.event,
      decision: event.decision,
      trace: event.trace,
    });

    await this.repo.save(log);
  }
}
