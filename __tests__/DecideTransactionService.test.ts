import { DecideTransactionService } from '../src/application/services/DecideTransactionService';
import { InMemoryAuditLogRepository } from '../__testutils__/InMemoryAuditLogRepository';
import { ExecuteTransactionCommand } from '../src/domain/commands/ExecuteTransactionCommand';

import { Role } from '../src/domain/Role';
import { BusinessEvent } from '../src/domain/BusinessEvent';
import { BusinessState } from '../src/cores/StateMachine';

// Mock uuid（保留是 OK 的）
jest.mock('uuid', () => {
  let count = 0;
  return {
    v4: () => `test-uuid-val-${++count}`,
  };
});

describe('DecideTransactionService (unit)', () => {
  let auditRepo: InMemoryAuditLogRepository;
  let service: DecideTransactionService;

  beforeEach(() => {
    auditRepo = new InMemoryAuditLogRepository();
    service = new DecideTransactionService(auditRepo);
  });

  it('should approve when role is CUSTOMER and state transition is valid', async () => {
    const command: ExecuteTransactionCommand = {
      entityId: 'tx-customer-valid',
      fromState: BusinessState.S02,
      toState: BusinessState.S03,
      event: BusinessEvent.CONTRACT_CONCLUDED,
      actorRole: Role.CUSTOMER,
    };

    const decision = await service.execute(command);

    expect(decision.result).toBe('APPROVED');
    expect(auditRepo.getAll().length).toBe(1);
  });

  it('should deny when role is AGENT', async () => {
    const command: ExecuteTransactionCommand = {
      entityId: 'tx-agent-invalid',
      fromState: BusinessState.S02,
      toState: BusinessState.S03,
      event: BusinessEvent.CONTRACT_CONCLUDED,
      actorRole: Role.AGENT,
    };

    const decision = await service.execute(command);

    expect(decision.result).toBe('DENIED');
    expect(decision.reasonCode).toBe('RBAC_VIOLATION');
  });

  it('should deny on invalid state transition', async () => {
    const command: ExecuteTransactionCommand = {
      entityId: 'tx-customer-invalid-state',
      fromState: BusinessState.S03,
      toState: BusinessState.S04,
      event: BusinessEvent.CONTRACT_CONCLUDED,
      actorRole: Role.CUSTOMER,
    };

    const decision = await service.execute(command);

    expect(decision.result).toBe('DENIED');
    expect(decision.reasonCode).toBe('INVALID_STATE_TRANSITION');
  });
});
