// __tests__/executeTransaction.test.ts

jest.mock('../src/eventBus/producer', () => ({
  sendApproved: jest.fn().mockResolvedValue(undefined),
  sendDenied: jest.fn().mockResolvedValue(undefined),
}));

import { executeTransaction } from '../src/cores/Executor';
import { Role, BusinessEvent } from '../src/cores/RbacPolicy';
import { BusinessState } from '../src/cores/StateMachine';
import { ExecuteTransactionCommand } from '../src/domain/commands/ExecuteTransactionCommand';
import { MongoClient } from 'mongodb';
import { v4 as uuid } from 'uuid';

// Mock uuid to prevent SyntaxError from ESM build in Jest
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-val'
}));

const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'audit';
let client: MongoClient;

beforeAll(async () => {
  client = new MongoClient(MONGO_URI);
  await client.connect();
});

afterAll(async () => {
  await client.close();
});

beforeEach(async () => {
  // 清理 audit_logs 集合，避免重复 key
  const db = client.db(DB_NAME);
  const coll = db.collection('audit_logs');
  await coll.deleteMany({});
});

describe('Transaction Execution Skill', () => {

  const createCommand = (
    entityId: string,
    fromState: BusinessState,
    toState: BusinessState,
    actorRole: Role,
    event: BusinessEvent = BusinessEvent.CONTRACT_CONCLUDED
  ): ExecuteTransactionCommand => ({
    entityId,
    fromState,
    toState,
    event,
    actorRole,
  });

  test('APPROVED: CUSTOMER can conclude contract at S02', async () => {
    const command = createCommand('tx-001', BusinessState.S02, BusinessState.S03, Role.CUSTOMER);
    const envelope = {
      commandId: uuid(),
      correlationId: uuid(),
      payload: command,
      issuedAt: new Date().toISOString(),
    };
    const result = await executeTransaction(envelope);

    expect(result).toMatchObject({
      result: 'APPROVED',
    });
  });

  test('DENIED: AGENT cannot conclude contract', async () => {
    const command = createCommand('tx-002', BusinessState.S02, BusinessState.S03, Role.AGENT);
    const envelope = {
      commandId: uuid(),
      correlationId: uuid(),
      payload: command,
      issuedAt: new Date().toISOString(),
    };
    const result = await executeTransaction(envelope);

    expect(result).toMatchObject({
      result: 'DENIED',
    });
  });

  test('DENIED: Invalid state transition', async () => {
    const command = createCommand('tx-003', BusinessState.S01, BusinessState.S03, Role.CUSTOMER);
    const envelope = {
      commandId: uuid(),
      correlationId: uuid(),
      payload: command,
      issuedAt: new Date().toISOString(),
    };
    const result = await executeTransaction(envelope);

    expect(result).toMatchObject({
      result: 'DENIED',
    });
  });

});
