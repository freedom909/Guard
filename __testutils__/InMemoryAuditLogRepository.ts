import { AuditLog } from '../src/infra/audit/AuditLog';
import { AuditLogRepository } from '../src/ports/AuditLogRepository';

export class InMemoryAuditLogRepository implements AuditLogRepository {
  private logs: AuditLog[] = [];

  async save(log: AuditLog): Promise<void> {
    this.logs.push(log);
  }

  getAll() {
    return this.logs;
  }

  clear() {
    this.logs = [];
  }
}
