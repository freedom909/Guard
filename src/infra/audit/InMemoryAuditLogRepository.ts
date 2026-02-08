import { AuditLog } from './AuditLog';
import { AuditLogRepository } from '../../ports/AuditLogRepository';
export class InMemoryAuditLogRepository implements AuditLogRepository {
  private logs: AuditLog[] = [];

  async save(log: AuditLog) {
    this.logs.push(log);
  }

  findAll() {
    return this.logs;
  }
}
