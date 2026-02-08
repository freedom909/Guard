
import { decideTransaction } from './domain/commands/guard/transactionGuard';
import { BusinessEvent, Role } from './cores/RbacPolicy';
import { BusinessState } from './cores/StateMachine';
import { DecideTransactionService } from './application/services/DecideTransactionService';
import { ConsoleAuditLogRepository } from './infra/audit/ConsoleAuditLogRepository';

const service = new DecideTransactionService(
  new ConsoleAuditLogRepository()
);

console.log('--- Testing INVALID_STATE ---');
service.execute({
  entityId: 'tx-bug-check',
  fromState: BusinessState.S01, // Invalid, expects S02
  toState: BusinessState.S03,
  event: BusinessEvent.CONTRACT_CONCLUDED,
  actorRole: Role.ADMIN, // Pass RBAC
}).then(res => console.log('Result:', res));
