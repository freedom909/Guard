// src/infra/audit/ConsoleAuditLogRepository.ts
import { AuditLogRepository } from '../../ports/AuditLogRepository';
import { AuditLog } from './AuditLog';

export class ConsoleAuditLogRepository implements AuditLogRepository {
  record(log: AuditLog) {
    console.log(log);
  }
 async save(log: AuditLog) {
    console.log(log);
  }

}