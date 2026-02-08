import { AuditLog } from '../infra/audit/AuditLog';

export interface AuditLogRepository {
  save(log: AuditLog): Promise<void>;
}
