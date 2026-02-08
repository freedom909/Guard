// src/application/services/DecideTransactionService.ts
import { v4 as uuid } from 'uuid';
import { ExecuteTransactionCommand } from '../../domain/commands/ExecuteTransactionCommand';
import { AuditLogRepository } from '../../ports/AuditLogRepository';
import { mapReason } from '../../infra/audit/AuditLogFactory';
import { decideTransaction } from '../../domain/commands/guard/transactionGuard';
import { TransactionDecision } from '../../domain/commands/policies/transactionDecision';

export class DecideTransactionService {
  constructor(private readonly auditLog: AuditLogRepository) {}

  async execute(command: ExecuteTransactionCommand): Promise<TransactionDecision> {
    // 1️⃣ 调用 Domain 决策逻辑
    const result: TransactionDecision = decideTransaction(command);

    // 2️⃣ 保存 AuditLog 到 MongoDB
    await this.auditLog.save({
      auditId: uuid(),
      occurredAt: new Date(),
      actor: { role: command.actorRole },
      target: { entityType: 'Transaction', entityId: command.entityId },
      action: command.event,
      decision: result.result,
      reason: result.result === 'DENIED' ? mapReason(result.reasonCode) : undefined,
      trace: {
        commandId: uuid(),
        correlationId: uuid(),
      },
    });

    // 3️⃣ 返回领域决策结果
    return result;
  }
}

