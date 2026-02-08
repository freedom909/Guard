// src/index.ts
import { decideTransaction } from './domain/commands/guard/transactionGuard';
import { BusinessEvent, Role } from './cores/RbacPolicy';
import { BusinessState } from './cores/StateMachine';
import { DecideTransactionService } from './application/services/DecideTransactionService';
import { ConsoleAuditLogRepository } from './infra/audit/ConsoleAuditLogRepository';
import { MongoAuditLogRepository } from './infra/audit/MongoAuditLogRepository';
import { ExecuteTransactionCommand } from './domain/commands/ExecuteTransactionCommand';


async function main() {
  // 1️⃣ 初始化 MongoDB 审计仓库
  const auditRepo = new MongoAuditLogRepository('mongodb://localhost:27017');
  await auditRepo.connect();

  // 2️⃣ 初始化业务服务
  const service = new DecideTransactionService(auditRepo);

  // 3️⃣ 定义角色、事件、状态组合
  const roles = ['AGENT', 'ADMIN', 'MANAGER'] as const;
  const events = ['CONTRACT_CONCLUDED', 'CONTRACT_CANCELLED'] as const;
  const states = [
    { from: 'S02', to: 'S03' },
    { from: 'S03', to: 'S04' },
  ];

  // 4️⃣ 遍历所有组合生成命令并执行
  for (const role of roles) {
    for (const event of events) {
      for (const s of states) {
        const command: ExecuteTransactionCommand = {
          entityId: `tx-${role}-${event}-${s.from}-${s.to}`,
          fromState: s.from as BusinessState,
          toState: s.to as BusinessState,
          event: event as BusinessEvent,
          actorRole: role as Role,
        };

        try {
          const decision = await service.execute(command);
          console.log(`[Decision] ${command.entityId} ->`, decision);
        } catch (err) {
          console.error(`[Error] ${command.entityId} ->`, err);
        }
      }
    }
  }

  console.log('All test commands executed.');
}

main().catch(console.error);

