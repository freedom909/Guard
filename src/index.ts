import { decideTransaction } from './domain/commands/guard/transactionGuard';
import { BusinessEvent, Role } from './cores/RbacPolicy';
import { BusinessState } from './cores/StateMachine';
import { DecideTransactionService } from './application/services/DecideTransactionService';
import { ConsoleAuditLogRepository } from './infra/audit/ConsoleAuditLogRepository';

const service = new DecideTransactionService(
  new ConsoleAuditLogRepository()
);

const decision = service.execute({
  entityId: 'tx-456',
  fromState: BusinessState.S02,
  toState: BusinessState.S03,
  event: BusinessEvent.CONTRACT_CONCLUDED,
  actorRole: Role.AGENT,
});

console.log(decision);
const approved = decideTransaction({
  entityId: 'tx-789',
  fromState: BusinessState.S02,
  toState: BusinessState.S03,
  event: BusinessEvent.CONTRACT_CONCLUDED,
  actorRole: Role.ADMIN, // or ADMIN
});

console.log(approved);
