import { decideTransaction } from './domain/commands/guard/transactionGuard';
import { BusinessEvent, Role } from './cores/RbacPolicy';
import { BusinessState } from './cores/StateMachine';
import { DecideTransactionService } from './application/services/DecideTransactionService';
import { ConsoleAuditLogRepository } from './infra/audit/ConsoleAuditLogRepository';
import { MongoAuditLogRepository } from './infra/audit/MongoAuditLogRepository';
import { ExecuteTransactionCommand } from './domain/commands/ExecuteTransactionCommand';


async function main() {
  const auditRepo = new MongoAuditLogRepository('mongodb://localhost:27017');
  await auditRepo.connect();

  const service = new DecideTransactionService(auditRepo);

  const command: ExecuteTransactionCommand = {
    entityId: 'tx-456',
    fromState: 'S02' as BusinessState,
    toState: 'S03' as BusinessState,
    event: 'CONTRACT_CONCLUDED' as BusinessEvent,
    actorRole: 'AGENT' as Role,
  };

  const decision = await service.execute(command);
  console.log('Decision:', decision);
}

main().catch(console.error);
