// __tests__/DecideTransactionService.test.ts
import { DecideTransactionService } from '../src/application/services/DecideTransactionService';
import { MongoAuditLogRepository } from '../src/infra/audit/MongoAuditLogRepository';
import { ExecuteTransactionCommand } from '../src/domain/commands/ExecuteTransactionCommand';
import { MongoClient } from 'mongodb';

import { Role } from '../src/domain/Role';
import { BusinessEvent } from '../src/domain/BusinessEvent';
import { BusinessState } from '../src/cores/StateMachine';

// Mock uuid to prevent SyntaxError from ESM build in Jest
jest.mock('uuid', () => {
  let count = 0;
  return {
    v4: () => `test-uuid-val-${++count}`
  };
});

describe('DecideTransactionService', () => {
  let auditRepo: MongoAuditLogRepository;
  let service: DecideTransactionService;

  beforeAll(async () => {
    // 连接 MongoDB
    auditRepo = new MongoAuditLogRepository('mongodb://localhost:27017');
    await auditRepo.connect();
    service = new DecideTransactionService(auditRepo);
  });

  afterAll(async () => {
    // 关闭 MongoDB 连接
    await auditRepo['db']?.client?.close();
  });

  it('should approve when role is CUSTOMER and state transition is valid', async () => {
    const command: ExecuteTransactionCommand = {
      entityId: 'tx-customer-valid',
      fromState: 'S02' as BusinessState,
      toState: 'S03' as BusinessState,
      event: BusinessEvent.CONTRACT_CONCLUDED,
      actorRole: Role.CUSTOMER,
    };

    const decision = await service.execute(command);
    expect(decision.result).toBe('APPROVED');
  });

  it('should deny when role is AGENT', async () => {
    const command: ExecuteTransactionCommand = {
      entityId: 'tx-agent-invalid',
      fromState: 'S02' as BusinessState,
      toState: 'S03' as BusinessState,
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
      fromState: 'S03' as BusinessState,
      toState: 'S04' as BusinessState,
      event: BusinessEvent.CONTRACT_CONCLUDED,
      actorRole: Role.CUSTOMER,
    };

    const decision = await service.execute(command);
    expect(decision.result).toBe('DENIED');
    expect(decision.reasonCode).toBe('INVALID_STATE_TRANSITION');
  });
});
